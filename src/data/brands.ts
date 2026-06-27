// ===== Cấu hình hãng xe (mở rộng dễ dàng: chỉ cần thêm 1 phần tử) =====
// Logo hiển thị dạng wordmark có màu thương hiệu (không phụ thuộc ảnh ngoài,
// tránh lỗi tải & vấn đề bản quyền logo). Có thể thay bằng URL ảnh sau này.

export interface Brand {
  /** Slug duy nhất, dùng trong URL/api: 'toyota', 'mercedes-benz'... */
  slug: string;
  name: string;
  country: string;
  /** Màu nhận diện thương hiệu (HEX). */
  color: string;
  /** Logo chữ rút gọn hiển thị trong ô (vd: 'TOYOTA', 'BMW'). */
  wordmark: string;
}

export const brands: Brand[] = [
  { slug: 'toyota', name: 'Toyota', country: 'Nhật Bản', color: '#EB0A1E', wordmark: 'TOYOTA' },
  { slug: 'honda', name: 'Honda', country: 'Nhật Bản', color: '#E60012', wordmark: 'HONDA' },
  {
    slug: 'mitsubishi',
    name: 'Mitsubishi',
    country: 'Nhật Bản',
    color: '#E60012',
    wordmark: 'MITSUBISHI',
  },
  { slug: 'hyundai', name: 'Hyundai', country: 'Hàn Quốc', color: '#002C5F', wordmark: 'HYUNDAI' },
  { slug: 'kia', name: 'Kia', country: 'Hàn Quốc', color: '#05141F', wordmark: 'KIA' },
  { slug: 'mazda', name: 'Mazda', country: 'Nhật Bản', color: '#101010', wordmark: 'MAZDA' },
  { slug: 'nissan', name: 'Nissan', country: 'Nhật Bản', color: '#C3002F', wordmark: 'NISSAN' },
  { slug: 'subaru', name: 'Subaru', country: 'Nhật Bản', color: '#013C74', wordmark: 'SUBARU' },
  { slug: 'suzuki', name: 'Suzuki', country: 'Nhật Bản', color: '#E30613', wordmark: 'SUZUKI' },
  { slug: 'ford', name: 'Ford', country: 'Hoa Kỳ', color: '#003478', wordmark: 'FORD' },
  {
    slug: 'chevrolet',
    name: 'Chevrolet',
    country: 'Hoa Kỳ',
    color: '#C9A24B',
    wordmark: 'CHEVROLET',
  },
  { slug: 'isuzu', name: 'Isuzu', country: 'Nhật Bản', color: '#DA241F', wordmark: 'ISUZU' },
  {
    slug: 'mercedes-benz',
    name: 'Mercedes-Benz',
    country: 'Đức',
    color: '#111111',
    wordmark: 'MERCEDES',
  },
  { slug: 'bmw', name: 'BMW', country: 'Đức', color: '#0066B1', wordmark: 'BMW' },
  { slug: 'audi', name: 'Audi', country: 'Đức', color: '#BB0A30', wordmark: 'AUDI' },
  { slug: 'volvo', name: 'Volvo', country: 'Thụy Điển', color: '#003057', wordmark: 'VOLVO' },
  { slug: 'lexus', name: 'Lexus', country: 'Nhật Bản', color: '#1A1A1A', wordmark: 'LEXUS' },
  { slug: 'mini', name: 'MINI', country: 'Vương quốc Anh', color: '#000000', wordmark: 'MINI' },
  { slug: 'volkswagen', name: 'Volkswagen', country: 'Đức', color: '#001E50', wordmark: 'VW' },
  { slug: 'peugeot', name: 'Peugeot', country: 'Pháp', color: '#00205B', wordmark: 'PEUGEOT' },
  { slug: 'tesla', name: 'Tesla', country: 'Hoa Kỳ', color: '#E82127', wordmark: 'TESLA' },
  { slug: 'byd', name: 'BYD', country: 'Trung Quốc', color: '#1F2A44', wordmark: 'BYD' },
  { slug: 'vinfast', name: 'VinFast', country: 'Việt Nam', color: '#00A0DF', wordmark: 'VINFAST' },

  // --- Nhật Bản (bổ sung) ---
  { slug: 'acura', name: 'Acura', country: 'Nhật Bản', color: '#E82C2A', wordmark: 'ACURA' },
  {
    slug: 'infiniti',
    name: 'Infiniti',
    country: 'Nhật Bản',
    color: '#1A1A1A',
    wordmark: 'INFINITI',
  },
  {
    slug: 'daihatsu',
    name: 'Daihatsu',
    country: 'Nhật Bản',
    color: '#ED1C24',
    wordmark: 'DAIHATSU',
  },

  // --- Hàn Quốc (bổ sung) ---
  { slug: 'genesis', name: 'Genesis', country: 'Hàn Quốc', color: '#1A1A1A', wordmark: 'GENESIS' },

  // --- Đức (bổ sung) ---
  { slug: 'porsche', name: 'Porsche', country: 'Đức', color: '#B12B28', wordmark: 'PORSCHE' },
  { slug: 'opel', name: 'Opel', country: 'Đức', color: '#C9920A', wordmark: 'OPEL' },

  // --- Mỹ (bổ sung) ---
  { slug: 'gmc', name: 'GMC', country: 'Hoa Kỳ', color: '#C8102E', wordmark: 'GMC' },
  { slug: 'cadillac', name: 'Cadillac', country: 'Hoa Kỳ', color: '#941A2C', wordmark: 'CADILLAC' },
  { slug: 'jeep', name: 'Jeep', country: 'Hoa Kỳ', color: '#1F3D2B', wordmark: 'JEEP' },
  { slug: 'ram', name: 'RAM', country: 'Hoa Kỳ', color: '#1A1A1A', wordmark: 'RAM' },
  { slug: 'dodge', name: 'Dodge', country: 'Hoa Kỳ', color: '#B5121B', wordmark: 'DODGE' },
  { slug: 'chrysler', name: 'Chrysler', country: 'Hoa Kỳ', color: '#0A4C84', wordmark: 'CHRYSLER' },
  { slug: 'lincoln', name: 'Lincoln', country: 'Hoa Kỳ', color: '#1A1A1A', wordmark: 'LINCOLN' },

  // --- Anh ---
  {
    slug: 'land-rover',
    name: 'Land Rover',
    country: 'Vương quốc Anh',
    color: '#0A4D2C',
    wordmark: 'LAND ROVER',
  },
  {
    slug: 'range-rover',
    name: 'Range Rover',
    country: 'Vương quốc Anh',
    color: '#1A1A1A',
    wordmark: 'RANGE ROVER',
  },
  {
    slug: 'jaguar',
    name: 'Jaguar',
    country: 'Vương quốc Anh',
    color: '#1A1A1A',
    wordmark: 'JAGUAR',
  },
  {
    slug: 'bentley',
    name: 'Bentley',
    country: 'Vương quốc Anh',
    color: '#00332E',
    wordmark: 'BENTLEY',
  },
  {
    slug: 'rolls-royce',
    name: 'Rolls-Royce',
    country: 'Vương quốc Anh',
    color: '#680021',
    wordmark: 'ROLLS-ROYCE',
  },
  {
    slug: 'aston-martin',
    name: 'Aston Martin',
    country: 'Vương quốc Anh',
    color: '#00594F',
    wordmark: 'ASTON MARTIN',
  },
  { slug: 'lotus', name: 'Lotus', country: 'Vương quốc Anh', color: '#0E5C3A', wordmark: 'LOTUS' },
  {
    slug: 'mclaren',
    name: 'McLaren',
    country: 'Vương quốc Anh',
    color: '#E66A00',
    wordmark: 'MCLAREN',
  },

  // --- Thụy Điển (bổ sung) ---
  {
    slug: 'polestar',
    name: 'Polestar',
    country: 'Thụy Điển',
    color: '#1A1A1A',
    wordmark: 'POLESTAR',
  },

  // --- Ý ---
  { slug: 'ferrari', name: 'Ferrari', country: 'Ý', color: '#D40000', wordmark: 'FERRARI' },
  {
    slug: 'lamborghini',
    name: 'Lamborghini',
    country: 'Ý',
    color: '#A9861B',
    wordmark: 'LAMBORGHINI',
  },
  { slug: 'maserati', name: 'Maserati', country: 'Ý', color: '#003478', wordmark: 'MASERATI' },
  {
    slug: 'alfa-romeo',
    name: 'Alfa Romeo',
    country: 'Ý',
    color: '#8B0000',
    wordmark: 'ALFA ROMEO',
  },
  { slug: 'fiat', name: 'Fiat', country: 'Ý', color: '#9B1B30', wordmark: 'FIAT' },
  { slug: 'pagani', name: 'Pagani', country: 'Ý', color: '#1A1A1A', wordmark: 'PAGANI' },

  // --- Pháp (bổ sung) ---
  { slug: 'renault', name: 'Renault', country: 'Pháp', color: '#C69200', wordmark: 'RENAULT' },
  { slug: 'citroen', name: 'Citroën', country: 'Pháp', color: '#DA291C', wordmark: 'CITROËN' },
  { slug: 'ds', name: 'DS', country: 'Pháp', color: '#7A5C2E', wordmark: 'DS' },
  { slug: 'bugatti', name: 'Bugatti', country: 'Pháp', color: '#BE0000', wordmark: 'BUGATTI' },

  // --- Trung Quốc (bổ sung) ---
  { slug: 'mg', name: 'MG', country: 'Trung Quốc', color: '#CC0000', wordmark: 'MG' },
  { slug: 'geely', name: 'Geely', country: 'Trung Quốc', color: '#2A6EBB', wordmark: 'GEELY' },
  { slug: 'zeekr', name: 'Zeekr', country: 'Trung Quốc', color: '#1A1A1A', wordmark: 'ZEEKR' },
  { slug: 'chery', name: 'Chery', country: 'Trung Quốc', color: '#C8102E', wordmark: 'CHERY' },
  { slug: 'haval', name: 'Haval', country: 'Trung Quốc', color: '#E60012', wordmark: 'HAVAL' },
  { slug: 'tank', name: 'Tank', country: 'Trung Quốc', color: '#1A1A1A', wordmark: 'TANK' },
  { slug: 'ora', name: 'Ora', country: 'Trung Quốc', color: '#1A1A1A', wordmark: 'ORA' },
  { slug: 'nio', name: 'NIO', country: 'Trung Quốc', color: '#00928E', wordmark: 'NIO' },
  { slug: 'xpeng', name: 'XPeng', country: 'Trung Quốc', color: '#1A8F7A', wordmark: 'XPENG' },
  {
    slug: 'li-auto',
    name: 'Li Auto',
    country: 'Trung Quốc',
    color: '#2A6EBB',
    wordmark: 'LI AUTO',
  },
  { slug: 'hongqi', name: 'Hongqi', country: 'Trung Quốc', color: '#C8102E', wordmark: 'HONGQI' },
  { slug: 'wuling', name: 'Wuling', country: 'Trung Quốc', color: '#C8102E', wordmark: 'WULING' },
  {
    slug: 'lynk-co',
    name: 'Lynk & Co',
    country: 'Trung Quốc',
    color: '#1A1A1A',
    wordmark: 'LYNK & CO',
  },
  { slug: 'aion', name: 'Aion (GAC)', country: 'Trung Quốc', color: '#1A6CE0', wordmark: 'AION' },
  { slug: 'jaecoo', name: 'Jaecoo', country: 'Trung Quốc', color: '#0E3A2F', wordmark: 'JAECOO' },

  // --- Cộng hòa Séc ---
  { slug: 'skoda', name: 'Škoda', country: 'Cộng hòa Séc', color: '#0E3A2F', wordmark: 'ŠKODA' },
];

const brandBySlug = new Map(brands.map((b) => [b.slug, b]));

export function getBrand(slug: string): Brand | undefined {
  return brandBySlug.get(slug);
}

/** Mã ISO 3166-1 alpha-2 theo tên nước (dùng để lấy icon cờ). */
const COUNTRY_CODE: Record<string, string> = {
  'Nhật Bản': 'jp',
  'Hàn Quốc': 'kr',
  'Hoa Kỳ': 'us',
  Đức: 'de',
  'Thụy Điển': 'se',
  'Vương quốc Anh': 'gb',
  Pháp: 'fr',
  Ý: 'it',
  'Trung Quốc': 'cn',
  'Cộng hòa Séc': 'cz',
  'Việt Nam': 'vn',
};

export function countryCode(country: string): string {
  return COUNTRY_CODE[country] ?? '';
}

/**
 * Trả về thẻ <img> cờ quốc gia (dùng ảnh flagcdn để hiển thị đúng trên mọi hệ
 * điều hành — Windows không render emoji cờ). Rỗng nếu không xác định nước.
 */
export function countryFlag(country: string): string {
  const code = COUNTRY_CODE[country];
  if (!code) return '';
  const safe = country.replace(/"/g, '&quot;');
  return (
    `<img class="flagicon" src="https://flagcdn.com/${code}.svg" ` +
    `width="20" height="14" loading="lazy" alt="${safe}" title="${safe}">`
  );
}
