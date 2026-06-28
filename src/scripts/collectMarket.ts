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
  verifiedReportsToSources,
  type CollectorVehicle,
  type MarketDataSource,
  type VerifiedMarketFile,
} from '../data/marketCollector.js';

const DATA_DIR = join(process.cwd(), 'src', 'data', 'market-data');

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
  console.log('✓ Đã ghi:', outFile);
} else {
  console.log('Chưa có dữ liệu đã kiểm chứng — không ghi gì (đúng nguyên tắc: không bịa số liệu).');
}
