'use strict';

const _ = require('underscore');
const fse = require('fs-extra');
const puppeteer = require('puppeteer');
const log = require('../utility/log')({
  name: 'web-crawler',
});
const url = require('url');
const uuid = require('uuid');

const PAGE_NAVIGATION_OPTION = {
  waitUntil: 'networkidle0',
  timeout: 3000000,
};

module.exports = {
  getDimensions,
  getHomePageScreenShot,
  getAllPagesScreenShot,
};

/**
 * This function is get the dimension of open web page.
 * @param {string} webPageUrl A web page Url to take screenshot.
 * @param {object} options Options to execute crawling as headless or headfull default false.
 * @returns {object} Page with their dimension.
 */
async function getDimensions(webPageUrl, options) {
  try {
    const parsedUrl = parseUrl(webPageUrl);
    const browser = await launchBrowser(options);
    const page = await browser.newPage();

    // Visit the URL to calculate the dimensions.
    await page.goto(parsedUrl, PAGE_NAVIGATION_OPTION);

    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });

    // closes the browser once testing is completed.
    await closeBrowser(browser);

    return {
      dimensions,
    };
  } catch (err) {
    log.error({
      err,
    }, 'Unable to get the dimensions of URL');

    throw err;
  }
}

/**
 * This function will launch the headless chrome.
 * @param {object} options Options to execute crawling as headless or headfull
 default false.
 * @returns {object} Object of browser to perform further actions.
 */
async function launchBrowser(options) {
  try {
    log.info('Launching the Chrome for testing');

    return await puppeteer.launch({
      headless: options && options.headless || true,
    });
  } catch (err) {
    log.error({
      err,
    }, 'Unable to open browser for testing');

    throw err;
  }
}

/**
 * This function will close the headless chrome opened for testing.
 * @param {object} browser Options to execute crawling as headless or headfull
 default false.
 * @returns {object} Object of browser to perform further actions.
 */
async function closeBrowser(browser) {
  try {
    log.info('Closing the Chrome');

    await browser.close();
  } catch (err) {
    log.error({
      err,
    }, 'Unable to close the browser');

    throw err;
  }
}

/**
 * This method will parsed the URL.
 * @param {string} webPageUrl Url to parse.
 * @returns {string} Parsed URL
 */
function parseUrl(webPageUrl) {
  try {
    log.info('Parsing the entered URL');

    return url.parse(webPageUrl).href;
  } catch (err) {
    log.error({
      err,
    }, 'Error occured in parsing the URL');

    throw err;
  }
}

/**
 * This function will return the screenshot of home page as HTML content.
 * @param {string} webPageUrl A web page Url to take screenshot.
 * @param {object} options Options to execute crawling as headless or headfull default false.
 * @returns {object} Object key value pair of home being values as HTML Strings.
 */
async function getHomePageScreenShot(webPageUrl, options) {
  try {
    const parsedUrl = parseUrl(webPageUrl);
    const browser = await launchBrowser(options);
    const page = await browser.newPage();
    await page.goto(parsedUrl, PAGE_NAVIGATION_OPTION);
    const filePath = `snapshots/shot_${uuid.v4()}.png`;

    return await page.screenshot({
      path: filePath,
    });
  } catch (err) {
    log.error({
      err,
    }, 'Unable to generate the home page screenshot');

    throw err;
  }
}

/**
 * This function will return the screenshot of all pages on home page.
 * @param {string} webPageUrl A web page Url to take screenshot
 * @param {object} options Options to execute crawling as headless or headfull default false.
 * @returns {object} Object with key value pair of all pages being values as HTML Strings.
 */
async function getAllPagesScreenShot(webPageUrl, options) {
  try {
    const parsedUrl = parseUrl(webPageUrl);
    const browser = await launchBrowser(options);
    const page = await browser.newPage();

    // Open the page.
    await page.goto(parsedUrl, PAGE_NAVIGATION_OPTION);
    const content = await page.content();

    // Write home page to a file.
    await writeToAFile(parsedUrl, content);
    log.info('Home page has been written successfully');

    let result = '';
    // Write all child pages to files.
    if (options.writeChildPages) {
      result = await writeChildPages(parsedUrl, content, browser);
    }

    // Close the browser.
    await closeBrowser(browser);

    return result || 'Done!';
  } catch (err) {
    log.error({
      err,
    }, 'Unable to generate the all pages screenshots');

    throw err;
  }
}

async function writeToAFile(parsedUrl, content) {
  const fileName = `${parsedUrl.replace(/[:/. ]/g, '_')}.html`;
  const filePath = `html_pages/${fileName}`;

  await fse.writeFile(filePath, content);
}

/**
 * This method will parse all links present in parent and write it to a file.
 * @param {string} parsedUrl A web url
 * @param {string} content HTML Content
 * @param {string} browser Browser object
 * @returns {string} Retuns done on completion.
 */
async function writeChildPages(parsedUrl, content, browser) {
  const links = getLinks(parsedUrl, content);
  log.info(`${links.length} files to write`);

  for (let index = 0; index < links.length; index++) {
    const page = await browser.newPage();
    await page.goto(links[index], PAGE_NAVIGATION_OPTION);
    const content = await page.content();

    const filePath = `html_pages/${links[index]}`;
    log.info(`Writing ${links[index]}`);

    await writeToAFile(filePath, content);
  }

  log.info('Files has been written, please check html_pages folder');

  return 'Done!';
}

function getLinks(parsedUrl, content) {
  const regList = [
    'href="/channels',
    'href="/news',
    'href="/shows',
    'href="/kids',
    'href="/movies',
  ];

  let links = [];

  for (let index = 0; index < regList.length; index++) {
    const regex = new RegExp(`${regList[index]}[-a-z\/A-Z0-9]*"`, 'g');
    const result = content.match(regex);

    if (result && result.length > 0) {
      links = links.concat(formatLinks(parsedUrl, result));
    }
  }

  return links;
}

function formatLinks(parsedUrl, result) {
  return _.map(result, res => {
    const unformattedUrl = res.split('"');

    return `${parsedUrl}${unformattedUrl[1]}`;
  });
}
