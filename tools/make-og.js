// tools/og.html → ev5-vs-modely/og.png (1200x630, 카카오톡·SNS 미리보기 이미지)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'og.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, '..', 'ev5-vs-modely', 'og.png') });
  await b.close();
  console.log('og.png written');
})();
