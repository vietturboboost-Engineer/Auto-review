import { getBrand } from './brands.js';

// ===== Cơ sở dữ liệu xe đa hãng (mở rộng dễ: thêm 1 dòng mk({...}) vào mảng `vehicles`) =====
// Ảnh lấy từ Wikipedia/Wikimedia Commons (URL chuẩn). Số liệu mang tính THAM KHẢO cho thị
// trường Việt Nam, có thể đổi theo phiên bản/thời điểm. Lịch bảo dưỡng & phụ tùng dùng chung
// mặc định nếu xe không khai báo riêng (xem getMaintenanceSchedule / getPartsCatalog).

export interface MaintenanceItem {
  km: number;
  items: string;
  cost: string;
}

export interface PartItem {
  name: string;
  oem: string;
  price: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  wheelbase: number;
}

export interface VehicleRatings {
  safety: number;
  reliability: number;
  comfort: number;
  performance: number;
  tech: number;
  resale: number;
  cargo: number;
  fuelEcon: number;
  brandRep: number;
  family: number;
}

export type FuelType = 'Xăng' | 'Hybrid' | 'Dầu' | 'Điện';
export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4WD';

export interface Vehicle {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  generation: string;
  year: number;
  trim: string;
  engine: string;
  transmission: string;
  fuelType: FuelType;
  driveType: DriveType;
  seats: number;
  segment: string;
  /** Giá theo triệu VND. */
  price: { min: number; max: number; currency: 'VND'; label: string };
  warranty: string;
  /** Tiêu hao: L/100km hoặc kWh/100km (xe điện). */
  fuelEconomy: string;
  dimensions: Dimensions;
  /** Khoang hành lý, lít. */
  cargo: number;
  horsepower: number;
  torque: number;
  safetyFeatures: string[];
  techFeatures: string[];
  maintenanceCostPerYear: string;
  commonIssues: string[];
  reliability: number;
  image: string;
  ratings: VehicleRatings;
  /** Tùy chọn: lịch bảo dưỡng / phụ tùng riêng. Nếu bỏ trống -> dùng mặc định. */
  maintenanceSchedule?: MaintenanceItem[];
  partsCatalog?: PartItem[];
}

// --- Lịch bảo dưỡng & phụ tùng mặc định (dùng chung) ---
export const defaultMaintenanceSchedule: MaintenanceItem[] = [
  { km: 5000, items: 'Thay dầu máy, đảo lốp, kiểm tra phanh/lốp', cost: '0,6 – 1,2 triệu' },
  { km: 10000, items: 'Thay dầu + lọc dầu, kiểm tra gầm & treo', cost: '0,8 – 1,5 triệu' },
  { km: 20000, items: 'Lọc gió động cơ + lọc gió điều hòa, kiểm tra phanh', cost: '1,2 – 2,5 triệu' },
  { km: 40000, items: 'Dầu phanh, bugi, lọc nhiên liệu, vệ sinh kim phun', cost: '2,5 – 5 triệu' },
];

export const defaultEvMaintenanceSchedule: MaintenanceItem[] = [
  { km: 12000, items: 'Đảo lốp, kiểm tra phanh & hệ thống làm mát pin', cost: '0,5 – 1 triệu' },
  { km: 24000, items: 'Lọc gió điều hòa, kiểm tra hệ thống điện cao áp', cost: '0,8 – 1,5 triệu' },
  { km: 40000, items: 'Dầu phanh, kiểm tra dầu hộp giảm tốc', cost: '1,5 – 3 triệu' },
];

export const defaultPartsCatalog: PartItem[] = [
  { name: 'Lọc dầu', oem: '—', price: '120.000 – 350.000đ' },
  { name: 'Lọc gió động cơ', oem: '—', price: '150.000 – 500.000đ' },
  { name: 'Má phanh trước', oem: '—', price: '600.000 – 2.000.000đ' },
  { name: 'Ắc quy', oem: '—', price: '1.500.000 – 4.000.000đ' },
];

export const defaultEvPartsCatalog: PartItem[] = [
  { name: 'Lọc gió điều hòa', oem: '—', price: '200.000 – 600.000đ' },
  { name: 'Má phanh trước', oem: '—', price: '700.000 – 2.500.000đ' },
  { name: 'Cần gạt mưa', oem: '—', price: '250.000 – 700.000đ/cái' },
];

const DEFAULT_SAFETY = ['Túi khí', 'ABS/EBD', 'Cân bằng điện tử', 'Camera lùi'];
const DEFAULT_TECH = ['Màn hình cảm ứng', 'Apple CarPlay/Android Auto', 'Khởi động nút bấm'];
const DEFAULT_ADAS = ['Phanh khẩn cấp tự động', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera 360'];

const warrantyBySlug: Record<string, string> = {
  toyota: '3 năm / 100.000 km',
  honda: '5 năm / 50.000 km',
  mitsubishi: '5 năm / 100.000 km',
  hyundai: '5 năm / không giới hạn km',
  kia: '5 năm / 150.000 km',
  mazda: '5 năm / 100.000 km',
  nissan: '3 năm / 100.000 km',
  subaru: '5 năm / 150.000 km',
  suzuki: '3 năm / 100.000 km',
  ford: '3 năm / 100.000 km',
  chevrolet: '3 năm / 100.000 km',
  isuzu: '3 năm / 100.000 km',
  'mercedes-benz': '3 năm / không giới hạn km',
  bmw: '3 năm / không giới hạn km',
  audi: '3 năm / không giới hạn km',
  volvo: '3 năm / không giới hạn km',
  lexus: '4 năm / 100.000 km',
  mini: '3 năm / không giới hạn km',
  volkswagen: '3 năm / 100.000 km',
  peugeot: '5 năm / 100.000 km',
  tesla: '4 năm / 80.000 km (pin 8 năm)',
  byd: '6 năm / 150.000 km (pin 8 năm)',
  vinfast: '10 năm / 200.000 km',
};

function ratings(r: Partial<VehicleRatings>): VehicleRatings {
  return {
    safety: 3, reliability: 3, comfort: 3, performance: 3, tech: 3,
    resale: 3, cargo: 3, fuelEcon: 3, brandRep: 3, family: 3, ...r,
  };
}

function priceLabel(min: number, max: number): string {
  const t = (n: number): string => {
    const b = n / 1000;
    return Number.isInteger(b) ? String(b) : b.toFixed(2).replace('.', ',');
  };
  if (max >= 1000) return `${t(min)} – ${t(max)} tỷ`;
  return `${min} – ${max} triệu`;
}

function maintByTier(pmin: number, fuel: FuelType): string {
  if (fuel === 'Điện') return '2 – 4 triệu';
  if (pmin < 600) return '4 – 6 triệu';
  if (pmin < 1000) return '6 – 9 triệu';
  if (pmin < 1800) return '8 – 14 triệu';
  return '15 – 25 triệu';
}

interface Mk {
  id: string; brandSlug: string; model: string; gen: string; year?: number; trim: string;
  engine: string; trans: string; fuel: FuelType; drive: DriveType; seats: number; segment: string;
  pmin: number; pmax: number; warranty?: string; econ: string;
  dims: [number, number, number, number]; cargo: number; hp: number; torque: number;
  safety?: string[]; tech?: string[]; maintYear?: string; issues?: string[];
  rel: number; image: string; r?: Partial<VehicleRatings>;
}

function mk(o: Mk): Vehicle {
  const brand = getBrand(o.brandSlug);
  const safety = o.safety ?? (o.pmin >= 700 ? [...DEFAULT_SAFETY.slice(0, 2), ...DEFAULT_ADAS] : DEFAULT_SAFETY);
  return {
    id: o.id,
    brand: brand?.name ?? o.brandSlug,
    brandSlug: o.brandSlug,
    model: o.model,
    generation: o.gen,
    year: o.year ?? 2025,
    trim: o.trim,
    engine: o.engine,
    transmission: o.trans,
    fuelType: o.fuel,
    driveType: o.drive,
    seats: o.seats,
    segment: o.segment,
    price: { min: o.pmin, max: o.pmax, currency: 'VND', label: priceLabel(o.pmin, o.pmax) },
    warranty: o.warranty ?? warrantyBySlug[o.brandSlug] ?? '3 năm / 100.000 km',
    fuelEconomy: o.econ,
    dimensions: { length: o.dims[0], width: o.dims[1], height: o.dims[2], wheelbase: o.dims[3] },
    cargo: o.cargo,
    horsepower: o.hp,
    torque: o.torque,
    safetyFeatures: safety,
    techFeatures: o.tech ?? DEFAULT_TECH,
    maintenanceCostPerYear: o.maintYear ?? maintByTier(o.pmin, o.fuel),
    commonIssues: o.issues ?? ['Số liệu tham khảo theo thị trường VN; nên lái thử & kiểm tra thực tế.'],
    reliability: o.rel,
    image: o.image,
    ratings: ratings({ reliability: o.rel, ...o.r }),
  };
}

export const vehicles: Vehicle[] = [
  // ===== Toyota =====
  mk({ id: 'toyota-vios', brandSlug: 'toyota', model: 'Vios', gen: 'XP150 (2023)', trim: '1.5G CVT', engine: '1.5L xăng 2NR-VE', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 458, pmax: 545, econ: '~5,5 L/100km', dims: [4425, 1730, 1475, 2620], cargo: 506, hp: 107, torque: 140, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg/330px-Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg', r: { safety: 3, resale: 5, fuelEcon: 5, brandRep: 5 } }),
  mk({ id: 'toyota-corolla-cross', brandSlug: 'toyota', model: 'Corolla Cross', gen: 'XG10 (2024)', trim: '1.8HEV', engine: '1.8L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 820, pmax: 935, econ: '~5,0 L/100km', dims: [4460, 1825, 1620, 2640], cargo: 440, hp: 140, torque: 142, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg', r: { safety: 5, comfort: 4, tech: 4, fuelEcon: 4, family: 4 } }),
  mk({ id: 'toyota-camry', brandSlug: 'toyota', model: 'Camry', gen: 'XV70 (2022)', trim: '2.5HEV', engine: '2.5L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 5, segment: 'Sedan hạng D', pmin: 1105, pmax: 1495, econ: '~5,5 L/100km', dims: [4885, 1840, 1445, 2825], cargo: 493, hp: 218, torque: 221, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg', r: { safety: 5, comfort: 5, reliability: 5, resale: 5, brandRep: 5 } }),
  mk({ id: 'toyota-yaris-cross', brandSlug: 'toyota', model: 'Yaris Cross', gen: 'XP210 (2023)', trim: '1.5 HEV', engine: '1.5L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 650, pmax: 765, econ: '~4,0 L/100km', dims: [4180, 1765, 1590, 2620], cargo: 390, hp: 116, torque: 141, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg/330px-Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg', r: { fuelEcon: 5, safety: 4, tech: 4 } }),
  mk({ id: 'toyota-innova', brandSlug: 'toyota', model: 'Innova Cross', gen: 'Zenix (2024)', trim: '2.0 HEV', engine: '2.0L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 7, segment: 'MPV hạng C', pmin: 810, pmax: 999, econ: '~5,5 L/100km', dims: [4755, 1850, 1795, 2850], cargo: 300, hp: 186, torque: 188, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg/330px-Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg', r: { family: 5, comfort: 4, fuelEcon: 4, safety: 4 } }),
  mk({ id: 'toyota-fortuner', brandSlug: 'toyota', model: 'Fortuner', gen: 'AN160 (2024)', trim: '2.4 4x2 AT dầu', engine: '2.4L turbo dầu', trans: 'AT 6 cấp', fuel: 'Dầu', drive: 'RWD', seats: 7, segment: 'SUV 7 chỗ', pmin: 1055, pmax: 1470, econ: '~8,0 L/100km', dims: [4795, 1855, 1835, 2745], cargo: 716, hp: 150, torque: 400, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg', r: { safety: 4, resale: 5, cargo: 5, family: 5, fuelEcon: 2 } }),
  mk({ id: 'toyota-hilux', brandSlug: 'toyota', model: 'Hilux', gen: 'AN120 (2024)', trim: '2.4 AT 4x4', engine: '2.4L turbo dầu', trans: 'AT 6 cấp', fuel: 'Dầu', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 668, pmax: 999, econ: '~7,5 L/100km', dims: [5325, 1855, 1815, 3085], cargo: 1000, hp: 150, torque: 400, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg', r: { reliability: 5, cargo: 5, performance: 4, fuelEcon: 2 } }),

  // ===== Honda =====
  mk({ id: 'honda-city', brandSlug: 'honda', model: 'City', gen: 'GN (2023)', trim: 'RS', engine: '1.5L i-VTEC', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 499, pmax: 599, econ: '~5,4 L/100km', dims: [4580, 1748, 1467, 2600], cargo: 519, hp: 119, torque: 145, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg/330px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg', r: { safety: 4, performance: 4, fuelEcon: 4, brandRep: 4 } }),
  mk({ id: 'honda-civic', brandSlug: 'honda', model: 'Civic', gen: 'FE (2022)', trim: 'RS 1.5T', engine: '1.5L turbo', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng C', pmin: 730, pmax: 875, econ: '~6,0 L/100km', dims: [4678, 1802, 1415, 2735], cargo: 419, hp: 178, torque: 240, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg/330px-Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg', r: { performance: 5, tech: 4, safety: 4, brandRep: 4 } }),
  mk({ id: 'honda-hrv', brandSlug: 'honda', model: 'HR-V', gen: 'RV (2022)', trim: 'RS e:HEV', engine: '1.5L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 699, pmax: 871, econ: '~5,5 L/100km', dims: [4385, 1790, 1590, 2610], cargo: 335, hp: 131, torque: 253, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2023_Honda_HR-V_Advance_i-MMD_CVT_1.5.jpg/330px-2023_Honda_HR-V_Advance_i-MMD_CVT_1.5.jpg', r: { fuelEcon: 4, comfort: 4, safety: 4, tech: 4 } }),
  mk({ id: 'honda-crv', brandSlug: 'honda', model: 'CR-V', gen: 'RS6 (2024)', trim: 'e:HEV RS', engine: '2.0L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'AWD', seats: 5, segment: 'SUV hạng C', pmin: 1109, pmax: 1310, econ: '~5,5 L/100km', dims: [4691, 1866, 1681, 2700], cargo: 580, hp: 204, torque: 335, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg/330px-Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg', r: { safety: 5, comfort: 4, performance: 4, tech: 4, family: 4 } }),
  mk({ id: 'honda-accord', brandSlug: 'honda', model: 'Accord', gen: 'CV (2023)', trim: '1.5T', engine: '1.5L turbo', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng D', pmin: 1319, pmax: 1369, econ: '~6,5 L/100km', dims: [4906, 1862, 1450, 2830], cargo: 570, hp: 192, torque: 260, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2023_Honda_Accord_LX%2C_front_left%2C_07-13-2023.jpg/330px-2023_Honda_Accord_LX%2C_front_left%2C_07-13-2023.jpg', r: { comfort: 5, safety: 5, performance: 4, brandRep: 4 } }),

  // ===== Mitsubishi =====
  mk({ id: 'mitsubishi-xpander', brandSlug: 'mitsubishi', model: 'Xpander', gen: '(2022 FL)', trim: '1.5 AT Premium', engine: '1.5L xăng', trans: 'AT 4 cấp', fuel: 'Xăng', drive: 'FWD', seats: 7, segment: 'MPV 7 chỗ', pmin: 560, pmax: 658, econ: '~6,5 L/100km', dims: [4595, 1750, 1750, 2775], cargo: 322, hp: 105, torque: 141, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mitsubishi_Xpander_NC1W_FL2_1.5_GLS_Quartz_White_Pearl_01.jpg/330px-Mitsubishi_Xpander_NC1W_FL2_1.5_GLS_Quartz_White_Pearl_01.jpg', r: { cargo: 4, fuelEcon: 4, family: 5, brandRep: 4 } }),
  mk({ id: 'mitsubishi-xforce', brandSlug: 'mitsubishi', model: 'Xforce', gen: '(2024)', trim: '1.5 CVT Ultimate', engine: '1.5L xăng', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 620, pmax: 705, econ: '~6,0 L/100km', dims: [4390, 1810, 1660, 2650], cargo: 390, hp: 105, torque: 141, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2024_Mitsubishi_Xforce_Ultimate_%28front%29.jpg/330px-2024_Mitsubishi_Xforce_Ultimate_%28front%29.jpg', r: { tech: 4, fuelEcon: 4, family: 4, safety: 4 } }),
  mk({ id: 'mitsubishi-outlander', brandSlug: 'mitsubishi', model: 'Outlander', gen: '(2022)', trim: '2.0 CVT Premium', engine: '2.0L xăng', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 825, pmax: 950, econ: '~7,2 L/100km', dims: [4710, 1862, 1745, 2706], cargo: 477, hp: 150, torque: 195, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/2025_Mitsubishi_Outlander_PHEV_%28fourth_generation%29_IMG_3129.jpg/330px-2025_Mitsubishi_Outlander_PHEV_%28fourth_generation%29_IMG_3129.jpg', r: { comfort: 4, safety: 4, family: 4 } }),
  mk({ id: 'mitsubishi-triton', brandSlug: 'mitsubishi', model: 'Triton', gen: '(2024)', trim: '2.4 AT 4x4', engine: '2.4L turbo dầu', trans: 'AT 6 cấp', fuel: 'Dầu', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 650, pmax: 965, econ: '~7,0 L/100km', dims: [5360, 1930, 1815, 3130], cargo: 1100, hp: 184, torque: 430, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mitsubishi_Triton_LC_2.4_GLS_2WD_Blade_Silver_Metallic_%28cropped%29.jpg/330px-Mitsubishi_Triton_LC_2.4_GLS_2WD_Blade_Silver_Metallic_%28cropped%29.jpg', r: { cargo: 5, performance: 4, reliability: 4, fuelEcon: 2 } }),
  mk({ id: 'mitsubishi-pajero-sport', brandSlug: 'mitsubishi', model: 'Pajero Sport', gen: '(2024)', trim: '2.4 AT 4x4', engine: '2.4L turbo dầu', trans: 'AT 8 cấp', fuel: 'Dầu', drive: '4WD', seats: 7, segment: 'SUV 7 chỗ', pmin: 1080, pmax: 1340, econ: '~8,0 L/100km', dims: [4825, 1815, 1835, 2800], cargo: 673, hp: 181, torque: 430, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Mitsubishi_Pajero_Sport_%283rd_generation%29_1X7A0409.jpg/330px-Mitsubishi_Pajero_Sport_%283rd_generation%29_1X7A0409.jpg', r: { safety: 4, cargo: 5, family: 5, performance: 4, fuelEcon: 2 } }),

  // ===== Hyundai =====
  mk({ id: 'hyundai-accent', brandSlug: 'hyundai', model: 'Accent', gen: 'HC (2024)', trim: '1.5 AT đặc biệt', engine: '1.5L Smartstream', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 439, pmax: 569, econ: '~5,5 L/100km', dims: [4535, 1750, 1465, 2670], cargo: 480, hp: 115, torque: 143.8, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2019_Hyundai_Accent_1.6L%2C_front_10.8.19.jpg/330px-2019_Hyundai_Accent_1.6L%2C_front_10.8.19.jpg', r: { safety: 4, comfort: 4, tech: 4, fuelEcon: 4, resale: 3 } }),
  mk({ id: 'hyundai-creta', brandSlug: 'hyundai', model: 'Creta', gen: 'SU2 (2022)', trim: '1.5 đặc biệt', engine: '1.5L Smartstream', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 599, pmax: 740, econ: '~6,5 L/100km', dims: [4315, 1790, 1635, 2610], cargo: 433, hp: 115, torque: 144, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg/330px-2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg', r: { tech: 4, comfort: 4, safety: 4, family: 4 } }),
  mk({ id: 'hyundai-tucson', brandSlug: 'hyundai', model: 'Tucson', gen: 'NX4 (2022)', trim: '2.0 đặc biệt', engine: '2.0L xăng', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 769, pmax: 919, econ: '~7,5 L/100km', dims: [4630, 1865, 1665, 2755], cargo: 620, hp: 156, torque: 196, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg/330px-2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg', r: { safety: 5, comfort: 4, tech: 5, cargo: 4, family: 4 } }),
  mk({ id: 'hyundai-santafe', brandSlug: 'hyundai', model: 'Santa Fe', gen: 'MX5 (2024)', trim: '2.5T xăng AWD', engine: '2.5L turbo', trans: 'DCT 8 cấp', fuel: 'Xăng', drive: 'AWD', seats: 7, segment: 'SUV hạng D 7 chỗ', pmin: 1069, pmax: 1365, econ: '~8,0 L/100km', dims: [4830, 1900, 1720, 2815], cargo: 628, hp: 194, torque: 422, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/2024_Hyundai_Santa_Fe_Luxury_AWD_in_Hampton_Grey%2C_front_left%2C_2024-06-30.jpg/330px-2024_Hyundai_Santa_Fe_Luxury_AWD_in_Hampton_Grey%2C_front_left%2C_2024-06-30.jpg', r: { safety: 5, comfort: 5, tech: 5, cargo: 5, family: 5 } }),
  mk({ id: 'hyundai-palisade', brandSlug: 'hyundai', model: 'Palisade', gen: 'LX2 (2023)', trim: '2.2 dầu cao cấp', engine: '2.2L turbo dầu', trans: 'AT 8 cấp', fuel: 'Dầu', drive: 'AWD', seats: 7, segment: 'SUV hạng E 7 chỗ', pmin: 1469, pmax: 1589, econ: '~7,5 L/100km', dims: [4995, 1975, 1750, 2900], cargo: 704, hp: 200, torque: 440, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyundai_Palisade_2.5T_Calligraphy_LX3_Creamy_White_Pearl_%2846%29_%28cropped%29.jpg/330px-Hyundai_Palisade_2.5T_Calligraphy_LX3_Creamy_White_Pearl_%2846%29_%28cropped%29.jpg', r: { safety: 5, comfort: 5, cargo: 5, family: 5, fuelEcon: 3 } }),

  // ===== Kia =====
  mk({ id: 'kia-sonet', brandSlug: 'kia', model: 'Sonet', gen: 'AY (2024)', trim: '1.5 Premium', engine: '1.5L Smartstream', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng A+', pmin: 539, pmax: 624, econ: '~6,0 L/100km', dims: [3995, 1790, 1610, 2500], cargo: 392, hp: 115, torque: 144, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/2021_Kia_Sonet_1.5_Premiere_%28Indonesia%29_front_view_02.jpg/330px-2021_Kia_Sonet_1.5_Premiere_%28Indonesia%29_front_view_02.jpg', r: { tech: 4, fuelEcon: 4, safety: 4 } }),
  mk({ id: 'kia-seltos', brandSlug: 'kia', model: 'Seltos', gen: 'SP2 (2023)', trim: '1.5 Premium', engine: '1.5L Smartstream', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 599, pmax: 729, econ: '~6,5 L/100km', dims: [4365, 1800, 1645, 2630], cargo: 433, hp: 115, torque: 144, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg/330px-Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg', r: { safety: 4, tech: 5, comfort: 4, fuelEcon: 4, family: 4 } }),
  mk({ id: 'kia-sportage', brandSlug: 'kia', model: 'Sportage', gen: 'NQ5 (2022)', trim: '2.0 Signature', engine: '2.0L xăng', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 899, pmax: 1099, econ: '~7,5 L/100km', dims: [4660, 1865, 1665, 2755], cargo: 587, hp: 156, torque: 196, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Kia_Sportage_S_front_only.jpg/330px-2025_Kia_Sportage_S_front_only.jpg', r: { safety: 5, comfort: 4, tech: 5, cargo: 4, family: 4 } }),
  mk({ id: 'kia-sorento', brandSlug: 'kia', model: 'Sorento', gen: 'MQ4 (2024)', trim: '2.2 dầu Signature', engine: '2.2L turbo dầu', trans: 'DCT 8 cấp', fuel: 'Dầu', drive: 'AWD', seats: 7, segment: 'SUV hạng D 7 chỗ', pmin: 999, pmax: 1359, econ: '~6,5 L/100km', dims: [4815, 1900, 1700, 2815], cargo: 821, hp: 202, torque: 440, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/2024_Kia_Sorento_X-Line_SX_Prestige_%28facelift%29%2C_front_12.20.24.jpg/330px-2024_Kia_Sorento_X-Line_SX_Prestige_%28facelift%29%2C_front_12.20.24.jpg', r: { safety: 5, comfort: 5, tech: 5, cargo: 5, family: 5 } }),
  mk({ id: 'kia-carnival', brandSlug: 'kia', model: 'Carnival', gen: 'KA4 (2022)', trim: '2.2 dầu Signature', engine: '2.2L turbo dầu', trans: 'AT 8 cấp', fuel: 'Dầu', drive: 'FWD', seats: 7, segment: 'MPV hạng D', pmin: 1199, pmax: 1869, econ: '~7,0 L/100km', dims: [5155, 1995, 1775, 3090], cargo: 627, hp: 202, torque: 440, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2025_Kia_Carnival_Hybrid_EX%2C_front_right%2C_10-12-2025.jpg/330px-2025_Kia_Carnival_Hybrid_EX%2C_front_right%2C_10-12-2025.jpg', r: { comfort: 5, cargo: 5, family: 5, safety: 4 } }),

  // ===== Mazda =====
  mk({ id: 'mazda-2', brandSlug: 'mazda', model: 'Mazda2', gen: 'DJ (2023 FL)', trim: '1.5 Luxury', engine: '1.5L Skyactiv-G', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 408, pmax: 545, econ: '~5,5 L/100km', dims: [4420, 1695, 1470, 2570], cargo: 440, hp: 110, torque: 144, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2021_Mazda2_GT_Sport_NAV_MHEV_1.5_Front.jpg/330px-2021_Mazda2_GT_Sport_NAV_MHEV_1.5_Front.jpg', r: { comfort: 4, fuelEcon: 4, safety: 4 } }),
  mk({ id: 'mazda-3', brandSlug: 'mazda', model: 'Mazda3', gen: 'BP (2022 FL)', trim: '2.0 Signature Premium', engine: '2.0L Skyactiv-G', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng C', pmin: 579, pmax: 739, econ: '~6,5 L/100km', dims: [4660, 1795, 1440, 2725], cargo: 450, hp: 153, torque: 200, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mazda3_SKYACTIV-G.jpg/330px-Mazda3_SKYACTIV-G.jpg', r: { comfort: 4, tech: 4, performance: 4, safety: 4 } }),
  mk({ id: 'mazda-cx5', brandSlug: 'mazda', model: 'CX-5', gen: 'KF (2023 FL)', trim: '2.0 Premium', engine: '2.0L Skyactiv-G', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 749, pmax: 979, econ: '~7,0 L/100km', dims: [4575, 1845, 1680, 2700], cargo: 442, hp: 154, torque: 200, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2024_Mazda_CX-5_2.5_S_Select_in_Platinum_Quartz_Metallic%2C_front_right.jpg/330px-2024_Mazda_CX-5_2.5_S_Select_in_Platinum_Quartz_Metallic%2C_front_right.jpg', r: { comfort: 4, tech: 4, performance: 4, safety: 4, brandRep: 4 } }),
  mk({ id: 'mazda-cx8', brandSlug: 'mazda', model: 'CX-8', gen: 'KG (2023 FL)', trim: '2.5 Premium AWD', engine: '2.5L Skyactiv-G', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'AWD', seats: 7, segment: 'SUV hạng D 7 chỗ', pmin: 1019, pmax: 1259, econ: '~8,0 L/100km', dims: [4900, 1840, 1730, 2930], cargo: 209, hp: 188, torque: 252, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mazda_CX-8_Skyactiv-D_2.2_%E2%80%93_f_21032025.jpg/330px-Mazda_CX-8_Skyactiv-D_2.2_%E2%80%93_f_21032025.jpg', r: { comfort: 5, family: 4, safety: 4, cargo: 4 } }),

  // ===== Nissan =====
  mk({ id: 'nissan-almera', brandSlug: 'nissan', model: 'Almera', gen: 'N18 (2024)', trim: '1.0 turbo VL', engine: '1.0L turbo', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 489, pmax: 569, econ: '~5,0 L/100km', dims: [4495, 1740, 1460, 2620], cargo: 482, hp: 100, torque: 152, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/2023_Nissan_Versa_%28N18%29_IMG_3105.jpg/330px-2023_Nissan_Versa_%28N18%29_IMG_3105.jpg', r: { fuelEcon: 5, safety: 4, resale: 3 } }),
  mk({ id: 'nissan-kicks', brandSlug: 'nissan', model: 'Kicks', gen: 'P15 (2022)', trim: 'e-Power VL', engine: '1.2L + e-Power', trans: 'e-CVT', fuel: 'Hybrid', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 789, pmax: 859, econ: '~4,5 L/100km', dims: [4290, 1760, 1605, 2620], cargo: 423, hp: 136, torque: 280, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2025_Nissan_Kicks_SV_AWD_in_Deep_Blue_Pearl%2C_front_right%2C_2024-10-06.jpg/330px-2025_Nissan_Kicks_SV_AWD_in_Deep_Blue_Pearl%2C_front_right%2C_2024-10-06.jpg', r: { fuelEcon: 5, tech: 4, comfort: 4 } }),
  mk({ id: 'nissan-navara', brandSlug: 'nissan', model: 'Navara', gen: 'D23 (2021 FL)', trim: '2.3 AT 4x4 VL', engine: '2.3L twin-turbo dầu', trans: 'AT 7 cấp', fuel: 'Dầu', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 679, pmax: 955, econ: '~7,5 L/100km', dims: [5260, 1850, 1840, 3150], cargo: 1000, hp: 190, torque: 450, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2018_Nissan_Navara_Tekna_DCi_Automatic_2.3.jpg/330px-2018_Nissan_Navara_Tekna_DCi_Automatic_2.3.jpg', r: { cargo: 5, performance: 4, reliability: 4, fuelEcon: 2 } }),

  // ===== Subaru =====
  mk({ id: 'subaru-forester', brandSlug: 'subaru', model: 'Forester', gen: 'SK (2023)', trim: '2.0 i-S EyeSight', engine: '2.0L Boxer', trans: 'CVT', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng C', pmin: 969, pmax: 1199, econ: '~8,0 L/100km', dims: [4625, 1815, 1730, 2670], cargo: 498, hp: 156, torque: 196, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Subaru_Forester_%28SL%29_e-BOXER_DSC_8811.jpg/330px-Subaru_Forester_%28SL%29_e-BOXER_DSC_8811.jpg', r: { safety: 5, performance: 4, comfort: 4, fuelEcon: 2 } }),
  mk({ id: 'subaru-crosstrek', brandSlug: 'subaru', model: 'Crosstrek', gen: '(2023)', trim: '2.0i-S EyeSight', engine: '2.0L Boxer', trans: 'CVT', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng C', pmin: 1099, pmax: 1199, econ: '~7,5 L/100km', dims: [4495, 1800, 1615, 2670], cargo: 315, hp: 156, torque: 194, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Subaru_Crosstrek_2.0ie_Active_%28III%29_%E2%80%93_f_31052025.jpg/330px-Subaru_Crosstrek_2.0ie_Active_%28III%29_%E2%80%93_f_31052025.jpg', r: { safety: 5, performance: 4, comfort: 4 } }),
  mk({ id: 'subaru-outback', brandSlug: 'subaru', model: 'Outback', gen: '(2023)', trim: '2.5i-T EyeSight', engine: '2.5L Boxer', trans: 'CVT', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'Wagon hạng D', pmin: 1399, pmax: 1969, econ: '~8,5 L/100km', dims: [4870, 1875, 1675, 2745], cargo: 522, hp: 169, torque: 252, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2026_Subaru_Outback_Wilderness%2C_front_left%2C_05-24-2026.jpg/330px-2026_Subaru_Outback_Wilderness%2C_front_left%2C_05-24-2026.jpg', r: { safety: 5, comfort: 4, cargo: 4, performance: 4, fuelEcon: 2 } }),

  // ===== Suzuki =====
  mk({ id: 'suzuki-swift', brandSlug: 'suzuki', model: 'Swift', gen: '(2024)', trim: '1.2 CVT', engine: '1.2L Hybrid nhẹ', trans: 'CVT', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Hatchback hạng B', pmin: 549, pmax: 575, econ: '~4,6 L/100km', dims: [3860, 1735, 1520, 2450], cargo: 265, hp: 82, torque: 112, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg/330px-Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg', r: { fuelEcon: 5, performance: 3, resale: 3 } }),
  mk({ id: 'suzuki-xl7', brandSlug: 'suzuki', model: 'XL7', gen: '(2024 Hybrid)', trim: '1.5 AT Hybrid', engine: '1.5L Smart Hybrid', trans: 'AT 4 cấp', fuel: 'Hybrid', drive: 'FWD', seats: 7, segment: 'MPV 7 chỗ', pmin: 599, pmax: 658, econ: '~6,0 L/100km', dims: [4450, 1775, 1710, 2740], cargo: 209, hp: 103, torque: 138, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Suzuki_Ertiga_NC_FL_1.5_GLX_Hybrid_Snow_White_Pearl.jpg/330px-Suzuki_Ertiga_NC_FL_1.5_GLX_Hybrid_Snow_White_Pearl.jpg', r: { fuelEcon: 4, family: 4, safety: 3 } }),
  mk({ id: 'suzuki-jimny', brandSlug: 'suzuki', model: 'Jimny', gen: '(2024)', trim: '1.5 AT 4x4', engine: '1.5L xăng', trans: 'AT 4 cấp', fuel: 'Xăng', drive: '4WD', seats: 4, segment: 'SUV hạng A', pmin: 789, pmax: 799, econ: '~6,5 L/100km', dims: [3645, 1645, 1720, 2250], cargo: 85, hp: 102, torque: 130, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/2019_Suzuki_Jimny_SZ5_4X4_Automatic_1.5.jpg/330px-2019_Suzuki_Jimny_SZ5_4X4_Automatic_1.5.jpg', r: { performance: 4, reliability: 4, cargo: 1, family: 1 } }),

  // ===== Ford =====
  mk({ id: 'ford-ranger', brandSlug: 'ford', model: 'Ranger', gen: 'P703 (2023)', trim: 'Wildtrak 2.0 Bi-Turbo', engine: '2.0L Bi-Turbo dầu', trans: 'AT 10 cấp', fuel: 'Dầu', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 776, pmax: 974, econ: '~8,0 L/100km', dims: [5370, 1918, 1884, 3270], cargo: 1233, hp: 207, torque: 500, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Ford_Ranger_%28T6%2C_P703%29_Wildtrak_IMG_7320.jpg/330px-Ford_Ranger_%28T6%2C_P703%29_Wildtrak_IMG_7320.jpg', r: { performance: 5, cargo: 5, tech: 4, safety: 4, fuelEcon: 2 } }),
  mk({ id: 'ford-everest', brandSlug: 'ford', model: 'Everest', gen: 'U704 (2023)', trim: 'Titanium 2.0 Bi-Turbo 4WD', engine: '2.0L Bi-Turbo dầu', trans: 'AT 10 cấp', fuel: 'Dầu', drive: '4WD', seats: 7, segment: 'SUV 7 chỗ', pmin: 1099, pmax: 1545, econ: '~8,5 L/100km', dims: [4914, 1923, 1842, 2900], cargo: 898, hp: 207, torque: 500, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ford_Everest_3.0_V6_Turbo_Diesel_4WD_Platinum_%28III%29_%E2%80%93_f_02012026.jpg/330px-Ford_Everest_3.0_V6_Turbo_Diesel_4WD_Platinum_%28III%29_%E2%80%93_f_02012026.jpg', r: { safety: 5, comfort: 4, performance: 5, cargo: 5, family: 5, fuelEcon: 2 } }),

  // ===== Chevrolet =====
  mk({ id: 'chevrolet-trailblazer', brandSlug: 'chevrolet', model: 'Trailblazer', gen: '(2021)', trim: '2.0 RS', engine: '2.0L turbo', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 699, pmax: 799, year: 2024, econ: '~7,0 L/100km', dims: [4425, 1810, 1635, 2640], cargo: 460, hp: 155, torque: 240, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2021_Chevrolet_TrailBlazer_RS_AWD%2C_front_7.11.20.jpg/330px-2021_Chevrolet_TrailBlazer_RS_AWD%2C_front_7.11.20.jpg', issues: ['Mạng lưới dịch vụ tại VN hạn chế.'], r: { performance: 4, cargo: 4, safety: 4, resale: 2, brandRep: 3 } }),
  mk({ id: 'chevrolet-colorado', brandSlug: 'chevrolet', model: 'Colorado', gen: '(2023)', trim: '2.7 Z71', engine: '2.7L turbo', trans: 'AT 8 cấp', fuel: 'Xăng', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 789, pmax: 899, year: 2024, econ: '~9,0 L/100km', dims: [5410, 1880, 1795, 3270], cargo: 1100, hp: 310, torque: 542, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/2024_Chevrolet_Colorado_Z71%2C_front_left%2C_09-28-2024.jpg/330px-2024_Chevrolet_Colorado_Z71%2C_front_left%2C_09-28-2024.jpg', issues: ['Tiêu hao xăng cao', 'Dịch vụ hạn chế tại VN.'], r: { performance: 5, cargo: 5, resale: 2, fuelEcon: 1 } }),

  // ===== Isuzu =====
  mk({ id: 'isuzu-dmax', brandSlug: 'isuzu', model: 'D-Max', gen: 'RG (2022)', trim: '1.9 4x4 Type Z', engine: '1.9L turbo dầu', trans: 'AT 6 cấp', fuel: 'Dầu', drive: '4WD', seats: 5, segment: 'Bán tải', pmin: 650, pmax: 880, econ: '~7,0 L/100km', dims: [5265, 1870, 1790, 3125], cargo: 1170, hp: 150, torque: 350, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Isuzu_D-Max_%28third_generation%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2758.jpg/330px-Isuzu_D-Max_%28third_generation%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2758.jpg', r: { reliability: 5, cargo: 5, fuelEcon: 4, performance: 4 } }),
  mk({ id: 'isuzu-mux', brandSlug: 'isuzu', model: 'mu-X', gen: 'RJ (2021)', trim: '1.9 4x2 cao cấp', engine: '1.9L turbo dầu', trans: 'AT 6 cấp', fuel: 'Dầu', drive: 'RWD', seats: 7, segment: 'SUV 7 chỗ', pmin: 880, pmax: 1120, econ: '~7,5 L/100km', dims: [4850, 1870, 1875, 2855], cargo: 311, hp: 150, torque: 350, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Isuzu_MU-X_LS-M_%28II%2C_Facelift%29_%E2%80%93_f_02012026.jpg/330px-Isuzu_MU-X_LS-M_%28II%2C_Facelift%29_%E2%80%93_f_02012026.jpg', r: { reliability: 5, cargo: 4, fuelEcon: 4, family: 4 } }),

  // ===== Mercedes-Benz =====
  mk({ id: 'mercedes-cclass', brandSlug: 'mercedes-benz', model: 'C-Class', gen: 'W206 (2022)', trim: 'C 300 AMG', engine: '2.0L turbo + mild hybrid', trans: 'AT 9 cấp', fuel: 'Xăng', drive: 'RWD', seats: 5, segment: 'Sedan hạng sang D', pmin: 1709, pmax: 1999, econ: '~7,0 L/100km', dims: [4751, 1820, 1438, 2865], cargo: 455, hp: 258, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Mercedes-Benz_W206_IMG_6380.jpg/330px-Mercedes-Benz_W206_IMG_6380.jpg', issues: ['Phí bảo dưỡng & phụ tùng cao.'], r: { comfort: 5, tech: 5, performance: 5, brandRep: 5, resale: 4 } }),
  mk({ id: 'mercedes-eclass', brandSlug: 'mercedes-benz', model: 'E-Class', gen: 'W214 (2024)', trim: 'E 300 AMG', engine: '2.0L turbo + mild hybrid', trans: 'AT 9 cấp', fuel: 'Xăng', drive: 'RWD', seats: 5, segment: 'Sedan hạng sang E', pmin: 2839, pmax: 3149, econ: '~7,5 L/100km', dims: [4949, 1880, 1468, 2961], cargo: 540, hp: 258, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Mercedes-Benz_W214_1X7A1841.jpg/330px-Mercedes-Benz_W214_1X7A1841.jpg', issues: ['Phí nuôi cao.'], r: { comfort: 5, tech: 5, brandRep: 5, resale: 4 } }),
  mk({ id: 'mercedes-glc', brandSlug: 'mercedes-benz', model: 'GLC', gen: 'X254 (2023)', trim: 'GLC 300 4MATIC', engine: '2.0L turbo + mild hybrid', trans: 'AT 9 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang C', pmin: 2399, pmax: 2699, econ: '~8,0 L/100km', dims: [4716, 1890, 1640, 2888], cargo: 620, hp: 258, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Mercedes-Benz_X254_1X7A6343.jpg/330px-Mercedes-Benz_X254_1X7A6343.jpg', issues: ['Phí nuôi cao.'], r: { comfort: 5, tech: 5, brandRep: 5, cargo: 4 } }),

  // ===== BMW =====
  mk({ id: 'bmw-3series', brandSlug: 'bmw', model: '3 Series', gen: 'G20 LCI (2023)', trim: '330i M Sport', engine: '2.0L turbo', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'RWD', seats: 5, segment: 'Sedan hạng sang D', pmin: 1599, pmax: 1899, econ: '~7,0 L/100km', dims: [4713, 1827, 1440, 2851], cargo: 480, hp: 245, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/BMW_G20_%282022%29_IMG_7316_%282%29.jpg/330px-BMW_G20_%282022%29_IMG_7316_%282%29.jpg', issues: ['Phí bảo dưỡng cao.'], r: { performance: 5, comfort: 4, tech: 5, brandRep: 5, resale: 4 } }),
  mk({ id: 'bmw-5series', brandSlug: 'bmw', model: '5 Series', gen: 'G60 (2024)', trim: '520i M Sport', engine: '2.0L turbo', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'RWD', seats: 5, segment: 'Sedan hạng sang E', pmin: 2499, pmax: 2999, econ: '~7,0 L/100km', dims: [5060, 1900, 1515, 2995], cargo: 520, hp: 255, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/BMW_G60_520i_1X7A2443.jpg/330px-BMW_G60_520i_1X7A2443.jpg', issues: ['Phí nuôi cao.'], r: { performance: 5, comfort: 5, tech: 5, brandRep: 5 } }),
  mk({ id: 'bmw-x3', brandSlug: 'bmw', model: 'X3', gen: 'G45 (2024)', trim: 'xDrive20', engine: '2.0L turbo mild hybrid', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang C', pmin: 1999, pmax: 2499, econ: '~8,0 L/100km', dims: [4755, 1920, 1660, 2865], cargo: 570, hp: 245, torque: 400, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/BMW_G45_20_IMG_3794.jpg/330px-BMW_G45_20_IMG_3794.jpg', issues: ['Phí nuôi cao.'], r: { performance: 4, comfort: 4, tech: 5, brandRep: 5, cargo: 4 } }),

  // ===== Audi =====
  mk({ id: 'audi-a4', brandSlug: 'audi', model: 'A4', gen: 'B9 (2020 FL)', trim: '40 TFSI S line', engine: '2.0L turbo', trans: 'S tronic 7 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng sang D', pmin: 1700, pmax: 1900, year: 2024, econ: '~7,0 L/100km', dims: [4762, 1847, 1428, 2820], cargo: 460, hp: 190, torque: 320, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Audi_A4_B9_sedans_%28FL%29_1X7A2441.jpg/330px-Audi_A4_B9_sedans_%28FL%29_1X7A2441.jpg', issues: ['Phụ tùng nhập, phí cao.'], r: { comfort: 4, tech: 5, brandRep: 5, resale: 3 } }),
  mk({ id: 'audi-q5', brandSlug: 'audi', model: 'Q5', gen: 'FY LCI (2021)', trim: '45 TFSI quattro', engine: '2.0L turbo', trans: 'S tronic 7 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang C', pmin: 2350, pmax: 2650, year: 2024, econ: '~8,0 L/100km', dims: [4682, 1893, 1659, 2819], cargo: 520, hp: 249, torque: 370, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Audi_Q5_2.0_TDI_quattro_S_line_%28GU%29_%E2%80%93_f_13102025.jpg/330px-Audi_Q5_2.0_TDI_quattro_S_line_%28GU%29_%E2%80%93_f_13102025.jpg', issues: ['Phí nuôi cao.'], r: { comfort: 5, tech: 5, brandRep: 5, cargo: 4 } }),

  // ===== Volvo =====
  mk({ id: 'volvo-xc40', brandSlug: 'volvo', model: 'XC40', gen: '(2023 FL)', trim: 'B4 Plus', engine: '2.0L mild hybrid', trans: 'AT 8 cấp', fuel: 'Hybrid', drive: 'AWD', seats: 5, segment: 'SUV hạng sang B', pmin: 1390, pmax: 1750, econ: '~7,5 L/100km', dims: [4425, 1863, 1652, 2702], cargo: 452, hp: 197, torque: 300, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic%2C_front_left%2C_2025-09-22.jpg/330px-2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic%2C_front_left%2C_2025-09-22.jpg', r: { safety: 5, comfort: 4, tech: 4, brandRep: 4 } }),
  mk({ id: 'volvo-xc60', brandSlug: 'volvo', model: 'XC60', gen: '(2022 FL)', trim: 'B5 Ultimate', engine: '2.0L mild hybrid', trans: 'AT 8 cấp', fuel: 'Hybrid', drive: 'AWD', seats: 5, segment: 'SUV hạng sang C', pmin: 1899, pmax: 2199, econ: '~7,5 L/100km', dims: [4708, 1902, 1658, 2865], cargo: 483, hp: 250, torque: 350, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Volvo_XC60_R-Design_D5_P-Pulse_2.0_Front.jpg/330px-2018_Volvo_XC60_R-Design_D5_P-Pulse_2.0_Front.jpg', r: { safety: 5, comfort: 5, tech: 4, family: 4 } }),

  // ===== Lexus =====
  mk({ id: 'lexus-es', brandSlug: 'lexus', model: 'ES', gen: 'XZ10 (2022)', trim: 'ES 250', engine: '2.5L xăng', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng sang E', pmin: 2540, pmax: 2890, econ: '~7,5 L/100km', dims: [4975, 1865, 1445, 2870], cargo: 454, hp: 207, torque: 243, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lexus_ES_350_%28GSZ10%29_IMG_4332.jpg/330px-Lexus_ES_350_%28GSZ10%29_IMG_4332.jpg', r: { comfort: 5, reliability: 5, brandRep: 5, resale: 5 } }),
  mk({ id: 'lexus-rx', brandSlug: 'lexus', model: 'RX', gen: 'AL30 (2023)', trim: 'RX 350 Luxury', engine: '2.4L turbo', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang D', pmin: 3590, pmax: 4060, econ: '~8,5 L/100km', dims: [4890, 1920, 1700, 2850], cargo: 461, hp: 275, torque: 430, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Lexus_RX_500h_F_SPORT%2B_%28V%29_%E2%80%93_f_14072024.jpg/330px-Lexus_RX_500h_F_SPORT%2B_%28V%29_%E2%80%93_f_14072024.jpg', r: { comfort: 5, reliability: 5, tech: 5, brandRep: 5, resale: 5 } }),
  mk({ id: 'lexus-nx', brandSlug: 'lexus', model: 'NX', gen: 'AZ20 (2022)', trim: 'NX 350h', engine: '2.5L Hybrid', trans: 'e-CVT', fuel: 'Hybrid', drive: 'AWD', seats: 5, segment: 'SUV hạng sang C', pmin: 2630, pmax: 2930, econ: '~6,0 L/100km', dims: [4660, 1865, 1640, 2690], cargo: 520, hp: 243, torque: 239, rel: 5, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2023_Lexus_NX_450h%2C_front_4.5.23.jpg/330px-2023_Lexus_NX_450h%2C_front_4.5.23.jpg', r: { comfort: 5, reliability: 5, fuelEcon: 4, brandRep: 5, resale: 5 } }),

  // ===== MINI =====
  mk({ id: 'mini-hatch', brandSlug: 'mini', model: 'Cooper', gen: 'F66 (2024)', trim: 'Cooper S', engine: '2.0L turbo', trans: 'AT 7 cấp', fuel: 'Xăng', drive: 'FWD', seats: 4, segment: 'Hatchback hạng sang', pmin: 1739, pmax: 1899, econ: '~6,5 L/100km', dims: [3858, 1756, 1460, 2495], cargo: 210, hp: 204, torque: 300, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mini_Hatch_%28J01%29_Ditzingen_Mobil_IMG_9772_%28cropped%29.jpg/330px-Mini_Hatch_%28J01%29_Ditzingen_Mobil_IMG_9772_%28cropped%29.jpg', issues: ['Khoang sau & cốp nhỏ.'], r: { performance: 4, tech: 4, brandRep: 4, cargo: 1, family: 1 } }),
  mk({ id: 'mini-countryman', brandSlug: 'mini', model: 'Countryman', gen: 'U25 (2024)', trim: 'S ALL4', engine: '2.0L turbo', trans: 'AT 7 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang B', pmin: 1900, pmax: 2200, econ: '~7,5 L/100km', dims: [4444, 1843, 1661, 2692], cargo: 460, hp: 218, torque: 320, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2018_Mini_Countryman_Cooper_S_2.0_Front.jpg/330px-2018_Mini_Countryman_Cooper_S_2.0_Front.jpg', issues: ['Phí nuôi cao.'], r: { performance: 4, tech: 4, brandRep: 4, comfort: 4 } }),

  // ===== Volkswagen =====
  mk({ id: 'vw-virtus', brandSlug: 'volkswagen', model: 'Virtus', gen: '(2023)', trim: '1.5 TSI', engine: '1.5L TSI', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'Sedan hạng B', pmin: 559, pmax: 599, year: 2024, econ: '~5,8 L/100km', dims: [4561, 1752, 1507, 2651], cargo: 521, hp: 150, torque: 250, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_02.png/330px-2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_02.png', issues: ['Phụ tùng nhập.'], r: { performance: 4, safety: 4, brandRep: 4 } }),
  mk({ id: 'vw-tiguan', brandSlug: 'volkswagen', model: 'Tiguan', gen: 'Allspace (2022)', trim: 'Elegance', engine: '2.0L TSI', trans: 'DSG 7 cấp', fuel: 'Xăng', drive: 'AWD', seats: 7, segment: 'SUV hạng C 7 chỗ', pmin: 1699, pmax: 1899, year: 2024, econ: '~8,0 L/100km', dims: [4723, 1839, 1674, 2790], cargo: 700, hp: 220, torque: 350, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Volkswagen_Tiguan_III_IMG_8823_%28cropped%29.jpg/330px-Volkswagen_Tiguan_III_IMG_8823_%28cropped%29.jpg', issues: ['Hộp số DSG cần chú ý bảo dưỡng.'], r: { performance: 4, comfort: 4, safety: 4, family: 4, brandRep: 4 } }),
  mk({ id: 'vw-touareg', brandSlug: 'volkswagen', model: 'Touareg', gen: 'CR (2023 FL)', trim: 'Elegance', engine: '2.0L TSI', trans: 'AT 8 cấp', fuel: 'Xăng', drive: 'AWD', seats: 5, segment: 'SUV hạng sang E', pmin: 3100, pmax: 3500, year: 2024, econ: '~9,0 L/100km', dims: [4878, 1984, 1717, 2904], cargo: 810, hp: 340, torque: 450, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Volkswagen_Touareg_%282023%29_IMG_2080.jpg/330px-Volkswagen_Touareg_%282023%29_IMG_2080.jpg', issues: ['Phí nuôi cao.'], r: { comfort: 5, performance: 4, cargo: 5, brandRep: 4 } }),

  // ===== Peugeot =====
  mk({ id: 'peugeot-2008', brandSlug: 'peugeot', model: '2008', gen: 'P24 (2021)', trim: '1.2 GT', engine: '1.2L turbo', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng B', pmin: 739, pmax: 829, year: 2024, econ: '~6,0 L/100km', dims: [4304, 1770, 1550, 2612], cargo: 434, hp: 130, torque: 230, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/2023_Peugeot_2008_in_Vertigo_Blue%2C_front_left%2C_06-08-2025.jpg/330px-2023_Peugeot_2008_in_Vertigo_Blue%2C_front_left%2C_06-08-2025.jpg', issues: ['Giữ giá thấp, dịch vụ hạn chế.'], r: { tech: 4, comfort: 4, resale: 2, brandRep: 3 } }),
  mk({ id: 'peugeot-3008', brandSlug: 'peugeot', model: '3008', gen: 'P84 (2021)', trim: '1.6 GT', engine: '1.6L turbo', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 5, segment: 'SUV hạng C', pmin: 969, pmax: 1199, year: 2024, econ: '~7,0 L/100km', dims: [4447, 1841, 1624, 2675], cargo: 520, hp: 165, torque: 240, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg/330px-Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg', issues: ['Giữ giá thấp, dịch vụ hạn chế.'], r: { comfort: 4, tech: 4, safety: 4, resale: 2 } }),
  mk({ id: 'peugeot-5008', brandSlug: 'peugeot', model: '5008', gen: 'P87 (2021)', trim: '1.6 GT 7 chỗ', engine: '1.6L turbo', trans: 'AT 6 cấp', fuel: 'Xăng', drive: 'FWD', seats: 7, segment: 'SUV hạng C 7 chỗ', pmin: 1199, pmax: 1359, year: 2024, econ: '~7,2 L/100km', dims: [4641, 1844, 1646, 2840], cargo: 780, hp: 165, torque: 240, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Peugeot_5008_C_DSC_2949.jpg/330px-Peugeot_5008_C_DSC_2949.jpg', issues: ['Giữ giá thấp, dịch vụ hạn chế.'], r: { comfort: 4, cargo: 5, family: 4, resale: 2 } }),

  // ===== Tesla =====
  mk({ id: 'tesla-model3', brandSlug: 'tesla', model: 'Model 3', gen: 'Highland (2024)', trim: 'RWD', engine: 'Mô-tơ điện đơn (sau)', trans: '1 cấp', fuel: 'Điện', drive: 'RWD', seats: 5, segment: 'Sedan điện', pmin: 1390, pmax: 1590, econ: '~13,2 kWh/100km', dims: [4720, 1849, 1441, 2875], cargo: 594, hp: 283, torque: 420, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg/330px-Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg', issues: ['Hạ tầng sạc còn ít tại VN.'], r: { tech: 5, performance: 5, fuelEcon: 5, safety: 5, brandRep: 4 } }),
  mk({ id: 'tesla-modely', brandSlug: 'tesla', model: 'Model Y', gen: '(2024)', trim: 'RWD', engine: 'Mô-tơ điện đơn (sau)', trans: '1 cấp', fuel: 'Điện', drive: 'RWD', seats: 5, segment: 'SUV điện', pmin: 1490, pmax: 1790, econ: '~15 kWh/100km', dims: [4751, 1921, 1624, 2890], cargo: 854, hp: 299, torque: 420, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Tesla_Model_Y_Premium_%28Facelift%29_%E2%80%93_f_05052026.jpg/330px-Tesla_Model_Y_Premium_%28Facelift%29_%E2%80%93_f_05052026.jpg', issues: ['Hạ tầng sạc còn ít tại VN.'], r: { tech: 5, performance: 4, fuelEcon: 5, safety: 5, cargo: 5, family: 4 } }),

  // ===== BYD =====
  mk({ id: 'byd-atto3', brandSlug: 'byd', model: 'Atto 3', gen: '(2024)', trim: 'Premium', engine: 'Mô-tơ điện (trước)', trans: '1 cấp', fuel: 'Điện', drive: 'FWD', seats: 5, segment: 'SUV điện hạng B', pmin: 766, pmax: 866, econ: '~15,6 kWh/100km', dims: [4455, 1875, 1615, 2720], cargo: 440, hp: 204, torque: 310, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/BYD_Atto_3_1X7A6491.jpg/330px-BYD_Atto_3_1X7A6491.jpg', issues: ['Giữ giá chưa rõ; dịch vụ đang mở rộng.'], r: { tech: 4, fuelEcon: 5, safety: 4, comfort: 4, resale: 2 } }),
  mk({ id: 'byd-dolphin', brandSlug: 'byd', model: 'Dolphin', gen: '(2024)', trim: 'Tiêu chuẩn', engine: 'Mô-tơ điện (trước)', trans: '1 cấp', fuel: 'Điện', drive: 'FWD', seats: 5, segment: 'Hatchback điện B', pmin: 569, pmax: 659, econ: '~13 kWh/100km', dims: [4290, 1770, 1570, 2700], cargo: 345, hp: 95, torque: 180, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2021_BYD_Dolphin_EV_%28front%29.jpg/330px-2021_BYD_Dolphin_EV_%28front%29.jpg', issues: ['Giữ giá chưa rõ.'], r: { fuelEcon: 5, tech: 4, resale: 2 } }),
  mk({ id: 'byd-seal', brandSlug: 'byd', model: 'Seal', gen: '(2024)', trim: 'Premium', engine: 'Mô-tơ điện (sau)', trans: '1 cấp', fuel: 'Điện', drive: 'RWD', seats: 5, segment: 'Sedan điện D', pmin: 1119, pmax: 1359, econ: '~15 kWh/100km', dims: [4800, 1875, 1460, 2920], cargo: 400, hp: 313, torque: 360, rel: 4, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2022_BYD_Seal.jpg/330px-2022_BYD_Seal.jpg', issues: ['Giữ giá chưa rõ.'], r: { performance: 5, tech: 4, fuelEcon: 5, safety: 4, resale: 2 } }),

  // ===== VinFast =====
  mk({ id: 'vinfast-vf3', brandSlug: 'vinfast', model: 'VF 3', gen: '(2024)', trim: 'Tiêu chuẩn', engine: 'Mô-tơ điện (sau)', trans: '1 cấp', fuel: 'Điện', drive: 'RWD', seats: 4, segment: 'Mini SUV điện', pmin: 240, pmax: 322, warranty: '8 năm / 160.000 km', econ: '~13 kWh/100km', dims: [3190, 1679, 1622, 2075], cargo: 285, hp: 43, torque: 110, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/2025_VinFast_VF_3%2C_front_left.jpg/330px-2025_VinFast_VF_3%2C_front_left.jpg', issues: ['Quãng đường ~210km, trang bị cơ bản.'], r: { fuelEcon: 5, tech: 3, brandRep: 3, cargo: 2, family: 2, performance: 2 } }),
  mk({ id: 'vinfast-vf5', brandSlug: 'vinfast', model: 'VF 5', gen: '(2023)', trim: 'Plus', engine: 'Mô-tơ điện (trước)', trans: '1 cấp', fuel: 'Điện', drive: 'FWD', seats: 5, segment: 'SUV điện hạng A', pmin: 529, pmax: 590, econ: '~14 kWh/100km', dims: [3967, 1723, 1579, 2514], cargo: 330, hp: 134, torque: 135, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/2025_VinFast_VF_5_in_Vinfast_Blue%2C_front_left.jpg/330px-2025_VinFast_VF_5_in_Vinfast_Blue%2C_front_left.jpg', issues: ['Phần mềm còn cập nhật.'], r: { fuelEcon: 5, tech: 4, brandRep: 3 } }),
  mk({ id: 'vinfast-vf6', brandSlug: 'vinfast', model: 'VF 6', gen: '(2024)', trim: 'Plus', engine: 'Mô-tơ điện (trước)', trans: '1 cấp', fuel: 'Điện', drive: 'FWD', seats: 5, segment: 'SUV điện hạng B', pmin: 689, pmax: 769, econ: '~15 kWh/100km', dims: [4238, 1820, 1594, 2730], cargo: 423, hp: 174, torque: 250, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/VinFast_VF_6_DSC_8468.jpg/330px-VinFast_VF_6_DSC_8468.jpg', issues: ['Phần mềm còn cập nhật.'], r: { fuelEcon: 4, tech: 4, safety: 4, family: 4, brandRep: 3 } }),
  mk({ id: 'vinfast-vf8', brandSlug: 'vinfast', model: 'VF 8', gen: '(2023)', trim: 'Plus', engine: 'Mô-tơ điện kép', trans: '1 cấp', fuel: 'Điện', drive: 'AWD', seats: 5, segment: 'SUV điện hạng D', pmin: 1019, pmax: 1199, econ: '~19 kWh/100km', dims: [4750, 1934, 1667, 2950], cargo: 376, hp: 402, torque: 620, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/VinFast_VF_8_DSC_8568.jpg/330px-VinFast_VF_8_DSC_8568.jpg', issues: ['Tiêu hao điện cao; phần mềm còn cập nhật.'], r: { tech: 4, performance: 5, safety: 4, family: 4, brandRep: 3 } }),
  mk({ id: 'vinfast-vf9', brandSlug: 'vinfast', model: 'VF 9', gen: '(2023)', trim: 'Plus', engine: 'Mô-tơ điện kép', trans: '1 cấp', fuel: 'Điện', drive: 'AWD', seats: 7, segment: 'SUV điện hạng E 7 chỗ', pmin: 1499, pmax: 1899, econ: '~20 kWh/100km', dims: [5120, 2000, 1721, 3150], cargo: 423, hp: 402, torque: 620, rel: 3, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/VinFast_VF9%2C_front_NYIAS_2022.jpg/330px-VinFast_VF9%2C_front_NYIAS_2022.jpg', issues: ['Tiêu hao điện cao; phần mềm còn cập nhật.'], r: { tech: 4, performance: 5, comfort: 4, cargo: 5, family: 5, brandRep: 3 } }),
];

const vehicleById = new Map(vehicles.map((v) => [v.id, v]));

export function getVehicle(id: string): Vehicle | undefined {
  return vehicleById.get(id);
}

export function getVehiclesByBrand(slug: string): Vehicle[] {
  return vehicles.filter((v) => v.brandSlug === slug);
}

export function getSegments(): string[] {
  return Array.from(new Set(vehicles.map((v) => v.segment))).sort();
}

/** Lịch bảo dưỡng của xe (riêng nếu có, ngược lại dùng mặc định theo loại nhiên liệu). */
export function getMaintenanceSchedule(v: Vehicle): MaintenanceItem[] {
  if (v.maintenanceSchedule) return v.maintenanceSchedule;
  return v.fuelType === 'Điện' ? defaultEvMaintenanceSchedule : defaultMaintenanceSchedule;
}

/** Danh mục phụ tùng của xe (riêng nếu có, ngược lại dùng mặc định). */
export function getPartsCatalog(v: Vehicle): PartItem[] {
  if (v.partsCatalog) return v.partsCatalog;
  return v.fuelType === 'Điện' ? defaultEvPartsCatalog : defaultPartsCatalog;
}
