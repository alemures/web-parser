// Gets all the node js releases that come with a Raspberry Pi compilation

const { parse } = require('../dist/index');

async function releasePage(url) {
  const [$, $elements] = await parse(url, 'a');

  $elements.each((index, element) => {
    const $element = $(element);
    const text = $element.text();

    if (text.includes('pi')) {
      console.log(text);
    }
  });
}

async function mainPage(url) {
  const [$, $elements] = await parse(url, 'a');

  await Promise.all(
    $elements.toArray().map(async (element) => {
      const $element = $(element);
      const href = $element.attr('href');

      if (href.startsWith('v')) {
        await releasePage(url + href);
      }
    })
  );
}

(async () => {
  await mainPage('https://nodejs.org/dist/');
  console.log('done');
})();
