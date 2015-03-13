# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---



## Creating your first email ##
> Once you have everything installed, you can follow these steps on how to create your first scheduled email.

  * The first time the script runs it will create a label in gmail called "DELAY\_SEND'. If this label doesn't exist yet and you don't want to wait for it to be created automatically you can follow the steps below. **NOTE**: You don't need to perform these steps every time you want to schedule an email to be sent.
    * Open [google docs](http://docs.google.com).
    * Open the spreadsheet that contains the Gmail Delay Send script.
    * When the `Gmail Delay Send` menu bar option appears, select it then `Run now`. This will make sure that the `Delay Send` label has been created.
  * Open [Gmail](http://gmail.com).
  * Compose an email to yourself
  * Set the title as `Testing Gmail Delay Send -- now`
  * Save the email as a draft
  * Open your `Drafts` folder.
  * Apply the `DELAY_SEND` label to the email you just created.
  * Done! The next time your script runs (usually every 5 minutes) your email will be sent!

  * **NOTE** also remember that if you want to skip the requirement of adding the "DELAY\_SEND" label follow the instructions [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendWithoutLabel)
  * **NOTEII** In this example we used the string "now" to send the message right away. You usually don't want messages to be sent right away (or why would you be using this script?  ;-) There is a help page [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendSpecifyingDates) describing all the possibilities of how to format your message's subject line to have it sent with you want.