import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('GET /', () => {
  const app = createApp();

  it('returns 200 with HTML content', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('renders the friendly car homepage', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Garage Vui Vẻ');
    expect(res.text).toContain('/health');
  });

  it('renders the Toyota price table', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Bảng giá xe Toyota');
    expect(res.text).toContain('Toyota Vios');
    expect(res.text).toContain('<svg');
  });
});
