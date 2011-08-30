function getSheet()
{
  return SpreadsheetApp.getActiveSheet();
}

function parseDate(str)
{
  return Date.parse(str);
}

function debug(msg)
{
  debug_logs.push(msg);
  Logger.log(msg);
}
