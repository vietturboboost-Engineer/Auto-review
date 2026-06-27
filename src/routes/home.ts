import { Router, type Request, type Response } from 'express';

export const homeRouter = Router();

const page = /* html */ `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>🚗 Garage Vui Vẻ</title>
    <style>
      :root {
        --bg1: #1e3c72;
        --bg2: #2a5298;
        --accent: #ffd166;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #fff;
        background: linear-gradient(135deg, var(--bg1), var(--bg2));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow-x: hidden;
      }
      h1 {
        font-size: clamp(2rem, 6vw, 4rem);
        margin: 0.2em 0;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      p.lead { font-size: clamp(1rem, 3vw, 1.4rem); opacity: 0.92; max-width: 32ch; }
      .road {
        position: relative;
        width: 100%;
        max-width: 720px;
        height: 90px;
        margin: 1.5rem 0;
        overflow: hidden;
      }
      .road::after {
        content: '';
        position: absolute;
        bottom: 14px;
        left: 0;
        width: 100%;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          var(--accent) 0 28px,
          transparent 28px 56px
        );
        animation: dash 0.8s linear infinite;
      }
      @keyframes dash { to { background-position: -56px 0; } }
      .car {
        font-size: 3.4rem;
        position: absolute;
        bottom: 18px;
        animation: drive 6s ease-in-out infinite;
      }
      @keyframes drive {
        0% { left: -12%; transform: scaleX(1); }
        45% { left: 92%; transform: scaleX(1); }
        50% { left: 92%; transform: scaleX(-1); }
        95% { left: -12%; transform: scaleX(-1); }
        100% { left: -12%; transform: scaleX(1); }
      }
      .cards {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 1rem;
      }
      .card {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(6px);
        border-radius: 16px;
        padding: 1rem 1.4rem;
        min-width: 130px;
        transition: transform 0.2s ease;
      }
      .card:hover { transform: translateY(-6px); }
      .card .emoji { font-size: 2rem; }
      .card .label { font-size: 0.95rem; opacity: 0.9; margin-top: 0.3rem; }
      footer { margin-top: 2rem; opacity: 0.7; font-size: 0.85rem; }
      a { color: var(--accent); text-decoration: none; font-weight: 600; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>🚗💨 Chào mừng tới Garage Vui Vẻ!</h1>
    <p class="lead">Nơi những chiếc xe luôn nổ máy giòn giã và nụ cười không bao giờ tắt 😄</p>

    <div class="road" aria-hidden="true">
      <span class="car">🏎️</span>
    </div>

    <div class="cards">
      <div class="card"><div class="emoji">🚙</div><div class="label">SUV bền bỉ</div></div>
      <div class="card"><div class="emoji">🏎️</div><div class="label">Tốc độ đỉnh cao</div></div>
      <div class="card"><div class="emoji">🔧</div><div class="label">Bảo dưỡng tận tâm</div></div>
      <div class="card"><div class="emoji">⚡</div><div class="label">Xe điện xanh</div></div>
    </div>

    <footer>
      API đang chạy ngon lành — kiểm tra tại <a href="/health">/health</a> 💚
    </footer>
  </body>
</html>`;

homeRouter.get('/', (_req: Request, res: Response) => {
  res.type('html').send(page);
});
