function convertNewFiles(newFiles, param) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const saName = sheet.getRange('B1').getValue();
  const sheet_master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    saName + 'マスタ'
  );

  console.log('saName:' + saName);
  console.log(sheet_master.getName());

  var masterValues = sheet_master
    .getRange(2, 1, sheet_master.getLastRow() - 1, 6)
    .getDisplayValues();
  // console.log(masterValues[0][2]);

  console.log(param);

  var files = newFiles;

  if (files == null) {
    Browser.msgBox('未変換ファイルが見つかりませんでした');
    return null;
  }

  var afterFolderID = sheet.getRange(9, 1).getValue();
  console.log('afterfolderID:' + afterFolderID);
  var afterFolder = DriveApp.getFolderById(afterFolderID);

  //各ファイルに対して繰り返し処理
  while (files.hasNext()) {
    //ファイルを取得
    var file = files.next();
    var name = file.getName();

    var csv = file.getBlob().getDataAsString('Shift_JIS');
    var values_org = Utilities.parseCsv(csv);

    //  console.log(values_org.length);

    values_org.shift();

    var values = values_org.filter((row) => row[0] !== '' && row[1] !== '');

    // console.log(values.length);

    for (let i = 0; i < values.length; i++) {
      values[i].splice(2, 1);
      values[i].splice(9, 2);
      values[i].splice(14, 2);
      values[i].splice(15);

      var year = values[i][14].slice(0, 4);
      // console.log(year);
      var month = values[i][14].slice(4, 6) - 1;
      // console.log(month);
      var day = values[i][14].slice(6);
      // console.log(day);

      var date = new Date(year, month, day);
      var datevalue = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd');
      // console.log(datevalue)

      values[i][14] = datevalue;

      var masterRow = masterValues.filter(
        (item) => item[2] == Number(values[i][0])
      );

      if (masterRow == '') {
        var supplier = '不明';
      } else {
        var supplierValue = masterRow[0][5];

        if (supplierValue == '') {
          var supplier = '不明';
        } else {
          var supplier = supplierValue
            .replace(/－/g, 'ー')
            .replace(/−/g, 'ー')
            .replace(/ /g, '　');
        }
      }

      values[i][15] = supplier;
    }

    var col_name = [
      [
        'JAN',
        'Name',
        'Category01_Name',
        'Category02_Code',
        'Category02_Name',
        'Category03_Code',
        'Category03_Name',
        'Maker_Code',
        'Maker_Name',
        'Sales_inTax',
        'Sales_exTax',
        'Quantity',
        'Profit_exTax',
        'Profit_Rate',
        'Date',
        'Supplier',
      ],
    ];

    values.unshift(col_name);

    let fileName = name;
    let contentType = 'text/csv';
    let charSet = 'utf-8';
    let lineDelimiter = ',';
    let newLineChar = '\r\n';
    let _ = Underscore.load();

    // 2次元配列になっているデータをcsvのstringに変換
    let csvString = _.map(values, function (row) {
      return row.join(lineDelimiter);
    }).join(newLineChar);

    let blob = Utilities.newBlob('', contentType, fileName).setDataFromString(
      csvString,
      charSet
    );

    // Blobをファイルに出力
    afterFolder.createFile(blob);
  }

  Utilities.sleep(10000);

  //スプレッドシートのリストを更新
  listFiles();

  var date = new Date();
  date = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
  sheet.getRange('K2').setValue(date);

  const newFiles_converted = afterFolder.searchFiles(param);

  storeFilesIntoGCS(newFiles_converted);
}
