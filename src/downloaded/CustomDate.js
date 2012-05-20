Date.today = function() 
{
    if(this.relativeTo == null)
      return new Date().clearTime();
    else
      return this.relativeTo.clone().clearTime();
}

Date.setRelativeTo = function(d) 
{
    this.relativeTo = d;
}

Date.prototype.setTimeToNow = function () 
{
    var n = Date.relativeTo || new Date();
    this.setHours(n.getHours());
    this.setMinutes(n.getMinutes());
    this.setSeconds(n.getSeconds());
    this.setMilliseconds(n.getMilliseconds());
    return this;
};
