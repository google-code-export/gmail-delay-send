

# Options #

Gmail Delay Send offers some options to configure in order for the product to better suite your needs. Hopefully the default settings will work for most, but see below how it can be customized.

You can configure GmailDelaySend by re-visiting the link that you clicked to [install](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendInstall_8).

**NOTE:** Any changes you make to the script must be saved by clicking the 'Save Preferences' button.

### Enable ###
Gmail Delay Send is a script which runs on a 5 minute trigger on Google servers ([what's a trigger?](https://developers.google.com/apps-script/understanding_triggers)).

Every 5 minutes it scans your inbox to see if any emails are ready to be sent. This button enables and disables this automatic running of the script.

Basically it's the On/Off :-)

### Current Time Zone ###
Currently there is no way for a user to adjust the timezone of a web app script in Google Scripts ([feature request](https://code.google.com/p/google-apps-script-issues/issues/detail?id=2845)). To workout around this issue you can adjust the timezone that Gmail Delay Send uses with this drop down.

Gmail Delay Send attempts to guess at the correct timezone for you by using the default timezone for your Google Calendar. Be assured that nothing besides the timezone is used from your Calendar.

### Send Email Receipts ###
After an email is successfully sent you can configure the script to send you a confirmation.

NOTE: You probably don't need this turned on along with 'BCC me'. The BCC option has some other very nice features, so consider that first.

### Error Notifications ###
Gmail Delay Send runs multiple times a day on shared Google machines. Once in a while a service (eg. gmail or calendar) might be unavailable for a brief time.  During this time the script will fail to run.  Once in a while these errors can be ignored because the script will simply run again (although your email will be late being delivered). You can enable/disable delivery of these messages with this setting.

### Email me debug logs ###
Lots of logging happens to help debug issues. In general you don't want this turned on unless you're debugging a problem.

### Require Label ###
There are two indicators that Gmail Delay Send can use to see if an email draft should be considered for automatic sending. One of optional indicators is that a certain label must be applied to the draft in order to be considered to send.  This special label is **'GmailDelaySend/ToSend'**.

If you choose to turn this setting off, just remember that any email that contains the special character could try to be understood by the script and sent automatically. Hopefully the special character (described below) is unique enough to not be a common thing in people's email.

### Parsing Delimiter ###
['Parsing'](http://en.wikipedia.org/wiki/Parsing) is the process of trying to understand what a symbol means. In the context of Gmail Delay Send, the script tries to 'parse' (or understand) the date that you desire your email to be sent.  In order to avoid sending emails that you don't mean to be sent the script makes sure that you have a special character next to the date. You can change this special character(s) by entering them here.

For example, the default character is '@'. This means that if the first line of your message is '@5pm', your email will be sent at 5pm. If the first line of the message was '!!5pm', Gmail Delay Send would not be able to parse that date and not send your email at 5.

If you commonly use the character '@' on the first line of an email and are concerned about Gmail Delay Send mistakenly sending emails you could change the special character to '!!' for example.

### Trigger ###
Gmail Delay Send is a script that runs on Google servers every so often according to a [trigger](https://developers.google.com/apps-script/understanding_triggers). This option allows you to control how often the trigger runs. Having it run more often will allow you to send mails at more fine grained intervals (eg. 1 minute instead of 5 minutes).

The only reason **not** to have everybody run at 1 minute is that the servers that run these scripts are a shared resource. If all scripts were run at 1 minute Google might not be able to offer this as a free service. So please only adjust if you actually need to.

### Test a date or time ###
Back to parsing again (described above).. Because the desire was to keep Gmail Delay Send from requiring any extra GUI from the user, the script tries to parse the time/date that you type. You can imagine that this is a difficult process, terms ranging from 'tomorrow' to '2013/1/03 6pm' must be understood. Gmail Delay Send uses a javascript library called [datejs](http://www.datejs.com) to perform the hard work.

Not all date/time formats are understood by datejs, so this is an area to quickly experiment and see what's possible. Some examples and 'gotcha's are below:

  * Examples
    * next friday
    * Tuesday 5pm
    * Wednesday 12:30
    * 14th 6pm
    * +8 minutes
    * wednesday
    * august 21 11:00
    * 10:20PM
    * 29th 8am

  * Gotchas:
    * When you don't specify a time, such as 'tomorrow' the time defaults to 12:00.
    * 'tomorrow, 5pm' doesn't work
    * DateJS isn't smart enough to discern when you're using the date relative to the current time. For example if it's 8am and you schedule an email to be sent at 6:30am you might intend to mean the next day's morning. Instead DateJS will think it's 6:30AM of the current day. Same with days of the week, if it's 'Tuesday' and you enter 'Monday' it will think you mean yesterday.

It might take some getting used to, but datejs does a good job parsing  :-)

### Force a run ###

While learning how Gmail Delay Send works or debugging you might find it useful to not have the script run on a trigger but only a single time. Combined with sending debug logs this is a powerful debugging tool.

NOTE: Be careful when you have the script running on a trigger and forcing runs with this method. Might get some funny errors if you do.