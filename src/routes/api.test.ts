import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { brands } from '../data/brands.js';
import { vehicles, getMaintenanceSchedule, getPartsCatalog, getVehicle } from '../data/vehicles.js';

describe('Vehicle data layer', () => {
  it('hỗ trợ nhiều hãng và mọi xe trỏ tới hãng hợp lệ', () => {
    expect(brands.length).toBeGreaterThanOrEqual(60);
    const slugs = new Set(brands.map((b) => b.slug));
    for (const v of vehicles) {
      expect(slugs.has(v.brandSlug)).toBe(true);
    }
  });

  it('id xe là duy nhất', () => {
    const ids = vehicles.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('trả lịch bảo dưỡng EV khác xe xăng', () => {
    const ev = getVehicle('tesla-model3');
    const gas = getVehicle('toyota-vios');
    expect(ev).toBeDefined();
    expect(gas).toBeDefined();
    const evSched = getMaintenanceSchedule(ev!);
    const evParts = getPartsCatalog(ev!);
    // Xe điện không có hạng mục "thay dầu máy".
    expect(evSched.some((m) => /dầu máy/i.test(m.items))).toBe(false);
    expect(evParts.some((p) => /lọc dầu/i.test(p.name))).toBe(false);
  });
});

describe('JSON API đa hãng', () => {
  const app = createApp();

  it('GET /api/brands trả danh sách hãng + số xe', async () => {
    const res = await request(app).get('/api/brands');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.brands.length).toBe(brands.length);
    expect(res.body.brands[0]).toHaveProperty('count');
  });

  it('GET /api/vehicles lọc theo hãng', async () => {
    const res = await request(app).get('/api/vehicles?brand=toyota');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.vehicles.every((v: { brandSlug: string }) => v.brandSlug === 'toyota')).toBe(
      true,
    );
  });

  it('GET /api/vehicles/:id trả chi tiết kèm lịch bảo dưỡng & phụ tùng', async () => {
    const res = await request(app).get('/api/vehicles/toyota-vios');
    expect(res.status).toBe(200);
    expect(res.body.vehicle.model).toBe('Vios');
    expect(Array.isArray(res.body.vehicle.maintenanceSchedule)).toBe(true);
    expect(Array.isArray(res.body.vehicle.partsCatalog)).toBe(true);
  });

  it('GET /api/vehicles/:id trả 404 khi không tồn tại', async () => {
    const res = await request(app).get('/api/vehicles/khong-co');
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  it('GET /api/brands/:slug/vehicles trả 404 với hãng lạ', async () => {
    const res = await request(app).get('/api/brands/khong-ton-tai/vehicles');
    expect(res.status).toBe(404);
  });
});
