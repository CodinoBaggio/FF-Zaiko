function transferToGCS_yamada() {

  var ss = SpreadsheetApp.openById("1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk");
  var sheet = ss.getSheetByName("フォルダIDリスト");

  var scriptProp = PropertiesService.getScriptProperties();
  var PRIVATE_KEY = scriptProp.getProperty("key").replace(/\\n/g, '\n');;
  var SERVICE_ACCOUNT_EMAIL = scriptProp.getProperty("email");

  var tokens = getStorageService(PRIVATE_KEY, SERVICE_ACCOUNT_EMAIL);
  var token = tokens[SERVICE_ACCOUNT_EMAIL].token;

  //ディレクトリやファイルのパス
  var dirID = sheet.getRange('J18').getValue();
  // var dirID = "18wRwF4MGTagYify1boiees55-Kuk3C-A";//GCS用データ>山田SA>2019変換済
  var dir = DriveApp.getFolderById(dirID); 
  var files =  dir.getFiles();

  var bucketName = "ff-data-analytics";


  while(files.hasNext()){
    
    var file = files.next();
    var content = file.getBlob();
    
    var filename = file.getName();
    
    var filePath = "/yamada/" + filename;

    var url='https://storage.googleapis.com/'+ bucketName + filePath;

    UrlFetchApp.fetch(url,{
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "PUT",
      contentType: "application/javascript;charset=utf-8",
      host: bucketName + ".storage.googleapis.com",
      payload: content,
      muteHttpExceptions: true
    });
  }
    return true;  
  }
