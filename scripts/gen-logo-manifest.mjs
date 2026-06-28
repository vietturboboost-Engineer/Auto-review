// Quét public/assets/brands/ và sinh manifest slug -> đường dẫn logo thực tế (ưu tiên .svg, sau .png).
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'public', 'assets', 'brands');
const files = await readdir(DIR);

const map = {};
for (const ext of ['.svg', '.png']) {
  for (const f of files) {
    if (!f.endsWith(ext)) continue;
    const slug = f.slice(0, -ext.length);
    if (!map[slug]) map[slug] = '/assets/brands/' + f;
  }
}

const sorted = Object.keys(map).sort();
const body = sorted.map((s) => `  '${s}': '${map[s]}',`).join('\n');
const out = `// TỆP TỰ SINH bởi scripts/gen-logo-manifest.mjs — đừng sửa tay.\n// Map slug hãng -> đường dẫn logo thực tế trong public/assets/brands/.\nexport const BRAND_LOGOS: Record<string, string> = {\n${body}\n};\n`;

await writeFile(join(__dirname, '..', 'src', 'data', 'brand-logos.generated.ts'), out, 'utf8');
console.log('Đã sinh manifest cho', sorted.length, 'logo.');
