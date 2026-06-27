import { brands } from './brands.js';

// ===== Cơ sở dữ liệu xe đa hãng (mở rộng dễ: thêm 1 object vào mảng `vehicles`) =====
// Số liệu mang tính THAM KHẢO cho thị trường Việt Nam, có thể đổi theo phiên bản/thời điểm.
// Lịch bảo dưỡng & phụ tùng dùng mặc định dùng chung nếu xe không khai báo riêng
// (xem getMaintenanceSchedule / getPartsCatalog) -> dễ mở rộng, không lặp dữ liệu.

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
  fuelType: 'Xăng' | 'Hybrid' | 'Dầu' | 'Điện';
  driveType: 'FWD' | 'RWD' | 'AWD' | '4WD';
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

// Ảnh placeholder SVG (data URI) — tránh phụ thuộc mạng cho phần dữ liệu lõi.
function placeholderImage(label: string, color: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">` +
    `<rect width="320" height="180" rx="14" fill="${color}"/>` +
    `<path d="M40 120 q10 -40 55 -44 l70 -2 q34 0 52 30 l24 4 q14 2 14 16 q0 9 -11 9 l-200 0 q-11 0 -11 -9 z" fill="rgba(255,255,255,0.92)"/>` +
    `<circle cx="95" cy="118" r="16" fill="#222"/><circle cx="210" cy="118" r="16" fill="#222"/>` +
    `<text x="160" y="160" font-family="Segoe UI,Arial" font-size="16" fill="#fff" text-anchor="middle">${label}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function ratings(r: Partial<VehicleRatings>): VehicleRatings {
  return {
    safety: 3, reliability: 3, comfort: 3, performance: 3, tech: 3,
    resale: 3, cargo: 3, fuelEcon: 3, brandRep: 3, family: 3, ...r,
  };
}

const colorOf = new Map(brands.map((b) => [b.slug, b.color]));

export const vehicles: Vehicle[] = [
  // ===== Toyota =====
  {
    id: 'toyota-vios-g', brand: 'Toyota', brandSlug: 'toyota', model: 'Vios', generation: 'XP150 (2023)',
    year: 2025, trim: '1.5G CVT', engine: '1.5L xăng 2NR-VE', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'Sedan hạng B', price: { min: 458, max: 545, currency: 'VND', label: '458 – 545 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~5,5 L/100km',
    dimensions: { length: 4425, width: 1730, height: 1475, wheelbase: 2620 }, cargo: 506, horsepower: 107, torque: 140,
    safetyFeatures: ['7 túi khí', 'ABS/EBD', 'Cân bằng điện tử', 'Camera lùi'],
    techFeatures: ['Màn hình 9"', 'Apple CarPlay/Android Auto', 'Khởi động nút bấm'],
    maintenanceCostPerYear: '4 – 6 triệu', commonIssues: ['Cách âm tầm trung', 'Vô-lăng nhẹ'], reliability: 5,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg/330px-Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg',
    ratings: ratings({ safety: 3, reliability: 5, resale: 5, fuelEcon: 5, brandRep: 5 }),
  },
  {
    id: 'toyota-corolla-cross-hev', brand: 'Toyota', brandSlug: 'toyota', model: 'Corolla Cross', generation: 'XG10 (2024)',
    year: 2025, trim: '1.8HEV', engine: '1.8L Hybrid', transmission: 'e-CVT', fuelType: 'Hybrid',
    driveType: 'FWD', seats: 5, segment: 'SUV hạng C', price: { min: 820, max: 935, currency: 'VND', label: '820 – 935 triệu' },
    warranty: '3 năm / 100.000 km (pin 8 năm)', fuelEconomy: '~5,0 L/100km',
    dimensions: { length: 4460, width: 1825, height: 1620, wheelbase: 2640 }, cargo: 440, horsepower: 140, torque: 142,
    safetyFeatures: ['Toyota Safety Sense', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera lùi'],
    techFeatures: ['Màn hình 10.1"', 'CarPlay/Android Auto', 'Cửa sổ trời', 'Ghế da'],
    maintenanceCostPerYear: '5 – 8 triệu', commonIssues: ['Nhựa nội thất cứng', 'Cách âm gầm chưa tốt'], reliability: 4,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg',
    ratings: ratings({ safety: 5, comfort: 4, tech: 4, fuelEcon: 4, family: 4 }),
  },
  {
    id: 'toyota-fortuner', brand: 'Toyota', brandSlug: 'toyota', model: 'Fortuner', generation: 'AN160 (2024)',
    year: 2025, trim: '2.4 4x2 AT dầu', engine: '2.4L turbo dầu', transmission: 'AT 6 cấp', fuelType: 'Dầu',
    driveType: 'RWD', seats: 7, segment: 'SUV 7 chỗ', price: { min: 1055, max: 1470, currency: 'VND', label: '1,055 – 1,470 tỷ' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~7,5 – 9 L/100km',
    dimensions: { length: 4795, width: 1855, height: 1835, wheelbase: 2745 }, cargo: 716, horsepower: 150, torque: 400,
    safetyFeatures: ['7 túi khí', 'Kiểm soát lực kéo', 'Hỗ trợ đổ đèo', 'Camera 360 (bản cao)'],
    techFeatures: ['Màn hình 9"', 'CarPlay/Android Auto', 'Ghế da', 'Điều hòa tự động'],
    maintenanceCostPerYear: '8 – 12 triệu', commonIssues: ['Tiêu hao cao', 'Lái không êm như gầm thấp'], reliability: 5,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg',
    ratings: ratings({ safety: 4, reliability: 5, resale: 5, cargo: 5, family: 5, fuelEcon: 2 }),
  },

  // ===== Honda =====
  {
    id: 'honda-city-rs', brand: 'Honda', brandSlug: 'honda', model: 'City', generation: 'GN (2023)',
    year: 2025, trim: 'RS', engine: '1.5L xăng i-VTEC', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'Sedan hạng B', price: { min: 499, max: 599, currency: 'VND', label: '499 – 599 triệu' },
    warranty: '5 năm / 50.000 km', fuelEconomy: '~5,4 L/100km',
    dimensions: { length: 4580, width: 1748, height: 1467, wheelbase: 2600 }, cargo: 519, horsepower: 119, torque: 145,
    safetyFeatures: ['Honda SENSING', 'Cảnh báo va chạm', '6 túi khí', 'Camera làn LaneWatch'],
    techFeatures: ['Màn hình 8"', 'CarPlay/Android Auto', 'Khởi động nút bấm'],
    maintenanceCostPerYear: '4 – 6 triệu', commonIssues: ['Cách âm tầm trung', 'Treo hơi cứng'], reliability: 4,
    image: placeholderImage('Honda City', colorOf.get('honda') ?? '#E60012'),
    ratings: ratings({ safety: 4, reliability: 4, performance: 4, fuelEcon: 4, brandRep: 4 }),
  },
  {
    id: 'honda-crv-hev', brand: 'Honda', brandSlug: 'honda', model: 'CR-V', generation: 'RS6 (2024)',
    year: 2025, trim: 'e:HEV RS', engine: '2.0L Hybrid', transmission: 'e-CVT', fuelType: 'Hybrid',
    driveType: 'AWD', seats: 5, segment: 'SUV hạng C', price: { min: 1109, max: 1310, currency: 'VND', label: '1,109 – 1,310 tỷ' },
    warranty: '5 năm / 50.000 km', fuelEconomy: '~5,5 L/100km',
    dimensions: { length: 4691, width: 1866, height: 1681, wheelbase: 2700 }, cargo: 580, horsepower: 204, torque: 335,
    safetyFeatures: ['Honda SENSING', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera 360'],
    techFeatures: ['Màn hình 10.2"', 'CarPlay/Android Auto', 'Cửa sổ trời toàn cảnh', 'Bose'],
    maintenanceCostPerYear: '6 – 9 triệu', commonIssues: ['Giá cao', 'Phanh hybrid lạ chân lúc đầu'], reliability: 4,
    image: placeholderImage('Honda CR-V', colorOf.get('honda') ?? '#E60012'),
    ratings: ratings({ safety: 5, comfort: 4, performance: 4, tech: 4, family: 4 }),
  },

  // ===== Mitsubishi =====
  {
    id: 'mitsubishi-xpander', brand: 'Mitsubishi', brandSlug: 'mitsubishi', model: 'Xpander', generation: '(2022 facelift)',
    year: 2025, trim: '1.5 AT Premium', engine: '1.5L xăng', transmission: 'AT 4 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 7, segment: 'MPV 7 chỗ', price: { min: 560, max: 658, currency: 'VND', label: '560 – 658 triệu' },
    warranty: '5 năm / 100.000 km', fuelEconomy: '~6,5 L/100km',
    dimensions: { length: 4595, width: 1750, height: 1750, wheelbase: 2775 }, cargo: 322, horsepower: 105, torque: 141,
    safetyFeatures: ['ABS/EBD', 'Cân bằng điện tử', '2 túi khí', 'Camera lùi'],
    techFeatures: ['Màn hình 9"', 'CarPlay/Android Auto', 'Khởi động nút bấm'],
    maintenanceCostPerYear: '4 – 6 triệu', commonIssues: ['Hộp số 4 cấp cũ', 'Cách âm chưa tốt'], reliability: 4,
    image: placeholderImage('Mitsubishi Xpander', colorOf.get('mitsubishi') ?? '#E60012'),
    ratings: ratings({ reliability: 4, cargo: 4, fuelEcon: 4, family: 5, brandRep: 4 }),
  },

  // ===== Hyundai =====
  {
    id: 'hyundai-accent', brand: 'Hyundai', brandSlug: 'hyundai', model: 'Accent', generation: 'HC (2024)',
    year: 2025, trim: '1.5 AT đặc biệt', engine: '1.5L Smartstream', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'Sedan hạng B', price: { min: 439, max: 569, currency: 'VND', label: '439 – 569 triệu' },
    warranty: '5 năm / không giới hạn km', fuelEconomy: '~5,5 L/100km',
    dimensions: { length: 4535, width: 1750, height: 1465, wheelbase: 2670 }, cargo: 480, horsepower: 115, torque: 143.8,
    safetyFeatures: ['6 túi khí', 'Cân bằng điện tử', 'Hỗ trợ khởi hành ngang dốc', 'Camera lùi'],
    techFeatures: ['Màn hình 8"', 'CarPlay/Android Auto', 'Điều hòa tự động'],
    maintenanceCostPerYear: '4 – 6 triệu', commonIssues: ['Giữ giá kém Toyota', 'Sơn mỏng'], reliability: 4,
    image: placeholderImage('Hyundai Accent', colorOf.get('hyundai') ?? '#002C5F'),
    ratings: ratings({ safety: 4, comfort: 4, tech: 4, fuelEcon: 4, resale: 3 }),
  },
  {
    id: 'hyundai-tucson', brand: 'Hyundai', brandSlug: 'hyundai', model: 'Tucson', generation: 'NX4 (2022)',
    year: 2025, trim: '2.0 đặc biệt', engine: '2.0L xăng', transmission: 'AT 6 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'SUV hạng C', price: { min: 769, max: 919, currency: 'VND', label: '769 – 919 triệu' },
    warranty: '5 năm / không giới hạn km', fuelEconomy: '~7,5 L/100km',
    dimensions: { length: 4630, width: 1865, height: 1665, wheelbase: 2755 }, cargo: 620, horsepower: 156, torque: 196,
    safetyFeatures: ['Hyundai SmartSense', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera 360'],
    techFeatures: ['Màn hình 10.25"', 'CarPlay/Android Auto', 'Cửa sổ trời', 'Ghế chỉnh điện'],
    maintenanceCostPerYear: '6 – 9 triệu', commonIssues: ['Tiêu hao bản 2.0', 'Lỗi vặt điện tử'], reliability: 4,
    image: placeholderImage('Hyundai Tucson', colorOf.get('hyundai') ?? '#002C5F'),
    ratings: ratings({ safety: 5, comfort: 4, tech: 5, cargo: 4, family: 4 }),
  },

  // ===== Kia =====
  {
    id: 'kia-seltos', brand: 'Kia', brandSlug: 'kia', model: 'Seltos', generation: 'SP2 (2023)',
    year: 2025, trim: '1.5 Premium', engine: '1.5L Smartstream', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'SUV đô thị B+', price: { min: 599, max: 729, currency: 'VND', label: '599 – 729 triệu' },
    warranty: '5 năm / 150.000 km', fuelEconomy: '~6,5 L/100km',
    dimensions: { length: 4365, width: 1800, height: 1645, wheelbase: 2630 }, cargo: 433, horsepower: 115, torque: 144,
    safetyFeatures: ['6 túi khí', 'Cảnh báo điểm mù', 'Cân bằng điện tử', 'Camera 360'],
    techFeatures: ['Màn hình 10.25"', 'CarPlay/Android Auto', 'Cửa sổ trời', 'Ghế da'],
    maintenanceCostPerYear: '5 – 7 triệu', commonIssues: ['Giữ giá trung bình', 'Treo cứng'], reliability: 4,
    image: placeholderImage('Kia Seltos', colorOf.get('kia') ?? '#05141F'),
    ratings: ratings({ safety: 4, tech: 5, comfort: 4, fuelEcon: 4, family: 4 }),
  },
  {
    id: 'kia-sorento', brand: 'Kia', brandSlug: 'kia', model: 'Sorento', generation: 'MQ4 (2024)',
    year: 2025, trim: '2.2 dầu Signature', engine: '2.2L turbo dầu', transmission: 'DCT 8 cấp', fuelType: 'Dầu',
    driveType: 'AWD', seats: 7, segment: 'SUV hạng D 7 chỗ', price: { min: 999, max: 1359, currency: 'VND', label: '999 – 1,359 tỷ' },
    warranty: '5 năm / 150.000 km', fuelEconomy: '~6,5 L/100km',
    dimensions: { length: 4815, width: 1900, height: 1700, wheelbase: 2815 }, cargo: 821, horsepower: 202, torque: 440,
    safetyFeatures: ['Kia Drive Wise', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình kép 12.3"', 'CarPlay/Android Auto', 'Cửa sổ trời', 'Ghế thông gió'],
    maintenanceCostPerYear: '7 – 10 triệu', commonIssues: ['Hộp số DCT giật nhẹ tốc độ thấp'], reliability: 4,
    image: placeholderImage('Kia Sorento', colorOf.get('kia') ?? '#05141F'),
    ratings: ratings({ safety: 5, comfort: 5, tech: 5, cargo: 5, family: 5 }),
  },

  // ===== Mazda =====
  {
    id: 'mazda-cx5', brand: 'Mazda', brandSlug: 'mazda', model: 'CX-5', generation: 'KF (2023)',
    year: 2025, trim: '2.0 Premium', engine: '2.0L Skyactiv-G', transmission: 'AT 6 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'SUV hạng C', price: { min: 749, max: 979, currency: 'VND', label: '749 – 979 triệu' },
    warranty: '5 năm / 100.000 km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 4575, width: 1845, height: 1680, wheelbase: 2700 }, cargo: 442, horsepower: 154, torque: 200,
    safetyFeatures: ['i-Activsense', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera 360'],
    techFeatures: ['Màn hình 10.25"', 'CarPlay/Android Auto', 'Bose', 'Cửa sổ trời'],
    maintenanceCostPerYear: '6 – 8 triệu', commonIssues: ['Cách âm gầm', 'Treo hơi cứng'], reliability: 4,
    image: placeholderImage('Mazda CX-5', colorOf.get('mazda') ?? '#101010'),
    ratings: ratings({ comfort: 4, tech: 4, performance: 4, safety: 4, brandRep: 4 }),
  },

  // ===== Nissan =====
  {
    id: 'nissan-almera', brand: 'Nissan', brandSlug: 'nissan', model: 'Almera', generation: 'N18 (2024)',
    year: 2025, trim: '1.0 turbo VL', engine: '1.0L turbo', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'Sedan hạng B', price: { min: 489, max: 569, currency: 'VND', label: '489 – 569 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~5,0 L/100km',
    dimensions: { length: 4495, width: 1740, height: 1460, wheelbase: 2620 }, cargo: 482, horsepower: 100, torque: 152,
    safetyFeatures: ['6 túi khí', 'Cân bằng điện tử', 'Cảnh báo điểm mù', 'Camera lùi'],
    techFeatures: ['Màn hình 8"', 'CarPlay/Android Auto', 'Khởi động nút bấm'],
    maintenanceCostPerYear: '4 – 6 triệu', commonIssues: ['Động cơ 3 xy-lanh rung nhẹ', 'Giữ giá kém'], reliability: 4,
    image: placeholderImage('Nissan Almera', colorOf.get('nissan') ?? '#C3002F'),
    ratings: ratings({ fuelEcon: 5, safety: 4, tech: 3, resale: 3 }),
  },

  // ===== Subaru =====
  {
    id: 'subaru-forester', brand: 'Subaru', brandSlug: 'subaru', model: 'Forester', generation: 'SK (2023)',
    year: 2025, trim: '2.0 i-S EyeSight', engine: '2.0L Boxer', transmission: 'CVT', fuelType: 'Xăng',
    driveType: 'AWD', seats: 5, segment: 'SUV hạng C', price: { min: 969, max: 1199, currency: 'VND', label: '969 – 1,199 tỷ' },
    warranty: '5 năm / 150.000 km', fuelEconomy: '~8,0 L/100km',
    dimensions: { length: 4625, width: 1815, height: 1730, wheelbase: 2670 }, cargo: 498, horsepower: 156, torque: 196,
    safetyFeatures: ['EyeSight', 'AWD đối xứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình 8"', 'CarPlay/Android Auto', 'Cửa sổ trời', 'Ghế điện'],
    maintenanceCostPerYear: '7 – 10 triệu', commonIssues: ['Tiêu hao cao', 'Giá phụ tùng cao'], reliability: 4,
    image: placeholderImage('Subaru Forester', colorOf.get('subaru') ?? '#013C74'),
    ratings: ratings({ safety: 5, performance: 4, reliability: 4, fuelEcon: 2, comfort: 4 }),
  },

  // ===== Suzuki =====
  {
    id: 'suzuki-xl7', brand: 'Suzuki', brandSlug: 'suzuki', model: 'XL7', generation: '(2024 hybrid)',
    year: 2025, trim: '1.5 Hybrid', engine: '1.5L Smart Hybrid', transmission: 'AT 4 cấp', fuelType: 'Hybrid',
    driveType: 'FWD', seats: 7, segment: 'MPV 7 chỗ', price: { min: 599, max: 658, currency: 'VND', label: '599 – 658 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~6,0 L/100km',
    dimensions: { length: 4450, width: 1775, height: 1710, wheelbase: 2740 }, cargo: 209, horsepower: 103, torque: 138,
    safetyFeatures: ['ABS/EBD', '2 túi khí', 'Cân bằng điện tử', 'Camera lùi'],
    techFeatures: ['Màn hình 10"', 'CarPlay/Android Auto', 'Khởi động nút bấm'],
    maintenanceCostPerYear: '3 – 5 triệu', commonIssues: ['Khoang sau hẹp', 'Trang bị an toàn cơ bản'], reliability: 4,
    image: placeholderImage('Suzuki XL7', colorOf.get('suzuki') ?? '#E30613'),
    ratings: ratings({ fuelEcon: 4, family: 4, reliability: 4, safety: 3 }),
  },

  // ===== Ford =====
  {
    id: 'ford-ranger-wildtrak', brand: 'Ford', brandSlug: 'ford', model: 'Ranger', generation: 'P703 (2023)',
    year: 2025, trim: 'Wildtrak 2.0 Bi-Turbo', engine: '2.0L Bi-Turbo dầu', transmission: 'AT 10 cấp', fuelType: 'Dầu',
    driveType: '4WD', seats: 5, segment: 'Bán tải', price: { min: 776, max: 974, currency: 'VND', label: '776 – 974 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~8,0 L/100km',
    dimensions: { length: 5370, width: 1918, height: 1884, wheelbase: 3270 }, cargo: 1233, horsepower: 207, torque: 500,
    safetyFeatures: ['Ford Co-Pilot360', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình dọc 12"', 'CarPlay/Android Auto không dây', 'B&O'],
    maintenanceCostPerYear: '7 – 11 triệu', commonIssues: ['To, khó đỗ phố', 'Tiêu hao khi chở nặng'], reliability: 4,
    image: placeholderImage('Ford Ranger', colorOf.get('ford') ?? '#003478'),
    ratings: ratings({ performance: 5, cargo: 5, tech: 4, safety: 4, fuelEcon: 2 }),
  },
  {
    id: 'ford-everest', brand: 'Ford', brandSlug: 'ford', model: 'Everest', generation: 'U704 (2023)',
    year: 2025, trim: 'Titanium 2.0 Bi-Turbo 4WD', engine: '2.0L Bi-Turbo dầu', transmission: 'AT 10 cấp', fuelType: 'Dầu',
    driveType: '4WD', seats: 7, segment: 'SUV 7 chỗ', price: { min: 1099, max: 1545, currency: 'VND', label: '1,099 – 1,545 tỷ' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~8,5 L/100km',
    dimensions: { length: 4914, width: 1923, height: 1842, wheelbase: 2900 }, cargo: 898, horsepower: 207, torque: 500,
    safetyFeatures: ['Ford Co-Pilot360', 'Ga tự động thích ứng', 'Hỗ trợ giữ làn', 'Camera 360'],
    techFeatures: ['Màn hình dọc 12"', 'SYNC 4A', 'Cửa sổ trời', 'Ghế chỉnh điện'],
    maintenanceCostPerYear: '8 – 12 triệu', commonIssues: ['Thân lớn khó đỗ', 'Giá bản cao'], reliability: 4,
    image: placeholderImage('Ford Everest', colorOf.get('ford') ?? '#003478'),
    ratings: ratings({ safety: 5, comfort: 4, performance: 5, cargo: 5, family: 5, fuelEcon: 2 }),
  },

  // ===== Chevrolet =====
  {
    id: 'chevrolet-trailblazer', brand: 'Chevrolet', brandSlug: 'chevrolet', model: 'Trailblazer', generation: '(2021)',
    year: 2024, trim: '2.0 RS', engine: '2.0L', transmission: 'AT 6 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'SUV đô thị', price: { min: 699, max: 799, currency: 'VND', label: '699 – 799 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 4425, width: 1810, height: 1635, wheelbase: 2640 }, cargo: 460, horsepower: 155, torque: 240,
    safetyFeatures: ['ABS/EBD', '6 túi khí', 'Cân bằng điện tử', 'Camera lùi'],
    techFeatures: ['Màn hình 8"', 'CarPlay/Android Auto'],
    maintenanceCostPerYear: '6 – 9 triệu', commonIssues: ['Mạng lưới dịch vụ hạn chế tại VN'], reliability: 3,
    image: placeholderImage('Chevrolet Trailblazer', colorOf.get('chevrolet') ?? '#C9A24B'),
    ratings: ratings({ performance: 4, cargo: 4, safety: 4, resale: 2, brandRep: 3 }),
  },

  // ===== Isuzu =====
  {
    id: 'isuzu-dmax', brand: 'Isuzu', brandSlug: 'isuzu', model: 'D-Max', generation: 'RG (2022)',
    year: 2025, trim: '1.9 4x4 Type Z', engine: '1.9L turbo dầu', transmission: 'AT 6 cấp', fuelType: 'Dầu',
    driveType: '4WD', seats: 5, segment: 'Bán tải', price: { min: 650, max: 880, currency: 'VND', label: '650 – 880 triệu' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 5265, width: 1870, height: 1790, wheelbase: 3125 }, cargo: 1170, horsepower: 150, torque: 350,
    safetyFeatures: ['ADAS (bản cao)', '6 túi khí', 'Cân bằng điện tử', 'Camera lùi'],
    techFeatures: ['Màn hình 9"', 'CarPlay/Android Auto'],
    maintenanceCostPerYear: '6 – 9 triệu', commonIssues: ['Nội thất đơn giản', 'Cách âm tầm trung'], reliability: 5,
    image: placeholderImage('Isuzu D-Max', colorOf.get('isuzu') ?? '#DA241F'),
    ratings: ratings({ reliability: 5, cargo: 5, fuelEcon: 4, performance: 4, tech: 3 }),
  },

  // ===== Mercedes-Benz =====
  {
    id: 'mercedes-c300', brand: 'Mercedes-Benz', brandSlug: 'mercedes-benz', model: 'C-Class', generation: 'W206 (2022)',
    year: 2025, trim: 'C 300 AMG', engine: '2.0L turbo + mild hybrid', transmission: 'AT 9 cấp', fuelType: 'Xăng',
    driveType: 'RWD', seats: 5, segment: 'Sedan hạng sang D', price: { min: 1709, max: 1999, currency: 'VND', label: '1,709 – 1,999 tỷ' },
    warranty: '3 năm / không giới hạn km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 4751, width: 1820, height: 1438, wheelbase: 2865 }, cargo: 455, horsepower: 258, torque: 400,
    safetyFeatures: ['Pre-Safe', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình 11.9"', 'MBUX', 'Burmester', 'Ghế chỉnh điện nhớ vị trí'],
    maintenanceCostPerYear: '15 – 25 triệu', commonIssues: ['Phí bảo dưỡng cao', 'Phụ tùng đắt'], reliability: 3,
    image: placeholderImage('Mercedes C-Class', '#333333'),
    ratings: ratings({ comfort: 5, tech: 5, performance: 5, brandRep: 5, fuelEcon: 3, resale: 4 }),
  },

  // ===== BMW =====
  {
    id: 'bmw-330i', brand: 'BMW', brandSlug: 'bmw', model: '3 Series', generation: 'G20 LCI (2023)',
    year: 2025, trim: '330i M Sport', engine: '2.0L turbo', transmission: 'AT 8 cấp', fuelType: 'Xăng',
    driveType: 'RWD', seats: 5, segment: 'Sedan hạng sang D', price: { min: 1599, max: 1899, currency: 'VND', label: '1,599 – 1,899 tỷ' },
    warranty: '3 năm / không giới hạn km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 4713, width: 1827, height: 1440, wheelbase: 2851 }, cargo: 480, horsepower: 245, torque: 400,
    safetyFeatures: ['Driving Assistant', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn cong 12.3"+14.9"', 'iDrive 8', 'Harman Kardon', 'Cửa sổ trời'],
    maintenanceCostPerYear: '15 – 25 triệu', commonIssues: ['Phí bảo dưỡng cao', 'Lỗi điện tử khi cũ'], reliability: 3,
    image: placeholderImage('BMW 3 Series', colorOf.get('bmw') ?? '#0066B1'),
    ratings: ratings({ performance: 5, comfort: 4, tech: 5, brandRep: 5, fuelEcon: 3, resale: 4 }),
  },

  // ===== Audi =====
  {
    id: 'audi-q5', brand: 'Audi', brandSlug: 'audi', model: 'Q5', generation: 'FY LCI (2021)',
    year: 2024, trim: '45 TFSI quattro', engine: '2.0L turbo', transmission: 'S tronic 7 cấp', fuelType: 'Xăng',
    driveType: 'AWD', seats: 5, segment: 'SUV hạng sang C', price: { min: 2350, max: 2650, currency: 'VND', label: '2,35 – 2,65 tỷ' },
    warranty: '3 năm / không giới hạn km', fuelEconomy: '~8,0 L/100km',
    dimensions: { length: 4682, width: 1893, height: 1659, wheelbase: 2819 }, cargo: 520, horsepower: 249, torque: 370,
    safetyFeatures: ['Audi pre sense', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Virtual Cockpit', 'MMI 10.1"', 'B&O', 'Cửa sổ trời toàn cảnh'],
    maintenanceCostPerYear: '18 – 28 triệu', commonIssues: ['Phí nuôi cao', 'Phụ tùng nhập lâu'], reliability: 3,
    image: placeholderImage('Audi Q5', colorOf.get('audi') ?? '#BB0A30'),
    ratings: ratings({ comfort: 5, tech: 5, performance: 4, brandRep: 5, cargo: 4, fuelEcon: 3 }),
  },

  // ===== Volvo =====
  {
    id: 'volvo-xc60', brand: 'Volvo', brandSlug: 'volvo', model: 'XC60', generation: '(2022 facelift)',
    year: 2025, trim: 'B5 Ultimate', engine: '2.0L mild hybrid', transmission: 'AT 8 cấp', fuelType: 'Hybrid',
    driveType: 'AWD', seats: 5, segment: 'SUV hạng sang C', price: { min: 1899, max: 2199, currency: 'VND', label: '1,899 – 2,199 tỷ' },
    warranty: '3 năm / không giới hạn km', fuelEconomy: '~7,5 L/100km',
    dimensions: { length: 4708, width: 1902, height: 1658, wheelbase: 2865 }, cargo: 483, horsepower: 250, torque: 350,
    safetyFeatures: ['Pilot Assist', 'City Safety', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình 9"', 'Google built-in', 'Bowers & Wilkins', 'Cửa sổ trời'],
    maintenanceCostPerYear: '15 – 24 triệu', commonIssues: ['Giá phụ tùng cao', 'Mạng lưới ít hơn Đức'], reliability: 4,
    image: placeholderImage('Volvo XC60', colorOf.get('volvo') ?? '#003057'),
    ratings: ratings({ safety: 5, comfort: 5, tech: 4, brandRep: 4, family: 4, fuelEcon: 3 }),
  },

  // ===== Lexus =====
  {
    id: 'lexus-rx350', brand: 'Lexus', brandSlug: 'lexus', model: 'RX', generation: 'AL30 (2023)',
    year: 2025, trim: 'RX 350 Luxury', engine: '2.4L turbo', transmission: 'AT 8 cấp', fuelType: 'Xăng',
    driveType: 'AWD', seats: 5, segment: 'SUV hạng sang D', price: { min: 3590, max: 4060, currency: 'VND', label: '3,59 – 4,06 tỷ' },
    warranty: '4 năm / 100.000 km', fuelEconomy: '~8,5 L/100km',
    dimensions: { length: 4890, width: 1920, height: 1700, wheelbase: 2850 }, cargo: 461, horsepower: 275, torque: 430,
    safetyFeatures: ['Lexus Safety System+', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình 14"', 'Mark Levinson', 'Cửa sổ trời toàn cảnh', 'Ghế thông gió'],
    maintenanceCostPerYear: '12 – 20 triệu', commonIssues: ['Giá cao', 'Tùy chọn màu hạn chế'], reliability: 5,
    image: placeholderImage('Lexus RX', '#222222'),
    ratings: ratings({ comfort: 5, reliability: 5, tech: 5, brandRep: 5, resale: 5, fuelEcon: 3 }),
  },

  // ===== MINI =====
  {
    id: 'mini-cooper-s', brand: 'MINI', brandSlug: 'mini', model: 'Cooper', generation: 'F66 (2024)',
    year: 2025, trim: 'Cooper S', engine: '2.0L turbo', transmission: 'AT 7 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 4, segment: 'Hatchback hạng sang', price: { min: 1739, max: 1899, currency: 'VND', label: '1,739 – 1,899 tỷ' },
    warranty: '3 năm / không giới hạn km', fuelEconomy: '~6,5 L/100km',
    dimensions: { length: 3858, width: 1756, height: 1460, wheelbase: 2495 }, cargo: 210, horsepower: 204, torque: 300,
    safetyFeatures: ['Driving Assistant', 'Cảnh báo va chạm', 'Camera lùi'],
    techFeatures: ['Màn hình tròn OLED 9.4"', 'CarPlay/Android Auto', 'Harman Kardon'],
    maintenanceCostPerYear: '12 – 20 triệu', commonIssues: ['Khoang sau & cốp nhỏ', 'Treo cứng'], reliability: 3,
    image: placeholderImage('MINI Cooper', '#1A1A1A'),
    ratings: ratings({ performance: 4, tech: 4, comfort: 3, brandRep: 4, cargo: 1, family: 1 }),
  },

  // ===== Volkswagen =====
  {
    id: 'vw-tiguan', brand: 'Volkswagen', brandSlug: 'volkswagen', model: 'Tiguan', generation: 'Allspace (2022)',
    year: 2024, trim: 'Elegance', engine: '2.0L TSI', transmission: 'DSG 7 cấp', fuelType: 'Xăng',
    driveType: 'AWD', seats: 7, segment: 'SUV hạng C 7 chỗ', price: { min: 1699, max: 1899, currency: 'VND', label: '1,699 – 1,899 tỷ' },
    warranty: '3 năm / 100.000 km', fuelEconomy: '~8,0 L/100km',
    dimensions: { length: 4723, width: 1839, height: 1674, wheelbase: 2790 }, cargo: 700, horsepower: 220, torque: 350,
    safetyFeatures: ['Front Assist', 'Cảnh báo điểm mù', 'Ga tự động thích ứng', 'Camera 360'],
    techFeatures: ['Digital Cockpit', 'Màn hình 8"', 'CarPlay/Android Auto', 'Cửa sổ trời'],
    maintenanceCostPerYear: '12 – 18 triệu', commonIssues: ['Hộp số DSG cần chú ý bảo dưỡng', 'Phụ tùng nhập'], reliability: 3,
    image: placeholderImage('VW Tiguan', colorOf.get('volkswagen') ?? '#001E50'),
    ratings: ratings({ performance: 4, comfort: 4, safety: 4, family: 4, brandRep: 4, fuelEcon: 3 }),
  },

  // ===== Peugeot =====
  {
    id: 'peugeot-3008', brand: 'Peugeot', brandSlug: 'peugeot', model: '3008', generation: 'P84 (2021)',
    year: 2024, trim: '1.6 GT', engine: '1.6L turbo', transmission: 'AT 6 cấp', fuelType: 'Xăng',
    driveType: 'FWD', seats: 5, segment: 'SUV hạng C', price: { min: 969, max: 1199, currency: 'VND', label: '969 – 1,199 tỷ' },
    warranty: '5 năm / 100.000 km', fuelEconomy: '~7,0 L/100km',
    dimensions: { length: 4447, width: 1841, height: 1624, wheelbase: 2675 }, cargo: 520, horsepower: 165, torque: 240,
    safetyFeatures: ['ADAS', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['i-Cockpit 3D', 'Màn hình 10"', 'CarPlay/Android Auto', 'Focal'],
    maintenanceCostPerYear: '9 – 14 triệu', commonIssues: ['Mạng lưới dịch vụ hạn chế', 'Giữ giá thấp'], reliability: 3,
    image: placeholderImage('Peugeot 3008', colorOf.get('peugeot') ?? '#00205B'),
    ratings: ratings({ comfort: 4, tech: 4, safety: 4, resale: 2, brandRep: 3 }),
  },

  // ===== Tesla =====
  {
    id: 'tesla-model3', brand: 'Tesla', brandSlug: 'tesla', model: 'Model 3', generation: 'Highland (2024)',
    year: 2025, trim: 'RWD', engine: 'Mô-tơ điện đơn (sau)', transmission: '1 cấp', fuelType: 'Điện',
    driveType: 'RWD', seats: 5, segment: 'Sedan điện', price: { min: 1390, max: 1590, currency: 'VND', label: '1,39 – 1,59 tỷ' },
    warranty: '4 năm / 80.000 km (pin 8 năm)', fuelEconomy: '~13,2 kWh/100km',
    dimensions: { length: 4720, width: 1849, height: 1441, wheelbase: 2875 }, cargo: 594, horsepower: 283, torque: 420,
    safetyFeatures: ['Autopilot', 'Phanh khẩn cấp tự động', 'Cảnh báo điểm mù', 'Camera bao quanh'],
    techFeatures: ['Màn hình 15.4"', 'OTA update', 'Premium Audio', 'Cửa sổ trời kính'],
    maintenanceCostPerYear: '2 – 4 triệu', commonIssues: ['Hạ tầng sạc còn ít tại VN', 'Bảo hành/dịch vụ hạn chế'], reliability: 4,
    image: placeholderImage('Tesla Model 3', colorOf.get('tesla') ?? '#E82127'),
    ratings: ratings({ tech: 5, performance: 5, fuelEcon: 5, safety: 5, brandRep: 4, comfort: 4 }),
  },

  // ===== BYD =====
  {
    id: 'byd-atto3', brand: 'BYD', brandSlug: 'byd', model: 'Atto 3', generation: '(2024)',
    year: 2025, trim: 'Premium', engine: 'Mô-tơ điện (trước)', transmission: '1 cấp', fuelType: 'Điện',
    driveType: 'FWD', seats: 5, segment: 'SUV điện B+', price: { min: 766, max: 866, currency: 'VND', label: '766 – 866 triệu' },
    warranty: '6 năm / 150.000 km (pin 8 năm)', fuelEconomy: '~15,6 kWh/100km',
    dimensions: { length: 4455, width: 1875, height: 1615, wheelbase: 2720 }, cargo: 440, horsepower: 204, torque: 310,
    safetyFeatures: ['ADAS', 'Phanh khẩn cấp tự động', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình xoay 12.8"', 'CarPlay/Android Auto', 'Pin Blade LFP', 'V2L'],
    maintenanceCostPerYear: '2 – 4 triệu', commonIssues: ['Giữ giá chưa rõ', 'Mạng lưới dịch vụ đang mở rộng'], reliability: 4,
    image: placeholderImage('BYD Atto 3', '#2C3A5A'),
    ratings: ratings({ tech: 4, fuelEcon: 5, safety: 4, comfort: 4, resale: 2, brandRep: 3 }),
  },

  // ===== VinFast =====
  {
    id: 'vinfast-vf8', brand: 'VinFast', brandSlug: 'vinfast', model: 'VF 8', generation: '(2023)',
    year: 2025, trim: 'Plus', engine: 'Mô-tơ điện kép', transmission: '1 cấp', fuelType: 'Điện',
    driveType: 'AWD', seats: 5, segment: 'SUV điện hạng D', price: { min: 1019, max: 1199, currency: 'VND', label: '1,019 – 1,199 tỷ (kèm pin)' },
    warranty: '10 năm / 200.000 km', fuelEconomy: '~19 kWh/100km',
    dimensions: { length: 4750, width: 1934, height: 1667, wheelbase: 2950 }, cargo: 376, horsepower: 402, torque: 620,
    safetyFeatures: ['ADAS cấp 2', 'Ga tự động thích ứng', 'Cảnh báo điểm mù', 'Camera 360'],
    techFeatures: ['Màn hình 15.6"', 'Trợ lý ảo ViVi', 'OTA update', 'Cửa sổ trời'],
    maintenanceCostPerYear: '2 – 4 triệu', commonIssues: ['Phần mềm còn cập nhật', 'Tiêu hao điện cao'], reliability: 3,
    image: placeholderImage('VinFast VF 8', colorOf.get('vinfast') ?? '#00A0DF'),
    ratings: ratings({ tech: 4, performance: 5, safety: 4, family: 4, brandRep: 3, fuelEcon: 4 }),
  },
  {
    id: 'vinfast-vf3', brand: 'VinFast', brandSlug: 'vinfast', model: 'VF 3', generation: '(2024)',
    year: 2025, trim: 'Tiêu chuẩn', engine: 'Mô-tơ điện (sau)', transmission: '1 cấp', fuelType: 'Điện',
    driveType: 'RWD', seats: 4, segment: 'Mini SUV điện', price: { min: 240, max: 322, currency: 'VND', label: '240 – 322 triệu' },
    warranty: '8 năm / 160.000 km', fuelEconomy: '~13 kWh/100km',
    dimensions: { length: 3190, width: 1679, height: 1622, wheelbase: 2075 }, cargo: 285, horsepower: 43, torque: 110,
    safetyFeatures: ['ABS/EBD', '2 túi khí', 'Camera lùi'],
    techFeatures: ['Màn hình 10"', 'Kết nối điện thoại', 'OTA update'],
    maintenanceCostPerYear: '1,5 – 3 triệu', commonIssues: ['Quãng đường ~210km', 'Trang bị cơ bản'], reliability: 3,
    image: placeholderImage('VinFast VF 3', colorOf.get('vinfast') ?? '#00A0DF'),
    ratings: ratings({ fuelEcon: 5, tech: 3, brandRep: 3, family: 2, cargo: 2, performance: 2 }),
  },
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
