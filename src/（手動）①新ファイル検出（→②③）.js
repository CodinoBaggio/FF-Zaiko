function transferNewFiles() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const sheetName = sheet.getName();
  console.log(sheetName);

  const selYear = sheet.getRange('B3').getDisplayValue();
  console.log(selYear);

  var answer = Browser.msgBox(
    sheetName +
      '（' +
      selYear +
      '年）の未変換ファイルを\\nGoogle Cloud Storageに転送しますか？',
    Browser.Buttons.YES_NO
  );

  if (answer == 'yes') {
    //変換前のフォルダID
    var beforeFolderID = sheet.getRange(7, 1).getValue();

    if (beforeFolderID == '') {
      Browser.msgBox('変換前フォルダが見つかりませんでした');
      return null;
    }

    var beforeFolder = DriveApp.getFolderById(beforeFolderID);
    var beforeFiles = beforeFolder.getFiles();

    //変換後のフォルダID
    var afterFolderID = sheet.getRange(9, 1).getValue();

    if (afterFolderID == '') {
      Browser.msgBox('変換後フォルダが見つかりませんでした');
      return null;
    }

    var afterFolder = DriveApp.getFolderById(afterFolderID);
    var afterFiles = afterFolder.getFiles();

    var beforeFileNames = [];

    while (beforeFiles.hasNext()) {
      // ファイル名を確認

      var beforeFile = beforeFiles.next();
      var beforeFileName = String(beforeFile.getName());

      beforeFileNames.push(beforeFileName);
    }

    var afterFileNames = [];

    while (afterFiles.hasNext()) {
      // ファイル名を確認

      var afterFile = afterFiles.next();
      var afterFileName = String(afterFile.getName());

      afterFileNames.push(afterFileName);
    }

    // console.log(beforeFileNames);
    // console.log(afterFileNames);

    var newFileNames = beforeFileNames.filter(
      (i) => afterFileNames.indexOf(i) == -1
    );

    console.log('newFileNames:' + newFileNames);

    // const param = [];

    console.log('newFileNames.length:' + newFileNames.length);

    if (newFileNames.length == 1) {
      var param = 'title = "' + newFileNames[0] + '"';
    } else if (newFileNames.length > 1) {
      var param = 'title = "' + newFileNames[0] + '"';

      for (let i = 1; i < newFileNames.length; i++) {
        param = param.concat('or title = "' + newFileNames[i] + '"');
      }
    } else {
      Browser.msgBox('未変換ファイルが見つかりませんでした');
      return null;
    }

    // console.log(param);

    const newFiles = beforeFolder.searchFiles(param);

    convertNewFiles(newFiles, param);
  }
}
