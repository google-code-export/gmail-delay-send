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
  
  //
  addUserOption(sheet, LABEL_LABEL,LABEL_OPTION,"Label name",LABEL_DEFAULT);
  addUserOption(sheet, PARSING_LABEL,PARSING_OPTION,"Parsing Deilimiter",PARSING_DEFAULT);
  
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