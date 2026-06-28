// Bổ sung logo còn thiếu từ car-logos-dataset (PNG). Lưu về public/assets/brands/<slug>.png
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'brands');
const BASE = 'https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/';

// slug dự án -> slug dataset (mặc định trùng nhau)
const want = {
  'alfa-romeo': 'alfa-romeo', byd: 'byd', chery: 'chery', daihatsu: 'daihatsu', dodge: 'dodge',
  ds: 'ds', geely: 'geely', genesis: 'genesis', gmc: 'gmc', haval: 'haval', hongqi: 'hongqi',
  isuzu: 'isuzu', jaguar: 'jaguar', 'land-rover': 'land-rover', lexus: 'lexus', 'li-auto': 'li-auto',
  lincoln: 'lincoln', lotus: 'lotus', 'mercedes-benz': 'mercedes-benz', nio: 'nio', pagani: 'pagani',
  'range-rover': 'land-rover', vinfast: 'vinfast', wuling: 'wuling', xpeng: 'xpeng', zeekr: 'zeekr',
};

await mkdir(OUT, { recursive: true });
const data = await (await fetch(BASE + 'data.json')).json();
const bySlug = new Map(data.map((x) => [x.slug, x]));

const ok = [];
const miss = [];
for (const [mySlug, dsSlug] of Object.entries(want)) {
  const entry = bySlug.get(dsSlug);
  const rel = entry?.image?.optimized || entry?.image?.source || ('logos/optimized/' + dsSlug + '.png');
  const url = rel.startsWith('http') ? rel : BASE.replace(/logos\/$/, '') + rel;
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 200) throw new Error('too small');
    await writeFile(join(OUT, mySlug + '.png'), buf);
    ok.push(mySlug);
    process.stdout.write('OK ' + mySlug + '\n');
  } catch (e) {
    miss.push(mySlug);
    process.stdout.write('-- ' + mySlug + ' (' + e.message + ')\n');
  }
}

console.log('\nBổ sung PNG:', ok.length, '/', Object.keys(want).length);
console.log('Vẫn thiếu:', miss.join(', ') || '(không)');
