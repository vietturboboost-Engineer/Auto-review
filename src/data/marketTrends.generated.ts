/**
 * DỮ LIỆU XU HƯỚNG THỊ TRƯỜNG ĐÃ XÁC MINH (tự sinh).
 *
 * KHÔNG sửa tay. File này do CLI sinh ra:
 *   npm run build && npm run collect:market
 *
 * Nguồn: src/data/market-data/<vehicleId>.json (dữ liệu đã kiểm chứng >=2 nguồn).
 * Mặc định rỗng — đúng nguyên tắc: chưa có dữ liệu thật thì KHÔNG bịa.
 */
import type { MarketTrendsData } from './vehicles.js';

export const collectedMarketTrends: Record<string, MarketTrendsData> = {};
