function transferNewFiles_yamada() {
  //「変換前フォルダにあって、変換後フォルダにない」ファイルを返す関数

  var ss = SpreadsheetApp.openById(
    '1muSaplToXU0_60Bm1fye49vRzQbAOcC9fxSog29qNqk'
  );
  var sheet = ss.getSheetByName('フォルダIDリスト');

  const thisYear = sheet.getRange('L2').getDisplayValue();
  console.log(thisYear);

  //変換前のフォルダID
  var beforeFolderID = sheet.getRange('E18').getValue();
  var beforeFolder = DriveApp.getFolderById(beforeFolderID);
  var beforeFiles = beforeFolder.getFiles();

  //変換後のフォルダID
  var afterFolderID = sheet.getRange('J18').getValue();
  var afterFolder = DriveApp.getFolderById(afterFolderID);
  var afterFiles = afterFolder.getFiles();

  console.log('beforeFolderID:' + beforeFolderID);
  console.log('afterFolderID:' + afterFolderID);

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
  console.log('newFileNames.length:' + newFileNames.length);

  if (newFileNames.length == 1) {
    var param = 'title = "' + newFileNames[0] + '"';
  } else if (newFileNames.length > 1) {
    var param = 'title = "' + newFileNames[0] + '"';

    for (let i = 1; i < newFileNames.length; i++) {
      param = param.concat('or title = "' + newFileNames[i] + '"');
    }
  } else {
    console.log('未変換ファイルが見つかりませんでした');
    return null;
  }

  // console.log(param);

  const newFiles = beforeFolder.searchFiles(param);

  convertNewFiles_yamada(newFiles, param);
}
