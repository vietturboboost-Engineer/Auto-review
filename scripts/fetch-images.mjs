// Lấy ảnh THẬT từ Wikipedia cho xe đang dùng placeholder — GỘP NHIỀU TITLE/REQUEST.
// Chạy: node scripts/fetch-images.mjs  -> xuất scripts/real-images.json
import { vehicles } from '../dist/data/vehicles.js';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const placeholders = vehicles.filter((v) => String(v.image).startsWith('data:image/svg'));
console.log('Xe cần ảnh thật:', placeholders.length);

const outPath = new URL('./real-images.json', import.meta.url);
const out = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
console.log('Đã có sẵn:', Object.keys(out).length);

const brandFix = {
  'Aion (GAC)': 'GAC Aion',
  RAM: 'Ram',
  'Wuling HongGuang MiniEV': 'Wuling Hongguang Mini EV',
};

// Tên bài Wikipedia thủ công cho xe có tên khác model gốc
const idTitle = {
  'kia-k3': 'Kia Cerato',
  'mitsubishi-xpander-cross': 'Mitsubishi Xpander Cross',
  'ford-territory': 'Ford Territory (China)',
  'suzuki-ertiga': 'Suzuki Ertiga',
  'gmc-sierra': 'GMC Sierra',
  'range-rover-autobiography': 'Range Rover (L460)',
  'ds-7': 'DS 7 Crossback',
  'mg-mg5': 'MG 5',
  'mg-mg4': 'MG 4 EV',
  'wuling-mini-ev': 'Wuling Hongguang Mini EV',
  'aion-es': 'Aion S',
  'jaecoo-j7-phev': 'Jaecoo J7',
  'mercedes-maybach-s': 'Mercedes-Benz S-Class (W223)',
  'bentley-flying-spur': 'Bentley Flying Spur (2019)',
};

function titleFor(v) {
  if (idTitle[v.id]) return idTitle[v.id];
  const b = brandFix[v.brand] ?? v.brand;
  if (v.model.startsWith(b)) return v.model;
  return `${b} ${v.model}`;
}

const items = placeholders.map((v) => ({ id: v.id, title: titleFor(v) }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'auto-review-local/1.0 (educational dataset; non-commercial)';

// Gộp 20 title / request
async function batch(slice) {
  const u =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages' +
    '&piprop=thumbnail&pithumbsize=800&redirects=1&titles=' +
    encodeURIComponent(slice.map((s) => s.title).join('|'));
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const q = j.query || {};
  const norm = {};
  (q.normalized || []).forEach((n) => (norm[n.from] = n.to));
  const redir = {};
  (q.redirects || []).forEach((n) => (redir[n.from] = n.to));
  const thumbByTitle = {};
  Object.values(q.pages || {}).forEach((p) => {
    if (p.thumbnail && p.thumbnail.source) thumbByTitle[p.title] = p.thumbnail.source;
  });
  const res = {};
  for (const s of slice) {
    let t = s.title;
    if (norm[t]) t = norm[t];
    if (redir[t]) t = redir[t];
    if (thumbByTitle[t]) res[s.id] = thumbByTitle[t];
  }
  return res;
}

const size = 15;
// Lặp nhiều vòng: mỗi vòng chỉ query những xe còn thiếu, retry batch rỗng.
for (let pass = 1; pass <= 6; pass++) {
  const todo = items.filter((s) => !out[s.id]);
  if (todo.length === 0) break;
  console.log(`\n--- Vòng ${pass}: còn ${todo.length} xe ---`);
  for (let i = 0; i < todo.length; i += size) {
    const slice = todo.slice(i, i + size);
    let r = {};
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        r = await batch(slice);
      } catch {
        r = {};
      }
      if (Object.keys(r).length > 0 || attempt === 4) break;
      await sleep(1500 * (attempt + 1)); // batch rỗng -> nhiều khả năng bị throttle, chờ lâu hơn
    }
    Object.assign(out, r);
    await sleep(600);
  }
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`   => tổng ảnh: ${Object.keys(out).length}`);
  await sleep(1500);
}

const fails = placeholders.filter((v) => !out[v.id]).map((v) => v.id);
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('\n== Có ảnh:', Object.keys(out).length, '| Thiếu:', fails.length);
console.log('Thiếu:', fails.join(', '));
