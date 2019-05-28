const dateUtils = require('./date.js');

module.exports = {
  info(message, id = null) {
    const date = new Date();
    console.log(`${dateUtils.format(date)} | INFO | ${(id || 'Server').padEnd(20)} | ${message}`);
  },
  error(message, id) {
    const date = new Date();
    console.log(`${dateUtils.format(date)} | ERROR | ${(id || 'Server').padEnd(20)} | ${message}`);
  },
};
