'use strict';

const _ = require('underscore');
const atlasLogger = require('../../src/utility/log');
const should = require('should');
const stdout = require('test-console').stdout;


describe('utility/log', () => {

  describe('logger', () => {
    describe('log to stdout', () => {
      var data = [{
        level: 10,
        fn: (logger, msg) => logger.trace(msg),
      },
      {
        level: 20,
        fn: (logger, msg) => logger.debug(msg),
      },
      {
        level: 30,
        fn: (logger, msg) => logger.info(msg),
      },
      {
        level: 40,
        fn: (logger, msg) => logger.warn(msg),
      },
      {
        level: 50,
        fn: (logger, msg) => logger.error(msg),
      },
      ];

      _.forEach(data, definition => {
        it(`should log with level ${definition.level}`, () => {
          const appName = 'application';
          const msg = `log ${definition.level}`;
          const logger = atlasLogger({
            name: appName,
            stdout: {
              enabled: true,
            },
          });
          const output = stdout.inspectSync(() => {
            definition.fn(logger, msg);
          });
          const logData = JSON.parse(output);
          should(logData.level).be.eql(definition.level);
          should(logData.msg).be.eql(msg);
          should(logData.name).be.eql(appName);
        });
      });
    });
  });

});
