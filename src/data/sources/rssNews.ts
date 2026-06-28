/**
 * Adapter NGUỒN THẬT: đọc RSS của báo/tin xe để phát hiện sự kiện & cảnh báo thị trường.
 *
 * NGUYÊN TẮC (bắt buộc):
 *  - CHỈ trích thông tin do nguồn CÔNG BỐ RÕ RÀNG (tiêu đề/mô tả bài viết), kèm
 *    publisher + url + ngày. KHÔNG suy diễn số liệu giá (RSS không chứa số liệu
 *    đáng tin) -> adapter này KHÔNG tạo observations số.
 *  - Chỉ nhận bài viết có nhắc ĐÚNG mẫu xe đang xét (khớp brand + model).
 *  - Lỗi mạng / không tải được -> trả null (không bịa).
 *  - Việc một sự kiện có được GIỮ hay không vẫn do pipeline cross-check quyết định
 *    (>=2 nguồn, hoặc 1 nguồn có thẩm quyền). Adapter chỉ cung cấp ứng viên.
 */

import type {
  CollectorVehicle,
  MarketDataSource,
  MarketEvent,
  SourceKind,
  SourceReport,
  SourceRef,
} from '../marketCollector.js';

export interface RssItem {
  title: string;
  link: string;
  /** Ngày xuất bản dạng ISO yyyy-mm-dd nếu phân tích được, ngược lại ''. */
  date: string;
}

export interface RssNewsOptions {
  /** Tên adapter (debug). */
  name?: string;
  /** Tên đơn vị xuất bản (vd "VnExpress"). */
  publisher: string;
  /** URL feed RSS. */
  url: string;
  /** Loại nguồn. Mặc định 'news'. */
  kind?: SourceKind;
  /** Có tin cậy không. Mặc định true. */
  trusted?: boolean;
  /** Hàm tải nội dung (tiêm vào để test). Mặc định dùng fetch toàn cục. */
  fetchImpl?: (url: string) => Promise<string | null>;
}

interface SignalRule {
  /** Regex (đã lowercase) nhận diện loại tín hiệu. */
  test: RegExp;
  /** Nhãn cảnh báo chuẩn hoá. */
  alert: string;
}

/** Bộ luật phát hiện tín hiệu thị trường từ tiêu đề (tiếng Việt). */
const SIGNAL_RULES: SignalRule[] = [
  { test: /giảm giá|ưu đãi|khuyến mãi|giảm sốc|hạ giá/, alert: '🔻 Giảm giá / ưu đãi' },
  { test: /tăng giá|điều chỉnh giá tăng/, alert: '📈 Tăng giá' },
  { test: /triệu hồi/, alert: '⚠️ Triệu hồi' },
  { test: /thế hệ mới|hoàn toàn mới|all-?new/, alert: '🆕 Thế hệ mới' },
  { test: /facelift|nâng cấp|bản nâng cấp/, alert: '🔧 Nâng cấp / facelift' },
  { test: /ra mắt|trình làng|mở bán|chính thức bán/, alert: '🆕 Ra mắt / mở bán' },
  { test: /khan hàng|thiếu xe|cháy hàng|khan hiếm/, alert: '⏳ Khan hàng' },
  { test: /ế ẩm|tồn kho|xả hàng|dư thừa/, alert: '📦 Tồn kho / dư cung' },
  { test: /cập nhật phần mềm|ota/, alert: '🔄 Cập nhật phần mềm (OTA)' },
];

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(block: string, tag: string): string {
  const m = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i').exec(block);
  return m ? decode(m[1]) : '';
}

/** Chuyển pubDate (RFC822 hoặc ISO) sang yyyy-mm-dd; '' nếu không parse được. */
function toIsoDate(raw: string): string {
  if (!raw) return '';
  const t = Date.parse(raw);
  if (Number.isNaN(t)) return '';
  return new Date(t).toISOString().slice(0, 10);
}

/** Phân tích các <item> trong feed RSS/Atom thành danh sách RssItem. */
export function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? [];
  for (const block of blocks) {
    const title = pick(block, 'title');
    if (!title) continue;
    let link = pick(block, 'link');
    if (!link) {
      const hm = /<link[^>]*href=["']([^"']+)["']/i.exec(block);
      if (hm) link = hm[1];
    }
    const date = toIsoDate(pick(block, 'pubDate') || pick(block, 'updated') || pick(block, 'published'));
    items.push({ title, link, date });
  }
  return items;
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFC');
}

/** Bài viết có nhắc đúng mẫu xe không (cần khớp model; brand nếu model chung chung). */
export function mentionsVehicle(title: string, vehicle: CollectorVehicle): boolean {
  const t = norm(title);
  const model = norm(vehicle.model);
  if (!t.includes(model)) return false;
  // Model quá ngắn (<=3 ký tự, vd "C3") dễ trùng -> yêu cầu có cả brand.
  if (model.replace(/\s/g, '').length <= 3) return t.includes(norm(vehicle.brand));
  return true;
}

export interface MarketSignal {
  event: MarketEvent;
  alert: string | null;
  link: string;
}

/** Trích tín hiệu thị trường (sự kiện + cảnh báo) từ các bài viết khớp mẫu xe. */
export function extractMarketSignals(items: RssItem[], vehicle: CollectorVehicle): MarketSignal[] {
  const out: MarketSignal[] = [];
  for (const it of items) {
    if (!mentionsVehicle(it.title, vehicle)) continue;
    const lower = norm(it.title);
    let alert: string | null = null;
    for (const rule of SIGNAL_RULES) {
      if (rule.test.test(lower)) {
        alert = rule.alert;
        break;
      }
    }
    out.push({
      event: { date: it.date, title: it.title },
      alert,
      link: it.link,
    });
  }
  return out;
}

async function defaultFetch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'AutoReviewMarketBot/1.0' } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Tạo một nguồn dữ liệu thị trường từ feed RSS tin xe.
 * Chỉ sinh events/alerts có thật từ bài viết; KHÔNG sinh số liệu giá.
 */
export function createRssNewsSource(opts: RssNewsOptions): MarketDataSource {
  const fetchImpl = opts.fetchImpl ?? defaultFetch;
  const kind: SourceKind = opts.kind ?? 'news';
  return {
    name: opts.name ?? opts.publisher,
    kind,
    trusted: opts.trusted ?? true,
    async collect(vehicle: CollectorVehicle): Promise<SourceReport | null> {
      const xml = await fetchImpl(opts.url);
      if (xml == null) return null;
      const items = parseRssItems(xml);
      const signals = extractMarketSignals(items, vehicle);
      if (!signals.length) return { events: [], alerts: [] };

      const events: { event: MarketEvent; source: SourceRef }[] = [];
      const alerts: { alert: string; source: SourceRef }[] = [];
      for (const sig of signals) {
        const ref: SourceRef = {
          field: 'recentEvents',
          url: sig.link || opts.url,
          publisher: opts.publisher,
          date: sig.event.date,
        };
        events.push({ event: sig.event, source: ref });
        if (sig.alert) {
          alerts.push({ alert: sig.alert, source: { ...ref, field: 'marketAlerts' } });
        }
      }
      return { events, alerts };
    },
  };
}
