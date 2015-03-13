## Creating your first email ##
> Once you have everything installed, you can follow these steps on how to create your first scheduled email.

The first time the script runs it will create a label in gmail called **GmailDelaySend/ToSend**. If this label doesn't exist yet wait 5 minutes after [enabling](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Enable) the script and it should be created (NOTE: You might have to refresh your gmail page for the new label to show up).

Once the label has been created follow the steps below:
  * Open [Gmail](http://gmail.com).
  * Compose an email to yourself
  * Set the title as `Testing Gmail Delay Send`
  * Set the email body to contain:
```
@now
Hello World
```
  * Click on the lower right part of the compose pane (little down arrow). Label -> GmailDelaySend/ToSend.
  * Now close the draft (little 'x' in upper right).
  * Done! The next time your script runs (usually every 5 minutes) your email will be sent!

  * **NOTE** also remember that if you want to skip the requirement of adding the **GmailDelaySend/ToSend** label follow the instructions [here](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Require_Label)

  * **NOTEII** In this example we used the string "now" to send the message right away. You usually don't want messages to be sent right away (or why would you be using this script?  ;-) There is a help page [here](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Test_a_date_or_time) describing some of the possibilities of how to format your date/times.