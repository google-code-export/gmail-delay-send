var DATE_JS_URL = "http://gmail-delay-send.googlecode.com/files/date-en-US.js";
var DATE_JS_CUSTOM = "http://gmail-delay-send.googlecode.com/files/date_js_custom.js";
var DELAY_SEND_URL = "http://gmail-delay-send.googlecode.com/files/GmailDelaySend_2011_08_15.js";
var URLS = [DATE_JS_URL,DATE_JS_CUSTOM,DELAY_SEND_URL];
var executeInContext = null;

function runGmailDelaySend()
{
  getContext();
  executeInContext( function () { main(); } );
}

function onEdit()
{
  getContext();
  executeInContext( function () { onEditContext(); } );
}

function onInstall()
{
  onOpen();
}

function onOpen()
{
  getContext();
  executeInContext( function () { onOpenContext(); } );
}

function getContext()
{
  if(executeInContext)
    return;

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
    
    eval(code);
  }

  Logger.log("Code has been successfully downloaded and eval()'ed");

  executeInContext = (function(functionToCall)
                      {
                        functionToCall();
                      });

  Logger.log("Calling user supplied function\n");
 

  Logger.log("Done calling user supplied function\n");
  
  if(false)
  {
   // B/C our code is dynamically run we need to let the compiler think we need
   // these permissions before we run
   GmailApp.getUserLabelByName("null");
   MailApp.getRemainingDailyQuota();
   null.moveToTrash();
  }
}
