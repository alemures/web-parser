import http from 'http';
import https from 'https';
import cheerio from 'cheerio';

function httpGet(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https://') ? https : http;
    const req = protocol.get(url, (res) => {
      const statusCode = res.statusCode === undefined ? -1 : res.statusCode;
      if (statusCode !== 200) {
        reject(new Error(`Status Code: ${statusCode}`));
        return;
      }

      const buffs: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
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

function parseHtml(
  htmlBuffer: Buffer,
  selectors: string
): [cheerio.Root, cheerio.Cheerio] {
  const $ = cheerio.load(htmlBuffer);
  return [$, $(selectors)];
}

export async function parse(url: string, selectors: string) {
  const htmlBuffer = await httpGet(url);
  return parseHtml(htmlBuffer, selectors);
}
