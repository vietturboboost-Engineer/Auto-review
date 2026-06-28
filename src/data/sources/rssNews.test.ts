import { describe, it, expect } from 'vitest';
import {
  parseRssItems,
  mentionsVehicle,
  extractMarketSignals,
  createRssNewsSource,
} from './rssNews.js';
import { collectMarketTrend, type CollectorVehicle } from '../marketCollector.js';

const VH: CollectorVehicle = {
  id: 'toyota-corolla-cross',
  brand: 'Toyota',
  model: 'Corolla Cross',
  segment: 'SUV hạng C',
};

const SAMPLE_RSS = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <item>
    <title><![CDATA[Toyota Corolla Cross giảm giá 40 triệu tại đại lý]]></title>
    <link>https://oto.example/corolla-cross-giam-gia</link>
    <pubDate>Mon, 01 Jun 2026 08:00:00 +0700</pubDate>
  </item>
  <item>
    <title>Honda CR-V ra mắt phiên bản mới</title>
    <link>https://oto.example/crv-ra-mat</link>
    <pubDate>Tue, 02 Jun 2026 09:00:00 +0700</pubDate>
  </item>
  <item>
    <title>Toyota Corolla Cross 2026 facelift trình làng</title>
    <link>https://oto.example/corolla-cross-facelift</link>
    <pubDate>Wed, 03 Jun 2026 10:00:00 +0700</pubDate>
  </item>
</channel></rss>`;

describe('parseRssItems', () => {
  it('parses items, decodes CDATA, and converts dates to ISO', () => {
    const items = parseRssItems(SAMPLE_RSS);
    expect(items).toHaveLength(3);
    expect(items[0].title).toBe('Toyota Corolla Cross giảm giá 40 triệu tại đại lý');
    expect(items[0].link).toBe('https://oto.example/corolla-cross-giam-gia');
    expect(items[0].date).toBe('2026-06-01');
  });
});

describe('mentionsVehicle', () => {
  it('matches only articles naming the model', () => {
    expect(mentionsVehicle('Toyota Corolla Cross giảm giá', VH)).toBe(true);
    expect(mentionsVehicle('Honda CR-V ra mắt', VH)).toBe(false);
  });
});

describe('extractMarketSignals', () => {
  it('keeps matching articles and classifies alerts; ignores other models', () => {
    const items = parseRssItems(SAMPLE_RSS);
    const sigs = extractMarketSignals(items, VH);
    expect(sigs).toHaveLength(2);
    expect(sigs[0].alert).toBe('🔻 Giảm giá / ưu đãi');
    expect(sigs[1].alert).toBe('🔧 Nâng cấp / facelift');
  });
});

describe('createRssNewsSource', () => {
  it('returns null on fetch failure (no fabrication)', async () => {
    const src = createRssNewsSource({
      publisher: 'Test',
      url: 'https://x/rss',
      fetchImpl: async () => null,
    });
    expect(await src.collect(VH)).toBeNull();
  });

  it('produces events + alerts tagged with publisher/url/date', async () => {
    const src = createRssNewsSource({
      publisher: 'OtoExample',
      url: 'https://oto.example/rss',
      fetchImpl: async () => SAMPLE_RSS,
    });
    const report = await src.collect(VH);
    expect(report).not.toBeNull();
    expect(report?.events).toHaveLength(2);
    expect(report?.events?.[0].source.publisher).toBe('OtoExample');
    expect(report?.events?.[0].source.url).toContain('corolla-cross');
    expect(report?.alerts).toHaveLength(2);
  });

  it('single news source is NOT enough to keep an event (>=2 sources rule)', async () => {
    const src = createRssNewsSource({
      publisher: 'OtoExample',
      url: 'https://oto.example/rss',
      fetchImpl: async () => SAMPLE_RSS,
    });
    const ct = await collectMarketTrend(VH, [src]);
    expect(ct.recentEvents).toHaveLength(0);
    expect(ct.marketAlerts).toHaveLength(0);
  });

  it('two independent news sources reporting the same event keep it', async () => {
    const a = createRssNewsSource({ publisher: 'OtoA', url: 'https://a/rss', fetchImpl: async () => SAMPLE_RSS });
    const b = createRssNewsSource({ publisher: 'OtoB', url: 'https://b/rss', fetchImpl: async () => SAMPLE_RSS });
    const ct = await collectMarketTrend(VH, [a, b]);
    expect(ct.recentEvents.length).toBeGreaterThan(0);
    expect(ct.marketAlerts.length).toBeGreaterThan(0);
  });
});
