import express, { type Express } from 'express';
import { healthRouter } from './routes/health.js';
import { homeRouter } from './routes/home.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.use('/', homeRouter);
  app.use('/health', healthRouter);

  return app;
}
