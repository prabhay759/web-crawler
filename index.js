'use strict';

const crawler = require('src/crawler/crawler');


module.exports = {
  getDimensions: crawler.getDimensions,
  getHomePageScreenShot: crawler.getHomePageScreenShot,
  getAllPagesScreenShot: crawler.getAllPagesScreenShot,
};
