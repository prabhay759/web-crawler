'use strict';

var bunyan = require('bunyan');
var process = require('process');


module.exports = log;

/**
 * Method to log to the STDOUT
 * @param  {string} name Name of the log.
 * @return {object} object of logger method.
 */
function log(name) {
  const data = {
    name,
    stream: process.stdout,
    level: 'trace',
    serializers: bunyan.stdSerializers,
    // As per bunyan library, we should never enable this in production.
    src: false,
  };

  return bunyan.createLogger(data);
}
