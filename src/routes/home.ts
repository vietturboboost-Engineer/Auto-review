import { Router, type Request, type Response } from 'express';

export const homeRouter = Router();

interface Car {
  name: string;
  type: string;
  price: string;
  color: string;
  image: string;
  // Model 3D (.glb/.gltf) riêng cho xe. Bỏ trống -> dùng CAR_MODEL mặc định.
  model?: string;
}

// Model 3D xe (kéo xoay / zoom được) — dùng chung cho mọi xe.
// Muốn xe nào có model chính chủ, thêm `model: 'https://.../xe.glb'` vào xe đó.
const CAR_MODEL =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/ToyCar/glTF-Binary/ToyCar.glb';

// Ảnh thật lấy từ Wikimedia Commons (URL CDN ổn định). Nếu ảnh lỗi sẽ tự rơi về SVG minh hoạ.
// Giá tham khảo thị trường Việt Nam (có thể thay đổi theo thời điểm & đại lý).
const toyotaCars: Car[] = [
  {
    name: 'Toyota Wigo',
    type: 'Hatchback đô thị',
    price: '360 – 405 triệu',
    color: '#ef476f',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2014_Daihatsu_Ayla_1.0_X_B100RS_%2820190615%29.jpg/330px-2014_Daihatsu_Ayla_1.0_X_B100RS_%2820190615%29.jpg',
  },
  {
    name: 'Toyota Vios',
    type: 'Sedan hạng B',
    price: '458 – 545 triệu',
    color: '#118ab2',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg/330px-Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg',
  },
  {
    name: 'Toyota Veloz Cross',
    type: 'MPV 7 chỗ',
    price: '658 – 698 triệu',
    color: '#06d6a0',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2022_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_W101RE_%2820220403%29.jpg/330px-2022_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_W101RE_%2820220403%29.jpg',
  },
  {
    name: 'Toyota Yaris Cross',
    type: 'SUV đô thị',
    price: '730 – 838 triệu',
    color: '#ffd166',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg/330px-Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg',
  },
  {
    name: 'Toyota Corolla Cross',
    type: 'SUV hạng C',
    price: '820 – 935 triệu',
    color: '#8338ec',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg',
  },
  {
    name: 'Toyota Innova Cross',
    type: 'MPV cao cấp',
    price: '810 triệu – 1,0 tỷ',
    color: '#fb5607',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg/330px-Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg',
  },
  {
    name: 'Toyota Camry',
    type: 'Sedan hạng D',
    price: '1,105 – 1,495 tỷ',
    color: '#3a86ff',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg',
  },
  {
    name: 'Toyota Fortuner',
    type: 'SUV 7 chỗ',
    price: '1,055 – 1,470 tỷ',
    color: '#2a9d8f',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg',
  },
  {
    name: 'Toyota Land Cruiser',
    type: 'SUV hạng sang',
    price: '4,030 – 4,600 tỷ',
    color: '#e09f3e',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png',
  },
];

// Thông số kỹ thuật + ưu/nhược điểm (tham khảo, có thể thay đổi theo phiên bản).
interface Spec {
  engine: string;
  power: string;
  gearbox: string;
  seats: string;
  drive: string;
  fuel: string;
  pros: string[];
  cons: string[];
}

const carSpecs: Record<string, Spec> = {
  'Toyota Wigo': {
    engine: '1.2L xăng 3NR-VE',
    power: '87 mã lực / 113 Nm',
    gearbox: 'CVT hoặc số sàn 5 cấp',
    seats: '5 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~5.0 L/100km',
    pros: ['Giá rẻ nhất phân khúc', 'Tiết kiệm nhiên liệu', 'Nhỏ gọn, dễ đi phố & đỗ xe', 'Chi phí bảo dưỡng thấp'],
    cons: ['Cách âm kém', 'Tăng tốc yếu khi đầy tải', 'Nội thất đơn giản', 'Trang bị an toàn cơ bản'],
  },
  'Toyota Vios': {
    engine: '1.5L xăng 2NR-VE',
    power: '107 mã lực / 140 Nm',
    gearbox: 'CVT hoặc số sàn 5 cấp',
    seats: '5 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~5.5 L/100km',
    pros: ['Bền bỉ, ít hỏng vặt', 'Tiết kiệm & giữ giá tốt', 'Khoang nội thất rộng', 'Dễ sửa, phụ tùng rẻ'],
    cons: ['Cách âm tầm trung', 'Vô-lăng nhẹ, thiếu cảm giác lái', 'Thiết kế an toàn', 'Hệ thống giải trí cơ bản'],
  },
  'Toyota Veloz Cross': {
    engine: '1.5L xăng',
    power: '105 mã lực / 138 Nm',
    gearbox: 'CVT',
    seats: '7 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~6.0 L/100km',
    pros: ['7 chỗ giá hợp lý', 'Trang bị Toyota Safety Sense', 'Tiết kiệm nhiên liệu', 'Gầm cao, thiết kế trẻ trung'],
    cons: ['Động cơ hơi yếu khi đầy 7 người', 'Cách âm chưa tốt', 'Không có bản máy dầu', 'Vật liệu nội thất bình dân'],
  },
  'Toyota Yaris Cross': {
    engine: '1.5L xăng / Hybrid',
    power: '90 – 116 mã lực',
    gearbox: 'CVT / e-CVT (hybrid)',
    seats: '5 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~4.0 – 5.5 L/100km',
    pros: ['Có bản hybrid rất tiết kiệm', 'Gầm cao, dáng SUV trẻ', 'Nhiều công nghệ an toàn', 'Dễ lái trong phố'],
    cons: ['Giá cao trong phân khúc', 'Khoang hành lý & ghế sau hẹp', 'Cách âm tầm trung', 'Bản xăng tăng tốc thường'],
  },
  'Toyota Corolla Cross': {
    engine: '1.8L xăng / Hybrid',
    power: '122 – 140 mã lực',
    gearbox: 'CVT / e-CVT (hybrid)',
    seats: '5 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~5.0 – 6.5 L/100km',
    pros: ['Rộng rãi, gầm cao', 'Bản hybrid tiết kiệm', 'An toàn TSS đầy đủ', 'Vận hành êm ái'],
    cons: ['Giá cao', 'Một số chi tiết nhựa cứng', 'Cách âm gầm chưa tốt', 'Bản xăng hơi ồn khi tăng tốc'],
  },
  'Toyota Innova Cross': {
    engine: '2.0L xăng / Hybrid',
    power: '172 – 186 mã lực (hệ hybrid)',
    gearbox: 'CVT / e-CVT (hybrid)',
    seats: '7 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~5.5 – 7.0 L/100km',
    pros: ['7 chỗ rộng rãi', 'Bản hybrid mạnh & tiết kiệm', 'Nhiều trang bị cao cấp', 'Gầm cao thực dụng'],
    cons: ['Giá cao hơn thế hệ cũ', 'Chuyển sang dẫn động cầu trước', 'Thân xe lớn, khó đỗ', 'Bản hybrid giá khá cao'],
  },
  'Toyota Camry': {
    engine: '2.0L / 2.5L / 2.5L Hybrid',
    power: '167 – 203 mã lực',
    gearbox: 'AT 6–8 cấp / e-CVT',
    seats: '5 chỗ',
    drive: 'Cầu trước (FWD)',
    fuel: '~6.5 – 7.5 L/100km (hybrid ~4.5)',
    pros: ['Sang trọng, êm ái', 'Cách âm tốt', 'Bản hybrid tiết kiệm', 'Trang bị an toàn cao'],
    cons: ['Giá cao', 'Gầm thấp', 'Thiên về thoải mái hơn thể thao', 'Chi phí bảo dưỡng cao hơn xe phổ thông'],
  },
  'Toyota Fortuner': {
    engine: '2.7L xăng / 2.4L–2.8L dầu',
    power: '150 – 204 mã lực',
    gearbox: 'AT 6 cấp / số sàn',
    seats: '7 chỗ',
    drive: 'Cầu sau (RWD) / 2 cầu (4WD)',
    fuel: '~7.5 – 9.0 L/100km',
    pros: ['Bền bỉ, gầm cao off-road tốt', '7 chỗ rộng rãi', 'Giữ giá tốt', 'Bản máy dầu khỏe, kéo tải tốt'],
    cons: ['Cách âm tầm trung', 'Vô-lăng nặng ở tốc độ thấp', 'Tiêu hao nhiên liệu cao', 'Lái không êm như xe gầm thấp'],
  },
  'Toyota Land Cruiser': {
    engine: '3.3L V6 dầu / 3.5L V6 xăng twin-turbo',
    power: '305 – 415 mã lực',
    gearbox: 'AT 10 cấp',
    seats: '7 chỗ',
    drive: '2 cầu toàn thời gian (4WD)',
    fuel: '~9.0 – 12.0 L/100km',
    pros: ['Off-road đỉnh cao', 'Bền bỉ huyền thoại', 'Giữ giá cực tốt', 'Mạnh mẽ & sang trọng'],
    cons: ['Giá rất cao', 'Tiêu hao nhiên liệu lớn', 'Thân xe to, khó đỗ phố', 'Phí nuôi xe cao'],
  },
};

// ===== Bảo dưỡng & phụ tùng (lịch chung Toyota, tham khảo) =====
// Giá theo VND, chỉ mang tính tham khảo — khác nhau theo đại lý/khu vực/đời xe & động cơ.
interface Milestone {
  km: number;
  kmLabel: string;
  items: string[];
  parts: string[];
  labor: string;
  partsPrice: string;
  total: string;
  costMin: number; // dùng để sắp xếp theo chi phí
  time: string;
  priority: 'Bắt buộc' | 'Khuyến nghị' | 'Tùy chọn';
  notes: string;
}

const maintenance: Milestone[] = [
  {
    km: 5000,
    kmLabel: '5.000 km',
    items: ['Thay dầu động cơ', 'Đảo lốp', 'Kiểm tra phanh, lốp, gạt mưa', 'Bổ sung nước làm mát/rửa kính'],
    parts: ['Dầu động cơ', 'Lọc dầu (tuỳ nơi)'],
    labor: '150.000 – 300.000đ',
    partsPrice: '400.000 – 900.000đ',
    total: '550.000 – 1.200.000đ',
    costMin: 550000,
    time: '45 – 60 phút',
    priority: 'Bắt buộc',
    notes: 'Mốc quan trọng nhất — đừng bỏ lỡ thay dầu định kỳ.',
  },
  {
    km: 10000,
    kmLabel: '10.000 km',
    items: ['Thay dầu + lọc dầu', 'Đảo lốp', 'Kiểm tra hệ thống phanh', 'Kiểm tra gầm & treo'],
    parts: ['Dầu động cơ', 'Lọc dầu'],
    labor: '200.000 – 350.000đ',
    partsPrice: '500.000 – 1.000.000đ',
    total: '700.000 – 1.350.000đ',
    costMin: 700000,
    time: '60 phút',
    priority: 'Bắt buộc',
    notes: 'Thay lọc dầu cùng dầu máy để bảo vệ động cơ.',
  },
  {
    km: 20000,
    kmLabel: '20.000 km',
    items: ['Thay dầu + lọc dầu', 'Thay/vệ sinh lọc gió động cơ', 'Thay lọc gió điều hòa', 'Kiểm tra phanh'],
    parts: ['Dầu', 'Lọc dầu', 'Lọc gió động cơ', 'Lọc gió điều hòa'],
    labor: '250.000 – 450.000đ',
    partsPrice: '800.000 – 1.600.000đ',
    total: '1.050.000 – 2.050.000đ',
    costMin: 1050000,
    time: '75 – 90 phút',
    priority: 'Bắt buộc',
    notes: 'Đi nhiều bụi nên thay lọc gió sớm hơn.',
  },
  {
    km: 30000,
    kmLabel: '30.000 km',
    items: ['Vệ sinh kim phun, họng ga, buồng đốt', 'Kiểm tra hệ thống treo & lái'],
    parts: ['Dung dịch vệ sinh (không bắt buộc thay phụ tùng)'],
    labor: '300.000 – 600.000đ',
    partsPrice: '200.000 – 500.000đ',
    total: '500.000 – 1.100.000đ',
    costMin: 500000,
    time: '60 – 90 phút',
    priority: 'Tùy chọn',
    notes: 'Giúp máy bốc & tiết kiệm xăng nếu chạy nhiều trong phố.',
  },
  {
    km: 40000,
    kmLabel: '40.000 km',
    items: ['Thay dầu + lọc dầu', 'Thay dầu phanh', 'Thay lọc nhiên liệu (nếu có)', 'Kiểm tra/đổi bugi thường', 'Vệ sinh kim phun'],
    parts: ['Dầu', 'Lọc dầu', 'Lọc gió', 'Dầu phanh', 'Bugi (loại thường)'],
    labor: '600.000 – 1.200.000đ',
    partsPrice: '1.500.000 – 3.500.000đ',
    total: '2.100.000 – 4.700.000đ',
    costMin: 2100000,
    time: '2 – 3 giờ',
    priority: 'Bắt buộc',
    notes: 'Bảo dưỡng lớn — nên làm tại xưởng uy tín/đại lý.',
  },
  {
    km: 80000,
    kmLabel: '80.000 km',
    items: ['Thay nước làm mát', 'Kiểm tra/thay dây curoa', 'Thay dầu hộp số', 'Kiểm tra hệ thống treo'],
    parts: ['Nước làm mát', 'Dầu hộp số', 'Dây curoa'],
    labor: '800.000 – 1.800.000đ',
    partsPrice: '2.000.000 – 5.000.000đ',
    total: '2.800.000 – 6.800.000đ',
    costMin: 2800000,
    time: '3 – 4 giờ',
    priority: 'Khuyến nghị',
    notes: 'Xe máy dầu/SUV lớn chi phí cao hơn.',
  },
  {
    km: 100000,
    kmLabel: '100.000 km',
    items: ['Thay bugi Iridium', 'Thay nước làm mát', 'Thay dầu hộp số', 'Kiểm tra bơm nước, ắc quy, má phanh, dây đai'],
    parts: ['Bugi Iridium', 'Ắc quy', 'Má phanh', 'Nước làm mát', 'Dầu hộp số'],
    labor: '1.000.000 – 2.500.000đ',
    partsPrice: '3.000.000 – 8.000.000đ',
    total: '4.000.000 – 10.500.000đ',
    costMin: 4000000,
    time: '4 – 5 giờ',
    priority: 'Khuyến nghị',
    notes: 'Mốc đại tu nhỏ — thay nhiều chi tiết hao mòn cùng lúc tiết kiệm công.',
  },
];

interface PartRow {
  name: string;
  oem: string;
  dealer: string;
  after: string;
  life: string;
  symptom: string;
  interval: string;
  category: string;
}

const wearParts: PartRow[] = [
  {
    name: 'Dầu động cơ (Toyota Genuine 0W-20/5W-30)',
    oem: '08880-83xxx',
    dealer: '180.000 – 300.000đ/lít',
    after: '120.000 – 250.000đ/lít',
    life: '5.000 – 10.000 km',
    symptom: 'Dầu đen đặc, tiếng máy to, đèn báo dầu',
    interval: '5.000 – 10.000 km',
    category: 'Dầu nhớt',
  },
  {
    name: 'Lọc dầu',
    oem: '90915-YZZE1 / 04152-YZZA1',
    dealer: '120.000 – 250.000đ',
    after: '60.000 – 150.000đ',
    life: '10.000 km',
    symptom: 'Thay cùng dầu máy',
    interval: 'Mỗi 10.000 km',
    category: 'Lọc',
  },
  {
    name: 'Lọc gió động cơ',
    oem: '17801-xxxxx',
    dealer: '200.000 – 400.000đ',
    after: '100.000 – 250.000đ',
    life: '20.000 – 40.000 km',
    symptom: 'Hao xăng, máy yếu, tăng tốc kém',
    interval: 'Vệ sinh 20.000 km / thay 40.000 km',
    category: 'Lọc',
  },
  {
    name: 'Lọc gió điều hòa',
    oem: '87139-xxxxx',
    dealer: '150.000 – 350.000đ',
    after: '80.000 – 200.000đ',
    life: '10.000 – 20.000 km',
    symptom: 'Gió yếu, có mùi hôi trong cabin',
    interval: '10.000 – 20.000 km',
    category: 'Lọc',
  },
  {
    name: 'Bugi Iridium',
    oem: '90919-xxxxx (DENSO/NGK)',
    dealer: '250.000 – 500.000đ/cái',
    after: '150.000 – 350.000đ/cái',
    life: '100.000 km (bugi thường ~40.000 km)',
    symptom: 'Máy rung, khó nổ, hao xăng',
    interval: '100.000 km',
    category: 'Đánh lửa',
  },
  {
    name: 'Má phanh trước',
    oem: '04465-xxxxx',
    dealer: '800.000 – 1.800.000đ/bộ',
    after: '400.000 – 1.000.000đ/bộ',
    life: '30.000 – 50.000 km',
    symptom: 'Kêu rít khi phanh, phanh ăn kém',
    interval: '30.000 – 50.000 km',
    category: 'Phanh',
  },
  {
    name: 'Dầu phanh (DOT 3/4)',
    oem: '08823-xxxxx',
    dealer: '150.000 – 300.000đ',
    after: '80.000 – 200.000đ',
    life: '2 năm / 40.000 km',
    symptom: 'Chân phanh mềm/nặng bất thường',
    interval: '40.000 km hoặc 2 năm',
    category: 'Phanh',
  },
  {
    name: 'Nước làm mát (Toyota SLLC)',
    oem: '08889-80xxx',
    dealer: '200.000 – 400.000đ',
    after: '120.000 – 250.000đ',
    life: '80.000 – 100.000 km',
    symptom: 'Nhiệt độ máy cao, hao nước',
    interval: '80.000 – 100.000 km',
    category: 'Làm mát',
  },
  {
    name: 'Ắc quy',
    oem: '28800-xxxxx',
    dealer: '1.500.000 – 3.500.000đ',
    after: '1.000.000 – 2.500.000đ',
    life: '3 – 5 năm',
    symptom: 'Đề yếu, đèn mờ, khó khởi động',
    interval: '3 – 5 năm',
    category: 'Điện',
  },
  {
    name: 'Lốp xe',
    oem: 'Theo hãng lốp (Michelin/Bridgestone…)',
    dealer: '1.500.000 – 4.000.000đ/lốp',
    after: '—',
    life: '50.000 – 60.000 km hoặc 5 năm',
    symptom: 'Mòn gai, nứt cao su, rung lái',
    interval: '50.000 km / 5 năm',
    category: 'Lốp',
  },
];

// ===== Danh mục phụ tùng đầy đủ (tham khảo) =====
// Giá VND tham khảo; mã OEM dạng tham khảo (đuôi xxxxx đổi theo đời/động cơ — xác nhận theo VIN).
interface CatalogPart {
  name: string;
  oem: string;
  dealer: string;
  after: string;
  group: string;
}

const partsCatalog: CatalogPart[] = [
  // --- Động cơ ---
  { name: 'Bơm dầu', oem: '15100-xxxxx', dealer: '1.800.000 – 3.500.000đ', after: '900.000 – 2.000.000đ', group: 'Động cơ' },
  { name: 'Bơm nước (water pump)', oem: '16100-xxxxx', dealer: '1.200.000 – 2.800.000đ', after: '600.000 – 1.500.000đ', group: 'Động cơ' },
  { name: 'Van hằng nhiệt', oem: '90916-xxxxx', dealer: '350.000 – 800.000đ', after: '180.000 – 450.000đ', group: 'Động cơ' },
  { name: 'Dây curoa tổng', oem: '90916-02xxx', dealer: '400.000 – 1.200.000đ', after: '200.000 – 700.000đ', group: 'Động cơ' },
  { name: 'Bộ căng curoa', oem: '16620-xxxxx', dealer: '900.000 – 2.200.000đ', after: '450.000 – 1.300.000đ', group: 'Động cơ' },
  { name: 'Xích cam (timing chain)', oem: '13506-xxxxx', dealer: '1.500.000 – 3.800.000đ', after: '800.000 – 2.200.000đ', group: 'Động cơ' },
  { name: 'Gioăng nắp máy', oem: '11115-xxxxx', dealer: '700.000 – 2.000.000đ', after: '350.000 – 1.200.000đ', group: 'Động cơ' },
  { name: 'Chân máy (engine mount)', oem: '12361-xxxxx', dealer: '900.000 – 2.500.000đ', after: '400.000 – 1.400.000đ', group: 'Động cơ' },
  { name: 'Van PCV', oem: '12204-xxxxx', dealer: '250.000 – 600.000đ', after: '120.000 – 350.000đ', group: 'Động cơ' },
  { name: 'Cuộn đánh lửa (ignition coil)', oem: '90919-02xxx', dealer: '700.000 – 1.600.000đ/cái', after: '350.000 – 900.000đ/cái', group: 'Động cơ' },
  { name: 'Bugi sấy (xe máy dầu)', oem: '19850-xxxxx', dealer: '400.000 – 900.000đ/cái', after: '200.000 – 550.000đ/cái', group: 'Động cơ' },
  // --- Nhiên liệu & Khí thải ---
  { name: 'Bơm xăng', oem: '23220-xxxxx', dealer: '2.000.000 – 5.000.000đ', after: '1.000.000 – 3.000.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Kim phun nhiên liệu', oem: '23250-xxxxx', dealer: '1.500.000 – 4.000.000đ/cái', after: '700.000 – 2.200.000đ/cái', group: 'Nhiên liệu & Khí thải' },
  { name: 'Lọc xăng', oem: '23300-xxxxx', dealer: '400.000 – 1.200.000đ', after: '200.000 – 700.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Họng ga điện tử (throttle body)', oem: '22030-xxxxx', dealer: '3.000.000 – 7.000.000đ', after: '1.500.000 – 4.000.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Cảm biến oxy', oem: '89465-xxxxx', dealer: '1.500.000 – 3.500.000đ', after: '700.000 – 2.000.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Cảm biến lưu lượng khí (MAF)', oem: '22204-xxxxx', dealer: '1.800.000 – 4.000.000đ', after: '900.000 – 2.500.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Bầu lọc khí thải (catalytic)', oem: '25051-xxxxx', dealer: '6.000.000 – 18.000.000đ', after: '3.000.000 – 10.000.000đ', group: 'Nhiên liệu & Khí thải' },
  { name: 'Ống xả / bô giảm thanh', oem: '17430-xxxxx', dealer: '2.000.000 – 6.000.000đ', after: '1.000.000 – 3.500.000đ', group: 'Nhiên liệu & Khí thải' },
  // --- Hệ truyền động ---
  { name: 'Bộ ly hợp (clutch kit)', oem: '31250-xxxxx', dealer: '3.500.000 – 8.000.000đ', after: '1.800.000 – 5.000.000đ', group: 'Hệ truyền động' },
  { name: 'Lọc dầu hộp số tự động', oem: '35330-xxxxx', dealer: '600.000 – 1.500.000đ', after: '300.000 – 900.000đ', group: 'Hệ truyền động' },
  { name: 'Trục láp / khớp CV', oem: '43410-xxxxx', dealer: '2.500.000 – 6.000.000đ', after: '1.200.000 – 3.500.000đ', group: 'Hệ truyền động' },
  { name: 'Cao su chân hộp số', oem: '12371-xxxxx', dealer: '700.000 – 1.800.000đ', after: '350.000 – 1.000.000đ', group: 'Hệ truyền động' },
  { name: 'Dầu hộp số CVT/AT (ATF/CVTF)', oem: '08886-xxxxx', dealer: '300.000 – 600.000đ/lít', after: '180.000 – 400.000đ/lít', group: 'Hệ truyền động' },
  // --- Phanh ---
  { name: 'Đĩa phanh trước', oem: '43512-xxxxx', dealer: '1.500.000 – 3.500.000đ', after: '700.000 – 2.000.000đ', group: 'Phanh' },
  { name: 'Đĩa phanh sau', oem: '42431-xxxxx', dealer: '1.400.000 – 3.200.000đ', after: '700.000 – 1.900.000đ', group: 'Phanh' },
  { name: 'Má phanh sau', oem: '04466-xxxxx', dealer: '700.000 – 1.600.000đ', after: '350.000 – 950.000đ', group: 'Phanh' },
  { name: 'Cùm phanh (caliper)', oem: '47730-xxxxx', dealer: '2.500.000 – 6.000.000đ', after: '1.200.000 – 3.500.000đ', group: 'Phanh' },
  { name: 'Xi lanh phanh tổng', oem: '47201-xxxxx', dealer: '2.000.000 – 4.500.000đ', after: '1.000.000 – 2.800.000đ', group: 'Phanh' },
  { name: 'Dây phanh tay', oem: '46410-xxxxx', dealer: '400.000 – 900.000đ', after: '200.000 – 550.000đ', group: 'Phanh' },
  // --- Treo & Lái ---
  { name: 'Giảm xóc trước', oem: '48510-xxxxx', dealer: '1.800.000 – 4.500.000đ/cái', after: '900.000 – 2.500.000đ/cái', group: 'Treo & Lái' },
  { name: 'Giảm xóc sau', oem: '48530-xxxxx', dealer: '1.600.000 – 4.000.000đ/cái', after: '800.000 – 2.200.000đ/cái', group: 'Treo & Lái' },
  { name: 'Bát bèo giảm xóc', oem: '48609-xxxxx', dealer: '600.000 – 1.500.000đ', after: '300.000 – 900.000đ', group: 'Treo & Lái' },
  { name: 'Rotuyn trụ đứng (ball joint)', oem: '43330-xxxxx', dealer: '500.000 – 1.300.000đ', after: '250.000 – 800.000đ', group: 'Treo & Lái' },
  { name: 'Rotuyn lái ngoài', oem: '45046-xxxxx', dealer: '400.000 – 1.000.000đ', after: '200.000 – 600.000đ', group: 'Treo & Lái' },
  { name: 'Rotuyn cân bằng', oem: '48820-xxxxx', dealer: '350.000 – 900.000đ', after: '180.000 – 500.000đ', group: 'Treo & Lái' },
  { name: 'Càng A (control arm)', oem: '48068-xxxxx', dealer: '1.500.000 – 3.500.000đ', after: '700.000 – 2.000.000đ', group: 'Treo & Lái' },
  { name: 'Thước lái', oem: '44250-xxxxx', dealer: '5.000.000 – 12.000.000đ', after: '2.500.000 – 7.000.000đ', group: 'Treo & Lái' },
  { name: 'Bơm trợ lực lái', oem: '44310-xxxxx', dealer: '3.000.000 – 7.000.000đ', after: '1.500.000 – 4.000.000đ', group: 'Treo & Lái' },
  { name: 'Bạc đạn bánh xe (wheel bearing)', oem: '90369-xxxxx', dealer: '700.000 – 2.000.000đ', after: '350.000 – 1.200.000đ', group: 'Treo & Lái' },
  // --- Điện & Ắc quy ---
  { name: 'Máy phát điện (alternator)', oem: '27060-xxxxx', dealer: '3.500.000 – 8.000.000đ', after: '1.800.000 – 5.000.000đ', group: 'Điện & Ắc quy' },
  { name: 'Máy đề (starter)', oem: '28100-xxxxx', dealer: '2.500.000 – 6.000.000đ', after: '1.200.000 – 3.500.000đ', group: 'Điện & Ắc quy' },
  { name: 'Còi xe', oem: '86510-xxxxx', dealer: '300.000 – 800.000đ', after: '150.000 – 450.000đ', group: 'Điện & Ắc quy' },
  { name: 'Mô tơ nâng kính', oem: '85710-xxxxx', dealer: '900.000 – 2.500.000đ', after: '450.000 – 1.400.000đ', group: 'Điện & Ắc quy' },
  { name: 'Ổ khóa điện / đề nổ', oem: '89070-xxxxx', dealer: '1.500.000 – 4.000.000đ', after: '—', group: 'Điện & Ắc quy' },
  // --- Làm mát & Điều hòa ---
  { name: 'Két nước (radiator)', oem: '16400-xxxxx', dealer: '1.800.000 – 4.500.000đ', after: '900.000 – 2.500.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Quạt két nước', oem: '16361-xxxxx', dealer: '1.200.000 – 3.000.000đ', after: '600.000 – 1.700.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Ống nước trên / dưới', oem: '16571-xxxxx', dealer: '250.000 – 700.000đ', after: '120.000 – 400.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Lốc lạnh điều hòa (AC compressor)', oem: '88310-xxxxx', dealer: '5.000.000 – 14.000.000đ', after: '2.500.000 – 8.000.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Dàn nóng điều hòa (condenser)', oem: '88460-xxxxx', dealer: '2.000.000 – 5.000.000đ', after: '1.000.000 – 3.000.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Dàn lạnh (evaporator)', oem: '88501-xxxxx', dealer: '2.500.000 – 6.000.000đ', after: '1.200.000 – 3.500.000đ', group: 'Làm mát & Điều hòa' },
  { name: 'Quạt giàn lạnh (blower)', oem: '87103-xxxxx', dealer: '900.000 – 2.200.000đ', after: '450.000 – 1.300.000đ', group: 'Làm mát & Điều hòa' },
  // --- Thân vỏ & Ngoại thất ---
  { name: 'Cản trước', oem: '52119-xxxxx', dealer: '2.000.000 – 6.000.000đ', after: '1.000.000 – 3.500.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Cản sau', oem: '52159-xxxxx', dealer: '2.000.000 – 6.000.000đ', after: '1.000.000 – 3.500.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Lưới tản nhiệt (grille)', oem: '53111-xxxxx', dealer: '1.200.000 – 4.000.000đ', after: '600.000 – 2.200.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Nắp capo', oem: '53301-xxxxx', dealer: '3.000.000 – 8.000.000đ', after: '1.500.000 – 4.500.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Vè / chắn bùn', oem: '53811-xxxxx', dealer: '1.000.000 – 3.000.000đ', after: '500.000 – 1.700.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Gương chiếu hậu', oem: '87940-xxxxx', dealer: '1.500.000 – 4.500.000đ', after: '700.000 – 2.500.000đ', group: 'Thân vỏ & Ngoại thất' },
  { name: 'Tay nắm cửa ngoài', oem: '69210-xxxxx', dealer: '400.000 – 1.200.000đ', after: '200.000 – 700.000đ', group: 'Thân vỏ & Ngoại thất' },
  // --- Đèn & Gạt mưa ---
  { name: 'Đèn pha (headlight)', oem: '81150-xxxxx', dealer: '2.500.000 – 9.000.000đ', after: '1.200.000 – 5.000.000đ', group: 'Đèn & Gạt mưa' },
  { name: 'Đèn hậu', oem: '81550-xxxxx', dealer: '1.500.000 – 4.500.000đ', after: '700.000 – 2.500.000đ', group: 'Đèn & Gạt mưa' },
  { name: 'Đèn sương mù', oem: '81210-xxxxx', dealer: '600.000 – 1.800.000đ', after: '300.000 – 1.000.000đ', group: 'Đèn & Gạt mưa' },
  { name: 'Bóng đèn pha', oem: '90981-xxxxx', dealer: '200.000 – 800.000đ/cái', after: '100.000 – 500.000đ/cái', group: 'Đèn & Gạt mưa' },
  { name: 'Cần gạt mưa', oem: '85222-xxxxx', dealer: '250.000 – 700.000đ/cái', after: '120.000 – 400.000đ/cái', group: 'Đèn & Gạt mưa' },
  { name: 'Mô tơ gạt mưa', oem: '85110-xxxxx', dealer: '1.200.000 – 3.000.000đ', after: '600.000 – 1.700.000đ', group: 'Đèn & Gạt mưa' },
  { name: 'Kính chắn gió', oem: '56101-xxxxx', dealer: '2.500.000 – 8.000.000đ', after: '1.500.000 – 5.000.000đ', group: 'Đèn & Gạt mưa' },
  // --- Nội thất ---
  { name: 'Vô lăng', oem: '45100-xxxxx', dealer: '2.000.000 – 6.000.000đ', after: '—', group: 'Nội thất' },
  { name: 'Mặt táp lô', oem: '55401-xxxxx', dealer: '3.000.000 – 9.000.000đ', after: '—', group: 'Nội thất' },
  { name: 'Khung ghế', oem: '71100-xxxxx', dealer: '4.000.000 – 12.000.000đ', after: '—', group: 'Nội thất' },
  { name: 'Dây an toàn', oem: '73210-xxxxx', dealer: '800.000 – 2.500.000đ', after: '—', group: 'Nội thất' },
  { name: 'Thảm sàn', oem: '—', dealer: '500.000 – 2.500.000đ', after: '200.000 – 1.200.000đ', group: 'Nội thất' },
];

// Dữ liệu so sánh xe = giá/ảnh (toyotaCars) ghép thông số (carSpecs).
const compareData = toyotaCars.map((c) => ({
  name: c.name,
  type: c.type,
  price: c.price,
  image: c.image,
  engine: carSpecs[c.name].engine,
  power: carSpecs[c.name].power,
  gearbox: carSpecs[c.name].gearbox,
  seats: carSpecs[c.name].seats,
  drive: carSpecs[c.name].drive,
  fuel: carSpecs[c.name].fuel,
  pros: carSpecs[c.name].pros,
  cons: carSpecs[c.name].cons,
}));

// ===== Dữ liệu cho "Gợi ý xe AI" =====
// Số liệu tham khảo (giá triệu VND, tiêu hao L/100km, công suất mã lực, khoang hành lý lít).
// Điểm 1–5 là đánh giá định tính tương đối giữa các xe Toyota để chấm điểm gợi ý.
interface RecoMeta {
  body: 'Hatchback' | 'Sedan' | 'MPV' | 'SUV';
  seats: number;
  priceMin: number;
  priceMax: number;
  fuelLkm: number;
  hp: number;
  cargo: number;
  warranty: string;
  trans: string;
  fuelTypes: string[];
  hybrid: boolean;
  ratings: {
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
  };
  features: string[];
}

const recoMeta: Record<string, RecoMeta> = {
  'Toyota Wigo': {
    body: 'Hatchback', seats: 5, priceMin: 360, priceMax: 405, fuelLkm: 5.0, hp: 87, cargo: 300,
    warranty: '3 năm / 100.000 km', trans: 'CVT / Số sàn', fuelTypes: ['Xăng'], hybrid: false,
    ratings: { safety: 2, reliability: 4, comfort: 2, performance: 2, tech: 2, resale: 3, cargo: 2, fuelEcon: 5, brandRep: 4, family: 2 },
    features: ['Apple CarPlay', 'Android Auto', 'Rear Camera'],
  },
  'Toyota Vios': {
    body: 'Sedan', seats: 5, priceMin: 458, priceMax: 545, fuelLkm: 5.5, hp: 107, cargo: 506,
    warranty: '3 năm / 100.000 km', trans: 'CVT / Số sàn', fuelTypes: ['Xăng'], hybrid: false,
    ratings: { safety: 3, reliability: 5, comfort: 3, performance: 3, tech: 3, resale: 5, cargo: 3, fuelEcon: 5, brandRep: 5, family: 3 },
    features: ['Apple CarPlay', 'Android Auto', 'Rear Camera', 'Cruise Control'],
  },
  'Toyota Veloz Cross': {
    body: 'MPV', seats: 7, priceMin: 658, priceMax: 698, fuelLkm: 6.0, hp: 105, cargo: 405,
    warranty: '3 năm / 100.000 km', trans: 'CVT', fuelTypes: ['Xăng'], hybrid: false,
    ratings: { safety: 4, reliability: 4, comfort: 3, performance: 3, tech: 3, resale: 4, cargo: 4, fuelEcon: 4, brandRep: 4, family: 5 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', 'Cruise Control'],
  },
  'Toyota Yaris Cross': {
    body: 'SUV', seats: 5, priceMin: 730, priceMax: 838, fuelLkm: 4.8, hp: 116, cargo: 390,
    warranty: '3 năm / 100.000 km', trans: 'CVT / e-CVT', fuelTypes: ['Xăng', 'Hybrid'], hybrid: true,
    ratings: { safety: 4, reliability: 4, comfort: 3, performance: 3, tech: 4, resale: 4, cargo: 3, fuelEcon: 5, brandRep: 4, family: 3 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Blind Spot Monitor'],
  },
  'Toyota Corolla Cross': {
    body: 'SUV', seats: 5, priceMin: 820, priceMax: 935, fuelLkm: 5.8, hp: 140, cargo: 440,
    warranty: '3 năm / 100.000 km', trans: 'CVT / e-CVT', fuelTypes: ['Xăng', 'Hybrid'], hybrid: true,
    ratings: { safety: 5, reliability: 4, comfort: 4, performance: 4, tech: 4, resale: 4, cargo: 4, fuelEcon: 4, brandRep: 4, family: 4 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Blind Spot Monitor', 'Leather Seats', 'Sunroof'],
  },
  'Toyota Innova Cross': {
    body: 'MPV', seats: 7, priceMin: 810, priceMax: 1000, fuelLkm: 6.2, hp: 186, cargo: 300,
    warranty: '3 năm / 100.000 km', trans: 'CVT / e-CVT', fuelTypes: ['Xăng', 'Hybrid'], hybrid: true,
    ratings: { safety: 5, reliability: 4, comfort: 4, performance: 4, tech: 4, resale: 4, cargo: 5, fuelEcon: 4, brandRep: 4, family: 5 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', '360 Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Blind Spot Monitor', 'Leather Seats', 'Ventilated Seats'],
  },
  'Toyota Camry': {
    body: 'Sedan', seats: 5, priceMin: 1105, priceMax: 1495, fuelLkm: 7.0, hp: 203, cargo: 524,
    warranty: '3 năm / 100.000 km', trans: 'AT / e-CVT', fuelTypes: ['Xăng', 'Hybrid'], hybrid: true,
    ratings: { safety: 5, reliability: 4, comfort: 5, performance: 4, tech: 5, resale: 4, cargo: 4, fuelEcon: 3, brandRep: 5, family: 3 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', '360 Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Blind Spot Monitor', 'Leather Seats', 'Ventilated Seats', 'Sunroof'],
  },
  'Toyota Fortuner': {
    body: 'SUV', seats: 7, priceMin: 1055, priceMax: 1470, fuelLkm: 8.5, hp: 204, cargo: 716,
    warranty: '3 năm / 100.000 km', trans: 'AT / Số sàn', fuelTypes: ['Dầu', 'Xăng'], hybrid: false,
    ratings: { safety: 4, reliability: 5, comfort: 3, performance: 4, tech: 3, resale: 5, cargo: 5, fuelEcon: 2, brandRep: 5, family: 5 },
    features: ['Apple CarPlay', 'Android Auto', 'Rear Camera', '360 Camera', 'Cruise Control', 'Leather Seats', 'Blind Spot Monitor'],
  },
  'Toyota Land Cruiser': {
    body: 'SUV', seats: 7, priceMin: 4030, priceMax: 4600, fuelLkm: 11.0, hp: 415, cargo: 1100,
    warranty: '3 năm / 100.000 km', trans: 'AT 10 cấp', fuelTypes: ['Dầu', 'Xăng'], hybrid: false,
    ratings: { safety: 5, reliability: 5, comfort: 5, performance: 5, tech: 5, resale: 5, cargo: 5, fuelEcon: 1, brandRep: 5, family: 5 },
    features: ['ADAS', 'Apple CarPlay', 'Android Auto', 'Rear Camera', '360 Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Blind Spot Monitor', 'Leather Seats', 'Ventilated Seats', 'Sunroof'],
  },
};

// Gộp dữ liệu để nhúng vào client cho engine gợi ý xe.
const recoCars = toyotaCars.map((c) => {
  const m = recoMeta[c.name];
  const s = carSpecs[c.name];
  return {
    name: c.name,
    type: c.type,
    image: c.image,
    price: c.price,
    priceMin: m.priceMin,
    priceMax: m.priceMax,
    body: m.body,
    seats: m.seats,
    fuelLkm: m.fuelLkm,
    hp: m.hp,
    cargo: m.cargo,
    warranty: m.warranty,
    trans: m.trans,
    fuelTypes: m.fuelTypes,
    hybrid: m.hybrid,
    ratings: m.ratings,
    features: m.features,
    engine: s.engine,
    power: s.power,
    gearbox: s.gearbox,
    drive: s.drive,
    fuelStr: s.fuel,
    pros: s.pros,
    cons: s.cons,
  };
});

// Ảnh minh hoạ SVG inline (không phụ thuộc mạng ngoài) — đổi màu theo từng xe.
function carThumb(color: string): string {
  return `<svg viewBox="0 0 120 60" width="96" height="48" role="img" aria-label="xe">
    <rect x="2" y="34" width="116" height="14" rx="7" fill="rgba(0,0,0,0.15)"/>
    <path d="M14 38 q4 -18 24 -20 l30 -1 q14 0 24 14 l10 2 q6 1 6 7 q0 4 -5 4 l-90 0 q-5 0 -5 -4 z" fill="${color}"/>
    <path d="M40 20 l24 0 q10 0 16 10 l-40 0 z" fill="rgba(255,255,255,0.85)"/>
    <path d="M36 22 q3 -8 10 -8 l-2 16 l-12 0 q0 -5 4 -8 z" fill="rgba(255,255,255,0.85)"/>
    <circle cx="34" cy="46" r="8" fill="#222"/><circle cx="34" cy="46" r="3.5" fill="#bbb"/>
    <circle cx="92" cy="46" r="8" fill="#222"/><circle cx="92" cy="46" r="3.5" fill="#bbb"/>
  </svg>`;
}

// Ảnh thật + fallback SVG: nếu <img> lỗi mạng, ẩn ảnh và hiện SVG minh hoạ kế bên.
// Bấm vào ảnh -> mở lightbox xem ảnh lớn (1280px).
function carPhoto(c: Car): string {
  return `<img class="photo" src="${c.image}" alt="${c.name}" width="120" height="68"
      loading="lazy" referrerpolicy="no-referrer" title="Bấm để phóng to"
      onclick="openImg(this.src, '${c.name}')"
      onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
    <span class="fallback" style="display:none">${carThumb(c.color)}</span>`;
}

const rows = toyotaCars
  .map(
    (c) => `<tr>
      <td class="thumb">${carPhoto(c)}</td>
      <td class="name">${c.name}</td>
      <td class="type">${c.type}</td>
      <td class="price">${c.price}</td>
      <td class="act">
        <button class="btn3d" type="button"
          onclick="open3d('${c.model ?? CAR_MODEL}', '${c.name}')">↻ 3D</button>
        <button class="btnspec" type="button"
          onclick="openSpec('${c.name}')">📋 Thông số</button>
        <button class="btnmaint" type="button"
          onclick="openMaint('${c.name}')">🔧 Bảo dưỡng</button>
      </td>
    </tr>`,
  )
  .join('');

const page = /* html */ `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>🚗 Garage Vui Vẻ</title>
    <script type="module"
      src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"></script>
    <style>
      :root {
        --bg1: #060608;
        --bg2: #16161b;
        --surface: #1c1c22;
        --ink: #0a0a0c;
        --accent: #ffd166;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #fff;
        background:
          radial-gradient(1100px 620px at 50% -12%, rgba(120, 130, 160, 0.18), transparent 62%),
          radial-gradient(900px 500px at 100% 0%, rgba(255, 209, 102, 0.06), transparent 60%),
          linear-gradient(160deg, var(--bg1), var(--bg2));
        background-attachment: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow-x: hidden;
        padding: 2rem 1rem;
      }
      h1 {
        font-size: clamp(2rem, 6vw, 4rem);
        margin: 0.2em 0;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      h2 { font-size: clamp(1.3rem, 4vw, 2rem); margin: 2rem 0 0.4rem; }
      p.lead { font-size: clamp(1rem, 3vw, 1.4rem); opacity: 0.92; max-width: 32ch; }
      .road {
        position: relative;
        width: 100%;
        max-width: 720px;
        height: 90px;
        margin: 1.5rem 0;
        overflow: hidden;
      }
      .road::after {
        content: '';
        position: absolute;
        bottom: 14px;
        left: 0;
        width: 100%;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          var(--accent) 0 28px,
          transparent 28px 56px
        );
        animation: dash 0.8s linear infinite;
      }
      @keyframes dash { to { background-position: -56px 0; } }
      .car {
        font-size: 3.4rem;
        position: absolute;
        bottom: 18px;
        animation: drive 6s ease-in-out infinite;
      }
      @keyframes drive {
        0% { left: -12%; transform: scaleX(1); }
        45% { left: 92%; transform: scaleX(1); }
        50% { left: 92%; transform: scaleX(-1); }
        95% { left: -12%; transform: scaleX(-1); }
        100% { left: -12%; transform: scaleX(1); }
      }
      .cards {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 1rem;
      }
      .card {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(6px);
        border-radius: 16px;
        padding: 1rem 1.4rem;
        min-width: 130px;
        transition: transform 0.2s ease;
      }
      .card:hover { transform: translateY(-6px); }
      .card .emoji { font-size: 2rem; }
      .card .label { font-size: 0.95rem; opacity: 0.9; margin-top: 0.3rem; }
      .table-wrap {
        width: 100%;
        max-width: 760px;
        overflow-x: auto;
        margin-top: 0.5rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(6px);
      }
      table { width: 100%; border-collapse: collapse; min-width: 520px; }
      thead th {
        text-align: left;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.9rem 1rem;
        color: var(--accent);
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      }
      tbody td { padding: 0.7rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      tbody tr { transition: background 0.15s ease; }
      tbody tr:hover { background: rgba(255, 255, 255, 0.08); }
      tbody tr:last-child td { border-bottom: none; }
      td.thumb { width: 132px; }
      td.thumb svg { display: block; }
      td.thumb img.photo {
        display: block;
        width: 120px;
        height: 68px;
        object-fit: cover;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        cursor: zoom-in;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      td.thumb img.photo:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
      }
      td.name { font-weight: 600; white-space: nowrap; }
      td.type { opacity: 0.85; font-size: 0.92rem; }
      td.price { font-weight: 700; color: var(--accent); white-space: nowrap; }
      td.act { white-space: nowrap; }
      .btn3d {
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        color: #0d1b2a;
        background: var(--accent);
        border: none;
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .btn3d:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); }
      .btn3d:active { transform: translateY(0); }
      .btnspec {
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        margin-top: 0.35rem;
        cursor: pointer;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .btnspec:hover { transform: translateY(-2px); background: rgba(255, 255, 255, 0.28); }
      .btnspec:active { transform: translateY(0); }
      .btnmaint {
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        color: #0d1b2a;
        background: #4ade80;
        border: none;
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        margin-top: 0.35rem;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .btnmaint:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); }
      .btnmaint:active { transform: translateY(0); }
      /* ---- Popup bảo dưỡng ---- */
      .maint-card { width: min(96vw, 1040px) !important; }
      .maint-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem 0.9rem;
        margin-bottom: 0.8rem;
        text-align: left;
      }
      .maint-filters label {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 0.78rem;
        opacity: 0.85;
      }
      .maint-filters select {
        font: inherit;
        font-size: 0.85rem;
        padding: 0.35rem 0.5rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: var(--surface);
        color: #fff;
      }
      .maint-scroll { max-height: 56vh; overflow: auto; border-radius: 12px; }
      h4.sec { text-align: left; margin: 1rem 0 0.5rem; font-size: 1rem; color: var(--accent); }
      .mtable { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
      .mtable th, .mtable td {
        text-align: left;
        padding: 0.5rem 0.6rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        vertical-align: top;
      }
      .mtable thead th {
        position: sticky;
        top: 0;
        background: var(--surface);
        color: var(--accent);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        white-space: nowrap;
      }
      .mtable tbody tr:hover { background: rgba(255, 255, 255, 0.05); }
      .pri {
        display: inline-block;
        padding: 0.15rem 0.55rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        white-space: nowrap;
      }
      .pri-req { background: rgba(248, 113, 113, 0.22); color: #fca5a5; }
      .pri-rec { background: rgba(96, 165, 250, 0.22); color: #93c5fd; }
      .pri-opt { background: rgba(250, 204, 21, 0.2); color: #fde047; }
      .total-cell { font-weight: 700; color: var(--accent); white-space: nowrap; }
      .empty-row { opacity: 0.7; font-style: italic; padding: 1rem; }
      .catalog-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.6rem;
        margin: 0.3rem 0 0.6rem;
      }
      .catalog-filters input[type='search'] {
        flex: 1 1 240px;
        font: inherit;
        font-size: 0.88rem;
        padding: 0.4rem 0.7rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: var(--surface);
        color: #fff;
      }
      .catalog-filters select {
        font: inherit;
        font-size: 0.85rem;
        padding: 0.4rem 0.5rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: var(--surface);
        color: #fff;
      }
      .cat-count { font-size: 0.8rem; opacity: 0.75; }
      .toolbar { margin: 0 0 0.9rem; }
      .tabs { display: flex; gap: 0.5rem; margin: 0.2rem 0 0.8rem; }
      .tab {
        font: inherit;
        font-weight: 600;
        font-size: 0.9rem;
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        padding: 0.5rem 1.1rem;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .tab:hover { background: rgba(255, 255, 255, 0.18); }
      .tab.active { background: var(--accent); color: #0d1b2a; border-color: var(--accent); }
      .tabpane[hidden] { display: none; }
      .picon { font-size: 1.4rem; text-align: center; width: 46px; }
      .inline-lbl { font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }
      /* ---- So sánh xe ---- */
      .compare-card { width: min(96vw, 880px) !important; }
      .cmp-pickers { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
      .cmp-pickers select {
        flex: 1 1 200px;
        font: inherit;
        font-size: 0.9rem;
        padding: 0.45rem 0.6rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: var(--surface);
        color: #fff;
      }
      .cmp-pickers .vs { font-weight: 700; color: var(--accent); }
      .cmp-body { max-height: 64vh; overflow: auto; }
      .cmp-tbl { width: 100%; border-collapse: collapse; }
      .cmp-tbl th, .cmp-tbl td {
        padding: 0.55rem 0.7rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        text-align: left;
        vertical-align: top;
        font-size: 0.9rem;
      }
      .cmp-tbl thead th { color: var(--accent); text-align: center; font-size: 0.98rem; }
      .cmp-tbl td.lbl { color: var(--accent); font-weight: 600; width: 26%; }
      .cmp-tbl img { width: 100%; max-width: 200px; border-radius: 10px; display: block; margin: 0 auto; }
      .cmp-tbl ul { margin: 0; padding-left: 1.1rem; }
      .cmp-tbl li { margin: 0.2rem 0; }
      /* ---- Gợi ý xe AI ---- */
      .btnreco {
        font: inherit;
        font-weight: 700;
        font-size: 0.9rem;
        color: #0d1b2a;
        background: linear-gradient(135deg, #ffd166, #ff9f1c);
        border: none;
        border-radius: 999px;
        padding: 0.55rem 1.2rem;
        margin-right: 0.5rem;
        cursor: pointer;
        box-shadow: 0 6px 16px rgba(255, 159, 28, 0.35);
        transition: transform 0.12s ease, box-shadow 0.12s ease;
      }
      .btnreco:hover { transform: translateY(-1px); box-shadow: 0 9px 22px rgba(255, 159, 28, 0.5); }
      .reco-card { width: min(96vw, 960px) !important; }
      .reco-scroll { max-height: 72vh; overflow: auto; padding-right: 0.3rem; }
      .reco-intro { font-size: 0.88rem; opacity: 0.85; margin: 0 0 1rem; text-align: left; }
      .reco-sec { margin: 0 0 1.2rem; text-align: left; }
      .reco-sec > h4 {
        margin: 0 0 0.7rem;
        font-size: 1rem;
        color: var(--accent);
        border-bottom: 1px solid rgba(255, 255, 255, 0.14);
        padding-bottom: 0.4rem;
      }
      .reco-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.8rem 1rem;
      }
      .reco-q { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.86rem; }
      .reco-q > span.qlabel { font-weight: 600; }
      .reco-q input[type='number'],
      .reco-q input[type='text'],
      .reco-q select {
        font: inherit;
        font-size: 0.88rem;
        padding: 0.45rem 0.6rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        background: var(--surface);
        color: #fff;
      }
      .reco-opts { display: flex; flex-wrap: wrap; gap: 0.4rem 0.9rem; }
      .reco-opts label {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.84rem;
        cursor: pointer;
      }
      .reco-range { display: flex; align-items: center; gap: 0.6rem; }
      .reco-range input[type='range'] { flex: 1; accent-color: var(--accent); }
      .reco-range output { min-width: 2.5rem; text-align: right; font-variant-numeric: tabular-nums; }
      .reco-rate { display: flex; align-items: center; gap: 0.5rem; }
      .reco-rate input[type='range'] { flex: 1; accent-color: var(--accent); }
      .reco-rate output { min-width: 1.4rem; text-align: center; font-weight: 700; color: var(--accent); }
      .reco-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.4rem; }
      .reco-actions button {
        font: inherit;
        font-weight: 700;
        font-size: 0.92rem;
        border-radius: 999px;
        padding: 0.6rem 1.4rem;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.25);
      }
      .reco-actions .primary { background: linear-gradient(135deg, #ffd166, #ff9f1c); color: #0d1b2a; border: none; }
      .reco-actions .ghost { background: rgba(255, 255, 255, 0.1); color: #fff; }
      /* --- Kết quả gợi ý --- */
      .rec-list { display: flex; flex-direction: column; gap: 1.1rem; text-align: left; }
      .rec-item {
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 16px;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.03);
      }
      .rec-item.top { border-color: var(--accent); box-shadow: 0 0 0 1px rgba(255, 209, 102, 0.4); }
      .rec-head { display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap; }
      .rec-head img { width: 180px; max-width: 40vw; border-radius: 12px; }
      .rec-headinfo { flex: 1; min-width: 200px; }
      .rec-rank {
        display: inline-block;
        font-size: 0.74rem;
        font-weight: 700;
        background: var(--accent);
        color: #0d1b2a;
        border-radius: 999px;
        padding: 0.15rem 0.7rem;
        margin-bottom: 0.35rem;
      }
      .rec-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 0.2rem; }
      .rec-meta { font-size: 0.84rem; opacity: 0.85; line-height: 1.5; }
      .rec-overall { text-align: center; }
      .rec-overall .big { font-size: 2rem; font-weight: 800; color: var(--accent); line-height: 1; }
      .rec-overall .cap { font-size: 0.72rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.04em; }
      .rec-why {
        margin: 0.8rem 0;
        padding: 0.7rem 0.9rem;
        border-left: 3px solid var(--accent);
        background: rgba(255, 209, 102, 0.08);
        border-radius: 0 10px 10px 0;
        font-size: 0.9rem;
        line-height: 1.55;
      }
      .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem 1rem; margin: 0.6rem 0; }
      .score-row { font-size: 0.8rem; }
      .score-row .sr-top { display: flex; justify-content: space-between; margin-bottom: 0.2rem; }
      .score-row .bar { height: 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
      .score-row .bar > i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #06d6a0, #ffd166); }
      .cost-tbl { width: 100%; border-collapse: collapse; font-size: 0.84rem; margin: 0.4rem 0; }
      .cost-tbl td { padding: 0.35rem 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .cost-tbl td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
      .cost-tbl tr.total td { font-weight: 800; color: var(--accent); border-top: 1px solid rgba(255, 255, 255, 0.25); }
      .proscons { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin: 0.5rem 0; }
      .proscons ul { margin: 0.2rem 0; padding-left: 1.1rem; font-size: 0.84rem; }
      .proscons .pc-pro h5 { color: #06d6a0; margin: 0; }
      .proscons .pc-con h5 { color: #ff6b6b; margin: 0; }
      .rec-alt { font-size: 0.84rem; }
      .rec-alt .chip {
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        padding: 0.25rem 0.7rem;
        margin: 0.2rem 0.3rem 0 0;
        font-size: 0.8rem;
      }
      .rec-toggle { display: flex; gap: 0.6rem; margin: 0.4rem 0 1rem; flex-wrap: wrap; }
      .ai-box {
        text-align: left;
        margin-top: 1rem;
        border: 1px solid rgba(255, 209, 102, 0.35);
        border-radius: 14px;
        padding: 1rem 1.1rem;
        background: linear-gradient(160deg, rgba(255, 209, 102, 0.07), rgba(255, 255, 255, 0.02));
      }
      .ai-box.ai-loading { opacity: 0.85; font-size: 0.92rem; }
      .ai-box.ai-warn { border-color: rgba(255, 107, 107, 0.45); background: rgba(255, 107, 107, 0.08); font-size: 0.9rem; }
      .ai-head { font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
      .ai-badge {
        font-size: 0.68rem;
        background: var(--surface);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        padding: 0.12rem 0.55rem;
        opacity: 0.85;
        font-weight: 600;
      }
      .ai-text p { margin: 0.4rem 0; font-size: 0.9rem; line-height: 1.6; }
      .ai-text h5 { margin: 0.7rem 0 0.3rem; color: var(--accent); font-size: 0.95rem; }
      .ai-text ul { margin: 0.3rem 0; padding-left: 1.2rem; font-size: 0.9rem; }
      .ai-text li { margin: 0.2rem 0; line-height: 1.5; }
      @media (max-width: 560px) {
        .proscons { grid-template-columns: 1fr; }
      }
      /* ---- Bảng thông số trong popup ---- */
      .spec-tbl { width: 100%; border-collapse: collapse; margin-bottom: 1rem; min-width: 0; }
      .spec-tbl th, .spec-tbl td {
        text-align: left;
        padding: 0.55rem 0.7rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 0.95rem;
      }
      .spec-tbl th {
        width: 38%;
        color: var(--accent);
        font-weight: 600;
        text-transform: none;
        letter-spacing: 0;
      }
      .spec-tbl td { font-weight: 500; }
      .proscons { display: flex; gap: 1rem; flex-wrap: wrap; text-align: left; }
      .proscons > div {
        flex: 1 1 200px;
        border-radius: 12px;
        padding: 0.8rem 1rem;
        background: rgba(255, 255, 255, 0.06);
      }
      .proscons h4 { margin: 0 0 0.5rem; font-size: 1rem; }
      .proscons .pros h4 { color: #4ade80; }
      .proscons .cons h4 { color: #fbbf24; }
      .proscons ul { margin: 0; padding-left: 1.1rem; }
      .proscons li { margin: 0.25rem 0; font-size: 0.9rem; line-height: 1.4; }
      /* ---- 3D modal ---- */
      .modal3d[hidden] { display: none; }
      .modal3d {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(4px);
      }
      .modal3d .card3d {
        position: relative;
        width: min(92vw, 760px);
        background: linear-gradient(160deg, #1b1b21, #0a0a0c);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 20px;
        padding: 1rem 1rem 1.2rem;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.7);
      }
      .modal3d h3 { margin: 0.2rem 0 0.6rem; font-size: 1.2rem; }
      .modal3d model-viewer {
        width: 100%;
        height: min(60vh, 440px);
        background: radial-gradient(circle at 50% 35%, #26262e, #0a0a0c 70%);
        border-radius: 14px;
        --poster-color: transparent;
      }
      .modal3d .hint { font-size: 0.82rem; opacity: 0.75; margin: 0.6rem 0 0; }
      .modal3d .close {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
        transition: background 0.15s ease;
      }
      .modal3d .close:hover { background: rgba(255, 255, 255, 0.3); }
      /* ---- Lightbox ảnh ---- */
      .lightbox[hidden] { display: none; }
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1.5rem;
        background: rgba(3, 8, 18, 0.92);
        cursor: zoom-out;
        animation: fade 0.18s ease;
      }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      .lightbox img {
        max-width: min(60vw, 820px);
        max-height: 84vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
      }
      .lightbox .lb-inner {
        display: flex;
        gap: 1.2rem;
        align-items: center;
        justify-content: center;
        max-width: 96vw;
        max-height: 86vh;
        cursor: default;
      }
      .lb-spec {
        width: min(34vw, 360px);
        max-height: 84vh;
        overflow-y: auto;
        text-align: left;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 14px;
        padding: 1rem 1.1rem;
      }
      @media (max-width: 820px) {
        .lightbox .lb-inner { flex-direction: column; align-items: stretch; overflow-y: auto; }
        .lightbox img { max-width: 92vw; max-height: 46vh; }
        .lb-spec { width: auto; max-height: none; }
      }
      .lightbox .cap { font-size: 0.95rem; opacity: 0.85; }
      .lightbox .close {
        position: absolute;
        top: 1rem;
        right: 1.2rem;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
      }
      .lightbox .close:hover { background: rgba(255, 255, 255, 0.32); }
      .note { font-size: 0.8rem; opacity: 0.7; margin-top: 0.6rem; max-width: 60ch; }
      footer { margin-top: 2rem; opacity: 0.7; font-size: 0.85rem; }
      a { color: var(--accent); text-decoration: none; font-weight: 600; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>🚗💨 Chào mừng tới Garage Vui Vẻ!</h1>
    <p class="lead">Nơi những chiếc xe luôn nổ máy giòn giã và nụ cười không bao giờ tắt 😄</p>

    <div class="road" aria-hidden="true">
      <span class="car">🏎️</span>
    </div>

    <div class="cards">
      <div class="card"><div class="emoji">🚙</div><div class="label">SUV bền bỉ</div></div>
      <div class="card"><div class="emoji">🏎️</div><div class="label">Tốc độ đỉnh cao</div></div>
      <div class="card"><div class="emoji">🔧</div><div class="label">Bảo dưỡng tận tâm</div></div>
      <div class="card"><div class="emoji">⚡</div><div class="label">Xe điện xanh</div></div>
    </div>

    <h2>🛞 Bảng giá xe Toyota</h2>
    <div class="toolbar">
      <button class="btnreco" type="button" onclick="openReco()">🤖 Gợi ý xe AI</button>
      <button class="btnspec" type="button" onclick="openCompare()">⚖️ So sánh xe</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Ảnh</th><th>Mẫu xe</th><th>Phân khúc</th><th>Giá tham khảo</th><th>Tùy chọn</th></tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <p class="note">
      * Giá niêm yết tham khảo tại thị trường Việt Nam, chưa gồm thuế trước bạ &amp; phí lăn bánh.
      Vui lòng liên hệ đại lý để có báo giá chính xác.
    </p>

    <footer>
      API đang chạy ngon lành — kiểm tra tại <a href="/health">/health</a> 💚
    </footer>

    <div id="viewer3d" class="modal3d" hidden>
      <div class="card3d">
        <button class="close" type="button" onclick="close3d()" aria-label="Đóng">✕</button>
        <h3 id="m3d-title">Xem 3D</h3>
        <model-viewer
          id="mv"
          camera-controls
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="30deg"
          interaction-prompt="none"
          touch-action="pan-y"
          shadow-intensity="1"
          exposure="1.1"
          ar
          ar-modes="webxr scene-viewer quick-look"
        ></model-viewer>
        <p class="hint">🖱️ Kéo để xoay • cuộn để phóng to/thu nhỏ • thả ra xe tự xoay • 📱 bấm AR để xem ngoài đời thực</p>
      </div>
    </div>

    <div id="lightbox" class="lightbox" hidden onclick="closeImg()">
      <button class="close" type="button" aria-label="Đóng">✕</button>
      <div class="lb-inner" onclick="event.stopPropagation()">
        <img id="lb-img" src="" alt="" referrerpolicy="no-referrer" />
        <aside id="lb-spec" class="lb-spec"></aside>
      </div>
      <div id="lb-cap" class="cap"></div>
    </div>

    <div id="specbox" class="modal3d" hidden>
      <div class="card3d">
        <button class="close" type="button" onclick="closeSpec()" aria-label="Đóng">✕</button>
        <h3 id="spec-title">Thông số</h3>
        <div id="spec-body"></div>
      </div>
    </div>

    <div id="maintbox" class="modal3d" hidden>
      <div class="card3d maint-card">
        <button class="close" type="button" onclick="closeMaint()" aria-label="Đóng">✕</button>
        <h3 id="maint-title">Bảo dưỡng</h3>
        <div class="tabs">
          <button class="tab active" type="button" data-tab="sched">🗓️ Lịch bảo dưỡng</button>
          <button class="tab" type="button" data-tab="parts">🔧 Phụ tùng</button>
        </div>
        <div class="maint-scroll">
          <section id="tab-sched" class="tabpane">
            <div class="maint-filters">
              <label>Số km
                <select id="f-km">
                  <option value="">Tất cả</option>
                  <option value="5000">≤ 5.000 km</option>
                  <option value="10000">≤ 10.000 km</option>
                  <option value="20000">≤ 20.000 km</option>
                  <option value="30000">≤ 30.000 km</option>
                  <option value="40000">≤ 40.000 km</option>
                  <option value="80000">≤ 80.000 km</option>
                  <option value="100000">≤ 100.000 km</option>
                </select>
              </label>
              <label>Tuổi xe (~15.000 km/năm)
                <select id="f-age">
                  <option value="">—</option>
                  <option value="1">1 năm</option>
                  <option value="2">2 năm</option>
                  <option value="3">3 năm</option>
                  <option value="5">5 năm</option>
                  <option value="7">7 năm</option>
                </select>
              </label>
              <label>Mức độ
                <select id="f-prio">
                  <option value="">Tất cả</option>
                  <option value="Bắt buộc">Bắt buộc</option>
                  <option value="Khuyến nghị">Khuyến nghị</option>
                  <option value="Tùy chọn">Tùy chọn</option>
                </select>
              </label>
              <label>Sắp xếp chi phí
                <select id="f-cost">
                  <option value="km">Theo mốc km</option>
                  <option value="asc">Thấp → Cao</option>
                  <option value="desc">Cao → Thấp</option>
                </select>
              </label>
            </div>
            <table class="mtable">
              <thead>
                <tr>
                  <th>Mốc</th><th>Hạng mục</th><th>Phụ tùng</th><th>Nhân công</th>
                  <th>Giá PT</th><th>Tổng</th><th>Thời gian</th><th>Mức độ</th><th>Ghi chú</th>
                </tr>
              </thead>
              <tbody id="maint-rows"></tbody>
            </table>
          </section>

          <section id="tab-parts" class="tabpane" hidden>
            <h4 class="sec">🔩 Phụ tùng thay thế (tham khảo)</h4>
            <div class="catalog-filters">
              <label class="inline-lbl">Lọc theo hạng mục:
                <select id="f-cat">
                  <option value="">Tất cả</option>
                  <option value="Dầu nhớt">Dầu nhớt</option>
                  <option value="Lọc">Lọc</option>
                  <option value="Phanh">Phanh</option>
                  <option value="Đánh lửa">Đánh lửa</option>
                  <option value="Làm mát">Làm mát</option>
                  <option value="Điện">Điện</option>
                  <option value="Lốp">Lốp</option>
                </select>
              </label>
            </div>
            <table class="mtable">
              <thead>
                <tr>
                  <th>Ảnh</th><th>Phụ tùng</th><th>Mã OEM*</th><th>Giá chính hãng</th><th>Giá ngoài</th>
                  <th>Tuổi thọ</th><th>Dấu hiệu thay</th><th>Chu kỳ thay</th>
                </tr>
              </thead>
              <tbody id="parts-rows"></tbody>
            </table>

            <h4 class="sec">🧩 Danh mục phụ tùng đầy đủ (tham khảo)</h4>
            <div class="catalog-filters">
              <input id="f-search" type="search" placeholder="🔍 Tìm phụ tùng (ví dụ: bơm nước, má phanh...)" />
              <select id="f-group">
                <option value="">Tất cả nhóm</option>
                <option value="Động cơ">Động cơ</option>
                <option value="Nhiên liệu & Khí thải">Nhiên liệu & Khí thải</option>
                <option value="Hệ truyền động">Hệ truyền động</option>
                <option value="Phanh">Phanh</option>
                <option value="Treo & Lái">Treo & Lái</option>
                <option value="Điện & Ắc quy">Điện & Ắc quy</option>
                <option value="Làm mát & Điều hòa">Làm mát & Điều hòa</option>
                <option value="Thân vỏ & Ngoại thất">Thân vỏ & Ngoại thất</option>
                <option value="Đèn & Gạt mưa">Đèn & Gạt mưa</option>
                <option value="Nội thất">Nội thất</option>
              </select>
              <span id="catalog-count" class="cat-count"></span>
            </div>
            <table class="mtable">
              <thead>
                <tr>
                  <th>Ảnh</th><th>Phụ tùng</th><th>Nhóm</th><th>Mã OEM*</th><th>Giá chính hãng</th><th>Giá ngoài</th>
                </tr>
              </thead>
              <tbody id="catalog-rows"></tbody>
            </table>
          </section>
        </div>
        <p class="hint">* Giá & mã OEM chỉ mang tính tham khảo, thay đổi theo đại lý / khu vực / đời xe & động cơ.
          Đuôi mã OEM (xxxxx) cần xác nhận theo số VIN tại đại lý. Luôn ưu tiên lịch bảo dưỡng chính hãng.</p>
      </div>
    </div>

    <div id="comparebox" class="modal3d" hidden>
      <div class="card3d compare-card">
        <button class="close" type="button" onclick="closeCompare()" aria-label="Đóng">✕</button>
        <h3>⚖️ So sánh xe</h3>
        <div class="cmp-pickers">
          <select id="cmp-a"></select>
          <span class="vs">VS</span>
          <select id="cmp-b"></select>
        </div>
        <div id="cmp-body" class="cmp-body"></div>
      </div>
    </div>

    <div id="recobox" class="modal3d" hidden>
      <div class="card3d reco-card">
        <button class="close" type="button" onclick="closeReco()" aria-label="Đóng">✕</button>
        <h3>🤖 Gợi ý xe AI</h3>
        <div class="reco-scroll">
          <p class="reco-intro">
            Trả lời vài câu hỏi về thu nhập, thói quen lái, ngân sách &amp; ưu tiên của bạn.
            Hệ thống sẽ cân bằng nhiều yếu tố (không chỉ chọn xe rẻ nhất) để gợi ý Top 3 xe phù hợp,
            kèm điểm số, chi phí sở hữu hằng tháng và lý do cụ thể.
          </p>
          <form id="reco-form" autocomplete="off"></form>
          <div id="reco-result" hidden></div>
        </div>
      </div>
    </div>

    <script>
      (function () {
        var modal = document.getElementById('viewer3d');
        var mv = document.getElementById('mv');
        var title = document.getElementById('m3d-title');
        window.open3d = function (src, name) {
          mv.setAttribute('src', src);
          mv.setAttribute('alt', name);
          title.textContent = name + ' — xem 3D';
          modal.hidden = false;
        };
        window.close3d = function () {
          modal.hidden = true;
        };
        // Đóng khi bấm nền tối hoặc nhấn Esc.
        modal.addEventListener('click', function (e) {
          if (e.target === modal) window.close3d();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.close3d();
        });
      })();
    </script>

    <script>
      (function () {
        var box = document.getElementById('lightbox');
        var img = document.getElementById('lb-img');
        var cap = document.getElementById('lb-cap');
        var spec = document.getElementById('lb-spec');
        // Đổi thumbnail 330px sang bản lớn 1280px (size Wikimedia cho phép).
        function bigSrc(src) {
          return src.replace('/330px-', '/1280px-');
        }
        window.openImg = function (src, name) {
          img.src = bigSrc(src);
          img.alt = name;
          cap.textContent = name;
          spec.innerHTML = window.buildSpecHtml ? window.buildSpecHtml(name) : '';
          box.hidden = false;
        };
        window.closeImg = function () {
          box.hidden = true;
          img.src = '';
        };
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.closeImg();
        });
      })();
    </script>

    <script>
      (function () {
        var SPECS = ${JSON.stringify(carSpecs).replace(/</g, '\\u003c')};
        var box = document.getElementById('specbox');
        var title = document.getElementById('spec-title');
        var body = document.getElementById('spec-body');
        function esc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        window.buildSpecHtml = function (name) {
          var s = SPECS[name];
          if (!s) return '';
          var specRows = [
            ['Động cơ', s.engine],
            ['Công suất', s.power],
            ['Hộp số', s.gearbox],
            ['Số chỗ', s.seats],
            ['Dẫn động', s.drive],
            ['Tiêu hao', s.fuel],
          ]
            .map(function (r) {
              return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>';
            })
            .join('');
          var pros = s.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
          var cons = s.cons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
          return (
            '<table class="spec-tbl">' + specRows + '</table>' +
            '<div class="proscons">' +
            '<div class="pros"><h4>✅ Ưu điểm</h4><ul>' + pros + '</ul></div>' +
            '<div class="cons"><h4>⚠️ Nhược điểm</h4><ul>' + cons + '</ul></div>' +
            '</div>'
          );
        };
        window.openSpec = function (name) {
          if (!SPECS[name]) return;
          body.innerHTML = window.buildSpecHtml(name);
          title.textContent = name + ' — Thông số kỹ thuật';
          box.hidden = false;
        };
        window.closeSpec = function () {
          box.hidden = true;
        };
        box.addEventListener('click', function (e) {
          if (e.target === box) window.closeSpec();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.closeSpec();
        });
      })();
    </script>

    <script>
      (function () {
        var MAINT = ${JSON.stringify(maintenance).replace(/</g, '\\u003c')};
        var PARTS = ${JSON.stringify(wearParts).replace(/</g, '\\u003c')};
        var CATALOG = ${JSON.stringify(partsCatalog).replace(/</g, '\\u003c')};
        var box = document.getElementById('maintbox');
        var title = document.getElementById('maint-title');
        var mRows = document.getElementById('maint-rows');
        var pRows = document.getElementById('parts-rows');
        var cRows = document.getElementById('catalog-rows');
        var cCount = document.getElementById('catalog-count');
        var fKm = document.getElementById('f-km');
        var fAge = document.getElementById('f-age');
        var fPrio = document.getElementById('f-prio');
        var fCost = document.getElementById('f-cost');
        var fCat = document.getElementById('f-cat');
        var fSearch = document.getElementById('f-search');
        var fGroup = document.getElementById('f-group');
        function esc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function priClass(p) {
          return p === 'Bắt buộc' ? 'pri-req' : p === 'Khuyến nghị' ? 'pri-rec' : 'pri-opt';
        }
        var ICONS = {
          'Dầu nhớt': '🛢️', 'Lọc': '🌬️', 'Phanh': '🛑', 'Đánh lửa': '⚡', 'Làm mát': '🌡️',
          'Điện': '🔋', 'Lốp': '🛞', 'Động cơ': '🔧', 'Nhiên liệu & Khí thải': '⛽',
          'Hệ truyền động': '⚙️', 'Treo & Lái': '🔩', 'Điện & Ắc quy': '🔋',
          'Làm mát & Điều hòa': '❄️', 'Thân vỏ & Ngoại thất': '🚙', 'Đèn & Gạt mưa': '💡', 'Nội thất': '🪑',
        };
        function iconFor(key) { return ICONS[key] || '🔧'; }
        function list(arr) {
          return arr.map(function (x) { return esc(x); }).join('<br>');
        }
        function renderSchedule() {
          var maxKm = fKm.value ? Number(fKm.value) : Infinity;
          if (fAge.value) maxKm = Math.min(maxKm, Number(fAge.value) * 15000);
          var rows = MAINT.filter(function (m) {
            if (m.km > maxKm) return false;
            if (fPrio.value && m.priority !== fPrio.value) return false;
            return true;
          });
          if (fCost.value === 'asc') rows.sort(function (a, b) { return a.costMin - b.costMin; });
          else if (fCost.value === 'desc') rows.sort(function (a, b) { return b.costMin - a.costMin; });
          else rows.sort(function (a, b) { return a.km - b.km; });
          if (!rows.length) {
            mRows.innerHTML = '<tr><td class="empty-row" colspan="9">Không có hạng mục phù hợp bộ lọc.</td></tr>';
            return;
          }
          mRows.innerHTML = rows.map(function (m) {
            return '<tr>' +
              '<td><strong>' + esc(m.kmLabel) + '</strong></td>' +
              '<td>' + list(m.items) + '</td>' +
              '<td>' + list(m.parts) + '</td>' +
              '<td>' + esc(m.labor) + '</td>' +
              '<td>' + esc(m.partsPrice) + '</td>' +
              '<td class="total-cell">' + esc(m.total) + '</td>' +
              '<td>' + esc(m.time) + '</td>' +
              '<td><span class="pri ' + priClass(m.priority) + '">' + esc(m.priority) + '</span></td>' +
              '<td>' + esc(m.notes) + '</td>' +
              '</tr>';
          }).join('');
        }
        function renderParts() {
          var rows = PARTS.filter(function (p) {
            return !fCat.value || p.category === fCat.value;
          });
          if (fCost.value === 'asc' || fCost.value === 'desc') {
            // giữ nguyên thứ tự phụ tùng (giá dạng khoảng, khó sắp chính xác)
          }
          if (!rows.length) {
            pRows.innerHTML = '<tr><td class="empty-row" colspan="8">Không có phụ tùng trong hạng mục này.</td></tr>';
            return;
          }
          pRows.innerHTML = rows.map(function (p) {
            return '<tr>' +
              '<td class="picon">' + iconFor(p.category) + '</td>' +
              '<td><strong>' + esc(p.name) + '</strong></td>' +
              '<td>' + esc(p.oem) + '</td>' +
              '<td>' + esc(p.dealer) + '</td>' +
              '<td>' + esc(p.after) + '</td>' +
              '<td>' + esc(p.life) + '</td>' +
              '<td>' + esc(p.symptom) + '</td>' +
              '<td>' + esc(p.interval) + '</td>' +
              '</tr>';
          }).join('');
        }
        function renderCatalog() {
          var q = (fSearch.value || '').trim().toLowerCase();
          var g = fGroup.value;
          var rows = CATALOG.filter(function (p) {
            if (g && p.group !== g) return false;
            if (q && p.name.toLowerCase().indexOf(q) === -1 && p.oem.toLowerCase().indexOf(q) === -1) return false;
            return true;
          });
          cCount.textContent = rows.length + '/' + CATALOG.length + ' phụ tùng';
          if (!rows.length) {
            cRows.innerHTML = '<tr><td class="empty-row" colspan="6">Không tìm thấy phụ tùng phù hợp.</td></tr>';
            return;
          }
          cRows.innerHTML = rows.map(function (p) {
            return '<tr>' +
              '<td class="picon">' + iconFor(p.group) + '</td>' +
              '<td><strong>' + esc(p.name) + '</strong></td>' +
              '<td>' + esc(p.group) + '</td>' +
              '<td>' + esc(p.oem) + '</td>' +
              '<td>' + esc(p.dealer) + '</td>' +
              '<td>' + esc(p.after) + '</td>' +
              '</tr>';
          }).join('');
        }
        function renderAll() { renderSchedule(); renderParts(); renderCatalog(); }
        [fKm, fAge, fPrio, fCost, fCat].forEach(function (el) {
          el.addEventListener('change', renderAll);
        });
        fGroup.addEventListener('change', renderCatalog);
        fSearch.addEventListener('input', renderCatalog);
        // Chuyển tab (mỗi lần chỉ hiện 1 tab).
        function showTab(id) {
          ['sched', 'parts'].forEach(function (t) {
            document.getElementById('tab-' + t).hidden = t !== id;
          });
          Array.prototype.forEach.call(box.querySelectorAll('.tab'), function (b) {
            b.classList.toggle('active', b.getAttribute('data-tab') === id);
          });
        }
        Array.prototype.forEach.call(box.querySelectorAll('.tab'), function (b) {
          b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
        });
        window.openMaint = function (name) {
          title.textContent = name + ' — Bảo dưỡng & phụ tùng (lịch chung Toyota)';
          renderAll();
          showTab('sched');
          box.hidden = false;
        };
        window.closeMaint = function () { box.hidden = true; };
        box.addEventListener('click', function (e) {
          if (e.target === box) window.closeMaint();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.closeMaint();
        });
      })();
    </script>

    <script>
      (function () {
        var CARS = ${JSON.stringify(compareData).replace(/</g, '\\u003c')};
        var box = document.getElementById('comparebox');
        var selA = document.getElementById('cmp-a');
        var selB = document.getElementById('cmp-b');
        var body = document.getElementById('cmp-body');
        function esc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        // Đổ danh sách xe vào 2 dropdown.
        CARS.forEach(function (c, i) {
          var oa = document.createElement('option');
          oa.value = String(i); oa.textContent = c.name;
          selA.appendChild(oa);
          var ob = document.createElement('option');
          ob.value = String(i); ob.textContent = c.name;
          selB.appendChild(ob);
        });
        selA.value = '0';
        selB.value = CARS.length > 1 ? '1' : '0';
        function ulist(arr) {
          return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        }
        function bigImg(src) { return src; }
        function render() {
          var a = CARS[Number(selA.value)];
          var b = CARS[Number(selB.value)];
          var rows = [
            ['Ảnh', '<img src="' + bigImg(a.image) + '" alt="' + esc(a.name) + '" referrerpolicy="no-referrer" />',
                     '<img src="' + bigImg(b.image) + '" alt="' + esc(b.name) + '" referrerpolicy="no-referrer" />'],
            ['Giá tham khảo', esc(a.price), esc(b.price)],
            ['Phân khúc', esc(a.type), esc(b.type)],
            ['Động cơ', esc(a.engine), esc(b.engine)],
            ['Công suất', esc(a.power), esc(b.power)],
            ['Hộp số', esc(a.gearbox), esc(b.gearbox)],
            ['Số chỗ', esc(a.seats), esc(b.seats)],
            ['Dẫn động', esc(a.drive), esc(b.drive)],
            ['Tiêu hao', esc(a.fuel), esc(b.fuel)],
            ['✅ Ưu điểm', ulist(a.pros), ulist(b.pros)],
            ['⚠️ Nhược điểm', ulist(a.cons), ulist(b.cons)],
          ];
          body.innerHTML =
            '<table class="cmp-tbl"><thead><tr><th></th><th>' + esc(a.name) + '</th><th>' + esc(b.name) +
            '</th></tr></thead><tbody>' +
            rows.map(function (r) {
              return '<tr><td class="lbl">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
            }).join('') +
            '</tbody></table>';
        }
        selA.addEventListener('change', render);
        selB.addEventListener('change', render);
        window.openCompare = function () {
          render();
          box.hidden = false;
        };
        window.closeCompare = function () { box.hidden = true; };
        box.addEventListener('click', function (e) {
          if (e.target === box) window.closeCompare();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.closeCompare();
        });
      })();
    </script>

    <script>
      (function () {
        var RC = ${JSON.stringify(recoCars).replace(/</g, '\\u003c')};
        var box = document.getElementById('recobox');
        var form = document.getElementById('reco-form');
        var result = document.getElementById('reco-result');
        function esc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        function vnd(n) {
          return Math.round(n).toLocaleString('vi-VN') + 'đ';
        }
        var FEATURES = ['ADAS', 'Sunroof', 'Apple CarPlay', 'Android Auto', '360 Camera',
          'Leather Seats', 'Ventilated Seats', 'Cruise Control', 'Adaptive Cruise Control',
          'Blind Spot Monitor', 'Rear Camera'];
        var FEATURE_VI = {
          'ADAS': 'Gói an toàn ADAS', 'Sunroof': 'Cửa sổ trời', 'Apple CarPlay': 'Apple CarPlay',
          'Android Auto': 'Android Auto', '360 Camera': 'Camera 360', 'Leather Seats': 'Ghế da',
          'Ventilated Seats': 'Ghế thông gió', 'Cruise Control': 'Ga tự động',
          'Adaptive Cruise Control': 'Ga tự động thích ứng', 'Blind Spot Monitor': 'Cảnh báo điểm mù',
          'Rear Camera': 'Camera lùi',
        };
        // ---- Bộ câu hỏi (schema) ----
        var SECTIONS = [
          { title: '👤 Thông tin cá nhân', qs: [
            { id: 'income', t: 'number', label: 'Thu nhập / tháng (triệu)', ph: 'vd: 25' },
            { id: 'transBudget', t: 'number', label: 'Ngân sách đi lại / tháng (triệu)', ph: 'vd: 6' },
            { id: 'occupation', t: 'text', label: 'Nghề nghiệp', ph: 'vd: nhân viên văn phòng' },
            { id: 'city', t: 'text', label: 'Tỉnh / Thành phố', ph: 'vd: TP.HCM' },
            { id: 'familySize', t: 'number', label: 'Số thành viên gia đình', ph: 'vd: 4' },
            { id: 'children', t: 'number', label: 'Số con nhỏ', ph: 'vd: 2' },
            { id: 'parking', t: 'single', label: 'Có chỗ đỗ xe?', opts: ['Có', 'Không'] },
            { id: 'homeType', t: 'single', label: 'Loại nhà ở', opts: ['Chung cư', 'Nhà phố'] },
          ] },
          { title: '🚗 Thói quen lái', qs: [
            { id: 'dailyKm', t: 'number', label: 'Quãng đường / ngày (km)', ph: 'vd: 30' },
            { id: 'weeklyKm', t: 'number', label: 'Quãng đường / tuần (km)', ph: 'vd: 200' },
            { id: 'annualKm', t: 'number', label: 'Quãng đường / năm (km)', ph: 'vd: 15000' },
            { id: 'cityPct', t: 'slider', label: 'Tỉ lệ đi phố (%)', min: 0, max: 100, def: 70, unit: '%' },
            { id: 'weekend', t: 'dropdown', label: 'Đi chơi cuối tuần', opts: ['Hiếm khi', 'Thỉnh thoảng', 'Thường xuyên'] },
            { id: 'longTrip', t: 'dropdown', label: 'Đi đường dài', opts: ['Hiếm khi', 'Vài lần / năm', 'Hàng tháng'] },
            { id: 'road', t: 'single', label: 'Điều kiện đường', opts: ['Đường tốt', 'Hỗn hợp', 'Xấu / nhiều ổ gà'] },
            { id: 'passengers', t: 'number', label: 'Số người thường chở', ph: 'vd: 4' },
          ] },
          { title: '💰 Ngân sách', qs: [
            { id: 'budgetMax', t: 'number', label: 'Ngân sách tối đa cho xe (triệu)', ph: 'vd: 800' },
            { id: 'downPayment', t: 'number', label: 'Trả trước (triệu)', ph: 'vd: 300' },
            { id: 'loanAmount', t: 'number', label: 'Số tiền vay (triệu)', ph: 'vd: 500' },
            { id: 'monthlyPay', t: 'number', label: 'Trả góp mong muốn / tháng (triệu)', ph: 'vd: 10' },
            { id: 'financing', t: 'single', label: 'Hình thức mua', opts: ['Trả thẳng', 'Trả góp'] },
          ] },
          { title: '🎯 Sở thích xe', qs: [
            { id: 'bodyTypes', t: 'multi', label: 'Kiểu dáng ưa thích', opts: ['Sedan', 'SUV', 'MPV', 'Hatchback', 'Pickup', 'EV'] },
            { id: 'powertrain', t: 'multi', label: 'Hệ truyền động', opts: ['Hybrid', 'Xăng', 'Dầu'] },
            { id: 'brand', t: 'text', label: 'Hãng ưa thích (tùy chọn)', ph: 'vd: Toyota' },
            { id: 'transmission', t: 'single', label: 'Hộp số', opts: ['Số sàn', 'Tự động', 'Không quan trọng'] },
            { id: 'fuelType', t: 'dropdown', label: 'Loại nhiên liệu', opts: ['Không quan trọng', 'Xăng', 'Hybrid', 'Dầu'] },
            { id: 'minSeats', t: 'dropdown', label: 'Số chỗ tối thiểu', opts: ['4', '5', '7'] },
            { id: 'features', t: 'multi', label: 'Trang bị bắt buộc phải có', opts: FEATURES, vi: FEATURE_VI },
          ] },
          { title: '🔑 Ưu tiên sở hữu (chấm 1–5)', intro: 'Kéo thanh trượt: 1 = không quan trọng, 5 = rất quan trọng.', qs: [
            { id: 'keepYears', t: 'number', label: 'Dự định giữ xe (năm)', ph: 'vd: 7' },
            { id: 'impFuel', t: 'rate', label: 'Tiết kiệm nhiên liệu' },
            { id: 'impRel', t: 'rate', label: 'Độ bền / tin cậy' },
            { id: 'impMaint', t: 'rate', label: 'Chi phí bảo dưỡng thấp' },
            { id: 'impSafety', t: 'rate', label: 'An toàn' },
            { id: 'impComfort', t: 'rate', label: 'Tiện nghi' },
            { id: 'impPerf', t: 'rate', label: 'Vận hành / sức mạnh' },
            { id: 'impTech', t: 'rate', label: 'Công nghệ' },
            { id: 'impResale', t: 'rate', label: 'Giữ giá' },
            { id: 'impCargo', t: 'rate', label: 'Khoang hành lý' },
            { id: 'impBrand', t: 'rate', label: 'Thương hiệu' },
          ] },
          { title: '📝 Ghi chú thêm', qs: [
            { id: 'notes', t: 'text', label: 'Bạn còn điều gì quan trọng muốn chia sẻ?', ph: 'vd: hay chở ba mẹ lớn tuổi, cần gầm cao...' },
          ] },
        ];
        // ---- Render form ----
        function renderForm() {
          var html = '';
          SECTIONS.forEach(function (sec) {
            html += '<div class="reco-sec"><h4>' + esc(sec.title) + '</h4>';
            if (sec.intro) html += '<p class="reco-intro" style="margin:-0.3rem 0 0.7rem">' + esc(sec.intro) + '</p>';
            html += '<div class="reco-grid">';
            sec.qs.forEach(function (q) {
              if (q.t === 'single') {
                html += '<div class="reco-q"><span class="qlabel">' + esc(q.label) + '</span><div class="reco-opts">';
                q.opts.forEach(function (o, i) {
                  html += '<label><input type="radio" name="q-' + q.id + '" value="' + esc(o) + '"' +
                    (i === 0 ? ' checked' : '') + ' />' + esc(o) + '</label>';
                });
                html += '</div></div>';
                return;
              }
              if (q.t === 'multi') {
                html += '<div class="reco-q" style="grid-column:1/-1"><span class="qlabel">' + esc(q.label) +
                  '</span><div class="reco-opts">';
                q.opts.forEach(function (o) {
                  var lbl = q.vi && q.vi[o] ? q.vi[o] : o;
                  html += '<label><input type="checkbox" name="q-' + q.id + '" value="' + esc(o) + '" />' +
                    esc(lbl) + '</label>';
                });
                html += '</div></div>';
                return;
              }
              html += '<label class="reco-q"><span class="qlabel">' + esc(q.label) + '</span>';
              if (q.t === 'number') {
                html += '<input type="number" min="0" id="q-' + q.id + '" placeholder="' + esc(q.ph || '') + '" />';
              } else if (q.t === 'text') {
                html += '<input type="text" id="q-' + q.id + '" placeholder="' + esc(q.ph || '') + '" />';
              } else if (q.t === 'dropdown') {
                html += '<select id="q-' + q.id + '">';
                q.opts.forEach(function (o) { html += '<option value="' + esc(o) + '">' + esc(o) + '</option>'; });
                html += '</select>';
              } else if (q.t === 'slider') {
                html += '<span class="reco-range"><input type="range" id="q-' + q.id + '" min="' + q.min + '" max="' + q.max +
                  '" value="' + q.def + '" oninput="this.nextElementSibling.value=this.value+\\'' + (q.unit || '') +
                  '\\'" /><output>' + q.def + (q.unit || '') + '</output></span>';
              } else if (q.t === 'rate') {
                html += '<span class="reco-rate"><input type="range" id="q-' + q.id + '" min="1" max="5" value="3" ' +
                  'oninput="this.nextElementSibling.value=this.value" /><output>3</output></span>';
              }
              html += '</label>';
            });
            html += '</div></div>';
          });
          html += '<div class="reco-actions">' +
            '<button type="button" class="primary" onclick="window.runReco()">🔍 Phân tích &amp; Gợi ý</button>' +
            '<button type="button" class="ghost" onclick="window.resetReco()">↺ Làm lại</button>' +
            '</div>';
          form.innerHTML = html;
        }
        // ---- Đọc giá trị ----
        function num(id, dflt) {
          var el = document.getElementById('q-' + id);
          if (!el) return dflt;
          var v = parseFloat(el.value);
          return isNaN(v) ? dflt : v;
        }
        function txt(id) {
          var el = document.getElementById('q-' + id);
          return el ? el.value.trim() : '';
        }
        function radio(id) {
          var el = form.querySelector('input[name="q-' + id + '"]:checked');
          return el ? el.value : '';
        }
        function checks(id) {
          var els = form.querySelectorAll('input[name="q-' + id + '"]:checked');
          return Array.prototype.map.call(els, function (e) { return e.value; });
        }
        function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
        function pct(v) { return clamp(Math.round(v), 0, 100); }
        // ---- Engine chấm điểm ----
        function analyze() {
          var income = num('income', 0);
          var transBudget = num('transBudget', 0);
          var familySize = num('familySize', 0);
          var children = num('children', 0);
          var parking = radio('parking');
          var dailyKm = num('dailyKm', 0);
          var weeklyKm = num('weeklyKm', 0);
          var annualKm = num('annualKm', 0);
          var cityPct = num('cityPct', 70);
          var weekend = document.getElementById('q-weekend').value;
          var longTrip = document.getElementById('q-longTrip').value;
          var road = radio('road');
          var passengers = num('passengers', 0);
          var budgetMax = num('budgetMax', 0);
          var loanAmount = num('loanAmount', 0);
          var monthlyPay = num('monthlyPay', 0);
          var financing = radio('financing');
          var bodyTypes = checks('bodyTypes');
          var powertrain = checks('powertrain');
          var transmission = radio('transmission');
          var fuelPref = document.getElementById('q-fuelType').value;
          var minSeats = parseInt(document.getElementById('q-minSeats').value, 10) || 0;
          var mustHave = checks('features');
          var keepYears = clamp(num('keepYears', 7), 1, 15);
          var notesRaw = txt('notes');
          var notes = notesRaw.toLowerCase();
          var imp = {
            fuel: num('impFuel', 3), rel: num('impRel', 3), maint: num('impMaint', 3),
            safety: num('impSafety', 3), comfort: num('impComfort', 3), perf: num('impPerf', 3),
            tech: num('impTech', 3), resale: num('impResale', 3), cargo: num('impCargo', 3),
            brand: num('impBrand', 3),
          };
          // Số km/năm suy ra từ dữ liệu tốt nhất có.
          var kmYear = annualKm > 0 ? annualKm : weeklyKm > 0 ? weeklyKm * 52 : dailyKm > 0 ? dailyKm * 320 : 15000;
          var neededSeats = Math.max(passengers, familySize, minSeats);
          // Ghi chú: bắt vài từ khóa.
          var noteOff = /off-?road|địa hình|ổ gà|gầm cao|leo|núi|đường xấu/.test(notes);
          var noteFamily = /gia đình|con nhỏ|ba mẹ|bố mẹ|ông bà|7 chỗ|đại gia đình/.test(notes);

          function monthlyCost(car) {
            var priceAvg = (car.priceMin + car.priceMax) / 2 * 1e6;
            var fuelPrice = 23500;
            var fuel = kmYear / 100 * car.fuelLkm * fuelPrice / 12;
            var insurance = priceAvg * 0.015 / 12;
            var maintYear = priceAvg < 500e6 ? 4.2e6 : priceAvg < 900e6 ? 6.0e6 : priceAvg < 1500e6 ? 9.0e6 : 18e6;
            var maint = maintYear / 12;
            var registration = 1560000 / 12;
            var park = parking === 'Không' ? 1500000 : 0;
            var loan = 0;
            if (financing === 'Trả góp' && loanAmount > 0) {
              var term = clamp(keepYears, 3, 8);
              var r = 0.105 / 12;
              var n = term * 12;
              loan = loanAmount * 1e6 * r / (1 - Math.pow(1 + r, -n));
            }
            var total = fuel + insurance + maint + registration + park + loan;
            return { fuel: fuel, insurance: insurance, maint: maint, registration: registration, park: park, loan: loan, total: total };
          }

          var results = RC.map(function (car) {
            var R = car.ratings;
            var cost = monthlyCost(car);
            // Budget match.
            var budgetScore;
            if (budgetMax <= 0) budgetScore = 70;
            else if (car.priceMax <= budgetMax) budgetScore = 100;
            else if (car.priceMin <= budgetMax) budgetScore = 80;
            else budgetScore = pct(100 - (car.priceMin - budgetMax) / budgetMax * 130);
            // Khả năng chi trả theo ngân sách đi lại / thu nhập.
            var afford;
            var capMonthly = transBudget > 0 ? transBudget * 1e6 : income > 0 ? income * 1e6 * 0.30 : 0;
            if (capMonthly <= 0) afford = 70;
            else if (cost.total <= capMonthly) afford = 100;
            else afford = pct(100 - (cost.total - capMonthly) / capMonthly * 110);
            // Chi phí vận hành (nhiên liệu + bảo dưỡng).
            var running = pct(R.fuelEcon / 5 * 60 + (6 - maintTier(car)) / 5 * 40);
            var comfort = R.comfort / 5 * 100;
            var safety = R.safety / 5 * 100;
            var tech = R.tech / 5 * 100;
            var reliability = R.reliability / 5 * 100;
            var fuelEcon = R.fuelEcon / 5 * 100;
            // Phù hợp gia đình: số chỗ vs nhu cầu + điểm family.
            var seatScore = car.seats >= neededSeats ? 100 : pct(100 - (neededSeats - car.seats) * 28);
            var family = pct(seatScore * 0.6 + R.family / 5 * 100 * 0.4);
            // Trọng số từ mức độ ưu tiên (mặc định 3).
            var subs = [
              { key: 'budget', label: 'Phù hợp ngân sách', v: budgetScore, w: 5 },
              { key: 'running', label: 'Chi phí vận hành', v: running, w: imp.maint },
              { key: 'comfort', label: 'Tiện nghi', v: comfort, w: imp.comfort },
              { key: 'family', label: 'Phù hợp gia đình', v: family, w: children > 0 || noteFamily ? 4.5 : 2 },
              { key: 'safety', label: 'An toàn', v: safety, w: imp.safety },
              { key: 'tech', label: 'Công nghệ', v: tech, w: imp.tech },
              { key: 'reliability', label: 'Độ bền', v: reliability, w: imp.rel },
              { key: 'fuelEcon', label: 'Tiết kiệm xăng', v: fuelEcon, w: imp.fuel },
              { key: 'afford', label: 'Khả năng chi trả', v: afford, w: 4 },
              { key: 'perf', label: 'Vận hành', v: R.performance / 5 * 100, w: imp.perf },
              { key: 'resale', label: 'Giữ giá', v: R.resale / 5 * 100, w: imp.resale },
              { key: 'cargo', label: 'Khoang hành lý', v: R.cargo / 5 * 100, w: imp.cargo },
              { key: 'brand', label: 'Thương hiệu', v: R.brandRep / 5 * 100, w: imp.brand },
            ];
            var wsum = 0, vsum = 0;
            subs.forEach(function (s) { wsum += s.w; vsum += s.v * s.w; });
            var overall = vsum / wsum;
            // Thưởng / phạt khớp sở thích.
            var penalties = [];
            if (bodyTypes.length) {
              if (bodyTypes.indexOf(car.body) >= 0) overall += 6;
              else if (bodyTypes.indexOf('Pickup') >= 0 || bodyTypes.indexOf('EV') >= 0) overall -= 2;
              else overall -= 10;
            }
            if (minSeats && car.seats < minSeats) { overall -= 16; penalties.push('Ít hơn ' + minSeats + ' chỗ'); }
            if (neededSeats > car.seats) { overall -= 8; penalties.push('Có thể chật khi chở ' + neededSeats + ' người'); }
            if (transmission === 'Số sàn' && car.trans.indexOf('sàn') < 0) overall -= 4;
            if (fuelPref && fuelPref !== 'Không quan trọng' && car.fuelTypes.indexOf(fuelPref) < 0) {
              overall -= 6; penalties.push('Không có bản ' + fuelPref);
            }
            if (powertrain.length) {
              var ptOk = powertrain.some(function (p) { return car.fuelTypes.indexOf(p) >= 0; });
              if (!ptOk) overall -= 5;
            }
            if (noteOff && car.body === 'SUV' && /4WD|RWD|2 cầu/.test(car.drive)) overall += 4;
            // Trang bị bắt buộc.
            var missing = mustHave.filter(function (f) { return car.features.indexOf(f) < 0; });
            overall -= missing.length * 4;
            overall = pct(overall);

            // Lý do (ngôn ngữ tự nhiên).
            var why = buildWhy(car, {
              children: children, familySize: familySize, neededSeats: neededSeats, weekend: weekend,
              longTrip: longTrip, road: road, budgetMax: budgetMax, imp: imp, kmYear: kmYear,
              noteOff: noteOff, noteFamily: noteFamily, bodyTypes: bodyTypes,
            });

            return {
              car: car, overall: overall, subs: subs, cost: cost,
              missing: missing, penalties: penalties, why: why, neededSeats: neededSeats,
            };
          });

          results.sort(function (a, b) { return b.overall - a.overall; });
          var profile = [
            'Thu nhập ~' + income + ' tr/tháng, ngân sách đi lại ~' + transBudget + ' tr/tháng.',
            'Gia đình ' + familySize + ' người' + (children > 0 ? ', ' + children + ' con nhỏ' : '') + '; ' +
              (parking === 'Không' ? 'không có chỗ đỗ.' : 'có chỗ đỗ.'),
            'Đi ~' + Math.round(kmYear) + ' km/năm, ~' + cityPct + '% trong phố; cuối tuần: ' + weekend +
              '; đường dài: ' + longTrip + '; đường: ' + road + '; thường chở ' + passengers + ' người.',
            'Ngân sách xe tối đa ' + budgetMax + ' tr; hình thức ' + financing +
              (loanAmount > 0 ? ', vay ' + loanAmount + ' tr' : '') + '.',
            'Kiểu dáng thích: ' + (bodyTypes.join(', ') || 'không nêu') + '; nhiên liệu: ' + fuelPref +
              '; hộp số: ' + transmission + '; tối thiểu ' + minSeats + ' chỗ.',
            mustHave.length ? ('Trang bị bắt buộc: ' + mustHave.join(', ') + '.') : '',
            'Ưu tiên 1-5 — tiết kiệm:' + imp.fuel + ', bền:' + imp.rel + ', bảo dưỡng:' + imp.maint +
              ', an toàn:' + imp.safety + ', tiện nghi:' + imp.comfort + ', vận hành:' + imp.perf +
              ', công nghệ:' + imp.tech + ', giữ giá:' + imp.resale + ', hành lý:' + imp.cargo +
              ', thương hiệu:' + imp.brand + '.',
            'Dự định giữ xe ' + keepYears + ' năm.',
            notesRaw ? ('Ghi chú thêm: ' + notesRaw) : '',
          ].filter(function (s) { return s; }).join(' ');
          return { results: results, profile: profile, ctx: { neededSeats: neededSeats, budgetMax: budgetMax } };
        }
        function maintTier(car) {
          var p = (car.priceMin + car.priceMax) / 2;
          return p < 500 ? 1 : p < 900 ? 2 : p < 1500 ? 3 : 5;
        }
        function buildWhy(car, u) {
          var parts = [];
          var model = car.name.replace('Toyota ', '');
          if (car.body === 'MPV' || (car.seats >= 7 && (u.children > 0 || u.noteFamily || u.neededSeats >= 6))) {
            parts.push('với ' + car.seats + ' chỗ ngồi, ' + model + ' thoải mái cho gia đình' +
              (u.children > 0 ? ' có ' + u.children + ' bé' : ''));
          }
          if (u.weekend === 'Thường xuyên' || u.longTrip === 'Hàng tháng') {
            parts.push('phù hợp cho các chuyến đi chơi cuối tuần và đường dài bạn hay đi');
          }
          if (u.noteOff || u.road === 'Xấu / nhiều ổ gà') {
            if (car.body === 'SUV') parts.push('gầm cao chịu được đường xấu');
          }
          if (u.imp.fuel >= 4 && car.ratings.fuelEcon >= 4) {
            parts.push('rất tiết kiệm nhiên liệu (~' + car.fuelLkm + ' L/100km' + (car.hybrid ? ', có bản hybrid' : '') + ')');
          }
          if (u.imp.safety >= 4 && car.ratings.safety >= 4) parts.push('điểm an toàn cao');
          if (u.imp.comfort >= 4 && car.ratings.comfort >= 4) parts.push('nội thất tiện nghi êm ái');
          if (u.imp.resale >= 4 && car.ratings.resale >= 4) parts.push('giữ giá tốt khi bán lại');
          if (u.budgetMax > 0 && car.priceMax <= u.budgetMax) parts.push('nằm gọn trong ngân sách của bạn');
          if (!parts.length) parts.push('cân bằng tốt giữa chi phí, độ bền và nhu cầu sử dụng hằng ngày của bạn');
          var s = model + ' phù hợp vì ' + parts.join(', ') + '.';
          return s.charAt(0).toUpperCase() + s.slice(1);
        }
        // ---- Render kết quả ----
        function altFor(target, all) {
          return all.filter(function (r) { return r.car.name !== target.car.name; })
            .map(function (r) {
              var bodyClose = r.car.body === target.car.body ? 0 : 1;
              var priceClose = Math.abs((r.car.priceMin + r.car.priceMax) - (target.car.priceMin + target.car.priceMax));
              return { r: r, d: bodyClose * 5000 + priceClose };
            })
            .sort(function (a, b) { return a.d - b.d; })
            .slice(0, 2).map(function (x) { return x.r.car; });
        }
        function scoreBar(label, v) {
          return '<div class="score-row"><div class="sr-top"><span>' + esc(label) + '</span><strong>' +
            Math.round(v) + '%</strong></div><div class="bar"><i style="width:' + Math.round(v) + '%"></i></div></div>';
        }
        function costTable(c) {
          var rows = [['🏦 Trả góp', c.loan], ['⛽ Nhiên liệu', c.fuel], ['🛡️ Bảo hiểm', c.insurance],
            ['🔧 Bảo dưỡng', c.maint], ['📋 Phí đường bộ', c.registration]];
          if (c.park > 0) rows.push(['🅿️ Gửi xe', c.park]);
          var html = '<table class="cost-tbl"><tbody>';
          rows.forEach(function (r) {
            if (r[1] <= 0) return;
            html += '<tr><td>' + r[0] + '</td><td>' + vnd(r[1]) + '</td></tr>';
          });
          html += '<tr class="total"><td>Tổng / tháng</td><td>' + vnd(c.total) + '</td></tr></tbody></table>';
          return html;
        }
        var SHOW_KEYS = ['budget', 'running', 'comfort', 'family', 'safety', 'tech', 'reliability', 'fuelEcon'];
        function renderResult(data) {
          var top = data.results.slice(0, 3);
          var html = '<div class="rec-toggle">' +
            '<button type="button" class="ghost" onclick="window.backToForm()">↩ Sửa câu trả lời</button>' +
            '<button type="button" class="primary" onclick="window.toggleRecoCompare()">⚖️ So sánh 3 xe</button>' +
            '<button type="button" class="primary" onclick="window.runDeepAI()">🧠 Phân tích chuyên sâu (AI)</button>' +
            '</div>';
          html += '<div id="rec-compare" hidden></div>';
          html += '<div id="ai-deep"></div>';
          html += '<div class="rec-list">';
          top.forEach(function (item, i) {
            var car = item.car;
            var model = car.name.replace('Toyota ', '');
            var alts = altFor(item, data.results);
            html += '<div class="rec-item' + (i === 0 ? ' top' : '') + '">';
            html += '<div class="rec-head">';
            html += '<img src="' + car.image + '" alt="' + esc(car.name) + '" referrerpolicy="no-referrer" />';
            html += '<div class="rec-headinfo"><span class="rec-rank">#' + (i + 1) +
              (i === 0 ? ' • Phù hợp nhất' : '') + '</span>';
            html += '<div class="rec-name">' + esc(car.name) + '</div>';
            html += '<div class="rec-meta">Hãng: <strong>Toyota</strong> • Mẫu: ' + esc(model) +
              ' • Đời: 2026<br/>Động cơ: ' + esc(car.engine) + '<br/>Hộp số: ' + esc(car.gearbox) +
              '<br/>Nhiên liệu: ' + esc(car.fuelTypes.join(' / ')) + ' • ' + esc(car.price) + '</div></div>';
            html += '<div class="rec-overall"><div class="big">' + item.overall + '%</div>' +
              '<div class="cap">Mức phù hợp</div></div>';
            html += '</div>'; // rec-head
            html += '<div class="rec-why">💡 ' + esc(item.why) + '</div>';
            // Điểm thành phần.
            html += '<div class="score-grid">';
            SHOW_KEYS.forEach(function (k) {
              var s = item.subs.filter(function (x) { return x.key === k; })[0];
              if (s) html += scoreBar(s.label, s.v);
            });
            html += '</div>';
            // Chi phí.
            html += '<h5 style="margin:0.6rem 0 0.2rem;color:var(--accent)">💵 Chi phí sở hữu / tháng (ước tính)</h5>';
            html += costTable(item.cost);
            // Pros / cons.
            html += '<div class="proscons"><div class="pc-pro"><h5>✅ Ưu điểm</h5><ul>' +
              car.pros.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>';
            var cons = car.cons.slice();
            item.penalties.forEach(function (p) { cons.push(p); });
            html += '<div class="pc-con"><h5>⚠️ Nhược điểm</h5><ul>' +
              cons.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div></div>';
            // Alternatives.
            if (alts.length) {
              html += '<div class="rec-alt">🔁 Lựa chọn tương tự: ' +
                alts.map(function (a) { return '<span class="chip">' + esc(a.name.replace('Toyota ', '')) +
                  ' • ' + esc(a.price) + '</span>'; }).join('') + '</div>';
            }
            html += '</div>'; // rec-item
          });
          html += '</div>';
          // Ghi chú cân bằng / trade-off.
          if (top.length >= 2 && top[0].overall - top[1].overall <= 6) {
            html += '<p class="reco-intro" style="margin-top:1rem">⚖️ <strong>Đánh đổi:</strong> ' +
              esc(top[0].car.name.replace('Toyota ', '')) + ' và ' + esc(top[1].car.name.replace('Toyota ', '')) +
              ' rất sát nhau. Chọn ' + esc(top[0].car.name.replace('Toyota ', '')) +
              ' nếu ưu tiên điểm tổng thể, hoặc cân nhắc ' + esc(top[1].car.name.replace('Toyota ', '')) +
              ' nếu hợp gu hơn về kiểu dáng/giá.</p>';
          }
          html += '<p class="reco-intro" style="margin-top:0.6rem;font-size:0.8rem">' +
            '* Gợi ý dựa trên dữ liệu tham khảo trong dải xe Toyota của trang. Chi phí là ước tính ' +
            '(xăng ~23.500đ/L, bảo hiểm ~1,5%/năm, lãi vay ~10,5%/năm) — số thực tế tùy đại lý, khu vực &amp; thời điểm.</p>';
          result.innerHTML = html;
          window._recoTop = top;
          window._recoProfile = data.profile || '';
          window._recoPayload = top.map(function (t) {
            var c = t.car;
            return {
              name: c.name, price: c.price, body: c.body, seats: c.seats,
              engine: c.engine, gearbox: c.gearbox, fuelStr: c.fuelStr,
              fuelLkm: c.fuelLkm, hp: c.hp, drive: c.drive, warranty: c.warranty,
              overall: t.overall, monthly: Math.round(t.cost.total),
            };
          });
        }
        // ---- So sánh 3 xe gợi ý ----
        window.toggleRecoCompare = function () {
          var el = document.getElementById('rec-compare');
          if (!el) return;
          if (!el.hidden) { el.hidden = true; el.innerHTML = ''; return; }
          var top = window._recoTop || [];
          var rows = [
            ['Giá', function (c) { return c.price; }],
            ['Tiêu hao', function (c) { return c.fuelLkm + ' L/100km'; }],
            ['Khoang hành lý', function (c) { return c.cargo + ' L'; }],
            ['Công suất', function (c) { return c.hp + ' mã lực'; }],
            ['Số chỗ', function (c) { return c.seats + ' chỗ'; }],
            ['Dẫn động', function (c) { return c.drive; }],
            ['Bảo hành', function (c) { return c.warranty; }],
            ['An toàn', function (c) { return '★'.repeat(c.ratings.safety); }],
            ['Độ bền', function (c) { return '★'.repeat(c.ratings.reliability); }],
          ];
          var html = '<table class="cmp-tbl"><thead><tr><th></th>' +
            top.map(function (t) { return '<th>' + esc(t.car.name.replace('Toyota ', '')) + '</th>'; }).join('') +
            '</tr></thead><tbody>';
          html += '<tr><td class="lbl">Chi phí / tháng</td>' +
            top.map(function (t) { return '<td>' + vnd(t.cost.total) + '</td>'; }).join('') + '</tr>';
          rows.forEach(function (r) {
            var vals = top.map(function (t) { return r[1](t.car); });
            var allSame = vals.every(function (v) { return v === vals[0]; });
            html += '<tr><td class="lbl">' + esc(r[0]) + '</td>' +
              vals.map(function (v) {
                return '<td' + (allSame ? '' : ' style="color:var(--accent)"') + '>' + esc(v) + '</td>';
              }).join('') + '</tr>';
          });
          html += '</tbody></table>';
          el.innerHTML = html;
          el.hidden = false;
        };
        // Chuyển markdown đơn giản từ AI -> HTML an toàn.
        function mdToHtml(t) {
          var safe = esc(t).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
          var lines = safe.split(/\\n/);
          var html = '';
          var inList = false;
          lines.forEach(function (ln) {
            if (/^\\s*[-*\u2022]\\s+/.test(ln)) {
              if (!inList) { html += '<ul>'; inList = true; }
              html += '<li>' + ln.replace(/^\\s*[-*\u2022]\\s+/, '') + '</li>';
            } else {
              if (inList) { html += '</ul>'; inList = false; }
              if (/^\\s*#{1,3}\\s+/.test(ln)) html += '<h5>' + ln.replace(/^\\s*#{1,3}\\s+/, '') + '</h5>';
              else if (ln.trim()) html += '<p>' + ln + '</p>';
            }
          });
          if (inList) html += '</ul>';
          return html;
        }
        // Gọi AI thật (Gemini) qua backend; có fallback khi thiếu key/lỗi mạng.
        window.runDeepAI = function () {
          var el = document.getElementById('ai-deep');
          if (!el) return;
          el.innerHTML = '<div class="ai-box ai-loading">🧠 Đang nhờ AI phân tích chuyên sâu…</div>';
          fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: window._recoProfile || '', cars: window._recoPayload || [] }),
          })
            .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
            .then(function (res) {
              if (res.j && res.j.ok && res.j.analysis) {
                el.innerHTML = '<div class="ai-box"><div class="ai-head">🧠 Phân tích chuyên sâu bằng AI ' +
                  '<span class="ai-badge">' + esc(res.j.model || 'AI') + '</span></div>' +
                  '<div class="ai-text">' + mdToHtml(res.j.analysis) + '</div></div>';
              } else {
                var msg = res.j && res.j.error ? res.j.error : 'Không gọi được AI.';
                el.innerHTML = '<div class="ai-box ai-warn">⚠️ ' + esc(msg) +
                  '<br/><span style="opacity:.8">Bạn vẫn có đầy đủ kết quả gợi ý offline ở trên.</span></div>';
              }
            })
            .catch(function (e) {
              el.innerHTML = '<div class="ai-box ai-warn">⚠️ Lỗi kết nối tới máy chủ: ' + esc(e.message) + '</div>';
            });
        };
        window.runReco = function () {
          var data = analyze();
          form.hidden = true;
          result.hidden = false;
          renderResult(data);
          box.querySelector('.reco-scroll').scrollTop = 0;
        };
        window.backToForm = function () {
          result.hidden = true;
          result.innerHTML = '';
          form.hidden = false;
          box.querySelector('.reco-scroll').scrollTop = 0;
        };
        window.resetReco = function () {
          renderForm();
        };
        window.openReco = function () {
          if (!form.children.length) renderForm();
          form.hidden = false;
          result.hidden = true;
          box.hidden = false;
        };
        window.closeReco = function () { box.hidden = true; };
        box.addEventListener('click', function (e) {
          if (e.target === box) window.closeReco();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !box.hidden) window.closeReco();
        });
      })();
    </script>
  </body>
</html>`;

homeRouter.get('/', (_req: Request, res: Response) => {
  res.type('html').send(page);
});
