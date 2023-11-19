function listFiles(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  console.log(sheet.getName());

  //変換前のフォルダID
  var beforeFolderID = sheet.getRange(7,1).getValue();
  
  if(beforeFolderID == "" || beforeFolderID == "-"){

    Browser.msgBox("変換前フォルダが見つかりませんでした");
    return null;
  }

  var beforeFolder = DriveApp.getFolderById(beforeFolderID);
  var beforeFiles = beforeFolder.getFiles();

  //変換後のフォルダID 
  var afterFolderID = sheet.getRange(9,1).getValue();
  
  if(afterFolderID == "" || afterFolderID == "-"){

    Browser.msgBox("変換後フォルダが見つかりませんでした");
    return null;

  }
  
  var afterFolder = DriveApp.getFolderById(afterFolderID);
  var afterFiles = afterFolder.getFiles();

  var beforeFileNames = [];

  while (beforeFiles.hasNext()) {
      // ファイル名を確認

      var beforeFile = beforeFiles.next();
      var beforeFileName = String(beforeFile.getName());
      
      beforeFileNames.push([beforeFileName]);   
  }

  beforeFileNames.sort(); 

  var afterFileNames = [];

  while (afterFiles.hasNext()) {
      // ファイル名を確認

      var afterFile = afterFiles.next();
      var afterFileName = String(afterFile.getName());
      
      afterFileNames.push([afterFileName]);   
  }

  afterFileNames.sort();

  console.log('変換前ファイル数：'+ beforeFileNames.length)
  console.log('変換前ファイル名：'+ beforeFileNames);

  console.log('変換後ファイル数：'+ afterFileNames.length)
  console.log('変換後ファイル名：'+ afterFileNames);

  var newFileNameList = beforeFileNames.flat().filter(i => afterFileNames.flat().indexOf(i) == -1);

  var newFileNames = [];

  newFileNameList.forEach(value => newFileNames.push([value]));

  newFileNames.sort();

// 　var newFileNames = [];

  // for(i=0 ; i < beforeFileNames.length ; i++){
    
  //   var newFileName = beforeFileNames.filter(function(value){
      
  //     return value[0] = afterFileName.flat().indexOf(i) 
    
  //   })
  
    // newFileNames.push(newFileName); 
  

  console.log('新ファイル名：'+newFileNames);

  
  sheet.getRange(2,4,sheet.getLastRow(),1).clearContent();
  sheet.getRange(2,6,sheet.getLastRow(),1).clearContent();
  sheet.getRange(2,8,sheet.getLastRow(),1).clearContent();


  if(beforeFileNames.length > 0){

  
  sheet.getRange(2,4, beforeFileNames.length, 1).setValues(beforeFileNames);
  
  }

  if(afterFileNames.length > 0){

  sheet.getRange(2,6, afterFileNames.length, 1).setValues(afterFileNames);
  
  }

  if(newFileNames.length > 0){

  sheet.getRange(2,8, newFileNames.length, 1).setValues(newFileNames);

  }else if(newFileNames.length == 0){

  sheet.getRange(2,8,1,1).setValue(["なし"]);

  }
  return true;
}