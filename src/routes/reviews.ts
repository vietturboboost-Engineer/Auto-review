import { Router, type Request, type Response } from 'express';
import {
  listReviews,
  addReview,
  summarize,
  summarizeAll,
  voteHelpful,
  isKnownVehicle,
  ReviewError,
} from '../data/reviews-store.js';

export const reviewsRouter = Router();

// ---- Chống spam: giới hạn số lần POST theo IP (in-memory, đủ cho 1 instance) ----
const RATE_MAX = 6; // tối đa 6 lần gửi
const RATE_WINDOW = 60_000; // trong 60 giây
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (arr.length >= RATE_MAX) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

// Tổng hợp số liệu đánh giá cho tất cả xe (badge trên thẻ xe).
reviewsRouter.get('/', (_req: Request, res: Response): void => {
  res.json({ ok: true, summaries: summarizeAll() });
});

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
  const body = (req.body ?? {}) as {
    name?: unknown;
    rating?: unknown;
    comment?: unknown;
    website?: unknown;
  };
  // Honeypot: trường ẩn `website` chỉ bot mới điền -> giả thành công, không lưu.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    res
      .status(201)
      .json({ ok: true, review: null, reviews: listReviews(id), summary: summarize(id) });
    return;
  }
  if (rateLimited(req.ip ?? 'unknown')) {
    res.status(429).json({ ok: false, error: 'Bạn gửi quá nhanh, vui lòng thử lại sau ít phút.' });
    return;
  }
  try {
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

// Bình chọn "hữu ích" cho một đánh giá.
reviewsRouter.post('/:id/:reviewId/helpful', (req: Request, res: Response): void => {
  const id = String(req.params.id);
  const reviewId = String(req.params.reviewId);
  if (!isKnownVehicle(id)) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy xe.' });
    return;
  }
  const updated = voteHelpful(id, reviewId);
  if (!updated) {
    res.status(404).json({ ok: false, error: 'Không tìm thấy đánh giá.' });
    return;
  }
  res.json({ ok: true, review: updated });
});
