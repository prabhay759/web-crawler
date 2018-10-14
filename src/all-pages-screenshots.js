'use strict';

const crawler = require('./crawler/crawler');

const WEB_PAGE_URL = 'https://www.voot.com';
// const WEB_PAGE_URL = 'https://www.google.com';

(async () => {
  try {
    const result = await crawler.getAllPagesScreenShot(WEB_PAGE_URL, {
      writeChildPages: true,
    });

    /* eslint-disable no-console */
    console.log('Output:');
    console.log(result);
    process.exit(0);
    /* eslint-enable no-console */
  } catch (err) {
    process.exit(1);
  }
})();
