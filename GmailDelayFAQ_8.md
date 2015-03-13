

# Gmail Delay Send #

**NOTE**: Please join the google [group](http://groups.google.com/group/gmaildelaysend) so I can keep you up to date with any bug fixes / releases.

> Thanks for installing Gmail Delay Send! This utility will allow you to schedule emails to be send at a later time using gmail. Below you will find some of the frequently asked questioned about this program.
> There are two steps to installing Gmail Delay Send. Visit this [page](GmailDelaySendInstall_8.md) to review them.

### What does Gmail Delay Send do? ###
> Gmail Delay Send uses Google App Scripting to give you the ability to schedule emails to be sent at a later date.  More information about [Google Apps Scripting](http://code.google.com/googleapps/appsscript)


### How is version 8 different than previous versions of Gmail Delay Send? ###
> If you're a user of a prior version of Gmail Delay Send there is a page dedicated specifically taking you through the differences [here](GmailDelaySendTransition_8.md)

### Does my computer have to be left on to use Gmail Delay Send? ###
> No. Once you install the script it's running continually on Google servers. You can use any device to compose an email to be sent via Gmail Delay Send and it will be sent at the appropriate time without having to stay logged in.


### Cool! How do I specify when I would like my email sent? ###
> Easy!

> When you are composing an email, on the first line of the email specify when you would like your message to be sent. For example if you had the following email to send:

Subject:
```
Who wants to do P90X tomorrow?
```

Email Body:
```
Lets meet at the gym at 5:30pm.
```

> And I wanted the email to be sent this today at 4PM I would add on the first line of the email a special character (default is '@') and when I want the email sent:

Subject:
```
Who wants to do P90X tomorrow?
```

Email Body:
```
@4pm
Lets meet at the gym at 5:30pm.
```

> The final step is to apply the label **GmailDelaySend/ToSend** to your draft email.  (If you don't have this label, it will be created for you the first time the script runs).

> When the user receives the email the first line that you added ('@4pm') will be removed so they won't have any idea that you used Gmail Delay Send.

### Specifying dates ###
> If you need more help specifying the date/time when you want the messages to be sent there is an entire [wiki](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Test_a_date_or_time) page with tips.

### How do I apply a label to an email in my Draft folder? ###
> Click on your Draft Folder on the left hand side of your gmail page. You can drag the email into the **GmailDelaySend/ToSend** label on the left hand bar, or open the draft and apply the label manually. See the Gmail help page for more information on applying [labels](https://mail.google.com/support/bin/answer.py?hl=en&answer=118708).

### What if I don't want to use a label? ###
> If you don't want to use a label to mark all the emails that you want to delay send, you can remove the label from the spreadsheet (By default the label is **GmailDelaySend/ToSend**. See more information about how this works [here](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Require_Label)

### How do I know the email was sent? ###
> When your email is automatically sent, you will be sent a 'receipt' of when it was sent and to whom.  (You can turn off this behavior if you like, see how to [customize your settings](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Send_Email_Receipts)). You can also configure Gmail Delay Send to send you a bcc of the message.

**NOTE**: Bcc'ing yourself works around some limitations of the Google Apps Script API, take a [look](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#BCC_me).

### What if I make a mistake typing the date/time that I would like the email sent? ###
> After you have saved the draft copy of the email, you can always go back and edit the first line if it contains a mistake. If you have the script configured to require labels and the first line cannot be understood as a date, you will be sent a warning email.  Another label will be applied to the problematic email and until you fix the error and remove the label, the script will ignore that message.  If you have configured Gmail Delay Send to NOT require labels and the first line of the email cannot be understood then you are not sent an email and no error label is applied.

> If you would like to test a date/time see [here](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Test_a_date_or_time) (eg. does the script understand 'next tuesday')?

### I want to send an email every day at 5pm. Can Gmail Delay Send do that? ###
> No, gmail delay send it not meant for that use case. If this is what you require there are two ways to do what you want. If the emails are to yourself (eg. reminders google calendar offers some very cool reminder [functionality](https://support.google.com/calendar/answer/37242?hl=en).

> If the emails need to be delivered to others there is a very good tutorial [here](https://developers.google.com/apps-script/articles/sending_emails) on how you can script this yourself!

### Creating your first email ###
> Follow the instructions [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendFirstMessage_8) to walk through your first email creation!.

### What if I want to change my configuration options later? ###
> Visit the same page that you did to install the script (might want to bookmark that link) which is on the install [page](GmailDelaySendInstall_8.md).

### Un-installing ###
> If you decide that you don't want to use Gmail Delay Send any longer, un-installing is easy. Follow the steps on this [page](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendUninstall_8)

### Reoccurring emails ###
> Gmail Delay Send doesn't support reoccurring emails such as "Send this email every Monday morning."  There are two other solutions for people looking for this.
    * If you would like notifications to come to you (eg. such as a reminder) consider using Google Calendar's [notification](https://support.google.com/calendar/answer/37242?hl=en).
    * If you would like to send emails to others consider writing your own Google Apps Script. There is a fantastic tutorial on [sending mail](https://developers.google.com/apps-script/articles/sending_emails).

### BCC me ###
> (If you've never heard of this feature then you don't need to worry about it).
> When Gmail Delay Send was first implemented mail that was sent via Google Script Apps didn't show up in your 'Sent Mail' folder. Gmail Delay Send worked around this problem by having an option to automatically BCC the sender then setting up a filter that would mark the email as read.
> The initial bug in Google Script Apps was resolved so this feature was removed.

### Quota ###
> Google exposes a lot of services through their Google Apps Scripts API. They do limit how often they can be used to prevent abuse. If you receive an email that has something about "invoked too many times" you might be running into these limits.  More information about quotas is [here](https://developers.google.com/apps-script/quotas). If you are running into your quota here are somethings you might try:
  * There is currently a limit of 50 recipients per any email sent via google apps.
  * Increase the trigger time (eg. 5 minutes instead of 10 minutes).
  * Make sure you don't have a previous version of Gmail Delay Send running behind the scenes. For instructions on how to remove previous versions see [here](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendUninstall).

### I'm concerned about the security of running Gmail Delay Send ###
> A good option is to run your own [instance](GmailDelaySendOwnInstance_8.md)!

### Safari browser ###
> There are reports of issues when attempting to install the script using Safari. While the issue is being resolved you may choose to install the script using a different browser. You can still use Safari to compose messages once the script is installed.

### Multiple accounts ###
> Inside Gmail you may be signed into multiple accounts at the same time.  If you follow the install instructions the script will be installed under the default Gmail account. If you wish to install under a different account, open an [icognito window](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=incognito+window&spell=1) (or your favorite browser equivalent), sign into the account that you wish to install under, then follow the installation instructions.

### Running Gmail Delay Send from Google Apps ###
> By default permissions are setup to not allow scripts to run. To configure them to run you need to be the domain admin and follow these steps:
    1. Go to the "Manage This Domain" control panel
    1. On the Admin Console, click on Security
    1. Click API Reference
    1. API Access: Allow API access.

> Once the permissions are enabled you may then setup/install the script.

> If you are not the domain admin for your account there is another option. If you can configure email to 'send-as' your apps account through a standard gmail account then things should also work.

> eg. Let's say you have two accounts: A@gmail.com and B@school.edu
> You don't have permissions to run under school.edu, but if A@gmail.com can send-as B then running the script under account A should work.

### Send as ###
> A user has reported that when the his 'send as' email address contains capitol letters he was not able to send emails using Gmail Delay Send.  To resolve the issue, change your 'send as' email address to use all lowers.

### How can I help support? ###
> If you love Gmail Delay Send, consider supporting!  We have partnered with [Abstractionary](http://www.abstractionary.com/campaigns/gmaildelaysend) to offer a way for users to get great shirts while showing their support and appreciation for Gmail Delay Send. This fundraising campaign is running for a limited time and ends June 15th.