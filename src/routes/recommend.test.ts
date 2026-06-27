import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('POST /api/recommend', () => {
  const app = createApp();

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('trả 400 khi thiếu danh sách xe', async () => {
    const res = await request(app).post('/api/recommend').send({ profile: 'x', cars: [] });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('trả 503 khi máy chủ chưa có GEMINI_API_KEY', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await request(app)
      .post('/api/recommend')
      .send({ cars: [{ name: 'Toyota Vios' }] });
    expect(res.status).toBe(503);
    expect(res.body.ok).toBe(false);
  });

  it('trả phân tích khi có key (mock Gemini)', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const fakeFetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Phân tích AI mẫu.' }] } }],
      }),
    }));
    vi.stubGlobal('fetch', fakeFetch);

    const res = await request(app)
      .post('/api/recommend')
      .send({
        profile: 'gia đình 4 người',
        cars: [{ name: 'Toyota Vios', price: '500', overall: 90 }],
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.analysis).toContain('Phân tích AI mẫu');
    expect(fakeFetch).toHaveBeenCalledOnce();
    // Không được lộ API key ra response.
    expect(JSON.stringify(res.body)).not.toContain('test-key');
  });

  it('trả 502 khi Gemini lỗi', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 429, json: async () => ({}) })),
    );
    const res = await request(app)
      .post('/api/recommend')
      .send({ cars: [{ name: 'Toyota Vios' }] });
    expect(res.status).toBe(502);
    expect(res.body.ok).toBe(false);
  });
});
