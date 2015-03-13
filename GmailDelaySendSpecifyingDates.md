# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---


## Specifying Dates ##
> In order to use Gmail Delay Send effectively you need to know how to specify the date/time in which an email will be sent.  This page is to help you become comfortable with the syntax, so that your emails are sent exactly when you want them to.

## Background ##
> Gmail Delay Send uses a javascript library called [datejs](http://www.datejs.com/). Any string that datejs can parse you can use inside Gmail Delay Send.

## How to test ##
> There are 2 ways to test a date string before using it in an email:
  * Inside your spreadsheet that you installed Gmail Delay Send, there is a spreadsheet cell that instructs you to enter a date string. You can type a string in the cell to see if the script is able to parse it. (eg. you can type 'tomorrow' and it should return the date/time of tomorrow).
  * You can go directly to the [datejs](http://www.datejs.com) site and use the text-box on their main page.

## Some Examples ##
> Below are some common examples of subject lines that you can use:

| My email subject -- today |
|:--------------------------|
| My email subject -- tomorrow |
| My email subject -- next friday |
| My email subject -- thursday 6:30pm |
| My email subject -- 10/11 5am |
| My email subject -- 9pm |
| My email subject -- +40 minutes |

**NOTE:** if the time is not specified then 12am is assumed. eg. 'tomorrow' is assumed to be 12 at night.

## Gotchas ##
> There are a couple common mistakes (I say "mistakes", but more like unexpected interpretations from the datejs library) that are reviewed below:

| **String** | **Expected** | **Actual** | **Correct String** |
|:-----------|:-------------|:-----------|:-------------------|
| "today"  | end of day? | 12am that morning | "now" |
| "Monday" | the next Monday | the first Monday of the week (eg. yesterday if today is Tuesday) | "next Monday" |

## What if I make a mistake in my date/time? ##
> If you make a mistake in your date Gmail Delay Send will send you an email letting you know that it didn't understand you date and suggests that you fix it, or remove the "DELAY\_SEND" label.