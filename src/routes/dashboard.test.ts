import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('GET / (multi-brand dashboard)', () => {
  const app = createApp();

  it('returns 200 HTML with the dashboard shell', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('AutoReview');
    expect(res.text).toContain('Chọn theo hãng');
  });

  it('renders brand chips and vehicle cards from the data layer', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Toyota');
    expect(res.text).toContain('VinFast');
    expect(res.text).toContain('data-act="detail"');
    expect(res.text).toContain('data-act="compare"');
  });

  it('exposes the AI recommendation and theme toggle entry points', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Gợi ý xe bằng AI');
    expect(res.text).toContain('id="themebtn"');
  });

  it('still serves the Toyota 3D showroom at /toyota', async () => {
    const res = await request(app).get('/toyota');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Toyota Vios');
  });
});
