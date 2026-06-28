import { getBrand } from './brands.js';
import { realImages } from './real-images.js';
import { reviews } from './reviews.js';

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

/** Tình trạng phân phối tại Việt Nam. */
export type VnStatus = 'on-sale' | 'limited' | 'discontinued' | 'upcoming' | 'global-only';

/** Dữ liệu thị trường Việt Nam (tách riêng, có thể cập nhật độc lập với dữ liệu toàn cầu). */
export interface VietnamMarket {
  /** Có bán tại Việt Nam hay không. */
  available: boolean;
  /** Phân phối chính hãng (true) hay chỉ nhập tư nhân (false). */
  official: boolean;
  /** Lắp ráp trong nước (CKD) / nhập khẩu nguyên chiếc (CBU) / không áp dụng. */
  assembly: 'CKD' | 'CBU' | '—';
  /** Nhà phân phối chính thức. */
  distributor: string;
  /** Năm đầu tiên ra mắt tại VN (null nếu chưa bán). */
  firstYear: number | null;
  status: VnStatus;
  /** Nhãn trạng thái có emoji (hiển thị trong chi tiết). */
  statusLabel: string;
  /** Badge ngắn gắn trên thẻ xe. */
  badge: string;
  /** Giá lăn bánh ước tính. */
  onRoadPrice: string;
  /** Các phiên bản phân phối tại VN. */
  trims: string[];
  /** Bảo hành chính hãng tại VN. */
  warrantyVn: string;
  /** Mạng lưới đại lý chính hãng. */
  dealerNetwork: string;
  /** Thời gian chờ giao xe ước tính. */
  waitTime: string;
  /** Ghi chú thị trường VN (danh sách gạch đầu dòng). */
  notes: string[];
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
  fuelType: FuelType;
  driveType: DriveType;
  seats: number;
  segment: string;
  /** Kiểu thân xe: Sedan, SUV, MPV, Hatchback, Pickup, Coupe... (suy ra từ phân khúc nếu trống). */
  bodyType: string;
  /** Khoảng sáng gầm (mm). */
  groundClearance: number;
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
  /** Dung dịch/dầu nhớt khuyến nghị (suy ra theo nhiên liệu nếu trống). */
  recommendedFluids: string[];
  maintenanceCostPerYear: string;
  /** Ước tính tổng chi phí sở hữu mỗi năm (khấu hao + nhiên liệu + bảo dưỡng + bảo hiểm). */
  ownershipCost: string;
  commonIssues: string[];
  /** Ưu điểm nổi bật (suy ra từ điểm đánh giá nếu trống). */
  pros: string[];
  /** Hạn chế cần cân nhắc (suy ra từ điểm đánh giá nếu trống). */
  cons: string[];
  /** Đối tượng phù hợp (suy ra theo phân khúc/số chỗ/nhiên liệu nếu trống). */
  suitableFor: string[];
  /** Từ khóa tìm kiếm/lọc tự suy ra (nhiên liệu, số chỗ, phân khúc giá, tình trạng VN, xuất xứ...). */
  tags: string[];
  reliability: number;
  image: string;
  ratings: VehicleRatings;
  /** Dữ liệu thị trường Việt Nam (suy ra tự động, có thể cập nhật độc lập). */
  vietnam: VietnamMarket;
  /** Tùy chọn: lịch bảo dưỡng / phụ tùng riêng. Nếu bỏ trống -> dùng mặc định. */
  maintenanceSchedule?: MaintenanceItem[];
  partsCatalog?: PartItem[];

  // ----- Thông số kỹ thuật mở rộng (TÙY CHỌN, chỉ điền khi xác minh được từ nguồn tin cậy) -----
  /** Dung tích xy-lanh (L). */
  engineDisplacement?: number | null;
  /** Mô tả mô-tơ điện (xe hybrid/PHEV). */
  electricMotor?: string | null;
  /** Công suất tổng hệ truyền động (hp) cho hybrid/PHEV. */
  combinedPower?: number | null;
  /** Dung tích bình nhiên liệu (L). */
  fuelTank?: number | null;
  /** EV/PHEV: dung lượng pin (kWh). */
  batteryCapacity?: number | null;
  /** EV: quãng đường mỗi lần sạc theo công bố (km). */
  range?: number | null;
  /** EV: công suất sạc AC tối đa (kW). */
  acCharging?: number | null;
  /** EV: công suất sạc nhanh DC tối đa (kW). */
  dcCharging?: number | null;
  /** EV: thời gian sạc mô tả (vd "10–80% ~31 phút (DC)"). */
  chargingTime?: string | null;
  /** Các chế độ lái. */
  driveModes?: string[];
  /** Tăng tốc 0–100 km/h (giây). */
  zeroTo100?: number | null;
  /** Tốc độ tối đa (km/h). */
  topSpeed?: number | null;
  /** Bán tải: tải trọng (kg). */
  payload?: number | null;
  /** Khả năng kéo (kg). */
  towing?: number | null;
  /** Khóa vi sai. */
  differentialLock?: boolean | null;
  /** Khả năng lội nước (mm). */
  waterWading?: number | null;
  /** MPV: cửa trượt. */
  slidingDoors?: boolean | null;
  /** Hàng ghế thứ 3. */
  thirdRow?: boolean | null;
  /** Phân bổ trọng lượng (vd "50:50"). */
  weightDistribution?: string | null;
  /** Bán kính quay đầu (m). */
  turningRadius?: number | null;
  /** Trọng lượng không tải (kg). */
  curbWeight?: number | null;
}

// --- Lịch bảo dưỡng & phụ tùng mặc định (dùng chung) ---
export const defaultMaintenanceSchedule: MaintenanceItem[] = [
  { km: 5000, items: 'Thay dầu máy, đảo lốp, kiểm tra phanh/lốp', cost: '0,6 – 1,2 triệu' },
  { km: 10000, items: 'Thay dầu + lọc dầu, kiểm tra gầm & treo', cost: '0,8 – 1,5 triệu' },
  {
    km: 20000,
    items: 'Lọc gió động cơ + lọc gió điều hòa, kiểm tra phanh',
    cost: '1,2 – 2,5 triệu',
  },
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
const DEFAULT_ADAS = [
  'Phanh khẩn cấp tự động',
  'Cảnh báo điểm mù',
  'Ga tự động thích ứng',
  'Camera 360',
];

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
    safety: 3,
    reliability: 3,
    comfort: 3,
    performance: 3,
    tech: 3,
    resale: 3,
    cargo: 3,
    fuelEcon: 3,
    brandRep: 3,
    family: 3,
    ...r,
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

// --- Ảnh placeholder dạng gradient theo màu thương hiệu (dùng cho xe chưa có ảnh thật) ---
function ph(slug: string, model: string): string {
  const b = getBrand(slug);
  const color = b?.color ?? '#334155';
  const wm = (b?.wordmark ?? slug).toUpperCase();
  const esc = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='270' viewBox='0 0 480 270'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${color}'/><stop offset='1' stop-color='#0f172a'/>` +
    `</linearGradient></defs><rect width='480' height='270' fill='url(#g)'/>` +
    `<text x='40' y='150' fill='#ffffff' font-family='Arial,Helvetica,sans-serif' font-size='30' font-weight='700' opacity='0.95'>${esc(wm)}</text>` +
    `<text x='40' y='190' fill='#ffffff' font-family='Arial,Helvetica,sans-serif' font-size='22' opacity='0.8'>${esc(model)}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// --- Suy ra các trường mở rộng (kiểu thân xe, gầm, dung dịch, ưu/nhược, đối tượng, chi phí sở hữu) ---
const RATING_PROS: Record<keyof VehicleRatings, string> = {
  safety: 'An toàn tốt',
  reliability: 'Độ bền cao',
  comfort: 'Vận hành êm ái',
  performance: 'Vận hành mạnh mẽ',
  tech: 'Công nghệ hiện đại',
  resale: 'Giữ giá tốt',
  cargo: 'Khoang chứa rộng rãi',
  fuelEcon: 'Tiết kiệm nhiên liệu',
  brandRep: 'Thương hiệu uy tín',
  family: 'Phù hợp gia đình',
};
const RATING_CONS: Record<keyof VehicleRatings, string> = {
  safety: 'Trang bị an toàn cơ bản',
  reliability: 'Độ bền cần lưu ý',
  comfort: 'Tiện nghi vừa phải',
  performance: 'Vận hành khiêm tốn',
  tech: 'Công nghệ hạn chế',
  resale: 'Giữ giá thấp',
  cargo: 'Khoang chứa khiêm tốn',
  fuelEcon: 'Tiêu hao nhiên liệu cao',
  brandRep: 'Thương hiệu chưa phổ biến',
  family: 'Kém phù hợp gia đình',
};

function ratingKeys(r: VehicleRatings): (keyof VehicleRatings)[] {
  return Object.keys(r) as (keyof VehicleRatings)[];
}

function priceTier(pmin: number): 'rẻ' | 'trung' | 'cao' | 'sang' | 'siêu' {
  if (pmin < 500) return 'rẻ';
  if (pmin < 900) return 'trung';
  if (pmin < 1800) return 'cao';
  if (pmin < 4000) return 'sang';
  return 'siêu';
}

function isSporty(o: Mk, body: string): boolean {
  return (
    body === 'Sports Car' || body === 'Coupe' || body === 'Convertible' || o.seats <= 2 || o.hp >= 400
  );
}

function isSmallCar(o: Mk, body: string): boolean {
  const s = o.segment.toLowerCase();
  return (
    body === 'Hatchback' ||
    s.includes('hạng a') ||
    s.includes('hạng b') ||
    s.includes('mini') ||
    s.includes('đô thị')
  );
}

// Ưu điểm bám theo loại nhiên liệu, kiểu thân xe, phân khúc giá & điểm đánh giá thực tế của từng xe
function derivePros(o: Mk, body: string, r: VehicleRatings): string[] {
  const out: string[] = [];
  const tier = priceTier(o.pmin);
  if (o.fuel === 'Điện')
    out.push('Vận hành êm, không độ trễ', 'Chi phí sạc điện thấp', 'Tăng tốc tức thì');
  else if (o.fuel === 'Hybrid') out.push('Tiết kiệm nhiên liệu', 'Vận hành êm ái');
  else if (o.fuel === 'Dầu') out.push('Mô-men xoắn lớn, kéo khỏe', 'Tiết kiệm dầu khi đi đường trường');
  else if (r.fuelEcon >= 4) out.push('Tiết kiệm nhiên liệu');

  if (body === 'Pickup') out.push('Khả năng chở hàng tốt', 'Gầm cao, đi đường xấu tốt', 'Bền bỉ');
  else if (body === 'MPV' || body === 'Van')
    out.push('Không gian rộng rãi', 'Phù hợp gia đình đông người');
  else if (body === 'SUV') out.push('Gầm cao, tầm nhìn thoáng', 'Khả năng đa dụng');
  else if (isSporty(o, body))
    out.push('Hiệu năng mạnh mẽ', 'Thiết kế thể thao', 'Cảm giác lái phấn khích');
  else if (isSmallCar(o, body)) out.push('Nhỏ gọn, linh hoạt trong phố', 'Dễ đỗ xe');
  else if (body === 'Sedan') out.push('Vận hành êm ái', 'Dáng sedan lịch lãm');

  if (o.seats >= 7 && body !== 'MPV' && body !== 'Van') out.push('Chở được 7 người');
  if (tier === 'sang' || tier === 'siêu') out.push('Nội thất sang trọng', 'Trang bị công nghệ cao cấp');

  ratingKeys(r)
    .filter((k) => r[k] >= 4)
    .sort((a, b) => r[b] - r[a])
    .forEach((k) => out.push(RATING_PROS[k]));

  const pad = ['Vận hành ổn định', 'Phù hợp sử dụng hằng ngày', 'Chi phí vận hành hợp lý'];
  const uniq = Array.from(new Set(out));
  for (const p of pad) {
    if (uniq.length >= 3) break;
    if (!uniq.includes(p)) uniq.push(p);
  }
  return uniq.slice(0, 5);
}

// Nhược điểm thực tế, khách quan theo đặc tính từng xe
function deriveCons(o: Mk, body: string, r: VehicleRatings): string[] {
  const out: string[] = [];
  const tier = priceTier(o.pmin);
  if (o.fuel === 'Điện')
    out.push('Phụ thuộc mạng lưới trạm sạc', 'Phần mềm còn tiếp tục hoàn thiện');
  else if (o.fuel === 'Dầu') out.push('Động cơ hơi ồn khi tải nặng');

  if (body === 'Pickup') out.push('Cồng kềnh khi đi trong phố', 'Treo hơi cứng khi không chở hàng');
  else if (isSporty(o, body)) out.push('Khoang nội thất chật', 'Tiêu hao nhiên liệu cao');
  else if (isSmallCar(o, body)) out.push('Cách âm chưa tốt', 'Trang bị giải trí cơ bản');
  else if (body === 'MPV' || body === 'Van') out.push('Không thiên về cảm giác lái thể thao');

  if (tier === 'sang' || tier === 'siêu') out.push('Giá bán cao', 'Chi phí bảo dưỡng & phụ tùng cao');
  else if (tier === 'rẻ') out.push('Vật liệu nội thất cơ bản');

  ratingKeys(r)
    .filter((k) => r[k] <= 2)
    .sort((a, b) => r[a] - r[b])
    .forEach((k) => out.push(RATING_CONS[k]));

  const pad = ['Một số trang bị tùy theo phiên bản', 'Nên lái thử để đánh giá thực tế'];
  const uniq = Array.from(new Set(out));
  for (const p of pad) {
    if (uniq.length >= 2) break;
    if (!uniq.includes(p)) uniq.push(p);
  }
  return uniq.slice(0, 4);
}

function deriveBodyType(segment: string, seats: number): string {
  const s = segment.toLowerCase();
  if (s.includes('bán tải')) return 'Pickup';
  if (s.includes('mpv')) return 'MPV';
  if (s.includes('van')) return 'Van';
  if (s.includes('suv') || s.includes('crossover')) return 'SUV';
  if (s.includes('hatchback')) return 'Hatchback';
  if (s.includes('wagon')) return 'Wagon';
  if (s.includes('coupe')) return 'Coupe';
  if (s.includes('mui trần') || s.includes('convertible')) return 'Convertible';
  if (s.includes('siêu xe') || s.includes('thể thao') || s.includes('sport')) return 'Sports Car';
  if (s.includes('sedan')) return 'Sedan';
  return seats >= 7 ? 'MPV' : 'Sedan';
}

function deriveClearance(body: string): number {
  switch (body) {
    case 'Pickup':
      return 220;
    case 'SUV':
      return 190;
    case 'MPV':
      return 175;
    case 'Van':
      return 170;
    case 'Sports Car':
      return 110;
    default:
      return 150;
  }
}

function deriveFluids(fuel: FuelType): string[] {
  if (fuel === 'Điện') {
    return ['Nước làm mát pin & mô-tơ', 'Dầu hộp giảm tốc', 'Dầu phanh DOT 4', 'Nước rửa kính'];
  }
  const base = [
    'Nước làm mát động cơ (LLC)',
    'Dầu phanh DOT 4',
    'Dầu trợ lực/hộp số',
    'Nước rửa kính',
  ];
  if (fuel === 'Dầu') return ['Dầu động cơ 5W-30 (diesel)', ...base];
  if (fuel === 'Hybrid') return ['Dầu động cơ 0W-20', ...base];
  return ['Dầu động cơ 5W-30', ...base];
}

function deriveSuitable(seats: number, fuel: FuelType, pmin: number, body: string): string[] {
  const out: string[] = [];
  if (seats >= 7) out.push('Gia đình đông thành viên');
  if (body === 'Pickup') out.push('Chở hàng & off-road');
  if (fuel === 'Điện') out.push('Di chuyển đô thị, chi phí thấp');
  else if (fuel === 'Hybrid') out.push('Đi xa, tiết kiệm nhiên liệu');
  if (pmin >= 2500) out.push('Doanh nhân & khách hàng cao cấp');
  else if (pmin < 600) out.push('Người mua xe lần đầu');
  if (body === 'SUV' && seats < 7) out.push('Gia đình trẻ năng động');
  if (body === 'Sports Car') out.push('Người đam mê tốc độ');
  if (out.length === 0) out.push('Sử dụng đa dụng hằng ngày');
  return Array.from(new Set(out)).slice(0, 4);
}

function deriveOwnership(pmin: number, fuel: FuelType): string {
  const energy = fuel === 'Điện' ? 6 : fuel === 'Hybrid' ? 12 : 18;
  const lo = Math.round(pmin * 0.09 + energy);
  const hi = Math.round(pmin * 0.13 + energy + 8);
  return `~${lo} – ${hi} triệu/năm`;
}

/**
 * Suy ra bộ từ khóa (tags) phục vụ tìm kiếm & lọc thông minh — hoàn toàn từ dữ
 * liệu sẵn có (KHÔNG bịa thêm thông số). Gồm: nhiên liệu, dẫn động, số chỗ,
 * phân khúc giá, kiểu thân/công năng, điểm mạnh nổi bật, tình trạng VN, xuất xứ.
 */
function deriveTags(o: Mk, body: string, r: VehicleRatings, vietnam: VietnamMarket): string[] {
  const t: string[] = [body];
  // Nhiên liệu
  if (o.fuel === 'Điện') t.push('Xe điện', 'EV', 'Không phát thải');
  else if (o.fuel === 'Hybrid') t.push('Hybrid', 'Tiết kiệm xăng');
  else if (o.fuel === 'Dầu') t.push('Máy dầu', 'Diesel');
  else t.push('Xe xăng');
  // Dẫn động
  if (o.drive === 'AWD' || o.drive === '4WD') t.push('2 cầu', 'Dẫn động 4 bánh');
  // Số chỗ
  if (o.seats >= 7) t.push('7 chỗ', 'Gia đình đông người');
  else if (o.seats <= 2) t.push('2 chỗ');
  else t.push('5 chỗ');
  // Phân khúc giá (triệu VND)
  if (o.pmin < 500) t.push('Giá rẻ', 'Phổ thông', 'Dưới 500 triệu');
  else if (o.pmin < 800) t.push('Tầm trung', '500–800 triệu');
  else if (o.pmin < 1500) t.push('Khá cao', '800 triệu–1,5 tỷ');
  else if (o.pmin < 3000) t.push('Cao cấp', '1,5–3 tỷ');
  else t.push('Hạng sang', 'Trên 3 tỷ');
  // Kiểu thân & công năng
  if (body === 'SUV') t.push('Gầm cao');
  if (body === 'Pickup') t.push('Bán tải', 'Chở hàng', 'Off-road');
  if (body === 'MPV' || body === 'Van') t.push('Chở khách', 'Chạy dịch vụ');
  if (body === 'Sports Car') t.push('Thể thao', 'Tốc độ');
  // Hiệu năng & điểm mạnh nổi bật
  if (o.hp >= 400) t.push('Mạnh mẽ', 'Hiệu năng cao');
  if (r.fuelEcon >= 4) t.push('Tiết kiệm nhiên liệu');
  if (r.safety >= 4) t.push('An toàn');
  if (r.comfort >= 4) t.push('Thoải mái');
  if (r.resale >= 4) t.push('Giữ giá tốt');
  // Thị trường Việt Nam
  if (vietnam.status === 'on-sale') t.push('Đang bán tại VN', 'Có sẵn');
  else if (vietnam.status === 'upcoming') t.push('Sắp ra mắt');
  else if (vietnam.status === 'discontinued') t.push('Đã ngừng bán');
  else if (vietnam.status === 'global-only') t.push('Xe nhập tư nhân');
  if (vietnam.official) t.push('Chính hãng');
  if (vietnam.assembly === 'CKD') t.push('Lắp ráp trong nước', 'CKD');
  else if (vietnam.assembly === 'CBU') t.push('Nhập khẩu', 'CBU');
  // Xuất xứ
  const brand = getBrand(o.brandSlug);
  if (brand) t.push(`Xe ${brand.country}`);
  return Array.from(new Set(t));
}

// ===== Thị trường Việt Nam =====
interface VnBrandInfo {
  distributor: string;
  assembly: 'CKD' | 'CBU';
  firstYear: number;
  status?: VnStatus;
}

// Các hãng được phân phối CHÍNH HÃNG tại VN (hãng không có trong danh sách -> chưa bán chính hãng).
const vnBrands: Record<string, VnBrandInfo> = {
  toyota: { distributor: 'Toyota Việt Nam (TMV)', assembly: 'CKD', firstYear: 1996 },
  honda: { distributor: 'Honda Việt Nam', assembly: 'CKD', firstYear: 2006 },
  mitsubishi: { distributor: 'Mitsubishi Motors Việt Nam', assembly: 'CBU', firstYear: 1994 },
  hyundai: { distributor: 'TC Motor (Hyundai Thành Công)', assembly: 'CKD', firstYear: 2009 },
  kia: { distributor: 'THACO AUTO', assembly: 'CKD', firstYear: 2007 },
  mazda: { distributor: 'THACO AUTO', assembly: 'CKD', firstYear: 2011 },
  nissan: { distributor: 'Nissan Việt Nam (TanChong)', assembly: 'CBU', firstYear: 2010 },
  subaru: { distributor: 'Motor Image Việt Nam', assembly: 'CBU', firstYear: 2010 },
  suzuki: { distributor: 'Việt Nam Suzuki', assembly: 'CKD', firstYear: 1996 },
  ford: { distributor: 'Ford Việt Nam', assembly: 'CKD', firstYear: 1997 },
  isuzu: { distributor: 'Isuzu Việt Nam', assembly: 'CKD', firstYear: 1997 },
  chevrolet: {
    distributor: 'GM Việt Nam (đã ngừng, VinFast tiếp nhận)',
    assembly: 'CKD',
    firstYear: 2016,
    status: 'discontinued',
  },
  'mercedes-benz': {
    distributor: 'Mercedes-Benz Việt Nam (MBV)',
    assembly: 'CKD',
    firstYear: 1995,
  },
  bmw: { distributor: 'THACO BMW', assembly: 'CBU', firstYear: 2018 },
  audi: { distributor: 'Audi Việt Nam', assembly: 'CBU', firstYear: 2008 },
  volvo: { distributor: 'Volvo Car Việt Nam', assembly: 'CBU', firstYear: 2016 },
  lexus: { distributor: 'Lexus Việt Nam', assembly: 'CBU', firstYear: 2013 },
  mini: { distributor: 'THACO (MINI)', assembly: 'CBU', firstYear: 2018 },
  volkswagen: { distributor: 'Volkswagen Việt Nam', assembly: 'CBU', firstYear: 2008 },
  peugeot: { distributor: 'THACO AUTO', assembly: 'CKD', firstYear: 2013 },
  vinfast: { distributor: 'VinFast', assembly: 'CKD', firstYear: 2019 },
  byd: { distributor: 'BYD Auto Việt Nam', assembly: 'CBU', firstYear: 2024 },
  porsche: { distributor: 'Porsche Việt Nam', assembly: 'CBU', firstYear: 2007 },
  jeep: { distributor: 'Jeep Việt Nam', assembly: 'CBU', firstYear: 2021 },
  'land-rover': {
    distributor: 'Jaguar Land Rover Việt Nam (Phú Thái Mobility)',
    assembly: 'CBU',
    firstYear: 2014,
  },
  'range-rover': {
    distributor: 'Jaguar Land Rover Việt Nam (Phú Thái Mobility)',
    assembly: 'CBU',
    firstYear: 2014,
  },
  jaguar: {
    distributor: 'Jaguar Land Rover Việt Nam (Phú Thái Mobility)',
    assembly: 'CBU',
    firstYear: 2014,
  },
  maserati: { distributor: 'Maserati Việt Nam', assembly: 'CBU', firstYear: 2016 },
  bentley: { distributor: 'Bentley Hà Nội (S&S Automobile)', assembly: 'CBU', firstYear: 2014 },
  'rolls-royce': {
    distributor: 'Rolls-Royce Motor Cars Hà Nội',
    assembly: 'CBU',
    firstYear: 2014,
    status: 'limited',
  },
  ferrari: { distributor: 'Ferrari Việt Nam', assembly: 'CBU', firstYear: 2023 },
  lamborghini: { distributor: 'Lamborghini Việt Nam', assembly: 'CBU', firstYear: 2017 },
  mg: { distributor: 'MG Việt Nam (SAIC)', assembly: 'CBU', firstYear: 2020 },
  haval: { distributor: 'GWM Việt Nam', assembly: 'CBU', firstYear: 2023 },
  tank: { distributor: 'GWM Việt Nam', assembly: 'CBU', firstYear: 2024 },
  chery: { distributor: 'Chery (Omoda & Jaecoo) Việt Nam', assembly: 'CKD', firstYear: 2025 },
  jaecoo: { distributor: 'Omoda & Jaecoo Việt Nam (Geleximco)', assembly: 'CKD', firstYear: 2025 },
  geely: { distributor: 'Geely Việt Nam (Tasco Auto)', assembly: 'CKD', firstYear: 2025 },
  wuling: { distributor: 'TMT Motors (Wuling)', assembly: 'CKD', firstYear: 2023 },
  'lynk-co': { distributor: 'GreenLynk Automotives', assembly: 'CBU', firstYear: 2023 },
  aion: { distributor: 'Harmony GAC Aion Việt Nam', assembly: 'CBU', firstYear: 2024 },
  zeekr: { distributor: 'Zeekr Việt Nam', assembly: 'CBU', firstYear: 2025, status: 'upcoming' },
  skoda: { distributor: 'Skoda Việt Nam (TC Group)', assembly: 'CKD', firstYear: 2024 },
};

const VN_STATUS_LABEL: Record<VnStatus, string> = {
  'on-sale': '🟢 Đang mở bán tại VN',
  limited: '🟡 Số lượng hạn chế',
  discontinued: '🔵 Đã ngừng phân phối',
  upcoming: '⚫ Sắp ra mắt tại VN',
  'global-only': '🔴 Chưa bán chính hãng tại VN',
};
const VN_BADGE: Record<VnStatus, string> = {
  'on-sale': '🟢 Có bán tại VN',
  limited: '🟡 Hạn chế',
  discontinued: '🔵 Đã ngừng',
  upcoming: '⚫ Sắp ra mắt',
  'global-only': '🔴 Chưa bán tại VN',
};

const VN_MASS_BRANDS = new Set([
  'toyota',
  'honda',
  'hyundai',
  'kia',
  'mazda',
  'ford',
  'mitsubishi',
  'vinfast',
  'suzuki',
  'isuzu',
]);

function onRoadLabel(min: number, max: number): string {
  // Lăn bánh ≈ giá niêm yết + ~12% (lệ phí trước bạ, biển số, đăng kiểm, bảo hiểm).
  return priceLabel(Math.round(min * 1.12), Math.round(max * 1.12));
}

function deriveVietnam(o: Mk, r: VehicleRatings, warranty: string): VietnamMarket {
  const vb = vnBrands[o.brandSlug];
  if (!vb) {
    return {
      available: false,
      official: false,
      assembly: '—',
      distributor: 'Chưa có nhà phân phối chính hãng',
      firstYear: null,
      status: 'global-only',
      statusLabel: VN_STATUS_LABEL['global-only'],
      badge: VN_BADGE['global-only'],
      onRoadPrice: '—',
      trims: [o.trim],
      warrantyVn: 'Không có bảo hành chính hãng tại VN',
      dealerNetwork: 'Không có (chỉ nhập khẩu tư nhân)',
      waitTime: 'Tùy đơn nhập khẩu',
      notes: [
        '❌ Chưa được phân phối chính hãng tại Việt Nam.',
        'Chỉ mua được qua đơn vị nhập khẩu tư nhân (xe nhập, giá cao hơn).',
        'Phụ tùng chính hãng khó tìm, thời gian chờ lâu.',
        'Không có bảo hành chính hãng; chi phí bảo dưỡng có thể cao hơn.',
      ],
    };
  }
  const status = vb.status ?? 'on-sale';
  const partsEasy = VN_MASS_BRANDS.has(o.brandSlug) || vb.assembly === 'CKD';
  const luxury = o.pmin >= 3000;
  const dealerNetwork = VN_MASS_BRANDS.has(o.brandSlug)
    ? 'Mạng lưới đại lý rộng khắp toàn quốc'
    : luxury
      ? 'Showroom chính hãng tại Hà Nội & TP.HCM'
      : 'Đại lý chính hãng tại các thành phố lớn';
  const notes: string[] = [
    `✔ Phân phối chính hãng bởi ${vb.distributor}.`,
    vb.assembly === 'CKD' ? '✔ Lắp ráp trong nước (CKD).' : '✔ Nhập khẩu nguyên chiếc (CBU).',
    `✔ Có mặt tại Việt Nam từ năm ${vb.firstYear}.`,
    partsEasy ? '✔ Phụ tùng & dịch vụ chính hãng phổ biến.' : '• Phụ tùng nhập, chi phí cao hơn.',
    r.resale >= 4 ? '✔ Giữ giá tốt tại thị trường VN.' : '• Khả năng giữ giá ở mức trung bình.',
    `✔ Bảo hành chính hãng: ${warranty}.`,
  ];
  if (status === 'discontinued') {
    notes.unshift('🔵 Mẫu xe đã ngừng phân phối chính hãng — chủ yếu mua xe đã qua sử dụng.');
  } else if (status === 'limited') {
    notes.unshift('🟡 Số lượng hạn chế, thường nhận đặt hàng theo yêu cầu.');
  }
  return {
    available: status !== 'discontinued',
    official: true,
    assembly: vb.assembly,
    distributor: vb.distributor,
    firstYear: vb.firstYear,
    status,
    statusLabel: VN_STATUS_LABEL[status],
    badge: VN_BADGE[status],
    onRoadPrice: onRoadLabel(o.pmin, o.pmax),
    trims: [o.trim],
    warrantyVn: warranty,
    dealerNetwork,
    waitTime: status === 'limited' ? 'Đặt hàng 2–6 tháng' : 'Có sẵn / 2–6 tuần',
    notes,
  };
}

// Cập nhật riêng dữ liệu thị trường VN cho từng xe (độc lập với dữ liệu toàn cầu).
const vietnamOverrides: Record<string, Partial<VietnamMarket>> = {
  'toyota-corolla-cross': { firstYear: 2020 },
  'ford-everest': {
    notes: [
      '✔ Phân phối chính hãng bởi Ford Việt Nam.',
      '✔ Một trong những SUV 7 chỗ bán chạy nhất Việt Nam.',
      '✔ Phụ tùng dễ tìm, cộng đồng người dùng lớn.',
      '✔ Giữ giá tốt; phù hợp điều kiện đường sá VN.',
    ],
  },
};

interface Mk {
  id: string;
  brandSlug: string;
  model: string;
  gen: string;
  year?: number;
  trim: string;
  engine: string;
  trans: string;
  fuel: FuelType;
  drive: DriveType;
  seats: number;
  segment: string;
  pmin: number;
  pmax: number;
  warranty?: string;
  econ: string;
  dims: [number, number, number, number];
  cargo: number;
  hp: number;
  torque: number;
  safety?: string[];
  tech?: string[];
  maintYear?: string;
  issues?: string[];
  rel: number;
  image?: string;
  r?: Partial<VehicleRatings>;
  /** Tùy chọn ghi đè các trường mở rộng (mặc định tự suy ra). */
  bodyType?: string;
  clearance?: number;
  fluids?: string[];
  pros?: string[];
  cons?: string[];
  suitableFor?: string[];
  tags?: string[];
  ownership?: string;
  /** Tùy chọn ghi đè dữ liệu thị trường VN. */
  vn?: Partial<VietnamMarket>;
  // ----- Thông số kỹ thuật mở rộng (tùy chọn, chỉ điền khi xác minh được) -----
  engineDisplacement?: number | null;
  electricMotor?: string | null;
  combinedPower?: number | null;
  fuelTank?: number | null;
  batteryCapacity?: number | null;
  range?: number | null;
  acCharging?: number | null;
  dcCharging?: number | null;
  chargingTime?: string | null;
  driveModes?: string[];
  zeroTo100?: number | null;
  topSpeed?: number | null;
  payload?: number | null;
  towing?: number | null;
  differentialLock?: boolean | null;
  waterWading?: number | null;
  slidingDoors?: boolean | null;
  thirdRow?: boolean | null;
  weightDistribution?: string | null;
  turningRadius?: number | null;
  curbWeight?: number | null;
}

function mk(o: Mk): Vehicle {
  const brand = getBrand(o.brandSlug);
  const safety =
    o.safety ?? (o.pmin >= 700 ? [...DEFAULT_SAFETY.slice(0, 2), ...DEFAULT_ADAS] : DEFAULT_SAFETY);
  const r = ratings({ reliability: o.rel, ...o.r });
  const bodyType = o.bodyType ?? deriveBodyType(o.segment, o.seats);
  const warranty = o.warranty ?? warrantyBySlug[o.brandSlug] ?? '3 năm / 100.000 km';
  const vnBase = deriveVietnam(o, r, warranty);
  const vietnam: VietnamMarket = { ...vnBase, ...vietnamOverrides[o.id], ...(o.vn ?? {}) };
  vietnam.statusLabel = VN_STATUS_LABEL[vietnam.status];
  vietnam.badge = VN_BADGE[vietnam.status];
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
    bodyType,
    groundClearance: o.clearance ?? deriveClearance(bodyType),
    price: { min: o.pmin, max: o.pmax, currency: 'VND', label: priceLabel(o.pmin, o.pmax) },
    warranty,
    fuelEconomy: o.econ,
    dimensions: { length: o.dims[0], width: o.dims[1], height: o.dims[2], wheelbase: o.dims[3] },
    cargo: o.cargo,
    horsepower: o.hp,
    torque: o.torque,
    safetyFeatures: safety,
    techFeatures: o.tech ?? DEFAULT_TECH,
    recommendedFluids: o.fluids ?? deriveFluids(o.fuel),
    maintenanceCostPerYear: o.maintYear ?? maintByTier(o.pmin, o.fuel),
    ownershipCost: o.ownership ?? deriveOwnership(o.pmin, o.fuel),
    commonIssues: o.issues ?? [
      'Số liệu tham khảo theo thị trường VN; nên lái thử & kiểm tra thực tế.',
    ],
    pros: o.pros ?? reviews[o.id]?.pros ?? derivePros(o, bodyType, r),
    cons: o.cons ?? reviews[o.id]?.cons ?? deriveCons(o, bodyType, r),
    suitableFor: o.suitableFor ?? deriveSuitable(o.seats, o.fuel, o.pmin, bodyType),
    tags: o.tags ?? deriveTags(o, bodyType, r, vietnam),
    reliability: o.rel,
    image: o.image ?? realImages[o.id] ?? ph(o.brandSlug, o.model),
    ratings: r,
    vietnam,
    engineDisplacement: o.engineDisplacement ?? null,
    electricMotor: o.electricMotor ?? null,
    combinedPower: o.combinedPower ?? null,
    fuelTank: o.fuelTank ?? null,
    batteryCapacity: o.batteryCapacity ?? null,
    range: o.range ?? null,
    acCharging: o.acCharging ?? null,
    dcCharging: o.dcCharging ?? null,
    chargingTime: o.chargingTime ?? null,
    driveModes: o.driveModes,
    zeroTo100: o.zeroTo100 ?? null,
    topSpeed: o.topSpeed ?? null,
    payload: o.payload ?? null,
    towing: o.towing ?? null,
    differentialLock: o.differentialLock ?? null,
    waterWading: o.waterWading ?? null,
    slidingDoors: o.slidingDoors ?? null,
    thirdRow: o.thirdRow ?? null,
    weightDistribution: o.weightDistribution ?? null,
    turningRadius: o.turningRadius ?? null,
    curbWeight: o.curbWeight ?? null,
  };
}

export const vehicles: Vehicle[] = [
  // ===== Toyota =====
  // Nguồn (Toyota Vios VN, thế hệ XP150 facelift 2023):
  //  - Wikipedia "Toyota Vios" (mục Third generation XP150), dẫn lại sgCarMart: dài 4.410–4.425, rộng 1.730, cao 1.475, trục cơ sở 2.550 mm; máy 1.5L 2NR-FE 107 hp/140 Nm. (truy cập 2026-06)
  //  - ASEAN NCAP result #10473 (2023): 5 sao; có AEB, cảnh báo chệch làn (bản G).
  // Đã sửa: trục cơ sở 2620 -> 2550 (2620 là đời AC100 thứ 4, KHÔNG bán tại VN).
  mk({
    id: 'toyota-vios',
    brandSlug: 'toyota',
    model: 'Vios',
    gen: 'XP150 (2023)',
    trim: '1.5G CVT',
    engine: '1.5L xăng 2NR-VE',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 458,
    pmax: 545,
    econ: '~5,5 L/100km',
    dims: [4425, 1730, 1475, 2550],
    cargo: 506,
    hp: 107,
    torque: 140,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg/330px-Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg',
    r: { safety: 3, resale: 5, fuelEcon: 5, brandRep: 5 },
  }),
  mk({
    id: 'toyota-corolla-cross',
    brandSlug: 'toyota',
    model: 'Corolla Cross',
    gen: 'XG10 (2024)',
    trim: '1.8HEV',
    engine: '1.8L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 820,
    pmax: 935,
    econ: '~5,0 L/100km',
    dims: [4460, 1825, 1620, 2640],
    cargo: 440,
    hp: 140,
    torque: 142,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg',
    r: { safety: 5, comfort: 4, tech: 4, fuelEcon: 4, family: 4 },
  }),
  mk({
    id: 'toyota-camry',
    brandSlug: 'toyota',
    model: 'Camry',
    gen: 'XV70 (2022)',
    trim: '2.5HEV',
    engine: '2.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng D',
    pmin: 1105,
    pmax: 1495,
    econ: '~5,5 L/100km',
    dims: [4885, 1840, 1445, 2825],
    cargo: 493,
    hp: 218,
    torque: 221,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg',
    r: { safety: 5, comfort: 5, reliability: 5, resale: 5, brandRep: 5 },
  }),
  mk({
    id: 'toyota-yaris-cross',
    brandSlug: 'toyota',
    model: 'Yaris Cross',
    gen: 'XP210 (2023)',
    trim: '1.5 HEV',
    engine: '1.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 650,
    pmax: 765,
    econ: '~4,0 L/100km',
    dims: [4180, 1765, 1590, 2620],
    cargo: 390,
    hp: 116,
    torque: 141,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg/330px-Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg',
    r: { fuelEcon: 5, safety: 4, tech: 4 },
  }),
  mk({
    id: 'toyota-innova',
    brandSlug: 'toyota',
    model: 'Innova Cross',
    gen: 'Zenix (2024)',
    trim: '2.0 HEV',
    engine: '2.0L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng C',
    pmin: 810,
    pmax: 999,
    econ: '~5,5 L/100km',
    dims: [4755, 1850, 1795, 2850],
    cargo: 300,
    hp: 186,
    torque: 188,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg/330px-Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg',
    r: { family: 5, comfort: 4, fuelEcon: 4, safety: 4 },
  }),
  mk({
    id: 'toyota-fortuner',
    brandSlug: 'toyota',
    model: 'Fortuner',
    gen: 'AN160 (2024)',
    trim: '2.4 4x2 AT dầu',
    engine: '2.4L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: 'RWD',
    seats: 7,
    segment: 'SUV 7 chỗ',
    pmin: 1055,
    pmax: 1470,
    econ: '~8,0 L/100km',
    dims: [4795, 1855, 1835, 2745],
    cargo: 716,
    hp: 150,
    torque: 400,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg',
    r: { safety: 4, resale: 5, cargo: 5, family: 5, fuelEcon: 2 },
  }),
  mk({
    id: 'toyota-hilux',
    brandSlug: 'toyota',
    model: 'Hilux',
    gen: 'AN120 (2024)',
    trim: '2.4 AT 4x4',
    engine: '2.4L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 668,
    pmax: 999,
    econ: '~7,5 L/100km',
    dims: [5325, 1855, 1815, 3085],
    cargo: 1000,
    hp: 150,
    torque: 400,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/330px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg',
    r: { reliability: 5, cargo: 5, performance: 4, fuelEcon: 2 },
  }),

  // ===== Honda =====
  mk({
    id: 'honda-city',
    brandSlug: 'honda',
    model: 'City',
    gen: 'GN (2023)',
    trim: 'RS',
    engine: '1.5L i-VTEC',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 499,
    pmax: 599,
    econ: '~5,4 L/100km',
    dims: [4580, 1748, 1467, 2600],
    cargo: 519,
    hp: 119,
    torque: 145,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg/330px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg',
    r: { safety: 4, performance: 4, fuelEcon: 4, brandRep: 4 },
  }),
  mk({
    id: 'honda-civic',
    brandSlug: 'honda',
    model: 'Civic',
    gen: 'FE (2022)',
    trim: 'RS 1.5T',
    engine: '1.5L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 730,
    pmax: 875,
    econ: '~6,0 L/100km',
    dims: [4678, 1802, 1415, 2735],
    cargo: 419,
    hp: 178,
    torque: 240,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg/330px-Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg',
    r: { performance: 5, tech: 4, safety: 4, brandRep: 4 },
  }),
  mk({
    id: 'honda-hrv',
    brandSlug: 'honda',
    model: 'HR-V',
    gen: 'RV (2022)',
    trim: 'RS e:HEV',
    engine: '1.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 699,
    pmax: 871,
    econ: '~5,5 L/100km',
    dims: [4385, 1790, 1590, 2610],
    cargo: 335,
    hp: 131,
    torque: 253,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2023_Honda_HR-V_Advance_i-MMD_CVT_1.5.jpg/330px-2023_Honda_HR-V_Advance_i-MMD_CVT_1.5.jpg',
    r: { fuelEcon: 4, comfort: 4, safety: 4, tech: 4 },
  }),
  mk({
    id: 'honda-crv',
    brandSlug: 'honda',
    model: 'CR-V',
    gen: 'RS6 (2024)',
    trim: 'e:HEV RS',
    engine: '2.0L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 1109,
    pmax: 1310,
    econ: '~5,5 L/100km',
    dims: [4691, 1866, 1681, 2700],
    cargo: 580,
    hp: 204,
    torque: 335,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg/330px-Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg',
    r: { safety: 5, comfort: 4, performance: 4, tech: 4, family: 4 },
  }),
  mk({
    id: 'honda-accord',
    brandSlug: 'honda',
    model: 'Accord',
    gen: 'CV (2023)',
    trim: '1.5T',
    engine: '1.5L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng D',
    pmin: 1319,
    pmax: 1369,
    econ: '~6,5 L/100km',
    dims: [4906, 1862, 1450, 2830],
    cargo: 570,
    hp: 192,
    torque: 260,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2023_Honda_Accord_LX%2C_front_left%2C_07-13-2023.jpg/330px-2023_Honda_Accord_LX%2C_front_left%2C_07-13-2023.jpg',
    r: { comfort: 5, safety: 5, performance: 4, brandRep: 4 },
  }),

  // ===== Mitsubishi =====
  // Nguồn (Xpander facelift 2022, bản VN giữ AT 4 cấp):
  //  - Wikipedia "Mitsubishi Xpander" (infobox + bảng Powertrain, dẫn lại Mitsubishi Motors & paultan):
  //    máy 1.5L 4A91 MIVEC 77 kW (105 PS) / 141 Nm @4000; dài 4.595, rộng 1.750, cao 1.750 (bản facelift),
  //    trục cơ sở 2.775 mm; khối lượng 1.220–1.275 kg; thị trường VN/Philippines/Malaysia giữ hộp số tự động 4 cấp. (truy cập 2026-06)
  //  - ASEAN NCAP result #4019 (2018): 4 sao, chỉ 2 túi khí trên bản tiền facelift.
  // Đối chiếu: số liệu hiện có (105 hp, 141 Nm, 4595/1750/1750/2775) khớp -> giữ nguyên; bổ sung khối lượng.
  mk({
    id: 'mitsubishi-xpander',
    brandSlug: 'mitsubishi',
    model: 'Xpander',
    gen: '(2022 FL)',
    trim: '1.5 AT Premium',
    engine: '1.5L xăng 4A91 MIVEC',
    trans: 'AT 4 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV 7 chỗ',
    pmin: 560,
    pmax: 658,
    econ: '~6,5 L/100km',
    dims: [4595, 1750, 1750, 2775],
    cargo: 322,
    hp: 105,
    torque: 141,
    curbWeight: 1245,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mitsubishi_Xpander_NC1W_FL2_1.5_GLS_Quartz_White_Pearl_01.jpg/330px-Mitsubishi_Xpander_NC1W_FL2_1.5_GLS_Quartz_White_Pearl_01.jpg',
    r: { cargo: 4, fuelEcon: 4, family: 5, brandRep: 4 },
  }),
  mk({
    id: 'mitsubishi-xforce',
    brandSlug: 'mitsubishi',
    model: 'Xforce',
    gen: '(2024)',
    trim: '1.5 CVT Ultimate',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 620,
    pmax: 705,
    econ: '~6,0 L/100km',
    dims: [4390, 1810, 1660, 2650],
    cargo: 390,
    hp: 105,
    torque: 141,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2024_Mitsubishi_Xforce_Ultimate_%28front%29.jpg/330px-2024_Mitsubishi_Xforce_Ultimate_%28front%29.jpg',
    r: { tech: 4, fuelEcon: 4, family: 4, safety: 4 },
  }),
  mk({
    id: 'mitsubishi-outlander',
    brandSlug: 'mitsubishi',
    model: 'Outlander',
    gen: '(2022)',
    trim: '2.0 CVT Premium',
    engine: '2.0L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 825,
    pmax: 950,
    econ: '~7,2 L/100km',
    dims: [4710, 1862, 1745, 2706],
    cargo: 477,
    hp: 150,
    torque: 195,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/2025_Mitsubishi_Outlander_PHEV_%28fourth_generation%29_IMG_3129.jpg/330px-2025_Mitsubishi_Outlander_PHEV_%28fourth_generation%29_IMG_3129.jpg',
    r: { comfort: 4, safety: 4, family: 4 },
  }),
  mk({
    id: 'mitsubishi-triton',
    brandSlug: 'mitsubishi',
    model: 'Triton',
    gen: '(2024)',
    trim: '2.4 AT 4x4',
    engine: '2.4L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 650,
    pmax: 965,
    econ: '~7,0 L/100km',
    dims: [5360, 1930, 1815, 3130],
    cargo: 1100,
    hp: 184,
    torque: 430,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mitsubishi_Triton_LC_2.4_GLS_2WD_Blade_Silver_Metallic_%28cropped%29.jpg/330px-Mitsubishi_Triton_LC_2.4_GLS_2WD_Blade_Silver_Metallic_%28cropped%29.jpg',
    r: { cargo: 5, performance: 4, reliability: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'mitsubishi-pajero-sport',
    brandSlug: 'mitsubishi',
    model: 'Pajero Sport',
    gen: '(2024)',
    trim: '2.4 AT 4x4',
    engine: '2.4L turbo dầu',
    trans: 'AT 8 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 7,
    segment: 'SUV 7 chỗ',
    pmin: 1080,
    pmax: 1340,
    econ: '~8,0 L/100km',
    dims: [4825, 1815, 1835, 2800],
    cargo: 673,
    hp: 181,
    torque: 430,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Mitsubishi_Pajero_Sport_%283rd_generation%29_1X7A0409.jpg/330px-Mitsubishi_Pajero_Sport_%283rd_generation%29_1X7A0409.jpg',
    r: { safety: 4, cargo: 5, family: 5, performance: 4, fuelEcon: 2 },
  }),

  // ===== Hyundai =====
  mk({
    id: 'hyundai-accent',
    brandSlug: 'hyundai',
    model: 'Accent',
    gen: 'HC (2024)',
    trim: '1.5 AT đặc biệt',
    engine: '1.5L Smartstream',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 439,
    pmax: 569,
    econ: '~5,5 L/100km',
    dims: [4535, 1750, 1465, 2670],
    cargo: 480,
    hp: 115,
    torque: 143.8,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2019_Hyundai_Accent_1.6L%2C_front_10.8.19.jpg/330px-2019_Hyundai_Accent_1.6L%2C_front_10.8.19.jpg',
    r: { safety: 4, comfort: 4, tech: 4, fuelEcon: 4, resale: 3 },
  }),
  mk({
    id: 'hyundai-creta',
    brandSlug: 'hyundai',
    model: 'Creta',
    gen: 'SU2 (2022)',
    trim: '1.5 đặc biệt',
    engine: '1.5L Smartstream',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 599,
    pmax: 740,
    econ: '~6,5 L/100km',
    dims: [4315, 1790, 1635, 2610],
    cargo: 433,
    hp: 115,
    torque: 144,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg/330px-2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg',
    r: { tech: 4, comfort: 4, safety: 4, family: 4 },
  }),
  mk({
    id: 'hyundai-tucson',
    brandSlug: 'hyundai',
    model: 'Tucson',
    gen: 'NX4 (2022)',
    trim: '2.0 đặc biệt',
    engine: '2.0L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 769,
    pmax: 919,
    econ: '~7,5 L/100km',
    dims: [4630, 1865, 1665, 2755],
    cargo: 620,
    hp: 156,
    torque: 196,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg/330px-2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg',
    r: { safety: 5, comfort: 4, tech: 5, cargo: 4, family: 4 },
  }),
  mk({
    id: 'hyundai-santafe',
    brandSlug: 'hyundai',
    model: 'Santa Fe',
    gen: 'MX5 (2024)',
    trim: '2.5T xăng AWD',
    engine: '2.5L turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 1069,
    pmax: 1365,
    econ: '~8,0 L/100km',
    dims: [4830, 1900, 1720, 2815],
    cargo: 628,
    hp: 194,
    torque: 422,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/2024_Hyundai_Santa_Fe_Luxury_AWD_in_Hampton_Grey%2C_front_left%2C_2024-06-30.jpg/330px-2024_Hyundai_Santa_Fe_Luxury_AWD_in_Hampton_Grey%2C_front_left%2C_2024-06-30.jpg',
    r: { safety: 5, comfort: 5, tech: 5, cargo: 5, family: 5 },
  }),
  mk({
    id: 'hyundai-palisade',
    brandSlug: 'hyundai',
    model: 'Palisade',
    gen: 'LX2 (2023)',
    trim: '2.2 dầu cao cấp',
    engine: '2.2L turbo dầu',
    trans: 'AT 8 cấp',
    fuel: 'Dầu',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng E 7 chỗ',
    pmin: 1469,
    pmax: 1589,
    econ: '~7,5 L/100km',
    dims: [4995, 1975, 1750, 2900],
    cargo: 704,
    hp: 200,
    torque: 440,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyundai_Palisade_2.5T_Calligraphy_LX3_Creamy_White_Pearl_%2846%29_%28cropped%29.jpg/330px-Hyundai_Palisade_2.5T_Calligraphy_LX3_Creamy_White_Pearl_%2846%29_%28cropped%29.jpg',
    r: { safety: 5, comfort: 5, cargo: 5, family: 5, fuelEcon: 3 },
  }),

  // ===== Kia =====
  mk({
    id: 'kia-sonet',
    brandSlug: 'kia',
    model: 'Sonet',
    gen: 'AY (2024)',
    trim: '1.5 Premium',
    engine: '1.5L Smartstream',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng A+',
    pmin: 539,
    pmax: 624,
    econ: '~6,0 L/100km',
    dims: [3995, 1790, 1610, 2500],
    cargo: 392,
    hp: 115,
    torque: 144,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/2021_Kia_Sonet_1.5_Premiere_%28Indonesia%29_front_view_02.jpg/330px-2021_Kia_Sonet_1.5_Premiere_%28Indonesia%29_front_view_02.jpg',
    r: { tech: 4, fuelEcon: 4, safety: 4 },
  }),
  mk({
    id: 'kia-seltos',
    brandSlug: 'kia',
    model: 'Seltos',
    gen: 'SP2 (2023)',
    trim: '1.5 Premium',
    engine: '1.5L Smartstream',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 599,
    pmax: 729,
    econ: '~6,5 L/100km',
    dims: [4365, 1800, 1645, 2630],
    cargo: 433,
    hp: 115,
    torque: 144,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg/330px-Kia_Seltos_SP2_PE_Snow_White_Pearl_%2817%29_%28cropped%29.jpg',
    r: { safety: 4, tech: 5, comfort: 4, fuelEcon: 4, family: 4 },
  }),
  mk({
    id: 'kia-sportage',
    brandSlug: 'kia',
    model: 'Sportage',
    gen: 'NQ5 (2022)',
    trim: '2.0 Signature',
    engine: '2.0L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 899,
    pmax: 1099,
    econ: '~7,5 L/100km',
    dims: [4660, 1865, 1665, 2755],
    cargo: 587,
    hp: 156,
    torque: 196,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Kia_Sportage_S_front_only.jpg/330px-2025_Kia_Sportage_S_front_only.jpg',
    r: { safety: 5, comfort: 4, tech: 5, cargo: 4, family: 4 },
  }),
  mk({
    id: 'kia-sorento',
    brandSlug: 'kia',
    model: 'Sorento',
    gen: 'MQ4 (2024)',
    trim: '2.2 dầu Signature',
    engine: '2.2L turbo dầu',
    trans: 'DCT 8 cấp',
    fuel: 'Dầu',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 999,
    pmax: 1359,
    econ: '~6,5 L/100km',
    dims: [4815, 1900, 1700, 2815],
    cargo: 821,
    hp: 202,
    torque: 440,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/2024_Kia_Sorento_X-Line_SX_Prestige_%28facelift%29%2C_front_12.20.24.jpg/330px-2024_Kia_Sorento_X-Line_SX_Prestige_%28facelift%29%2C_front_12.20.24.jpg',
    r: { safety: 5, comfort: 5, tech: 5, cargo: 5, family: 5 },
  }),
  mk({
    id: 'kia-carnival',
    brandSlug: 'kia',
    model: 'Carnival',
    gen: 'KA4 (2022)',
    trim: '2.2 dầu Signature',
    engine: '2.2L turbo dầu',
    trans: 'AT 8 cấp',
    fuel: 'Dầu',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng D',
    pmin: 1199,
    pmax: 1869,
    econ: '~7,0 L/100km',
    dims: [5155, 1995, 1775, 3090],
    cargo: 627,
    hp: 202,
    torque: 440,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2025_Kia_Carnival_Hybrid_EX%2C_front_right%2C_10-12-2025.jpg/330px-2025_Kia_Carnival_Hybrid_EX%2C_front_right%2C_10-12-2025.jpg',
    r: { comfort: 5, cargo: 5, family: 5, safety: 4 },
  }),

  // ===== Mazda =====
  mk({
    id: 'mazda-2',
    brandSlug: 'mazda',
    model: 'Mazda2',
    gen: 'DJ (2023 FL)',
    trim: '1.5 Luxury',
    engine: '1.5L Skyactiv-G',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 408,
    pmax: 545,
    econ: '~5,5 L/100km',
    dims: [4420, 1695, 1470, 2570],
    cargo: 440,
    hp: 110,
    torque: 144,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2021_Mazda2_GT_Sport_NAV_MHEV_1.5_Front.jpg/330px-2021_Mazda2_GT_Sport_NAV_MHEV_1.5_Front.jpg',
    r: { comfort: 4, fuelEcon: 4, safety: 4 },
  }),
  mk({
    id: 'mazda-3',
    brandSlug: 'mazda',
    model: 'Mazda3',
    gen: 'BP (2022 FL)',
    trim: '2.0 Signature Premium',
    engine: '2.0L Skyactiv-G',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 579,
    pmax: 739,
    econ: '~6,5 L/100km',
    dims: [4660, 1795, 1440, 2725],
    cargo: 450,
    hp: 153,
    torque: 200,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mazda3_SKYACTIV-G.jpg/330px-Mazda3_SKYACTIV-G.jpg',
    r: { comfort: 4, tech: 4, performance: 4, safety: 4 },
  }),
  mk({
    id: 'mazda-cx5',
    brandSlug: 'mazda',
    model: 'CX-5',
    gen: 'KF (2023 FL)',
    trim: '2.0 Premium',
    engine: '2.0L Skyactiv-G',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 749,
    pmax: 979,
    econ: '~7,0 L/100km',
    dims: [4575, 1845, 1680, 2700],
    cargo: 442,
    hp: 154,
    torque: 200,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2024_Mazda_CX-5_2.5_S_Select_in_Platinum_Quartz_Metallic%2C_front_right.jpg/330px-2024_Mazda_CX-5_2.5_S_Select_in_Platinum_Quartz_Metallic%2C_front_right.jpg',
    r: { comfort: 4, tech: 4, performance: 4, safety: 4, brandRep: 4 },
  }),
  mk({
    id: 'mazda-cx8',
    brandSlug: 'mazda',
    model: 'CX-8',
    gen: 'KG (2023 FL)',
    trim: '2.5 Premium AWD',
    engine: '2.5L Skyactiv-G',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 1019,
    pmax: 1259,
    econ: '~8,0 L/100km',
    dims: [4900, 1840, 1730, 2930],
    cargo: 209,
    hp: 188,
    torque: 252,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mazda_CX-8_Skyactiv-D_2.2_%E2%80%93_f_21032025.jpg/330px-Mazda_CX-8_Skyactiv-D_2.2_%E2%80%93_f_21032025.jpg',
    r: { comfort: 5, family: 4, safety: 4, cargo: 4 },
  }),

  // ===== Nissan =====
  mk({
    id: 'nissan-almera',
    brandSlug: 'nissan',
    model: 'Almera',
    gen: 'N18 (2024)',
    trim: '1.0 turbo VL',
    engine: '1.0L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 489,
    pmax: 569,
    econ: '~5,0 L/100km',
    dims: [4495, 1740, 1460, 2620],
    cargo: 482,
    hp: 100,
    torque: 152,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/2023_Nissan_Versa_%28N18%29_IMG_3105.jpg/330px-2023_Nissan_Versa_%28N18%29_IMG_3105.jpg',
    r: { fuelEcon: 5, safety: 4, resale: 3 },
  }),
  mk({
    id: 'nissan-kicks',
    brandSlug: 'nissan',
    model: 'Kicks',
    gen: 'P15 (2022)',
    trim: 'e-Power VL',
    engine: '1.2L + e-Power',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 789,
    pmax: 859,
    econ: '~4,5 L/100km',
    dims: [4290, 1760, 1605, 2620],
    cargo: 423,
    hp: 136,
    torque: 280,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/2025_Nissan_Kicks_SV_AWD_in_Deep_Blue_Pearl%2C_front_right%2C_2024-10-06.jpg/330px-2025_Nissan_Kicks_SV_AWD_in_Deep_Blue_Pearl%2C_front_right%2C_2024-10-06.jpg',
    r: { fuelEcon: 5, tech: 4, comfort: 4 },
  }),
  mk({
    id: 'nissan-navara',
    brandSlug: 'nissan',
    model: 'Navara',
    gen: 'D23 (2021 FL)',
    trim: '2.3 AT 4x4 VL',
    engine: '2.3L twin-turbo dầu',
    trans: 'AT 7 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 679,
    pmax: 955,
    econ: '~7,5 L/100km',
    dims: [5260, 1850, 1840, 3150],
    cargo: 1000,
    hp: 190,
    torque: 450,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2018_Nissan_Navara_Tekna_DCi_Automatic_2.3.jpg/330px-2018_Nissan_Navara_Tekna_DCi_Automatic_2.3.jpg',
    r: { cargo: 5, performance: 4, reliability: 4, fuelEcon: 2 },
  }),

  // ===== Subaru =====
  mk({
    id: 'subaru-forester',
    brandSlug: 'subaru',
    model: 'Forester',
    gen: 'SK (2023)',
    trim: '2.0 i-S EyeSight',
    engine: '2.0L Boxer',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 969,
    pmax: 1199,
    econ: '~8,0 L/100km',
    dims: [4625, 1815, 1730, 2670],
    cargo: 498,
    hp: 156,
    torque: 196,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Subaru_Forester_%28SL%29_e-BOXER_DSC_8811.jpg/330px-Subaru_Forester_%28SL%29_e-BOXER_DSC_8811.jpg',
    r: { safety: 5, performance: 4, comfort: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'subaru-crosstrek',
    brandSlug: 'subaru',
    model: 'Crosstrek',
    gen: '(2023)',
    trim: '2.0i-S EyeSight',
    engine: '2.0L Boxer',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 1099,
    pmax: 1199,
    econ: '~7,5 L/100km',
    dims: [4495, 1800, 1615, 2670],
    cargo: 315,
    hp: 156,
    torque: 194,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Subaru_Crosstrek_2.0ie_Active_%28III%29_%E2%80%93_f_31052025.jpg/330px-Subaru_Crosstrek_2.0ie_Active_%28III%29_%E2%80%93_f_31052025.jpg',
    r: { safety: 5, performance: 4, comfort: 4 },
  }),
  mk({
    id: 'subaru-outback',
    brandSlug: 'subaru',
    model: 'Outback',
    gen: '(2023)',
    trim: '2.5i-T EyeSight',
    engine: '2.5L Boxer',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Wagon hạng D',
    pmin: 1399,
    pmax: 1969,
    econ: '~8,5 L/100km',
    dims: [4870, 1875, 1675, 2745],
    cargo: 522,
    hp: 169,
    torque: 252,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2026_Subaru_Outback_Wilderness%2C_front_left%2C_05-24-2026.jpg/330px-2026_Subaru_Outback_Wilderness%2C_front_left%2C_05-24-2026.jpg',
    r: { safety: 5, comfort: 4, cargo: 4, performance: 4, fuelEcon: 2 },
  }),

  // ===== Suzuki =====
  mk({
    id: 'suzuki-swift',
    brandSlug: 'suzuki',
    model: 'Swift',
    gen: '(2024)',
    trim: '1.2 CVT',
    engine: '1.2L Hybrid nhẹ',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng B',
    pmin: 549,
    pmax: 575,
    econ: '~4,6 L/100km',
    dims: [3860, 1735, 1520, 2450],
    cargo: 265,
    hp: 82,
    torque: 112,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg/330px-Suzuki_Swift_%282024%29_hybrid_DSC_6076.jpg',
    r: { fuelEcon: 5, performance: 3, resale: 3 },
  }),
  mk({
    id: 'suzuki-xl7',
    brandSlug: 'suzuki',
    model: 'XL7',
    gen: '(2024 Hybrid)',
    trim: '1.5 AT Hybrid',
    engine: '1.5L Smart Hybrid',
    trans: 'AT 4 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV 7 chỗ',
    pmin: 599,
    pmax: 658,
    econ: '~6,0 L/100km',
    dims: [4450, 1775, 1710, 2740],
    cargo: 209,
    hp: 103,
    torque: 138,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Suzuki_Ertiga_NC_FL_1.5_GLX_Hybrid_Snow_White_Pearl.jpg/330px-Suzuki_Ertiga_NC_FL_1.5_GLX_Hybrid_Snow_White_Pearl.jpg',
    r: { fuelEcon: 4, family: 4, safety: 3 },
  }),
  mk({
    id: 'suzuki-jimny',
    brandSlug: 'suzuki',
    model: 'Jimny',
    gen: '(2024)',
    trim: '1.5 AT 4x4',
    engine: '1.5L xăng',
    trans: 'AT 4 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 4,
    segment: 'SUV hạng A',
    pmin: 789,
    pmax: 799,
    econ: '~6,5 L/100km',
    dims: [3645, 1645, 1720, 2250],
    cargo: 85,
    hp: 102,
    torque: 130,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/2019_Suzuki_Jimny_SZ5_4X4_Automatic_1.5.jpg/330px-2019_Suzuki_Jimny_SZ5_4X4_Automatic_1.5.jpg',
    r: { performance: 4, reliability: 4, cargo: 1, family: 1 },
  }),

  // ===== Ford =====
  mk({
    id: 'ford-ranger',
    brandSlug: 'ford',
    model: 'Ranger',
    gen: 'P703 (2023)',
    trim: 'Wildtrak 2.0 Bi-Turbo',
    engine: '2.0L Bi-Turbo dầu',
    trans: 'AT 10 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 776,
    pmax: 974,
    econ: '~8,0 L/100km',
    dims: [5370, 1918, 1884, 3270],
    cargo: 1233,
    hp: 207,
    torque: 500,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Ford_Ranger_%28T6%2C_P703%29_Wildtrak_IMG_7320.jpg/330px-Ford_Ranger_%28T6%2C_P703%29_Wildtrak_IMG_7320.jpg',
    r: { performance: 5, cargo: 5, tech: 4, safety: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'ford-everest',
    brandSlug: 'ford',
    model: 'Everest',
    gen: 'U704 (2023)',
    trim: 'Titanium 2.0 Bi-Turbo 4WD',
    engine: '2.0L Bi-Turbo dầu',
    trans: 'AT 10 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 7,
    segment: 'SUV 7 chỗ',
    pmin: 1099,
    pmax: 1545,
    econ: '~8,5 L/100km',
    dims: [4914, 1923, 1842, 2900],
    cargo: 898,
    hp: 207,
    torque: 500,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ford_Everest_3.0_V6_Turbo_Diesel_4WD_Platinum_%28III%29_%E2%80%93_f_02012026.jpg/330px-Ford_Everest_3.0_V6_Turbo_Diesel_4WD_Platinum_%28III%29_%E2%80%93_f_02012026.jpg',
    r: { safety: 5, comfort: 4, performance: 5, cargo: 5, family: 5, fuelEcon: 2 },
  }),
  // Ford Focus 1.5 EcoBoost (C346 facelift) — đã ngừng phân phối chính hãng tại VN (~2019).
  // Nguồn:
  //  - Wikipedia "Ford Focus (third generation)" (infobox + mục "1.5-litre EcoBoost"):
  //    mã C346; máy 1.5L EcoBoost I4 177 hp (132 kW) / 240 Nm; hộp số tự động 6 cấp (6F35);
  //    dài 4.358 (hatchback) / 4.534 (sedan), rộng 1.823, cao 1.484, trục cơ sở 2.648 mm;
  //    khối lượng 1.270–1.471 kg; ngừng sản xuất 2019. (177 hp = 132 kW ≈ 180 PS theo cách ghi mã lực VN)
  //  - Latin NCAP 2013 (Focus III): 5 sao người lớn.
  // CHƯA xác minh đủ 2 nguồn (ước lượng): giá niêm yết ~770–799 triệu là giá tham khảo cuối (~2018),
  //   nay chỉ còn xe cũ; dung tích cốp 316 L và mức tiêu thụ ~6,5 L/100km là số ước lượng.
  mk({
    id: 'ford-focus',
    brandSlug: 'ford',
    model: 'Focus',
    gen: 'C346 (2016 FL)',
    year: 2018,
    trim: 'Sport 1.5 EcoBoost',
    engine: '1.5L EcoBoost tăng áp',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng C',
    bodyType: 'Hatchback',
    pmin: 770,
    pmax: 799,
    econ: '~6,5 L/100km',
    dims: [4358, 1823, 1484, 2648],
    cargo: 316,
    hp: 180,
    torque: 240,
    curbWeight: 1330,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/2017_Ford_Focus_Zetec_Edition_1.0_Front.jpg/330px-2017_Ford_Focus_Zetec_Edition_1.0_Front.jpg',
    pros: [
      'Động cơ 1.5 EcoBoost tăng áp bốc, vận hành thể thao.',
      'Khung gầm chắc, cầm lái và vào cua tốt bậc nhất phân khúc.',
      'Trang bị công nghệ khá (SYNC, màn cảm ứng) so với đời xe.',
    ],
    cons: [
      'Đã ngừng bán chính hãng — chỉ còn mua xe cũ, khó giữ giá.',
      'Chi phí phụ tùng EcoBoost cao hơn xe phổ thông; cần thợ quen.',
      'Khoang cốp và không gian hàng ghế sau ở mức vừa phải.',
    ],
    issues: [
      'Lưu ý đời dùng hộp số ly hợp kép PowerShift (DPS6) trước facelift hay bị giật — bản 1.5 EcoBoost facelift dùng số tự động biến mô 6F35 ổn định hơn.',
      'Kiểm tra hệ thống làm mát/đệm máy động cơ EcoBoost khi mua xe cũ.',
    ],
    vn: {
      status: 'discontinued',
      available: false,
      assembly: 'CKD',
      waitTime: 'Chỉ còn xe đã qua sử dụng',
      notes: [
        '🔵 Ford Focus đã ngừng phân phối chính hãng tại VN (khoảng 2019).',
        '✔ Từng lắp ráp trong nước (CKD) bởi Ford Việt Nam.',
        '• Hiện chủ yếu mua lại trên thị trường xe cũ.',
        '• Cần kiểm tra kỹ hộp số & động cơ EcoBoost khi mua xe cũ.',
      ],
    },
    r: { performance: 4, tech: 4, comfort: 3, safety: 4, resale: 2 },
  }),

  // ===== Chevrolet =====
  mk({
    id: 'chevrolet-trailblazer',
    brandSlug: 'chevrolet',
    model: 'Trailblazer',
    gen: '(2021)',
    trim: '2.0 RS',
    engine: '2.0L turbo',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 699,
    pmax: 799,
    year: 2024,
    econ: '~7,0 L/100km',
    dims: [4425, 1810, 1635, 2640],
    cargo: 460,
    hp: 155,
    torque: 240,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2021_Chevrolet_TrailBlazer_RS_AWD%2C_front_7.11.20.jpg/330px-2021_Chevrolet_TrailBlazer_RS_AWD%2C_front_7.11.20.jpg',
    issues: ['Mạng lưới dịch vụ tại VN hạn chế.'],
    r: { performance: 4, cargo: 4, safety: 4, resale: 2, brandRep: 3 },
  }),
  mk({
    id: 'chevrolet-colorado',
    brandSlug: 'chevrolet',
    model: 'Colorado',
    gen: '(2023)',
    trim: '2.7 Z71',
    engine: '2.7L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 789,
    pmax: 899,
    year: 2024,
    econ: '~9,0 L/100km',
    dims: [5410, 1880, 1795, 3270],
    cargo: 1100,
    hp: 310,
    torque: 542,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/2024_Chevrolet_Colorado_Z71%2C_front_left%2C_09-28-2024.jpg/330px-2024_Chevrolet_Colorado_Z71%2C_front_left%2C_09-28-2024.jpg',
    issues: ['Tiêu hao xăng cao', 'Dịch vụ hạn chế tại VN.'],
    r: { performance: 5, cargo: 5, resale: 2, fuelEcon: 1 },
  }),

  // ===== Isuzu =====
  mk({
    id: 'isuzu-dmax',
    brandSlug: 'isuzu',
    model: 'D-Max',
    gen: 'RG (2022)',
    trim: '1.9 4x4 Type Z',
    engine: '1.9L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 650,
    pmax: 880,
    econ: '~7,0 L/100km',
    dims: [5265, 1870, 1790, 3125],
    cargo: 1170,
    hp: 150,
    torque: 350,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Isuzu_D-Max_%28third_generation%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2758.jpg/330px-Isuzu_D-Max_%28third_generation%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2758.jpg',
    r: { reliability: 5, cargo: 5, fuelEcon: 4, performance: 4 },
  }),
  mk({
    id: 'isuzu-mux',
    brandSlug: 'isuzu',
    model: 'mu-X',
    gen: 'RJ (2021)',
    trim: '1.9 4x2 cao cấp',
    engine: '1.9L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: 'RWD',
    seats: 7,
    segment: 'SUV 7 chỗ',
    pmin: 880,
    pmax: 1120,
    econ: '~7,5 L/100km',
    dims: [4850, 1870, 1875, 2855],
    cargo: 311,
    hp: 150,
    torque: 350,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Isuzu_MU-X_LS-M_%28II%2C_Facelift%29_%E2%80%93_f_02012026.jpg/330px-Isuzu_MU-X_LS-M_%28II%2C_Facelift%29_%E2%80%93_f_02012026.jpg',
    r: { reliability: 5, cargo: 4, fuelEcon: 4, family: 4 },
  }),

  // ===== Mercedes-Benz =====
  mk({
    id: 'mercedes-cclass',
    brandSlug: 'mercedes-benz',
    model: 'C-Class',
    gen: 'W206 (2022)',
    trim: 'C 300 AMG',
    engine: '2.0L turbo + mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 1709,
    pmax: 1999,
    econ: '~7,0 L/100km',
    dims: [4751, 1820, 1438, 2865],
    cargo: 455,
    hp: 258,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Mercedes-Benz_W206_IMG_6380.jpg/330px-Mercedes-Benz_W206_IMG_6380.jpg',
    issues: ['Phí bảo dưỡng & phụ tùng cao.'],
    r: { comfort: 5, tech: 5, performance: 5, brandRep: 5, resale: 4 },
  }),
  mk({
    id: 'mercedes-eclass',
    brandSlug: 'mercedes-benz',
    model: 'E-Class',
    gen: 'W214 (2024)',
    trim: 'E 300 AMG',
    engine: '2.0L turbo + mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2839,
    pmax: 3149,
    econ: '~7,5 L/100km',
    dims: [4949, 1880, 1468, 2961],
    cargo: 540,
    hp: 258,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Mercedes-Benz_W214_1X7A1841.jpg/330px-Mercedes-Benz_W214_1X7A1841.jpg',
    issues: ['Phí nuôi cao.'],
    r: { comfort: 5, tech: 5, brandRep: 5, resale: 4 },
  }),
  mk({
    id: 'mercedes-glc',
    brandSlug: 'mercedes-benz',
    model: 'GLC',
    gen: 'X254 (2023)',
    trim: 'GLC 300 4MATIC',
    engine: '2.0L turbo + mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 2399,
    pmax: 2699,
    econ: '~8,0 L/100km',
    dims: [4716, 1890, 1640, 2888],
    cargo: 620,
    hp: 258,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Mercedes-Benz_X254_1X7A6343.jpg/330px-Mercedes-Benz_X254_1X7A6343.jpg',
    issues: ['Phí nuôi cao.'],
    r: { comfort: 5, tech: 5, brandRep: 5, cargo: 4 },
  }),

  // ===== BMW =====
  mk({
    id: 'bmw-3series',
    brandSlug: 'bmw',
    model: '3 Series',
    gen: 'G20 LCI (2023)',
    trim: '330i M Sport',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 1599,
    pmax: 1899,
    econ: '~7,0 L/100km',
    dims: [4713, 1827, 1440, 2851],
    cargo: 480,
    hp: 245,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/BMW_G20_%282022%29_IMG_7316_%282%29.jpg/330px-BMW_G20_%282022%29_IMG_7316_%282%29.jpg',
    issues: ['Phí bảo dưỡng cao.'],
    r: { performance: 5, comfort: 4, tech: 5, brandRep: 5, resale: 4 },
  }),
  mk({
    id: 'bmw-5series',
    brandSlug: 'bmw',
    model: '5 Series',
    gen: 'G60 (2024)',
    trim: '520i M Sport',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2499,
    pmax: 2999,
    econ: '~7,0 L/100km',
    dims: [5060, 1900, 1515, 2995],
    cargo: 520,
    hp: 255,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/BMW_G60_520i_1X7A2443.jpg/330px-BMW_G60_520i_1X7A2443.jpg',
    issues: ['Phí nuôi cao.'],
    r: { performance: 5, comfort: 5, tech: 5, brandRep: 5 },
  }),
  mk({
    id: 'bmw-x3',
    brandSlug: 'bmw',
    model: 'X3',
    gen: 'G45 (2024)',
    trim: 'xDrive20',
    engine: '2.0L turbo mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 1999,
    pmax: 2499,
    econ: '~8,0 L/100km',
    dims: [4755, 1920, 1660, 2865],
    cargo: 570,
    hp: 245,
    torque: 400,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/BMW_G45_20_IMG_3794.jpg/330px-BMW_G45_20_IMG_3794.jpg',
    issues: ['Phí nuôi cao.'],
    r: { performance: 4, comfort: 4, tech: 5, brandRep: 5, cargo: 4 },
  }),

  // ===== Audi =====
  mk({
    id: 'audi-a4',
    brandSlug: 'audi',
    model: 'A4',
    gen: 'B9 (2020 FL)',
    trim: '40 TFSI S line',
    engine: '2.0L turbo',
    trans: 'S tronic 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 1700,
    pmax: 1900,
    year: 2024,
    econ: '~7,0 L/100km',
    dims: [4762, 1847, 1428, 2820],
    cargo: 460,
    hp: 190,
    torque: 320,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Audi_A4_B9_sedans_%28FL%29_1X7A2441.jpg/330px-Audi_A4_B9_sedans_%28FL%29_1X7A2441.jpg',
    issues: ['Phụ tùng nhập, phí cao.'],
    r: { comfort: 4, tech: 5, brandRep: 5, resale: 3 },
  }),
  mk({
    id: 'audi-q5',
    brandSlug: 'audi',
    model: 'Q5',
    gen: 'FY LCI (2021)',
    trim: '45 TFSI quattro',
    engine: '2.0L turbo',
    trans: 'S tronic 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 2350,
    pmax: 2650,
    year: 2024,
    econ: '~8,0 L/100km',
    dims: [4682, 1893, 1659, 2819],
    cargo: 520,
    hp: 249,
    torque: 370,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Audi_Q5_2.0_TDI_quattro_S_line_%28GU%29_%E2%80%93_f_13102025.jpg/330px-Audi_Q5_2.0_TDI_quattro_S_line_%28GU%29_%E2%80%93_f_13102025.jpg',
    issues: ['Phí nuôi cao.'],
    r: { comfort: 5, tech: 5, brandRep: 5, cargo: 4 },
  }),

  // ===== Volvo =====
  mk({
    id: 'volvo-xc40',
    brandSlug: 'volvo',
    model: 'XC40',
    gen: '(2023 FL)',
    trim: 'B4 Plus',
    engine: '2.0L mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang B',
    pmin: 1390,
    pmax: 1750,
    econ: '~7,5 L/100km',
    dims: [4425, 1863, 1652, 2702],
    cargo: 452,
    hp: 197,
    torque: 300,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic%2C_front_left%2C_2025-09-22.jpg/330px-2019_Volvo_XC40_T5_Momentum_in_Bright_Silver_Metallic%2C_front_left%2C_2025-09-22.jpg',
    r: { safety: 5, comfort: 4, tech: 4, brandRep: 4 },
  }),
  mk({
    id: 'volvo-xc60',
    brandSlug: 'volvo',
    model: 'XC60',
    gen: '(2022 FL)',
    trim: 'B5 Ultimate',
    engine: '2.0L mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 1899,
    pmax: 2199,
    econ: '~7,5 L/100km',
    dims: [4708, 1902, 1658, 2865],
    cargo: 483,
    hp: 250,
    torque: 350,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Volvo_XC60_R-Design_D5_P-Pulse_2.0_Front.jpg/330px-2018_Volvo_XC60_R-Design_D5_P-Pulse_2.0_Front.jpg',
    r: { safety: 5, comfort: 5, tech: 4, family: 4 },
  }),

  // ===== Lexus =====
  mk({
    id: 'lexus-es',
    brandSlug: 'lexus',
    model: 'ES',
    gen: 'XZ10 (2022)',
    trim: 'ES 250',
    engine: '2.5L xăng',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2540,
    pmax: 2890,
    econ: '~7,5 L/100km',
    dims: [4975, 1865, 1445, 2870],
    cargo: 454,
    hp: 207,
    torque: 243,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lexus_ES_350_%28GSZ10%29_IMG_4332.jpg/330px-Lexus_ES_350_%28GSZ10%29_IMG_4332.jpg',
    r: { comfort: 5, reliability: 5, brandRep: 5, resale: 5 },
  }),
  mk({
    id: 'lexus-rx',
    brandSlug: 'lexus',
    model: 'RX',
    gen: 'AL30 (2023)',
    trim: 'RX 350 Luxury',
    engine: '2.4L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 3590,
    pmax: 4060,
    econ: '~8,5 L/100km',
    dims: [4890, 1920, 1700, 2850],
    cargo: 461,
    hp: 275,
    torque: 430,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Lexus_RX_500h_F_SPORT%2B_%28V%29_%E2%80%93_f_14072024.jpg/330px-Lexus_RX_500h_F_SPORT%2B_%28V%29_%E2%80%93_f_14072024.jpg',
    r: { comfort: 5, reliability: 5, tech: 5, brandRep: 5, resale: 5 },
  }),
  mk({
    id: 'lexus-nx',
    brandSlug: 'lexus',
    model: 'NX',
    gen: 'AZ20 (2022)',
    trim: 'NX 350h',
    engine: '2.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 2630,
    pmax: 2930,
    econ: '~6,0 L/100km',
    dims: [4660, 1865, 1640, 2690],
    cargo: 520,
    hp: 243,
    torque: 239,
    rel: 5,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2023_Lexus_NX_450h%2C_front_4.5.23.jpg/330px-2023_Lexus_NX_450h%2C_front_4.5.23.jpg',
    r: { comfort: 5, reliability: 5, fuelEcon: 4, brandRep: 5, resale: 5 },
  }),

  // ===== MINI =====
  mk({
    id: 'mini-hatch',
    brandSlug: 'mini',
    model: 'Cooper',
    gen: 'F66 (2024)',
    trim: 'Cooper S',
    engine: '2.0L turbo',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 4,
    segment: 'Hatchback hạng sang',
    pmin: 1739,
    pmax: 1899,
    econ: '~6,5 L/100km',
    dims: [3858, 1756, 1460, 2495],
    cargo: 210,
    hp: 204,
    torque: 300,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mini_Hatch_%28J01%29_Ditzingen_Mobil_IMG_9772_%28cropped%29.jpg/330px-Mini_Hatch_%28J01%29_Ditzingen_Mobil_IMG_9772_%28cropped%29.jpg',
    issues: ['Khoang sau & cốp nhỏ.'],
    r: { performance: 4, tech: 4, brandRep: 4, cargo: 1, family: 1 },
  }),
  mk({
    id: 'mini-countryman',
    brandSlug: 'mini',
    model: 'Countryman',
    gen: 'U25 (2024)',
    trim: 'S ALL4',
    engine: '2.0L turbo',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang B',
    pmin: 1900,
    pmax: 2200,
    econ: '~7,5 L/100km',
    dims: [4444, 1843, 1661, 2692],
    cargo: 460,
    hp: 218,
    torque: 320,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/2018_Mini_Countryman_Cooper_S_2.0_Front.jpg/330px-2018_Mini_Countryman_Cooper_S_2.0_Front.jpg',
    issues: ['Phí nuôi cao.'],
    r: { performance: 4, tech: 4, brandRep: 4, comfort: 4 },
  }),

  // ===== Volkswagen =====
  mk({
    id: 'vw-virtus',
    brandSlug: 'volkswagen',
    model: 'Virtus',
    gen: '(2023)',
    trim: '1.5 TSI',
    engine: '1.5L TSI',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 559,
    pmax: 599,
    year: 2024,
    econ: '~5,8 L/100km',
    dims: [4561, 1752, 1507, 2651],
    cargo: 521,
    hp: 150,
    torque: 250,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_02.png/330px-2022_Volkswagen_Virtus_1.5_GT_%28India%29_front_view_02.png',
    issues: ['Phụ tùng nhập.'],
    r: { performance: 4, safety: 4, brandRep: 4 },
  }),
  mk({
    id: 'vw-tiguan',
    brandSlug: 'volkswagen',
    model: 'Tiguan',
    gen: 'Allspace (2022)',
    trim: 'Elegance',
    engine: '2.0L TSI',
    trans: 'DSG 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng C 7 chỗ',
    pmin: 1699,
    pmax: 1899,
    year: 2024,
    econ: '~8,0 L/100km',
    dims: [4723, 1839, 1674, 2790],
    cargo: 700,
    hp: 220,
    torque: 350,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Volkswagen_Tiguan_III_IMG_8823_%28cropped%29.jpg/330px-Volkswagen_Tiguan_III_IMG_8823_%28cropped%29.jpg',
    issues: ['Hộp số DSG cần chú ý bảo dưỡng.'],
    r: { performance: 4, comfort: 4, safety: 4, family: 4, brandRep: 4 },
  }),
  mk({
    id: 'vw-touareg',
    brandSlug: 'volkswagen',
    model: 'Touareg',
    gen: 'CR (2023 FL)',
    trim: 'Elegance',
    engine: '2.0L TSI',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 3100,
    pmax: 3500,
    year: 2024,
    econ: '~9,0 L/100km',
    dims: [4878, 1984, 1717, 2904],
    cargo: 810,
    hp: 340,
    torque: 450,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Volkswagen_Touareg_%282023%29_IMG_2080.jpg/330px-Volkswagen_Touareg_%282023%29_IMG_2080.jpg',
    issues: ['Phí nuôi cao.'],
    r: { comfort: 5, performance: 4, cargo: 5, brandRep: 4 },
  }),

  // ===== Peugeot =====
  mk({
    id: 'peugeot-2008',
    brandSlug: 'peugeot',
    model: '2008',
    gen: 'P24 (2021)',
    trim: '1.2 GT',
    engine: '1.2L turbo',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 739,
    pmax: 829,
    year: 2024,
    econ: '~6,0 L/100km',
    dims: [4304, 1770, 1550, 2612],
    cargo: 434,
    hp: 130,
    torque: 230,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/2023_Peugeot_2008_in_Vertigo_Blue%2C_front_left%2C_06-08-2025.jpg/330px-2023_Peugeot_2008_in_Vertigo_Blue%2C_front_left%2C_06-08-2025.jpg',
    issues: ['Giữ giá thấp, dịch vụ hạn chế.'],
    r: { tech: 4, comfort: 4, resale: 2, brandRep: 3 },
  }),
  mk({
    id: 'peugeot-3008',
    brandSlug: 'peugeot',
    model: '3008',
    gen: 'P84 (2021)',
    trim: '1.6 GT',
    engine: '1.6L turbo',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 969,
    pmax: 1199,
    year: 2024,
    econ: '~7,0 L/100km',
    dims: [4447, 1841, 1624, 2675],
    cargo: 520,
    hp: 165,
    torque: 240,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg/330px-Peugeot_e-3008_Automesse_Ludwigsburg_2024_IMG_1537.jpg',
    issues: ['Giữ giá thấp, dịch vụ hạn chế.'],
    r: { comfort: 4, tech: 4, safety: 4, resale: 2 },
  }),
  mk({
    id: 'peugeot-5008',
    brandSlug: 'peugeot',
    model: '5008',
    gen: 'P87 (2021)',
    trim: '1.6 GT 7 chỗ',
    engine: '1.6L turbo',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'SUV hạng C 7 chỗ',
    pmin: 1199,
    pmax: 1359,
    year: 2024,
    econ: '~7,2 L/100km',
    dims: [4641, 1844, 1646, 2840],
    cargo: 780,
    hp: 165,
    torque: 240,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Peugeot_5008_C_DSC_2949.jpg/330px-Peugeot_5008_C_DSC_2949.jpg',
    issues: ['Giữ giá thấp, dịch vụ hạn chế.'],
    r: { comfort: 4, cargo: 5, family: 4, resale: 2 },
  }),

  // ===== Tesla =====
  mk({
    id: 'tesla-model3',
    brandSlug: 'tesla',
    model: 'Model 3',
    gen: 'Highland (2024)',
    trim: 'RWD',
    engine: 'Mô-tơ điện đơn (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan điện',
    pmin: 1390,
    pmax: 1590,
    econ: '~13,2 kWh/100km',
    dims: [4720, 1849, 1441, 2875],
    cargo: 594,
    hp: 283,
    torque: 420,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg/330px-Tesla_Model_3_%282023%29_Autofr%C3%BChling_Ulm_IMG_9282.jpg',
    issues: ['Hạ tầng sạc còn ít tại VN.'],
    r: { tech: 5, performance: 5, fuelEcon: 5, safety: 5, brandRep: 4 },
  }),
  mk({
    id: 'tesla-modely',
    brandSlug: 'tesla',
    model: 'Model Y',
    gen: '(2024)',
    trim: 'RWD',
    engine: 'Mô-tơ điện đơn (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'SUV điện',
    pmin: 1490,
    pmax: 1790,
    econ: '~15 kWh/100km',
    dims: [4751, 1921, 1624, 2890],
    cargo: 854,
    hp: 299,
    torque: 420,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Tesla_Model_Y_Premium_%28Facelift%29_%E2%80%93_f_05052026.jpg/330px-Tesla_Model_Y_Premium_%28Facelift%29_%E2%80%93_f_05052026.jpg',
    issues: ['Hạ tầng sạc còn ít tại VN.'],
    r: { tech: 5, performance: 4, fuelEcon: 5, safety: 5, cargo: 5, family: 4 },
  }),

  // ===== BYD =====
  mk({
    id: 'byd-atto3',
    brandSlug: 'byd',
    model: 'Atto 3',
    gen: '(2024)',
    trim: 'Premium',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng B',
    pmin: 766,
    pmax: 866,
    econ: '~15,6 kWh/100km',
    dims: [4455, 1875, 1615, 2720],
    cargo: 440,
    hp: 204,
    torque: 310,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/BYD_Atto_3_1X7A6491.jpg/330px-BYD_Atto_3_1X7A6491.jpg',
    issues: ['Giữ giá chưa rõ; dịch vụ đang mở rộng.'],
    r: { tech: 4, fuelEcon: 5, safety: 4, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'byd-dolphin',
    brandSlug: 'byd',
    model: 'Dolphin',
    gen: '(2024)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback điện B',
    pmin: 569,
    pmax: 659,
    econ: '~13 kWh/100km',
    dims: [4290, 1770, 1570, 2700],
    cargo: 345,
    hp: 95,
    torque: 180,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2021_BYD_Dolphin_EV_%28front%29.jpg/330px-2021_BYD_Dolphin_EV_%28front%29.jpg',
    issues: ['Giữ giá chưa rõ.'],
    r: { fuelEcon: 5, tech: 4, resale: 2 },
  }),
  mk({
    id: 'byd-seal',
    brandSlug: 'byd',
    model: 'Seal',
    gen: '(2024)',
    trim: 'Premium',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan điện D',
    pmin: 1119,
    pmax: 1359,
    econ: '~15 kWh/100km',
    dims: [4800, 1875, 1460, 2920],
    cargo: 400,
    hp: 313,
    torque: 360,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/2022_BYD_Seal.jpg/330px-2022_BYD_Seal.jpg',
    issues: ['Giữ giá chưa rõ.'],
    r: { performance: 5, tech: 4, fuelEcon: 5, safety: 4, resale: 2 },
  }),

  // ===== VinFast =====
  mk({
    id: 'vinfast-vf3',
    brandSlug: 'vinfast',
    model: 'VF 3',
    gen: '(2024)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 4,
    segment: 'Mini SUV điện',
    pmin: 240,
    pmax: 322,
    warranty: '8 năm / 160.000 km',
    econ: '~13 kWh/100km',
    dims: [3190, 1679, 1622, 2075],
    cargo: 285,
    hp: 43,
    torque: 110,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/2025_VinFast_VF_3%2C_front_left.jpg/330px-2025_VinFast_VF_3%2C_front_left.jpg',
    issues: ['Quãng đường ~210km, trang bị cơ bản.'],
    r: { fuelEcon: 5, tech: 3, brandRep: 3, cargo: 2, family: 2, performance: 2 },
  }),
  mk({
    id: 'vinfast-vf5',
    brandSlug: 'vinfast',
    model: 'VF 5',
    gen: '(2023)',
    trim: 'Plus',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng A',
    pmin: 529,
    pmax: 590,
    econ: '~14 kWh/100km',
    dims: [3967, 1723, 1579, 2514],
    cargo: 330,
    hp: 134,
    torque: 135,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/2025_VinFast_VF_5_in_Vinfast_Blue%2C_front_left.jpg/330px-2025_VinFast_VF_5_in_Vinfast_Blue%2C_front_left.jpg',
    issues: ['Phần mềm còn cập nhật.'],
    r: { fuelEcon: 5, tech: 4, brandRep: 3 },
  }),
  mk({
    id: 'vinfast-vf6',
    brandSlug: 'vinfast',
    model: 'VF 6',
    gen: '(2024)',
    trim: 'Plus',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng B',
    pmin: 689,
    pmax: 769,
    econ: '~15 kWh/100km',
    dims: [4238, 1820, 1594, 2730],
    cargo: 423,
    hp: 174,
    torque: 250,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/VinFast_VF_6_DSC_8468.jpg/330px-VinFast_VF_6_DSC_8468.jpg',
    issues: ['Phần mềm còn cập nhật.'],
    r: { fuelEcon: 4, tech: 4, safety: 4, family: 4, brandRep: 3 },
  }),
  mk({
    id: 'vinfast-vf7-eco',
    brandSlug: 'vinfast',
    model: 'VF 7',
    gen: '(2024)',
    trim: 'Eco',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 799,
    pmax: 849,
    warranty: '10 năm / 200.000 km',
    econ: '~15.5 kWh/100km',
    dims: [4545, 1890, 1635, 2840],
    cargo: 537,
    hp: 174,
    torque: 250,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/VinFast_VF_7_Eco_Crimson_Red.jpg/960px-VinFast_VF_7_Eco_Crimson_Red.jpg',
    issues: ['Phần mềm OTA tiếp tục được cải thiện.'],
    r: { fuelEcon: 5, tech: 5, safety: 5, family: 5, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-vf7-plus',
    brandSlug: 'vinfast',
    model: 'VF 7',
    gen: '(2024)',
    trim: 'Plus',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 949,
    pmax: 999,
    warranty: '10 năm / 200.000 km',
    econ: '~16.5 kWh/100km',
    dims: [4545, 1890, 1635, 2840],
    cargo: 537,
    hp: 349,
    torque: 500,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/VinFast_VF7%2C_front_NYIAS_2022.jpg/960px-VinFast_VF7%2C_front_NYIAS_2022.jpg',
    issues: ['Phần mềm OTA tiếp tục được cải thiện.'],
    r: { fuelEcon: 5, tech: 5, performance: 5, safety: 5, family: 5, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-ec-van',
    brandSlug: 'vinfast',
    model: 'EC Van',
    gen: '(2025)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 2,
    segment: 'Xe van điện',
    pmin: 285,
    pmax: 315,
    warranty: '10 năm / 200.000 km',
    econ: '~12 kWh/100km',
    dims: [3767, 1680, 1790, 2520],
    cargo: 2600,
    hp: 54,
    torque: 110,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Newone_-_VinFast_EC_Van_Xanh_SM_GSM_005.jpg/960px-Newone_-_VinFast_EC_Van_Xanh_SM_GSM_005.jpg',
    issues: ['Phù hợp vận chuyển đô thị, tải trọng giới hạn.'],
    r: { fuelEcon: 5, cargo: 5, tech: 3, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-minio-green',
    brandSlug: 'vinfast',
    model: 'Minio Green',
    gen: '(2025)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 4,
    segment: 'Mini EV',
    pmin: 269,
    pmax: 299,
    warranty: '10 năm / 200.000 km',
    econ: '~10 kWh/100km',
    dims: [3090, 1496, 1625, 2065],
    cargo: 230,
    hp: 27,
    torque: 65,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Newone-GreenSM_VinFast_Minio_Green_01.jpg/960px-Newone-GreenSM_VinFast_Minio_Green_01.jpg',
    issues: ['Phạm vi hoạt động phù hợp chủ yếu trong đô thị.'],
    r: { fuelEcon: 5, tech: 3, cargo: 2, family: 2, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-herio-green',
    brandSlug: 'vinfast',
    model: 'Herio Green',
    gen: '(2025)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng A',
    pmin: 499,
    pmax: 530,
    warranty: '10 năm / 200.000 km',
    econ: '~11.5 kWh/100km',
    dims: [3967, 1723, 1579, 2514],
    cargo: 330,
    hp: 134,
    torque: 135,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/VinFast_Herio_Green_GreenGSM_taxi_01.jpg/960px-VinFast_Herio_Green_GreenGSM_taxi_01.jpg',
    issues: ['Trang bị được tối ưu cho xe dịch vụ.'],
    r: { fuelEcon: 5, tech: 3, family: 3, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-nerio-green',
    brandSlug: 'vinfast',
    model: 'Nerio Green',
    gen: '(2025)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 668,
    pmax: 699,
    warranty: '10 năm / 200.000 km',
    econ: '~13.2 kWh/100km',
    dims: [4300, 1768, 1615, 2611],
    cargo: 420,
    hp: 150,
    torque: 242,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/VinFast_Nerio_Green_GreenGSM_taxi.jpg/960px-VinFast_Nerio_Green_GreenGSM_taxi.jpg',
    issues: ['Trang bị tối ưu cho xe dịch vụ.'],
    r: { fuelEcon: 5, tech: 4, safety: 4, family: 4, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-limo-green',
    brandSlug: 'vinfast',
    model: 'Limo Green',
    gen: '(2025)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV điện 7 chỗ',
    pmin: 749,
    pmax: 790,
    warranty: '10 năm / 200.000 km',
    econ: '~15 kWh/100km',
    dims: [4740, 1872, 1728, 2840],
    cargo: 500,
    hp: 201,
    torque: 280,
    rel: 4,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/VinFast_Limo_Green_silver.jpg/960px-VinFast_Limo_Green_silver.jpg',
    issues: ['Thiết kế hướng đến xe dịch vụ và gia đình.'],
    r: { fuelEcon: 5, comfort: 4, cargo: 5, family: 5, tech: 4, brandRep: 4 },
  }),

  mk({
    id: 'vinfast-vf8',
    brandSlug: 'vinfast',
    model: 'VF 8',
    gen: '(2023)',
    trim: 'Plus',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng D',
    pmin: 1019,
    pmax: 1199,
    econ: '~19 kWh/100km',
    dims: [4750, 1934, 1667, 2950],
    cargo: 376,
    hp: 402,
    torque: 620,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/VinFast_VF_8_DSC_8568.jpg/330px-VinFast_VF_8_DSC_8568.jpg',
    issues: ['Tiêu hao điện cao; phần mềm còn cập nhật.'],
    r: { tech: 4, performance: 5, safety: 4, family: 4, brandRep: 3 },
  }),
  mk({
    id: 'vinfast-vf9',
    brandSlug: 'vinfast',
    model: 'VF 9',
    gen: '(2023)',
    trim: 'Plus',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV điện hạng E 7 chỗ',
    pmin: 1499,
    pmax: 1899,
    econ: '~20 kWh/100km',
    dims: [5120, 2000, 1721, 3150],
    cargo: 423,
    hp: 402,
    torque: 620,
    rel: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/VinFast_VF9%2C_front_NYIAS_2022.jpg/330px-VinFast_VF9%2C_front_NYIAS_2022.jpg',
    issues: ['Tiêu hao điện cao; phần mềm còn cập nhật.'],
    r: { tech: 4, performance: 5, comfort: 4, cargo: 5, family: 5, brandRep: 3 },
  }),

  // ===== Phase 1: bổ sung mẫu đang bán tại VN (cùng hãng) =====
  // --- Toyota ---
  mk({
    id: 'toyota-wigo',
    brandSlug: 'toyota',
    model: 'Wigo',
    gen: '(2023)',
    trim: '1.2 CVT',
    engine: '1.2L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng A',
    pmin: 360,
    pmax: 405,
    econ: '~5,0 L/100km',
    dims: [3760, 1665, 1515, 2460],
    cargo: 304,
    hp: 88,
    torque: 113,
    rel: 4,
    r: { fuelEcon: 5, resale: 4, cargo: 2 },
  }),
  mk({
    id: 'toyota-raize',
    brandSlug: 'toyota',
    model: 'Raize',
    gen: '(2023)',
    trim: '1.0 Turbo CVT',
    engine: '1.0L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng A+',
    pmin: 510,
    pmax: 545,
    econ: '~5,5 L/100km',
    dims: [4030, 1710, 1635, 2525],
    cargo: 369,
    hp: 98,
    torque: 140,
    rel: 4,
    r: { fuelEcon: 4, tech: 4, resale: 4 },
  }),
  mk({
    id: 'toyota-corolla-altis',
    brandSlug: 'toyota',
    model: 'Corolla Altis',
    gen: 'E210 (2022)',
    trim: '1.8 HEV',
    engine: '1.8L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 765,
    pmax: 950,
    econ: '~4,5 L/100km',
    dims: [4630, 1780, 1435, 2700],
    cargo: 470,
    hp: 122,
    torque: 142,
    rel: 5,
    r: { comfort: 4, fuelEcon: 5, safety: 4, resale: 4 },
  }),
  mk({
    id: 'toyota-veloz-cross',
    brandSlug: 'toyota',
    model: 'Veloz Cross',
    gen: '(2022)',
    trim: '1.5 CVT',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng B',
    pmin: 638,
    pmax: 698,
    econ: '~6,0 L/100km',
    dims: [4475, 1750, 1700, 2750],
    cargo: 121,
    hp: 106,
    torque: 137,
    rel: 4,
    r: { family: 4, fuelEcon: 4, resale: 4 },
  }),
  mk({
    id: 'toyota-avanza',
    brandSlug: 'toyota',
    model: 'Avanza Premio',
    gen: '(2022)',
    trim: '1.5 CVT',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng B',
    pmin: 558,
    pmax: 598,
    econ: '~6,5 L/100km',
    dims: [4395, 1730, 1665, 2750],
    cargo: 100,
    hp: 106,
    torque: 137,
    rel: 4,
    r: { family: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'toyota-prado',
    brandSlug: 'toyota',
    model: 'Land Cruiser Prado',
    gen: 'J250 (2024)',
    trim: '2.7 VX',
    engine: '2.7L xăng',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 2950,
    pmax: 3200,
    econ: '~9,5 L/100km',
    dims: [4990, 1980, 1925, 2850],
    cargo: 550,
    hp: 163,
    torque: 246,
    rel: 5,
    r: { reliability: 5, comfort: 4, cargo: 4, family: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'toyota-land-cruiser',
    brandSlug: 'toyota',
    model: 'Land Cruiser 300',
    gen: 'J300 (2021)',
    trim: '3.5 V6 VX',
    engine: '3.5L V6 twin-turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng E 7 chỗ',
    pmin: 4030,
    pmax: 4540,
    econ: '~11 L/100km',
    dims: [4985, 1980, 1925, 2850],
    cargo: 700,
    hp: 415,
    torque: 650,
    rel: 5,
    r: { reliability: 5, performance: 4, comfort: 5, cargo: 4, brandRep: 5, fuelEcon: 1 },
  }),
  mk({
    id: 'toyota-alphard',
    brandSlug: 'toyota',
    model: 'Alphard',
    gen: 'AH40 (2023)',
    trim: '2.5 HEV',
    engine: '2.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng sang',
    pmin: 4370,
    pmax: 4480,
    econ: '~6,5 L/100km',
    dims: [5005, 1850, 1945, 3000],
    cargo: 470,
    hp: 250,
    torque: 239,
    rel: 5,
    r: { comfort: 5, brandRep: 5, family: 5, tech: 4, fuelEcon: 3 },
  }),

  // --- Honda ---
  mk({
    id: 'honda-wrv',
    brandSlug: 'honda',
    model: 'WR-V',
    gen: '(2023)',
    trim: '1.5 RS',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 699,
    pmax: 869,
    econ: '~6,0 L/100km',
    dims: [4060, 1780, 1608, 2485],
    cargo: 380,
    hp: 121,
    torque: 145,
    rel: 4,
    r: { fuelEcon: 4, tech: 4, safety: 4 },
  }),
  mk({
    id: 'honda-brv',
    brandSlug: 'honda',
    model: 'BR-V',
    gen: '(2022)',
    trim: '1.5 L',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng B',
    pmin: 661,
    pmax: 730,
    econ: '~6,2 L/100km',
    dims: [4490, 1780, 1685, 2700],
    cargo: 223,
    hp: 121,
    torque: 145,
    rel: 4,
    r: { family: 4, safety: 4, fuelEcon: 4 },
  }),

  // --- Hyundai ---
  mk({
    id: 'hyundai-grand-i10',
    brandSlug: 'hyundai',
    model: 'Grand i10',
    gen: 'AI3 (2021)',
    trim: '1.2 AT',
    engine: '1.2L xăng',
    trans: 'AT 4 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng A',
    pmin: 360,
    pmax: 455,
    econ: '~5,5 L/100km',
    dims: [3845, 1680, 1520, 2425],
    cargo: 260,
    hp: 86,
    torque: 118,
    rel: 4,
    r: { fuelEcon: 4, resale: 3, cargo: 2 },
  }),
  mk({
    id: 'hyundai-venue',
    brandSlug: 'hyundai',
    model: 'Venue',
    gen: '(2024)',
    trim: '1.0 Turbo',
    engine: '1.0L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng A+',
    pmin: 539,
    pmax: 619,
    econ: '~6,0 L/100km',
    dims: [3995, 1770, 1605, 2520],
    cargo: 350,
    hp: 120,
    torque: 172,
    rel: 4,
    r: { fuelEcon: 4, tech: 4 },
  }),
  mk({
    id: 'hyundai-elantra',
    brandSlug: 'hyundai',
    model: 'Elantra',
    gen: 'CN7 (2023 FL)',
    trim: '1.6 AT',
    engine: '1.6L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 599,
    pmax: 769,
    econ: '~6,0 L/100km',
    dims: [4710, 1825, 1420, 2720],
    cargo: 474,
    hp: 123,
    torque: 154,
    rel: 4,
    r: { comfort: 4, tech: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'hyundai-stargazer',
    brandSlug: 'hyundai',
    model: 'Stargazer',
    gen: '(2023)',
    trim: '1.5 IVT',
    engine: '1.5L xăng',
    trans: 'IVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng B',
    pmin: 575,
    pmax: 685,
    econ: '~6,0 L/100km',
    dims: [4460, 1780, 1695, 2780],
    cargo: 200,
    hp: 115,
    torque: 144,
    rel: 4,
    r: { family: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'hyundai-custin',
    brandSlug: 'hyundai',
    model: 'Custin',
    gen: '(2023)',
    trim: '1.5T / 2.0T',
    engine: '1.5L turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng C',
    pmin: 850,
    pmax: 999,
    econ: '~7,0 L/100km',
    dims: [4950, 1850, 1734, 3055],
    cargo: 273,
    hp: 170,
    torque: 253,
    rel: 4,
    r: { comfort: 4, family: 4, tech: 4 },
  }),
  mk({
    id: 'hyundai-ioniq5',
    brandSlug: 'hyundai',
    model: 'Ioniq 5',
    gen: 'NE (2022)',
    trim: 'Exclusive',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 1300,
    pmax: 1450,
    econ: '~16,7 kWh/100km',
    dims: [4635, 1890, 1605, 3000],
    cargo: 527,
    hp: 217,
    torque: 350,
    rel: 4,
    r: { tech: 5, fuelEcon: 5, comfort: 4, safety: 4 },
  }),

  // --- Kia ---
  mk({
    id: 'kia-morning',
    brandSlug: 'kia',
    model: 'Morning',
    gen: 'JA (2021)',
    trim: '1.25 AT',
    engine: '1.25L xăng',
    trans: 'AT 4 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng A',
    pmin: 389,
    pmax: 439,
    econ: '~5,5 L/100km',
    dims: [3595, 1595, 1485, 2400],
    cargo: 255,
    hp: 84,
    torque: 121,
    rel: 4,
    r: { fuelEcon: 4, resale: 3, cargo: 2 },
  }),
  mk({
    id: 'kia-k3',
    brandSlug: 'kia',
    model: 'K3',
    gen: 'BD (2022)',
    trim: '1.6 Premium',
    engine: '1.6L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 559,
    pmax: 689,
    econ: '~6,0 L/100km',
    dims: [4640, 1800, 1440, 2700],
    cargo: 502,
    hp: 123,
    torque: 154,
    rel: 4,
    r: { comfort: 4, fuelEcon: 4, resale: 4 },
  }),
  mk({
    id: 'kia-k5',
    brandSlug: 'kia',
    model: 'K5',
    gen: 'DL3 (2022)',
    trim: '2.0 Premium',
    engine: '2.0L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng D',
    pmin: 859,
    pmax: 999,
    econ: '~6,5 L/100km',
    dims: [4905, 1860, 1445, 2850],
    cargo: 510,
    hp: 154,
    torque: 192,
    rel: 4,
    r: { comfort: 4, tech: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'kia-carens',
    brandSlug: 'kia',
    model: 'Carens',
    gen: '(2022)',
    trim: '1.4 Turbo',
    engine: '1.4L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng C',
    pmin: 699,
    pmax: 829,
    econ: '~6,5 L/100km',
    dims: [4540, 1800, 1708, 2780],
    cargo: 216,
    hp: 138,
    torque: 242,
    rel: 4,
    r: { family: 4, comfort: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'kia-ev5',
    brandSlug: 'kia',
    model: 'EV5',
    gen: '(2024)',
    trim: 'Tiêu chuẩn',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 1100,
    pmax: 1300,
    econ: '~17 kWh/100km',
    dims: [4615, 1875, 1715, 2750],
    cargo: 513,
    hp: 215,
    torque: 310,
    rel: 4,
    r: { tech: 4, fuelEcon: 5, family: 4, cargo: 4 },
  }),
  mk({
    id: 'kia-ev9',
    brandSlug: 'kia',
    model: 'EV9',
    gen: '(2024)',
    trim: 'GT-Line AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV điện hạng E 7 chỗ',
    pmin: 1500,
    pmax: 1900,
    econ: '~20 kWh/100km',
    dims: [5010, 1980, 1755, 3100],
    cargo: 333,
    hp: 384,
    torque: 700,
    rel: 4,
    r: { tech: 5, performance: 4, comfort: 5, family: 5, cargo: 4 },
  }),

  // --- Mazda ---
  mk({
    id: 'mazda-cx3',
    brandSlug: 'mazda',
    model: 'CX-3',
    gen: 'DK (2021)',
    trim: '1.5 Luxury',
    engine: '1.5L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 524,
    pmax: 569,
    econ: '~6,0 L/100km',
    dims: [4275, 1765, 1535, 2570],
    cargo: 264,
    hp: 110,
    torque: 144,
    rel: 4,
    r: { fuelEcon: 4, tech: 4, comfort: 4 },
  }),
  mk({
    id: 'mazda-cx30',
    brandSlug: 'mazda',
    model: 'CX-30',
    gen: 'DM (2021)',
    trim: '2.0 Premium',
    engine: '2.0L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 699,
    pmax: 769,
    econ: '~6,5 L/100km',
    dims: [4395, 1795, 1540, 2655],
    cargo: 430,
    hp: 153,
    torque: 200,
    rel: 4,
    r: { comfort: 4, tech: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'mazda-cx60',
    brandSlug: 'mazda',
    model: 'CX-60',
    gen: 'KH (2023)',
    trim: '2.5 Signature',
    engine: '2.5L xăng',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng D',
    pmin: 1300,
    pmax: 1500,
    econ: '~7,5 L/100km',
    dims: [4745, 1890, 1680, 2870],
    cargo: 477,
    hp: 188,
    torque: 250,
    rel: 4,
    r: { comfort: 5, tech: 4, brandRep: 4 },
  }),
  mk({
    id: 'mazda-bt50',
    brandSlug: 'mazda',
    model: 'BT-50',
    gen: '(2021)',
    trim: '1.9 4x4 AT',
    engine: '1.9L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải',
    pmin: 659,
    pmax: 849,
    econ: '~7,5 L/100km',
    dims: [5280, 1870, 1790, 3125],
    cargo: 1100,
    hp: 150,
    torque: 350,
    rel: 4,
    r: { cargo: 5, comfort: 4, fuelEcon: 3 },
  }),

  // --- Mitsubishi ---
  mk({
    id: 'mitsubishi-attrage',
    brandSlug: 'mitsubishi',
    model: 'Attrage',
    gen: '(2020 FL)',
    trim: '1.2 CVT Premium',
    engine: '1.2L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 380,
    pmax: 490,
    econ: '~5,0 L/100km',
    dims: [4305, 1670, 1515, 2550],
    cargo: 450,
    hp: 78,
    torque: 100,
    rel: 4,
    r: { fuelEcon: 5, resale: 3, cargo: 4 },
  }),

  // --- Ford ---
  mk({
    id: 'ford-territory',
    brandSlug: 'ford',
    model: 'Territory',
    gen: '(2024)',
    trim: '1.5 Titanium X',
    engine: '1.5L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 822,
    pmax: 935,
    econ: '~7,0 L/100km',
    dims: [4630, 1935, 1706, 2726],
    cargo: 448,
    hp: 160,
    torque: 248,
    rel: 4,
    r: { tech: 4, cargo: 4, comfort: 4 },
  }),
  mk({
    id: 'ford-explorer',
    brandSlug: 'ford',
    model: 'Explorer',
    gen: 'U625 (2022)',
    trim: '2.3 Limited',
    engine: '2.3L turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 7,
    segment: 'SUV hạng E 7 chỗ',
    pmin: 2366,
    pmax: 2399,
    econ: '~10,5 L/100km',
    dims: [5050, 2004, 1778, 3025],
    cargo: 515,
    hp: 300,
    torque: 425,
    rel: 3,
    r: { comfort: 4, cargo: 5, family: 5, fuelEcon: 2 },
  }),
  mk({
    id: 'ford-transit',
    brandSlug: 'ford',
    model: 'Transit',
    gen: '(2019 FL)',
    trim: '2.0 Luxury 16 chỗ',
    engine: '2.0L turbo dầu',
    trans: 'AT 6 cấp',
    fuel: 'Dầu',
    drive: 'FWD',
    seats: 16,
    segment: 'Van 16 chỗ',
    pmin: 905,
    pmax: 945,
    econ: '~9,0 L/100km',
    dims: [5780, 2032, 2300, 3750],
    cargo: 500,
    hp: 130,
    torque: 350,
    rel: 4,
    r: { cargo: 5, family: 3, fuelEcon: 3 },
  }),

  // --- Nissan ---
  mk({
    id: 'nissan-terra',
    brandSlug: 'nissan',
    model: 'Terra',
    gen: '(2021 FL)',
    trim: '2.5 VL 4WD',
    engine: '2.5L turbo dầu',
    trans: 'AT 7 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 1029,
    pmax: 1299,
    econ: '~8,0 L/100km',
    dims: [4900, 1865, 1865, 2850],
    cargo: 645,
    hp: 190,
    torque: 450,
    rel: 4,
    r: { cargo: 4, family: 4, comfort: 4 },
  }),

  // --- Suzuki ---
  mk({
    id: 'suzuki-ertiga',
    brandSlug: 'suzuki',
    model: 'Ertiga Hybrid',
    gen: '(2022)',
    trim: '1.5 Sport Hybrid',
    engine: '1.5L Hybrid nhẹ',
    trans: 'AT 6 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng B',
    pmin: 539,
    pmax: 599,
    econ: '~6,0 L/100km',
    dims: [4395, 1735, 1690, 2740],
    cargo: 209,
    hp: 103,
    torque: 138,
    rel: 4,
    r: { fuelEcon: 4, family: 4, resale: 3 },
  }),
  mk({
    id: 'suzuki-fronx',
    brandSlug: 'suzuki',
    model: 'Fronx',
    gen: '(2024)',
    trim: '1.5 AT',
    engine: '1.5L xăng',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 580,
    pmax: 640,
    econ: '~5,8 L/100km',
    dims: [3995, 1765, 1550, 2520],
    cargo: 308,
    hp: 103,
    torque: 137,
    rel: 4,
    r: { fuelEcon: 4, tech: 4 },
  }),

  // --- Subaru ---
  mk({
    id: 'subaru-wrx',
    brandSlug: 'subaru',
    model: 'WRX',
    gen: 'VB (2022)',
    trim: '2.4 Turbo AWD',
    engine: '2.4L turbo Boxer',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan thể thao',
    pmin: 1999,
    pmax: 2099,
    econ: '~9,5 L/100km',
    dims: [4670, 1825, 1465, 2675],
    cargo: 411,
    hp: 271,
    torque: 350,
    rel: 4,
    r: { performance: 5, tech: 4, brandRep: 4 },
  }),

  // --- Peugeot ---
  mk({
    id: 'peugeot-408',
    brandSlug: 'peugeot',
    model: '408',
    gen: 'P54 (2023)',
    trim: '1.6 GT',
    engine: '1.6L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Fastback hạng C',
    pmin: 1090,
    pmax: 1190,
    econ: '~6,5 L/100km',
    dims: [4690, 1860, 1480, 2790],
    cargo: 471,
    hp: 165,
    torque: 250,
    rel: 3,
    r: { tech: 4, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'peugeot-traveller',
    brandSlug: 'peugeot',
    model: 'Traveller',
    gen: '(2019)',
    trim: '2.0 Premium',
    engine: '2.0L turbo dầu',
    trans: 'AT 8 cấp',
    fuel: 'Dầu',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng sang',
    pmin: 1699,
    pmax: 2399,
    econ: '~8,0 L/100km',
    dims: [4956, 1920, 1905, 3275],
    cargo: 1500,
    hp: 177,
    torque: 400,
    rel: 3,
    r: { comfort: 5, family: 5, cargo: 5, resale: 2 },
  }),

  // --- Volkswagen ---
  mk({
    id: 'vw-teramont',
    brandSlug: 'volkswagen',
    model: 'Teramont X',
    gen: '(2023)',
    trim: '2.0 TSI 4Motion',
    engine: '2.0L TSI',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng E 7 chỗ',
    pmin: 1998,
    pmax: 2199,
    econ: '~9,0 L/100km',
    dims: [5089, 1989, 1773, 2980],
    cargo: 583,
    hp: 220,
    torque: 350,
    rel: 3,
    r: { comfort: 4, cargo: 5, family: 5, brandRep: 4 },
  }),
  mk({
    id: 'vw-viloran',
    brandSlug: 'volkswagen',
    model: 'Viloran',
    gen: '(2024)',
    trim: '2.0 TSI Luxury',
    engine: '2.0L TSI',
    trans: 'DSG 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng sang',
    pmin: 1899,
    pmax: 2188,
    econ: '~8,5 L/100km',
    dims: [5346, 1976, 1782, 3180],
    cargo: 1380,
    hp: 220,
    torque: 350,
    rel: 3,
    r: { comfort: 5, family: 5, brandRep: 4 },
  }),

  // ===== Acura (Nhật Bản – hạng sang) =====
  mk({
    id: 'acura-integra',
    brandSlug: 'acura',
    model: 'Integra',
    gen: 'DE4 (2023)',
    trim: 'A-Spec 1.5T',
    engine: '1.5L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng sang C',
    pmin: 1150,
    pmax: 1390,
    econ: '~6,8 L/100km',
    dims: [4717, 1834, 1415, 2735],
    cargo: 696,
    hp: 200,
    torque: 260,
    rel: 4,
    r: { performance: 4, tech: 4, brandRep: 4, resale: 4 },
  }),
  mk({
    id: 'acura-mdx',
    brandSlug: 'acura',
    model: 'MDX',
    gen: 'YE (2022)',
    trim: '3.5 SH-AWD',
    engine: '3.5L V6',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang D 7 chỗ',
    pmin: 2890,
    pmax: 3290,
    econ: '~10,5 L/100km',
    dims: [5025, 1995, 1710, 2890],
    cargo: 481,
    hp: 290,
    torque: 355,
    rel: 4,
    r: { comfort: 5, tech: 4, family: 5, cargo: 4, brandRep: 4, fuelEcon: 2 },
  }),

  // ===== Infiniti (Nhật Bản – hạng sang) =====
  mk({
    id: 'infiniti-qx60',
    brandSlug: 'infiniti',
    model: 'QX60',
    gen: 'L51 (2022)',
    trim: '3.5 Autograph',
    engine: '3.5L V6',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang D 7 chỗ',
    pmin: 3290,
    pmax: 3690,
    econ: '~11 L/100km',
    dims: [5113, 1996, 1778, 2900],
    cargo: 419,
    hp: 295,
    torque: 366,
    rel: 4,
    r: { comfort: 5, family: 5, brandRep: 4, cargo: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'infiniti-q50',
    brandSlug: 'infiniti',
    model: 'Q50',
    gen: 'V37 (2023)',
    trim: '3.0T Red Sport',
    engine: '3.0L V6 twin-turbo',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 2090,
    pmax: 2390,
    econ: '~10 L/100km',
    dims: [4800, 1824, 1453, 2850],
    cargo: 500,
    hp: 405,
    torque: 475,
    rel: 4,
    r: { performance: 5, comfort: 4, brandRep: 4, fuelEcon: 2 },
  }),

  // ===== Daihatsu (Nhật Bản) =====
  mk({
    id: 'daihatsu-rocky',
    brandSlug: 'daihatsu',
    model: 'Rocky',
    gen: 'A200 (2021)',
    trim: '1.0T ASA',
    engine: '1.0L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng A',
    pmin: 420,
    pmax: 520,
    econ: '~5,5 L/100km',
    dims: [3995, 1710, 1620, 2525],
    cargo: 369,
    hp: 98,
    torque: 140,
    rel: 4,
    r: { fuelEcon: 5, tech: 3, resale: 3 },
  }),
  mk({
    id: 'daihatsu-terios',
    brandSlug: 'daihatsu',
    model: 'Terios',
    gen: 'F800 (2023 FL)',
    trim: '1.5 R',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 7,
    segment: 'SUV hạng B 7 chỗ',
    pmin: 520,
    pmax: 620,
    econ: '~6,5 L/100km',
    dims: [4435, 1735, 1705, 2685],
    cargo: 230,
    hp: 103,
    torque: 136,
    rel: 4,
    r: { fuelEcon: 4, family: 4, reliability: 4 },
  }),

  // ===== Genesis (Hàn Quốc – hạng sang) =====
  mk({
    id: 'genesis-g80',
    brandSlug: 'genesis',
    model: 'G80',
    gen: 'RG3 (2021)',
    trim: '2.5T AWD',
    engine: '2.5L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2790,
    pmax: 3290,
    warranty: '5 năm / không giới hạn km',
    econ: '~9 L/100km',
    dims: [4995, 1925, 1465, 3010],
    cargo: 424,
    hp: 304,
    torque: 422,
    rel: 4,
    r: { comfort: 5, tech: 5, brandRep: 4, performance: 4 },
  }),
  mk({
    id: 'genesis-gv80',
    brandSlug: 'genesis',
    model: 'GV80',
    gen: 'JX1 (2021)',
    trim: '3.5T AWD',
    engine: '3.5L V6 turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang E 7 chỗ',
    pmin: 3590,
    pmax: 4290,
    warranty: '5 năm / không giới hạn km',
    econ: '~11 L/100km',
    dims: [4945, 1975, 1715, 2955],
    cargo: 727,
    hp: 380,
    torque: 530,
    rel: 4,
    r: { comfort: 5, tech: 5, family: 5, cargo: 4, brandRep: 4, fuelEcon: 2 },
  }),

  // ===== Porsche (Đức) =====
  mk({
    id: 'porsche-911',
    brandSlug: 'porsche',
    model: '911',
    gen: '992 (2024)',
    trim: 'Carrera S',
    engine: '3.0L flat-6 twin-turbo',
    trans: 'PDK 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 4,
    segment: 'Coupe thể thao',
    pmin: 8500,
    pmax: 12000,
    econ: '~10,5 L/100km',
    dims: [4519, 1852, 1300, 2450],
    cargo: 132,
    hp: 480,
    torque: 530,
    rel: 4,
    r: {
      performance: 5,
      tech: 5,
      brandRep: 5,
      resale: 5,
      comfort: 4,
      family: 1,
      cargo: 1,
      fuelEcon: 2,
    },
  }),
  mk({
    id: 'porsche-cayenne',
    brandSlug: 'porsche',
    model: 'Cayenne',
    gen: 'E3 FL (2024)',
    trim: '3.0 V6',
    engine: '3.0L V6 turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 5500,
    pmax: 7500,
    econ: '~11 L/100km',
    dims: [4930, 1983, 1696, 2895],
    cargo: 772,
    hp: 353,
    torque: 500,
    rel: 4,
    r: { performance: 5, comfort: 5, tech: 5, brandRep: 5, cargo: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'porsche-macan',
    brandSlug: 'porsche',
    model: 'Macan',
    gen: '95B FL (2022)',
    trim: '2.0',
    engine: '2.0L turbo',
    trans: 'PDK 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 3500,
    pmax: 4500,
    econ: '~9,5 L/100km',
    dims: [4726, 1922, 1621, 2807],
    cargo: 488,
    hp: 265,
    torque: 400,
    rel: 4,
    r: { performance: 5, comfort: 4, tech: 4, brandRep: 5, fuelEcon: 2 },
  }),
  mk({
    id: 'porsche-taycan',
    brandSlug: 'porsche',
    model: 'Taycan',
    gen: 'J1 FL (2024)',
    trim: '4S',
    engine: 'Mô-tơ điện kép',
    trans: '2 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 4,
    segment: 'Sedan điện hạng sang',
    pmin: 5800,
    pmax: 8500,
    econ: '~21 kWh/100km',
    dims: [4963, 1966, 1395, 2900],
    cargo: 407,
    hp: 530,
    torque: 710,
    rel: 4,
    r: { performance: 5, tech: 5, brandRep: 5, fuelEcon: 5, comfort: 4 },
  }),

  // ===== Opel (Đức) =====
  mk({
    id: 'opel-astra',
    brandSlug: 'opel',
    model: 'Astra',
    gen: 'L (2022)',
    trim: '1.2T GS Line',
    engine: '1.2L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng C',
    pmin: 850,
    pmax: 1050,
    econ: '~6,0 L/100km',
    dims: [4374, 1860, 1470, 2675],
    cargo: 422,
    hp: 130,
    torque: 230,
    rel: 3,
    r: { tech: 4, comfort: 4, fuelEcon: 4 },
  }),
  mk({
    id: 'opel-mokka',
    brandSlug: 'opel',
    model: 'Mokka',
    gen: '(2021)',
    trim: '1.2T GS Line',
    engine: '1.2L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 820,
    pmax: 980,
    econ: '~6,2 L/100km',
    dims: [4151, 1791, 1531, 2557],
    cargo: 350,
    hp: 130,
    torque: 230,
    rel: 3,
    r: { tech: 4, fuelEcon: 4 },
  }),

  // ===== GMC (Mỹ) =====
  mk({
    id: 'gmc-yukon',
    brandSlug: 'gmc',
    model: 'Yukon',
    gen: 'T1XX (2021)',
    trim: 'Denali 6.2 V8',
    engine: '6.2L V8',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV cỡ lớn',
    pmin: 5200,
    pmax: 6200,
    econ: '~14 L/100km',
    dims: [5334, 2057, 1933, 3071],
    cargo: 722,
    hp: 420,
    torque: 624,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, performance: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'gmc-sierra',
    brandSlug: 'gmc',
    model: 'Sierra 1500',
    gen: 'T1XX (2022 FL)',
    trim: 'Denali 6.2 V8',
    engine: '6.2L V8',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải cỡ lớn',
    pmin: 4200,
    pmax: 5200,
    econ: '~13,5 L/100km',
    dims: [5890, 2063, 1925, 3745],
    cargo: 1300,
    hp: 420,
    torque: 624,
    rel: 3,
    r: { performance: 5, cargo: 5, comfort: 4, fuelEcon: 1 },
  }),

  // ===== Cadillac (Mỹ) =====
  mk({
    id: 'cadillac-escalade',
    brandSlug: 'cadillac',
    model: 'Escalade',
    gen: 'T1XX (2021)',
    trim: '6.2 V8 Sport',
    engine: '6.2L V8',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV cỡ lớn hạng sang',
    pmin: 7500,
    pmax: 9500,
    econ: '~15 L/100km',
    dims: [5382, 2059, 1948, 3071],
    cargo: 722,
    hp: 420,
    torque: 623,
    rel: 3,
    r: { comfort: 5, tech: 5, cargo: 5, family: 5, brandRep: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'cadillac-lyriq',
    brandSlug: 'cadillac',
    model: 'Lyriq',
    gen: '(2023)',
    trim: 'RWD',
    engine: 'Mô-tơ điện đơn',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'SUV điện hạng sang D',
    pmin: 3500,
    pmax: 4200,
    econ: '~19 kWh/100km',
    dims: [4996, 1977, 1623, 3094],
    cargo: 793,
    hp: 340,
    torque: 440,
    rel: 3,
    r: { tech: 5, comfort: 5, fuelEcon: 5, cargo: 4, brandRep: 4 },
  }),

  // ===== Jeep (Mỹ) =====
  mk({
    id: 'jeep-wrangler',
    brandSlug: 'jeep',
    model: 'Wrangler',
    gen: 'JL (2024 FL)',
    trim: 'Rubicon 2.0T',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 5,
    segment: 'SUV off-road',
    pmin: 2890,
    pmax: 3690,
    econ: '~11,5 L/100km',
    dims: [4882, 1894, 1848, 3008],
    cargo: 898,
    hp: 272,
    torque: 400,
    rel: 3,
    r: { performance: 5, brandRep: 4, comfort: 3, fuelEcon: 2 },
  }),
  mk({
    id: 'jeep-grand-cherokee',
    brandSlug: 'jeep',
    model: 'Grand Cherokee',
    gen: 'WL (2022)',
    trim: '3.6 V6 Limited',
    engine: '3.6L V6',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 5,
    segment: 'SUV hạng D',
    pmin: 3290,
    pmax: 4290,
    econ: '~12 L/100km',
    dims: [4914, 1979, 1795, 2964],
    cargo: 1067,
    hp: 293,
    torque: 353,
    rel: 3,
    r: { comfort: 4, cargo: 5, performance: 4, family: 4, fuelEcon: 2 },
  }),

  // ===== RAM (Mỹ) =====
  mk({
    id: 'ram-1500',
    brandSlug: 'ram',
    model: '1500',
    gen: 'DT (2022)',
    trim: 'Laramie 5.7 V8',
    engine: '5.7L V8 HEMI',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 5,
    segment: 'Bán tải cỡ lớn',
    pmin: 3900,
    pmax: 4900,
    econ: '~14 L/100km',
    dims: [5916, 2084, 1971, 3672],
    cargo: 1300,
    hp: 395,
    torque: 556,
    rel: 3,
    r: { performance: 5, cargo: 5, comfort: 4, fuelEcon: 1 },
  }),

  // ===== Dodge (Mỹ) =====
  mk({
    id: 'dodge-durango',
    brandSlug: 'dodge',
    model: 'Durango',
    gen: 'WD (2021 FL)',
    trim: 'R/T 5.7 V8',
    engine: '5.7L V8 HEMI',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng D 7 chỗ',
    pmin: 3290,
    pmax: 4290,
    econ: '~14 L/100km',
    dims: [5100, 1925, 1801, 3042],
    cargo: 487,
    hp: 360,
    torque: 529,
    rel: 3,
    r: { performance: 5, cargo: 4, family: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'dodge-challenger',
    brandSlug: 'dodge',
    model: 'Challenger',
    gen: 'LA (2023)',
    trim: 'R/T Scat Pack 6.4',
    engine: '6.4L V8',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Coupe cơ bắp',
    pmin: 2790,
    pmax: 3590,
    econ: '~15 L/100km',
    dims: [5022, 1923, 1449, 2946],
    cargo: 459,
    hp: 485,
    torque: 644,
    rel: 3,
    r: { performance: 5, brandRep: 4, fuelEcon: 1, family: 2 },
  }),

  // ===== Chrysler (Mỹ) =====
  mk({
    id: 'chrysler-pacifica',
    brandSlug: 'chrysler',
    model: 'Pacifica',
    gen: 'RU (2021 FL)',
    trim: 'Pinnacle',
    engine: '3.6L V6',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV hạng D',
    pmin: 2490,
    pmax: 3090,
    econ: '~11 L/100km',
    dims: [5176, 2022, 1798, 3089],
    cargo: 915,
    hp: 287,
    torque: 355,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, fuelEcon: 2 },
  }),

  // ===== Lincoln (Mỹ) =====
  mk({
    id: 'lincoln-navigator',
    brandSlug: 'lincoln',
    model: 'Navigator',
    gen: 'U554 (2022 FL)',
    trim: 'Reserve 3.5TT',
    engine: '3.5L V6 twin-turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV cỡ lớn hạng sang',
    pmin: 6500,
    pmax: 8200,
    econ: '~14 L/100km',
    dims: [5644, 2077, 1940, 3416],
    cargo: 583,
    hp: 440,
    torque: 691,
    rel: 3,
    r: { comfort: 5, tech: 5, cargo: 5, family: 5, brandRep: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'lincoln-aviator',
    brandSlug: 'lincoln',
    model: 'Aviator',
    gen: 'U611 (2023 FL)',
    trim: '3.0TT Reserve',
    engine: '3.0L V6 twin-turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang D 7 chỗ',
    pmin: 4290,
    pmax: 5290,
    econ: '~12,5 L/100km',
    dims: [5060, 2015, 1755, 3025],
    cargo: 535,
    hp: 400,
    torque: 562,
    rel: 3,
    r: { comfort: 5, tech: 4, family: 5, cargo: 4, fuelEcon: 2 },
  }),

  // ===== Land Rover (Anh) =====
  mk({
    id: 'land-rover-defender',
    brandSlug: 'land-rover',
    model: 'Defender',
    gen: 'L663 (2023)',
    trim: '110 P300',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV off-road hạng sang',
    pmin: 4200,
    pmax: 6500,
    econ: '~11 L/100km',
    dims: [5018, 2008, 1967, 3022],
    cargo: 786,
    hp: 300,
    torque: 400,
    rel: 3,
    r: { performance: 4, comfort: 4, brandRep: 4, cargo: 4, family: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'land-rover-discovery',
    brandSlug: 'land-rover',
    model: 'Discovery',
    gen: 'L462 FL (2022)',
    trim: 'D300 R-Dynamic',
    engine: '3.0L turbo dầu',
    trans: 'AT 8 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng sang E 7 chỗ',
    pmin: 4500,
    pmax: 5800,
    econ: '~9 L/100km',
    dims: [4956, 2073, 1888, 2923],
    cargo: 1231,
    hp: 300,
    torque: 650,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, brandRep: 4, fuelEcon: 3 },
  }),

  // ===== Range Rover (Anh) =====
  mk({
    id: 'range-rover-evoque',
    brandSlug: 'range-rover',
    model: 'Evoque',
    gen: 'L551 FL (2024)',
    trim: 'P250 Dynamic SE',
    engine: '2.0L turbo',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 3290,
    pmax: 4290,
    econ: '~9 L/100km',
    dims: [4371, 1996, 1649, 2681],
    cargo: 591,
    hp: 249,
    torque: 365,
    rel: 3,
    r: { comfort: 4, tech: 4, brandRep: 4, fuelEcon: 3 },
  }),
  mk({
    id: 'range-rover-sport',
    brandSlug: 'range-rover',
    model: 'Sport',
    gen: 'L461 (2023)',
    trim: 'P400 Dynamic SE',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 6800,
    pmax: 9500,
    econ: '~11 L/100km',
    dims: [4946, 2047, 1820, 2997],
    cargo: 835,
    hp: 400,
    torque: 550,
    rel: 3,
    r: { comfort: 5, performance: 5, tech: 5, brandRep: 5, cargo: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'range-rover-autobiography',
    brandSlug: 'range-rover',
    model: 'Autobiography',
    gen: 'L460 (2023)',
    trim: 'P530 V8',
    engine: '4.4L V8 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV siêu sang',
    pmin: 11000,
    pmax: 16000,
    econ: '~13 L/100km',
    dims: [5052, 2047, 1870, 2997],
    cargo: 818,
    hp: 530,
    torque: 750,
    rel: 3,
    r: { comfort: 5, performance: 5, tech: 5, brandRep: 5, cargo: 4, fuelEcon: 1 },
  }),

  // ===== Jaguar (Anh) =====
  mk({
    id: 'jaguar-f-pace',
    brandSlug: 'jaguar',
    model: 'F-Pace',
    gen: 'X761 FL (2021)',
    trim: 'P250 R-Dynamic',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 3290,
    pmax: 4290,
    econ: '~9,5 L/100km',
    dims: [4747, 2071, 1664, 2874],
    cargo: 613,
    hp: 250,
    torque: 365,
    rel: 3,
    r: { performance: 4, comfort: 4, brandRep: 4, cargo: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'jaguar-f-type',
    brandSlug: 'jaguar',
    model: 'F-Type',
    gen: 'X152 FL (2021)',
    trim: 'P450 R-Dynamic',
    engine: '5.0L V8 supercharged',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 2,
    segment: 'Coupe thể thao',
    pmin: 5500,
    pmax: 7500,
    econ: '~12 L/100km',
    dims: [4470, 1923, 1311, 2622],
    cargo: 336,
    hp: 450,
    torque: 580,
    rel: 3,
    r: { performance: 5, brandRep: 4, comfort: 4, family: 1, cargo: 1, fuelEcon: 1 },
  }),

  // ===== Bentley (Anh – siêu sang) =====
  mk({
    id: 'bentley-bentayga',
    brandSlug: 'bentley',
    model: 'Bentayga',
    gen: '(2021 FL)',
    trim: 'V8',
    engine: '4.0L V8 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV siêu sang',
    pmin: 16000,
    pmax: 22000,
    econ: '~13 L/100km',
    dims: [5125, 1998, 1742, 2995],
    cargo: 484,
    hp: 550,
    torque: 770,
    rel: 3,
    r: { comfort: 5, performance: 5, tech: 5, brandRep: 5, fuelEcon: 1 },
  }),
  mk({
    id: 'bentley-continental-gt',
    brandSlug: 'bentley',
    model: 'Continental GT',
    gen: '(2024 FL)',
    trim: 'Speed W12',
    engine: '6.0L W12 twin-turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 4,
    segment: 'Coupe siêu sang',
    pmin: 18000,
    pmax: 24000,
    econ: '~14 L/100km',
    dims: [4850, 1954, 1405, 2851],
    cargo: 358,
    hp: 659,
    torque: 900,
    rel: 3,
    r: { comfort: 5, performance: 5, tech: 5, brandRep: 5, fuelEcon: 1, family: 1 },
  }),

  // ===== Rolls-Royce (Anh – siêu sang) =====
  mk({
    id: 'rolls-royce-cullinan',
    brandSlug: 'rolls-royce',
    model: 'Cullinan',
    gen: '(2024 Series II)',
    trim: 'V12',
    engine: '6.75L V12 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV siêu sang',
    pmin: 40000,
    pmax: 60000,
    econ: '~15 L/100km',
    dims: [5341, 2164, 1835, 3295],
    cargo: 600,
    hp: 571,
    torque: 850,
    rel: 3,
    r: { comfort: 5, tech: 5, brandRep: 5, cargo: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'rolls-royce-ghost',
    brandSlug: 'rolls-royce',
    model: 'Ghost',
    gen: '(2021)',
    trim: 'V12',
    engine: '6.75L V12 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan siêu sang',
    pmin: 38000,
    pmax: 55000,
    econ: '~15 L/100km',
    dims: [5546, 1978, 1571, 3295],
    cargo: 490,
    hp: 571,
    torque: 850,
    rel: 3,
    r: { comfort: 5, tech: 5, brandRep: 5, fuelEcon: 1 },
  }),

  // ===== Aston Martin (Anh) =====
  mk({
    id: 'aston-martin-dbx',
    brandSlug: 'aston-martin',
    model: 'DBX',
    gen: '(2023)',
    trim: '707',
    engine: '4.0L V8 twin-turbo',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV siêu sang thể thao',
    pmin: 16000,
    pmax: 22000,
    econ: '~14 L/100km',
    dims: [5039, 1998, 1680, 3060],
    cargo: 638,
    hp: 707,
    torque: 900,
    rel: 3,
    r: { performance: 5, comfort: 4, brandRep: 5, fuelEcon: 1 },
  }),
  mk({
    id: 'aston-martin-vantage',
    brandSlug: 'aston-martin',
    model: 'Vantage',
    gen: '(2024)',
    trim: 'V8',
    engine: '4.0L V8 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 2,
    segment: 'Coupe thể thao',
    pmin: 14000,
    pmax: 18000,
    econ: '~13 L/100km',
    dims: [4495, 1942, 1273, 2705],
    cargo: 270,
    hp: 665,
    torque: 800,
    rel: 3,
    r: { performance: 5, brandRep: 5, fuelEcon: 1, family: 1, cargo: 1 },
  }),

  // ===== Lotus (Anh) =====
  mk({
    id: 'lotus-emira',
    brandSlug: 'lotus',
    model: 'Emira',
    gen: '(2023)',
    trim: 'V6 First Edition',
    engine: '3.5L V6 supercharged',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 2,
    segment: 'Coupe thể thao',
    pmin: 5500,
    pmax: 7000,
    econ: '~11 L/100km',
    dims: [4413, 1895, 1225, 2575],
    cargo: 208,
    hp: 400,
    torque: 430,
    rel: 3,
    r: { performance: 5, brandRep: 4, family: 1, cargo: 1, fuelEcon: 2 },
  }),
  mk({
    id: 'lotus-eletre',
    brandSlug: 'lotus',
    model: 'Eletre',
    gen: '(2024)',
    trim: 'R',
    engine: 'Mô-tơ điện kép',
    trans: '2 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng sang',
    pmin: 7000,
    pmax: 9500,
    econ: '~21 kWh/100km',
    dims: [5103, 2019, 1630, 3019],
    cargo: 688,
    hp: 905,
    torque: 985,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, brandRep: 4 },
  }),

  // ===== McLaren (Anh – siêu xe) =====
  mk({
    id: 'mclaren-artura',
    brandSlug: 'mclaren',
    model: 'Artura',
    gen: '(2023)',
    trim: 'V6 Hybrid',
    engine: '3.0L V6 twin-turbo + điện',
    trans: 'DCT 8 cấp',
    fuel: 'Hybrid',
    drive: 'RWD',
    seats: 2,
    segment: 'Siêu xe',
    pmin: 14000,
    pmax: 18000,
    econ: '~9 L/100km',
    dims: [4539, 1976, 1193, 2640],
    cargo: 160,
    hp: 680,
    torque: 720,
    rel: 3,
    r: { performance: 5, tech: 5, brandRep: 5, family: 1, cargo: 1, fuelEcon: 2 },
  }),
  mk({
    id: 'mclaren-750s',
    brandSlug: 'mclaren',
    model: '750S',
    gen: '(2024)',
    trim: 'Coupe',
    engine: '4.0L V8 twin-turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 2,
    segment: 'Siêu xe',
    pmin: 20000,
    pmax: 26000,
    econ: '~12 L/100km',
    dims: [4569, 2161, 1196, 2670],
    cargo: 210,
    hp: 750,
    torque: 800,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, family: 1, cargo: 1, fuelEcon: 1 },
  }),

  // ===== Polestar (Thụy Điển – điện) =====
  mk({
    id: 'polestar-2',
    brandSlug: 'polestar',
    model: 'Polestar 2',
    gen: '(2024 FL)',
    trim: 'Long Range Dual',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Fastback điện hạng D',
    pmin: 1750,
    pmax: 2150,
    warranty: '5 năm / 100.000 km (pin 8 năm)',
    econ: '~18 kWh/100km',
    dims: [4606, 1859, 1479, 2735],
    cargo: 405,
    hp: 421,
    torque: 740,
    rel: 4,
    r: { performance: 5, tech: 5, fuelEcon: 5, safety: 5, brandRep: 4 },
  }),
  mk({
    id: 'polestar-3',
    brandSlug: 'polestar',
    model: 'Polestar 3',
    gen: '(2024)',
    trim: 'Long Range Dual',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng sang D',
    pmin: 3200,
    pmax: 4000,
    warranty: '5 năm / 100.000 km (pin 8 năm)',
    econ: '~22 kWh/100km',
    dims: [4900, 2120, 1614, 2985],
    cargo: 597,
    hp: 489,
    torque: 840,
    rel: 4,
    r: { performance: 5, tech: 5, comfort: 5, fuelEcon: 5, cargo: 4, safety: 5 },
  }),

  // ===== Ferrari (Ý – siêu xe) =====
  mk({
    id: 'ferrari-roma',
    brandSlug: 'ferrari',
    model: 'Roma',
    gen: '(2023)',
    trim: 'V8',
    engine: '3.9L V8 twin-turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 4,
    segment: 'GT Coupe',
    pmin: 20000,
    pmax: 26000,
    econ: '~13 L/100km',
    dims: [4656, 1974, 1301, 2670],
    cargo: 272,
    hp: 620,
    torque: 760,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, comfort: 4, family: 1, fuelEcon: 1 },
  }),
  mk({
    id: 'ferrari-purosangue',
    brandSlug: 'ferrari',
    model: 'Purosangue',
    gen: '(2024)',
    trim: 'V12',
    engine: '6.5L V12',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 4,
    segment: 'SUV siêu xe',
    pmin: 40000,
    pmax: 55000,
    econ: '~17 L/100km',
    dims: [4973, 2028, 1589, 3018],
    cargo: 473,
    hp: 725,
    torque: 716,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, cargo: 3, fuelEcon: 1 },
  }),

  // ===== Lamborghini (Ý – siêu xe) =====
  mk({
    id: 'lamborghini-urus',
    brandSlug: 'lamborghini',
    model: 'Urus',
    gen: 'SE (2024)',
    trim: 'Performante',
    engine: '4.0L V8 twin-turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV siêu xe',
    pmin: 16000,
    pmax: 24000,
    econ: '~14 L/100km',
    dims: [5112, 2016, 1638, 3003],
    cargo: 616,
    hp: 666,
    torque: 850,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, cargo: 4, fuelEcon: 1 },
  }),
  mk({
    id: 'lamborghini-revuelto',
    brandSlug: 'lamborghini',
    model: 'Revuelto',
    gen: '(2024)',
    trim: 'V12 HPEV',
    engine: '6.5L V12 + điện',
    trans: 'DCT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 2,
    segment: 'Hypercar',
    pmin: 50000,
    pmax: 70000,
    econ: '~13 L/100km',
    dims: [4947, 2033, 1160, 2779],
    cargo: 95,
    hp: 1015,
    torque: 725,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, family: 1, cargo: 1, fuelEcon: 1 },
  }),

  // ===== Maserati (Ý) =====
  mk({
    id: 'maserati-grecale',
    brandSlug: 'maserati',
    model: 'Grecale',
    gen: '(2023)',
    trim: 'Modena',
    engine: '2.0L turbo mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 5500,
    pmax: 7500,
    econ: '~10 L/100km',
    dims: [4846, 1948, 1670, 2901],
    cargo: 535,
    hp: 330,
    torque: 450,
    rel: 3,
    r: { performance: 4, comfort: 4, brandRep: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'maserati-ghibli',
    brandSlug: 'maserati',
    model: 'Ghibli',
    gen: 'M157 FL (2022)',
    trim: 'GT',
    engine: '2.0L turbo mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 6000,
    pmax: 8000,
    econ: '~9,5 L/100km',
    dims: [4971, 1945, 1461, 2998],
    cargo: 500,
    hp: 330,
    torque: 450,
    rel: 3,
    r: { performance: 4, comfort: 4, brandRep: 4, fuelEcon: 2 },
  }),

  // ===== Alfa Romeo (Ý) =====
  mk({
    id: 'alfa-romeo-stelvio',
    brandSlug: 'alfa-romeo',
    model: 'Stelvio',
    gen: '(2023 FL)',
    trim: '2.0T Veloce',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 3290,
    pmax: 4290,
    econ: '~9 L/100km',
    dims: [4687, 1903, 1671, 2818],
    cargo: 525,
    hp: 280,
    torque: 400,
    rel: 3,
    r: { performance: 5, brandRep: 4, comfort: 4, fuelEcon: 2 },
  }),
  mk({
    id: 'alfa-romeo-giulia',
    brandSlug: 'alfa-romeo',
    model: 'Giulia',
    gen: '(2023 FL)',
    trim: '2.0T Veloce',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 2990,
    pmax: 3890,
    econ: '~8,5 L/100km',
    dims: [4639, 1860, 1436, 2820],
    cargo: 480,
    hp: 280,
    torque: 400,
    rel: 3,
    r: { performance: 5, brandRep: 4, comfort: 4, fuelEcon: 2 },
  }),

  // ===== Fiat (Ý) =====
  mk({
    id: 'fiat-500',
    brandSlug: 'fiat',
    model: '500',
    gen: '(2024)',
    trim: '1.0 Hybrid',
    engine: '1.0L mild hybrid',
    trans: 'MT 6 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 4,
    segment: 'Hatchback mini',
    pmin: 550,
    pmax: 700,
    econ: '~4,8 L/100km',
    dims: [3571, 1627, 1488, 2300],
    cargo: 185,
    hp: 70,
    torque: 92,
    rel: 3,
    r: { fuelEcon: 5, tech: 3, cargo: 2, family: 2 },
  }),
  mk({
    id: 'fiat-500x',
    brandSlug: 'fiat',
    model: '500X',
    gen: '(2023 FL)',
    trim: '1.5 Hybrid',
    engine: '1.5L mild hybrid',
    trans: 'DCT 7 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 750,
    pmax: 950,
    econ: '~5,8 L/100km',
    dims: [4273, 1796, 1620, 2570],
    cargo: 350,
    hp: 130,
    torque: 240,
    rel: 3,
    r: { fuelEcon: 4, tech: 3 },
  }),

  // ===== Pagani (Ý – hypercar) =====
  mk({
    id: 'pagani-utopia',
    brandSlug: 'pagani',
    model: 'Utopia',
    gen: '(2024)',
    trim: 'V12',
    engine: '6.0L V12 twin-turbo (AMG)',
    trans: 'MT 7 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 2,
    segment: 'Hypercar',
    pmin: 60000,
    pmax: 90000,
    econ: '~16 L/100km',
    dims: [4566, 2058, 1170, 2700],
    cargo: 80,
    hp: 864,
    torque: 1100,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, family: 1, cargo: 1, fuelEcon: 1 },
  }),

  // ===== Renault (Pháp) =====
  mk({
    id: 'renault-captur',
    brandSlug: 'renault',
    model: 'Captur',
    gen: '(2024 FL)',
    trim: '1.3 TCe Techno',
    engine: '1.3L turbo',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 720,
    pmax: 880,
    econ: '~6,0 L/100km',
    dims: [4239, 1797, 1576, 2639],
    cargo: 422,
    hp: 140,
    torque: 260,
    rel: 3,
    r: { tech: 4, fuelEcon: 4, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'renault-arkana',
    brandSlug: 'renault',
    model: 'Arkana',
    gen: '(2023)',
    trim: '1.3 TCe RS Line',
    engine: '1.3L turbo mild hybrid',
    trans: 'AT 7 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV coupe hạng C',
    pmin: 880,
    pmax: 1090,
    econ: '~5,8 L/100km',
    dims: [4568, 1821, 1576, 2720],
    cargo: 480,
    hp: 140,
    torque: 260,
    rel: 3,
    r: { tech: 4, comfort: 4, fuelEcon: 4, resale: 2 },
  }),

  // ===== Citroën (Pháp) =====
  mk({
    id: 'citroen-c3',
    brandSlug: 'citroen',
    model: 'C3',
    gen: '(2024)',
    trim: '1.2 Max',
    engine: '1.2L turbo',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback hạng B',
    pmin: 480,
    pmax: 600,
    econ: '~5,8 L/100km',
    dims: [4015, 1755, 1610, 2540],
    cargo: 310,
    hp: 110,
    torque: 205,
    rel: 3,
    r: { comfort: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'citroen-c5-aircross',
    brandSlug: 'citroen',
    model: 'C5 Aircross',
    gen: '(2023 FL)',
    trim: '1.6T Feel',
    engine: '1.6L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 900,
    pmax: 1150,
    econ: '~6,8 L/100km',
    dims: [4500, 1859, 1689, 2730],
    cargo: 580,
    hp: 180,
    torque: 250,
    rel: 3,
    r: { comfort: 5, cargo: 4, tech: 4, resale: 2 },
  }),

  // ===== DS (Pháp – hạng sang) =====
  mk({
    id: 'ds-7',
    brandSlug: 'ds',
    model: 'DS 7',
    gen: '(2023 FL)',
    trim: '1.6T Rivoli',
    engine: '1.6L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng sang C',
    pmin: 1250,
    pmax: 1650,
    econ: '~7,0 L/100km',
    dims: [4590, 1895, 1635, 2740],
    cargo: 555,
    hp: 180,
    torque: 250,
    rel: 3,
    r: { comfort: 5, tech: 4, brandRep: 3, resale: 2 },
  }),
  mk({
    id: 'ds-3',
    brandSlug: 'ds',
    model: 'DS 3',
    gen: '(2023 FL)',
    trim: '1.2T Performance Line',
    engine: '1.2L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 950,
    pmax: 1200,
    econ: '~6,2 L/100km',
    dims: [4118, 1791, 1534, 2558],
    cargo: 350,
    hp: 130,
    torque: 230,
    rel: 3,
    r: { comfort: 4, tech: 4, brandRep: 3, resale: 2 },
  }),

  // ===== Bugatti (Pháp – hypercar) =====
  mk({
    id: 'bugatti-chiron',
    brandSlug: 'bugatti',
    model: 'Chiron',
    gen: '(2022)',
    trim: 'Super Sport',
    engine: '8.0L W16 quad-turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 2,
    segment: 'Hypercar',
    pmin: 80000,
    pmax: 130000,
    econ: '~22 L/100km',
    dims: [4544, 2038, 1212, 2711],
    cargo: 44,
    hp: 1600,
    torque: 1600,
    rel: 3,
    r: { performance: 5, brandRep: 5, tech: 5, family: 1, cargo: 1, fuelEcon: 1 },
  }),

  // ===== MG (Trung Quốc) =====
  mk({
    id: 'mg-zs',
    brandSlug: 'mg',
    model: 'ZS',
    gen: '(2024)',
    trim: '1.5 Luxury',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 519,
    pmax: 619,
    warranty: '5 năm / 150.000 km',
    econ: '~6,2 L/100km',
    dims: [4323, 1809, 1653, 2585],
    cargo: 359,
    hp: 113,
    torque: 150,
    rel: 3,
    r: { fuelEcon: 4, tech: 4, resale: 2 },
  }),
  mk({
    id: 'mg-mg5',
    brandSlug: 'mg',
    model: 'MG5',
    gen: '(2023)',
    trim: '1.5 Luxury',
    engine: '1.5L xăng',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng C',
    pmin: 459,
    pmax: 569,
    warranty: '5 năm / 150.000 km',
    econ: '~5,9 L/100km',
    dims: [4675, 1842, 1473, 2680],
    cargo: 401,
    hp: 114,
    torque: 150,
    rel: 3,
    r: { fuelEcon: 4, cargo: 4, resale: 2 },
  }),
  mk({
    id: 'mg-mg4',
    brandSlug: 'mg',
    model: 'MG4',
    gen: '(2024)',
    trim: 'Luxury EV',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 5,
    segment: 'Hatchback điện hạng C',
    pmin: 730,
    pmax: 880,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~16 kWh/100km',
    dims: [4287, 1836, 1504, 2705],
    cargo: 363,
    hp: 203,
    torque: 250,
    rel: 3,
    r: { performance: 4, tech: 4, fuelEcon: 5, resale: 2 },
  }),

  // ===== Geely (Trung Quốc) =====
  mk({
    id: 'geely-coolray',
    brandSlug: 'geely',
    model: 'Coolray',
    gen: '(2024)',
    trim: '1.5T Premium',
    engine: '1.5L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 538,
    pmax: 628,
    warranty: '5 năm / 150.000 km',
    econ: '~6,5 L/100km',
    dims: [4400, 1800, 1609, 2600],
    cargo: 330,
    hp: 177,
    torque: 255,
    rel: 3,
    r: { performance: 4, tech: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'geely-monjaro',
    brandSlug: 'geely',
    model: 'Monjaro',
    gen: '(2024)',
    trim: '2.0T Flagship',
    engine: '2.0L turbo mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng D',
    pmin: 1150,
    pmax: 1469,
    warranty: '5 năm / 150.000 km',
    econ: '~8,0 L/100km',
    dims: [4770, 1895, 1689, 2845],
    cargo: 552,
    hp: 238,
    torque: 350,
    rel: 3,
    r: { comfort: 4, tech: 4, cargo: 4, family: 4, resale: 2 },
  }),

  // ===== Zeekr (Trung Quốc – điện) =====
  mk({
    id: 'zeekr-001',
    brandSlug: 'zeekr',
    model: '001',
    gen: '(2024)',
    trim: 'Long Range AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Shooting brake điện',
    pmin: 1690,
    pmax: 2090,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~18 kWh/100km',
    dims: [4970, 1999, 1560, 3005],
    cargo: 539,
    hp: 544,
    torque: 686,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'zeekr-x',
    brandSlug: 'zeekr',
    model: 'X',
    gen: '(2024)',
    trim: 'Privilege AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng B',
    pmin: 1090,
    pmax: 1290,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~16 kWh/100km',
    dims: [4450, 1836, 1572, 2750],
    cargo: 362,
    hp: 422,
    torque: 543,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, resale: 2 },
  }),

  // ===== Chery (Trung Quốc) =====
  mk({
    id: 'chery-omoda-5',
    brandSlug: 'chery',
    model: 'Omoda 5',
    gen: '(2024)',
    trim: '1.5T Flagship',
    engine: '1.5L turbo',
    trans: 'CVT',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 539,
    pmax: 669,
    warranty: '5 năm / 150.000 km',
    econ: '~6,5 L/100km',
    dims: [4400, 1830, 1588, 2630],
    cargo: 360,
    hp: 156,
    torque: 230,
    rel: 3,
    r: { tech: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'chery-tiggo-8',
    brandSlug: 'chery',
    model: 'Tiggo 8 Pro',
    gen: '(2024)',
    trim: '2.0T Flagship',
    engine: '2.0L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'SUV hạng C 7 chỗ',
    pmin: 858,
    pmax: 1058,
    warranty: '5 năm / 150.000 km',
    econ: '~7,5 L/100km',
    dims: [4722, 1860, 1745, 2710],
    cargo: 193,
    hp: 254,
    torque: 390,
    rel: 3,
    r: { comfort: 4, tech: 4, family: 4, cargo: 4, resale: 2 },
  }),

  // ===== Haval (Trung Quốc) =====
  mk({
    id: 'haval-h6',
    brandSlug: 'haval',
    model: 'H6',
    gen: '(2023)',
    trim: '2.0T HEV',
    engine: '1.5L Hybrid',
    trans: 'DHT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 850,
    pmax: 1096,
    warranty: '5 năm / 150.000 km',
    econ: '~5,5 L/100km',
    dims: [4683, 1886, 1730, 2738],
    cargo: 600,
    hp: 243,
    torque: 530,
    rel: 3,
    r: { fuelEcon: 4, tech: 4, comfort: 4, family: 4, resale: 2 },
  }),
  mk({
    id: 'haval-jolion',
    brandSlug: 'haval',
    model: 'Jolion',
    gen: '(2023)',
    trim: '1.5 HEV',
    engine: '1.5L Hybrid',
    trans: 'DHT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 650,
    pmax: 779,
    warranty: '5 năm / 150.000 km',
    econ: '~5,0 L/100km',
    dims: [4472, 1841, 1574, 2700],
    cargo: 430,
    hp: 190,
    torque: 375,
    rel: 3,
    r: { fuelEcon: 5, tech: 4, resale: 2 },
  }),

  // ===== Tank (Trung Quốc – off-road) =====
  mk({
    id: 'tank-300',
    brandSlug: 'tank',
    model: 'Tank 300',
    gen: '(2024)',
    trim: '2.0T HEV',
    engine: '2.0L turbo Hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Hybrid',
    drive: '4WD',
    seats: 5,
    segment: 'SUV off-road',
    pmin: 1190,
    pmax: 1490,
    warranty: '5 năm / 150.000 km',
    econ: '~8,5 L/100km',
    dims: [4760, 1930, 1903, 2750],
    cargo: 400,
    hp: 342,
    torque: 648,
    rel: 3,
    r: { performance: 4, tech: 4, brandRep: 3, fuelEcon: 3, resale: 2 },
  }),
  mk({
    id: 'tank-500',
    brandSlug: 'tank',
    model: 'Tank 500',
    gen: '(2024)',
    trim: '2.0T HEV',
    engine: '2.0L turbo Hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Hybrid',
    drive: '4WD',
    seats: 7,
    segment: 'SUV off-road cỡ lớn',
    pmin: 1690,
    pmax: 1990,
    warranty: '5 năm / 150.000 km',
    econ: '~9,5 L/100km',
    dims: [5078, 1934, 1905, 2850],
    cargo: 795,
    hp: 342,
    torque: 648,
    rel: 3,
    r: { comfort: 4, cargo: 5, family: 4, performance: 4, fuelEcon: 3, resale: 2 },
  }),

  // ===== Ora (Trung Quốc – điện) =====
  mk({
    id: 'ora-good-cat',
    brandSlug: 'ora',
    model: 'Good Cat',
    gen: '(2023)',
    trim: '400 Ultra',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback điện hạng B',
    pmin: 669,
    pmax: 799,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~14 kWh/100km',
    dims: [4235, 1825, 1596, 2650],
    cargo: 228,
    hp: 143,
    torque: 210,
    rel: 3,
    r: { fuelEcon: 5, tech: 4, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'ora-07',
    brandSlug: 'ora',
    model: 'Ora 07',
    gen: '(2024)',
    trim: 'Performance AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan điện hạng D',
    pmin: 1090,
    pmax: 1290,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~16 kWh/100km',
    dims: [4871, 1862, 1500, 2870],
    cargo: 470,
    hp: 408,
    torque: 680,
    rel: 3,
    r: { performance: 5, tech: 4, fuelEcon: 5, resale: 2 },
  }),

  // ===== NIO (Trung Quốc – điện) =====
  mk({
    id: 'nio-et5',
    brandSlug: 'nio',
    model: 'ET5',
    gen: '(2023)',
    trim: '75kWh',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan điện hạng D',
    pmin: 1290,
    pmax: 1590,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~16 kWh/100km',
    dims: [4790, 1960, 1499, 2888],
    cargo: 386,
    hp: 489,
    torque: 700,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'nio-es6',
    brandSlug: 'nio',
    model: 'ES6',
    gen: '(2024)',
    trim: '100kWh',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng D',
    pmin: 1690,
    pmax: 2090,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~19 kWh/100km',
    dims: [4854, 1995, 1703, 2915],
    cargo: 579,
    hp: 490,
    torque: 700,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, cargo: 4, comfort: 4, resale: 2 },
  }),

  // ===== XPeng (Trung Quốc – điện) =====
  mk({
    id: 'xpeng-g6',
    brandSlug: 'xpeng',
    model: 'G6',
    gen: '(2024)',
    trim: 'Performance AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 1090,
    pmax: 1390,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~17 kWh/100km',
    dims: [4753, 1920, 1650, 2890],
    cargo: 571,
    hp: 487,
    torque: 660,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, resale: 2 },
  }),
  mk({
    id: 'xpeng-p7',
    brandSlug: 'xpeng',
    model: 'P7',
    gen: '(2024 FL)',
    trim: 'Performance AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan điện hạng D',
    pmin: 1290,
    pmax: 1590,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~16 kWh/100km',
    dims: [4880, 1896, 1450, 2998],
    cargo: 440,
    hp: 473,
    torque: 655,
    rel: 3,
    r: { performance: 5, tech: 5, fuelEcon: 5, comfort: 4, resale: 2 },
  }),

  // ===== Li Auto (Trung Quốc – EREV) =====
  mk({
    id: 'li-auto-l9',
    brandSlug: 'li-auto',
    model: 'L9',
    gen: '(2024)',
    trim: 'Max EREV',
    engine: '1.5T tăng phạm vi + điện kép',
    trans: '1 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 6,
    segment: 'SUV hạng E 6 chỗ',
    pmin: 1690,
    pmax: 2090,
    warranty: '5 năm / 150.000 km',
    econ: '~7,0 L/100km',
    dims: [5218, 1998, 1800, 3105],
    cargo: 686,
    hp: 449,
    torque: 620,
    rel: 3,
    r: { comfort: 5, tech: 5, family: 5, cargo: 5, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'li-auto-l7',
    brandSlug: 'li-auto',
    model: 'L7',
    gen: '(2024)',
    trim: 'Max EREV',
    engine: '1.5T tăng phạm vi + điện kép',
    trans: '1 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng D',
    pmin: 1390,
    pmax: 1790,
    warranty: '5 năm / 150.000 km',
    econ: '~6,8 L/100km',
    dims: [5050, 1995, 1750, 3005],
    cargo: 525,
    hp: 449,
    torque: 620,
    rel: 3,
    r: { comfort: 5, tech: 5, family: 4, cargo: 4, fuelEcon: 4, resale: 2 },
  }),

  // ===== Hongqi (Trung Quốc – hạng sang) =====
  mk({
    id: 'hongqi-hs5',
    brandSlug: 'hongqi',
    model: 'HS5',
    gen: '(2023)',
    trim: '2.0T Flagship',
    engine: '2.0L turbo',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 1090,
    pmax: 1390,
    warranty: '5 năm / 150.000 km',
    econ: '~8,5 L/100km',
    dims: [4760, 1907, 1700, 2870],
    cargo: 442,
    hp: 252,
    torque: 380,
    rel: 3,
    r: { comfort: 4, tech: 4, brandRep: 3, resale: 2 },
  }),
  mk({
    id: 'hongqi-h9',
    brandSlug: 'hongqi',
    model: 'H9',
    gen: '(2024)',
    trim: '3.0 V6 Flagship',
    engine: '3.0L V6 supercharged',
    trans: 'AT 7 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2090,
    pmax: 2690,
    warranty: '5 năm / 150.000 km',
    econ: '~10 L/100km',
    dims: [5137, 1904, 1493, 3060],
    cargo: 510,
    hp: 280,
    torque: 400,
    rel: 3,
    r: { comfort: 5, tech: 4, brandRep: 3, resale: 2 },
  }),

  // ===== Phase 2: xe điện & thương hiệu mới gia nhập VN =====
  // --- Skoda (Cộng hòa Séc – lắp ráp CKD Quảng Ninh) ---
  mk({
    id: 'skoda-kodiaq',
    brandSlug: 'skoda',
    model: 'Kodiaq',
    gen: 'NU (2024)',
    trim: '2.0 TSI Sportline',
    engine: '2.0L TSI',
    trans: 'DSG 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng C 7 chỗ',
    pmin: 1289,
    pmax: 1589,
    warranty: '5 năm / 100.000 km',
    econ: '~7,8 L/100km',
    dims: [4758, 1864, 1659, 2791],
    cargo: 786,
    hp: 204,
    torque: 320,
    rel: 3,
    r: { comfort: 4, cargo: 5, family: 5, safety: 4, resale: 3 },
  }),
  mk({
    id: 'skoda-karoq',
    brandSlug: 'skoda',
    model: 'Karoq',
    gen: 'NU (2024)',
    trim: '1.4 TSI',
    engine: '1.4L TSI',
    trans: 'DSG 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 999,
    pmax: 1099,
    warranty: '5 năm / 100.000 km',
    econ: '~6,8 L/100km',
    dims: [4390, 1841, 1605, 2638],
    cargo: 521,
    hp: 150,
    torque: 250,
    rel: 3,
    r: { comfort: 4, safety: 4, cargo: 4, resale: 3 },
  }),
  mk({
    id: 'skoda-superb',
    brandSlug: 'skoda',
    model: 'Superb',
    gen: '(2024)',
    trim: '2.0 TSI L&K',
    engine: '2.0L TSI',
    trans: 'DSG 7 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan hạng D',
    pmin: 1500,
    pmax: 1700,
    warranty: '5 năm / 100.000 km',
    econ: '~7,2 L/100km',
    dims: [4912, 1849, 1481, 2841],
    cargo: 645,
    hp: 204,
    torque: 320,
    rel: 3,
    r: { comfort: 5, cargo: 5, safety: 4, resale: 3 },
  }),
  mk({
    id: 'skoda-slavia',
    brandSlug: 'skoda',
    model: 'Slavia',
    gen: '(2024)',
    trim: '1.0 TSI',
    engine: '1.0L TSI',
    trans: 'AT 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng B',
    pmin: 489,
    pmax: 569,
    warranty: '5 năm / 100.000 km',
    econ: '~5,8 L/100km',
    dims: [4541, 1752, 1487, 2651],
    cargo: 521,
    hp: 115,
    torque: 178,
    rel: 3,
    r: { fuelEcon: 4, cargo: 4, safety: 4, resale: 3 },
  }),

  // --- Wuling (Trung Quốc – điện đô thị) ---
  mk({
    id: 'wuling-mini-ev',
    brandSlug: 'wuling',
    model: 'HongGuang MiniEV',
    gen: '(2023)',
    trim: 'LV2',
    engine: 'Mô-tơ điện (sau)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'RWD',
    seats: 4,
    segment: 'Mini xe điện',
    pmin: 197,
    pmax: 282,
    warranty: '3 năm / 120.000 km (pin 8 năm)',
    econ: '~9 kWh/100km',
    dims: [2920, 1493, 1621, 1940],
    cargo: 100,
    hp: 27,
    torque: 85,
    rel: 3,
    r: { fuelEcon: 5, resale: 2, cargo: 1, family: 1, performance: 1 },
  }),
  mk({
    id: 'wuling-bingo',
    brandSlug: 'wuling',
    model: 'Bingo',
    gen: '(2024)',
    trim: '333km',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'Hatchback điện hạng A',
    pmin: 469,
    pmax: 549,
    warranty: '3 năm / 120.000 km (pin 8 năm)',
    econ: '~11 kWh/100km',
    dims: [3950, 1708, 1580, 2560],
    cargo: 230,
    hp: 100,
    torque: 150,
    rel: 3,
    r: { fuelEcon: 5, tech: 3, resale: 2 },
  }),

  // --- Lynk & Co (Trung Quốc – Geely cao cấp) ---
  mk({
    id: 'lynk-co-01',
    brandSlug: 'lynk-co',
    model: '01',
    gen: '(2023)',
    trim: '1.5T PHEV',
    engine: '1.5L turbo PHEV',
    trans: 'DCT 7 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 999,
    pmax: 1199,
    warranty: '5 năm / 150.000 km',
    econ: '~5,5 L/100km',
    dims: [4549, 1860, 1689, 2734],
    cargo: 466,
    hp: 261,
    torque: 425,
    rel: 3,
    r: { comfort: 4, tech: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'lynk-co-05',
    brandSlug: 'lynk-co',
    model: '05',
    gen: '(2023)',
    trim: '2.0T AWD',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Coupe SUV hạng C',
    pmin: 1399,
    pmax: 1599,
    warranty: '5 năm / 150.000 km',
    econ: '~8,0 L/100km',
    dims: [4592, 1879, 1628, 2734],
    cargo: 410,
    hp: 254,
    torque: 350,
    rel: 3,
    r: { performance: 4, tech: 4, comfort: 4, resale: 2 },
  }),
  mk({
    id: 'lynk-co-06',
    brandSlug: 'lynk-co',
    model: '06',
    gen: '(2024)',
    trim: '1.5T',
    engine: '1.5L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng B',
    pmin: 729,
    pmax: 829,
    warranty: '5 năm / 150.000 km',
    econ: '~6,5 L/100km',
    dims: [4385, 1735, 1575, 2640],
    cargo: 427,
    hp: 177,
    torque: 255,
    rel: 3,
    r: { tech: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'lynk-co-09',
    brandSlug: 'lynk-co',
    model: '09',
    gen: '(2024)',
    trim: '2.0T PHEV 7 chỗ',
    engine: '2.0L turbo PHEV',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng E 7 chỗ',
    pmin: 2199,
    pmax: 2499,
    warranty: '5 năm / 150.000 km',
    econ: '~6,5 L/100km',
    dims: [5042, 1977, 1780, 2984],
    cargo: 700,
    hp: 449,
    torque: 645,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, tech: 4, resale: 2 },
  }),

  // --- Aion (GAC – điện) ---
  mk({
    id: 'aion-y-plus',
    brandSlug: 'aion',
    model: 'Y Plus',
    gen: '(2024)',
    trim: '550km',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng B',
    pmin: 699,
    pmax: 799,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~14 kWh/100km',
    dims: [4535, 1870, 1650, 2750],
    cargo: 392,
    hp: 204,
    torque: 225,
    rel: 3,
    r: { fuelEcon: 5, tech: 4, family: 4, resale: 2 },
  }),
  mk({
    id: 'aion-es',
    brandSlug: 'aion',
    model: 'ES',
    gen: '(2024)',
    trim: '500km',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan điện hạng C',
    pmin: 650,
    pmax: 750,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~13 kWh/100km',
    dims: [4810, 1880, 1515, 2750],
    cargo: 450,
    hp: 136,
    torque: 225,
    rel: 3,
    r: { fuelEcon: 5, resale: 2, cargo: 4 },
  }),

  // --- Jaecoo (Chery – SUV) ---
  mk({
    id: 'jaecoo-j7',
    brandSlug: 'jaecoo',
    model: 'J7',
    gen: '(2024)',
    trim: '1.6T Flagship',
    engine: '1.6L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 869,
    pmax: 999,
    warranty: '5 năm / 150.000 km',
    econ: '~7,0 L/100km',
    dims: [4500, 1865, 1680, 2672],
    cargo: 500,
    hp: 184,
    torque: 290,
    rel: 3,
    r: { comfort: 4, tech: 4, cargo: 4, resale: 2 },
  }),
  mk({
    id: 'jaecoo-j7-phev',
    brandSlug: 'jaecoo',
    model: 'J7 PHEV',
    gen: '(2025)',
    trim: 'SHS PHEV',
    engine: '1.5L turbo PHEV',
    trans: 'DHT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 999,
    pmax: 1199,
    warranty: '5 năm / 150.000 km',
    econ: '~5,0 L/100km',
    dims: [4500, 1865, 1680, 2672],
    cargo: 500,
    hp: 347,
    torque: 525,
    rel: 3,
    r: { fuelEcon: 5, tech: 4, comfort: 4, resale: 2 },
  }),

  // --- BYD (bổ sung PHEV & điện) ---
  mk({
    id: 'byd-sealion-6',
    brandSlug: 'byd',
    model: 'Sealion 6',
    gen: '(2025)',
    trim: 'DM-i Premium',
    engine: '1.5L PHEV (DM-i)',
    trans: 'E-CVT',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 839,
    pmax: 919,
    econ: '~4,5 L/100km',
    dims: [4775, 1890, 1670, 2765],
    cargo: 425,
    hp: 218,
    torque: 300,
    rel: 4,
    r: { fuelEcon: 5, tech: 4, comfort: 4, family: 4, resale: 2 },
  }),
  mk({
    id: 'byd-m6',
    brandSlug: 'byd',
    model: 'M6',
    gen: '(2024)',
    trim: 'Tiêu chuẩn 7 chỗ',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 7,
    segment: 'MPV điện hạng C',
    pmin: 756,
    pmax: 866,
    econ: '~15 kWh/100km',
    dims: [4710, 1810, 1690, 2800],
    cargo: 580,
    hp: 163,
    torque: 310,
    rel: 4,
    r: { family: 4, fuelEcon: 5, cargo: 4, resale: 2 },
  }),
  mk({
    id: 'byd-han',
    brandSlug: 'byd',
    model: 'Han',
    gen: '(2024)',
    trim: 'EV AWD',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan điện hạng E',
    pmin: 1399,
    pmax: 1599,
    econ: '~16 kWh/100km',
    dims: [4995, 1910, 1495, 2920],
    cargo: 410,
    hp: 517,
    torque: 700,
    rel: 4,
    r: { performance: 5, comfort: 5, tech: 4, fuelEcon: 5, resale: 2 },
  }),
  mk({
    id: 'byd-tang',
    brandSlug: 'byd',
    model: 'Tang',
    gen: '(2024)',
    trim: 'EV AWD 7 chỗ',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV điện hạng E 7 chỗ',
    pmin: 1799,
    pmax: 1999,
    econ: '~20 kWh/100km',
    dims: [4970, 1955, 1750, 2820],
    cargo: 235,
    hp: 517,
    torque: 700,
    rel: 4,
    r: { performance: 5, family: 5, cargo: 4, comfort: 4, fuelEcon: 4, resale: 2 },
  }),

  // --- MG (bổ sung) ---
  mk({
    id: 'mg-hs',
    brandSlug: 'mg',
    model: 'HS',
    gen: '(2024)',
    trim: '1.5T Luxury',
    engine: '1.5L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng C',
    pmin: 699,
    pmax: 829,
    warranty: '5 năm / 150.000 km',
    econ: '~6,8 L/100km',
    dims: [4670, 1890, 1664, 2765],
    cargo: 507,
    hp: 168,
    torque: 275,
    rel: 3,
    r: { cargo: 4, tech: 4, fuelEcon: 4, resale: 2 },
  }),
  mk({
    id: 'mg-mg7',
    brandSlug: 'mg',
    model: 'MG7',
    gen: '(2024)',
    trim: '2.0T Trophy',
    engine: '2.0L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng D',
    pmin: 738,
    pmax: 880,
    warranty: '5 năm / 150.000 km',
    econ: '~7,2 L/100km',
    dims: [4884, 1889, 1469, 2848],
    cargo: 472,
    hp: 261,
    torque: 405,
    rel: 3,
    r: { performance: 4, tech: 4, comfort: 4, resale: 2 },
  }),

  // --- Geely (bổ sung điện) ---
  mk({
    id: 'geely-ex5',
    brandSlug: 'geely',
    model: 'EX5',
    gen: '(2025)',
    trim: '530km',
    engine: 'Mô-tơ điện (trước)',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV điện hạng C',
    pmin: 799,
    pmax: 899,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~15 kWh/100km',
    dims: [4615, 1901, 1670, 2750],
    cargo: 461,
    hp: 218,
    torque: 320,
    rel: 3,
    r: { fuelEcon: 5, tech: 4, family: 4, resale: 2 },
  }),

  // --- Zeekr (bổ sung MPV) ---
  mk({
    id: 'zeekr-009',
    brandSlug: 'zeekr',
    model: '009',
    gen: '(2025)',
    trim: 'Luxury 4 chỗ',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 4,
    segment: 'MPV điện hạng sang',
    pmin: 2890,
    pmax: 3290,
    warranty: '5 năm / 150.000 km (pin 8 năm)',
    econ: '~22 kWh/100km',
    dims: [5209, 2024, 1856, 3205],
    cargo: 290,
    hp: 544,
    torque: 686,
    rel: 3,
    r: { comfort: 5, tech: 5, family: 5, brandRep: 3, resale: 2 },
  }),

  // ===== Phase 3: bổ sung mẫu hạng sang đang bán tại VN =====
  // --- Mercedes-Benz ---
  mk({
    id: 'mercedes-sclass',
    brandSlug: 'mercedes-benz',
    model: 'S-Class',
    gen: 'W223 (2021)',
    trim: 'S 450 4MATIC',
    engine: '3.0L I6 turbo mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan hạng sang S',
    pmin: 5299,
    pmax: 6699,
    econ: '~8,5 L/100km',
    dims: [5179, 1954, 1503, 3216],
    cargo: 550,
    hp: 367,
    torque: 500,
    rel: 3,
    issues: ['Phí nuôi & phụ tùng rất cao.'],
    r: { comfort: 5, tech: 5, brandRep: 5, resale: 4 },
  }),
  mk({
    id: 'mercedes-glb',
    brandSlug: 'mercedes-benz',
    model: 'GLB',
    gen: 'X247 (2020)',
    trim: 'GLB 200',
    engine: '1.3L turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 7,
    segment: 'SUV hạng sang B 7 chỗ',
    pmin: 1999,
    pmax: 2169,
    econ: '~7,0 L/100km',
    dims: [4634, 1834, 1700, 2829],
    cargo: 565,
    hp: 163,
    torque: 250,
    rel: 3,
    r: { family: 4, tech: 4, brandRep: 5 },
  }),
  mk({
    id: 'mercedes-gle',
    brandSlug: 'mercedes-benz',
    model: 'GLE',
    gen: 'W167 (2023 FL)',
    trim: 'GLE 450 4MATIC',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 4599,
    pmax: 4999,
    econ: '~9,0 L/100km',
    dims: [4924, 1947, 1772, 2995],
    cargo: 630,
    hp: 381,
    torque: 500,
    rel: 3,
    r: { comfort: 5, tech: 5, cargo: 4, brandRep: 5 },
  }),
  mk({
    id: 'mercedes-gls',
    brandSlug: 'mercedes-benz',
    model: 'GLS',
    gen: 'X167 (2024 FL)',
    trim: 'GLS 450 4MATIC',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang F 7 chỗ',
    pmin: 7099,
    pmax: 7599,
    econ: '~10 L/100km',
    dims: [5210, 1956, 1823, 3135],
    cargo: 355,
    hp: 381,
    torque: 500,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, brandRep: 5 },
  }),
  mk({
    id: 'mercedes-gclass',
    brandSlug: 'mercedes-benz',
    model: 'G-Class',
    gen: 'W465 (2024)',
    trim: 'G 450 d',
    engine: '3.0L I6 diesel',
    trans: 'AT 9 cấp',
    fuel: 'Dầu',
    drive: '4WD',
    seats: 5,
    segment: 'SUV off-road hạng sang',
    pmin: 8500,
    pmax: 11500,
    econ: '~10,5 L/100km',
    dims: [4817, 1931, 1969, 2890],
    cargo: 640,
    hp: 367,
    torque: 750,
    rel: 3,
    r: { performance: 5, brandRep: 5, comfort: 4, resale: 5 },
  }),
  mk({
    id: 'mercedes-vclass',
    brandSlug: 'mercedes-benz',
    model: 'V-Class',
    gen: 'W447 (2023 FL)',
    trim: 'V 250',
    engine: '2.0L diesel',
    trans: 'AT 9 cấp',
    fuel: 'Dầu',
    drive: 'RWD',
    seats: 7,
    segment: 'MPV hạng sang',
    pmin: 2879,
    pmax: 3279,
    econ: '~7,5 L/100km',
    dims: [5140, 1928, 1901, 3200],
    cargo: 1030,
    hp: 190,
    torque: 440,
    rel: 3,
    r: { comfort: 5, family: 5, cargo: 5, brandRep: 5 },
  }),
  mk({
    id: 'mercedes-maybach-s',
    brandSlug: 'mercedes-benz',
    model: 'Maybach S 680',
    gen: 'Z223 (2022)',
    trim: '6.0 V12',
    engine: '6.0L V12 twin-turbo',
    trans: 'AT 9 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 4,
    segment: 'Sedan siêu sang',
    pmin: 16000,
    pmax: 19000,
    econ: '~13 L/100km',
    dims: [5469, 1921, 1510, 3396],
    cargo: 550,
    hp: 612,
    torque: 900,
    rel: 3,
    issues: ['Phí nuôi cực cao.'],
    r: { comfort: 5, brandRep: 5, tech: 5, resale: 4 },
  }),

  // --- BMW ---
  mk({
    id: 'bmw-x5',
    brandSlug: 'bmw',
    model: 'X5',
    gen: 'G05 LCI (2023)',
    trim: 'xDrive40i M Sport',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 4099,
    pmax: 4499,
    econ: '~9,0 L/100km',
    dims: [4935, 2004, 1765, 2975],
    cargo: 650,
    hp: 381,
    torque: 540,
    rel: 3,
    r: { comfort: 5, tech: 5, performance: 4, brandRep: 5 },
  }),
  mk({
    id: 'bmw-x7',
    brandSlug: 'bmw',
    model: 'X7',
    gen: 'G07 LCI (2023)',
    trim: 'xDrive40i M Sport',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang F 7 chỗ',
    pmin: 6299,
    pmax: 6799,
    econ: '~9,5 L/100km',
    dims: [5181, 2000, 1835, 3105],
    cargo: 326,
    hp: 381,
    torque: 540,
    rel: 3,
    r: { comfort: 5, cargo: 5, family: 5, brandRep: 5 },
  }),
  mk({
    id: 'bmw-7series',
    brandSlug: 'bmw',
    model: '7 Series',
    gen: 'G70 (2023)',
    trim: '740i M Sport',
    engine: '3.0L I6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang F',
    pmin: 5499,
    pmax: 6199,
    econ: '~8,0 L/100km',
    dims: [5391, 1950, 1544, 3215],
    cargo: 540,
    hp: 381,
    torque: 540,
    rel: 3,
    r: { comfort: 5, tech: 5, brandRep: 5, resale: 4 },
  }),
  mk({
    id: 'bmw-x1',
    brandSlug: 'bmw',
    model: 'X1',
    gen: 'U11 (2023)',
    trim: 'sDrive20i',
    engine: '2.0L turbo',
    trans: 'DCT 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng sang B',
    pmin: 1859,
    pmax: 2059,
    econ: '~7,0 L/100km',
    dims: [4500, 1845, 1642, 2692],
    cargo: 540,
    hp: 204,
    torque: 300,
    rel: 3,
    r: { tech: 4, brandRep: 5, fuelEcon: 4 },
  }),
  mk({
    id: 'bmw-ix',
    brandSlug: 'bmw',
    model: 'iX',
    gen: 'I20 (2023)',
    trim: 'xDrive40',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV điện hạng sang',
    pmin: 3900,
    pmax: 4500,
    econ: '~19 kWh/100km',
    dims: [4953, 1967, 1696, 3000],
    cargo: 500,
    hp: 326,
    torque: 630,
    rel: 3,
    r: { tech: 5, comfort: 5, fuelEcon: 5, brandRep: 5 },
  }),

  // --- Audi ---
  mk({
    id: 'audi-a6',
    brandSlug: 'audi',
    model: 'A6',
    gen: 'C8 (2023 FL)',
    trim: '45 TFSI',
    engine: '2.0L turbo mild hybrid',
    trans: 'S tronic 7 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2700,
    pmax: 3050,
    econ: '~7,0 L/100km',
    dims: [4951, 1886, 1457, 2924],
    cargo: 530,
    hp: 245,
    torque: 370,
    rel: 3,
    r: { comfort: 5, tech: 5, brandRep: 5 },
  }),
  mk({
    id: 'audi-q7',
    brandSlug: 'audi',
    model: 'Q7',
    gen: '4M LCI (2023)',
    trim: '55 TFSI quattro',
    engine: '3.0L V6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang E 7 chỗ',
    pmin: 4000,
    pmax: 4500,
    econ: '~9,0 L/100km',
    dims: [5063, 1970, 1741, 2999],
    cargo: 295,
    hp: 340,
    torque: 500,
    rel: 3,
    r: { comfort: 5, cargo: 4, family: 5, brandRep: 5 },
  }),
  mk({
    id: 'audi-q8',
    brandSlug: 'audi',
    model: 'Q8',
    gen: '4M (2023 FL)',
    trim: '55 TFSI quattro',
    engine: '3.0L V6 mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV coupe hạng sang E',
    pmin: 5000,
    pmax: 5600,
    econ: '~9,5 L/100km',
    dims: [5022, 1995, 1705, 2995],
    cargo: 605,
    hp: 340,
    torque: 500,
    rel: 3,
    r: { comfort: 5, tech: 5, performance: 4, brandRep: 5 },
  }),
  mk({
    id: 'audi-q3',
    brandSlug: 'audi',
    model: 'Q3',
    gen: 'F3 (2023)',
    trim: '35 TFSI',
    engine: '1.4L turbo',
    trans: 'S tronic 6 cấp',
    fuel: 'Xăng',
    drive: 'FWD',
    seats: 5,
    segment: 'SUV hạng sang B',
    pmin: 1650,
    pmax: 1850,
    econ: '~6,8 L/100km',
    dims: [4484, 1849, 1585, 2680],
    cargo: 530,
    hp: 150,
    torque: 250,
    rel: 3,
    r: { tech: 4, brandRep: 5, comfort: 4 },
  }),

  // --- Lexus ---
  mk({
    id: 'lexus-lx',
    brandSlug: 'lexus',
    model: 'LX',
    gen: 'J310 (2022)',
    trim: 'LX 600',
    engine: '3.5L V6 twin-turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng sang F 7 chỗ',
    pmin: 8500,
    pmax: 9500,
    econ: '~11 L/100km',
    dims: [5100, 1990, 1895, 2850],
    cargo: 640,
    hp: 415,
    torque: 650,
    rel: 5,
    r: { reliability: 5, comfort: 5, brandRep: 5, cargo: 4, resale: 5 },
  }),
  mk({
    id: 'lexus-gx',
    brandSlug: 'lexus',
    model: 'GX',
    gen: 'J250 (2024)',
    trim: 'GX 550 Overtrail',
    engine: '3.5L V6 twin-turbo',
    trans: 'AT 10 cấp',
    fuel: 'Xăng',
    drive: '4WD',
    seats: 7,
    segment: 'SUV hạng sang D 7 chỗ',
    pmin: 6000,
    pmax: 6500,
    econ: '~11 L/100km',
    dims: [4950, 1980, 1870, 2850],
    cargo: 550,
    hp: 349,
    torque: 650,
    rel: 5,
    r: { reliability: 5, comfort: 4, performance: 4, resale: 5 },
  }),
  mk({
    id: 'lexus-lm',
    brandSlug: 'lexus',
    model: 'LM',
    gen: '(2024)',
    trim: 'LM 350h',
    engine: '2.5L Hybrid',
    trans: 'e-CVT',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 4,
    segment: 'MPV siêu sang',
    pmin: 6500,
    pmax: 8200,
    econ: '~6,5 L/100km',
    dims: [5125, 1890, 1955, 3000],
    cargo: 470,
    hp: 250,
    torque: 239,
    rel: 5,
    r: { comfort: 5, brandRep: 5, family: 5, tech: 5 },
  }),
  mk({
    id: 'lexus-is',
    brandSlug: 'lexus',
    model: 'IS',
    gen: 'XE30 (2021 FL)',
    trim: 'IS 300',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 2130,
    pmax: 2390,
    econ: '~7,5 L/100km',
    dims: [4710, 1840, 1435, 2800],
    cargo: 450,
    hp: 245,
    torque: 350,
    rel: 5,
    r: { reliability: 5, performance: 4, brandRep: 5, resale: 5 },
  }),

  // --- Volvo ---
  mk({
    id: 'volvo-xc90',
    brandSlug: 'volvo',
    model: 'XC90',
    gen: '(2024 FL)',
    trim: 'B6 Ultimate',
    engine: '2.0L mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'AWD',
    seats: 7,
    segment: 'SUV hạng sang E 7 chỗ',
    pmin: 3999,
    pmax: 4500,
    econ: '~8,5 L/100km',
    dims: [4953, 2008, 1776, 2984],
    cargo: 302,
    hp: 300,
    torque: 420,
    rel: 4,
    r: { safety: 5, comfort: 5, family: 5, cargo: 4 },
  }),
  mk({
    id: 'volvo-s90',
    brandSlug: 'volvo',
    model: 'S90',
    gen: '(2023 FL)',
    trim: 'B5 Inscription',
    engine: '2.0L mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Hybrid',
    drive: 'FWD',
    seats: 5,
    segment: 'Sedan hạng sang E',
    pmin: 2599,
    pmax: 2899,
    econ: '~7,5 L/100km',
    dims: [4969, 1879, 1443, 2941],
    cargo: 500,
    hp: 250,
    torque: 350,
    rel: 4,
    r: { safety: 5, comfort: 5, brandRep: 4 },
  }),
  mk({
    id: 'volvo-c40',
    brandSlug: 'volvo',
    model: 'C40',
    gen: '(2023)',
    trim: 'Recharge Twin',
    engine: 'Mô-tơ điện kép',
    trans: '1 cấp',
    fuel: 'Điện',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV coupe điện hạng sang',
    pmin: 1750,
    pmax: 1950,
    econ: '~18 kWh/100km',
    dims: [4440, 1873, 1591, 2702],
    cargo: 413,
    hp: 408,
    torque: 660,
    rel: 4,
    r: { safety: 5, performance: 4, fuelEcon: 5 },
  }),

  // --- Porsche ---
  mk({
    id: 'porsche-panamera',
    brandSlug: 'porsche',
    model: 'Panamera',
    gen: '(2024)',
    trim: '4',
    engine: '2.9L V6 twin-turbo',
    trans: 'PDK 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 4,
    segment: 'Sedan thể thao hạng sang',
    pmin: 6500,
    pmax: 8500,
    econ: '~9,5 L/100km',
    dims: [5052, 1937, 1423, 2950],
    cargo: 494,
    hp: 353,
    torque: 500,
    rel: 3,
    r: { performance: 5, comfort: 5, tech: 5, brandRep: 5 },
  }),

  // --- Range Rover ---
  mk({
    id: 'range-rover-velar',
    brandSlug: 'range-rover',
    model: 'Velar',
    gen: '(2024 FL)',
    trim: 'P250 Dynamic SE',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 4200,
    pmax: 4800,
    econ: '~9,0 L/100km',
    dims: [4803, 2032, 1685, 2874],
    cargo: 625,
    hp: 250,
    torque: 365,
    rel: 3,
    issues: ['Độ tin cậy điện tử cần lưu ý.'],
    r: { comfort: 5, tech: 4, brandRep: 4, resale: 3 },
  }),

  // --- Genesis (chưa có nhà phân phối chính hãng tại VN) ---
  mk({
    id: 'genesis-g70',
    brandSlug: 'genesis',
    model: 'G70',
    gen: '(2022 FL)',
    trim: '2.0T Sport',
    engine: '2.0L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'RWD',
    seats: 5,
    segment: 'Sedan hạng sang D',
    pmin: 1850,
    pmax: 2150,
    econ: '~8,0 L/100km',
    dims: [4685, 1850, 1400, 2835],
    cargo: 444,
    hp: 245,
    torque: 353,
    rel: 4,
    r: { performance: 4, comfort: 4, tech: 4 },
  }),
  mk({
    id: 'genesis-gv70',
    brandSlug: 'genesis',
    model: 'GV70',
    gen: '(2023)',
    trim: '2.5T AWD',
    engine: '2.5L turbo',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang D',
    pmin: 2400,
    pmax: 2800,
    econ: '~8,5 L/100km',
    dims: [4715, 1910, 1630, 2875],
    cargo: 542,
    hp: 304,
    torque: 422,
    rel: 4,
    r: { comfort: 4, tech: 4, cargo: 4 },
  }),

  // --- Maserati ---
  mk({
    id: 'maserati-levante',
    brandSlug: 'maserati',
    model: 'Levante',
    gen: '(2023)',
    trim: 'GT',
    engine: '2.0L mild hybrid',
    trans: 'AT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'SUV hạng sang E',
    pmin: 6000,
    pmax: 7500,
    econ: '~10 L/100km',
    dims: [5020, 1968, 1693, 3004],
    cargo: 580,
    hp: 330,
    torque: 450,
    rel: 2,
    issues: ['Giữ giá thấp, phí nuôi cao.'],
    r: { performance: 4, brandRep: 4, comfort: 4, resale: 2 },
  }),

  // --- Bentley ---
  mk({
    id: 'bentley-flying-spur',
    brandSlug: 'bentley',
    model: 'Flying Spur',
    gen: '(2023)',
    trim: 'V8',
    engine: '4.0L V8 twin-turbo',
    trans: 'DCT 8 cấp',
    fuel: 'Xăng',
    drive: 'AWD',
    seats: 5,
    segment: 'Sedan siêu sang',
    pmin: 18000,
    pmax: 23000,
    econ: '~12 L/100km',
    dims: [5316, 1978, 1494, 3194],
    cargo: 420,
    hp: 550,
    torque: 770,
    rel: 3,
    r: { comfort: 5, brandRep: 5, performance: 5, resale: 3 },
  }),
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

// =====================================================================================
// Lịch bảo dưỡng CHI TIẾT & dòng thời gian CHI PHÍ SỞ HỮU — suy ra theo TỪNG XE.
// Tất cả số liệu là ƯỚC TÍNH theo chuẩn ngành (estimated=true) khi không có dữ liệu
// chính hãng. Dữ liệu được sinh tự động từ thuộc tính thực của xe (loại nhiên liệu,
// kiểu thân xe, phân khúc giá, điểm giữ giá) nên KHÔNG trùng nhau giữa các xe cùng
// hãng, và dùng lại được cho >1000 mẫu xe mà không cần khai báo tay.
// =====================================================================================

export type MaintPriority = 'Bắt buộc' | 'Khuyến nghị' | 'Tùy chọn';

export interface MaintTask {
  /** Hạng mục bảo dưỡng. */
  name: string;
  /** Chu kỳ thực hiện (km). */
  everyKm: number;
  /** Chi phí phụ tùng/vật tư ước tính (VND). */
  estimatedCost: number;
  /** Chi phí nhân công ước tính (VND). */
  laborCost: number;
  priority: MaintPriority;
  /** true = số liệu ước tính theo chuẩn ngành (không phải hãng công bố). */
  estimated: boolean;
}

export interface MaintStop {
  /** Mốc số km. */
  mileage: number;
  items: MaintTask[];
  /** Tổng chi phí ước tính cho mốc này (phụ tùng + nhân công, VND). */
  totalCost: number;
}

export interface OwnershipCostLine {
  label: string;
  amount: number;
}

export interface OwnershipYear {
  year: number;
  lines: OwnershipCostLine[];
  /** Nhiên liệu / điện trong năm (VND). */
  energy: number;
  /** Bảo dưỡng trong năm (VND). */
  maintenance: number;
  /** Bảo hiểm trong năm (VND). */
  insurance: number;
  /** Khấu hao trong năm (VND). */
  depreciation: number;
  /** Tổng tiền chi ra trong năm (VND). */
  annualTotal: number;
  /** Luỹ kế từ đầu (gồm giá mua + phí + chi phí vận hành) (VND). */
  cumulative: number;
  /** Giá trị xe ước tính cuối năm (VND). */
  carValue: number;
  /** Giá trị bán lại (chỉ năm cuối) (VND). */
  resaleValue?: number;
  note?: string;
}

interface RawMaintTask {
  name: string;
  everyKm: number;
  parts: number;
  labor: number;
  priority: MaintPriority;
}

/** Hệ số chi phí phụ tùng/nhân công theo phân khúc giá (xe sang đắt hơn). */
function maintCostFactor(pmin: number): number {
  if (pmin < 500) return 0.9;
  if (pmin < 900) return 1.0;
  if (pmin < 1800) return 1.35;
  if (pmin < 4000) return 1.9;
  return 2.8;
}

function roundVnd(n: number): number {
  return Math.round(n / 1000) * 1000;
}

/** Lấy số đầu/khoảng giá trị trong chuỗi (vd "4 – 6 triệu" -> 5 triệu). */
function firstNumTs(s: string): number {
  const m = String(s).replace(',', '.').match(/[0-9]+(\.[0-9]+)?/);
  return m ? parseFloat(m[0]) : 0;
}

/** Trung bình của khoảng "x – y triệu" -> VND. */
function midMillion(range: string): number {
  const nums = (range.match(/[0-9]+([.,][0-9]+)?/g) ?? []).map((s) =>
    parseFloat(s.replace(',', '.')),
  );
  if (nums.length === 0) return 0;
  const avg = nums.length >= 2 ? (nums[0] + nums[1]) / 2 : nums[0];
  return avg * 1_000_000;
}

/** Chi phí năng lượng mỗi năm (VND) theo mức tiêu hao thực của xe. */
function energyPerYear(v: Vehicle, kmPerYear = 15000): number {
  const econ = firstNumTs(v.fuelEconomy);
  if (!econ) return 0;
  const unitPrice = v.fuelType === 'Điện' ? 3000 : v.fuelType === 'Dầu' ? 22000 : 24000;
  return roundVnd((econ * kmPerYear) / 100 * unitPrice);
}

/** Chi phí 1 bộ lốp (4 chiếc) theo phân khúc (VND). */
function tireSetCost(pmin: number): number {
  if (pmin < 500) return 4_000_000;
  if (pmin < 900) return 6_000_000;
  if (pmin < 1800) return 10_000_000;
  if (pmin < 4000) return 18_000_000;
  return 28_000_000;
}

/** Bộ hạng mục bảo dưỡng gốc theo loại nhiên liệu & kiểu thân xe. */
function rawMaintTasks(fuel: FuelType, body: string): RawMaintTask[] {
  const out: RawMaintTask[] = [];
  const isEv = fuel === 'Điện';

  if (!isEv) {
    // Động cơ đốt trong (Xăng / Dầu / Hybrid)
    out.push(
      { name: 'Thay dầu động cơ', everyKm: 5000, parts: 380000, labor: 150000, priority: 'Bắt buộc' },
      { name: 'Kiểm tra lốp', everyKm: 5000, parts: 0, labor: 80000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra hệ thống phanh', everyKm: 5000, parts: 0, labor: 100000, priority: 'Khuyến nghị' },
      { name: 'Thay lọc dầu', everyKm: 10000, parts: 180000, labor: 80000, priority: 'Bắt buộc' },
      { name: 'Đảo lốp', everyKm: 10000, parts: 0, labor: 150000, priority: 'Khuyến nghị' },
      { name: 'Thay lọc gió động cơ', everyKm: 20000, parts: 280000, labor: 80000, priority: 'Khuyến nghị' },
      { name: 'Thay lọc gió điều hòa', everyKm: 20000, parts: 300000, labor: 80000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra & bổ sung nước làm mát', everyKm: 20000, parts: 150000, labor: 100000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra ắc quy', everyKm: 20000, parts: 0, labor: 80000, priority: 'Khuyến nghị' },
      { name: 'Thay dầu phanh', everyKm: 40000, parts: 220000, labor: 180000, priority: 'Bắt buộc' },
      { name: 'Thay dầu hộp số', everyKm: 40000, parts: 750000, labor: 350000, priority: 'Khuyến nghị' },
      { name: 'Thay má phanh trước (ước tính)', everyKm: 40000, parts: 950000, labor: 250000, priority: 'Khuyến nghị' },
    );
  }

  if (fuel === 'Xăng') {
    out.push(
      { name: 'Thay bugi', everyKm: 40000, parts: 700000, labor: 200000, priority: 'Bắt buộc' },
      { name: 'Thay lọc nhiên liệu', everyKm: 40000, parts: 400000, labor: 180000, priority: 'Bắt buộc' },
    );
  } else if (fuel === 'Dầu') {
    out.push(
      { name: 'Thay lọc nhiên liệu (diesel)', everyKm: 20000, parts: 650000, labor: 200000, priority: 'Bắt buộc' },
      { name: 'Kiểm tra bộ lọc khí thải (DPF)', everyKm: 40000, parts: 0, labor: 250000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra turbo tăng áp', everyKm: 40000, parts: 0, labor: 250000, priority: 'Khuyến nghị' },
    );
  } else if (fuel === 'Hybrid') {
    out.push(
      { name: 'Kiểm tra pin hybrid', everyKm: 20000, parts: 0, labor: 280000, priority: 'Bắt buộc' },
      { name: 'Kiểm tra phanh tái tạo năng lượng', everyKm: 20000, parts: 0, labor: 180000, priority: 'Khuyến nghị' },
      { name: 'Thay nước làm mát bộ biến tần (inverter)', everyKm: 40000, parts: 350000, labor: 220000, priority: 'Khuyến nghị' },
    );
  } else if (isEv) {
    // Xe điện: KHÔNG thay dầu động cơ
    out.push(
      { name: 'Đảo lốp', everyKm: 10000, parts: 0, labor: 180000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra sức khỏe pin (SoH)', everyKm: 20000, parts: 0, labor: 300000, priority: 'Bắt buộc' },
      { name: 'Thay lọc gió điều hòa (cabin)', everyKm: 20000, parts: 300000, labor: 80000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra hệ thống phanh', everyKm: 20000, parts: 0, labor: 120000, priority: 'Khuyến nghị' },
      { name: 'Thay dầu phanh', everyKm: 40000, parts: 220000, labor: 180000, priority: 'Bắt buộc' },
      { name: 'Kiểm tra hệ thống treo', everyKm: 40000, parts: 0, labor: 180000, priority: 'Khuyến nghị' },
      { name: 'Kiểm tra & bổ sung nước làm mát pin (nếu có)', everyKm: 40000, parts: 180000, labor: 150000, priority: 'Khuyến nghị' },
    );
  }

  if (body === 'Pickup' || body === 'SUV') {
    out.push({
      name: 'Kiểm tra gầm, hệ thống treo & lái',
      everyKm: 20000,
      parts: 0,
      labor: 150000,
      priority: 'Khuyến nghị',
    });
  }

  return out;
}

/** Bộ hạng mục bảo dưỡng của xe (đã quy đổi chi phí theo phân khúc). */
export function getMaintTaskTemplates(v: Vehicle): MaintTask[] {
  const f = maintCostFactor(v.price.min);
  return rawMaintTasks(v.fuelType, v.bodyType).map((t) => ({
    name: t.name,
    everyKm: t.everyKm,
    estimatedCost: roundVnd(t.parts * f),
    laborCost: roundVnd(t.labor * f),
    priority: t.priority,
    estimated: true,
  }));
}

/** Các mốc số km dùng để dựng lịch bảo dưỡng (chuẩn ngành). */
export const MAINT_MILESTONES = [5000, 10000, 20000, 30000, 40000, 60000, 80000, 100000];

/** Lịch bảo dưỡng chi tiết theo mốc km (sinh tự động từ bộ hạng mục của xe). */
export function getMaintenancePlan(v: Vehicle): MaintStop[] {
  const tpls = getMaintTaskTemplates(v);
  const stops: MaintStop[] = [];
  for (const m of MAINT_MILESTONES) {
    const items = tpls.filter((t) => m % t.everyKm === 0);
    if (items.length === 0) continue;
    const totalCost = items.reduce((s, t) => s + t.estimatedCost + t.laborCost, 0);
    stops.push({ mileage: m, items, totalCost });
  }
  return stops;
}

/** Dòng thời gian chi phí sở hữu Năm 0 → Năm 5 (suy ra theo từng xe). */
export function getOwnershipTimeline(v: Vehicle): OwnershipYear[] {
  const price = v.price.min * 1_000_000;
  const isEv = v.fuelType === 'Điện';
  const isHybridOrEv = isEv || v.fuelType === 'Hybrid';
  const reg = isEv ? 0 : roundVnd(price * 0.1);
  const plate = 20_000_000;
  const physIns = (val: number): number => roundVnd(val * 0.015) + 480700;
  const accessories = roundVnd(Math.max(8_000_000, price * 0.02));
  const energy = energyPerYear(v);
  const maintBase = midMillion(v.maintenanceCostPerYear) || roundVnd(price * 0.012);

  const resaleR = v.ratings.resale;
  const firstRetain = 0.8 + (resaleR - 3) * 0.02;
  const laterRetain = 0.9 + (resaleR - 3) * 0.01;

  const years: OwnershipYear[] = [];
  let cumulative = 0;
  let carValue = price;

  for (let y = 0; y <= 5; y++) {
    const lines: OwnershipCostLine[] = [];
    let energyY = 0;
    let maintY = 0;
    let insY = 0;
    let depY = 0;
    let annual = 0;

    if (y === 0) {
      const ins0 = physIns(price);
      lines.push(
        { label: 'Giá xe niêm yết', amount: price },
        { label: isEv ? 'Lệ phí trước bạ (EV 0%)' : 'Lệ phí trước bạ (~10%)', amount: reg },
        { label: 'Phí biển số (khu vực I)', amount: plate },
        { label: 'Bảo hiểm (TNDS + vật chất)', amount: ins0 },
        { label: 'Phụ kiện (tùy chọn)', amount: accessories },
      );
      insY = ins0;
      annual = price + reg + plate + ins0 + accessories;
    } else {
      const prevValue = carValue;
      const retain = y === 1 ? firstRetain : laterRetain;
      carValue = roundVnd(prevValue * retain);
      depY = prevValue - carValue;
      energyY = energy;
      maintY = y === 3 ? roundVnd(maintBase * 1.8) : maintBase;
      insY = physIns(carValue);
      lines.push(
        { label: isEv ? 'Tiền điện' : 'Nhiên liệu', amount: energyY },
        { label: y === 3 ? 'Bảo dưỡng lớn (đại tu)' : 'Bảo dưỡng định kỳ', amount: maintY },
        { label: 'Bảo hiểm vật chất (gia hạn)', amount: insY },
      );
      if (y === 3) {
        const tires = tireSetCost(v.price.min);
        lines.push({ label: 'Thay lốp (ước tính)', amount: tires });
        annual = energyY + maintY + insY + tires;
      } else {
        annual = energyY + maintY + insY;
      }
    }

    cumulative += annual;
    const yr: OwnershipYear = {
      year: y,
      lines,
      energy: energyY,
      maintenance: maintY,
      insurance: insY,
      depreciation: depY,
      annualTotal: annual,
      cumulative,
      carValue,
    };
    if (y === 2 && isHybridOrEv) yr.note = 'Kiểm tra sức khỏe pin định kỳ';
    if (y === 5) {
      yr.resaleValue = carValue;
      yr.note =
        'Giá trị bán lại ước tính · Tổng khấu hao ~' +
        Math.round((price - carValue) / 1_000_000) +
        ' triệu';
    }
    years.push(yr);
  }

  return years;
}

// ===== Khấu hao theo thời gian (ước tính) =====

export interface DepreciationPoint {
  /** Năm sở hữu (1..5). */
  year: number;
  /** % giá trị giữ lại so với giá mua mới. */
  resalePercent: number;
  /** Giá trị xe còn lại (VND). */
  value: number;
  /** Số tiền đã mất so với giá mua mới (VND). */
  dropFromNew: number;
  /** % khấu hao riêng trong năm đó. */
  annualPercent: number;
}

export interface DepreciationFactor {
  label: string;
  positive: boolean;
}

export interface DepreciationProfile {
  /** Luôn true: số liệu suy ra theo thị trường VN, không phải hãng công bố. */
  estimated: true;
  /** Giá mua mới (VND). */
  newPrice: number;
  /** Điểm giữ giá của xe (1..5). */
  resaleRating: number;
  /** % giá trị giữ lại sau 5 năm của xe này. */
  retain5y: number;
  /** % giá trị giữ lại sau 5 năm trung bình của phân khúc. */
  segmentRetain5y: number;
  /** Chênh lệch điểm % giữ giá so với phân khúc (xe − phân khúc). */
  vsSegment: number;
  /** Tỉ lệ khấu hao mỗi năm (0..1), 5 phần tử cho năm 1..5. */
  yearlyRate: number[];
  /** Mốc giá trị theo từng năm (1..5). */
  points: DepreciationPoint[];
  /** Các yếu tố ảnh hưởng giữ giá. */
  factors: DepreciationFactor[];
  /** Các dòng nhận định ngắn. */
  insight: string[];
  /** Tóm tắt 1 câu. */
  verdict: string;
}

/** Tỉ lệ khấu hao mỗi năm (năm 1, rồi các năm sau) suy ra từ điểm giữ giá. */
function depYearlyRates(resale: number, isEv: boolean, massBrand: boolean): number[] {
  let y1 = 0.18 - (resale - 3) * 0.025;
  let yr = 0.1 - (resale - 3) * 0.012;
  if (isEv) {
    y1 += 0.03;
    yr += 0.015;
  }
  if (massBrand) {
    y1 -= 0.01;
    yr -= 0.006;
  }
  y1 = Math.min(0.3, Math.max(0.08, y1));
  yr = Math.min(0.16, Math.max(0.05, yr));
  return [y1, yr, yr, yr, yr];
}

/** % giá trị giữ lại sau 5 năm (0..100) theo công thức khấu hao. */
function depRetain5Pct(resale: number, isEv: boolean, massBrand: boolean): number {
  let f = 1;
  for (const rate of depYearlyRates(resale, isEv, massBrand)) f *= 1 - rate;
  return Math.round(f * 1000) / 10;
}

/**
 * Hồ sơ khấu hao ước tính của xe (Năm 1 → Năm 5).
 * Suy ra từ điểm giữ giá, phân khúc, thương hiệu, độ bền & loại nhiên liệu —
 * KHÔNG bịa số liệu, luôn gắn cờ estimated.
 */
export function getDepreciation(v: Vehicle): DepreciationProfile {
  const newPrice = v.price.min * 1_000_000;
  const resale = v.ratings.resale;
  const isEv = v.fuelType === 'Điện';
  const massBrand = VN_MASS_BRANDS.has(v.brandSlug);
  const rates = depYearlyRates(resale, isEv, massBrand);

  const points: DepreciationPoint[] = [];
  let value = newPrice;
  for (let y = 1; y <= 5; y++) {
    const rate = rates[y - 1];
    value = roundVnd(value * (1 - rate));
    points.push({
      year: y,
      value,
      resalePercent: Math.round((value / newPrice) * 1000) / 10,
      dropFromNew: newPrice - value,
      annualPercent: Math.round(rate * 1000) / 10,
    });
  }
  const retain5y = points[points.length - 1].resalePercent;

  const peers = vehicles.filter((x) => x.segment === v.segment);
  let segSum = 0;
  for (const p of peers) {
    segSum += depRetain5Pct(p.ratings.resale, p.fuelType === 'Điện', VN_MASS_BRANDS.has(p.brandSlug));
  }
  const segmentRetain5y = peers.length ? Math.round((segSum / peers.length) * 10) / 10 : retain5y;
  const vsSegment = Math.round((retain5y - segmentRetain5y) * 10) / 10;

  const factors: DepreciationFactor[] = [];
  if (massBrand) factors.push({ label: 'Thương hiệu phổ biến tại Việt Nam', positive: true });
  if (v.reliability >= 4) factors.push({ label: 'Độ bền & độ tin cậy cao', positive: true });
  if (resale >= 4) factors.push({ label: 'Nhu cầu xe cũ cao', positive: true });
  if (massBrand) factors.push({ label: 'Phụ tùng phổ biến, dễ sửa chữa', positive: true });
  if (isEv) factors.push({ label: 'Xe điện: giá trị pin ảnh hưởng giá bán lại', positive: false });
  if (v.price.min >= 1800) factors.push({ label: 'Phân khúc cao: khấu hao tuyệt đối lớn', positive: false });
  if (resale <= 2) factors.push({ label: 'Thanh khoản xe cũ thấp', positive: false });
  if (factors.length === 0) factors.push({ label: 'Giữ giá ở mức trung bình phân khúc', positive: true });

  let verdict: string;
  if (vsSegment >= 3) verdict = 'Giữ giá tốt hơn trung bình phân khúc.';
  else if (vsSegment <= -3) verdict = 'Khấu hao nhanh hơn trung bình phân khúc.';
  else verdict = 'Mức giữ giá tương đương trung bình phân khúc.';

  const insight: string[] = [
    verdict,
    'Sau 5 năm, giá trị còn khoảng ' +
      retain5y +
      '% (≈ ' +
      Math.round(points[4].value / 1_000_000) +
      ' triệu).',
  ];

  return {
    estimated: true,
    newPrice,
    resaleRating: resale,
    retain5y,
    segmentRetain5y,
    vsSegment,
    yearlyRate: rates,
    points,
    factors,
    insight,
    verdict,
  };
}
