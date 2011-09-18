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