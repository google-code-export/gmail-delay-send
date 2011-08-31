Date.today = function() 
{
    if(this.relativeTo == null)
      return new Date().clearTime();
    else
      return this.relativeTo.clearTime();
}

Date.setRelativeTo = function(d) 
{
    this.relativeTo = d;
}
