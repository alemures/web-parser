import nock from 'nock';
import { parse } from '../src/parser';

describe('parse', () => {
  const httpsUrl = 'https://api.example.com';
  const httpUrl = 'http://api.example.com';

  [
    { type: 'http', url: httpUrl },
    { type: 'https', url: httpsUrl },
  ].forEach(({ type, url }) => {
    it(`should return an element with the given text value from a ${type} url`, async () => {
      const content = 'test';

      nock(url)
        .get('/')
        .reply(200, `<html><body><p>${content}</p></body></html>`);

      const [, $elements] = await parse(url, 'p');

      expect($elements.text()).toBe(content);
    });
  });

  it('should throw http errors', () => {
    nock(httpUrl).get('/').reply(404);

    return expect(parse(httpUrl, 'p')).rejects.toBeTruthy();
  });

  it('should throw when the URL is not reachable', () =>
    expect(parse(httpUrl, 'p')).rejects.toBeTruthy());
});
