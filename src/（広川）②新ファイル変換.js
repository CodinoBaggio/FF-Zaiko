function convertNewFiles_hirokawa(newFiles, param){

  var ss = SpreadsheetApp.openById("1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk");
  var sheet = ss.getSheetByName("フォルダIDリスト");

  const SHEEET_master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("広川SAマスタ");

  var masterValues = SHEEET_master.getRange(2,1,SHEEET_master.getLastRow()-1, 6).getDisplayValues();
  console.log(masterValues[0][2]);
 
  console.log(param)

  var files = newFiles;

    if(files == null){

      console.log("未変換ファイルが見つかりませんでした");
      return null;

    }

  var afterFolderID = sheet.getRange("G18").getValue();
  console.log("afterfolderID:" + afterFolderID);

  var afterFolder = DriveApp.getFolderById(afterFolderID);
    
    //各ファイルに対して繰り返し処理
  while(files.hasNext()){
      
      //ファイルを取得
      var file = files.next();
      var name = file.getName();

      var csv = file.getBlob().getDataAsString("Shift_JIS");
      var values_org = Utilities.parseCsv(csv);
      
      //  console.log(values_org.length);

      values_org.shift();

      var values = values_org.filter(row => row[0] !== "" && row[1] !== "");
      // console.log(values.length);

       for(let i = 0 ; i < values.length ; i++){
        values[i].splice(2,1);
        values[i].splice(9,2);
        values[i].splice(14,2);
        values[i].splice(15);
  
        var year = values[i][14].slice(0,4);
        // console.log(year);
        var month = values[i][14].slice(4,6)-1;
        // console.log(month);
        var day = values[i][14].slice(6);
        // console.log(day);

        var date = new Date(year,month,day);
        var datevalue = Utilities.formatDate(date, 'JST', "yyyy-MM-dd");
        // console.log(datevalue)

        values[i][14] = datevalue;

        var masterRow = masterValues.filter(item => item[2] == Number(values[i][0]));
        
        if(masterRow == ""){

          var supplier = "不明";
        
        }else{

          var supplierValue = masterRow[0][5];
          
          if(supplierValue == ""){

            var supplier = "不明";
        
          }else{
            
            var supplier =  supplierValue.replace(/－/g, "ー").replace(/−/g, "ー").replace(/ /g, "　");
          
          }

        }
      
        values[i][15] = supplier; 
        
    }
    
        // console.log(values[0][14]);

        var col_name = 	[ [ 'JAN',
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
            'Supplier'] ];

        values.unshift(col_name);

        let fileName = name;
        let contentType = "text/csv";
        let charSet = "utf-8";
        let lineDelimiter = ",";
        let newLineChar = "\r\n";
        let _ = Underscore.load();
    

      // 2次元配列になっているデータをcsvのstringに変換
      let csvString = _.map(
        values,
        function(row){return row.join(lineDelimiter);}
      ).join(newLineChar);

    
      let blob = Utilities.newBlob("", contentType, fileName).setDataFromString(csvString, charSet);

      // Blobをファイルに出力
      afterFolder.createFile(blob);
  }

    Utilities.sleep(10000);
    
    const newFiles_converted = afterFolder.searchFiles(param);

    storeFilesIntoGCS_hirokawa(newFiles_converted);
}