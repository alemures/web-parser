const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https://') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status Code: ${res.statusCode}`));
        return;
      }

      const buffs = [];

      res.on('data', (chunk) => {
        buffs.push(chunk);
      });

      res.on('end', () => {
        resolve(Buffer.concat(buffs));
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * @param {string} htmlBuffer
 * @param {string} selectors
 */
function parseHtml(htmlBuffer, selectors) {
  const $ = cheerio.load(htmlBuffer);
  return [$, $(selectors)];
}

/**
 * @param {string} url The URL to GET.
 * @param {string} selectors The jQuery selector to execute on the page.
 */
async function parse(url, selectors) {
  const htmlBuffer = await httpGet(url);
  return parseHtml(htmlBuffer, selectors);
}

module.exports.parse = parse;
