import { Router, type Request, type Response } from 'express';
import { brands, getBrand } from '../data/brands.js';
import {
  vehicles,
  getVehicle,
  getVehiclesByBrand,
  getSegments,
  getMaintenanceSchedule,
  getPartsCatalog,
  type Vehicle,
} from '../data/vehicles.js';

export const apiRouter = Router();

// Bản rút gọn để liệt kê (nhẹ, đủ render thẻ dashboard).
function toCard(v: Vehicle) {
  return {
    id: v.id,
    brand: v.brand,
    brandSlug: v.brandSlug,
    model: v.model,
    year: v.year,
    trim: v.trim,
    segment: v.segment,
    fuelType: v.fuelType,
    transmission: v.transmission,
    seats: v.seats,
    price: v.price,
    fuelEconomy: v.fuelEconomy,
    horsepower: v.horsepower,
    reliability: v.reliability,
    image: v.image,
  };
}

apiRouter.get('/brands', (_req: Request, res: Response) => {
  const list = brands.map((b) => ({
    ...b,
    count: getVehiclesByBrand(b.slug).length,
  }));
  res.json({ ok: true, count: list.length, brands: list });
});

apiRouter.get('/segments', (_req: Request, res: Response) => {
  res.json({ ok: true, segments: getSegments() });
});

apiRouter.get('/brands/:slug/vehicles', (req: Request, res: Response) => {
  const brand = getBrand(String(req.params.slug));
  if (!brand) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy hãng xe.' });
    return;
  }
  const list = getVehiclesByBrand(brand.slug).map(toCard);
  res.json({ ok: true, brand, count: list.length, vehicles: list });
});

apiRouter.get('/vehicles', (req: Request, res: Response) => {
  const brand = typeof req.query.brand === 'string' ? req.query.brand : '';
  const segment = typeof req.query.segment === 'string' ? req.query.segment : '';
  const fuel = typeof req.query.fuel === 'string' ? req.query.fuel : '';

  let list = vehicles;
  if (brand) list = list.filter((v) => v.brandSlug === brand);
  if (segment) list = list.filter((v) => v.segment === segment);
  if (fuel) list = list.filter((v) => v.fuelType === fuel);

  res.json({ ok: true, count: list.length, vehicles: list.map(toCard) });
});

apiRouter.get('/vehicles/:id', (req: Request, res: Response) => {
  const v = getVehicle(String(req.params.id));
  if (!v) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy xe.' });
    return;
  }
  res.json({
    ok: true,
    vehicle: {
      ...v,
      maintenanceSchedule: getMaintenanceSchedule(v),
      partsCatalog: getPartsCatalog(v),
    },
  });
});
