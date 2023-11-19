function sheetsToCsv() {
  // const sheetId = "1WkXY4H8huJ89iKQVgP-BesSR4rBGvybvg53nYmHnq7w" //変換したいスプレッドシートのID

  const folderId = '1SIqZv59ul7JvVTByVqZsbIv0DE0MtC9-'; //変換後ファイルを格納するフォルダ

  const ss = SpreadsheetApp.openById(
    '1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk'
  );
  const sheet_ID = ss.getSheetByName('ファイルID');
  const fileIDs = sheet_ID.getRange(1, 2, sheet_ID.getLastRow(), 1).getValues();

  // console.log(fileIDs);
  // console.log(fileIDs.length);

  for (i = 0; i < fileIDs.length; i++) {
    var fileId = fileIDs[i];

    const sheet = SpreadsheetApp.openById(fileId).getSheets()[0];
    console.log(sheet.getName());

    // var sheet_test = SpreadsheetApp.openById("1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk").getSheetByName("test");

    const sheet_master = SpreadsheetApp.openById(
      '1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk'
    ).getSheetByName('新旧金立上');

    var masterValues = sheet_master
      .getRange(2, 1, sheet_master.getLastRow() - 1, 6)
      .getDisplayValues();
    // console.log(masterValues[0][2]);

    var lastRow = sheet.getLastRow();
    // var lastColumn = sheet.getLastColumn();

    console.log('lastRow:' + lastRow);
    // console.log("lastColumn:" + lastColumn);

    sheet.insertColumnAfter(16);
    SpreadsheetApp.flush();
    sheet.getRange(1, 17).setValue('=UNIQUE(A:A)');
    SpreadsheetApp.flush();
    sheet.getRange(2, 14, lastRow - 1, 3).setNumberFormat('###0');
    sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat('yyyy-MM-dd');
    sheet.getRange(2, 17, lastRow - 1, 1).setNumberFormat('yyyy-MM-dd');
    SpreadsheetApp.flush();

    var monthValues = sheet.getRange(2, 1, lastRow - 1, 16).getDisplayValues();

    var lastRow_dateValues = sheet
      .getRange(2, 17)
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow();

    console.log(lastRow_dateValues);

    var dateValues = sheet
      .getRange(2, 17, lastRow_dateValues - 1, 1)
      .getDisplayValues();

    console.log(dateValues);

    for (j = 0; j < dateValues.length; j++) {
      const date = dateValues[j][0];
      console.log(date);

      var values = monthValues.filter((elm) => elm[0] == date);

      // console.log("順番入替前" + values);

      values = values.map((elm) => [
        elm[1],
        elm[2],
        elm[4],
        elm[5],
        elm[6],
        elm[7],
        elm[8],
        elm[9],
        elm[10],
        '',
        elm[14],
        elm[15],
        '',
        '',
        elm[0],
        '',
      ]);

      console.log('順番入替後' + values);

      console.log('空白行削除前:' + values.length);

      values = values.filter((row) => row[0] !== '' && row[1] !== '');

      console.log('空白行削除後:' + values.length);

      for (let i = 0; i < values.length; i++) {
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

      var name = date.replace(/-/g, '');
      console.log('name:' + name);

      let fileName = name + '.csv';
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

      var folder = DriveApp.getFolderById(folderId);
      // Blobをファイルに出力
      folder.createFile(blob);
    }
  }
}
