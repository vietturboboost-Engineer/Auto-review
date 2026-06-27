import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST ?? '0.0.0.0';

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.log(`[server] listening on http://${HOST}:${PORT}`);
});

function shutdown(signal: NodeJS.Signals): void {
  console.log(`[server] received ${signal}, shutting down...`);
  server.close((err) => {
    if (err) {
      console.error('[server] error during shutdown:', err);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
