// One-off: tải logo SVG hãng xe từ Simple Icons CDN về public/assets/brands/<slug>.svg
// Dùng slug của dự án; thử nhiều biến thể tên để khớp Simple Icons. Hãng không có sẽ bỏ qua (UI tự fallback text).
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'brands');

const slugs = [
  'acura','aion','alfa-romeo','aston-martin','audi','bentley','bmw','bugatti','byd','cadillac',
  'chery','chevrolet','chrysler','citroen','daihatsu','dodge','ds','ferrari','fiat','ford',
  'geely','genesis','gmc','haval','honda','hongqi','hyundai','infiniti','isuzu','jaecoo',
  'jaguar','jeep','kia','lamborghini','land-rover','lexus','li-auto','lincoln','lotus','lynk-co',
  'maserati','mazda','mclaren','mercedes-benz','mg','mini','mitsubishi','nio','nissan','opel',
  'ora','pagani','peugeot','polestar','porsche','ram','range-rover','renault','rolls-royce','skoda',
  'subaru','suzuki','tank','tesla','toyota','vinfast','volkswagen','volvo','wuling','xpeng','zeekr',
];

// Override tên Simple Icons khi khác slug dự án.
const MAP = {
  'mercedes-benz': ['mercedes'],
  'land-rover': ['landrover'],
  'range-rover': ['landrover'],
  'alfa-romeo': ['alfaromeo'],
  'aston-martin': ['astonmartin'],
  'rolls-royce': ['rollsroyce'],
  'li-auto': ['liauto'],
  'lynk-co': ['lynkco'],
  'vinfast': ['vinfast'],
};

function candidates(slug) {
  const set = new Set();
  if (MAP[slug]) MAP[slug].forEach((s) => set.add(s));
  set.add(slug);
  set.add(slug.replace(/-/g, ''));
  return [...set];
}

async function tryFetch(name) {
  try {
    const r = await fetch('https://cdn.simpleicons.org/' + name, { redirect: 'follow' });
    if (!r.ok) return null;
    const txt = await r.text();
    if (txt.includes('<svg') && txt.length > 80) return txt;
    return null;
  } catch {
    return null;
  }
}

const ok = [];
const miss = [];

await mkdir(OUT, { recursive: true });

for (const slug of slugs) {
  let svg = null;
  for (const name of candidates(slug)) {
    svg = await tryFetch(name);
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

console.log('\nĐã tải:', ok.length, '/', slugs.length);
console.log('Thiếu:', miss.join(', ') || '(không)');
