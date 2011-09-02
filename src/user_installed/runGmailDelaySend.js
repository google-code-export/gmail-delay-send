var URLS = [];

// TODO create one (compressed) script to download
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Globals.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Utils.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/date-en-US.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/CustomDate.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/FormatSpreadsheet.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/GmailDelaySend.js");
URLS.push("http://gmail-delay-send.googlecode.com/git/src/downloaded/Triggers.js");

var code_string = null;

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

function runGmailDelaySend()
{
  eval(getContext());
  main();
}

function onEdit()
{
  eval(getContext());
  onEditContext();
}

function onInstall()
{
  onOpen();
}

function onOpen()
{
  eval(getContext());
  onOpenContext();
}

function menuItemClear()
{
  eval(getContext());
  clear();
}

function menuItemRestoreDefaults()
{
  eval(getContext());
  restoreDefaults();
}
