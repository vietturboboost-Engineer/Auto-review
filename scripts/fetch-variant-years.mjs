// Fetch ảnh theo đời (2022–2025) cho Honda/Toyota/Mitsubishi từ Wikimedia Commons.
// Chạy: node scripts/fetch-variant-years.mjs -> xuất src/data/variant-years.generated.ts
import { vehicles } from '../dist/data/vehicles.js';
import { writeFileSync } from 'node:fs';

const BRANDS = new Set(['honda', 'toyota', 'mitsubishi']);
const YEARS = [2022, 2023, 2024, 2025];
const UA = 'auto-review-local/1.0 (educational dataset; non-commercial)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const cars = vehicles.filter((v) => BRANDS.has(v.brandSlug));
console.log('Xe:', cars.length, 'x', YEARS.length, 'đời');

async function getJson(u) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    const t = await r.text();
    try {
      return JSON.parse(t);
    } catch {
      await sleep(2000 * (i + 1));
    }
  }
  return {};
}

async function searchImg(brand, model, year) {
  const term = `${brand} ${model} ${year}`;
  const su =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=1&srsearch=' +
    encodeURIComponent(term);
  const sr = await getJson(su);
  const hit = sr.query?.search?.[0]?.title;
  if (!hit) return null;
  const iu =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=800&titles=' +
    encodeURIComponent(hit);
  const ir = await getJson(iu);
  const pages = ir.query?.pages || {};
  const p = Object.values(pages)[0];
  return p?.imageinfo?.[0]?.thumburl || null;
}

const out = {};
for (const v of cars) {
  const arr = [];
  for (const y of YEARS) {
    const img = await searchImg(v.brand, v.model, y);
    if (img) arr.push({ year: y, image: img });
    await sleep(700);
  }
  if (arr.length) out[v.id] = arr;
  console.log(v.id, '->', arr.length, 'ảnh');
}

const ts =
  '// AUTO-GENERATED bởi scripts/fetch-variant-years.mjs — không sửa tay.\n' +
  'export const variantYears: Record<string, { year: number; image: string }[]> = ' +
  JSON.stringify(out, null, 2) +
  ';\n';
writeFileSync(new URL('../src/data/variant-years.generated.ts', import.meta.url), ts);
console.log('Đã ghi src/data/variant-years.generated.ts —', Object.keys(out).length, 'xe');
