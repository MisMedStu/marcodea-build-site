/**
 * يولّد صورة المشاركة og-image.jpg بمقاس 1200×630 من ألوان الهوية وخطوطها.
 *
 * التشغيل:  npm run og
 *
 * يستعمل متصفح Chrome أو Edge المثبَّت على الجهاز، فالخط العربي
 * يُرسم بتشكيل صحيح — مكتبات معالجة الصور لا تحسن رسم العربية.
 * أعِد تشغيله كلما تغيّر عنوان الهيرو.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findBrowser() {
  const found = BROWSERS.find((path) => existsSync(path));
  if (!found) {
    throw new Error('لم أجد Chrome أو Edge على الجهاز. ثبّت أحدهما ثم أعد المحاولة.');
  }
  return found;
}

/** يقرأ ملف خط ويحوّله إلى data URI ليعمل داخل الصفحة المؤقتة */
function fontDataUri(relativePath) {
  const buffer = readFileSync(join(root, relativePath));
  return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

const arabicFont = fontDataUri(
  'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2'
);
const latinFont = fontDataUri(
  'node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2'
);

const logomark = readFileSync(join(root, 'reference/logomark.svg'), 'utf8');

const html = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'AR'; src: url('${arabicFont}') format('woff2-variations'); font-weight: 100 900; }
  @font-face { font-family: 'EN'; src: url('${latinFont}') format('woff2-variations'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: space-between; padding: 72px 80px; color: #fff;
    font-family: 'AR', sans-serif;
    background: radial-gradient(760px 460px at 88% 6%, rgba(18,102,255,.42), transparent 62%), #082B6F;
  }
  .top { display: flex; align-items: center; gap: 18px; }
  .top svg { width: 64px; height: auto; }
  .wm { display: flex; flex-direction: column; line-height: 1; }
  .wm b { font-family: 'EN'; font-weight: 800; font-size: 30px; letter-spacing: .01em; }
  .wm i { font-style: normal; font-family: 'EN'; font-weight: 700; font-size: 14px;
          letter-spacing: .55em; margin-top: 9px; display: flex; align-items: center;
          gap: 8px; padding-inline-start: .55em; }
  .wm i::before, .wm i::after { content: ''; height: 1px; flex: 1; background: #22D7F7; opacity: .8; }
  h1 { font-size: 78px; font-weight: 800; line-height: 1.18; letter-spacing: -.01em; }
  h1 em { font-style: normal; color: #22D7F7; display: block; }
  p { font-size: 27px; font-weight: 300; color: rgba(255,255,255,.82); margin-top: 22px; }
  .bar { display: flex; align-items: center; justify-content: space-between; }
  .tag { font-family: 'EN'; font-weight: 700; font-size: 17px; letter-spacing: .42em; color: #22D7F7; }
  .place { font-size: 21px; color: rgba(255,255,255,.72); }
  .rule { width: 92px; height: 5px; border-radius: 4px;
          background: linear-gradient(90deg, #22D7F7, #1266FF); margin-top: 30px; }
</style></head>
<body>
  <div class="top">${logomark}<span class="wm"><b>MARCODEA</b><i>BUILD</i></span></div>
  <div>
    <h1>شاهد مشروعك<em>قبل أن يُبنى.</em></h1>
    <p>تصميم معماري 2D ورندر ثلاثي الأبعاد — بإشراف مهندس معماري.</p>
    <div class="rule"></div>
  </div>
  <div class="bar">
    <span class="tag">PLAN · BUILD · GROW</span>
    <span class="place">مصراتة — ليبيا</span>
  </div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  args: ['--no-sandbox', '--hide-scrollbars'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({
    path: join(root, 'public/og-image.jpg'),
    type: 'jpeg',
    quality: 88,
  });
  console.log('✓ public/og-image.jpg — 1200×630');
} finally {
  await browser.close();
}
