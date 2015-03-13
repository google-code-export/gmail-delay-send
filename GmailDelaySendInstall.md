# NOTE #

This version of Gmail Delay Send is being deprecated. Please see the [homepage](https://gmail-delay-send.googlecode.com) for more information on the new version


---


---


# How to install GmailDelaySend #

## Video tutorial on setting up Gmail Delay Send ##
> (click the 'watch on youTube' button to see in full-screen)
<a href='http://www.youtube.com/watch?feature=player_embedded&v=VozlyDCsmBk' target='_blank'><img src='http://img.youtube.com/vi/VozlyDCsmBk/0.jpg' width='425' height=344 /></a>


---


## Step 1 -- Installing ##
> There are two methods that you can choose to install the script needed to run Gmail Delay Send. The first method is for the less technical user, but for people who are interested in how/what the script is please try the second option.

> #### Option 1 - Copy existing google doc (less technical) ####
    * Open [this](https://docs.google.com/spreadsheet/ccc?key=0AgKSjMWgSECadGFrSzNWVDgxRVJjVjVqVkZLMzhkSUE&usp=sharing) google doc.
    * Follow the instructions listed in the document:
      * `Sign in` in the upper right hand (for some reason you need to sign into google docs again).
      * Select `File -> Make a copy`. (If `Make a copy` is greyed out, please make sure that you have signed in).
      * You will be prompted to grant the script permission to run. Click accept then re-open the script and follow the popup instructions.
    * **NOTE**  It appears that people who use this method have to manually set their timezone (if it's not PST). Please see this [page](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendTimeZone) for help on how to do that.
    * You're ready to use Gmail Delay Send! See step 2 for help on sending your first email!


> #### Option 2 -- Install the scripts yourself (more technical) ####
    * Go to [Google Docs](http://docs.google.com)
    * Create a new spreadsheet. You can name it anything you want, but it will hold your Gmail Delay Send script so name it accordingly.
    * Tools -> Script editor
    * Inside the script editor paste the contents of this [page](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendBETAScript) (replacing the default contents of the editor)
    * Save the script project (can name anything you want).
    * Close and save the google doc.
      * **NOTE** the script sets up the speadsheet the first time it is opened, so you have to do this step.
    * Open it again and follow the instructions that appear.  When you are prompted for permissions and it states "You may now run the script" you have to repeat your action (yeah I know silly..)
      * **NOTE** It may take a second for the instructions to appear on the spreadsheet.
    * You're ready to use Gmail Delay Send! See step 2 for help on sending your first email!

## Step 2 -- Your first email! ##
Everything should be set to go! Follow the instructions [here](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendFirstMessage) to compose your first message!


---


## [[Optional](Optional.md)] Manually Setting trigger ##
When you click on the 'Gmail Delay Send' -> 'Install' menu item triggers are installed for you automatically. If you would prefer to understand or setup your own triggers please continue..
  * `Tools -> Script Editor`
  * `Resources-> Current Scripts Triggers`
  * `Add a new trigger`
  * Select `_runGmailDelaySend` (should be auto-populated in the box) from the `Run` dropdown.
  * Select `Time Driven` from the `Events` dropdown.
  * Unless you have a reason NOT to, select the script to run every 5 minutes. This is how often the script will run, checking if your emails should be sent. More information about this setting can be found on the [GmailDelaySendFAQ](http://code.google.com/p/gmail-delay-send/wiki/GmailDelaySendFAQ) page.
  * Done! Enjoy GmailDelaySend!