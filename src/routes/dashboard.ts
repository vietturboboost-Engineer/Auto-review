import { Router, type Request, type Response } from 'express';
import { brands } from '../data/brands.js';
import {
  vehicles,
  getMaintenanceSchedule,
  getPartsCatalog,
  getSegments,
  type Vehicle,
} from '../data/vehicles.js';

export const dashboardRouter = Router();

// ---- Dữ liệu nhúng cho client (kèm lịch bảo dưỡng + phụ tùng đã gộp) ----
const clientVehicles = vehicles.map((v) => ({
  ...v,
  maintenanceSchedule: getMaintenanceSchedule(v),
  partsCatalog: getPartsCatalog(v),
}));

const clientBrands = brands.map((b) => ({
  ...b,
  count: vehicles.filter((v) => v.brandSlug === b.slug).length,
}));

const segments = getSegments();
const fuelTypes = Array.from(new Set(vehicles.map((v) => v.fuelType)));

function embed(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stars(n: number): string {
  const full = Math.max(0, Math.min(5, Math.round(n)));
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

function brandChip(b: { slug: string; name: string; color: string; wordmark: string; count: number }): string {
  return (
    `<button class="brandchip" data-brand="${b.slug}" title="${escapeHtml(b.name)} (${b.count} xe)">` +
    `<span class="brandmark" style="color:${b.color}">${escapeHtml(b.wordmark)}</span>` +
    `<span class="brandcount">${b.count} xe</span>` +
    `</button>`
  );
}

function vehicleCard(v: Vehicle): string {
  const brand = brands.find((b) => b.slug === v.brandSlug);
  const color = brand?.color ?? '#ffd166';
  const vn = v.vietnam;
  const vnClass =
    vn.status === 'on-sale'
      ? 'vn-on'
      : vn.status === 'limited'
        ? 'vn-lim'
        : vn.status === 'discontinued'
          ? 'vn-dis'
          : vn.status === 'upcoming'
            ? 'vn-up'
            : 'vn-no';
  return (
    `<article class="vcard" data-id="${v.id}" data-brand="${v.brandSlug}" data-segment="${escapeHtml(v.segment)}" data-fuel="${escapeHtml(v.fuelType)}" data-vn-status="${vn.status}" data-vn-available="${vn.available ? '1' : '0'}" data-vn-assembly="${vn.assembly}" data-search="${escapeHtml((v.brand + ' ' + v.model + ' ' + v.trim + ' ' + v.segment).toLowerCase())}">` +
    `<div class="vthumb"><img loading="lazy" src="${escapeHtml(v.image)}" alt="${escapeHtml(v.brand + ' ' + v.model)}"><span class="vnbadge ${vnClass}">${escapeHtml(vn.badge)}</span></div>` +
    `<div class="vbody">` +
    `<div class="vbrand" style="color:${color}">${escapeHtml(v.brand)}</div>` +
    `<h3 class="vname">${escapeHtml(v.model)} <span>${escapeHtml(v.trim)}</span></h3>` +
    `<div class="vchips"><span class="chip">${escapeHtml(v.segment)}</span><span class="chip">${escapeHtml(v.fuelType)}</span><span class="chip">${v.seats} chỗ</span></div>` +
    `<div class="vprice">${escapeHtml(v.price.label)}</div>` +
    `<div class="vmeta"><span>⛽ ${escapeHtml(v.fuelEconomy)}</span><span>⚙️ ${v.horsepower} hp</span></div>` +
    `<div class="vrate" title="Độ tin cậy">${stars(v.reliability)}</div>` +
    `<div class="vactions">` +
    `<button class="btn btn-primary" data-act="detail" data-id="${v.id}">Chi tiết</button>` +
    `<button class="btn btn-ghost" data-act="compare" data-id="${v.id}">⚖️ So sánh</button>` +
    `</div>` +
    `</div>` +
    `</article>`
  );
}

const cardsHtml = vehicles.map(vehicleCard).join('');
const brandsHtml = clientBrands.map(brandChip).join('');
const segmentOptions = segments.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
const fuelOptions = fuelTypes.map((f) => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('');

const page = `<!doctype html>
<html lang="vi" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AutoReview — Cẩm nang chọn xe đa hãng</title>
<style>
*{box-sizing:border-box}
:root{
  --bg1:#060608; --bg2:#101015; --surface:#1a1a20; --card:#17171d; --ink:#0a0a0c;
  --accent:#ffd166; --accent2:#f7b733; --text:#e9e9f0; --muted:#9a9aa6;
  --line:rgba(255,255,255,0.08); --shadow:0 18px 50px rgba(0,0,0,0.55);
  --good:#5ad19a; --bad:#ff7a7a;
}
html[data-theme="light"]{
  --bg1:#eef0f4; --bg2:#ffffff; --surface:#ffffff; --card:#ffffff; --ink:#1a1a1f;
  --accent:#c9962f; --accent2:#b9831f; --text:#1c1c24; --muted:#5e6068;
  --line:rgba(0,0,0,0.10); --shadow:0 16px 40px rgba(20,20,40,0.12);
  --good:#1f9d63; --bad:#cf3c3c;
}
body{
  margin:0; font-family:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  color:var(--text); line-height:1.55; min-height:100vh;
  background:
    radial-gradient(900px 500px at 12% -8%, rgba(255,209,102,0.10), transparent 60%),
    radial-gradient(800px 500px at 110% 0%, rgba(120,140,255,0.10), transparent 55%),
    linear-gradient(160deg,var(--bg1),var(--bg2));
  background-attachment:fixed;
}
a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding:0 18px}

/* Nav */
.nav{position:sticky;top:0;z-index:40;backdrop-filter:blur(12px);
  background:color-mix(in srgb,var(--bg1) 78%, transparent);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;gap:18px;height:62px}
.logo{font-weight:800;font-size:20px;letter-spacing:.3px;display:flex;align-items:center;gap:8px}
.logo .dot{color:var(--accent)}
.nav nav{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap}
.nav nav a{padding:8px 12px;border-radius:10px;font-size:14px;color:var(--muted);text-decoration:none;cursor:pointer}
.nav nav a:hover{color:var(--text);background:var(--surface)}
.themebtn{border:1px solid var(--line);background:var(--surface);color:var(--text);
  width:40px;height:40px;border-radius:12px;cursor:pointer;font-size:17px}

/* Hero */
.hero{padding:54px 0 30px;text-align:center}
.hero h1{font-size:clamp(28px,5vw,46px);margin:0 0 10px;line-height:1.1;font-weight:800}
.hero h1 b{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{color:var(--muted);max-width:640px;margin:0 auto 22px;font-size:16px}
.searchbar{display:flex;gap:10px;max-width:620px;margin:0 auto 16px}
.searchbar input{flex:1;padding:14px 16px;border-radius:14px;border:1px solid var(--line);
  background:var(--surface);color:var(--text);font-size:15px}
.searchbar input:focus{outline:2px solid var(--accent)}
.cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{cursor:pointer;border:none;border-radius:12px;padding:11px 16px;font-size:14px;font-weight:700;transition:transform .12s ease,filter .12s ease}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:linear-gradient(90deg,var(--accent),var(--accent2));color:var(--ink)}
.btn-ghost{background:var(--surface);color:var(--text);border:1px solid var(--line)}
.btn-lg{padding:14px 22px;font-size:15px;border-radius:14px}

/* Sections */
section{padding:26px 0}
.h-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.h-row h2{font-size:22px;margin:0;font-weight:800}
.h-row .sub{color:var(--muted);font-size:14px}

/* Brand grid */
.brandgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.brandchip{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  padding:14px 8px;border-radius:14px;border:1px solid var(--line);background:var(--card);
  cursor:pointer;transition:transform .12s ease,border-color .12s ease}
.brandchip:hover{transform:translateY(-2px);border-color:var(--accent)}
.brandchip.active{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}
.brandmark{font-weight:800;font-size:15px;text-align:center}
.brandcount{font-size:11px;color:var(--muted)}

/* Filters */
.filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.filters select{padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--text);font-size:14px}
.filters .count{margin-left:auto;color:var(--muted);font-size:13px}
.clearbtn{padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:transparent;color:var(--muted);cursor:pointer;font-size:13px}

/* Vehicle cards */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.vcard{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;
  display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease}
.vcard:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.vthumb{position:relative;aspect-ratio:16/9;background:#0c0c10;overflow:hidden}
.vthumb img{width:100%;height:100%;object-fit:cover;display:block}
.vnbadge{position:absolute;top:8px;left:8px;font-size:11px;font-weight:800;padding:4px 9px;
  border-radius:999px;backdrop-filter:blur(4px);background:rgba(10,10,14,.62);color:#fff;
  border:1px solid rgba(255,255,255,.18);box-shadow:0 4px 14px rgba(0,0,0,.35)}
.vnbadge.vn-on{background:rgba(28,120,70,.82);border-color:rgba(120,230,170,.4)}
.vnbadge.vn-lim{background:rgba(150,110,10,.82);border-color:rgba(255,210,110,.4)}
.vnbadge.vn-dis{background:rgba(30,80,150,.82);border-color:rgba(130,180,255,.4)}
.vnbadge.vn-up{background:rgba(60,60,70,.82);border-color:rgba(180,180,200,.4)}
.vnbadge.vn-no{background:rgba(150,40,40,.82);border-color:rgba(255,140,140,.4)}
.vbody{padding:14px;display:flex;flex-direction:column;gap:8px;flex:1}
.vbrand{font-size:12px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.vname{margin:0;font-size:17px;font-weight:800}
.vname span{font-weight:500;color:var(--muted);font-size:13px}
.vchips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-size:11px;padding:3px 8px;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--muted)}
.vprice{font-weight:800;color:var(--accent);font-size:16px}
.vmeta{display:flex;gap:12px;font-size:12px;color:var(--muted)}
.vrate{color:var(--accent);font-size:14px;letter-spacing:1px}
.vactions{display:flex;gap:8px;margin-top:auto}
.vactions .btn{flex:1;font-size:13px;padding:9px 10px}
.vcard.picked{box-shadow:0 0 0 2px var(--accent) inset}
.empty{padding:40px;text-align:center;color:var(--muted)}

/* Compare bar */
.cmpbar{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:50;
  display:none;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--line);
  border-radius:16px;padding:10px 14px;box-shadow:var(--shadow);max-width:94vw}
.cmpbar.show{display:flex}
.cmpbar .slots{display:flex;gap:8px}
.cmpbar .slot{font-size:12px;padding:6px 10px;border-radius:10px;background:var(--card);border:1px solid var(--line);white-space:nowrap}
.cmpbar .slot b{cursor:pointer;color:var(--bad);margin-left:6px}

/* Modal */
.modal{position:fixed;inset:0;z-index:60;display:none;align-items:flex-start;justify-content:center;
  background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);overflow-y:auto;padding:24px 14px}
.modal.show{display:flex}
.sheet{background:linear-gradient(180deg,var(--surface),var(--card));border:1px solid var(--line);
  border-radius:22px;width:100%;max-width:920px;box-shadow:var(--shadow);overflow:hidden;margin:auto}
.sheet-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--surface);z-index:2}
.sheet-head h3{margin:0;font-size:18px;flex:1}
.closebtn{border:1px solid var(--line);background:var(--card);color:var(--text);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px}
.sheet-body{padding:18px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid var(--line);position:sticky;top:64px;background:var(--surface);z-index:2}
.tab{padding:8px 12px;border-radius:10px;border:1px solid transparent;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;font-weight:600}
.tab.active{color:var(--ink);background:var(--accent)}
.tabpane{display:none}
.tabpane.active{display:block}

/* tables */
.dtbl{width:100%;border-collapse:collapse;font-size:14px}
.dtbl td,.dtbl th{padding:9px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.dtbl th{color:var(--muted);font-weight:600;width:40%}
.taglist{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px}
.tag{font-size:12px;padding:5px 10px;border-radius:999px;background:var(--card);border:1px solid var(--line)}
.vn-status{font-size:15px;font-weight:800;padding:10px 14px;border-radius:12px;margin-bottom:12px;
  background:var(--surface);border:1px solid var(--line)}
.vn-notes{margin:6px 0 0;padding-left:20px;font-size:14px;display:flex;flex-direction:column;gap:4px}
.best{color:var(--good);font-weight:800}
.cmp-tbl{width:100%;border-collapse:collapse;font-size:13px}
.cmp-tbl th,.cmp-tbl td{border:1px solid var(--line);padding:9px;text-align:center}
.cmp-tbl th{background:var(--card)}
.cmp-tbl td.label{text-align:left;color:var(--muted);font-weight:600;background:var(--card)}

/* reco */
.reco-form{display:grid;gap:16px}
.fld label{display:block;font-weight:700;margin-bottom:6px;font-size:14px}
.fld .opts{display:flex;gap:8px;flex-wrap:wrap}
.opt{padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);cursor:pointer;font-size:13px}
.opt.on{background:var(--accent);color:var(--ink);border-color:var(--accent)}
.fld input[type=range]{width:100%}
.budgetval{font-weight:800;color:var(--accent)}
.reco-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;margin-bottom:12px;display:flex;gap:14px}
.reco-card img{width:120px;height:74px;object-fit:cover;border-radius:10px;background:#0c0c10}
.reco-card .pct{margin-left:auto;font-size:22px;font-weight:800;color:var(--accent)}
.matchbar{height:7px;border-radius:6px;background:var(--surface);overflow:hidden;margin-top:6px}
.matchbar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2))}
.ai-box{border:1px solid var(--accent);border-radius:14px;padding:14px;margin-top:12px;background:color-mix(in srgb,var(--accent) 8%,transparent)}
.ai-badge{font-size:11px;font-weight:800;color:var(--ink);background:var(--accent);padding:3px 8px;border-radius:999px}
.ai-warn{color:var(--bad);font-size:13px}
.muted{color:var(--muted)}
footer{padding:30px 0;color:var(--muted);font-size:13px;text-align:center;border-top:1px solid var(--line);margin-top:30px}
@media(max-width:560px){.searchbar{flex-direction:column}.nav nav a{padding:7px 9px}}
</style>
</head>
<body>
<header class="nav">
  <div class="wrap">
    <div class="logo">Auto<span class="dot">Review</span></div>
    <nav>
      <a data-jump="brands">Hãng xe</a>
      <a data-jump="catalog">Danh mục xe</a>
      <a id="nav-reco">🤖 Gợi ý AI</a>
      <a href="/toyota">Showroom Toyota 3D</a>
    </nav>
    <button class="themebtn" id="themebtn" title="Đổi giao diện sáng/tối">🌙</button>
  </div>
</header>

<main class="wrap">
  <section class="hero">
    <h1>Chọn xe thông minh,<br><b>so sánh minh bạch</b></h1>
    <p>Cẩm nang ${vehicles.length}+ mẫu xe từ ${brands.length} hãng tại Việt Nam — thông số, chi phí sở hữu, bảo dưỡng và gợi ý xe bằng AI.</p>
    <div class="searchbar">
      <input id="search" type="search" placeholder="Tìm theo hãng, mẫu xe, phân khúc… (vd: SUV, hybrid, Toyota)">
    </div>
    <div class="cta">
      <button class="btn btn-primary btn-lg" id="cta-reco">🤖 Gợi ý xe bằng AI</button>
      <button class="btn btn-ghost btn-lg" id="cta-compare">⚖️ So sánh xe</button>
    </div>
  </section>

  <section id="brands">
    <div class="h-row"><h2>Chọn theo hãng</h2><span class="sub">${brands.length} thương hiệu</span></div>
    <div class="brandgrid">${brandsHtml}</div>
  </section>

  <section id="catalog">
    <div class="h-row"><h2>Danh mục xe</h2><span class="sub">nhấn để xem chi tiết</span></div>
    <div class="filters">
      <select id="f-segment"><option value="">Tất cả phân khúc</option>${segmentOptions}</select>
      <select id="f-fuel"><option value="">Mọi nhiên liệu</option>${fuelOptions}</select>
      <select id="f-vn">
        <option value="">🇻🇳 Mọi tình trạng VN</option>
        <option value="available">🟢 Đang bán tại VN</option>
        <option value="official">✅ Phân phối chính hãng</option>
        <option value="ckd">🏭 Lắp ráp trong nước (CKD)</option>
        <option value="cbu">🚢 Nhập khẩu (CBU)</option>
        <option value="none">🔴 Chưa bán tại VN</option>
      </select>
      <button class="clearbtn" id="f-clear">Xoá lọc</button>
      <span class="count" id="count"></span>
    </div>
    <div class="grid" id="grid">${cardsHtml}</div>
    <div class="empty" id="empty" style="display:none">Không có xe phù hợp bộ lọc.</div>
  </section>
</main>

<footer class="wrap">
  Số liệu mang tính tham khảo cho thị trường Việt Nam (giá/thông số thay đổi theo phiên bản & thời điểm).
  Ảnh một số xe là ảnh minh hoạ. • <a href="/health">/health</a>
</footer>

<div class="cmpbar" id="cmpbar">
  <div class="slots" id="cmpslots"></div>
  <button class="btn btn-primary" id="cmp-go">So sánh (<span id="cmp-n">0</span>)</button>
  <button class="clearbtn" id="cmp-clear">Xoá</button>
</div>

<div class="modal" id="modal"><div class="sheet" id="sheet"></div></div>

<script>
(function(){
  "use strict";
  var V = ${embed(clientVehicles)};
  var B = ${embed(clientBrands)};
  var byId = {}; V.forEach(function(v){ byId[v.id] = v; });
  var brandColor = {}; B.forEach(function(b){ brandColor[b.slug] = b.color; });

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function $(id){ return document.getElementById(id); }
  function stars(n){ var f=Math.max(0,Math.min(5,Math.round(n))); return '★★★★★'.slice(0,f)+'☆☆☆☆☆'.slice(0,5-f); }

  /* Ảnh dự phòng nếu URL gốc lỗi (hiếm) -> không bao giờ hiện icon ảnh vỡ. */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#26262e"/><path d="M40 120 q10 -40 55 -44 l70 -2 q34 0 52 30 l24 4 q14 2 14 16 q0 9 -11 9 l-200 0 q-11 0 -11 -9 z" fill="#3a3a44"/><circle cx="95" cy="118" r="16" fill="#15151a"/><circle cx="210" cy="118" r="16" fill="#15151a"/><text x="160" y="158" font-family="Arial" font-size="13" fill="#9a9aa6" text-anchor="middle">Ảnh đang cập nhật</text></svg>');
  document.addEventListener('error', function(e){
    var t = e.target;
    if(t && t.tagName === 'IMG' && !t.getAttribute('data-fb')){ t.setAttribute('data-fb','1'); t.src = FALLBACK; }
  }, true);

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  try{ var saved = localStorage.getItem('ar-theme'); if(saved){ root.setAttribute('data-theme', saved); } }catch(e){}
  function syncThemeIcon(){ $('themebtn').textContent = root.getAttribute('data-theme')==='light' ? '☀️' : '🌙'; }
  syncThemeIcon();
  $('themebtn').onclick = function(){
    var next = root.getAttribute('data-theme')==='light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('ar-theme', next); }catch(e){}
    syncThemeIcon();
  };

  /* ---------- Smooth jump ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-jump]'), function(a){
    a.onclick = function(){ var el=$(a.getAttribute('data-jump')); if(el) el.scrollIntoView({behavior:'smooth'}); };
  });

  /* ---------- Filtering ---------- */
  var state = { brand:'', segment:'', fuel:'', vn:'', q:'' };
  var cards = Array.prototype.slice.call(document.querySelectorAll('.vcard'));
  function vnMatch(c){
    if(!state.vn) return true;
    if(state.vn==='available') return c.getAttribute('data-vn-available')==='1';
    if(state.vn==='official') return c.getAttribute('data-vn-status')!=='global-only';
    if(state.vn==='ckd') return c.getAttribute('data-vn-assembly')==='CKD';
    if(state.vn==='cbu') return c.getAttribute('data-vn-assembly')==='CBU';
    if(state.vn==='none') return c.getAttribute('data-vn-status')==='global-only';
    return true;
  }
  function applyFilters(){
    var n=0;
    cards.forEach(function(c){
      var ok = (!state.brand || c.getAttribute('data-brand')===state.brand)
        && (!state.segment || c.getAttribute('data-segment')===state.segment)
        && (!state.fuel || c.getAttribute('data-fuel')===state.fuel)
        && vnMatch(c)
        && (!state.q || c.getAttribute('data-search').indexOf(state.q)>=0);
      c.style.display = ok ? '' : 'none';
      if(ok) n++;
    });
    $('count').textContent = n + ' / ' + cards.length + ' xe';
    $('empty').style.display = n ? 'none' : 'block';
  }
  $('search').addEventListener('input', function(e){ state.q=e.target.value.trim().toLowerCase(); applyFilters(); });
  $('f-segment').addEventListener('change', function(e){ state.segment=e.target.value; applyFilters(); });
  $('f-fuel').addEventListener('change', function(e){ state.fuel=e.target.value; applyFilters(); });
  $('f-vn').addEventListener('change', function(e){ state.vn=e.target.value; applyFilters(); });
  $('f-clear').onclick = function(){
    state={brand:'',segment:'',fuel:'',vn:'',q:''};
    $('search').value=''; $('f-segment').value=''; $('f-fuel').value=''; $('f-vn').value='';
    setBrandActive(''); applyFilters();
  };
  function setBrandActive(slug){
    Array.prototype.forEach.call(document.querySelectorAll('.brandchip'), function(b){
      b.classList.toggle('active', b.getAttribute('data-brand')===slug);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.brandchip'), function(b){
    b.onclick = function(){
      var slug=b.getAttribute('data-brand');
      state.brand = (state.brand===slug) ? '' : slug;
      setBrandActive(state.brand); applyFilters();
      $('catalog').scrollIntoView({behavior:'smooth'});
    };
  });
  applyFilters();

  /* ---------- Modal helpers ---------- */
  var modal=$('modal'), sheet=$('sheet');
  function openModal(html){ sheet.innerHTML=html; modal.classList.add('show'); document.body.style.overflow='hidden'; bindTabs(); }
  function closeModal(){ modal.classList.remove('show'); document.body.style.overflow=''; }
  modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  function bindTabs(){
    var tabs=sheet.querySelectorAll('.tab'); if(!tabs.length) return;
    Array.prototype.forEach.call(tabs, function(t){
      t.onclick=function(){
        Array.prototype.forEach.call(sheet.querySelectorAll('.tab'),function(x){x.classList.remove('active');});
        Array.prototype.forEach.call(sheet.querySelectorAll('.tabpane'),function(x){x.classList.remove('active');});
        t.classList.add('active');
        var pane=sheet.querySelector('[data-pane="'+t.getAttribute('data-tab')+'"]');
        if(pane) pane.classList.add('active');
      };
    });
  }

  /* ---------- Vehicle detail ---------- */
  function row(k,v){ return '<tr><th>'+esc(k)+'</th><td>'+esc(v)+'</td></tr>'; }
  function tags(arr){ return '<div class="taglist">'+(arr||[]).map(function(x){return '<span class="tag">'+esc(x)+'</span>';}).join('')+'</div>'; }
  function vnPane(m){
    m = m || {};
    var notes = (m.notes||[]).map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('');
    var assembly = m.assembly==='CKD' ? 'Lắp ráp trong nước (CKD)' : m.assembly==='CBU' ? 'Nhập khẩu nguyên chiếc (CBU)' : '—';
    return ''
      + '<div class="vn-status">'+esc(m.statusLabel||'')+'</div>'
      + '<table class="dtbl">'
      +   row('Nhà phân phối', m.distributor||'—')
      +   row('Hình thức', assembly)
      +   row('Ra mắt tại VN', m.firstYear ? m.firstYear : 'Chưa bán chính hãng')
      +   row('Giá lăn bánh (ước tính)', m.onRoadPrice||'—')
      +   row('Bảo hành chính hãng', m.warrantyVn||'—')
      +   row('Đại lý', m.dealerNetwork||'—')
      +   row('Thời gian giao xe', m.waitTime||'—')
      + '</table>'
      + '<p style="margin-top:12px"><b>Ghi chú thị trường Việt Nam</b></p><ul class="vn-notes">'+notes+'</ul>'
      + '<p class="muted" style="margin-top:10px;font-size:12px">⚠ Thông tin thị trường VN mang tính tham khảo — giá, phiên bản và tình trạng phân phối thay đổi theo thời điểm và đại lý. Nên xác nhận lại với đại lý chính hãng.</p>';
  }
  function detailHtml(v){
    var c = brandColor[v.brandSlug] || 'var(--accent)';
    var ms = (v.maintenanceSchedule||[]).map(function(m){
      return '<tr><th>'+esc((m.km/1000)+'.000 km')+'</th><td>'+esc(m.items)+'<div class="muted">'+esc(m.cost)+'</div></td></tr>';
    }).join('');
    var pc = (v.partsCatalog||[]).map(function(p){
      return '<tr><th>'+esc(p.name)+'</th><td>'+esc(p.price)+'<div class="muted">OEM: '+esc(p.oem)+'</div></td></tr>';
    }).join('');
    return ''
      + '<div class="sheet-head"><h3><span style="color:'+c+'">'+esc(v.brand)+'</span> '+esc(v.model)+' · '+esc(v.trim)+'</h3>'
      + '<button class="closebtn" data-close>✕</button></div>'
      + '<div class="tabs">'
      +   '<button class="tab active" data-tab="ov">Tổng quan</button>'
      +   '<button class="tab" data-tab="spec">Thông số</button>'
      +   '<button class="tab" data-tab="maint">Bảo dưỡng</button>'
      +   '<button class="tab" data-tab="parts">Phụ tùng</button>'
      +   '<button class="tab" data-tab="cost">Chi phí sở hữu</button>'
      +   '<button class="tab" data-tab="vn">🇻🇳 Thị trường VN</button>'
      + '</div>'
      + '<div class="sheet-body">'
      +   '<div class="tabpane active" data-pane="ov">'
      +     '<img src="'+esc(v.image)+'" alt="" style="width:100%;max-height:280px;object-fit:cover;border-radius:14px;margin-bottom:12px">'
      +     '<div class="vprice" style="font-size:20px">'+esc(v.price.label)+'</div>'
      +     '<div class="vmeta" style="margin:8px 0">'+stars(v.reliability)+' · '+esc(v.segment)+' · '+esc(v.fuelType)+' · '+v.seats+' chỗ</div>'
      +     '<table class="dtbl">'
      +       row('Động cơ', v.engine) + row('Hộp số', v.transmission) + row('Dẫn động', v.driveType)
      +       row('Công suất', v.horsepower+' hp / '+v.torque+' Nm') + row('Tiêu hao', v.fuelEconomy)
      +       row('Bảo hành', v.warranty)
      +     '</table>'
      +     '<p style="margin-top:14px"><b>An toàn</b></p>'+tags(v.safetyFeatures)
      +     '<p><b>Công nghệ</b></p>'+tags(v.techFeatures)
      +     '<p><b>Lưu ý thường gặp</b></p>'+tags(v.commonIssues)
      +     '<div class="vactions"><button class="btn btn-ghost" data-act="compare" data-id="'+esc(v.id)+'">⚖️ Thêm vào so sánh</button></div>'
      +   '</div>'
      +   '<div class="tabpane" data-pane="spec"><table class="dtbl">'
      +     row('Phân khúc', v.segment) + row('Số chỗ', v.seats) + row('Nhiên liệu', v.fuelType)
      +     row('Dài × Rộng × Cao', v.dimensions.length+' × '+v.dimensions.width+' × '+v.dimensions.height+' mm')
      +     row('Trục cơ sở', v.dimensions.wheelbase+' mm') + row('Khoang hành lý', v.cargo+' L')
      +     row('Công suất', v.horsepower+' hp') + row('Mô-men xoắn', v.torque+' Nm')
      +     row('Độ tin cậy', stars(v.reliability))
      +   '</table></div>'
      +   '<div class="tabpane" data-pane="maint"><p class="muted">Lịch bảo dưỡng định kỳ tham khảo:</p><table class="dtbl">'+ms+'</table></div>'
      +   '<div class="tabpane" data-pane="parts"><p class="muted">Giá phụ tùng tham khảo:</p><table class="dtbl">'+pc+'</table></div>'
      +   '<div class="tabpane" data-pane="cost"><p class="muted">Ước tính chi phí nuôi xe mỗi năm:</p><table class="dtbl">'
      +     row('Bảo dưỡng định kỳ', v.maintenanceCostPerYear)
      +     row('Nhiên liệu/năng lượng', v.fuelType==='Điện' ? 'Thấp (sạc điện)' : 'Theo mức tiêu hao '+v.fuelEconomy)
      +     row('Khuyến nghị', v.reliability>=4 ? 'Chi phí vận hành ổn định, dễ bán lại.' : 'Cân nhắc chi phí phụ tùng/dịch vụ.')
      +   '</table></div>'
      +   '<div class="tabpane" data-pane="vn">'+vnPane(v.vietnam)+'</div>'
      + '</div>';
  }
  function openDetail(id){ var v=byId[id]; if(v){ openModal(detailHtml(v)); } }

  /* ---------- Compare ---------- */
  var picked=[];
  function renderCmpBar(){
    var bar=$('cmpbar'); $('cmp-n').textContent=picked.length;
    $('cmpslots').innerHTML = picked.map(function(id){
      var v=byId[id]; return '<span class="slot">'+esc(v.brand+' '+v.model)+'<b data-rm="'+esc(id)+'">✕</b></span>';
    }).join('');
    bar.classList.toggle('show', picked.length>0);
    cards.forEach(function(c){ c.classList.toggle('picked', picked.indexOf(c.getAttribute('data-id'))>=0); });
    Array.prototype.forEach.call($('cmpslots').querySelectorAll('[data-rm]'), function(b){
      b.onclick=function(){ togglePick(b.getAttribute('data-rm')); };
    });
  }
  function togglePick(id){
    var i=picked.indexOf(id);
    if(i>=0){ picked.splice(i,1); }
    else { if(picked.length>=3){ alert('Chỉ so sánh tối đa 3 xe.'); return; } picked.push(id); }
    renderCmpBar();
  }
  $('cmp-clear').onclick=function(){ picked=[]; renderCmpBar(); };
  $('cmp-go').onclick=function(){ if(picked.length<2){ alert('Chọn ít nhất 2 xe để so sánh.'); return; } openCompare(); };

  function openCompare(){
    var vs=picked.map(function(id){return byId[id];});
    function best(vals, hi){ var b=hi?-Infinity:Infinity, idx=-1; vals.forEach(function(x,i){ if(hi? x>b : x<b){b=x;idx=i;} }); return idx; }
    function rowCmp(label, get, hi){
      var raw=vs.map(get); var bi = (typeof raw[0]==='number') ? best(raw,hi) : -1;
      return '<tr><td class="label">'+esc(label)+'</td>'+ vs.map(function(v,i){
        var disp = (typeof get(v)==='number') ? get(v) : get(v);
        return '<td'+(i===bi?' class="best"':'')+'>'+esc(disp)+'</td>';
      }).join('')+'</tr>';
    }
    var html=''
      + '<div class="sheet-head"><h3>So sánh '+vs.length+' xe</h3><button class="closebtn" data-close>✕</button></div>'
      + '<div class="sheet-body" style="overflow-x:auto"><table class="cmp-tbl"><tr><th>Tiêu chí</th>'
      + vs.map(function(v){return '<th>'+esc(v.brand+' '+v.model)+'<div class="muted" style="font-weight:400">'+esc(v.trim)+'</div></th>';}).join('') + '</tr>'
      + rowCmp('Giá từ (triệu)', function(v){return v.price.min;}, false)
      + rowCmp('Phân khúc', function(v){return v.segment;})
      + rowCmp('Nhiên liệu', function(v){return v.fuelType;})
      + rowCmp('Số chỗ', function(v){return v.seats;}, true)
      + rowCmp('Công suất (hp)', function(v){return v.horsepower;}, true)
      + rowCmp('Mô-men (Nm)', function(v){return v.torque;}, true)
      + rowCmp('Khoang hành lý (L)', function(v){return v.cargo;}, true)
      + rowCmp('Độ tin cậy', function(v){return v.reliability;}, true)
      + rowCmp('Tiêu hao', function(v){return v.fuelEconomy;})
      + rowCmp('Bảo hành', function(v){return v.warranty;})
      + '</table><p class="muted" style="margin-top:10px">Ô <span class="best">xanh</span> là tốt nhất ở tiêu chí định lượng.</p></div>';
    openModal(html);
  }

  /* ---------- AI Recommendation (brand-agnostic) ---------- */
  var NEEDS=[
    {k:'city', t:'Đi phố / đô thị'},
    {k:'family', t:'Gia đình'},
    {k:'highway', t:'Đường dài'},
    {k:'offroad', t:'Địa hình / off-road'},
    {k:'economy', t:'Tiết kiệm tối đa'}
  ];
  var PRIOS=[
    {k:'safety', t:'An toàn'},
    {k:'fuelEcon', t:'Tiết kiệm'},
    {k:'comfort', t:'Thoải mái'},
    {k:'performance', t:'Vận hành'},
    {k:'resale', t:'Giữ giá'},
    {k:'tech', t:'Công nghệ'}
  ];
  var reco={ budget:1000, need:'family', seats:5, fuel:'', prios:['safety','fuelEcon'] };

  function chip(on,label,val,attr){ return '<button type="button" class="opt'+(on?' on':'')+'" data-'+attr+'="'+esc(val)+'">'+esc(label)+'</button>'; }
  function recoFormHtml(){
    return ''
      + '<div class="sheet-head"><h3>🤖 Gợi ý xe bằng AI</h3><button class="closebtn" data-close>✕</button></div>'
      + '<div class="sheet-body"><form class="reco-form" id="recoform">'
      + '<div class="fld"><label>Ngân sách tối đa: <span class="budgetval" id="bval">'+reco.budget+' triệu</span></label>'
      +   '<input type="range" id="r-budget" min="240" max="4000" step="10" value="'+reco.budget+'"></div>'
      + '<div class="fld"><label>Nhu cầu chính</label><div class="opts" id="r-need">'+NEEDS.map(function(n){return chip(reco.need===n.k,n.t,n.k,'need');}).join('')+'</div></div>'
      + '<div class="fld"><label>Số chỗ tối thiểu</label><div class="opts" id="r-seats">'+[4,5,7].map(function(s){return chip(reco.seats===s,s+' chỗ',s,'seats');}).join('')+'</div></div>'
      + '<div class="fld"><label>Nhiên liệu ưu tiên</label><div class="opts" id="r-fuel">'
      +   chip(reco.fuel==='',"Bất kỳ",'','fuel')+['Xăng','Hybrid','Điện','Dầu'].map(function(f){return chip(reco.fuel===f,f,f,'fuel');}).join('')+'</div></div>'
      + '<div class="fld"><label>Ưu tiên hàng đầu (chọn nhiều)</label><div class="opts" id="r-prio">'+PRIOS.map(function(p){return chip(reco.prios.indexOf(p.k)>=0,p.t,p.k,'prio');}).join('')+'</div></div>'
      + '<button type="button" class="btn btn-primary btn-lg" id="r-go">Phân tích & gợi ý</button>'
      + '</form><div id="recoresult"></div></div>';
  }
  function bindReco(){
    $('r-budget').addEventListener('input', function(e){ reco.budget=+e.target.value; $('bval').textContent=reco.budget+' triệu'; });
    sheet.querySelector('#r-need').onclick=pick('need','need',false);
    sheet.querySelector('#r-seats').onclick=pick('seats','seats',false,true);
    sheet.querySelector('#r-fuel').onclick=pick('fuel','fuel',false);
    sheet.querySelector('#r-prio').onclick=pick('prio','prios',true);
    $('r-go').onclick=runReco;
  }
  function pick(attr,field,multi,num){
    return function(e){
      var t=e.target.closest('[data-'+attr+']'); if(!t) return;
      var val=t.getAttribute('data-'+attr); if(num) val=+val;
      if(multi){
        var i=reco[field].indexOf(val);
        if(i>=0) reco[field].splice(i,1); else reco[field].push(val);
      } else { reco[field]=val; }
      Array.prototype.forEach.call(e.currentTarget.querySelectorAll('.opt'), function(o){
        var ov=o.getAttribute('data-'+attr); if(num) ov=+ov;
        var on = multi ? reco[field].indexOf(ov)>=0 : reco[field]===ov;
        o.classList.toggle('on', on);
      });
    };
  }
  function scoreVehicle(v){
    var s=0, max=0, why=[];
    // Ngân sách (trọng số cao)
    max+=30;
    if(v.price.min<=reco.budget){ s+=30; if(v.price.max<=reco.budget) why.push('nằm trong ngân sách'); }
    else { var over=(v.price.min-reco.budget)/reco.budget; s+=Math.max(0,30-over*60); }
    // Số chỗ
    max+=15;
    if(v.seats>=reco.seats){ s+=15; } else { s+=Math.max(0,15-(reco.seats-v.seats)*8); }
    // Nhiên liệu
    max+=10; if(!reco.fuel || v.fuelType===reco.fuel){ s+=10; if(reco.fuel) why.push('đúng loại '+reco.fuel); }
    // Nhu cầu chính -> ratings
    var needMap={ city:['fuelEcon','tech'], family:['family','safety','comfort'], highway:['comfort','performance','safety'], offroad:['performance','reliability'], economy:['fuelEcon','resale','reliability'] };
    var nk=needMap[reco.need]||[]; max+=20;
    var nAvg = nk.reduce(function(a,k){return a+(v.ratings[k]||3);},0)/(nk.length||1);
    s += (nAvg/5)*20;
    // Ưu tiên người dùng
    max+=25;
    var pAvg = reco.prios.length ? reco.prios.reduce(function(a,k){return a+(v.ratings[k]||3);},0)/reco.prios.length : 3;
    s += (pAvg/5)*25;
    // Ưu tiên thị trường Việt Nam: xe bán chính hãng + giữ giá + dễ phụ tùng được cộng điểm
    max+=20;
    var vn=v.vietnam||{};
    if(vn.status==='on-sale'){ s+=20; why.push('đang bán chính hãng tại VN'); }
    else if(vn.status==='limited'){ s+=14; why.push('có bán tại VN (hạn chế)'); }
    else if(vn.status==='upcoming'){ s+=10; why.push('sắp ra mắt tại VN'); }
    else if(vn.status==='discontinued'){ s+=6; }
    else { s+=0; } // global-only: không cộng điểm
    var pct=Math.round(Math.max(0,Math.min(100, s/max*100)));
    if(v.ratings.safety>=5) why.push('an toàn cao');
    if(v.ratings.fuelEcon>=5) why.push('rất tiết kiệm');
    if(v.reliability>=5) why.push('bền bỉ');
    return { pct:pct, why:why.slice(0,3), vnStatus:(vn.statusLabel||''), vnAvail:!!vn.available };
  }
  var lastTop=[];
  function runReco(){
    var scored=V.map(function(v){ var r=scoreVehicle(v); return {v:v, pct:r.pct, why:r.why, vnStatus:r.vnStatus, vnAvail:r.vnAvail}; });
    scored.sort(function(a,b){ return b.pct-a.pct; });
    lastTop=scored.slice(0,3);
    var html=lastTop.map(function(it){
      var v=it.v, c=brandColor[v.brandSlug]||'var(--accent)';
      return '<div class="reco-card"><img src="'+esc(v.image)+'" alt="">'
        + '<div style="flex:1"><div class="vbrand" style="color:'+c+'">'+esc(v.brand)+'</div>'
        + '<h3 class="vname" style="margin:2px 0">'+esc(v.model)+' <span>'+esc(v.trim)+'</span></h3>'
        + '<div class="muted" style="font-size:13px">'+esc(v.price.label)+' · '+esc(v.segment)+' · '+esc(v.fuelType)+'</div>'
        + '<div class="muted" style="font-size:12px;margin-top:3px">'+esc(it.vnStatus)+'</div>'
        + '<div class="matchbar"><i style="width:'+it.pct+'%"></i></div>'
        + (it.why.length? '<div class="muted" style="font-size:12px;margin-top:6px">✔ '+esc(it.why.join(' · '))+'</div>':'')
        + (it.vnAvail? '' : '<div style="font-size:12px;margin-top:4px;color:var(--bad)">⚠ Chưa bán chính hãng tại VN — cân nhắc nhập khẩu, phụ tùng & bảo hành.</div>')
        + '<div class="vactions"><button class="btn btn-ghost" data-act="detail" data-id="'+esc(v.id)+'">Chi tiết</button></div>'
        + '</div><div class="pct">'+it.pct+'%</div></div>';
    }).join('');
    html += '<button type="button" class="btn btn-primary btn-lg" id="r-ai">🧠 Phân tích chuyên sâu bằng AI</button><div id="ai-deep"></div>';
    $('recoresult').innerHTML='<h3 style="margin:18px 0 10px">Top '+lastTop.length+' gợi ý</h3>'+html;
    $('r-ai').onclick=runDeepAI;
  }
  function mdLite(t){
    return esc(t)
      .replace(/\\*\\*(.+?)\\*\\*/g,'<b>$1</b>')
      .replace(/^[-•]\\s?(.*)$/gm,'• $1')
      .replace(/\\n/g,'<br>');
  }
  function runDeepAI(){
    var box=$('ai-deep');
    box.innerHTML='<div class="ai-box muted">Đang hỏi AI…</div>';
    var profile='Ngân sách tối đa '+reco.budget+' triệu; nhu cầu '+reco.need+'; tối thiểu '+reco.seats+' chỗ; nhiên liệu '+(reco.fuel||'bất kỳ')+'; ưu tiên '+reco.prios.join(', ')+'. Người dùng mua xe tại Việt Nam: ưu tiên xe đang bán chính hãng, có bảo hành & phụ tùng chính hãng, chi phí bảo dưỡng hợp lý và giữ giá tốt.';
    var cars=lastTop.map(function(it){ var v=it.v; return {
      name:v.brand+' '+v.model+' '+v.trim, price:v.price.label, overall:it.pct, body:v.segment,
      seats:v.seats, engine:v.engine, gearbox:v.transmission, fuelStr:v.fuelType, monthly:0,
      vnStatus:(v.vietnam&&v.vietnam.statusLabel)||'', vnAvailable:!!(v.vietnam&&v.vietnam.available)
    };});
    fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:profile,cars:cars})})
      .then(function(r){ return r.json().then(function(j){ return {ok:r.ok,j:j}; }); })
      .then(function(res){
        if(!res.ok || !res.j.ok){
          box.innerHTML='<div class="ai-box"><span class="ai-warn">⚠ '+esc((res.j&&res.j.error)||'Chưa bật AI chuyên sâu.')+'</span><div class="muted" style="margin-top:6px">Kết quả gợi ý ở trên vẫn hợp lệ (chấm điểm ngoại tuyến).</div></div>';
          return;
        }
        box.innerHTML='<div class="ai-box"><span class="ai-badge">AI · '+esc(res.j.model||'')+'</span><div style="margin-top:10px">'+mdLite(res.j.analysis)+'</div></div>';
      })
      .catch(function(){ box.innerHTML='<div class="ai-box"><span class="ai-warn">⚠ Không gọi được AI.</span></div>'; });
  }
  function openReco(){ openModal(recoFormHtml()); bindReco(); }

  /* ---------- Global click delegation ---------- */
  document.addEventListener('click', function(e){
    var t=e.target.closest('[data-act]');
    if(t){
      var act=t.getAttribute('data-act'), id=t.getAttribute('data-id');
      if(act==='detail') openDetail(id);
      else if(act==='compare') togglePick(id);
      return;
    }
    if(e.target.closest('[data-close]')) closeModal();
  });
  $('cta-reco').onclick=openReco;
  $('nav-reco').onclick=openReco;
  $('cta-compare').onclick=function(){
    if(picked.length<2){ $('catalog').scrollIntoView({behavior:'smooth'}); alert('Chọn ít nhất 2 xe (nút ⚖️ trên thẻ) rồi bấm So sánh.'); return; }
    openCompare();
  };
})();
</script>
</body>
</html>`;

dashboardRouter.get('/', (_req: Request, res: Response) => {
  res.type('html').send(page);
});
