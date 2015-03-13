# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---



# Gmail Delay Send #

**NOTE**: Please join the google [group](http://groups.google.com/group/gmaildelaysend) so I can keep you up to date with any bug fixes / releases.

## Welcome ##
> Thanks for installing Gmail Delay Send! This utility will allow you to schedule emails to be send at a later time using gmail. Below you will find some of the frequently asked questioned about this program.
> There are two steps to installing Gmail Delay Send. Visit the GmailDelaySendInstall page to review them.

### What does Gmail Delay Send do? ###
> Gmail Delay Send uses Google App Scripting to give you the ability to schedule emails to be sent at a later date.  More information about [Google Apps Scripting](http://code.google.com/googleapps/appsscript)

### Cool! How do I specify when I would like my email sent? ###
> Easy!

> When you are composing an email, at the end of the subject line you write when you would like the email to be delivered.  For example if the subject of my email was:

```
   "Who wants to do P90X tomorrow?"
```

> And I wanted the email to be sent this Tuesday at 4PM I would add the special characters **--** (dash-dash) then the date and time that I would like the email to be sent. So the resulting subject of the email would be:

```
  "Who wants to do P90X tomorrow -- Tuesday 4pm"
```

The final step is to apply the label **GMAIL\_DELAY\_SEND** to your draft email.  (If you don't have this label, it will be created for you the first time the script runs).

### Specifying dates ###
> If you need more help specifying the date/time when you want the messages to be sent there is an entire [wiki](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendSpecifyingDates) page with tips.

### How do I apply a label to an email in my Draft folder? ###
Click on your Draft Folder on the left hand side of your gmail page. You can drag the email into the GMAIL\_DELAY\_SEND label on the left hand bar, or open the draft and apply the label manually. See the Gmail help page for more information on applying [labels](https://mail.google.com/support/bin/answer.py?hl=en&answer=118708).

### What if I don't want to use a label? ###
> If you don't want to use a label to mark all the emails that you want to delay send, you can remove the label from the spreadsheet (By default the label is "DELAY\_SEND". See more information about how this works [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendWithoutLabel)

### How do I know the email was sent? ###
> When your email is automatically sent, you will be sent a 'receipt' of when it was sent and to whom.  (You can turn off this behavior if you like, see how to [customize your settings](http://code.google.com/p/gmail-delay-send/wiki/customize))

### What if I make a mistake typing the date/time that I would like the email sent? ###
> After you have saved the draft copy of the email, you can always go back and edit the subject line if it contains a mistake. If you don't the subject line contains a mistake and the Gmail Delay Send script cannot parse the date that you have entered for your email you will be sent a warning email.  Another label will be applied to the problematic email and until you fix the error and remove the label, the script will ignore that message.
> If you would like to test a date string such as "next tuesday 7pm" work you have two options.
> Directly in your GmailDelaySend menu on your spreadsheet there is a 'test a date' option. Enter your string and the same date parsing will take place and let you know if the date could be parsed.
> Your other option is to visit the date parsing library that GmailDelaySend uses. You can visit the DateJS library [here](http://datejs.com).

### Are there any limitations? ###
> You can compose your email in plain text or HTML and things will work fine. Currently unsupported is:
  * Bcc (limitation in [API](http://code.google.com/p/google-apps-script-issues/issues/detail?id=872&q=blairkutz&colspec=Stars%20Opened%20ID%20Type%20Status%20Summary%20Priority%20Component%20Owner)

### Is that all I have to do? ###
> Just one more step.. There are a few more steps to complete to install the program. Visit the GmailDelaySendInstall page for detailed instructions.

## Creating your first email ##
> Follow the instructions [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendFirstMessage) to walk through your first email creation!.

## Un-installing ##
> If you decide that you don't want to use Gmail Delay Send any longer, un-installing is easy. Follow the steps on this [page](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendUninstall)