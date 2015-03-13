# Gmail Delay Send Test Plan #

  * Text emails
    * old compose
    * new compose
  * HTML emails
    * one compose
    * new compose

  * Special
    * Receipts show body snippit, and top aligned
    * Include  and make sure they come out correct in text only email.
    * Set operate on no-label and make sure executes in reasonable time and sends email
    * Reply to exiting conversation.


  * Combined
    * New compose
      * Text response to an existing email with ", ', & , double space reply from another email address.
      * HTML email w/ reciepts turned on (one w/ custom font, another w/ default)
    * Old Compose
      * HTML response to existing email w/o label w/ debugging turned on (use default text)
      * text email +5 minutes w/ @now in 2nd line & change delimit
    * Errors
      * Email doesn't contain delim
      * Email has delim but invalid string