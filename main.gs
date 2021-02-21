var mirAPI = "https://graph.mirror.finance/graphql";
var bottoken = "1597133886:AAEXXzz0PZ8KKYDMGKZRDk2jnNY0w1HALX0";
var tgurl = "https://api.telegram.org/bot" + bottoken;
var webAppUrl = "https://script.google.com/macros/s/AKfycbxindpiuGdbfeYGuMj9gilpVnELGv7yZYKuasIvODsiQWGXIvx5ynW6/exec";
var cache = CacheService.getScriptCache(); 
var sheetId = "1JTVWrANeXP3OVBmjlWXqXmWpegpW7uOHvFoft7RN-V0";
var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
var drive7dcharts = DriveApp.getFoldersByName('7dcharts').next();
var drive1dcharts = DriveApp.getFoldersByName('1dcharts').next();
var drive7dcharts = DriveApp.getFoldersByName('7dLPcharts').next();
var drive1dcharts = DriveApp.getFoldersByName('1dLPcharts').next();
var drive7dstatcharts = DriveApp.getFoldersByName('7dSTATcharts').next();
var drive1dstatcharts = DriveApp.getFoldersByName('1dSTATcharts').next();
var thismoment = new Date();
var oneday = 24*3600*1000;
var sevendays = 7*24*3600*1000;
var fifteenminutes = 15*60*1000;
var fourhours = 4*60*60*1000;
var threemonths = oneday*92;
var color = {
  sky: '#47d7e2',
  deepblue: '#121a2f',
  blue: '#172240',
  grey: '#505466',
  white: '#ffffff',
  orange: '#d96718',
  darkorange: '#8a410f'
}
var adminmail = 'mirrorstatbot@gmail.com';

//// SET / DELETE WEBHOOK TO TG BOT
function setWebHook() {
  var url = tgurl + "/setWebhook?url=" + webAppUrl;
  var response1 = UrlFetchApp.fetch(url);
  Logger.log(response1.getContentText());
  var url2 = tgurl + "/getWebhookInfo";
  var response2 = UrlFetchApp.fetch(url2);
  Logger.log(response2.getContentText());
}

function deleteWebHook() {
  var url = tgurl + "/deleteWebhook?url=" + webAppUrl;
  var response1 = UrlFetchApp.fetch(url);
  Logger.log(response1.getContentText());
  var url2 = tgurl + "/getWebhookInfo";
  var response2 = UrlFetchApp.fetch(url2);
  Logger.log(response2.getContentText());
}

//// FETCH TG API
function sendToTG(data) { 
  var response = (UrlFetchApp.fetch(tgurl + '/', data));
  return response; 
}

function formatPostRequest(payload) {
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  return options;
}

function getChartUrl(method,symbol,timeframe) {
  if (symbol != 'MIR') {
    var file = DriveApp.getFilesByName(symbol + " - " + timeframe).next();
  }
  if (method == 'LP') {
    var file = DriveApp.getFilesByName(symbol + " - LP chart - " + timeframe).next();
  }
  var url = file.getUrl();
  var fileid = url.replace('/view?usp=drivesdk','').replace('https://drive.google.com/file/d/','');
  url = 'https://docs.google.com/uc?id=' + fileid;
  return url;
}

function normalizeSymbol(symbol,symbols) { 
  for (var i = 0; i < symbols.length; i++) {
    if (symbols[i].toLowerCase().includes(symbol.toLowerCase())) {
      return symbols[i];
    }
  }
  return false;
}

function normalizeTimeframe(timeframe) { 
  if (timeframe.toString().includes('1')) {
    return '1d';
  }
  if (timeframe.toString().includes('7')) {
    return '7d';
  }
  return false;
}

function subDaysFromDate(date,d){
  var result = new Date(date-d*(24*3600*1000));
  return result;
}

function emptyTrash() {  
  Drive.Files.emptyTrash();
  return;
}

function notifyAdmin(method,msg) {
  GmailApp.sendEmail(adminmail,method,msg);
}
