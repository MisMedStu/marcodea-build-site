/**
 * يقيس الموقع بـ Lighthouse على الجوال والحاسوب.
 *
 * التشغيل:  npm run build  ثم  npm run lh
 * أو لقياس الموقع المنشور:  npm run lh -- https://الرابط/
 *
 * يشغّل نسخة الإنتاج (astro preview) على منفذ مستقل، ثم يقيسها،
 * ثم يغلق كل شيء. التقارير الكاملة تُحفظ في qa/.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4331;
let URL = `http://localhost:${PORT}/`;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const LABELS = {
  performance: 'الأداء',
  accessibility: 'إمكانية الوصول',
  'best-practices': 'أفضل الممارسات',
  seo: 'تهيئة محركات البحث',
};

/**
 * يشغّل خادم المعاينة، أو يعيد استعمال خادم قائم:
 * Astro 7 لا يسمح إلا بخادم معاينة واحد في الوقت نفسه.
 * يعيد { url, child } — child فارغ إن كان الخادم ليس لنا فلا نغلقه.
 */
function startPreview() {
  const child = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    cwd: root,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`لم يبدأ خادم المعاينة خلال 30 ثانية. مخرجاته:
${output}`));
    }, 30000);

    const onData = (chunk) => {
      const text = String(chunk);
      output += text;

      const existing = text.match(/already running at (http:\/\/[^\s"\\]+)/);
      if (existing) {
        clearTimeout(timer);
        resolve({ url: existing[1].replace(/\/?$/, '/'), child: null });
        return;
      }

      if (text.includes(String(PORT))) {
        clearTimeout(timer);
        setTimeout(() => resolve({ url: `http://localhost:${PORT}/`, child }), 600);
      }
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', reject);
  });
}

async function audit(chromePort, formFactor) {
  const mobile = formFactor === 'mobile';
  const result = await lighthouse(
    URL,
    { port: chromePort, output: 'html', logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: CATEGORIES,
        formFactor,
        screenEmulation: mobile
          ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
          : { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
        throttling: mobile
          ? { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }
          : { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
      },
    }
  );

  mkdirSync(join(root, 'qa'), { recursive: true });
  writeFileSync(join(root, `qa/lighthouse-${formFactor}.html`), result.report);

  return Object.fromEntries(
    CATEGORIES.map((key) => [key, Math.round(result.lhr.categories[key].score * 100)])
  );
}

// npm run lh -- https://…  يقيس رابطًا منشورًا بدل النسخة المحلية
const target = process.argv[2];
const preview = target ? { url: target, child: null } : await startPreview();
URL = preview.url;
console.log(`القياس على: ${URL}`);
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

try {
  let failed = false;

  for (const formFactor of ['mobile', 'desktop']) {
    const scores = await audit(chrome.port, formFactor);
    console.log(`\n${formFactor === 'mobile' ? 'الجوال' : 'الحاسوب'}:`);
    for (const key of CATEGORIES) {
      const score = scores[key];
      if (score < 95) failed = true;
      console.log(`  ${score >= 95 ? '✓' : '✗'} ${LABELS[key]}: ${score}`);
    }
  }

  console.log('\nالتقارير الكاملة في qa/');
  if (failed) process.exitCode = 1;
} finally {
  // تنظيف مجلد Chrome المؤقت يفشل أحيانًا على ويندوز ولا يعني فشل القياس
  try {
    await chrome.kill();
  } catch {
    /* تجاهل */
  }
  preview.child?.kill();
}
