function findNewFiles() {
  //「変換前フォルダにあって、変換後フォルダにない」ファイルを返す関数
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  //変換前のフォルダID
  var beforeFolderID = sheet.getRange(7, 1).getValue();
  var beforeFolder = DriveApp.getFolderById(beforeFolderID);
  var beforeFiles = beforeFolder.getFiles();

  //変換後のフォルダID
  var afterFolderID = sheet.getRange(9, 1).getValue();
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

  console.log(newFileNames);

  // const param = [];

  console.log(newFileNames.length);

  if (newFileNames.length == 1) {
    var param = 'title = "' + newFileNames[0] + '"';
  } else if (newFileNames.length > 1) {
    var param = 'title = "' + newFileNames[0] + '"';

    for (let i = 1; i < newFileNames.length; i++) {
      param = param.concat('or title = "' + newFileNames[i] + '"');
    }
  } else {
    return null;
  }

  // console.log(param);

  const newFiles = beforeFolder.searchFiles(param);

  // while(newFiles.hasNext()){

  //   const file = newFiles.next();
  //   console.log(file.getName());

  // }

  return newFiles;

  // }
}
