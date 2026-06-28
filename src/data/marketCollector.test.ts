import { describe, it, expect } from 'vitest';
import {
  collectMarketTrend,
  toMarketTrendsData,
  verifiedReportsToSources,
  hasMarketData,
  applyCollectedMarketTrends,
  collectedToMarketData,
  type MarketDataSource,
  type SourceKind,
  type SourceReport,
  type CollectorVehicle,
} from './marketCollector.js';

const VH: CollectorVehicle = {
  id: 'toyota-corolla-cross',
  brand: 'Toyota',
  model: 'Corolla Cross',
  segment: 'SUV hạng C',
};

function ref(field: string, publisher: string) {
  return { field, url: 'https://' + publisher + '/x', publisher, date: '2026-05-01' };
}

function makeSource(
  name: string,
  kind: SourceKind,
  trusted: boolean,
  report: SourceReport,
): MarketDataSource {
  return { name, kind, trusted, collect: async () => report };
}

describe('collectMarketTrend cross-check', () => {
  it('keeps a numeric value confirmed by 2 trusted sources', async () => {
    const sources = [
      makeSource('oto', 'news', true, {
        observations: [{ field: 'averageMarketPrice', value: 820, source: ref('averageMarketPrice', 'oto') }],
      }),
      makeSource('cho', 'marketplace', true, {
        observations: [{ field: 'averageMarketPrice', value: 825, source: ref('averageMarketPrice', 'cho') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.averageMarketPrice).not.toBeNull();
    expect(ct.sources.some((s) => s.field === 'averageMarketPrice')).toBe(true);
  });

  it('returns null for a value reported by only one source', async () => {
    const sources = [
      makeSource('oto', 'news', true, {
        observations: [{ field: 'priceChange30d', value: 2.8, source: ref('priceChange30d', 'oto') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.priceChange30d).toBeNull();
  });

  it('excludes an outlier outside the numeric tolerance', async () => {
    const sources = [
      makeSource('a', 'news', true, {
        observations: [{ field: 'averageMarketPrice', value: 800, source: ref('averageMarketPrice', 'a') }],
      }),
      makeSource('b', 'marketplace', true, {
        observations: [{ field: 'averageMarketPrice', value: 805, source: ref('averageMarketPrice', 'b') }],
      }),
      makeSource('c', 'news', true, {
        observations: [{ field: 'averageMarketPrice', value: 1500, source: ref('averageMarketPrice', 'c') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources, { numericTolerancePct: 5 });
    expect(ct.averageMarketPrice).toBeLessThan(900);
  });

  it('ignores untrusted sources entirely', async () => {
    const sources = [
      makeSource('blog1', 'news', false, {
        observations: [{ field: 'demandLevel', value: 'Rất cao', source: ref('demandLevel', 'blog1') }],
      }),
      makeSource('blog2', 'news', false, {
        observations: [{ field: 'demandLevel', value: 'Rất cao', source: ref('demandLevel', 'blog2') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.demandLevel).toBe('');
  });

  it('takes the categorical mode confirmed by >=2 sources', async () => {
    const sources = [
      makeSource('a', 'news', true, {
        observations: [{ field: 'supplyLevel', value: 'Cao', source: ref('supplyLevel', 'a') }],
      }),
      makeSource('b', 'marketplace', true, {
        observations: [{ field: 'supplyLevel', value: 'Cao', source: ref('supplyLevel', 'b') }],
      }),
      makeSource('c', 'news', true, {
        observations: [{ field: 'supplyLevel', value: 'Trung bình', source: ref('supplyLevel', 'c') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.supplyLevel).toBe('Cao');
  });

  it('accepts an official event from a single authoritative source', async () => {
    const sources = [
      makeSource('toyota', 'manufacturer', true, {
        events: [{ event: { date: '2026-03', title: 'Giảm giá 30 triệu' }, source: ref('recentEvents', 'toyota') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.recentEvents).toHaveLength(1);
    expect(ct.recentEvents[0].date).toBe('2026-03');
  });

  it('rejects an event reported by a single non-authoritative source', async () => {
    const sources = [
      makeSource('news1', 'news', true, {
        events: [{ event: { date: '2026-03', title: 'Tin đồn facelift' }, source: ref('recentEvents', 'news1') }],
      }),
    ];
    const ct = await collectMarketTrend(VH, sources);
    expect(ct.recentEvents).toHaveLength(0);
  });
});

describe('verifiedReportsToSources + mapper', () => {
  it('produces non-null data when a verified file lists >=2 publishers', async () => {
    const sources = verifiedReportsToSources({
      vehicleId: VH.id,
      reports: [
        {
          publisher: 'VnExpress',
          kind: 'news',
          url: 'https://vnexpress.net/x',
          date: '2026-05-01',
          fields: { averageMarketPrice: 820, supplyLevel: 'Cao' },
        },
        {
          publisher: 'Chợ Tốt',
          kind: 'marketplace',
          url: 'https://chotot.com/x',
          date: '2026-05-02',
          fields: { averageMarketPrice: 818, supplyLevel: 'Cao' },
        },
      ],
    });
    const ct = await collectMarketTrend(VH, sources);
    expect(hasMarketData(ct)).toBe(true);
    expect(ct.supplyLevel).toBe('Cao');
    const md = toMarketTrendsData(ct);
    expect(md.avgPrice).not.toBeUndefined();
    expect(md.supply).toBe('Cao');
    expect(md.source).toContain('VnExpress');
  });

  it('maps empty categorical to undefined (Chưa có đủ dữ liệu)', async () => {
    const sources = verifiedReportsToSources({
      vehicleId: VH.id,
      reports: [
        { publisher: 'A', kind: 'news', url: 'https://a/x', date: '2026-05-01', fields: { demandLevel: 'Cao' } },
      ],
    });
    const ct = await collectMarketTrend(VH, sources);
    const md = toMarketTrendsData(ct);
    expect(md.demand).toBeUndefined();
  });
});

describe('applyCollectedMarketTrends', () => {
  it('only attaches data to matching ids and leaves others untouched', async () => {
    const sources = verifiedReportsToSources({
      vehicleId: VH.id,
      reports: [
        { publisher: 'A', kind: 'news', url: 'https://a/x', date: '2026-05-01', fields: { averageMarketPrice: 800 } },
        { publisher: 'B', kind: 'marketplace', url: 'https://b/x', date: '2026-05-02', fields: { averageMarketPrice: 800 } },
      ],
    });
    const ct = await collectMarketTrend(VH, sources);
    const data = collectedToMarketData({ [VH.id]: ct });

    const list = [
      { id: VH.id, marketTrends: undefined as ReturnType<typeof toMarketTrendsData> | undefined },
      { id: 'other-car', marketTrends: undefined as ReturnType<typeof toMarketTrendsData> | undefined },
    ];
    const n = applyCollectedMarketTrends(list, data);
    expect(n).toBe(1);
    expect(list[0].marketTrends).not.toBeUndefined();
    expect(list[0].marketTrends?.avgPrice).toBe(800);
    expect(list[1].marketTrends).toBeUndefined();
  });
});
