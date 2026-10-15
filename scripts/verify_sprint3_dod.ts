import * as fs from 'fs';
import * as path from 'path';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import sitemap, { TIER1_BRAND_SLUGS } from '../app/sitemap';
import { GET as yandexXmlGET } from '../app/api/feeds/yandex.xml/route';
import { GET as analyticsStatsGET } from '../app/api/analytics/stats/route';
import { GET as offlineConversionsGET } from '../app/api/analytics/offline-conversions/route';
import { getAuthCookieName, getAuthToken } from '../lib/adminAuth';
import {
  trackEcommerceDetail,
  trackEcommerceAddToCart,
  trackEcommerceRemoveFromCart,
  trackEcommercePurchase,
  trackGoal,
} from '../lib/analytics/tracker';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ ${message}`);
}

async function main() {
  console.log('======================================================');
  console.log('🚀 SPRINT 3 — DEFINITION OF DONE VERIFICATION SUITE');
  console.log('======================================================');

  let passedTests = 0;
  let totalTests = 0;

  function record(title: string, fn: () => void | Promise<void>) {
    totalTests++;
    console.log(`\n--- [Test #${totalTests}] ${title} ---`);
    return Promise.resolve(fn())
      .then(() => {
        passedTests++;
      })
      .catch((err) => {
        console.error(`Test failed: ${err.message}`);
        throw err;
      });
  }

  // =========================================================================
  // DoD #1: SEO Protection & Smart 301 Redirects
  // =========================================================================

  await record('301 Redirect: Exact UMI Product URL', () => {
    const req = new NextRequest(
      'http://localhost:3000/shop/vstraivaemaya_tehnika/mikrovolnovye_pechi_vstroika/vard/vmc_355hk_duhovoj_shkaf/'
    );
    const res = middleware(req);
    assert(res !== undefined, 'Middleware must intercept /shop/ product');
    assert(res.status === 301, 'Status must be 301 Permanent Redirect');
    assert(
      res.headers.get('location') === 'http://localhost:3000/product/vard-vmc-355hk',
      `Target must be /product/vard-vmc-355hk (got ${res.headers.get('location')})`
    );
  });

  await record('301 Redirect: Old UMI Category (/shop/.../varochnye_paneli)', () => {
    const req = new NextRequest(
      'http://localhost:3000/shop/vstraivaemaya_tehnika/varochnye_paneli'
    );
    const res = middleware(req);
    assert(res !== undefined, 'Middleware must intercept category');
    assert(res.status === 301, 'Status must be 301');
    assert(
      res.headers.get('location') === 'http://localhost:3000/catalog/varochnye-paneli',
      `Target must be /catalog/varochnye-paneli (got ${res.headers.get('location')})`
    );
  });

  await record('301 Redirect: Old Category with Brand (/shop/.../varochnye_paneli/korting)', () => {
    const req = new NextRequest(
      'http://localhost:3000/shop/vstraivaemaya_tehnika/varochnye_paneli/korting'
    );
    const res = middleware(req);
    assert(res !== undefined, 'Middleware must intercept category with brand');
    assert(res.status === 301, 'Status must be 301');
    assert(
      res.headers.get('location')?.includes('/catalog/varochnye-paneli?brand=K%C3%96RTING') === true,
      `Target must contain category and brand query (got ${res.headers.get('location')})`
    );
  });

  await record('301 Redirect: All 13 Tier-1 Brands to /brands/:slug', () => {
    for (const brandSlug of TIER1_BRAND_SLUGS) {
      const req = new NextRequest(`http://localhost:3000/brendy/${brandSlug}`);
      const res = middleware(req);
      assert(res !== undefined, `Middleware must intercept /brendy/${brandSlug}`);
      assert(res.status === 301, `Status for ${brandSlug} must be 301`);
      assert(
        res.headers.get('location') === `http://localhost:3000/brands/${brandSlug}`,
        `Target for ${brandSlug} must be /brands/${brandSlug} (got ${res.headers.get('location')})`
      );
    }
  });

  await record('301 Redirect: Tier-2 Brands to /catalog?brand=:BRAND', () => {
    const tier2Tests = [
      { slug: 'siemens', expectedBrand: 'SIEMENS' },
      { slug: 'neff', expectedBrand: 'NEFF' },
      { slug: 'gaggenau', expectedBrand: 'Gaggenau' },
      { slug: 'riedel', expectedBrand: 'RIEDEL' },
    ];
    for (const item of tier2Tests) {
      const req = new NextRequest(`http://localhost:3000/brendy/${item.slug}`);
      const res = middleware(req);
      assert(res !== undefined, `Middleware must intercept /brendy/${item.slug}`);
      assert(res.status === 301, `Status must be 301`);
      assert(
        res.headers.get('location')?.includes(`/catalog?brand=${encodeURIComponent(item.expectedBrand)}`) === true,
        `Target must redirect to catalog brand filter (got ${res.headers.get('location')})`
      );
    }
  });

  await record('301 Redirect: Base /brendy to /brands', () => {
    const req = new NextRequest('http://localhost:3000/brendy');
    const res = middleware(req);
    assert(res !== undefined && res.status === 301, 'Base /brendy must redirect 301');
    assert(res.headers.get('location') === 'http://localhost:3000/brands', 'Must redirect to /brands');
  });

  await record('301 Redirect: Legacy Utility Routes (policy, delivery, warranty, price-match, opt, promos)', () => {
    const utilityMap: Record<string, string> = {
      '/politika': '/policy',
      '/delivery_payment': '/delivery-payment',
      '/service_warranty': '/warranty',
      '/return_exchange_warranty': '/returns',
      '/nashli_deshevle_snizim_cenu': '/price-match',
      '/actions_sales/spring-promo': '/promos',
      '/optovyj_otdel': '/opt',
    };

    for (const [source, expected] of Object.entries(utilityMap)) {
      const req = new NextRequest(`http://localhost:3000${source}`);
      const res = middleware(req);
      assert(res !== undefined && res.status === 301, `Route ${source} must return 301`);
      assert(
        res.headers.get('location') === `http://localhost:3000${expected}`,
        `Route ${source} must redirect to ${expected} (got ${res.headers.get('location')})`
      );
    }
  });

  await record('SEO: Static public/robots.txt is Removed & app/robots.ts is Configured', () => {
    const publicRobotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    assert(!fs.existsSync(publicRobotsPath), 'public/robots.txt must NOT exist (so app/robots.ts is used)');

    const appRobotsPath = path.join(process.cwd(), 'app', 'robots.ts');
    assert(fs.existsSync(appRobotsPath), 'app/robots.ts must exist');

    const appRobotsContent = fs.readFileSync(appRobotsPath, 'utf8');
    assert(appRobotsContent.includes('new.simona-bt.ru'), 'app/robots.ts must handle staging host');
    assert(appRobotsContent.includes('disallow: \'/\''), 'app/robots.ts must disallow staging');
    assert(appRobotsContent.includes('sitemap: \'https://simona-bt.ru/sitemap.xml\''), 'app/robots.ts must specify sitemap');
    assert(appRobotsContent.includes('host: \'https://simona-bt.ru\''), 'app/robots.ts must specify host');
  });

  await record('SEO: Dynamic sitemap.xml Structure & Coverage', async () => {
    const sitemapData = await sitemap();
    assert(sitemapData.length > 5000, `Sitemap must contain > 5000 URLs (found: ${sitemapData.length})`);

    const hasCatalog = sitemapData.some((e) => e.url === 'https://simona-bt.ru/catalog');
    const hasCategory = sitemapData.some((e) => e.url === 'https://simona-bt.ru/catalog/varochnye-paneli');
    const hasMieleBrand = sitemapData.some((e) => e.url === 'https://simona-bt.ru/brands/miele');
    const hasShowrooms = sitemapData.some((e) => e.url === 'https://simona-bt.ru/showrooms');
    const hasProducts = sitemapData.some((e) => e.url.startsWith('https://simona-bt.ru/product/'));

    assert(hasCatalog, 'Sitemap must contain /catalog');
    assert(hasCategory, 'Sitemap must contain categories like /catalog/varochnye-paneli');
    assert(hasMieleBrand, 'Sitemap must contain Tier-1 brands like /brands/miele');
    assert(hasShowrooms, 'Sitemap must contain /showrooms');
    assert(hasProducts, 'Sitemap must contain product pages');
  });

  // =========================================================================
  // DoD #2: Analytics, E-commerce dataLayer & Offline Conversions
  // =========================================================================

  await record('Enhanced E-commerce: dataLayer Events Validation', () => {
    const fakeDataLayer: any[] = [];
    (global as any).window = { dataLayer: fakeDataLayer };

    const sampleProduct: any = {
      id: '89083',
      sku: '89083',
      name: 'Духовой шкаф KÖRTING OKB 1680 GN MW',
      price: 99990,
      brand: 'KÖRTING',
      category: 'Духовые шкафы',
    };

    // 1. Detail
    trackEcommerceDetail(sampleProduct);
    assert(fakeDataLayer.length === 1, 'dataLayer must have 1 event after detail');
    assert(fakeDataLayer[0]?.ecommerce?.detail?.products?.[0]?.id === '89083', 'Detail payload matches SKU');

    // 2. Add
    trackEcommerceAddToCart(sampleProduct, 1);
    assert(fakeDataLayer.length === 2, 'dataLayer must have 2 events after add');
    assert(fakeDataLayer[1]?.ecommerce?.add?.products?.[0]?.price === 99990, 'Add payload matches price');

    // 3. Remove
    trackEcommerceRemoveFromCart(sampleProduct, 1);
    assert(fakeDataLayer.length === 3, 'dataLayer must have 3 events after remove');
    assert(fakeDataLayer[2]?.ecommerce?.remove?.products?.[0]?.brand === 'KÖRTING', 'Remove payload matches brand');

    // 4. Purchase
    trackEcommercePurchase({
      id: '15104',
      revenue: 99990,
      products: [
        {
          id: sampleProduct.sku,
          name: sampleProduct.name,
          price: sampleProduct.price,
          brand: sampleProduct.brand,
          category: sampleProduct.category,
          quantity: 1,
        },
      ],
    });
    assert(fakeDataLayer.length === 4, 'dataLayer must have 4 events after purchase');
    assert(
      fakeDataLayer[3]?.ecommerce?.purchase?.actionField?.id === '15104',
      'Purchase payload matches order id'
    );
  });

  await record('Metrika reachGoal: Tracking for 9 Lead Types', () => {
    const goalsTriggered: { name: string; params: any }[] = [];
    (global as any).window = {
      dataLayer: [],
      ym: (_id: number, action: string, goalName: string, params: any) => {
        if (action === 'reachGoal') {
          goalsTriggered.push({ name: goalName, params });
        }
      },
    };

    const targetGoals = [
      'SHOWROOM_VISIT',
      'ACTIVE_KITCHEN_TESTDRIVE',
      'PROJECT_MATCHING',
      'B2B_CLUB',
      'B2B_OPT',
      'KITCHEN_ESTIMATE',
      'QUICK_CONSULT',
      'EQUIPMENT_SELECTION',
      'PRICE_MATCH',
    ];

    for (const g of targetGoals) {
      trackGoal(g, { test: true });
    }

    assert(
      goalsTriggered.length === 9,
      `All 9 goal types must be dispatched (dispatched: ${goalsTriggered.length})`
    );
  });

  await record('Operational Dashboard API: GET /api/analytics/stats', async () => {
    // 1. Unauthorized request
    const unauthReq = new NextRequest('http://localhost:3000/api/analytics/stats');
    const unauthRes = await analyticsStatsGET(unauthReq);
    assert(unauthRes.status === 401, 'Unauthorized request must return 401');

    // 2. Authorized request
    const authCookie = `${getAuthCookieName()}=${getAuthToken()}`;
    const authReq = new NextRequest('http://localhost:3000/api/analytics/stats?days=30', {
      headers: { cookie: authCookie },
    });
    const authRes = await analyticsStatsGET(authReq);
    assert(authRes.status === 200, 'Authorized request must return 200');

    const statsData = await authRes.json();
    assert(statsData.summary !== undefined, 'Stats must include summary');
    assert(typeof statsData.summary.totalRevenue === 'number', 'Summary must include totalRevenue');
    assert(Array.isArray(statsData.utmStats), 'Stats must include utmStats array');
    assert(Array.isArray(statsData.recentOrders), 'Stats must include recentOrders');
  });

  await record('Offline Conversions API: GET /api/analytics/offline-conversions', async () => {
    const req = new NextRequest('http://localhost:3000/api/analytics/offline-conversions');
    const res = await offlineConversionsGET(req);
    assert(res.status === 200, 'Offline conversions GET must return 200');
    assert(
      res.headers.get('content-type')?.includes('text/csv') === true,
      'Response must be CSV'
    );
    const csvContent = await res.text();
    assert(
      csvContent.startsWith('ClientId,Target,DateTime,Price,Currency'),
      'CSV must have Yandex Metrika required header'
    );
  });

  // =========================================================================
  // DoD #3: YML Feed XML Conformance & Media Delivery
  // =========================================================================

  await record('YML Feed: GET /api/feeds/yandex.xml Schema Validation', async () => {
    const res = await yandexXmlGET();
    assert(res.status === 200, 'YML feed must return HTTP 200');
    assert(
      res.headers.get('content-type')?.includes('xml') === true,
      'Content-Type must be XML'
    );

    const xml = await res.text();
    assert(xml.includes('<!DOCTYPE yml_catalog SYSTEM "shops.dtd">'), 'Must contain DTD declaration');
    assert(xml.includes('<yml_catalog'), 'Must contain yml_catalog tag');
    assert(xml.includes('<shop>'), 'Must contain shop tag');
    assert(xml.includes('<name>СИМОНА</name>'), 'Must specify shop name СИМОНА');
    assert(xml.includes('<currencies>'), 'Must declare currencies');
    assert(xml.includes('<categories>'), 'Must list categories');
    assert(xml.includes('<offers>'), 'Must list offers');
    assert(xml.includes('<offer id='), 'Must contain offer elements');
    assert(xml.includes('<vendor>'), 'Must include vendor tag');
    assert(xml.includes('<price>'), 'Must include price tag');
    assert(xml.includes('<url>https://simona-bt.ru/product/'), 'Must include canonical product URL');
  });

  // =========================================================================
  // DoD #4: Production Cutover & Deployment Scripts
  // =========================================================================

  await record('Deployment Scripts: Verification of cutover and rollback scripts', () => {
    const scripts = [
      'scripts/prepare_prod_db.sh',
      'scripts/switch_to_prod.sh',
      'scripts/rollback_prod.sh',
    ];

    for (const s of scripts) {
      const fullPath = path.join(process.cwd(), s);
      assert(fs.existsSync(fullPath), `Script ${s} must exist`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert(content.length > 200, `Script ${s} must not be empty`);
      assert(content.startsWith('#!/usr/bin/env bash'), `Script ${s} must have bash shebang`);
    }
  });

  console.log('\n======================================================');
  console.log(`🎉 ALL SPRINT 3 DoD CHECKS PASSED: ${passedTests}/${totalTests} (100%)`);
  console.log('======================================================');
}

main().catch((err) => {
  console.error('\n❌ DoD VERIFICATION FAILED:', err);
  process.exit(1);
});
