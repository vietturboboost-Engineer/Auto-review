// Lưu trữ đánh giá/bình luận của người dùng cho từng xe.
// Dùng file JSON tại DATA_DIR (mặc định <project>/data; prod set DATA_DIR=/data trỏ vào Fly volume).
// Đơn giản, đồng bộ — phù hợp 1 instance. Tự seed vài đánh giá mẫu khi chưa có dữ liệu.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { vehicles } from './vehicles.js';

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Store {
  version: number;
  reviews: Record<string, Review[]>;
}

export class ReviewError extends Error {}

const validIds = new Set(vehicles.map((v) => v.id));

export function isKnownVehicle(id: string): boolean {
  return validIds.has(id);
}

function dataDir(): string {
  return (
    process.env.DATA_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data')
  );
}

function dataFile(): string {
  return join(dataDir(), 'reviews.json');
}

function persist(store: Store): void {
  try {
    const dir = dataDir();
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(dataFile(), JSON.stringify(store, null, 2), 'utf8');
  } catch {
    // Best-effort: nếu không ghi được (vd quyền truy cập), vẫn dùng dữ liệu trong bộ nhớ.
  }
}

function seed(): Store {
  const ids = vehicles.slice(0, 6).map((v) => v.id);
  const samples: Array<[string, number, string]> = [
    ['Minh Anh', 5, 'Xe đi êm, tiết kiệm xăng, rất hài lòng sau hơn 1 năm sử dụng.'],
    ['Quốc Huy', 4, 'Thiết kế đẹp, nội thất ổn nhưng cách âm chưa thật sự tốt.'],
    ['Thu Hà', 5, 'Dịch vụ hãng chu đáo, chi phí bảo dưỡng hợp lý, hợp gia đình.'],
    ['Anh Tuấn', 4, 'Vận hành ổn định, giữ giá tốt khi bán lại sau vài năm.'],
    ['Lan Phương', 3, 'Tầm giá này tạm ổn nhưng trang bị hơi ít so với đối thủ.'],
  ];
  const reviews: Record<string, Review[]> = {};
  const base = Date.now();
  ids.forEach((id, i) => {
    const picks = [samples[i % samples.length], samples[(i + 2) % samples.length]];
    reviews[id] = picks.map((p, j) => ({
      id: randomUUID(),
      name: p[0],
      rating: p[1],
      comment: p[2],
      createdAt: new Date(base - (i * 3 + j + 1) * 86_400_000).toISOString(),
    }));
  });
  return { version: 1, reviews };
}

function load(): Store {
  const file = dataFile();
  if (!existsSync(file)) {
    const s = seed();
    persist(s);
    return s;
  }
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as Store;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.reviews !== 'object') {
      throw new Error('bad store');
    }
    return parsed;
  } catch {
    const s = seed();
    persist(s);
    return s;
  }
}

export function listReviews(vehicleId: string): Review[] {
  const s = load();
  return (s.reviews[vehicleId] ?? [])
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function summarize(vehicleId: string): { count: number; avg: number } {
  const r = listReviews(vehicleId);
  if (r.length === 0) return { count: 0, avg: 0 };
  const avg = r.reduce((sum, x) => sum + x.rating, 0) / r.length;
  return { count: r.length, avg: Math.round(avg * 10) / 10 };
}

export interface NewReviewInput {
  name?: unknown;
  rating?: unknown;
  comment?: unknown;
}

export function addReview(vehicleId: string, input: NewReviewInput): Review {
  const rating = Math.trunc(Number(input.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new ReviewError('Số sao phải từ 1 đến 5.');
  }
  const comment = String(input.comment ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600);
  if (comment.length < 1) {
    throw new ReviewError('Vui lòng nhập nội dung đánh giá.');
  }
  let name = String(input.name ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 40);
  if (!name) name = 'Ẩn danh';

  const review: Review = {
    id: randomUUID(),
    name,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  const s = load();
  const arr = s.reviews[vehicleId] ?? (s.reviews[vehicleId] = []);
  arr.push(review);
  if (arr.length > 200) s.reviews[vehicleId] = arr.slice(-200);
  persist(s);
  return review;
}
