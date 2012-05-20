// Global settings
var SEND_RECEIPTS;        // You will get an email confirming that your email was sent 
var SEND_PARSE_ERRORS;    // You will get an email with any parsing errors (a good idea to keep on) 
var SEND_DEBUG_LOG;       // For debugging problems 
var DELAY_SEND_LABEL;     // The label that we'll search under, set to null to search entire draft folder 
var DELIMITER;            // The text string seperating the subject from the date to send 
var DELAY_SEND_REGEX;

var DOWNLOAD_SCRIPT_VERSION = 7.6;

// Default Email Configuration Stuff 
var DEFAULT_SEND_RECEIPTS = true;
var DEFAULT_SEND_PARSE_ERRORS = true;
var DEFAULT_SEND_DEBUG_LOG = true;

// General Configuration 
var DEFAULT_DELAY_SEND_LABEL = "DELAY_SEND"; // The label that we'll search under, set to null to search entire draft folder 
var DEFAULT_DELIMITER = "--";                // The text string seperating the subject from the date to send 

// Malformed messages will be placed in this label
var DELAY_SEND_ERROR_LABEL = "DELAY_SEND_ERRORS";

// Spreadsheet locations 
var SEND_RECEIPTS_CELL = "C4";
var PARSE_ERROR_CELL= "C5";
var DEBUG_CELL = "C6";
var LABEL_NAME_CELL = "C8";
var DELIM_CELL = "C9";

// Array of notifications  
var receipts = [];
var parse_errors = [];


var DELAY_SEND_REGEX = null;


// Ranges

var MORE_INFO_LINK = "A2:B2";
var NOTIFICATION_LINK = "A4";
var ADVANCED_LINK = "A8";
var TIMEZONE_LINK = "A11";
var DATE_LINK = "A13";

var RECEIPT_LABEL = "B4";
var TIMEZONE_LABEL = "B11";

var ERROR_LABEL = "B5";



var DEBUG_LABEL = "B6";


var LABEL_LABEL = "B8";
var LABEL_OPTION = "C8";
var LABEL_DEFAULT = DEFAULT_DELAY_SEND_LABEL;

var PARSING_LABEL = "B9";
var PARSING_OPTION = "C9";
var PARSING_DEFAULT = "--";

var DATE_LABEL="B13";



// Colors
var TEXT_COLOR = "blue";

// Text (in pixels)
var EMAIL_FOOTER_TEXT_SIZE=10;
