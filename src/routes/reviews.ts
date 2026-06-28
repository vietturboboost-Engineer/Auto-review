import { Router, type Request, type Response } from 'express';
import {
  listReviews,
  addReview,
  summarize,
  isKnownVehicle,
  ReviewError,
} from '../data/reviews-store.js';

export const reviewsRouter = Router();

reviewsRouter.get('/:id', (req: Request, res: Response): void => {
  const id = String(req.params.id);
  if (!isKnownVehicle(id)) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy xe.' });
    return;
  }
  res.json({ ok: true, reviews: listReviews(id), summary: summarize(id) });
});

reviewsRouter.post('/:id', (req: Request, res: Response): void => {
  const id = String(req.params.id);
  if (!isKnownVehicle(id)) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy xe.' });
    return;
  }
  try {
    const body = (req.body ?? {}) as { name?: unknown; rating?: unknown; comment?: unknown };
    const review = addReview(id, body);
    res.status(201).json({ ok: true, review, reviews: listReviews(id), summary: summarize(id) });
  } catch (err) {
    if (err instanceof ReviewError) {
      res.status(400).json({ ok: false, error: err.message });
      return;
    }
    res.status(500).json({ ok: false, error: 'Không lưu được đánh giá.' });
  }
});
