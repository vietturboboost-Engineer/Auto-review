// Bổ sung logo còn thiếu từ vectorlogo.zone (SVG). Lưu về public/assets/brands/<slug>.svg
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'brands');

const missing = [
  'aion','alfa-romeo','byd','chery','daihatsu','dodge','ds','geely','genesis','gmc','haval',
  'hongqi','isuzu','jaecoo','jaguar','land-rover','lexus','li-auto','lincoln','lotus','lynk-co',
  'mercedes-benz','nio','ora','pagani','range-rover','tank','vinfast','wuling','xpeng','zeekr',
];

const MAP = {
  'mercedes-benz': ['mercedes', 'mercedesbenz'],
  'land-rover': ['landrover', 'land-rover'],
  'range-rover': ['landrover', 'land-rover'],
  'alfa-romeo': ['alfaromeo', 'alfa-romeo'],
  'li-auto': ['liauto', 'li-auto'],
  'lynk-co': ['lynkco', 'lynk-co'],
};

function names(slug) {
  const set = new Set();
  (MAP[slug] || []).forEach((s) => set.add(s));
  set.add(slug);
  set.add(slug.replace(/-/g, ''));
  return [...set];
}

async function tryUrl(url) {
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) return null;
    const ct = r.headers.get('content-type') || '';
    const txt = await r.text();
    if ((ct.includes('svg') || txt.includes('<svg')) && txt.includes('<svg') && txt.length > 80) return txt;
    return null;
  } catch {
    return null;
  }
}

const ok = [];
const miss = [];
await mkdir(OUT, { recursive: true });

for (const slug of missing) {
  let svg = null;
  for (const n of names(slug)) {
    for (const suffix of ['icon', 'ar21', 'official']) {
      svg = await tryUrl(`https://www.vectorlogo.zone/logos/${n}/${n}-${suffix}.svg`);
      if (svg) break;
    }
    if (svg) break;
  }
  if (svg) {
    await writeFile(join(OUT, slug + '.svg'), svg, 'utf8');
    ok.push(slug);
    process.stdout.write('OK ' + slug + '\n');
  } else {
    miss.push(slug);
    process.stdout.write('-- ' + slug + '\n');
  }
}

console.log('\nBổ sung được:', ok.length, '/', missing.length);
console.log('Vẫn thiếu:', miss.join(', ') || '(không)');
