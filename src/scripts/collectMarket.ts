/**
 * CLI thu thập Xu hướng thị trường (chạy offline).
 *
 *   npm run build && npm run collect:market
 *
 * Đọc các file dữ liệu ĐÃ KIỂM CHỨNG trong src/data/market-data/<vehicleId>.json,
 * đối chiếu theo quy tắc >=2 nguồn rồi ghi kết quả ra src/data/market-data/_collected.json.
 *
 * KHÔNG có nguồn web tự bịa: nếu chưa có file kiểm chứng nào, kết quả rỗng (đúng nguyên tắc).
 * Muốn thu thập tự động online: bổ sung adapter MarketDataSource thật (API hãng, sàn xe cũ)
 * vào hàm sourcesFor bên dưới.
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

const DATA_DIR = join(process.cwd(), 'src', 'data', 'market-data');
const GENERATED_FILE = join(process.cwd(), 'src', 'data', 'marketTrends.generated.ts');

const GENERATED_HEADER =
  '/**\n' +
  ' * DỮ LIỆU XU HƯỚNG THỊ TRƯỜNG ĐÃ XÁC MINH (tự sinh).\n' +
  ' *\n' +
  ' * KHÔNG sửa tay. File này do CLI sinh ra:\n' +
  ' *   npm run build && npm run collect:market\n' +
  ' *\n' +
  ' * Nguồn: src/data/market-data/<vehicleId>.json (dữ liệu đã kiểm chứng >=2 nguồn).\n' +
  ' * Mặc định rỗng — đúng nguyên tắc: chưa có dữ liệu thật thì KHÔNG bịa.\n' +
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

const curatedFiles = existsSync(DATA_DIR)
  ? readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  : [];

console.log('Thư mục dữ liệu:', DATA_DIR);
console.log('Số file đã kiểm chứng:', curatedFiles.length);

const result = await collectAll(vehicles, loadVerifiedSources);
const ids = Object.keys(result);
console.log('Số xe có dữ liệu thị trường xác minh được:', ids.length);

if (ids.length > 0) {
  const outFile = join(DATA_DIR, '_collected.json');
  writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf8');
  writeGenerated(collectedToMarketData(result));
  console.log('✓ Đã ghi:', outFile);
  console.log('✓ Đã sinh:', GENERATED_FILE, '(dữ liệu sẽ hiện ở tab Xu hướng sau khi build lại)');
} else {
  writeGenerated({});
  console.log('Chưa có dữ liệu đã kiểm chứng — sinh file rỗng (đúng nguyên tắc: không bịa số liệu).');
}
