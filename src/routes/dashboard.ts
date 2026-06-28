import { Router, type Request, type Response } from 'express';
import { brands, countryFlag, brandLogo } from '../data/brands.js';
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
  flag: countryFlag(b.country),
  logo: brandLogo(b.slug),
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

function brandChip(b: {
  slug: string;
  name: string;
  country: string;
  color: string;
  wordmark: string;
  count: number;
}): string {
  return (
    `<button class="brandchip" data-brand="${b.slug}" title="${escapeHtml(b.name)} · ${escapeHtml(b.country)} (${b.count} xe)">` +
    `<span class="brandflag">${countryFlag(b.country)}</span>` +
    `<span class="brandmark" style="--bc:${b.color}">${escapeHtml(b.wordmark)}</span>` +
    `<span class="brandcountry">${escapeHtml(b.country)}</span>` +
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
    `<article class="vcard" data-id="${v.id}" data-brand="${v.brandSlug}" data-segment="${escapeHtml(v.segment)}" data-fuel="${escapeHtml(v.fuelType)}" data-vn-status="${vn.status}" data-vn-available="${vn.available ? '1' : '0'}" data-vn-assembly="${vn.assembly}" data-search="${escapeHtml((v.brand + ' ' + v.model + ' ' + v.trim + ' ' + v.segment + ' ' + v.tags.join(' ')).toLowerCase())}">` +
    `<div class="vthumb" data-act="detail" data-id="${v.id}" title="Xem chi tiết"><img loading="lazy" src="${escapeHtml(v.image)}" alt="${escapeHtml(v.brand + ' ' + v.model)}"><span class="vnbadge ${vnClass}">${escapeHtml(vn.badge)}</span><span class="vlogo" style="color:${color}">${escapeHtml(brand?.wordmark ?? v.brand)}</span></div>` +
    `<div class="vbody">` +
    `<div class="vbrand" style="--bc:${color}"><img class="blogo" src="${escapeHtml(brandLogo(v.brandSlug))}" alt="" loading="lazy">${countryFlag(brand?.country ?? '')} ${escapeHtml(v.brand)} <span class="vcountry">· ${escapeHtml(brand?.country ?? '')}</span></div>` +
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
const segmentOptions = segments
  .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
  .join('');
const fuelOptions = fuelTypes
  .map((f) => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`)
  .join('');

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
  --line:rgba(255,255,255,0.08);
  --shadow:0 18px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.14), 0 0 30px rgba(255,209,102,0.28);
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

/* Scrollbar mảnh, gọn */
*{scrollbar-width:thin;scrollbar-color:var(--muted) transparent}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--muted);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
::-webkit-scrollbar-thumb:hover{background:var(--accent2);background-clip:padding-box}
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
.brandflag{line-height:0}
.flagicon{width:20px;height:14px;border-radius:2px;object-fit:cover;vertical-align:middle;box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.brandmark{font-weight:800;font-size:15px;text-align:center}
.brandcountry{font-size:10px;color:var(--muted);text-align:center}
.brandcount{font-size:11px;color:var(--muted)}

/* Filters */
.filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.filters select{padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--text);font-size:14px}
.filters select option{background:var(--surface);color:var(--text)}
.filters .count{margin-left:auto;color:var(--muted);font-size:13px}
.clearbtn{padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:transparent;color:var(--muted);cursor:pointer;font-size:13px}

/* Vehicle cards */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.vcard{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;
  display:flex;flex-direction:column;transition:transform .14s ease,box-shadow .14s ease}
.vcard:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.vthumb{position:relative;aspect-ratio:16/9;background:#0c0c10;overflow:hidden;cursor:pointer}
.vthumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s ease}
.vthumb:hover img{transform:scale(1.05)}
.vnbadge{position:absolute;top:8px;left:8px;font-size:11px;font-weight:800;padding:4px 9px;
  border-radius:999px;backdrop-filter:blur(4px);background:rgba(10,10,14,.62);color:#fff;
  border:1px solid rgba(255,255,255,.18);box-shadow:0 4px 14px rgba(0,0,0,.35)}
.vnbadge.vn-on{background:rgba(28,120,70,.82);border-color:rgba(120,230,170,.4)}
.vnbadge.vn-lim{background:rgba(150,110,10,.82);border-color:rgba(255,210,110,.4)}
.vnbadge.vn-dis{background:rgba(30,80,150,.82);border-color:rgba(130,180,255,.4)}
.vnbadge.vn-up{background:rgba(60,60,70,.82);border-color:rgba(180,180,200,.4)}
.vnbadge.vn-no{background:rgba(150,40,40,.82);border-color:rgba(255,140,140,.4)}
.vlogo{position:absolute;top:8px;right:8px;font-size:11px;font-weight:900;letter-spacing:.3px;
  padding:4px 9px;border-radius:8px;background:rgba(255,255,255,.94);max-width:48%;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.vbody{padding:14px;display:flex;flex-direction:column;gap:8px;flex:1}
.vbrand{font-size:12px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
.blogo{display:inline-block;width:24px;height:24px;object-fit:contain;vertical-align:middle;margin-right:8px;flex:0 0 auto;background:#fff;border-radius:5px;padding:2px;box-sizing:border-box;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.vcountry{font-weight:500;color:var(--muted);text-transform:none;letter-spacing:0}
/* Màu thương hiệu: kẹp độ sáng theo theme để chữ luôn đọc được, vẫn giữ nhận diện hãng */
.brandmark,.vbrand,.bct{color:var(--bc,currentColor)}
html:not([data-theme="light"]) .brandmark,
html:not([data-theme="light"]) .vbrand,
html:not([data-theme="light"]) .bct{color:oklch(from var(--bc,#8a8a8a) max(l,0.74) c h)}
html[data-theme="light"] .brandmark,
html[data-theme="light"] .vbrand,
html[data-theme="light"] .bct{color:oklch(from var(--bc,#444444) min(l,0.46) c h)}
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

/* Floating scroll buttons */
.fab{position:fixed;right:24px;bottom:24px;z-index:55;width:60px;height:60px;border-radius:50%;
  border:none;background:linear-gradient(145deg,var(--accent),var(--accent2));color:#1a1300;
  box-shadow:0 10px 26px rgba(0,0,0,.45),0 0 0 6px rgba(255,209,102,.16);
  cursor:pointer;font-size:34px;font-weight:900;line-height:1;display:none;align-items:center;justify-content:center;
  transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}
.fab:hover{transform:translateY(-4px) scale(1.06);filter:brightness(1.07);
  box-shadow:0 16px 34px rgba(0,0,0,.5),0 0 0 8px rgba(255,209,102,.22)}
.fab:active{transform:translateY(-1px) scale(1)}
.fab.show{display:flex;animation:totop-in .25s ease}
@keyframes totop-in{from{opacity:0;transform:translateY(12px) scale(.8)}to{opacity:1;transform:translateY(0) scale(1)}}

/* Modal */
.modal{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);overflow-y:auto;padding:16px 12px}
.modal.show{display:flex}
.sheet{background:linear-gradient(180deg,var(--surface),var(--card));border:1px solid var(--line);
  border-radius:22px;width:100%;max-width:1240px;box-shadow:var(--shadow);overflow:hidden;margin:auto;
  display:flex;flex-direction:column;height:min(94vh,960px)}
.sheet-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line);background:var(--surface);flex:0 0 auto}
.sheet-head h3{margin:0;font-size:18px;flex:1}
.closebtn{border:1px solid var(--line);background:var(--card);color:var(--text);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:16px}
.sheet-body{padding:18px;flex:1 1 auto;overflow-y:auto}
.tabs{display:flex;gap:6px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid var(--line);background:var(--surface);flex:0 0 auto}
.tab{padding:8px 12px;border-radius:10px;border:1px solid transparent;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;font-weight:600}
.tab.active{color:var(--ink);background:var(--accent)}
.tabpane{display:none}
.tabpane.active{display:block}
.ovgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch;margin-bottom:14px}
.ovimg{width:100%;height:100%;min-height:240px;max-height:420px;object-fit:cover;border-radius:14px}
.ovinfo{min-width:0}
.ovh{margin:14px 0 7px;font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.ovh b{color:var(--accent2)}
.ovside{display:flex;flex-direction:column;gap:14px;min-width:0}
.proscons{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:16px 0}
.pccol{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--card)}
.pccol h4{margin:0 0 8px;font-size:14px}
.pccol ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px}
.pccol li{font-size:13px;line-height:1.5}
.pc-good h4{color:var(--good)}
.pc-bad h4{color:var(--bad)}
@media(max-width:760px){.proscons{grid-template-columns:1fr}}
@media(max-width:760px){.ovgrid{grid-template-columns:1fr}.ovimg{max-height:260px}}

/* tables */
.dtbl{width:100%;border-collapse:collapse;font-size:14px}
.dtbl td,.dtbl th{padding:9px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
.dtbl th{color:var(--muted);font-weight:600;width:40%}
/* spec panel */
.specwrap{display:flex;flex-direction:column;gap:20px}
.specsec{border-top:1px solid var(--line);padding-top:16px}
.specsec:first-child{border-top:none;padding-top:0}
.specsec h4{margin:0 0 10px;font-size:15px;font-weight:800;display:flex;align-items:center;gap:8px}
.specgrid{display:grid;grid-template-columns:1fr 1fr;gap:0 32px}
.specrow{display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:8px 0;border-bottom:1px dashed var(--line)}
.specrow .sl{color:var(--muted);font-size:13px}
.specrow .sv{font-weight:600;font-size:13px;text-align:right;white-space:nowrap}
.specrow.hl .sv{color:var(--accent);font-weight:800}
@media(max-width:760px){.specgrid{grid-template-columns:1fr;gap:0}}
.taglist{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px}
.tag{font-size:12px;padding:5px 10px;border-radius:999px;background:var(--card);border:1px solid var(--line)}
.vn-status{font-size:15px;font-weight:800;padding:10px 14px;border-radius:12px;margin-bottom:12px;
  background:var(--surface);border:1px solid var(--line)}
.vn-notes{margin:6px 0 0;padding-left:20px;font-size:14px;display:flex;flex-direction:column;gap:4px}
.best{color:var(--good);font-weight:800}
.cmp-tbl{width:100%;border-collapse:collapse;font-size:13px}
.cmp-tbl th,.cmp-tbl td{border:1px solid var(--line);padding:9px;text-align:center}
.cmp-tbl th{background:var(--card)}
.cmp-tbl td.cmpimg-cell{padding:6px}
.cmpimg{width:100%;max-width:220px;height:124px;object-fit:cover;border-radius:10px;display:block;margin:0 auto;background:var(--card)}
.cmp-tbl td.label{text-align:left;color:var(--muted);font-weight:600;background:var(--card)}

/* reco */
.reco-form{display:grid;gap:16px}
.fld label{display:block;font-weight:700;margin-bottom:6px;font-size:14px}
.fld .opts{display:flex;gap:8px;flex-wrap:wrap}
.opt{padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer;font-size:13px}
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

/* AI shortlist + vehicle picker */
.aishort{border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:18px;background:var(--card)}
.aishort-h{font-weight:800;font-size:15px}
.aishort-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.aichip{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;
  background:var(--surface);border:1px solid var(--line);font-size:13px;font-weight:600;cursor:grab;user-select:none}
.aichip b{cursor:pointer;color:var(--bad)}
.aichip.dragging{opacity:.5}
.aichip.dragover{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}
.picker-search{width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--line);
  background:var(--card);color:var(--text);font-size:14px;outline:none}
.picker-search:focus{border-color:var(--accent)}
.picker-list{display:flex;flex-direction:column;gap:8px}
.picker-item{display:flex;align-items:center;gap:12px;width:100%;text-align:left;cursor:pointer;
  padding:8px 10px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text)}
.picker-item:hover{border-color:var(--accent)}
.picker-item.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.picker-item img{width:74px;height:46px;object-fit:cover;border-radius:8px;background:#0c0c10;flex:0 0 auto}
.pi-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.pi-brand{font-size:12px;color:var(--muted);font-weight:700}
.pi-model{font-size:14px;font-weight:700}
.pi-price{font-size:12px}
.pi-check{margin-left:auto;font-size:18px;font-weight:900;color:var(--accent);width:26px;text-align:center;flex:0 0 auto}
.picker-foot{padding:14px 18px;border-top:1px solid var(--line);background:var(--surface);text-align:right;flex:0 0 auto}
.btn-ai-on{background:var(--good);color:#06281a}
.muted{color:var(--muted)}
footer{padding:46px 0 calc(72px + env(safe-area-inset-bottom,0px));color:var(--muted);font-size:14px;text-align:center;border-top:1px solid var(--line);margin-top:40px;margin-bottom:calc(40px + env(safe-area-inset-bottom,0px));line-height:1.9}
@media(max-width:760px){footer{padding:38px 0 calc(56px + env(safe-area-inset-bottom,0px));margin-bottom:calc(28px + env(safe-area-inset-bottom,0px))}}
.credit{display:inline-block;margin:22px auto 28px;padding:14px 22px;font-size:14px;
  border:1px solid var(--line);border-radius:14px;background:var(--surface);box-shadow:var(--shadow)}
.credit b{color:var(--accent)}
.credit a{color:var(--accent2);font-weight:600}
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
      <input id="search" type="search" placeholder="Tìm theo hãng, mẫu xe, từ khóa… (vd: SUV, xe điện, 7 chỗ, giá rẻ, chính hãng)">
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
  <div class="credit">Phát triển bởi <b>Viet Turbo Boost</b> • Liên hệ: <a href="mailto:viet.turbo.boost@gmail.com">viet.turbo.boost@gmail.com</a></div>
</footer>

<div class="cmpbar" id="cmpbar">
  <div class="slots" id="cmpslots"></div>
  <button class="btn btn-primary" id="cmp-go">So sánh (<span id="cmp-n">0</span>)</button>
  <button class="clearbtn" id="cmp-clear">Xoá</button>
</div>

<button class="fab" id="totop" title="Về đầu trang" aria-label="Về đầu trang">↑</button>
<button class="fab" id="tobottom" title="Xuống cuối trang" aria-label="Xuống cuối trang">↓</button>

<div class="modal" id="modal"><div class="sheet" id="sheet"></div></div>

<script>
(function(){
  "use strict";
  var V = ${embed(clientVehicles)};
  var B = ${embed(clientBrands)};
  var byId = {}; V.forEach(function(v){ byId[v.id] = v; });
  var brandColor = {}; B.forEach(function(b){ brandColor[b.slug] = b.color; });
  var brandFlag = {}; B.forEach(function(b){ brandFlag[b.slug] = b.flag || ''; });
  var brandLogoMap = {}; B.forEach(function(b){ brandLogoMap[b.slug] = b.logo || ''; });
  function blogo(slug){ var u=brandLogoMap[slug]; return u ? '<img class="blogo" src="'+esc(u)+'" alt="" loading="lazy">' : ''; }

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function $(id){ return document.getElementById(id); }
  function stars(n){ var f=Math.max(0,Math.min(5,Math.round(n))); return '★★★★★'.slice(0,f)+'☆☆☆☆☆'.slice(0,5-f); }
  /* Yêu cầu Wikimedia trả ảnh phân giải cao hơn khi xem chi tiết (cards vẫn dùng bản nhẹ). */
  function hiRes(u){
    if(typeof u!=='string' || u.indexOf('upload.wikimedia.org')<0) return u;
    var p=u.lastIndexOf('/'); if(p<0) return u;
    var seg=u.slice(p+1), m=seg.indexOf('px-'); if(m<1) return u;
    for(var i=0;i<m;i++){ var c=seg.charCodeAt(i); if(c<48||c>57) return u; }
    return u.slice(0,p+1)+'1280px-'+seg.slice(m+3);
  }

  /* Ảnh dự phòng nếu URL gốc lỗi (hiếm) -> không bao giờ hiện icon ảnh vỡ. */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#26262e"/><path d="M40 120 q10 -40 55 -44 l70 -2 q34 0 52 30 l24 4 q14 2 14 16 q0 9 -11 9 l-200 0 q-11 0 -11 -9 z" fill="#3a3a44"/><circle cx="95" cy="118" r="16" fill="#15151a"/><circle cx="210" cy="118" r="16" fill="#15151a"/><text x="160" y="158" font-family="Arial" font-size="13" fill="#9a9aa6" text-anchor="middle">Ảnh đang cập nhật</text></svg>');
  document.addEventListener('error', function(e){
    var t = e.target;
    if(t && t.tagName === 'IMG' && t.classList.contains('blogo')){ t.style.display='none'; return; }
    if(t && t.tagName === 'IMG' && !t.classList.contains('flagicon') && !t.getAttribute('data-fb')){ t.setAttribute('data-fb','1'); t.src = FALLBACK; }
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

  /* ---------- Floating scroll buttons ---------- */
  var totop=$('totop'), tobottom=$('tobottom');
  function updFabs(){
    var y=window.pageYOffset;
    var scrollable=(document.documentElement.scrollHeight-window.innerHeight)>200;
    if(y>400){
      if(totop) totop.classList.add('show');
      if(tobottom) tobottom.classList.remove('show');
    } else {
      if(totop) totop.classList.remove('show');
      if(tobottom){ if(scrollable) tobottom.classList.add('show'); else tobottom.classList.remove('show'); }
    }
  }
  window.addEventListener('scroll', updFabs, { passive:true });
  window.addEventListener('resize', updFabs, { passive:true });
  updFabs();
  if(totop) totop.onclick=function(){ window.scrollTo({ top:0, behavior:'smooth' }); };
  if(tobottom) tobottom.onclick=function(){ window.scrollTo({ top:document.documentElement.scrollHeight, behavior:'smooth' }); };
  function bindTabs(){
    var tabs=sheet.querySelectorAll('.tab'); if(!tabs.length) return;
    Array.prototype.forEach.call(tabs, function(t){
      t.onclick=function(){
        Array.prototype.forEach.call(sheet.querySelectorAll('.tab'),function(x){x.classList.remove('active');});
        Array.prototype.forEach.call(sheet.querySelectorAll('.tabpane'),function(x){x.classList.remove('active');});
        t.classList.add('active');
        var pane=sheet.querySelector('[data-pane="'+t.getAttribute('data-tab')+'"]');
        if(pane) pane.classList.add('active');
        var body=sheet.querySelector('.sheet-body');
        if(body) body.scrollTop=0;
      };
    });
  }

  /* ---------- Vehicle detail ---------- */
  function row(k,v){ return '<tr><th>'+esc(k)+'</th><td>'+esc(v)+'</td></tr>'; }
  function srow(label,val,hl){ return '<div class="specrow'+(hl?' hl':'')+'"><span class="sl">'+esc(label)+'</span><span class="sv">'+esc(val)+'</span></div>'; }
  function specSec(title,rows){ return rows ? '<div class="specsec"><h4>'+title+'</h4><div class="specgrid">'+rows+'</div></div>' : ''; }
  /* Lớp render chỉ ĐỊNH DẠNG giá trị; trả null nếu dữ liệu không tồn tại -> bỏ qua dòng (không bịa số liệu). */
  function uval(val,unit){ return (val===0||val)?(val+(unit||'')):null; }
  function bval(val){ return val===true?'Có':(val===false?'Không':null); }
  function rval(n){ return n?stars(n):null; }
  /* Sổ đăng ký field: mỗi field tự lấy dữ liệu từ dataset (cấu hình thay vì hard-code). */
  var SPEC_FIELDS={
    brand:{l:'Hãng',g:function(v){return v.brand||null;}},
    model:{l:'Mẫu',g:function(v){return v.model?(v.model+(v.trim?' '+v.trim:'')):null;}},
    genYear:{l:'Thế hệ / Năm',g:function(v){var s=((v.generation||'')+' '+(v.year||'')).trim();return s||null;}},
    segment:{l:'Phân khúc',g:function(v){return v.segment||null;}},
    bodyType:{l:'Kiểu thân',g:function(v){return v.bodyType||null;}},
    seats:{l:'Số chỗ',g:function(v){return v.seats!=null?(v.seats+' chỗ'):null;}},
    fuelType:{l:'Nhiên liệu',g:function(v){return v.fuelType||null;}},
    driveType:{l:'Dẫn động',g:function(v){return v.driveType||null;}},
    transmission:{l:'Hộp số',g:function(v){return v.transmission||null;}},
    engine:{l:'Động cơ',g:function(v){return v.engine||null;}},
    engineDisplacement:{l:'Dung tích xy-lanh',g:function(v){return uval(v.engineDisplacement,'L');}},
    electricMotor:{l:'Mô-tơ điện',g:function(v){return v.electricMotor||null;}},
    combinedPower:{l:'Công suất tổng',hl:true,g:function(v){return uval(v.combinedPower,' hp');}},
    horsepower:{l:'Công suất',hl:true,g:function(v){return uval(v.horsepower,' hp');}},
    torque:{l:'Mô-men xoắn',g:function(v){return uval(v.torque,' Nm');}},
    fuelEconomy:{l:'Tiêu hao',hl:true,g:function(v){return v.fuelEconomy||null;}},
    fuelTank:{l:'Dung tích bình',g:function(v){return uval(v.fuelTank,' L');}},
    batteryCapacity:{l:'Dung lượng pin',g:function(v){return uval(v.batteryCapacity,' kWh');}},
    range:{l:'Quãng đường/lần sạc',hl:true,g:function(v){return uval(v.range,' km');}},
    acCharging:{l:'Sạc AC',g:function(v){return uval(v.acCharging,' kW');}},
    dcCharging:{l:'Sạc nhanh DC',g:function(v){return uval(v.dcCharging,' kW');}},
    chargingTime:{l:'Thời gian sạc',g:function(v){return v.chargingTime||null;}},
    driveModes:{l:'Chế độ lái',g:function(v){return (v.driveModes&&v.driveModes.length)?v.driveModes.join(', '):null;}},
    zeroTo100:{l:'Tăng tốc 0–100 km/h',g:function(v){return uval(v.zeroTo100,' s');}},
    topSpeed:{l:'Tốc độ tối đa',g:function(v){return uval(v.topSpeed,' km/h');}},
    payload:{l:'Tải trọng',g:function(v){return uval(v.payload,' kg');}},
    towing:{l:'Khả năng kéo',g:function(v){return uval(v.towing,' kg');}},
    differentialLock:{l:'Khóa vi sai',g:function(v){return bval(v.differentialLock);}},
    waterWading:{l:'Khả năng lội nước',g:function(v){return uval(v.waterWading,' mm');}},
    slidingDoors:{l:'Cửa trượt',g:function(v){return bval(v.slidingDoors);}},
    thirdRow:{l:'Hàng ghế thứ 3',g:function(v){return bval(v.thirdRow);}},
    weightDistribution:{l:'Phân bổ trọng lượng',g:function(v){return v.weightDistribution||null;}},
    length:{l:'Dài',g:function(v){return v.dimensions&&uval(v.dimensions.length,' mm');}},
    width:{l:'Rộng',g:function(v){return v.dimensions&&uval(v.dimensions.width,' mm');}},
    height:{l:'Cao',g:function(v){return v.dimensions&&uval(v.dimensions.height,' mm');}},
    wheelbase:{l:'Trục cơ sở',g:function(v){return v.dimensions&&uval(v.dimensions.wheelbase,' mm');}},
    groundClearance:{l:'Khoảng sáng gầm',g:function(v){return uval(v.groundClearance,' mm');}},
    turningRadius:{l:'Bán kính quay đầu',g:function(v){return uval(v.turningRadius,' m');}},
    curbWeight:{l:'Trọng lượng',g:function(v){return uval(v.curbWeight,' kg');}},
    cargo:{l:'Khoang hành lý',g:function(v){return uval(v.cargo,' L');}},
    ratingSafety:{l:'Xếp hạng an toàn',hl:true,g:function(v){return rval(v.ratings&&v.ratings.safety);}},
    reliability:{l:'Độ tin cậy',hl:true,g:function(v){return rval(v.reliability);}},
    ratingResale:{l:'Giá trị bán lại',g:function(v){return rval(v.ratings&&v.ratings.resale);}},
    warranty:{l:'Bảo hành',hl:true,g:function(v){return v.warranty||null;}},
    maintenanceCostPerYear:{l:'Chi phí bảo dưỡng/năm',g:function(v){return v.maintenanceCostPerYear||null;}},
    ownershipCost:{l:'Tổng chi phí sở hữu/năm',g:function(v){return v.ownershipCost||null;}}
  };
  /* Mục "Vận hành" thích ứng theo loại xe; chỉ field có dữ liệu mới hiển thị. */
  var PERF_BY_TYPE={
    ev:['batteryCapacity','horsepower','torque','range','acCharging','dcCharging','chargingTime','driveModes'],
    hybrid:['engine','electricMotor','combinedPower','horsepower','torque','batteryCapacity','transmission','driveType','fuelEconomy'],
    pickup:['engine','engineDisplacement','horsepower','torque','transmission','driveType','fuelEconomy','fuelTank','payload','towing','differentialLock','driveModes','waterWading'],
    mpv:['engine','engineDisplacement','horsepower','torque','transmission','driveType','fuelEconomy','fuelTank','slidingDoors','thirdRow','zeroTo100'],
    sports:['engine','engineDisplacement','horsepower','torque','transmission','driveType','zeroTo100','topSpeed','weightDistribution'],
    ice:['engine','engineDisplacement','horsepower','torque','transmission','driveType','fuelEconomy','fuelTank','zeroTo100','topSpeed']
  };
  function vehicleType(v){
    if(v.fuelType==='Điện') return 'ev';
    if(v.fuelType==='Hybrid') return 'hybrid';
    var b=(v.bodyType||'').toLowerCase(), s=(v.segment||'').toLowerCase();
    if(b.indexOf('pickup')>=0||b.indexOf('bán tải')>=0||s.indexOf('bán tải')>=0) return 'pickup';
    if(b.indexOf('mpv')>=0||s.indexOf('mpv')>=0) return 'mpv';
    if(b.indexOf('coupe')>=0||s.indexOf('thể thao')>=0||s.indexOf('sport')>=0) return 'sports';
    return 'ice';
  }
  function srows(v,keys){ var out=''; for(var i=0;i<keys.length;i++){ var f=SPEC_FIELDS[keys[i]]; if(!f) continue; var val=f.g(v); if(val==null||val==='') continue; out+=srow(f.l,val,f.hl); } return out; }
  function chipsBlock(arr){ return (arr&&arr.length)? '<div class="taglist" style="margin:8px 0 0">'+arr.map(function(x){return '<span class="tag">'+esc(x)+'</span>';}).join('')+'</div>' : ''; }
  function specPaneHtml(v){
    var t=vehicleType(v), html='';
    html+=specSec('🚗 Tổng quan', srows(v,['brand','model','genYear','segment','bodyType','seats','fuelType','driveType','transmission']));
    html+=specSec('📐 Kích thước', srows(v,['length','width','height','wheelbase','groundClearance','turningRadius','curbWeight','cargo']));
    html+=specSec('⚙️ Vận hành', srows(v, PERF_BY_TYPE[t]||PERF_BY_TYPE.ice));
    var safRows=srows(v,['ratingSafety']), safChips=chipsBlock(v.safetyFeatures);
    if(safRows||safChips){ html+='<div class="specsec"><h4>🛡 An toàn</h4>'+(safRows?'<div class="specgrid">'+safRows+'</div>':'')+safChips+'</div>'; }
    var comChips=chipsBlock(v.techFeatures);
    if(comChips){ html+='<div class="specsec"><h4>💺 Tiện nghi & Công nghệ</h4>'+comChips+'</div>'; }
    html+=specSec('🔧 Sở hữu', srows(v,['reliability','warranty','maintenanceCostPerYear','ownershipCost','ratingResale']));
    return html ? '<div class="specwrap">'+html+'</div>' : '<p class="muted">Chưa có thông số cho mẫu xe này.</p>';
  }
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
      + '<div class="sheet-head"><h3>'+blogo(v.brandSlug)+(brandFlag[v.brandSlug]?brandFlag[v.brandSlug]+' ':'')+'<span class="bct" style="--bc:'+c+'">'+esc(v.brand)+'</span> '+esc(v.model)+' · '+esc(v.trim)+'</h3>'
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
      +     '<div class="ovgrid">'
      +       '<img class="ovimg" src="'+esc(hiRes(v.image))+'" data-orig="'+esc(v.image)+'" alt="">'
      +       '<div class="ovinfo">'
      +         '<div class="vprice" style="font-size:20px">'+esc(v.price.label)+'</div>'
      +         '<div class="vmeta" style="margin:8px 0">'+stars(v.reliability)+' · '+esc(v.segment)+' · '+esc(v.fuelType)+' · '+v.seats+' chỗ</div>'
      +         '<table class="dtbl">'
      +           row('Động cơ', v.engine) + row('Hộp số', v.transmission) + row('Dẫn động', v.driveType)
      +           row('Công suất', v.horsepower+' hp / '+v.torque+' Nm') + row('Tiêu hao', v.fuelEconomy)
      +           row('Bảo hành', v.warranty)
      +         '</table>'
      +       '</div>'
      +     '</div>'
      +     '<div class="ovgrid">'
      +       '<div class="ovside">'
      +         '<div class="pccol pc-good"><h4>✅ Ưu điểm</h4><ul>'+(v.pros||[]).map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>'
      +         '<div class="pccol pc-bad"><h4>⚠️ Nhược điểm</h4><ul>'+(v.cons||[]).map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>'
      +       '</div>'
      +       '<div class="ovinfo">'
      +         '<p class="ovh" style="margin-top:0"><b>An toàn</b></p>'+tags(v.safetyFeatures)
      +         '<p class="ovh"><b>Công nghệ</b></p>'+tags(v.techFeatures)
      +         '<p class="ovh"><b>Lưu ý thường gặp</b></p>'+tags(v.commonIssues)
      +         '<p class="ovh"><b>Phù hợp với</b></p>'+tags(v.suitableFor||[])
      +         '<p class="ovh"><b>Từ khóa</b></p>'+tags(v.tags||[])
      +       '</div>'
      +     '</div>'
      +     '<div class="vactions">'
      +       '<button class="btn btn-ghost" data-act="compare" data-id="'+esc(v.id)+'">⚖️ Thêm vào so sánh</button>'
      +       '<button class="btn '+(aiHas(v.id)?'btn-ai-on':'btn-primary')+'" data-aiadd="'+esc(v.id)+'">'+(aiHas(v.id)?'✓ Đã thêm vào AI':'+ Thêm vào so sánh AI')+'</button>'
      +     '</div>'
      +   '</div>'
      +   '<div class="tabpane" data-pane="spec">'+specPaneHtml(v)+'</div>'
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
  function openDetail(id){ var v=byId[id]; if(v){ openModal(detailHtml(v)); var im=document.querySelector('#sheet .ovimg'); if(im){ im.setAttribute('data-fb','1'); im.onerror=function(){ this.onerror=null; var o=this.getAttribute('data-orig'); if(o){ this.src=o; } }; } } }

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
      + vs.map(function(v){return '<th>'+blogo(v.brandSlug)+(brandFlag[v.brandSlug]?brandFlag[v.brandSlug]+' ':'')+esc(v.brand+' '+v.model)+'<div class="muted" style="font-weight:400">'+esc(v.trim)+'</div></th>';}).join('') + '</tr>'
      + '<tr><td class="label">Ảnh</td>'+ vs.map(function(v){return '<td class="cmpimg-cell"><img class="cmpimg" src="'+esc(hiRes(v.image))+'" data-orig="'+esc(v.image)+'" alt="'+esc(v.brand+' '+v.model)+'"></td>';}).join('') +'</tr>'
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
    Array.prototype.forEach.call(document.querySelectorAll('#sheet .cmpimg'), function(im){
      im.setAttribute('data-fb','1');
      im.onerror=function(){ this.onerror=null; var o=this.getAttribute('data-orig'); if(o){ this.src=o; } };
    });
  }

  /* ---------- AI shortlist (chọn xe để AI so sánh) ---------- */
  var aiSel=[];
  try{ var _s=localStorage.getItem('ar-ai-sel'); if(_s){ aiSel=JSON.parse(_s).filter(function(id){return byId[id];}).slice(0,5); } }catch(e){}
  function saveAiSel(){ try{ localStorage.setItem('ar-ai-sel', JSON.stringify(aiSel)); }catch(e){} }
  function aiHas(id){ return aiSel.indexOf(id)>=0; }
  function aiToggle(id){
    var i=aiSel.indexOf(id);
    if(i>=0){ aiSel.splice(i,1); }
    else { if(aiSel.length>=5){ alert('Chỉ chọn tối đa 5 xe cho AI so sánh.'); return false; } aiSel.push(id); }
    saveAiSel(); refreshAiUI(); return true;
  }
  function aiRemove(id){ var i=aiSel.indexOf(id); if(i>=0){ aiSel.splice(i,1); saveAiSel(); refreshAiUI(); } }
  function aiMove(from,to){ if(from<0||to<0||to>=aiSel.length||from===to) return; var x=aiSel.splice(from,1)[0]; aiSel.splice(to,0,x); saveAiSel(); refreshAiUI(); }
  function aiShortHtml(){
    if(!aiSel.length){
      return '<div class="aishort" id="aishort">'
        + '<div class="aishort-h">Bạn đang phân vân xe nào?</div>'
        + '<p class="muted" style="margin:6px 0 12px">Chọn trước các mẫu xe sẽ giúp AI tư vấn chính xác hơn.</p>'
        + '<button type="button" class="btn btn-primary" data-aipickopen>+ Chọn xe</button>'
        + '</div>';
    }
    var chips=aiSel.map(function(id){ var v=byId[id]; if(!v) return '';
      return '<span class="aichip" draggable="true" data-id="'+esc(id)+'" title="Kéo để đổi thứ tự">'
        + (brandFlag[v.brandSlug]?brandFlag[v.brandSlug]+' ':'') + esc(v.brand+' '+v.model)
        + '<b data-airm="'+esc(id)+'" title="Xoá">✕</b></span>';
    }).join('');
    return '<div class="aishort" id="aishort">'
      + '<div class="aishort-h">Bạn đang phân vân: <span class="muted" style="font-weight:400">('+aiSel.length+'/5)</span></div>'
      + '<div class="aishort-chips" id="aichips">'+chips+'</div>'
      + '<button type="button" class="btn btn-ghost" data-aipickopen>+ Thêm xe</button>'
      + '<button type="button" class="btn btn-primary" id="ai-ask" style="margin-left:8px">🧠 Hỏi AI so sánh</button>'
      + '<div id="ai-deep-sel" style="margin-top:12px"></div>'
      + '</div>';
  }
  function bindAiShort(){
    var box=sheet.querySelector('#aishort'); if(!box) return;
    Array.prototype.forEach.call(box.querySelectorAll('[data-airm]'), function(b){
      b.onclick=function(ev){ ev.stopPropagation(); aiRemove(b.getAttribute('data-airm')); };
    });
    var ask=box.querySelector('#ai-ask'); if(ask) ask.onclick=function(){ runDeepAI('ai-deep-sel'); };
    var dragId=null;
    Array.prototype.forEach.call(box.querySelectorAll('.aichip'), function(ch){
      ch.addEventListener('dragstart', function(){ dragId=ch.getAttribute('data-id'); ch.classList.add('dragging'); });
      ch.addEventListener('dragend', function(){ ch.classList.remove('dragging'); });
      ch.addEventListener('dragover', function(e){ e.preventDefault(); ch.classList.add('dragover'); });
      ch.addEventListener('dragleave', function(){ ch.classList.remove('dragover'); });
      ch.addEventListener('drop', function(e){ e.preventDefault(); ch.classList.remove('dragover');
        aiMove(aiSel.indexOf(dragId), aiSel.indexOf(ch.getAttribute('data-id')));
      });
    });
  }
  function refreshAiUI(){
    var box=sheet.querySelector('#aishort');
    if(box){ box.outerHTML=aiShortHtml(); bindAiShort(); }
  }
  function setAiBtn(btn,on){
    btn.textContent = on ? '✓ Đã thêm vào AI' : '+ Thêm vào so sánh AI';
    btn.classList.toggle('btn-primary', !on);
    btn.classList.toggle('btn-ai-on', on);
  }

  /* ---------- Vehicle picker for AI ---------- */
  function pickerItemHtml(v){
    var on=aiHas(v.id);
    return '<button type="button" class="picker-item'+(on?' on':'')+'" data-aipick="'+esc(v.id)+'">'
      + '<img src="'+esc(v.image)+'" alt="" loading="lazy">'
      + '<span class="pi-main"><span class="pi-brand">'+(brandFlag[v.brandSlug]?brandFlag[v.brandSlug]+' ':'')+esc(v.brand)+'</span>'
      + '<span class="pi-model">'+esc(v.model)+' <span class="muted">'+esc(v.trim)+'</span></span>'
      + '<span class="muted pi-price">'+esc(v.price.label)+' · '+esc(v.segment)+'</span></span>'
      + '<span class="pi-check">'+(on?'✓':'+')+'</span>'
      + '</button>';
  }
  function renderPickerList(q){
    q=(q||'').trim().toLowerCase();
    var list=V.filter(function(v){
      if(!q) return true;
      return (v.brand+' '+v.model+' '+v.trim+' '+v.segment).toLowerCase().indexOf(q)>=0;
    }).slice(0,80);
    var el=sheet.querySelector('#picker-list'); if(!el) return;
    el.innerHTML = list.length ? list.map(pickerItemHtml).join('') : '<p class="muted" style="padding:14px">Không tìm thấy xe phù hợp.</p>';
  }
  function updPickerN(){ var n=sheet.querySelector('#picker-n'); if(n) n.textContent='('+aiSel.length+'/5)'; }
  function openPicker(){
    var html=''
      + '<div class="sheet-head"><h3>Chọn xe để AI so sánh <span class="muted" id="picker-n" style="font-weight:400;font-size:14px"></span></h3>'
      +   '<button class="closebtn" data-aidone title="Xong">✕</button></div>'
      + '<div style="padding:12px 18px;border-bottom:1px solid var(--line)"><input class="picker-search" id="picker-q" type="search" autocomplete="off" placeholder="Tìm theo hãng, model, phân khúc… (Corolla, CX-5, VF…)"></div>'
      + '<div class="sheet-body"><div class="picker-list" id="picker-list"></div></div>'
      + '<div class="picker-foot"><button type="button" class="btn btn-primary btn-lg" data-aidone>Xong</button></div>';
    openModal(html);
    var q=sheet.querySelector('#picker-q');
    if(q){ q.oninput=function(){ renderPickerList(q.value); }; setTimeout(function(){ try{ q.focus(); }catch(e){} },40); }
    renderPickerList(''); updPickerN();
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
      + '<div class="sheet-body">' + aiShortHtml() + '<form class="reco-form" id="recoform">'
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
    bindAiShort();
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
    var useSel = aiSel.length>0;
    var pool = useSel ? aiSel.map(function(id){ return byId[id]; }).filter(Boolean) : V;
    var scored=pool.map(function(v){ var r=scoreVehicle(v); return {v:v, pct:r.pct, why:r.why, vnStatus:r.vnStatus, vnAvail:r.vnAvail}; });
    scored.sort(function(a,b){ return b.pct-a.pct; });
    lastTop = useSel ? scored : scored.slice(0,3);
    var heading = useSel ? ('So sánh '+lastTop.length+' xe bạn đang phân vân') : ('Top '+lastTop.length+' gợi ý');
    var html=lastTop.map(function(it){
      var v=it.v, c=brandColor[v.brandSlug]||'var(--accent)';
      return '<div class="reco-card"><img src="'+esc(v.image)+'" alt="">'
        + '<div style="flex:1"><div class="vbrand" style="--bc:'+c+'">'+blogo(v.brandSlug)+(brandFlag[v.brandSlug]?brandFlag[v.brandSlug]+' ':'')+esc(v.brand)+'</div>'
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
    $('recoresult').innerHTML='<h3 style="margin:18px 0 10px">'+esc(heading)+'</h3>'+html;
    $('r-ai').onclick=function(){ runDeepAI('ai-deep'); };
  }
  function mdLite(t){
    return esc(t)
      .replace(/\\*\\*(.+?)\\*\\*/g,'<b>$1</b>')
      .replace(/^[-•]\\s?(.*)$/gm,'• $1')
      .replace(/\\n/g,'<br>');
  }
  function runDeepAI(boxId){
    var box=$(boxId||'ai-deep'); if(!box) return;
    box.innerHTML='<div class="ai-box muted">Đang hỏi AI…</div>';
    var useSel = aiSel.length>0;
    var profile=(useSel?'Người dùng đang phân vân và muốn SO SÁNH đúng các xe trong danh sách đã chọn. ':'')
      + 'Ngân sách tối đa '+reco.budget+' triệu; nhu cầu '+reco.need+'; tối thiểu '+reco.seats+' chỗ; nhiên liệu '+(reco.fuel||'bất kỳ')+'; ưu tiên '+reco.prios.join(', ')+'. Người dùng mua xe tại Việt Nam: ưu tiên xe đang bán chính hãng, có bảo hành & phụ tùng chính hãng, chi phí bảo dưỡng hợp lý và giữ giá tốt.';
    var src = useSel ? aiSel.map(function(id){ return { v:byId[id], pct:0 }; }) : lastTop;
    var cars=src.filter(function(it){ return it && it.v; }).map(function(it){ var v=it.v; return {
      name:v.brand+' '+v.model+' '+v.trim, price:v.price.label, overall:it.pct||0, body:v.segment,
      seats:v.seats, engine:v.engine, gearbox:v.transmission, fuelStr:v.fuelType, monthly:0,
      vnStatus:(v.vietnam&&v.vietnam.statusLabel)||'', vnAvailable:!!(v.vietnam&&v.vietnam.available)
    };});
    if(!cars.length){ box.innerHTML='<div class="ai-box"><span class="ai-warn">⚠ Chưa có xe để phân tích. Hãy chọn xe hoặc bấm “Phân tích & gợi ý”.</span></div>'; return; }
    var payload={ profile:profile, cars:cars };
    if(useSel) payload.selectedVehicles=aiSel.slice();
    fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
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
    if(e.target.closest('[data-aipickopen]')){ openPicker(); return; }
    if(e.target.closest('[data-aidone]')){ openReco(); return; }
    var pk=e.target.closest('[data-aipick]');
    if(pk){ var pid=pk.getAttribute('data-aipick'); aiToggle(pid);
      var pon=aiHas(pid); pk.classList.toggle('on', pon);
      var ck=pk.querySelector('.pi-check'); if(ck) ck.textContent=pon?'✓':'+'; updPickerN(); return; }
    var aa=e.target.closest('[data-aiadd]');
    if(aa){ var aid=aa.getAttribute('data-aiadd'); aiToggle(aid); setAiBtn(aa, aiHas(aid)); return; }
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
