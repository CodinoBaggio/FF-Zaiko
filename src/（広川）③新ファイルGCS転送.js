function storeFilesIntoGCS_hirokawa(files) {
  var scriptProp = PropertiesService.getScriptProperties();
  var PRIVATE_KEY = scriptProp.getProperty('key').replace(/\\n/g, '\n');
  var SERVICE_ACCOUNT_EMAIL = scriptProp.getProperty('email');

  //ディレクトリやファイルのパス
  var bucketName = 'ff-data-analytics';

  while (files.hasNext()) {
    var file = files.next();
    var content = file.getBlob();

    var filename = file.getName();

    console.log('filename:' + filename);
    var filePath = '/hirokawa/' + filename;

    var tokens = getStorageService(PRIVATE_KEY, SERVICE_ACCOUNT_EMAIL);
    var token = tokens[SERVICE_ACCOUNT_EMAIL].token;

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

    // fileNames.push(filename);
  }
}

// console.log("fileNames2:" + fileNames);

// var newFileNames_stored = [];

// for(i=0;i<fileNames.length;i++){

//   newFileNames_stored[i]=[fileNames[i]];

// }

// sheet.getRange(2,13,newFileNames_stored.length, 1).setValues(newFileNames_stored);

// }
