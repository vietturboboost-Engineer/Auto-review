import { Router, type Request, type Response } from 'express';

export const homeRouter = Router();

interface Car {
  name: string;
  type: string;
  price: string;
  color: string;
  image: string;
  // Model 3D (.glb/.gltf) riêng cho xe. Bỏ trống -> dùng CAR_MODEL mặc định.
  model?: string;
}

// Model 3D xe (kéo xoay / zoom được) — dùng chung cho mọi xe.
// Muốn xe nào có model chính chủ, thêm `model: 'https://.../xe.glb'` vào xe đó.
const CAR_MODEL =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/ToyCar/glTF-Binary/ToyCar.glb';

// Ảnh thật lấy từ Wikimedia Commons (URL CDN ổn định). Nếu ảnh lỗi sẽ tự rơi về SVG minh hoạ.
// Giá tham khảo thị trường Việt Nam (có thể thay đổi theo thời điểm & đại lý).
const toyotaCars: Car[] = [
  {
    name: 'Toyota Wigo',
    type: 'Hatchback đô thị',
    price: '360 – 405 triệu',
    color: '#ef476f',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2014_Daihatsu_Ayla_1.0_X_B100RS_%2820190615%29.jpg/330px-2014_Daihatsu_Ayla_1.0_X_B100RS_%2820190615%29.jpg',
  },
  {
    name: 'Toyota Vios',
    type: 'Sedan hạng B',
    price: '458 – 545 triệu',
    color: '#118ab2',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg/330px-Toyota_Vios_1.5_VVT-i_G_%28IV%29_%E2%80%93_f_13032025.jpg',
  },
  {
    name: 'Toyota Veloz Cross',
    type: 'MPV 7 chỗ',
    price: '658 – 698 triệu',
    color: '#06d6a0',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2022_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_W101RE_%2820220403%29.jpg/330px-2022_Toyota_Avanza_1.5_G_Toyota_Safety_Sense_W101RE_%2820220403%29.jpg',
  },
  {
    name: 'Toyota Yaris Cross',
    type: 'SUV đô thị',
    price: '730 – 838 triệu',
    color: '#ffd166',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg/330px-Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg',
  },
  {
    name: 'Toyota Corolla Cross',
    type: 'SUV hạng C',
    price: '820 – 935 triệu',
    color: '#8338ec',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/330px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg',
  },
  {
    name: 'Toyota Innova Cross',
    type: 'MPV cao cấp',
    price: '810 triệu – 1,0 tỷ',
    color: '#fb5607',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg/330px-Toyota_Innova_Zenix_2.0_V_%28III%29_%E2%80%93_f_22032025.jpg',
  },
  {
    name: 'Toyota Camry',
    type: 'Sedan hạng D',
    price: '1,105 – 1,495 tỷ',
    color: '#3a86ff',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/330px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg',
  },
  {
    name: 'Toyota Fortuner',
    type: 'SUV 7 chỗ',
    price: '1,055 – 1,470 tỷ',
    color: '#2a9d8f',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/330px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg',
  },
  {
    name: 'Toyota Land Cruiser',
    type: 'SUV hạng sang',
    price: '4,030 – 4,600 tỷ',
    color: '#e09f3e',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/330px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png',
  },
];

// Ảnh minh hoạ SVG inline (không phụ thuộc mạng ngoài) — đổi màu theo từng xe.
function carThumb(color: string): string {
  return `<svg viewBox="0 0 120 60" width="96" height="48" role="img" aria-label="xe">
    <rect x="2" y="34" width="116" height="14" rx="7" fill="rgba(0,0,0,0.15)"/>
    <path d="M14 38 q4 -18 24 -20 l30 -1 q14 0 24 14 l10 2 q6 1 6 7 q0 4 -5 4 l-90 0 q-5 0 -5 -4 z" fill="${color}"/>
    <path d="M40 20 l24 0 q10 0 16 10 l-40 0 z" fill="rgba(255,255,255,0.85)"/>
    <path d="M36 22 q3 -8 10 -8 l-2 16 l-12 0 q0 -5 4 -8 z" fill="rgba(255,255,255,0.85)"/>
    <circle cx="34" cy="46" r="8" fill="#222"/><circle cx="34" cy="46" r="3.5" fill="#bbb"/>
    <circle cx="92" cy="46" r="8" fill="#222"/><circle cx="92" cy="46" r="3.5" fill="#bbb"/>
  </svg>`;
}

// Ảnh thật + fallback SVG: nếu <img> lỗi mạng, ẩn ảnh và hiện SVG minh hoạ kế bên.
// Bấm vào ảnh -> mở lightbox xem ảnh lớn (1280px).
function carPhoto(c: Car): string {
  return `<img class="photo" src="${c.image}" alt="${c.name}" width="120" height="68"
      loading="lazy" referrerpolicy="no-referrer" title="Bấm để phóng to"
      onclick="openImg(this.src, '${c.name}')"
      onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
    <span class="fallback" style="display:none">${carThumb(c.color)}</span>`;
}

const rows = toyotaCars
  .map(
    (c) => `<tr>
      <td class="thumb">${carPhoto(c)}</td>
      <td class="name">${c.name}</td>
      <td class="type">${c.type}</td>
      <td class="price">${c.price}</td>
      <td class="act">
        <button class="btn3d" type="button"
          onclick="open3d('${c.model ?? CAR_MODEL}', '${c.name}')">↻ Xem 3D</button>
      </td>
    </tr>`,
  )
  .join('');

const page = /* html */ `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>🚗 Garage Vui Vẻ</title>
    <script type="module"
      src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"></script>
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
        padding: 2rem 1rem;
      }
      h1 {
        font-size: clamp(2rem, 6vw, 4rem);
        margin: 0.2em 0;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      h2 { font-size: clamp(1.3rem, 4vw, 2rem); margin: 2rem 0 0.4rem; }
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
      .table-wrap {
        width: 100%;
        max-width: 760px;
        overflow-x: auto;
        margin-top: 0.5rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(6px);
      }
      table { width: 100%; border-collapse: collapse; min-width: 520px; }
      thead th {
        text-align: left;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.9rem 1rem;
        color: var(--accent);
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      }
      tbody td { padding: 0.7rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      tbody tr { transition: background 0.15s ease; }
      tbody tr:hover { background: rgba(255, 255, 255, 0.08); }
      tbody tr:last-child td { border-bottom: none; }
      td.thumb { width: 132px; }
      td.thumb svg { display: block; }
      td.thumb img.photo {
        display: block;
        width: 120px;
        height: 68px;
        object-fit: cover;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        cursor: zoom-in;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      td.thumb img.photo:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
      }
      td.name { font-weight: 600; white-space: nowrap; }
      td.type { opacity: 0.85; font-size: 0.92rem; }
      td.price { font-weight: 700; color: var(--accent); white-space: nowrap; }
      td.act { white-space: nowrap; }
      .btn3d {
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        color: #0d1b2a;
        background: var(--accent);
        border: none;
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .btn3d:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); }
      .btn3d:active { transform: translateY(0); }
      /* ---- 3D modal ---- */
      .modal3d[hidden] { display: none; }
      .modal3d {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: rgba(5, 12, 24, 0.72);
        backdrop-filter: blur(4px);
      }
      .modal3d .card3d {
        position: relative;
        width: min(92vw, 760px);
        background: linear-gradient(160deg, #16243f, #0d1b2a);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 20px;
        padding: 1rem 1rem 1.2rem;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
      }
      .modal3d h3 { margin: 0.2rem 0 0.6rem; font-size: 1.2rem; }
      .modal3d model-viewer {
        width: 100%;
        height: min(60vh, 440px);
        background: radial-gradient(circle at 50% 35%, #2a3f63, #0d1b2a 70%);
        border-radius: 14px;
        --poster-color: transparent;
      }
      .modal3d .hint { font-size: 0.82rem; opacity: 0.75; margin: 0.6rem 0 0; }
      .modal3d .close {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
        transition: background 0.15s ease;
      }
      .modal3d .close:hover { background: rgba(255, 255, 255, 0.3); }
      /* ---- Lightbox ảnh ---- */
      .lightbox[hidden] { display: none; }
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1.5rem;
        background: rgba(3, 8, 18, 0.92);
        cursor: zoom-out;
        animation: fade 0.18s ease;
      }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      .lightbox img {
        max-width: 96vw;
        max-height: 84vh;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.6);
      }
      .lightbox .cap { font-size: 0.95rem; opacity: 0.85; }
      .lightbox .close {
        position: absolute;
        top: 1rem;
        right: 1.2rem;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
      }
      .lightbox .close:hover { background: rgba(255, 255, 255, 0.32); }
      .note { font-size: 0.8rem; opacity: 0.7; margin-top: 0.6rem; max-width: 60ch; }
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

    <h2>🛞 Bảng giá xe Toyota</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Ảnh</th><th>Mẫu xe</th><th>Phân khúc</th><th>Giá tham khảo</th><th>3D</th></tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <p class="note">
      * Giá niêm yết tham khảo tại thị trường Việt Nam, chưa gồm thuế trước bạ &amp; phí lăn bánh.
      Vui lòng liên hệ đại lý để có báo giá chính xác.
    </p>

    <footer>
      API đang chạy ngon lành — kiểm tra tại <a href="/health">/health</a> 💚
    </footer>

    <div id="viewer3d" class="modal3d" hidden>
      <div class="card3d">
        <button class="close" type="button" onclick="close3d()" aria-label="Đóng">✕</button>
        <h3 id="m3d-title">Xem 3D</h3>
        <model-viewer
          id="mv"
          camera-controls
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="30deg"
          interaction-prompt="none"
          touch-action="pan-y"
          shadow-intensity="1"
          exposure="1.1"
          ar
          ar-modes="webxr scene-viewer quick-look"
        ></model-viewer>
        <p class="hint">🖱️ Kéo để xoay • cuộn để phóng to/thu nhỏ • thả ra xe tự xoay • 📱 bấm AR để xem ngoài đời thực</p>
      </div>
    </div>

    <div id="lightbox" class="lightbox" hidden onclick="closeImg()">
      <button class="close" type="button" aria-label="Đóng">✕</button>
      <img id="lb-img" src="" alt="" referrerpolicy="no-referrer" />
      <div id="lb-cap" class="cap"></div>
    </div>

    <script>
      (function () {
        var modal = document.getElementById('viewer3d');
        var mv = document.getElementById('mv');
        var title = document.getElementById('m3d-title');
        window.open3d = function (src, name) {
          mv.setAttribute('src', src);
          mv.setAttribute('alt', name);
          title.textContent = name + ' — xem 3D';
          modal.hidden = false;
        };
        window.close3d = function () {
          modal.hidden = true;
        };
        // Đóng khi bấm nền tối hoặc nhấn Esc.
        modal.addEventListener('click', function (e) {
          if (e.target === modal) window.close3d();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.close3d();
        });
      })();
    </script>

    <script>
      (function () {
        var box = document.getElementById('lightbox');
        var img = document.getElementById('lb-img');
        var cap = document.getElementById('lb-cap');
        // Đổi thumbnail 330px sang bản lớn 1280px (size Wikimedia cho phép).
        function bigSrc(src) {
          return src.replace('/330px-', '/1280px-');
        }
        window.openImg = function (src, name) {
          img.src = bigSrc(src);
          img.alt = name;
          cap.textContent = name;
          box.hidden = false;
        };
        window.closeImg = function () {
          box.hidden = true;
          img.src = '';
        };
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') window.closeImg();
        });
      })();
    </script>
  </body>
</html>`;

homeRouter.get('/', (_req: Request, res: Response) => {
  res.type('html').send(page);
});
