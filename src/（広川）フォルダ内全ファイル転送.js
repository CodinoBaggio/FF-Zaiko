function transferToGCS_hirokawa() {
  var ss = SpreadsheetApp.openById(
    '1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk'
  );
  var sheet = ss.getSheetByName('フォルダIDリスト');

  var scriptProp = PropertiesService.getScriptProperties();
  var PRIVATE_KEY = scriptProp.getProperty('key').replace(/\\n/g, '\n');
  var SERVICE_ACCOUNT_EMAIL = scriptProp.getProperty('email');

  var tokens = getStorageService(PRIVATE_KEY, SERVICE_ACCOUNT_EMAIL);
  var token = tokens[SERVICE_ACCOUNT_EMAIL].token;

  //ディレクトリやファイルのパス
  var dirID = sheet.getRange('G18').getValue();
  // var dirID = "1KsXCrNvk7rXWugmTE_LjLaEgVdkLv_mu";//GCS用データ>広川SA>2023変換済
  var dir = DriveApp.getFolderById(dirID);
  var files = dir.getFiles();

  var bucketName = 'ff-data-analytics';

  while (files.hasNext()) {
    var file = files.next();
    var content = file.getBlob();

    var filename = file.getName();

    var filePath = '/hirokawa/' + filename;

    var url = 'https://storage.googleapis.com/' + bucketName + filePath;

    UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      contentType: 'application/javascript;charset=utf-8',
      host: bucketName + '.storage.googleapis.com',
      payload: content,
      muteHttpExceptions: true,
    });
  }
  return true;
}
