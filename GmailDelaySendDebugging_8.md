# Debugging and reporting issues #

To save both you and I time, before filing an issue against the project please check the following:

  * If you are using version 0.7.7 of Gmail Delay Send support will be limited. Many bug fixes are in the newest version 0.8. Please consider [upgrading](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendTransition_8)

  * Check the list of [common problems](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendErrors_8) and the [FAQ](https://code.google.com/p/gmail-delay-send/wiki/GmailDelayFAQ_8).

  * You can try to turn on [error notifications](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Error_Notifications) to see if the script is having trouble running.

  * Check if the issue has already been [reported](https://code.google.com/p/gmail-delay-send/issues/list) (search 'All issues').

### Please include in your bug report ###

If your issue is not resolved by any of the above and you would like to file an issue please include the following to the bug report:

  * An example of the email that isn't being sent correctly. Including the 'original message' provides the most [information](https://support.google.com/mail/answer/22454?hl=en).

  * A debug report trying to send an email is the most helpful thing you can provide. To generate:
    * Stop Gmail Delay Send from running (Turn ['enable'](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Enable) off, and save preferences from the options page.).
    * Turn on [debugging](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Email_me_debug_logs).
    * Compose a **draft** email (don't hit the send button) to be sent with the time of '@now' and apply the required label.
    * [Run once](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8#Force_a_run).
    * Copy paste the email that you get into the bug report. (**NOTE**: Be careful the debugging report doesn't contain anything you don't want everybody to be able to view).