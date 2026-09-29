// Renders every .card in titles.html to a transparent 1920x1080 PNG in ./t/
// and reports any element that falls outside the frame.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  fs.mkdirSync('t', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + process.cwd() + '/titles.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const ids = await page.evaluate(() => [...document.querySelectorAll('.card')].map(c => c.id));
  for (const id of ids) {
    await page.evaluate(i => document.querySelectorAll('.card')
      .forEach(c => c.classList.toggle('on', c.id === i)), id);
    const bad = await page.evaluate(i => [...document.getElementById(i).querySelectorAll('*')]
      .map(e => [e, e.getBoundingClientRect()])
      .filter(([e, r]) => r.width && !e.classList.contains('scrim') &&
        (r.left < 40 || r.top < 40 || r.right > 1880 || r.bottom > 1040))
      .map(([e, r]) => `${e.tagName}.${e.className} ${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`), id);
    const imgs = await page.evaluate(i => [...document.getElementById(i).querySelectorAll('img')]
      .filter(im => !im.naturalWidth).map(im => im.src), id);
    if (bad.length) console.log('OUT OF SAFE AREA', id, bad);
    if (imgs.length) console.log('IMAGE FAILED', id, imgs);
    await page.screenshot({ path: `t/${id}.png`, omitBackground: true });
  }
  const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style));
  console.log('fonts', [...new Set(fonts)].join(' | '));
  console.log('rendered', ids.length, 'cards');
  await browser.close();
})();
