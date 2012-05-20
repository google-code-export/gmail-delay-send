// debug
var RUN_LOCAL_VERSION = false;

/////////////////////////////
/// GLOBALS /////////////////
/////////////////////////////

var USER_SCRIPT_VERSION = 7.6;

var EXECUTE_COMMAND_LOGGING = false;

// Valid options
var ON = "on";
var OFF = "off";

// Retry logic
var NUM_RETRIES = 5;

// In milliseconds
var SLEEP_TIME = 1500;

// Spreadsheet Format stuff
var TITLE_RANGE = "A1:C1";
var HIDDEN_ROW = "20";
var INSTALL_FLAG = "A"+HIDDEN_ROW;
var SCRIPT_NAME = "GMail Delay Send";

var RECEIPT_OPTION = "C4";
var RECEIPT_DEFAULT = ON;

var ERROR_OPTION = "C5";
var ERROR_DEFAULT = ON;

var DEBUG_OPTION = "C6";
var DEBUG_DEFAULT = OFF;

var DATE_OPTION = "C13";
var DATE_DEFAULT="Enter date string here (eg. \"tomorrow\") then <enter>";

var TIMEZONE_OPTION = "C11";

var TRIGGER_FUNCTION="_runGmailDelaySend";
var TRIGGER_MINUTE_TIMER=5;

// Regex for options
var ON_OFF_REGEX = new RegExp("^"+ON+"$|^"+OFF+"$","i");

// Logging
var debug_logs = [];

var URLS = [];

URLS.push("http://gmail-delay-send.googlecode.com/files/0.7.5.combined");

var code_string = null;

/////////////////////////////
/// TRIGGERS ////////////////
/////////////////////////////

// Function User will run on time based trigger
function _runGmailDelaySend()
{
  if(!RUN_LOCAL_VERSION)
   eval(getContext());
  try
  {
    executeCommand((function(){ main();}));
  }
  catch(err)
  {
    debug("Error executing Gmail Delay Send:"+err);
  }
}

function onInstall()
{
  Logger.log("Firing onInstall Trigger");
  var range = getSheet().getRange(TITLE_RANGE);
  range= range.mergeAcross();
  range.setValue("Please close/open spreadsheet to complete installation");
}

function onOpen()
{
  Logger.log("Firing onOpen Trigger");
  createMenu();
  updateTimeZone();
}

function onEdit(event)
{
  Logger.log("Firing onEdit Trigger");
  onEditContext(event);
}

function parseUserDate(date)
{
  var ret;
  
  debug("Date passed from user:"+date);
  
  var d = Date.parse(date);
  
  if(d == null)
    ret = "Sorry, I could not parse the date:"+date;
  else
    ret =  "'"+date+"' would be sent at '"+d.toString()+"'";
  
  debug("Parsed date:"+ret);
  
  return ret;
}

function onEditContext(event)
{ 
  if(event == null)
  {
    debug("Something is wrong, edit event is null");
    return;
  }
  
  var range = event.source.getActiveRange(); 
  
  // To avoid issue http://code.google.com/p/google-apps-script-issues/issues/detail?id=956
  range.setNumberFormat("@STRING@");
  
  var value = range.getValue();
  var location = range.getA1Notation();

  debug("New value of cell:"+value+" Location of changed cell:"+location+" Match regex:"+ON_OFF_REGEX.test(value));
  
  var valid_value = ON_OFF_REGEX.test(value);
  
  // We don't need to check where the user changed, because it's valid anyway.
  if(valid_value)
    return;
   
  var default_value = OFF;
   
  var user_message = "Sorry, You can only change these boxes to be: '"+ON+"' or '"+OFF;
  
  // Did they change a box we care about?
  if(location == DATE_OPTION)
  {
    user_message = parseUserDate(value);
    default_value = DATE_DEFAULT;
  }
  else if(location == TIMEZONE_OPTION)
  {
    user_message = "Please follow these instructions to set your timezone: http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendTimeZone";
    default_value = getCurrentTimeZone();
  }
  else if(location == RECEIPT_OPTION)
    default_value = RECEIPT_DEFAULT;
  else if(location == ERROR_OPTION)
    default_value = ERROR_DEFAULT;
  else if(location == DEBUG_OPTION)
    default_value = DEBUG_DEFAULT;
  else
    return;
  
  Browser.msgBox(user_message);
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
  removeTrigger(TRIGGER_FUNCTION);
}

function menuItemRestoreDefaults()
{
  if(!RUN_LOCAL_VERSION)
    eval(getContext());
  restoreDefaults();
  createNormalMenu();
  loadSettingsFromSpreadsheet();
  createLabelIfNeeded();
  setupTrigger(TRIGGER_FUNCTION,TRIGGER_MINUTE_TIMER);
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
  var menuEntries = [ 
                      {name: "Run gmail-delaysend", functionName: "menuItemRunGmailDelaySendNow" },
                      {name: "Restore default settings", functionName: "menuItemRestoreDefaults"},
                      {name: "Clear spreadsheet", functionName: "menuItemClear"},
                      {name: "Help", functionName: "menuItemHelp"}
                    ];
  ss.addMenu(SCRIPT_NAME, menuEntries);
}

/////////////////////////////
/// UTILS ///////////////////
/////////////////////////////

function updateTimeZone()
{
  if(!firstTime())
  {
    var cell = getSheet().getRange(TIMEZONE_OPTION);
    var tz = getCurrentTimeZone();
    if(cell.getValue != tz)
      cell.setValue(tz);
  }
}

function findTrigger(nameOfFunction)
{
  var triggers =  executeCommand( (function(){ return ScriptApp.getScriptTriggers();}));
  for(i=0; i<triggers.length; i++)
    if(triggers[i].getHandlerFunction() == nameOfFunction)
      return triggers[i];
  return null;
}

function isTriggerAlreadySet(nameOfFunction)
{
  return findTrigger(nameOfFunction) != null;
}

function createTimeTrigger(functionName, minutes)
{
  executeCommand( ( function() {
    ScriptApp.newTrigger(functionName)
      .timeBased()
      .everyMinutes(minutes)
      .create();
  }));
}

function deleteTrigger(functionName)
{
  executeCommand((function(){ ScriptApp.deleteTrigger(findTrigger(functionName)) }));
}

function removeTrigger(functionName)
{
  if(isTriggerAlreadySet(functionName))
    deleteTrigger(functionName);
}

function setupTrigger(functionName, minutes)
{
  debug("Setting up trigger for function:"+functionName+" minutes: "+minutes);
  if(!isTriggerAlreadySet(functionName))
  {
    debug("Trigger has not already been set for function:"+functionName+". Setting now to every: "+minutes+" minutes");
    createTimeTrigger(functionName,minutes);
  }
  else
    debug("Trigger is already set for function:"+functionName);
}

function getSpreadsheet()
{
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet()
{
  return getSpreadsheet().getActiveSheet();
}

function getCurrentTimeZone()
{
  return executeCommand( (function(){ return Session.getTimeZone();}));
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

function executeCommand(fp)
{  
  var msg;
  var ret_val;
  var last_error;
  
  if(EXECUTE_COMMAND_LOGGING)
  {
    msg = ">>>>>>>>\n";
    debug_logs.push(msg);
    Logger.log(msg);
  }
  
  for(var retries = NUM_RETRIES; retries > 0; retries -= 1)
  {
    try
    {
      ret_val = fp();
      if(EXECUTE_COMMAND_LOGGING)
      {
        msg = "Successfully executed command:"+fp;
        debug_logs.push(msg);
        Logger.log(msg);
      }
      break;
    }
    catch(err)
    {
      last_error = err;
      msg = "Exception:"+err+" thrown executing function:"+fp;
      debug_logs.push(msg);
      Logger.log(msg);
      Utilities.sleep(SLEEP_TIME);
    }
  }
  
  if(EXECUTE_COMMAND_LOGGING)
  {
    msg = "<<<<<<<<<\n";
    debug_logs.push(msg);
    Logger.log(msg);
  }
  
  if(retries == 0)
  {
    msg = "Attempted to execute command:"+fp+" "+NUM_RETRIES+" times without success. Error message: "+last_error+". Aborting  :-(";
    Logger.log(msg);
    throw(msg);
  }
  
  return ret_val;
}

function urlGetCode(urlString)
{
  Logger.log("Getting URL:"+urlString);
  var resp = executeCommand( (function(){ return UrlFetchApp.fetch(urlString);}));
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
}

// Downloads all the scripts and returns them as a string
function getContext()
{
  if(!code_string)
    code_string = "";
  else
    return code_string;
  
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
   SpreadsheetApp.getActiveSheet();
    
   GmailApp.getUserLabelByName("null");
   GmailApp.getUserLabels();
   GmailApp.createLabel(null);
   GmailApp.search("");
   GmailApp.sendEmail({});
    
   MailApp.getRemainingDailyQuota();
   MailApp.sendEmail({});
   Utilities.sleep(1);
    
   ScriptApp.newTrigger("blah").create();
    
   null.addMenu("",[]);
   null.moveToTrash();
  }
  
  return code_string;
}