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
  this.originalSubject; /* The original subject line of the message */
  this.newSubject; /* Subject line after we have removed date data */
  this.valid; /* Boolean if the thread contained a date to parse */
  this.sendDate; /* Date object when we should actually send this message */
  this.error_msg; /* The error message (if !valid) why this thread is NOT valid */
}

function createLabelIfNeeded()
{
  var label_created = false;
  
  if(DELAY_SEND_LABEL != null && !userHasDelaySendLabel())
  {
    debug("Could not find: "+DELAY_SEND_LABEL + "label, creating now..");
    createDelaySendLabel();
    sendLogs();
    label_created = true;
  }
  return label_created;
}


/* Returns true/false if the user has
   the delay send label created */
function userHasDelaySendLabel() 
{
  var labels = executeCommand( function() { return GmailApp.getUserLabels(); } );
  for(var i=0; i<labels.length; i++)
    if(labels[i].getName() == DELAY_SEND_LABEL)
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
  var search_string = "";
  
  if(DELAY_SEND_LABEL != null)
    search_string += "in:"+DELAY_SEND_LABEL;

  search_string += " + in:drafts";
  
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
    metaData.valid = false;
    metaData.error_msg = "Subject: "+subjectLine+" did not match.";
  }
  else if(match.length != 1)
  {
    metaData.valid = false;
    metaData.error_msg = "Found more than 1 match in subject line:"+subjectLine;
  }
  else
  {
    var date_string = subjectLine.slice(match.index+DELIMITER.length,subjectLine.length);
   
    debug("Date String: "+date_string);
    
    Date.setRelativeTo(messageDate);
    metaData.sendDate = parseDate(date_string);
 
    if(metaData.sendDate == null)
    {
      debug("Error Parsing date string: '"+date_string+"'");
      metaData.error_msg = "Error parsing date string:'"+date_string+"'";
      metaData.valid = false;
    }
    else
    {
      // Success parsing
      debug("Date to send: "+metaData.sendDate); 
      metaData.originalSubject = subjectLine;
      metaData.valid = true;
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

function successfullyParsedAndSentMessage(message)
{
  var successfullyParsedAndSent = false;
  
  var metaObj = parseMessageSubject(message.getSubject(), message.getDate());
  
  if(!metaObj.valid)
  {
    parse_errors.push("Could not parse message with subject: '"+message.getSubject()+"' because "+metaObj.error_msg);
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
  
  if(allMessagesSent)
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
  
  executeCommand( function() { GmailApp.sendEmail(to, subject, body, {htmlBody: body, cc: cc, replyTo: from} ); } );
  
  var log = "<table border=\"1\">";
  log += "<tr><th> Date Sent </th><th> To </th><th> CC </th><th> From </th><th> Subject </th><th> Body </th></tr>";
  log += "<tr>";
  log += "<td>"+new Date()+"</td>";
  log += "<td>"+to+"</td>";
  log += "<td>"+cc+"</td>";
  log += "<td>"+from+"</td>";
  log += "<td>"+subject+"</td>";
  log += "<td>"+body+"</td>";
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
  else if(/on/i.test(value))
    value = true;
  else if(/off/i.test(value))
    value = false;

  return value;
}

function loadSettingsFromSpreadsheet()
{
  /* Load the user values from the spreadsheet, if there are any problems
     use the default values instead */
  var sheet = executeCommand( function() { return SpreadsheetApp.getActiveSpreadsheet(); } );
  
  SEND_RECEIPTS = loadSetting(sheet, SEND_RECEIPTS_CELL, DEFAULT_SEND_RECEIPTS);
  SEND_PARSE_ERRORS = loadSetting(sheet, PARSE_ERROR_CELL, DEFAULT_SEND_PARSE_ERRORS);
  SEND_DEBUG_LOG = loadSetting(sheet, DEBUG_CELL, DEFAULT_SEND_DEBUG_LOG);
  DELIMITER = loadSetting(sheet, DELIM_CELL, DEFAULT_DELIMITER);
  DELAY_SEND_LABEL = loadSetting(sheet, LABEL_NAME_CELL, DEFAULT_DELAY_SEND_LABEL);

  debug("== Settings ==");
  debug("  Receipts: "+SEND_RECEIPTS);
  debug("  Errors: "+SEND_PARSE_ERRORS);
  debug("  Debug: "+SEND_DEBUG_LOG);
  debug("  Delim: "+DELIMITER);
  debug("  Label: "+DELAY_SEND_LABEL);
  debug("================");
  
  DELAY_SEND_REGEX = new RegExp(DELIMITER+" [^"+DELIMITER+"]+$","i"); 
}
