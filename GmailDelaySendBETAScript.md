# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---



Installing the script directly requires that you create two files in the script editor.

The script editor will pop up pre-populated with a template for you to get started. Remove that text and paste in the contents of the script below.

Next 'File->New->File' and copy and paste the contents of the 2nd code block below (date.js).

Save both files with 'File->Save All' and close the editor.

**NOTE** selecting the text below can be cumbersome.. Try selecting with mouse and using 'page down' key at the same time.

runGmailDelaySend.js
```
// debug
var RUN_LOCAL_VERSION = true;

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

URLS.push("http://gmail-delay-send.googlecode.com/files/0.7.6.combined");

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
```

date.js.gs
```
/**
 * @version: 1.0 Alpha-1
 * @author: Coolite Inc. http://www.coolite.com/
 * @date: 2008-05-13
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * @website: http://www.datejs.com/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|aft(er)?|from|hence)/i,subtract:/^(\-|bef(ore)?|ago)/i,yesterday:/^yes(terday)?/i,today:/^t(od(ay)?)?/i,tomorrow:/^tom(orrow)?/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^mn|min(ute)?s?/i,hour:/^h(our)?s?/i,week:/^w(eek)?s?/i,month:/^m(onth)?s?/i,day:/^d(ay)?s?/i,year:/^y(ear)?s?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a(?!u|p)|p)/i},timezones:[{name:"UTC",offset:"-000"},{name:"GMT",offset:"-000"},{name:"EST",offset:"-0500"},{name:"EDT",offset:"-0400"},{name:"CST",offset:"-0600"},{name:"CDT",offset:"-0500"},{name:"MST",offset:"-0700"},{name:"MDT",offset:"-0600"},{name:"PST",offset:"-0800"},{name:"PDT",offset:"-0700"}]};
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,p=function(s,l){if(!l){l=2;}
return("000"+s).slice(l*-1);};$P.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};$P.setTimeToNow=function(){var n=new Date();this.setHours(n.getHours());this.setMinutes(n.getMinutes());this.setSeconds(n.getSeconds());this.setMilliseconds(n.getMilliseconds());return this;};$D.today=function(){return new Date().clearTime();};$D.compare=function(date1,date2){if(isNaN(date1)||isNaN(date2)){throw new Error(date1+" - "+date2);}else if(date1 instanceof Date&&date2 instanceof Date){return(date1<date2)?-1:(date1>date2)?1:0;}else{throw new TypeError(date1+" - "+date2);}};$D.equals=function(date1,date2){return(date1.compareTo(date2)===0);};$D.getDayNumberFromName=function(name){var n=$C.dayNames,m=$C.abbreviatedDayNames,o=$C.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s||o[i].toLowerCase()==s){return i;}}
return-1;};$D.getMonthNumberFromName=function(name){var n=$C.monthNames,m=$C.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};$D.isLeapYear=function(year){return((year%4===0&&year%100!==0)||year%400===0);};$D.getDaysInMonth=function(year,month){return[31,($D.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};$D.getTimezoneAbbreviation=function(offset){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].offset===offset){return z[i].name;}}
return null;};$D.getTimezoneOffset=function(name){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].name===name.toUpperCase()){return z[i].offset;}}
return null;};$P.clone=function(){return new Date(this.getTime());};$P.compareTo=function(date){return Date.compare(this,date);};$P.equals=function(date){return Date.equals(this,date||new Date());};$P.between=function(start,end){return this.getTime()>=start.getTime()&&this.getTime()<=end.getTime();};$P.isAfter=function(date){return this.compareTo(date||new Date())===1;};$P.isBefore=function(date){return(this.compareTo(date||new Date())===-1);};$P.isToday=function(){return this.isSameDay(new Date());};$P.isSameDay=function(date){return this.clone().clearTime().equals(date.clone().clearTime());};$P.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};$P.addSeconds=function(value){return this.addMilliseconds(value*1000);};$P.addMinutes=function(value){return this.addMilliseconds(value*60000);};$P.addHours=function(value){return this.addMilliseconds(value*3600000);};$P.addDays=function(value){this.setDate(this.getDate()+value);return this;};$P.addWeeks=function(value){return this.addDays(value*7);};$P.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,$D.getDaysInMonth(this.getFullYear(),this.getMonth())));return this;};$P.addYears=function(value){return this.addMonths(value*12);};$P.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.milliseconds){this.addMilliseconds(x.milliseconds);}
if(x.seconds){this.addSeconds(x.seconds);}
if(x.minutes){this.addMinutes(x.minutes);}
if(x.hours){this.addHours(x.hours);}
if(x.weeks){this.addWeeks(x.weeks);}
if(x.months){this.addMonths(x.months);}
if(x.years){this.addYears(x.years);}
if(x.days){this.addDays(x.days);}
return this;};var $y,$m,$d;$P.getWeek=function(){var a,b,c,d,e,f,g,n,s,w;$y=(!$y)?this.getFullYear():$y;$m=(!$m)?this.getMonth()+1:$m;$d=(!$d)?this.getDate():$d;if($m<=2){a=$y-1;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=0;f=$d-1+(31*($m-1));}else{a=$y;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=s+1;f=$d+((153*($m-3)+2)/5)+58+s;}
g=(a+b)%7;d=(f+g-e)%7;n=(f+3-d)|0;if(n<0){w=53-((g-s)/5|0);}else if(n>364+s){w=1;}else{w=(n/7|0)+1;}
$y=$m=$d=null;return w;};$P.getISOWeek=function(){$y=this.getUTCFullYear();$m=this.getUTCMonth()+1;$d=this.getUTCDate();return p(this.getWeek());};$P.setWeek=function(n){return this.moveToDayOfWeek(1).addWeeks(n-this.getWeek());};$D._validate=function(n,min,max,name){if(typeof n=="undefined"){return false;}else if(typeof n!="number"){throw new TypeError(n+" is not a Number.");}else if(n<min||n>max){throw new RangeError(n+" is not a valid value for "+name+".");}
return true;};$D.validateMillisecond=function(value){return $D._validate(value,0,999,"millisecond");};$D.validateSecond=function(value){return $D._validate(value,0,59,"second");};$D.validateMinute=function(value){return $D._validate(value,0,59,"minute");};$D.validateHour=function(value){return $D._validate(value,0,23,"hour");};$D.validateDay=function(value,year,month){return $D._validate(value,1,$D.getDaysInMonth(year,month),"day");};$D.validateMonth=function(value){return $D._validate(value,0,11,"month");};$D.validateYear=function(value){return $D._validate(value,0,9999,"year");};$P.set=function(config){if($D.validateMillisecond(config.millisecond)){this.addMilliseconds(config.millisecond-this.getMilliseconds());}
if($D.validateSecond(config.second)){this.addSeconds(config.second-this.getSeconds());}
if($D.validateMinute(config.minute)){this.addMinutes(config.minute-this.getMinutes());}
if($D.validateHour(config.hour)){this.addHours(config.hour-this.getHours());}
if($D.validateMonth(config.month)){this.addMonths(config.month-this.getMonth());}
if($D.validateYear(config.year)){this.addYears(config.year-this.getFullYear());}
if($D.validateDay(config.day,this.getFullYear(),this.getMonth())){this.addDays(config.day-this.getDate());}
if(config.timezone){this.setTimezone(config.timezone);}
if(config.timezoneOffset){this.setTimezoneOffset(config.timezoneOffset);}
if(config.week&&$D._validate(config.week,0,53,"week")){this.setWeek(config.week);}
return this;};$P.moveToFirstDayOfMonth=function(){return this.set({day:1});};$P.moveToLastDayOfMonth=function(){return this.set({day:$D.getDaysInMonth(this.getFullYear(),this.getMonth())});};$P.moveToNthOccurrence=function(dayOfWeek,occurrence){var shift=0;if(occurrence>0){shift=occurrence-1;}
else if(occurrence===-1){this.moveToLastDayOfMonth();if(this.getDay()!==dayOfWeek){this.moveToDayOfWeek(dayOfWeek,-1);}
return this;}
return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(dayOfWeek,+1).addWeeks(shift);};$P.moveToDayOfWeek=function(dayOfWeek,orient){var diff=(dayOfWeek-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};$P.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};$P.getOrdinalNumber=function(){return Math.ceil((this.clone().clearTime()-new Date(this.getFullYear(),0,1))/86400000)+1;};$P.getTimezone=function(){return $D.getTimezoneAbbreviation(this.getUTCOffset());};$P.setTimezoneOffset=function(offset){var here=this.getTimezoneOffset(),there=Number(offset)*-6/10;return this.addMinutes(there-here);};$P.setTimezone=function(offset){return this.setTimezoneOffset($D.getTimezoneOffset(offset));};$P.hasDaylightSavingTime=function(){return(Date.today().set({month:0,day:1}).getTimezoneOffset()!==Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.isDaylightSavingTime=function(){return(this.hasDaylightSavingTime()&&new Date().getTimezoneOffset()===Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r.charAt(0)+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};$P.getElapsed=function(date){return(date||new Date())-this;};if(!$P.toISOString){$P.toISOString=function(){function f(n){return n<10?'0'+n:n;}
return'"'+this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z"';};}
$P._toString=$P.toString;$P.toString=function(format){var x=this;if(format&&format.length==1){var c=$C.formatPatterns;x.t=x.toString;switch(format){case"d":return x.t(c.shortDate);case"D":return x.t(c.longDate);case"F":return x.t(c.fullDateTime);case"m":return x.t(c.monthDay);case"r":return x.t(c.rfc1123);case"s":return x.t(c.sortableDateTime);case"t":return x.t(c.shortTime);case"T":return x.t(c.longTime);case"u":return x.t(c.universalSortableDateTime);case"y":return x.t(c.yearMonth);}}
var ord=function(n){switch(n*1){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};return format?format.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g,function(m){if(m.charAt(0)==="\\"){return m.replace("\\","");}
x.h=x.getHours;switch(m){case"hh":return p(x.h()<13?(x.h()===0?12:x.h()):(x.h()-12));case"h":return x.h()<13?(x.h()===0?12:x.h()):(x.h()-12);case"HH":return p(x.h());case"H":return x.h();case"mm":return p(x.getMinutes());case"m":return x.getMinutes();case"ss":return p(x.getSeconds());case"s":return x.getSeconds();case"yyyy":return p(x.getFullYear(),4);case"yy":return p(x.getFullYear());case"dddd":return $C.dayNames[x.getDay()];case"ddd":return $C.abbreviatedDayNames[x.getDay()];case"dd":return p(x.getDate());case"d":return x.getDate();case"MMMM":return $C.monthNames[x.getMonth()];case"MMM":return $C.abbreviatedMonthNames[x.getMonth()];case"MM":return p((x.getMonth()+1));case"M":return x.getMonth()+1;case"t":return x.h()<12?$C.amDesignator.substring(0,1):$C.pmDesignator.substring(0,1);case"tt":return x.h()<12?$C.amDesignator:$C.pmDesignator;case"S":return ord(x.getDate());default:return m;}}):this._toString();};}());
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,$N=Number.prototype;$P._orient=+1;$P._nth=null;$P._is=false;$P._same=false;$P._isSecond=false;$N._dateElement="day";$P.next=function(){this._orient=+1;return this;};$D.next=function(){return $D.today().next();};$P.last=$P.prev=$P.previous=function(){this._orient=-1;return this;};$D.last=$D.prev=$D.previous=function(){return $D.today().last();};$P.is=function(){this._is=true;return this;};$P.same=function(){this._same=true;this._isSecond=false;return this;};$P.today=function(){return this.same().day();};$P.weekday=function(){if(this._is){this._is=false;return(!this.is().sat()&&!this.is().sun());}
return false;};$P.at=function(time){return(typeof time==="string")?$D.parse(this.toString("d")+" "+time):this.set(time);};$N.fromNow=$N.after=function(date){var c={};c[this._dateElement]=this;return((!date)?new Date():date.clone()).add(c);};$N.ago=$N.before=function(date){var c={};c[this._dateElement]=this*-1;return((!date)?new Date():date.clone()).add(c);};var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),pxf=("Milliseconds Seconds Minutes Hours Date Week Month FullYear").split(/\s/),nth=("final first second third fourth fifth").split(/\s/),de;$P.toObject=function(){var o={};for(var i=0;i<px.length;i++){o[px[i].toLowerCase()]=this["get"+pxf[i]]();}
return o;};$D.fromObject=function(config){config.week=null;return Date.today().set(config);};var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
if(this._nth!==null){if(this._isSecond){this.addSeconds(this._orient*-1);}
this._isSecond=false;var ntemp=this._nth;this._nth=null;var temp=this.clone().moveToLastDayOfMonth();this.moveToNthOccurrence(n,ntemp);if(this>temp){throw new RangeError($D.getDayName(n)+" does not occur "+ntemp+" times in the month of "+$D.getMonthName(temp.getMonth())+" "+temp.getFullYear()+".");}
return this;}
return this.moveToDayOfWeek(n,this._orient);};};var sdf=function(n){return function(){var t=$D.today(),shift=n-t.getDay();if(n===0&&$C.firstDayOfWeek===1&&t.getDay()!==0){shift=shift+7;}
return t.addDays(shift);};};for(var i=0;i<dx.length;i++){$D[dx[i].toUpperCase()]=$D[dx[i].toUpperCase().substring(0,3)]=i;$D[dx[i]]=$D[dx[i].substring(0,3)]=sdf(i);$P[dx[i]]=$P[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};var smf=function(n){return function(){return $D.today().set({month:n,day:1});};};for(var j=0;j<mx.length;j++){$D[mx[j].toUpperCase()]=$D[mx[j].toUpperCase().substring(0,3)]=j;$D[mx[j]]=$D[mx[j].substring(0,3)]=smf(j);$P[mx[j]]=$P[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(this._isSecond){this._isSecond=false;return this;}
if(this._same){this._same=this._is=false;var o1=this.toObject(),o2=(arguments[0]||new Date()).toObject(),v="",k=j.toLowerCase();for(var m=(px.length-1);m>-1;m--){v=px[m].toLowerCase();if(o1[v]!=o2[v]){return false;}
if(k==v){break;}}
return true;}
if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$P[de]=$P[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}
$P._ss=ef("Second");var nthfn=function(n){return function(dayOfWeek){if(this._same){return this._ss(arguments[0]);}
if(dayOfWeek||dayOfWeek===0){return this.moveToNthOccurrence(dayOfWeek,n);}
this._nth=n;if(n===2&&(dayOfWeek===undefined||dayOfWeek===null)){this._isSecond=true;return this.addSeconds(this._orient);}
return this;};};for(var l=0;l<nth.length;l++){$P[nth[l]]=(l===0)?nthfn(-1):nthfn(l);}}());
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo;var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};$D.Grammar={};$D.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=(s.length==3)?"jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s)/4:Number(s)-1;};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<$C.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
var now=new Date();if((this.hour||this.minute)&&(!this.month&&!this.year&&!this.day)){this.day=now.getDate();}
if(!this.year){this.year=now.getFullYear();}
if(!this.month&&this.month!==0){this.month=now.getMonth();}
if(!this.day){this.day=1;}
if(!this.hour){this.hour=0;}
if(!this.minute){this.minute=0;}
if(!this.second){this.second=0;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.day>$D.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
var today=$D.today();if(this.now&&!this.unit&&!this.operator){return new Date();}else if(this.now){today=new Date();}
var expression=!!(this.days&&this.days!==null||this.orient||this.operator);var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(!this.now&&"hour minute second".indexOf(this.unit)!=-1){today.setTimeToNow();}
if(this.month||this.month===0){if("year day hour minute second".indexOf(this.unit)!=-1){this.value=this.month+1;this.month=null;expression=true;}}
if(!expression&&this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(!this.month){this.month=temp.getMonth();}
this.year=temp.getFullYear();}
if(expression&&this.weekday&&this.unit!="month"){this.unit="day";gap=($D.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month&&this.unit=="day"&&this.operator){this.value=(this.month+1);this.month=null;}
if(this.value!=null&&this.month!=null&&this.year!=null){this.day=this.value*1;}
if(this.month&&!this.day&&this.value){today.set({day:this.value*1});if(!expression){this.day=this.value*1;}}
if(!this.month&&this.value&&this.unit=="month"&&!this.now){this.month=this.value;expression=true;}
if(expression&&(this.month||this.month===0)&&this.unit!="year"){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(!this.value&&this.operator&&this.operator!==null&&this[this.unit+"s"]&&this[this.unit+"s"]!==null){this[this.unit+"s"]=this[this.unit+"s"]+((this.operator=="add")?1:-1)+(this.value||0)*orient;}else if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
this[this.unit+"s"]=this.value*orient;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(temp.getMonth()!==today.getMonth()){this.month=temp.getMonth();}}
if((this.month||this.month===0)&&!this.day){this.day=1;}
if(!this.orient&&!this.operator&&this.unit=="week"&&this.value&&!this.day&&!this.month){return Date.today().setWeek(this.value);}
if(expression&&this.timezone&&this.day&&this.days){this.day=this.days;}
return(expression)?today.add(this):today.set(this);}};var _=$D.Parsing.Operators,g=$D.Grammar,t=$D.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|@|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=$C.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken($C.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.m,g.s],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("second minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[$C.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw $D.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["\"yyyy-MM-ddTHH:mm:ssZ\"","yyyy-MM-ddTHH:mm:ssZ","yyyy-MM-ddTHH:mm:ssz","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mmZ","yyyy-MM-ddTHH:mmz","yyyy-MM-ddTHH:mm","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","MMddyyyy","ddMMyyyy","Mddyyyy","ddMyyyy","Mdyyyy","dMyyyy","yyyy","Mdyy","dMyy","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};$D._parse=$D.parse;$D.parse=function(s){var r=null;if(!s){return null;}
if(s instanceof Date){return s;}
try{r=$D.Grammar.start.call({},s.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1"));}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};$D.getParseFunction=function(fx){var fn=$D.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};$D.parseExact=function(s,fx){return $D.getParseFunction(fx)(s);};}());
```

downloaded\_data.js
```
// Global settings
var SEND_RECEIPTS;        // You will get an email confirming that your email was sent 
var SEND_PARSE_ERRORS;    // You will get an email with any parsing errors (a good idea to keep on) 
var SEND_DEBUG_LOG;       // For debugging problems 
var DELAY_SEND_LABEL;     // The label that we'll search under, set to null to search entire draft folder 
var DELIMITER;            // The text string seperating the subject from the date to send 
var DELAY_SEND_REGEX;

var DOWNLOAD_SCRIPT_VERSION = 7.6;

// Default Email Configuration Stuff 
var DEFAULT_SEND_RECEIPTS = true;
var DEFAULT_SEND_PARSE_ERRORS = true;
var DEFAULT_SEND_DEBUG_LOG = true;

// General Configuration 
var DEFAULT_DELAY_SEND_LABEL = "DELAY_SEND"; // The label that we'll search under, set to null to search entire draft folder 
var DEFAULT_DELIMITER = "--";                // The text string seperating the subject from the date to send 

// Malformed messages will be placed in this label
var DELAY_SEND_ERROR_LABEL = "DELAY_SEND_ERRORS";

// Spreadsheet locations 
var SEND_RECEIPTS_CELL = "C4";
var PARSE_ERROR_CELL= "C5";
var DEBUG_CELL = "C6";
var LABEL_NAME_CELL = "C8";
var DELIM_CELL = "C9";

// Array of notifications  
var receipts = [];
var parse_errors = [];


var DELAY_SEND_REGEX = null;


// Ranges

var MORE_INFO_LINK = "A2:B2";
var NOTIFICATION_LINK = "A4";


Date.today = function() 
{
    if(this.relativeTo == null)
      return new Date().clearTime();
    else
      return this.relativeTo.clone().clearTime();
}

Date.setRelativeTo = function(d) 
{
    this.relativeTo = d;
}

Date.prototype.setTimeToNow = function () 
{
    var n = Date.relativeTo || new Date();
    this.setHours(n.getHours());
    this.setMinutes(n.getMinutes());
    this.setSeconds(n.getSeconds());
    this.setMilliseconds(n.getMilliseconds());
    return this;
}

function clear()
{
  var sheet = getSheet();
  sheet.clear();
}

function restoreDefaults()
{
  // Clear any existing formatting first
  clear();
  
  var sheet = getSheet();
  
  // unfreeze rows
  sheet.setFrozenRows(0);
  
  // Set title
  var titleRange = sheet.getRange(TITLE_RANGE);
  titleRange = titleRange.mergeAcross();
  titleRange.setValue("Welcome to\n Gmail-Delay-Send");
  titleRange.setHorizontalAlignment("center");
  titleRange.setFontSize(24);
  titleRange.setFontColor(TEXT_COLOR);
  
  // Create link
  var underTitleLink = sheet.getRange(MORE_INFO_LINK);
  underTitleLink = underTitleLink.mergeAcross();
  underTitleLink.setFontColor("blue");
  underTitleLink.setValue('=HYPERLINK("http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendFAQ","Learn about Gmail-Delay-Send")');
  
  // Notification section
  var notifyLink = sheet.getRange(NOTIFICATION_LINK);
  notifyLink.setFontColor(TEXT_COLOR);
  notifyLink.setValue('=HYPERLINK("http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendNotificationSettings","Notification Settings:")');
  notifyLink.setHorizontalAlignment("right");
  
  // Email receipts:
  addUserOption(sheet, RECEIPT_LABEL,RECEIPT_OPTION,"Send email receipts",RECEIPT_DEFAULT);
  addUserOption(sheet, ERROR_LABEL,ERROR_OPTION,"Error notification",ERROR_DEFAULT);
  addUserOption(sheet, DEBUG_LABEL,DEBUG_OPTION,"Debugging",DEBUG_DEFAULT);
  
  // Advanced section
  var advancedLink = sheet.getRange(ADVANCED_LINK);
  advancedLink.setFontColor(TEXT_COLOR);
  advancedLink.setValue('=HYPERLINK("http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendAdvancedSettings","Advanced Settings:")');
  advancedLink.setHorizontalAlignment("right");
  
  // Parsing delimeter
  addUserOption(sheet, LABEL_LABEL,LABEL_OPTION,"Label name",LABEL_DEFAULT);
  addUserOption(sheet, PARSING_LABEL,PARSING_OPTION,"Parsing Deilimiter",PARSING_DEFAULT);
  
  // Current timezone setting
  var currentTimeZone = sheet.getRange(TIMEZONE_LINK);
  currentTimeZone.setFontColor(TEXT_COLOR);
  currentTimeZone.setValue('=HYPERLINK("http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendTimeZone","Setting Time Zone:")');
  currentTimeZone.setHorizontalAlignment("right");
  
  addUserOption(sheet, TIMEZONE_LABEL, TIMEZONE_OPTION, "Current time zone: (open/close doc to update)", getCurrentTimeZone() );
  
  // Date Parsing section
  var dateLink = sheet.getRange(DATE_LINK);
  dateLink.setFontColor(TEXT_COLOR);
  dateLink.setValue('=HYPERLINK("http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendSpecifyingDates","Help with dates:")');
  dateLink.setHorizontalAlignment("right");
  
  addUserOption(sheet, DATE_LABEL, DATE_OPTION,"Practice creating dates:",DATE_DEFAULT);
  
  sheet.getRange(INSTALL_FLAG).setValue(ON);
  sheet.hideRow(sheet.getRange(INSTALL_FLAG));
}

function addUserOption(sheet, labelCell, optionCell, text, defaultValue)
{
  var label = sheet.getRange(labelCell);
  label.setFontColor(TEXT_COLOR);
  label.setFontSize(12);
  label.setValue(text);
  
  var option = sheet.getRange(optionCell);
  option.setValue(defaultValue);
  option.setFontColor("green");
  option.setHorizontalAlignment("center");
  
  return;
}


var ADVANCED_LINK = "A8";
var TIMEZONE_LINK = "A11";
var DATE_LINK = "A13";

var RECEIPT_LABEL = "B4";
var TIMEZONE_LABEL = "B11";

var ERROR_LABEL = "B5";



var DEBUG_LABEL = "B6";


var LABEL_LABEL = "B8";
var LABEL_OPTION = "C8";
var LABEL_DEFAULT = DEFAULT_DELAY_SEND_LABEL;

var PARSING_LABEL = "B9";
var PARSING_OPTION = "C9";
var PARSING_DEFAULT = "--";

var DATE_LABEL="B13";



// Colors
var TEXT_COLOR = "blue";

// Text (in pixels)
var EMAIL_FOOTER_TEXT_SIZE=10;

/**********************************
    GMAIL DELAY SEND
***********************************/

function check_for_notification_emails()
{
  var within = 5 * 60 * 1000 / 2;
  var email_time = "2011-10-28 10:00";
  var email_message = "A new version of gmail-delay-send has been released! Please visit the website for more information: http://gmail-delay-send.googlecode.com";
  
  var time_between_email_time_and_now = Math.abs( (new Date(Date.parse(email_time))).getTime() - Date.now() );
  
  debug("Want to send email message at: "+email_time+", current time difference: "+time_between_email_time_and_now);
  
  // If we're within 9.9 minutes of the time then send the message
  if(time_between_email_time_and_now < within)
  {
    debug("Sending notification email message:"+email_message);
    receipts.push(email_message);
  }
}

function ThreadMetaData()
{
  this.originalSubject;   /* The original subject line of the message */
  this.newSubject;        /* Subject line after we have removed date data */
  this.found_delim;       /* Boolean, if the message contains the delimeter (eg. we tried to parse the message) */
  this.successful_parse;  /* Boolean, if we were able to successfully parse the message */
  this.sendDate;          /* Date object when we should actually send this message */
  this.error_msg;         /* The error message (if !valid) why this thread is NOT valid */
}

function createLabelIfNeeded()
{
  var label_created = false;
  
  if(DELAY_SEND_LABEL != null && !userHasLabel(DELAY_SEND_LABEL))
  {
    debug("Could not find: "+DELAY_SEND_LABEL + "label, creating now..");
    createDelaySendLabel();
    sendLogs();
    label_created = true;
  }
  return label_created;
}


/* Returns true/false if the user has
   the label created */
function userHasLabel(label) 
{
  var labels = executeCommand( function() { return GmailApp.getUserLabels(); } );
  for(var i=0; i<labels.length; i++)
    if(labels[i].getName() == label)
      return true;
  return false;
}

/* Creates the delay send label */
function createDelaySendLabel()
{
  var label = executeCommand( function() { return GmailApp.createLabel(DELAY_SEND_LABEL); } );
  var string = "";
  if(label)
  {
    receipts.push(" Created a new label: '"+DELAY_SEND_LABEL+"'. Apply this label to all emails you would like to send at a later point");
    debug("New label created successfully");
  }
  else
  {
    receipts.push(" Error trying to create a new label: '"+DELAY_SEND_LABEL+"'. We can't continue unless this label has been created");
    debug("Error creating label!");
  }
}

/* Returns all the threads objects that are in the label
   and in the draft folder */
function getThreadsInLabel()
{
  var search_string = "in:drafts ";
  
  if(DELAY_SEND_LABEL != null)
    search_string += " + in:"+DELAY_SEND_LABEL;
  
  // do not include any message in the error bucket
  search_string += " + -label:"+DELAY_SEND_ERROR_LABEL+" ";
  
  debug("Searching for emails with this string: '"+search_string+"'");
  
  var threads = executeCommand( function() { return GmailApp.search(search_string); } );
  
  return threads;
}

/* Return a completed ThreadMetaData object for this subject line */
function parseMessageSubject(subjectLine, messageDate)
{
  var metaData = new ThreadMetaData();
  
  debug("Original Thread Header:"+subjectLine);
  
  var match = DELAY_SEND_REGEX.exec(subjectLine);
  
  if(match == null)
  {
    metaData.found_delim = false;
    metaData.successful_parse = false;
    metaData.error_msg = "Subject: "+subjectLine+" did not match.";
  }
  else if(match.length != 1)
  {
    metaData.found_delim = false;
    metaData.successful_parse = false;
    metaData.error_msg = "Found more than 1 match in subject line:"+subjectLine;
  }
  else
  {
    // We successfully found the delimeter
    metaData.found_delim = true;

    var date_string = subjectLine.slice(match.index+DELIMITER.length,subjectLine.length);
   
    debug("Date String: "+date_string+" Relative to date message was composed:"+messageDate);
    
    Date.setRelativeTo(messageDate);
    metaData.sendDate = parseDate(date_string);
 
    // We could not parse the data successfully
    if(metaData.sendDate == null)
    {
      debug("Error Parsing date string: '"+date_string+"'");
      metaData.error_msg = "Error parsing date string:'"+date_string+"'";
      metaData.successful_parse = false;
    }
    else
    {
      // Success parsing
      debug("Date to send: "+metaData.sendDate); 
      metaData.originalSubject = subjectLine;
      metaData.successful_parse = true;
      metaData.newSubject = subjectLine.slice(0,match.index);
      metaData.error_msg = null;
    }
  }
  return metaData;
}

function timeToSendMessage(messageSendDate)
{
  var currentDate = new Date();  
  var timeToSend;
  
  // compare returns -1 if sendDate less than current date (eg. it has already passed)
  // compare returns 0 if the dates are equal
  timeToSend = Date.compare(messageSendDate,currentDate) < 1;
  
  debug("Detected time to send message:"+timeToSend+". Send Date:"+messageSendDate+" Current date:"+currentDate);
   
  return timeToSend;
}

// Create the error label if it doens't exist already
// Apply the error label to the message.
function applyErrorLabel(message)
{
  var label = executeCommand( function() { return GmailApp.createLabel(DELAY_SEND_ERROR_LABEL); } );
  
  if(label == null)
  {
    debug("Was not able to create label: "+DELAY_SEND_ERROR_LABEL);
    return false;
  }
  debug("Succesfully got error label");
  
  var thread = message.getThread();
  
  thread.addLabel(label);
    
  debug("Successfully added error label ("+DELAY_SEND_ERROR_LABEL+") to message: "+message.getSubject());
  
  return true;
}

function handleMalformedMessage(message,metaObj)
{ 
  var process_message_as_error = false;
      
  // If we are using a label then any malformed email is an error
  if(DELAY_SEND_LABEL != null)
  {
    debug("Processing message as error because user has label defined:"+DELAY_SEND_LABEL);
    process_message_as_error = true;   
  }
  // If we don't have a label, then only if the delim was found is the message considered an error
  // (b/c a malformed date string)
  else if(metaObj.found_delim && !metaObj.successful_parse)
  {
    debug("Processing message as error because found delimeter in message, but could not parse it successfuly");
    process_message_as_error = true;    
  }

  if(process_message_as_error)
  {
    if(applyErrorLabel(message))
    {
      parse_errors.push("Sorry! There was an error parsing your message with subject: '"+message.getSubject()+"'. <br/> "+
                      "The reason for this error was: '"+metaObj.error_msg+"'. <br/>"+
                      "A new label was applied to this message:<a href='https://mail.google.com/mail/?#label/"+DELAY_SEND_ERROR_LABEL+"'>"+DELAY_SEND_ERROR_LABEL+"</a>. <br/>"+
                      "Gmail Delay Send will ignore this message until you fix the problem and remove that label. <br/>"+
                      "If you have any questions please see the page on <a href='http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendErrors'>common problems</a>");
    }
    else
    {
      parse_errors.push("There was a problem with a message and we tried to apply the error label, but that was un-successful also. It's not a good day  :-(");
    }
  }
}

function successfullyParsedAndSentMessage(message)
{
  var successfullyParsedAndSent = false;
  
  var metaObj = parseMessageSubject(message.getSubject(), message.getDate());
  
  if(!metaObj.found_delim || !metaObj.successful_parse)
  {
    debug("The message was malformed in some way. Found delimeter:"+metaObj.found_delim+". Successful date parse:"+metaObj.successful_parse);
    handleMalformedMessage(message,metaObj);
  }
  // If it is time to send the message, attempt to do so
  else if(timeToSendMessage(metaObj.sendDate) && sendMessage(message, metaObj))
  {
    successfullyParsedAndSent = true;
  }
  
  return successfullyParsedAndSent;
}

function processThread(thread)
{
  var allMessagesSent = true;
    
  var messages = thread.getMessages();

  for(var i=0; i<messages.length; i++)
  {
    if(!successfullyParsedAndSentMessage(messages[i]))
      allMessagesSent = false;
  }
  
  if(DELAY_SEND_LABEL == null)
  {
    debug("Because we aren't using a label, skipping the removal process");
  }
  else if(allMessagesSent)
  {
    debug("All messages sent for this thread.. Removing label");
    thread.removeLabel( executeCommand ( function() { return GmailApp.getUserLabelByName(DELAY_SEND_LABEL); } ) );
  }
}

function processThreads(threads)
{
  for(var i=0; i<threads.length; i++)
    processThread(threads[i]);
}

// returns true/false if the message was sent
function sendMessage(message, metaObj)
{
  // Copies the given thread into another email
  // sends that mail, archive the old thread, and remove the label.
  var body = message.getBody();
  var cc = message.getCc();
  var from = message.getFrom();
  var to = message.getTo();
  var subject = metaObj.newSubject;
  var attach = message.getAttachments();
  
  executeCommand( function() { GmailApp.sendEmail(to, subject, body, {htmlBody: body, cc: cc, replyTo: from, attachments: attach} ); } );
  
  var log = "<table border=\"1\">";
  log += "<tr><th> Date Sent </th><th> To </th><th> CC </th><th> From </th><th> Subject </th><th> Body </th><th> Attachments </th></tr>";
  log += "<tr>";
  log += "<td>"+new Date()+"</td>";
  log += "<td>"+to+"</td>";
  log += "<td>"+cc+"</td>";
  log += "<td>"+from+"</td>";
  log += "<td>"+subject+"</td>";
  log += "<td>"+body+"</td>";
   
  log += "<td>";
  // Objects are in the form of blobs
  for(var i=0; i<attach.length; i++)
  {
    var blob = attach[i];
    
    log += " "+blob.getName()+"<br/>";
  }
  log += "</td>";
            
  log += "</tr></table>";
  
  debug(log);
  
  receipts.push(log);
  
  message.moveToTrash();
  
  return true;
}

function array_to_table(arr)
{
  if(!arr || !arr.length)
    return "";
  
  var toReturn = "<table border=\"1\"1>";
  for(var i=0; i<arr.length; i++)
  {
    toReturn += "<tr>"+arr[i]+"</tr>";
  }
  toReturn += "</table>";
  
  return toReturn;
}

/* Depending on the user settings send them logs/receipts */
function sendLogs()
{
  if(SEND_RECEIPTS)
    sendEmailToSelf(SCRIPT_NAME+" -> Receipts", array_to_table(receipts));

  
  if(SEND_PARSE_ERRORS)
    sendEmailToSelf(SCRIPT_NAME+" -> Parsing Errors", array_to_table(parse_errors));

  
  if(SEND_DEBUG_LOG)
    sendEmailToSelf(SCRIPT_NAME+" -> Debug Logs",array_to_table(debug_logs));
  
}

function sendEmailToSelf(subject, body)
{
  if(body.length == 0)
     return;

  var yourEmailAddress = executeCommand(function() { return Session.getActiveUser().getEmail(); } );
  
  debug("Sending email to: "+yourEmailAddress+" with content:"+body);
  
  // Add footer to emails with helpful links
  body += "<br/>";
  body += "<hr/>";
  body += '<table width="600" style="width:600px" cellspacing="0" cellpadding="0" align="center">';
  body += "<tr> <a style='font-size:"+EMAIL_FOOTER_TEXT_SIZE+"px;' href='http://code.google.com/p/gmail-delay-send'> "+SCRIPT_NAME+" Homepage </a>";
  body += "|| <a style='font-size:"+EMAIL_FOOTER_TEXT_SIZE+"px;' href='http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendErrors'> Common Problems </a>";
  body += "|| Script Version: "+USER_SCRIPT_VERSION+" & "+DOWNLOAD_SCRIPT_VERSION+" </tr>";
  body += '</table>';
  
  executeCommand( function() { MailApp.sendEmail(yourEmailAddress, subject, body, {noReply: true, replyTo: SCRIPT_NAME, htmlBody: body}); } );
}

function loadSetting(sheet, cell, defaultValue)
{
  var value = sheet.getRange(cell).getValue();
  
  if(value == null)
    value = defaultValue;

  return value;
}


function loadOnOffSetting(sheet, cell, defaultValue)
{
  var value = sheet.getRange(cell).getValue();
  
  if(value == null)
    value = defaultValue;
  if(/^on$/i.test(value))
    value = true;
  else if(/^off$/i.test(value))
    value = false;

  return value;
}

function loadLabelSetting(sheet, cell)
{
  var value = sheet.getRange(cell).getValue();
  
  if(value == null || /^none$/i.test(value) || value.length == 0)
    value = null;

  return value;
}

function loadSettingsFromSpreadsheet()
{
  /* Load the user values from the spreadsheet, if there are any problems
     use the default values instead */
  var sheet = executeCommand( function() { return SpreadsheetApp.getActiveSpreadsheet(); } );
  
  SEND_RECEIPTS = loadOnOffSetting(sheet, SEND_RECEIPTS_CELL, DEFAULT_SEND_RECEIPTS);
  SEND_PARSE_ERRORS = loadOnOffSetting(sheet, PARSE_ERROR_CELL, DEFAULT_SEND_PARSE_ERRORS);
  SEND_DEBUG_LOG = loadOnOffSetting(sheet, DEBUG_CELL, DEFAULT_SEND_DEBUG_LOG);
  DELIMITER = loadSetting(sheet, DELIM_CELL, DEFAULT_DELIMITER);
  DELAY_SEND_LABEL = loadLabelSetting(sheet, LABEL_NAME_CELL, DEFAULT_DELAY_SEND_LABEL);

  debug("== Settings ==");
  debug("  Receipts: "+SEND_RECEIPTS);
  debug("  Errors: "+SEND_PARSE_ERRORS);
  debug("  Debug: "+SEND_DEBUG_LOG);
  debug("  Delim: "+DELIMITER);
  debug("  Label: "+DELAY_SEND_LABEL);
  debug("================");
  
  DELAY_SEND_REGEX = new RegExp(DELIMITER+" [^"+DELIMITER+"]+$","i"); 
}

// Function called on event timer
function main()
{ 
  loadSettingsFromSpreadsheet();
  
  debug("Checking if user has the delay send label");
  
  // If we just created the label then we know there can't be any emails to send yet.
  if(createLabelIfNeeded())
    return;
  
  // Found the label, lets see if anything is in it
  var threads = getThreadsInLabel();
  
  if(threads.length > 0)
  {
    debug("Found "+threads.length+" threads to process");
    processThreads(threads);
  }
  else
    debug("No threads found to process.. exiting");
  
  check_for_notification_emails();
  
  sendLogs();
}

function getSheet()
{
  return SpreadsheetApp.getActiveSheet();
}

function parseDate(str)
{
  return Date.parse(str);
}
```