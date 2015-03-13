# Common Problems #
> This page is dedicated to the most common problems people are having with Gmail Delay Send .8.

  * Remember that the special character that you choose must be the first character on the first line in the body of the email. Following that must be the date that you would like to send.

> For example, this is an email message that will **NOT** work because the special character is in the email subject line instead of the body:

> Subject Line:
```
  Lets go for a bike ride @+5 minutes
```

> Email Body:
```
  I am ready whenever you are.
```


> This is another email message that will **NOT** work because the special character and date is not on the first line:

> Subject Line:
```
  Lets go for a bike ride 
```

> Email Body:
```
  I am ready whenever you are.
  @+5 minutes
```

> This is the correct way to send this message:

> Subject Line:
```
  Lets go for a bike ride 
```

> Email Body:
```
  @+5 minutes
  I am ready whenever you are.
```

  * There are lot of resources to help you determine why you are having problems, please read the [FAQ](https://code.google.com/p/gmail-delay-send/wiki/GmailDelayFAQ_8), [configuration options](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendOptions_8) and if you're still having a problem file a [bug](https://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendDebugging_8) (first checking if somebody has already reported the issue).