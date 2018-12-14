const moment = require('moment');

var fake = false;
var fakeTime = null;
var realTimeWhenFaked = null;

module.exports = {
  getTimeNow(){
    if(fake){
      let difference  = moment() - realTimeWhenFaked;
      fakeTime.add(difference, 'milliseconds');
      return fakeTime.format();
    }
    else{
      return moment().format()
    }
  },

  resetDate(){fake=false;},

  fakeDate(date){
    fakeTime = moment(date)
    realTimeWhenFaked = moment()
    fake = true;
  }
}
