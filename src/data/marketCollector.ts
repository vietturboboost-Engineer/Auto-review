/**
 * Bộ thu thập dữ liệu Xu hướng thị trường xe tại Việt Nam.
 *
 * NGUYÊN TẮC CỐT LÕI (bắt buộc):
 *  - KHÔNG bịa số liệu. Nếu không xác minh được → trả về null / '' / [].
 *  - Chỉ giữ một giá trị khi được ÍT NHẤT 2 nguồn tin cậy độc lập xác nhận
 *    (riêng sự kiện/cảnh báo chính thức từ hãng hoặc cơ quan nhà nước thì 1 nguồn
 *    có thẩm quyền là đủ).
 *  - Mỗi giá trị giữ lại đều kèm nguồn (publisher + url + ngày).
 *  - Không lấy dữ liệu từ blog/nguồn không xác thực (source.trusted === false bị bỏ qua).
 *
 * Đây là khung thu thập có thể cắm thêm các "nguồn" (MarketDataSource).
 * Mặc định KHÔNG kèm nguồn web tự bịa: muốn có dữ liệu thật, cấu hình adapter
 * nguồn thật (API hãng, sàn xe cũ...) hoặc nạp dữ liệu đã kiểm chứng thủ công
 * qua VerifiedMarketFile.
 */

import type { MarketTrendsData, MarketTimelineEvent } from './vehicles.js';

// ----- Kiểu dữ liệu đầu ra (theo đúng spec) -----

export type SupplyLevel = 'Thấp' | 'Trung bình' | 'Cao';
export type DemandLevel = 'Thấp' | 'Trung bình' | 'Cao' | 'Rất cao';
export type SourceKind = 'manufacturer' | 'news' | 'government' | 'marketplace';

export interface SourceRef {
  /** Trường dữ liệu mà nguồn này chứng thực. */
  field: string;
  url: string;
  publisher: string;
  /** Ngày xuất bản (ISO yyyy-mm-dd). */
  date: string;
}

export interface MarketEvent {
  /** Mốc thời gian (vd "2026-05"). */
  date: string;
  title: string;
}

export interface MarketTrend {
  /** Ngày cập nhật (ISO yyyy-mm-dd). */
  lastUpdated: string;
  averageMarketPrice: number | null;
  priceChange30d: number | null;
  priceChange90d: number | null;
  priceChange365d: number | null;
  supplyLevel: SupplyLevel | '';
  demandLevel: DemandLevel | '';
  estimatedDaysToSell: number | null;
  popularity: string;
  resaleConfidence: string;
  marketAlerts: string[];
  recentEvents: MarketEvent[];
}

export interface CollectedMarketTrend extends MarketTrend {
  /** Danh sách nguồn cho từng giá trị đã giữ lại. */
  sources: SourceRef[];
}

// ----- Mô hình nguồn dữ liệu (adapter) -----

export interface CollectorVehicle {
  id: string;
  brand: string;
  model: string;
  segment: string;
}

/** Một quan sát cho một trường vô hướng từ một nguồn. */
export interface Observation {
  field: ScalarField;
  value: number | string;
  source: SourceRef;
}

/** Báo cáo của một nguồn cho một xe. */
export interface SourceReport {
  observations?: Observation[];
  events?: { event: MarketEvent; source: SourceRef }[];
  alerts?: { alert: string; source: SourceRef }[];
}

export interface MarketDataSource {
  name: string;
  kind: SourceKind;
  /** Nguồn có thuộc danh sách tin cậy không. Nguồn không tin cậy bị loại hoàn toàn. */
  trusted: boolean;
  collect(vehicle: CollectorVehicle): Promise<SourceReport | null>;
}

export interface CrossCheckOptions {
  /** Số nguồn tin cậy tối thiểu để giữ một giá trị. Mặc định 2. */
  minSources?: number;
  /** Dung sai phần trăm khi đối chiếu số liệu. Mặc định 8%. */
  numericTolerancePct?: number;
}

const NUMERIC_FIELDS = [
  'averageMarketPrice',
  'priceChange30d',
  'priceChange90d',
  'priceChange365d',
  'estimatedDaysToSell',
] as const;

const CATEGORICAL_FIELDS = ['supplyLevel', 'demandLevel', 'popularity', 'resaleConfidence'] as const;

export type NumericField = (typeof NUMERIC_FIELDS)[number];
export type CategoricalField = (typeof CATEGORICAL_FIELDS)[number];
export type ScalarField = NumericField | CategoricalField;

interface KindedObs {
  field: ScalarField;
  value: number | string;
  source: SourceRef;
  kind: SourceKind;
}
interface KindedEvent {
  event: MarketEvent;
  source: SourceRef;
  kind: SourceKind;
}
interface KindedAlert {
  alert: string;
  source: SourceRef;
  kind: SourceKind;
}

function isAuthoritative(kind: SourceKind): boolean {
  return kind === 'manufacturer' || kind === 'government';
}

function distinctByPublisher(refs: SourceRef[]): SourceRef[] {
  const seen = new Set<string>();
  const out: SourceRef[] = [];
  for (const r of refs) {
    const key = r.publisher.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

/** Đối chiếu số: gom cụm theo dung sai, lấy cụm có nhiều nguồn nhất. */
function reconcileNumeric(
  obs: KindedObs[],
  minSources: number,
  tolPct: number,
): { value: number; sources: SourceRef[] } | null {
  if (obs.length === 0) return null;
  let best: { cluster: KindedObs[]; pubs: SourceRef[] } | null = null;
  for (const anchor of obs) {
    const a = Number(anchor.value);
    const tol = Math.max(Math.abs(a) * (tolPct / 100), 0.001);
    const cluster = obs.filter((o) => Math.abs(Number(o.value) - a) <= tol);
    const pubs = distinctByPublisher(cluster.map((c) => c.source));
    if (!best || pubs.length > best.pubs.length) best = { cluster, pubs };
  }
  if (!best || best.pubs.length < minSources) return null;
  const vals = best.cluster.map((c) => Number(c.value)).sort((x, y) => x - y);
  const median = vals[Math.floor(vals.length / 2)];
  return { value: median, sources: best.pubs };
}

/** Đối chiếu nhãn: lấy nhãn được nhiều nguồn xác nhận nhất (mode). */
function reconcileCategorical(
  obs: KindedObs[],
  minSources: number,
): { value: string; sources: SourceRef[] } | null {
  if (obs.length === 0) return null;
  const groups = new Map<string, SourceRef[]>();
  for (const o of obs) {
    const key = String(o.value).trim();
    if (!key) continue;
    const arr = groups.get(key) ?? [];
    arr.push(o.source);
    groups.set(key, arr);
  }
  let best: { val: string; pubs: SourceRef[] } | null = null;
  for (const [val, refs] of groups) {
    const pubs = distinctByPublisher(refs);
    if (!best || pubs.length > best.pubs.length) best = { val, pubs };
  }
  if (!best || best.pubs.length < minSources) return null;
  return { value: best.val, sources: best.pubs };
}

function normTitle(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Sự kiện/cảnh báo: giữ nếu ≥minSources nguồn, hoặc có 1 nguồn có thẩm quyền. */
function reconcileList(
  items: { key: string; label: string; source: SourceRef; kind: SourceKind }[],
  minSources: number,
): { label: string; sources: SourceRef[] }[] {
  const groups = new Map<string, { label: string; refs: SourceRef[]; authoritative: boolean }>();
  for (const it of items) {
    const g = groups.get(it.key) ?? { label: it.label, refs: [], authoritative: false };
    g.refs.push(it.source);
    if (isAuthoritative(it.kind)) g.authoritative = true;
    groups.set(it.key, g);
  }
  const out: { label: string; sources: SourceRef[] }[] = [];
  for (const g of groups.values()) {
    const pubs = distinctByPublisher(g.refs);
    if (pubs.length >= minSources || g.authoritative) {
      out.push({ label: g.label, sources: pubs });
    }
  }
  return out;
}

/**
 * Thu thập & đối chiếu dữ liệu thị trường cho một xe từ nhiều nguồn.
 * Trả về CollectedMarketTrend với các trường không xác minh được để null/''/[]
 * và danh sách nguồn cho từng giá trị đã giữ lại.
 */
export async function collectMarketTrend(
  vehicle: CollectorVehicle,
  sources: MarketDataSource[],
  opts: CrossCheckOptions = {},
): Promise<CollectedMarketTrend> {
  const minSources = opts.minSources ?? 2;
  const tolPct = opts.numericTolerancePct ?? 8;

  // B1–B3: hỏi từng nguồn (chỉ nguồn tin cậy mới được tính).
  const reports = await Promise.all(
    sources.map(async (s) => {
      try {
        const r = await s.collect(vehicle);
        return r ? { src: s, report: r } : null;
      } catch {
        return null;
      }
    }),
  );

  const fieldObs = new Map<ScalarField, KindedObs[]>();
  const events: KindedEvent[] = [];
  const alerts: KindedAlert[] = [];

  for (const item of reports) {
    if (!item || !item.src.trusted) continue; // bỏ nguồn không tin cậy
    const { src, report } = item;
    for (const o of report.observations ?? []) {
      const arr = fieldObs.get(o.field) ?? [];
      arr.push({ field: o.field, value: o.value, source: o.source, kind: src.kind });
      fieldObs.set(o.field, arr);
    }
    for (const e of report.events ?? []) events.push({ ...e, kind: src.kind });
    for (const a of report.alerts ?? []) alerts.push({ ...a, kind: src.kind });
  }

  const acceptedSources: SourceRef[] = [];
  const numericOut: Record<NumericField, number | null> = {
    averageMarketPrice: null,
    priceChange30d: null,
    priceChange90d: null,
    priceChange365d: null,
    estimatedDaysToSell: null,
  };
  for (const f of NUMERIC_FIELDS) {
    const res = reconcileNumeric(fieldObs.get(f) ?? [], minSources, tolPct);
    if (res) {
      numericOut[f] = res.value;
      for (const s of res.sources) acceptedSources.push({ ...s, field: f });
    }
  }

  const catOut: Record<CategoricalField, string> = {
    supplyLevel: '',
    demandLevel: '',
    popularity: '',
    resaleConfidence: '',
  };
  for (const f of CATEGORICAL_FIELDS) {
    const res = reconcileCategorical(fieldObs.get(f) ?? [], minSources);
    if (res) {
      catOut[f] = res.value;
      for (const s of res.sources) acceptedSources.push({ ...s, field: f });
    }
  }

  const acceptedAlerts = reconcileList(
    alerts.map((a) => ({ key: normTitle(a.alert), label: a.alert, source: a.source, kind: a.kind })),
    minSources,
  );
  for (const a of acceptedAlerts) for (const s of a.sources) acceptedSources.push({ ...s, field: 'marketAlerts' });

  const acceptedEvents = reconcileList(
    events.map((e) => ({
      key: e.event.date + '|' + normTitle(e.event.title),
      label: e.event.title,
      source: e.source,
      kind: e.kind,
    })),
    minSources,
  );
  const eventByLabel = new Map(events.map((e) => [normTitle(e.event.title), e.event.date]));
  const recentEvents: MarketEvent[] = acceptedEvents.map((e) => ({
    date: eventByLabel.get(normTitle(e.label)) ?? '',
    title: e.label,
  }));
  for (const e of acceptedEvents) for (const s of e.sources) acceptedSources.push({ ...s, field: 'recentEvents' });

  return {
    lastUpdated: new Date().toISOString().slice(0, 10),
    ...numericOut,
    supplyLevel: catOut.supplyLevel as SupplyLevel | '',
    demandLevel: catOut.demandLevel as DemandLevel | '',
    popularity: catOut.popularity,
    resaleConfidence: catOut.resaleConfidence,
    marketAlerts: acceptedAlerts.map((a) => a.label),
    recentEvents,
    sources: acceptedSources,
  };
}

/** true nếu thu thập được ít nhất một dữ liệu có thật. */
export function hasMarketData(ct: CollectedMarketTrend): boolean {
  return (
    ct.averageMarketPrice != null ||
    ct.priceChange30d != null ||
    ct.priceChange90d != null ||
    ct.priceChange365d != null ||
    ct.estimatedDaysToSell != null ||
    ct.supplyLevel !== '' ||
    ct.demandLevel !== '' ||
    ct.popularity !== '' ||
    ct.marketAlerts.length > 0 ||
    ct.recentEvents.length > 0
  );
}

/** Chuyển dữ liệu đã thu thập sang shape mà UI (getMarketTrends) tiêu thụ. */
export function toMarketTrendsData(ct: CollectedMarketTrend): MarketTrendsData {
  const events: MarketTimelineEvent[] = ct.recentEvents.map((e) => ({ period: e.date, label: e.title }));
  const publishers = Array.from(new Set(ct.sources.map((s) => s.publisher)));
  const supply = ct.supplyLevel === '' ? undefined : ct.supplyLevel;
  const demand = ct.demandLevel === '' ? undefined : ct.demandLevel;
  const out: MarketTrendsData = {
    alerts: ct.marketAlerts,
    events,
  };
  if (ct.averageMarketPrice != null) out.avgPrice = ct.averageMarketPrice;
  if (ct.priceChange30d != null) out.change30d = ct.priceChange30d;
  if (ct.priceChange90d != null) out.change90d = ct.priceChange90d;
  if (ct.priceChange365d != null) out.change1y = ct.priceChange365d;
  if (supply) out.supply = supply;
  if (demand) out.demand = demand;
  if (ct.estimatedDaysToSell != null) out.daysOnMarket = ct.estimatedDaysToSell;
  if (publishers.length) out.source = publishers.join(', ');
  return out;
}

// ----- Nạp dữ liệu đã kiểm chứng thủ công (an toàn, không bịa) -----

export interface VerifiedReport {
  publisher: string;
  kind: SourceKind;
  url: string;
  /** Ngày xuất bản (ISO yyyy-mm-dd). */
  date: string;
  /** Mặc định true (dữ liệu đã được con người kiểm chứng). */
  trusted?: boolean;
  fields?: Partial<Record<ScalarField, number | string>>;
  events?: MarketEvent[];
  alerts?: string[];
}

export interface VerifiedMarketFile {
  vehicleId: string;
  reports: VerifiedReport[];
}

/** Biến một file dữ liệu đã kiểm chứng thành danh sách nguồn cho pipeline. */
export function verifiedReportsToSources(file: VerifiedMarketFile): MarketDataSource[] {
  return file.reports.map((rep, i) => {
    const ref = (field: string): SourceRef => ({
      field,
      url: rep.url,
      publisher: rep.publisher,
      date: rep.date,
    });
    const report: SourceReport = {
      observations: Object.entries(rep.fields ?? {}).map(([field, value]) => ({
        field: field as ScalarField,
        value: value as number | string,
        source: ref(field),
      })),
      events: (rep.events ?? []).map((event) => ({ event, source: ref('recentEvents') })),
      alerts: (rep.alerts ?? []).map((alert) => ({ alert, source: ref('marketAlerts') })),
    };
    return {
      name: rep.publisher + '#' + i,
      kind: rep.kind,
      trusted: rep.trusted !== false,
      collect: async (_vehicle: CollectorVehicle): Promise<SourceReport | null> => report,
    };
  });
}

/**
 * Thu thập cho toàn bộ xe.
 * `sourcesFor` trả về danh sách nguồn cho từng xe (vd nạp từ file đã kiểm chứng,
 * hoặc adapter nguồn thật). Chỉ trả về các xe có dữ liệu thật.
 */
export async function collectAll(
  vehicles: CollectorVehicle[],
  sourcesFor: (v: CollectorVehicle) => MarketDataSource[] | Promise<MarketDataSource[]>,
  opts: CrossCheckOptions = {},
): Promise<Record<string, CollectedMarketTrend>> {
  const out: Record<string, CollectedMarketTrend> = {};
  for (const v of vehicles) {
    const sources = await sourcesFor(v);
    if (!sources.length) continue;
    const ct = await collectMarketTrend(v, sources, opts);
    if (hasMarketData(ct)) out[v.id] = ct;
  }
  return out;
}
