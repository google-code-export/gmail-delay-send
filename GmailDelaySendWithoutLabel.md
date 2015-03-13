# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---


# Operating without a label #

> By default Gmail Delay Send has a label field pre-populated with the value of "DELAY\_SEND". Only draft emails with this label applied will be checked to see if they should be sent.

> With the latest release of Gmail Delay Send (0.7.5) you can optionally remove the label value from your spreadsheet. This causes Gmail Delay Send to look through all the emails in your draft folder to see if they can be sent.

> The advantages of this new functionality is that you can now skip the step of applying the "DELAY\_SEND" label over and over.

> The disadvantages are you could inadvertently send an email that you didn't mean to send.  For this to happen however Gmail Delay Send must find the special character at the end of the subject line of the email ("--") and the subject line must have a date parse-able by the script.  These two things are probably unlikey to be in your usual messages but there is always a risk.