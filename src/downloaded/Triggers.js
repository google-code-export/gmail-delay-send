
// Function called on event timer
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