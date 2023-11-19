function convertText() {

  let str ="株式会社 ビ−レイク";
  let replacedStr = str.replace(/−/g, "ー").replace(/ /g, "　");
  console.log(replacedStr);
}
