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
