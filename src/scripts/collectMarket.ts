/**
 * CLI thu thập Xu hướng thị trường (fetch thủ công).
 *
 *   npm run refresh:market           # build -> fetch -> build (1 lệnh gọn)
 *   npm run collect:market           # chỉ fetch (cần build trước)
 *
 * Nguồn:
 *   - Feed RSS tin xe thật (mặc định VnExpress/Tuổi Trẻ/Dân Trí),
 *     ghi đè bằng MARKET_RSS_FEEDS="Tên|url,...", tắt bằng MARKET_RSS_FEEDS=off.
 *   - File đã kiểm chứng thủ công trong src/data/market-data/<vehicleId>.json.
 *
 * Kết quả ghi vào src/data/marketTrends.generated.ts = SNAPSHOT OFFLINE (đã commit),
 * nên KHÔNG cần internet vẫn load được dữ liệu ở tab Xu hướng.
 *
 * GỘP an toàn: dữ liệu mới ghi đè theo từng xe; xe không refresh giữ snapshot cũ.
 * => Mất mạng (fetch = 0) sẽ KHÔNG xoá mất data đã lưu. Đặt MARKET_CLEAR=1 để xoá hết.
 *
 * Nguyên tắc: chỉ lấy thông tin nguồn công bố rõ ràng (kèm publisher/url/ngày),
 * KHÔNG bịa số liệu. Ngưỡng nguồn tối thiểu: MARKET_MIN_SOURCES (mặc định 1).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { vehicles } from '../data/vehicles.js';
import {
  collectAll,
  collectedToMarketData,
  verifiedReportsToSources,
  type CollectorVehicle,
  type MarketDataSource,
  type VerifiedMarketFile,
} from '../data/marketCollector.js';
import { createRssNewsSource } from '../data/sources/rssNews.js';
import { collectedMarketTrends as existingSnapshot } from '../data/marketTrends.generated.js';

const DATA_DIR = join(process.cwd(), 'src', 'data', 'market-data');
const GENERATED_FILE = join(process.cwd(), 'src', 'data', 'marketTrends.generated.ts');

const GENERATED_HEADER =
  '/**\n' +
  ' * DỮ LIỆU XU HƯỚNG THỊ TRƯỜNG (tự sinh — KHÔNG sửa tay).\n' +
  ' *\n' +
  ' * Sinh bởi:  npm run build && npm run collect:market\n' +
  ' *\n' +
  ' * Nguồn: feed RSS tin xe + file đã kiểm chứng trong src/data/market-data/.\n' +
  ' * Mỗi giá trị đều kèm nguồn (publisher). Chỉ lấy thông tin nguồn công bố rõ ràng,\n' +
  ' * KHÔNG bịa số liệu. Ngưỡng nguồn tối thiểu cấu hình qua MARKET_MIN_SOURCES (mặc định 1).\n' +
  ' */\n' +
  "import type { MarketTrendsData } from './vehicles.js';\n\n";

function writeGenerated(data: Record<string, unknown>): void {
  const body =
    GENERATED_HEADER +
    'export const collectedMarketTrends: Record<string, MarketTrendsData> = ' +
    JSON.stringify(data, null, 2) +
    ';\n';
  writeFileSync(GENERATED_FILE, body, 'utf8');
}

function loadVerifiedSources(v: CollectorVehicle): MarketDataSource[] {
  const file = join(DATA_DIR, v.id + '.json');
  if (!existsSync(file)) return [];
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as VerifiedMarketFile;
    if (!parsed || !Array.isArray(parsed.reports)) return [];
    return verifiedReportsToSources(parsed);
  } catch (e) {
    console.error('⚠ Bỏ qua file lỗi:', file, '-', (e as Error).message);
    return [];
  }
}

/**
 * Các feed RSS tin xe (NGUỒN THẬT).
 * Mặc định dùng danh sách dưới đây; có thể ghi đè qua biến môi trường:
 *   MARKET_RSS_FEEDS="VnExpress|https://vnexpress.net/rss/oto-xe-may.rss,Báo X|https://.../rss"
 * Đặt MARKET_RSS_FEEDS="off" để tắt hoàn toàn (chỉ chạy offline).
 */
const DEFAULT_FEEDS: { publisher: string; url: string }[] = [
  { publisher: 'VnExpress', url: 'https://vnexpress.net/rss/oto-xe-may.rss' },
  { publisher: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/xe.rss' },
  { publisher: 'Dân Trí', url: 'https://dantri.com.vn/o-to-xe-may.rss' },
];

function loadRssSources(): MarketDataSource[] {
  const raw = (process.env.MARKET_RSS_FEEDS ?? '').trim();
  if (raw.toLowerCase() === 'off') return [];
  const feeds: { publisher: string; url: string }[] = [];
  if (raw) {
    for (const part of raw.split(',')) {
      const [publisher, url] = part.split('|').map((s) => s.trim());
      if (publisher && url) feeds.push({ publisher, url });
    }
  } else {
    feeds.push(...DEFAULT_FEEDS);
  }
  return feeds.map((f) => createRssNewsSource({ publisher: f.publisher, url: f.url }));
}

const rssSources = loadRssSources();

// Ngưỡng số nguồn tối thiểu. Theo yêu cầu: 1 nguồn tin cậy là đủ (vẫn gắn nguồn).
const minSources = Number(process.env.MARKET_MIN_SOURCES ?? '1') || 1;

const curatedFiles = existsSync(DATA_DIR)
  ? readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  : [];

console.log('Thư mục dữ liệu:', DATA_DIR);
console.log('Số file đã kiểm chứng:', curatedFiles.length);
console.log('Số feed RSS bật:', rssSources.length);
console.log('Ngưỡng nguồn tối thiểu:', minSources);

const result = await collectAll(vehicles, (v) => [...loadVerifiedSources(v), ...rssSources], { minSources });
const ids = Object.keys(result);
console.log('Số xe có dữ liệu mới lấy được:', ids.length);

const fresh = collectedToMarketData(result);

// MARKET_CLEAR=1 -> xoá toàn bộ snapshot (chỉ giữ dữ liệu vừa lấy).
const clearOld = (process.env.MARKET_CLEAR ?? '').trim() === '1';

// Gộp: dữ liệu mới ghi đè theo từng xe; xe không refresh giữ snapshot offline cũ.
// Nhờ vậy khi mất mạng (fetch = 0) vẫn KHÔNG mất data đã lưu.
const merged: Record<string, unknown> = clearOld ? { ...fresh } : { ...existingSnapshot, ...fresh };
writeGenerated(merged);

const totalCount = Object.keys(merged).length;
const keptCount = totalCount - ids.length;

if (ids.length > 0) {
  const outFile = join(DATA_DIR, '_collected.json');
  writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log('✓ Đã ghi:', outFile);
}
console.log('✓ Đã sinh snapshot offline:', GENERATED_FILE);
console.log('   - Cập nhật mới:', ids.length, 'xe');
if (!clearOld) console.log('   - Giữ từ snapshot cũ:', keptCount, 'xe');
console.log('   - Tổng cộng:', totalCount, 'xe (build lại để hiện ở tab Xu hướng).');
if (ids.length === 0 && totalCount > 0) {
  console.log('ℹ Không lấy được dữ liệu mới (có thể do mất mạng) — đã giữ nguyên data offline.');
}
