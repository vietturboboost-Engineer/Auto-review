import { describe, it, expect, beforeAll } from 'vitest';
import { tmpdir } from 'node:os';
import { mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import request from 'supertest';

// Trỏ DATA_DIR sang thư mục tạm TRƯỚC khi import app/store để test cô lập.
const tmp = mkdtempSync(join(tmpdir(), 'reviews-test-'));
process.env.DATA_DIR = tmp;

const { createApp } = await import('../app.js');
const { vehicles } = await import('../data/vehicles.js');

describe('Reviews API /api/reviews', () => {
  const app = createApp();
  const seededId = vehicles[0].id; // 6 xe đầu được seed sẵn đánh giá mẫu

  beforeAll(() => {
    process.env.DATA_DIR = tmp;
  });

  it('GET trả đánh giá đã seed cho xe hợp lệ', async () => {
    const res = await request(app).get(`/api/reviews/${seededId}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body.reviews.length).toBeGreaterThan(0);
    expect(res.body.summary.count).toBe(res.body.reviews.length);
  });

  it('GET trả 404 với xe không tồn tại', async () => {
    const res = await request(app).get('/api/reviews/khong-co-xe-nay');
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  it('POST thêm đánh giá hợp lệ', async () => {
    const before = await request(app).get(`/api/reviews/${seededId}`);
    const res = await request(app)
      .post(`/api/reviews/${seededId}`)
      .send({ name: 'Người Dùng', rating: 5, comment: 'Rất tốt, đáng tiền.' });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.review.rating).toBe(5);
    expect(res.body.summary.count).toBe(before.body.summary.count + 1);
  });

  it('POST mặc định tên "Ẩn danh" khi bỏ trống', async () => {
    const res = await request(app)
      .post(`/api/reviews/${seededId}`)
      .send({ rating: 4, comment: 'Ổn trong tầm giá.' });
    expect(res.status).toBe(201);
    expect(res.body.review.name).toBe('Ẩn danh');
  });

  it('POST trả 400 khi số sao không hợp lệ', async () => {
    const res = await request(app)
      .post(`/api/reviews/${seededId}`)
      .send({ rating: 9, comment: 'Sao sai.' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('POST trả 400 khi thiếu nội dung', async () => {
    const res = await request(app)
      .post(`/api/reviews/${seededId}`)
      .send({ rating: 4, comment: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('POST trả 404 với xe không tồn tại', async () => {
    const res = await request(app)
      .post('/api/reviews/khong-co-xe-nay')
      .send({ rating: 4, comment: 'Test.' });
    expect(res.status).toBe(404);
  });
});
