import express, { type Express } from 'express';
import { healthRouter } from './routes/health.js';
import { homeRouter } from './routes/home.js';
import { dashboardRouter } from './routes/dashboard.js';
import { recommendRouter } from './routes/recommend.js';
import { apiRouter } from './routes/api.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.use('/', dashboardRouter);
  app.use('/toyota', homeRouter);
  app.use('/health', healthRouter);
  app.use('/api/recommend', recommendRouter);
  app.use('/api', apiRouter);

  return app;
}
