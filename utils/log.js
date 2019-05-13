var dateUtils = require('./date.js');

module.exports = {
  info:function(message, id = null) {
    var date = new Date();
    console.log(dateUtils.format(date) + " | INFO | " + (id ? id : "Server").padEnd(20) + " | " + message);
  },
  error:function(message, id) {
    var date = new Date();
    console.log(dateUtils.format(date) + " | ERROR | " + (id ? id : "Server").padEnd(20) + " | " + message);
  }
}
