function onOpenContext()
{
  /*
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Clear", functionName: "clear"},
                      {name: "Restore Defaults", functionName: "restoreDefaults"}];
  ss.addMenu("Gmail Delay Send", menuEntries);
  */
  
  //if(firstTime())
  //{
    //Browser.msgBox("Welcome to Gmail-Delay-Send!");
    restoreDefaults();
  //}
}

function onEditContext(event)
{ 
  var range = event.source.getActiveRange(); 
  var value = range.getValue();  
  var location = range.getA1Notification();
  
  if( (location == RECEIPT_OPTION || location == ERROR_OPTION || location == DEBUG_OPTION) && ON_OFF_REGEX.match(value) == null)
  {
    Browser.msgBox("Sorry, you can only change these boxes to '"+ON+"' or '"+OFF+"'");
    range.setValue(ON);
  }
}

/* Function called on event timer */
function main()
{
  loadSettingsFromSpreadsheet();
  
  debug("Checking if user has the delay send label");
  
  if(DELAY_SEND_LABEL != null && !userHasDelaySendLabel())
  {
    debug("Could not find: "+DELAY_SEND_LABEL + "label, creating now..");
    createDelaySendLabel();
    sendLogs();
    return;
  }
  
  // Found the label, lets see if anything is in it
  var threads = getThreadsInLabel();
  
  if(threads.length > 0)
  {
    debug("Found "+threads.length+" threads to process");
    processThreads(threads);
  }
  else
    debug("No threads found to process.. exiting");
  
  sendLogs();
}
