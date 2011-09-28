// debug
var RUN_LOCAL_VERSION = false;

/////////////////////////////
/// GLOBALS /////////////////
/////////////////////////////

// Spreadsheet Format stuff
var HIDDEN_ROW = "20";
var INSTALL_FLAG = "A"+HIDDEN_ROW;
var SCRIPT_NAME = "GMail Delay Send";
var RECEIPT_OPTION = "C4";
var RECEIPT_DEFAULT = ON;
var ERROR_OPTION = "C5";
var ERROR_DEFAULT = ON;
var DEBUG_OPTION = "C6";
var DEBUG_DEFAULT = OFF;

// Valid options
var ON = "on";
var OFF = "off";

// Regex for options
var ON_OFF_REGEX = new RegExp("^"+ON+"$|^"+OFF+"$","i");

// Logging
var debug_logs = [];

var URLS = [];

URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Globals.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Utils.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/date-en-US.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/CustomDate.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/FormatSpreadsheet.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/GmailDelaySend.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Triggers.js");
//URLS.push("http://gmail-delay-send.googlecode.com/files/BETA_0.5.combined");

var code_string = null;

/////////////////////////////
/// TRIGGERS ////////////////
/////////////////////////////

// Function User will run on time based trigger
function _runGmailDelaySend()
{
  if(!RUN_LOCAL_VERSION)
   eval(getContext());
  main();
}

function onInstall()
{
  Logger.log("Firing onInstall Trigger");
  onOpen();
}

function onOpen()
{
  Logger.log("Firing onOpen Trigger");
  createMenu();
}

function onEdit(event)
{
  Logger.log("Firing onEdit Trigger");
  onEditContext(event);
}

function onEditContext(event)
{ 
  if(!event)
  {
    debug("Something is wrong, edit event is null");
    return;
  }
  
  var range = event.source.getActiveRange(); 
  var value = range.getValue();  
  var location = range.getA1Notation();
  
  debug("New value of cell:"+value+" Location of changed cell:"+location+" Match regex:"+ON_OFF_REGEX.test(value));
  
  var valid_value = ON_OFF_REGEX.test(value);
  
  // We don't need to check where the user changed, because it's valid anyway.
  if(valid_value)
    return;
   
  var default_value = OFF;
      
  // Did they change a settings box?
  if(location == RECEIPT_OPTION)
    default_value = RECEIPT_DEFAULT;
  else if(location == ERROR_OPTION)
    default_value = ERROR_DEFAULT;
  else if(location == DEBUG_OPTION)
    default_value = DEBUG_DEFAULT;
  
  Browser.msgBox("Sorry, You can only change these boxes to be: '"+ON+"' or '"+OFF);
  range.setValue(default_value);
}

/////////////////////////////
/// MENU ITEMS //////////////
/////////////////////////////
function menuItemClear()
{
  if(!RUN_LOCAL_VERSION)
    eval(getContext());
  clear();
}

function menuItemRestoreDefaults()
{
  if(!RUN_LOCAL_VERSION)
    eval(getContext());
  restoreDefaults();
  createNormalMenu();
}

function menuItemParseDate()
{
  var resp = Browser.inputBox("Enter date you would like to parse (eg. 'tomorrow' or 'Wednesday 10am')", Browser.Buttons.OK_CANCEL);
  
  //if(!RUN_LOCAL_VERSION)
    eval(getContext());
  
  Logger.log("User Entered: "+resp);

  var d = Date.parse(resp);
  
  Logger.log("Parsed value:"+d);
  
  if(d)
    Browser.msgBox("Date string '"+resp+"' parsed successfully to date:\n\n"+new Date(d));
  else
    Browser.msgBox("Sorry, I couldn't understand '"+resp+"'");
}

function menuItemRunGmailDelaySendNow()
{
  if(!RUN_LOCAL_VERSION)
    eval(getContext());
  main();
}

function menuItemHelp()
{
  Browser.msgBox("Please visit the "+SCRIPT_NAME+" homepage at: http://code.google.com/p/gmail-delay-send for help");
}

/////////////////////////////
/// MENU HELPERS ////////////
/////////////////////////////
function createMenu()
{
  if(firstTime())
  {
    Browser.msgBox("Welcome to Gmail Delay Send. This spreadsheet will contain your setting once you install them through the "+SCRIPT_NAME+"->Install menu");
    createFirstTimeMenu();
  }
  else
  {
    createNormalMenu();
  }
}

function createFirstTimeMenu()
{
  var ss = getSpreadsheet();
  var menuEntries = [ {name: "Install", functionName: "menuItemRestoreDefaults"}];
  ss.addMenu(SCRIPT_NAME, menuEntries);
}

function createNormalMenu()
{
  var ss = getSpreadsheet();
  var menuEntries = [ {name: "Clear", functionName: "menuItemClear"},
                      {name: "Run Now", functionName: "menuItemRunGmailDelaySendNow" },
                      {name: "Test a Date", functionName: "menuItemParseDate" },
                      {name: "Restore Defaults", functionName: "menuItemRestoreDefaults"},
                      {name: "Help", functionName: "menuItemHelp"}];
  ss.addMenu(SCRIPT_NAME, menuEntries);
}

/////////////////////////////
/// UTILS ///////////////////
/////////////////////////////
function getSpreadsheet()
{
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet()
{
  return getSpreadsheet().getActiveSheet();
}

function firstTime()
{
  var toReturn = false;
  var sheet = SpreadsheetApp.getActiveSheet();
  
  toReturn = !(sheet.getRange(INSTALL_FLAG).getValue().length > 0)

  Logger.log("First time?:"+toReturn);
  
  return toReturn;
}

function debug(msg)
{
  debug_logs.push(msg);
  Logger.log(msg);
}

// Downloads all the scripts and returns them as a string
function getContext()
{
  if(!code_string)
    code_string = "";
  else
    return code_string;
  
  // Create functions inside so user only see's one function to run
  var urlGetCode = (function(urlString)
                    {
                      Logger.log("Getting URL:"+urlString);
                      var resp = UrlFetchApp.fetch(urlString);
                      Logger.log("Response: "+resp.getResponseCode());
                      if(resp.getResponseCode() == 200)
                      {
                        Logger.log("Success with URL!");
                        return resp.getContentText();
                      }
                      else
                      {
                        Logger.log("Error trying to get URL. Response code:"+resp.getResponseCode());
                        return null;
                      }
                    });

  
  // ************* CODE START ****************//
  Logger.log("Scripts to download: "+URLS);
  for(var i=0; i<URLS.length; i++)
  {
    var url = URLS[i];
    var code = urlGetCode(url);
    
    if(!code)
    {
      Logger.log("Error trying to download URL:"+url);
      return;
    }
    
    code_string += code;
  }

  Logger.log("Code has been successfully downloaded");
  
  if(false)
  {
   // B/C our code is dynamically run we need to let the compiler think we need
   // these permissions before we run
   SpreadsheetApp.getActiveSpreadsheet();
   GmailApp.getUserLabelByName("null");
   MailApp.getRemainingDailyQuota();
   null.addMenu("",[]);
   null.moveToTrash();
  }
  
  return code_string;
}
