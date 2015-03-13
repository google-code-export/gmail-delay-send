# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---



# Deployment Method #

> Google Apps Script API has a nice security [model](http://code.google.com/googleapps/appsscript/guide_security.html) but one of the side effects is that it makes updates very hard to apply in certain situations.  When a script requires access to a user's personal data, they must have the script installed under their account. Which means they have to copy/paste a script into a spreadsheet they own, or install a script through the script gallery.  Once they do this, the script is no longer connected to the original source (think copy versus pointer) so any updates need to be manually installed by the user.

> This makes is really hard to have a project that is going through multiple iterations like this one (eg. I'm not going to get it right the first couple times  ;-)

## One Solution ##

> This solution definitely has its draw-backs but it does enable you to push new releases to users without them having to re-install anything.

> The general idea is that you can use the [UrlFetch](http://code.google.com/googleapps/appsscript/service_urlfetch.html) service to download the javascript code you would like to run, then execute it on the fly.
> An example is worth 1,000 words so lets just do that.

> (For this example I used a google code project, but you could use anything that can host files for download.)

## Example ##

> The file posted on the server [here](http://gmail-delay-send.googlecode.com/files/test.js) contains:
```
var NAME="blair kutzman";

function get_name()
{
  return NAME;
}
```

> Now inside a google script editor window paste the following:
```
function main()
{
  var resp = UrlFetchApp.fetch("http://gmail-delay-send.googlecode.com/files/test.js");
  if(resp.getResponseCode() != 200)
  {
    // Error handling
    Logger.log("Error! Could not download file\n");
  }
  else
  {
    eval(resp.getContentText());
    Logger.log("My name is:"+get_name());
  }
}
```

> Run the main function, View->Logs and you see:
```
My name is:blair kutzman
```

> The idea is that you can switch out test.js to something like:
```
var NAME="Your Name Here";

function get_name()
{
  return NAME;
}
```

> And you just remotely upgraded your users!

## Gotchas ##

> Seems easy and cool, but there are some problems..

### Permissions ###
> The first is that if the script that your download accesses any google api services (eg. if test.js looked like:
```
var NAME="blair kutzman";

function get_name()
{
  Browser.msgBox("Hello! my name is:"+NAME);
  return NAME;
}
```

> Then when you execute your script you'll get an error like this as a red banner across the screen.
```
You do not have permission to call msgBox
```

> I think the system works by looking through the script you're about to execute for the services that you need to run. Because it doesn't see `Browser.msgBox` as a service that you need, it doesn't ask for your permission to run it. So when you download the code and ask for that permission it's a surprise and an error.

> The way that I got around this, was to request all the permissions that I needed in the script that the user installs. So it might look like:
```
function main()
{
  var resp = UrlFetchApp.fetch("http://gmail-delay-send.googlecode.com/files/test.js");
  if(resp.getResponseCode() != 200)
  {
    // Error handling
    Logger.log("Error! Could not download file\n");
  }
  else
  {
    eval(resp.getContentText());
    Logger.log("My name is:"+get_name());
  }
}

function never_called()
{
  Browser.msgBox("");
}
```

> Even though the `never_called` function is never called it is picked up by the parser and the permissions problem is solved.

> This is the first restriction on this deployment method. When the user installs there script **you need to know ahead of time all the services you'll need or they will get these error messages**.

### Triggers ###
> The next problem that I have found is during the onInstall, onOpen and onEdit triggers. You can read more about them [here](http://code.google.com/googleapps/appsscript/guide_events.html). There is some sort of time limit behind the scenes when accessing performing these triggers because you are not able to use the UrlFetch trick in these cases. An example might help.

> Lets say the user installed script is (same as before but the `main()` function has been renamed to `onOpen()`):
```
function onOpen()
{
  var resp = UrlFetchApp.fetch("http://gmail-delay-send.googlecode.com/files/test.js");
  if(resp.getResponseCode() != 200)
  {
    // Error handling
    Logger.log("Error! Could not download file\n");
  }
  else
  {
    eval(resp.getContentText());
    Logger.log("My name is:"+get_name());
  }
}
```

> Your transaction log looks like:
```
SpreadsheetApp.getActiveSpreadsheet()
UrlFetchApp.fetch([http://gmail-delay-send.googlecode.com/files/test.js]
```

> And the log will be empty.

> The UrlFetch is performed, but it never completes. I'm not sure why this happens, but to work around it, all the code that needs to execute during the onInstall, onOpen and onEdit triggers needs to be local. BUT the code executed during a user defined trigger (eg. time based) works just fine.  :-)

## Other Considerations ##

### Download versus SCM ###
> To host the code to be pulled down and run, I chose to post it as a download.  Another option is to check it into the SCM system and use a direct URL to the file.  (eg. a URL to a downloaded file looks like: http://gmail-delay-send.googlecode.com/files/test.js versus a URL for a file checked into SCM: http://gmail-delay-send.googlecode.com/git/src/downloaded/Globals.js)
> I chose to use the downloads b/c I thought there might be some extra support inside google code for all the download requests that the file is going to receive. The downside is that it takes a while to update. I delete the current download and upload a new one, and it could take up to a day for the new file to show up when you download it. I would assume that checking into the SCM system would not have this caching problem, but not sure of it's ability to scale to the number of requests required.
> If anybody has experience with this, I would love to hear it  :-)


### Stack Size ###
> I'm not sure if this is unique to my project, because I am pulling in a pretty large script ([date.js](http://datejs.com/)), but I have had issues where I "exceed the maximum stack size" that the Google Apps Scripts allow.
> Searching around online for other people that have had this issue, it's mostly attributed to infinite loops.
> I'm not sure if it's a function of pulling scripts in and evaling them or just a lot of code. If anybody had some feed back on this it would be appreciated  :-)