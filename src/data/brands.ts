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
  { slug: 'mitsubishi', name: 'Mitsubishi', country: 'Nhật Bản', color: '#E60012', wordmark: 'MITSUBISHI' },
  { slug: 'hyundai', name: 'Hyundai', country: 'Hàn Quốc', color: '#002C5F', wordmark: 'HYUNDAI' },
  { slug: 'kia', name: 'Kia', country: 'Hàn Quốc', color: '#05141F', wordmark: 'KIA' },
  { slug: 'mazda', name: 'Mazda', country: 'Nhật Bản', color: '#101010', wordmark: 'MAZDA' },
  { slug: 'nissan', name: 'Nissan', country: 'Nhật Bản', color: '#C3002F', wordmark: 'NISSAN' },
  { slug: 'subaru', name: 'Subaru', country: 'Nhật Bản', color: '#013C74', wordmark: 'SUBARU' },
  { slug: 'suzuki', name: 'Suzuki', country: 'Nhật Bản', color: '#E30613', wordmark: 'SUZUKI' },
  { slug: 'ford', name: 'Ford', country: 'Mỹ', color: '#003478', wordmark: 'FORD' },
  { slug: 'chevrolet', name: 'Chevrolet', country: 'Mỹ', color: '#C9A24B', wordmark: 'CHEVROLET' },
  { slug: 'isuzu', name: 'Isuzu', country: 'Nhật Bản', color: '#DA241F', wordmark: 'ISUZU' },
  { slug: 'mercedes-benz', name: 'Mercedes-Benz', country: 'Đức', color: '#111111', wordmark: 'MERCEDES' },
  { slug: 'bmw', name: 'BMW', country: 'Đức', color: '#0066B1', wordmark: 'BMW' },
  { slug: 'audi', name: 'Audi', country: 'Đức', color: '#BB0A30', wordmark: 'AUDI' },
  { slug: 'volvo', name: 'Volvo', country: 'Thụy Điển', color: '#003057', wordmark: 'VOLVO' },
  { slug: 'lexus', name: 'Lexus', country: 'Nhật Bản', color: '#1A1A1A', wordmark: 'LEXUS' },
  { slug: 'mini', name: 'MINI', country: 'Anh', color: '#000000', wordmark: 'MINI' },
  { slug: 'volkswagen', name: 'Volkswagen', country: 'Đức', color: '#001E50', wordmark: 'VW' },
  { slug: 'peugeot', name: 'Peugeot', country: 'Pháp', color: '#00205B', wordmark: 'PEUGEOT' },
  { slug: 'tesla', name: 'Tesla', country: 'Mỹ', color: '#E82127', wordmark: 'TESLA' },
  { slug: 'byd', name: 'BYD', country: 'Trung Quốc', color: '#1F2A44', wordmark: 'BYD' },
  { slug: 'vinfast', name: 'VinFast', country: 'Việt Nam', color: '#00A0DF', wordmark: 'VINFAST' },
];

const brandBySlug = new Map(brands.map((b) => [b.slug, b]));

export function getBrand(slug: string): Brand | undefined {
  return brandBySlug.get(slug);
}
