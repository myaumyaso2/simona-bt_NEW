import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsMap from '@/data/redirects.json';
import {
  resolveBrandEntry,
  brandNameToSlug,
  extractBrandFromUmiSegments,
  inferCategorySlugFromUmiSlug,
} from '@/lib/catalog/brandsRegistry';

const redirects: Record<string, string> = redirectsMap;

// Canonical slugs of brands that currently have active inventory in SIMONA catalog
const ACTIVE_BRAND_SLUGS = new Set<string>([
  'omoikiri', 'smeg', 'korting', 'elica', 'falmec', 'asko', 'longran', 'elikor',
  'bertazzoni', 'evelux', 'siemens-lv', 'graude', 'riedel', 'meyvel', 'liebherr',
  'bosch', 'dunavox', 'franke', 'vard', 'midea', 'kuppersberg', 'caso', 'miele',
  'gorenje', 'jetair', 'schulthess', 'steba', 'hiberg', 'nivona', 'laurastar',
  'jackys', 'eko', 'status', 'rommelsbacher', 'bone-crusher', 'siemens', 'mikadzo',
  'hobot', 'faber', 'haier', 'electrolux', 'alveus', 'beko', 'bugatti', 'neff',
  'lg', 'indesit', 'peugeot', 'nachtmann', 'gira', 'black-decker', 'boneco',
  'aeg', 'gaggenau', 'vitek', 'philips', 'kuppersbusch', 'esperanza', 'daichi',
  'maunfeld', 'samsung',
]);

// Mapping of old UMI.CMS category paths to canonical /catalog/[slug] routes (categories & macro-sections)
const UMI_CATEGORY_MAP: Record<string, string> = {
  'vstraivaemaya_tehnika/varochnye_paneli': 'varochnye-paneli',
  'vstraivaemaya_tehnika/duhovye_shkafy': 'vstraivaemye-duhovye-shkafy',
  'vstraivaemaya_tehnika/vytyazhki': 'vytyazhki',
  'vstraivaemaya_tehnika/posudomoechnye_mashiny_vstroika': 'vstraivaemye-posudomoechnye-mashiny',
  'vstraivaemaya_tehnika/holodilniki_vstroika': 'vstraivaemye-holodilniki',
  'vstraivaemaya_tehnika/vinnye_shkafy': 'vstraivaemye-vinnye-shkafy',
  'vstraivaemaya_tehnika/vinnye_shkafy_vstroika': 'vstraivaemye-vinnye-shkafy',
  'vstraivaemaya_tehnika/mikrovolnovye_pechi_vstroika': 'vstraivaemye-mikrovolnovye-pechi',
  'vstraivaemaya_tehnika/stiralnye_mashiny_vstroika': 'vstraivaemye-stiralnye-mashiny',
  'vstraivaemaya_tehnika/kofemashiny_vstroika': 'vstraivaemye-kofemashiny',
  'vstraivaemaya_tehnika/podogrevateli_posudy': 'podogrevateli-posudy',
  'vstraivaemaya_tehnika/izmelchiteli_piwevyh_othodov': 'izmelchiteli-pishchevyh-othodov',
  'vstraivaemaya_tehnika/izmelchiteli_pishevyh_othodov': 'izmelchiteli-pishchevyh-othodov',
  'vstraivaemaya_tehnika/vakuumatory': 'vstraivaemye-vakuumatory',
  'vstraivaemaya_tehnika/sortery_vedra': 'aksessuary-dlya-moek',
  'vstraivaemaya_tehnika': 'vstraivaemaya-tehnika',

  'krupnaya_bytovaya_tehnika/holodilniki': 'holodilniki',
  'krupnaya_bytovaya_tehnika/stiralnye_mashiny': 'stiralnye-mashiny',
  'krupnaya_bytovaya_tehnika/sushilnye_mashiny': 'sushilnye-mashiny',
  'krupnaya_bytovaya_tehnika/posudomoechnye_mashiny': 'posudomoechnye-mashiny',
  'krupnaya_bytovaya_tehnika/plity': 'kuhonnye-plity',
  'krupnaya_bytovaya_tehnika/vinnye_shkafy': 'vinnye-shkafy',
  'krupnaya_bytovaya_tehnika/gladilnye_sistemy': 'gladilnye-sistemy',
  'krupnaya_bytovaya_tehnika/mikrovolnovye_pechi': 'mikrovolnovye-pechi',
  'krupnaya_bytovaya_tehnika': 'krupnaya-bytovaya-tehnika',

  'mojki_i_smesiteli/mojki_dlya_kuhni': 'mojki-dlya-kuhni',
  'mojki_i_smesiteli/smesiteli': 'smesiteli-dlya-kuhni',
  'mojki_i_smesiteli/dozatory_dlya_zhidkih_moyushchih_sredstv': 'dozatory-dlya-moyushchih-sredstv',
  'mojki_i_smesiteli': 'mojki-i-smesiteli',

  'klimaticheskaya_tehnika/kondicionery': 'kondicionery',
  'klimaticheskaya_tehnika/vodonagrevateli': 'vodonagrevateli',
  'klimaticheskaya_tehnika': 'klimaticheskaya-tehnika',

  'bokaly_i_posuda_kuhonnye_prinadlezhnosti/bokaly': 'bokaly-riedel',
  'bokaly_i_posuda_kuhonnye_prinadlezhnosti/dekantery_riedel': 'dekantery-riedel',
  'bokaly_i_posuda_kuhonnye_prinadlezhnosti/posuda': 'posuda',
  'bokaly_i_posuda_kuhonnye_prinadlezhnosti/kuhonnye_prinadlezhnosti': 'kuhonnye-prinadlezhnosti',
  'bokaly_i_posuda_kuhonnye_prinadlezhnosti': 'bokaly-i-posuda',

  'melkaya_bytovaya_tehnika/dlya_kuhni/blendery': 'blendery',
  'melkaya_bytovaya_tehnika/dlya_kuhni/chainiki': 'chajniki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/chajniki': 'chajniki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/kofevarki': 'kofevarki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/kofemashiny': 'kofemashiny',
  'melkaya_bytovaya_tehnika/dlya_kuhni/kofe': 'kofe',
  'melkaya_bytovaya_tehnika/dlya_kuhni/kuhonnye_kombainy': 'kuhonnye-kombajny',
  'melkaya_bytovaya_tehnika/dlya_kuhni/miksery': 'miksery',
  'melkaya_bytovaya_tehnika/dlya_kuhni/multivarki': 'multivarki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/myasorubki': 'myasorubki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/sokovyzhimalki': 'sokovyzhimalki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/tostery': 'tostery',
  'melkaya_bytovaya_tehnika/dlya_kuhni/minipechi': 'mini-pechi',
  'melkaya_bytovaya_tehnika/dlya_kuhni/vakuumator': 'vakuumatory',
  'melkaya_bytovaya_tehnika/dlya_kuhni/vspenivateli_moloka': 'vspenivateli-moloka',
  'melkaya_bytovaya_tehnika/dlya_kuhni/generatory_lda': 'generatory-lda',
  'melkaya_bytovaya_tehnika/dlya_kuhni/yajcevarki': 'yajcevarki',
  'melkaya_bytovaya_tehnika/dlya_kuhni/prochee': 'prochaya-malaya-kuhonnaya-tehnika',
  'melkaya_bytovaya_tehnika/dlya_doma/vesy': 'vesy',
  'melkaya_bytovaya_tehnika/dlya_doma/pylesosy': 'pylesosy',
  'melkaya_bytovaya_tehnika/dlya_doma/utyugi': 'utyugi',
  'melkaya_bytovaya_tehnika/dlya_doma/roboty_dlya_mojki_okon': 'roboty-dlya-mojki-okon',
  'melkaya_bytovaya_tehnika': 'malaya-bytovaya-tehnika',

  'bytovaya_himiya/dlya_chistki_bytovoj_tehniki': 'sredstva-dlya-chistki-i-uhoda',
  'bytovaya_himiya/dlya_stirki_belya': 'sredstva-dlya-stirki-belya',
  'bytovaya_himiya/dlya_posudy': 'sredstva-dlya-posudy',
  'bytovaya_himiya': 'uhod-i-aksessuary',

  'aksessuary/dlya-vytyazhek': 'aksessuary-dlya-vytyazhek',
  'aksessuary/dlya-pylesosov': 'aksessuary-dlya-pylesosov',
  'aksessuary/dlya-moek': 'aksessuary-dlya-moek',
  'aksessuary/dlya_varochnyh_poverhnostey': 'aksessuary-dlya-varochnyh-poverhnostej',
  'aksessuary/dlya-holodilnikov': 'aksessuary-dlya-holodilnikov',
  'aksessuary/dlya-duhovyh-shkafov-i-plit': 'aksessuary-dlya-duhovyh-shkafov-i-plit',
  'aksessuary/dlya-stiralnyh-i-sushilnyh-mashin': 'aksessuary-dlya-stiralnyh-i-sushilnyh-mashin',
  'aksessuary/dlya_maloj_kuhonnoj_tehniki': 'aksessuary-dlya-maloj-kuhonnoj-tehniki',
  'aksessuary/dlya_klimaticheskoj_tehniki': 'aksessuary-dlya-klimaticheskoj-tehniki',
  'aksessuary/dlya_posudomoechnyh_mashin': 'aksessuary-dlya-posudomoechnyh-mashin',
  'aksessuary/dlya_prochej_maloj_bytovoj_tehniki': 'aksessuary-dlya-prochej-maloj-bytovoj-tehniki',
  'aksessuary/dlya_kofemashin': 'aksessuary-dlya-kofemashin',
  'aksessuary/siemens_elektro': 'elektrotovary',
  'aksessuary/dlya_gladilnyh_mashin_i_sistem': 'aksessuary-dlya-gladilnyh-mashin-i-sistem',
  'aksessuary/dlya_vinnyh_shkafov': 'aksessuary-dlya-holodilnikov',
  'aksessuary': 'uhod-i-aksessuary',
};

// Legacy static utility page redirects
const LEGACY_UTILITY_ROUTES: Record<string, string> = {
  '/main': '/',
  '/politika': '/policy',
  '/privacy': '/policy',
  '/delivery_payment': '/delivery-payment',
  '/kredit': '/delivery-payment',
  '/service_warranty': '/warranty',
  '/return_exchange_warranty': '/returns',
  '/nashli_deshevle_snizim_cenu': '/price-match',
  '/optovyj_otdel': '/opt',
  '/partners': '/designers',
  '/podbor_bytovoj_tehniki': '/services',
  '/akcii_dlya_tovarov': '/promos',
  '/rasprodazha': '/catalog/ucenennye-tovary',
  '/catalog/duhovye-shkafy': '/catalog/vstraivaemye-duhovye-shkafy',
  '/catalog/izmelchiteli-othodov': '/catalog/izmelchiteli-pishchevyh-othodov',
};

// Renamed promo slugs -> current active promo slugs
const LEGACY_PROMO_SLUG_MAP: Record<string, string> = {
  'vard-podarok-nabor-melnic-vsmps26t-2026': '/promos/vard-podarok-nabor-melnic',
  'evelux-skidki-pri-pokupke-komplekta': '/promos/evelux-kaskad',
};

// Preserves incoming tracking parameters (?ysclid=..., ?yclid=..., ?gclid=..., UTM) across 301 hops
function buildRedirectUrl(destination: string, request: NextRequest): URL {
  const targetUrl = new URL(destination, request.url);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
    }
  });
  return targetUrl;
}

export function middleware(request: NextRequest) {
  let rawPathname = request.nextUrl.pathname;

  // 0. Sanitize malformed UMI / Yandex Dzen paths containing `/&param=val` without `?`
  if (rawPathname.includes('/&')) {
    const idx = rawPathname.indexOf('/&');
    rawPathname = idx === 0 ? '/' : rawPathname.slice(0, idx) || '/';
    if (rawPathname === '/') {
      return NextResponse.redirect(buildRedirectUrl('/', request), 301);
    }
  }

  const cleanPath = rawPathname.replace(/\/+$/, '') || '/';

  // =========================================================================
  // 1. Legacy Static Utility Routes (301 Permanent Redirect)
  // =========================================================================
  if (cleanPath in LEGACY_UTILITY_ROUTES) {
    const target = LEGACY_UTILITY_ROUTES[cleanPath];
    return NextResponse.redirect(buildRedirectUrl(target, request), 301);
  }

  if (cleanPath.startsWith('/rasprodazha/')) {
    return NextResponse.redirect(buildRedirectUrl('/catalog/ucenennye-tovary', request), 301);
  }

  if (cleanPath === '/actions_sales' || cleanPath.startsWith('/actions_sales/')) {
    const subSlug = cleanPath.replace(/^\/actions_sales\/?/, '').split('/')[0]?.toLowerCase();
    if (subSlug && subSlug in LEGACY_PROMO_SLUG_MAP) {
      return NextResponse.redirect(buildRedirectUrl(LEGACY_PROMO_SLUG_MAP[subSlug], request), 301);
    }
    return NextResponse.redirect(buildRedirectUrl('/promos', request), 301);
  }

  if (cleanPath.startsWith('/promos/')) {
    const promoSlug = cleanPath.replace(/^\/promos\//, '').toLowerCase();
    if (promoSlug in LEGACY_PROMO_SLUG_MAP) {
      return NextResponse.redirect(buildRedirectUrl(LEGACY_PROMO_SLUG_MAP[promoSlug], request), 301);
    }
  }

  // =========================================================================
  // 2. Legacy Brand URLs: /brendy, /brendy/:slug, /index/brendy, /index/brendy/:slug
  // =========================================================================
  if (cleanPath === '/brendy' || cleanPath === '/index/brendy') {
    return NextResponse.redirect(buildRedirectUrl('/brands', request), 301);
  }

  if (cleanPath.startsWith('/brendy/') || cleanPath.startsWith('/index/brendy/')) {
    const brandSlugRaw = cleanPath
      .replace(/^\/(?:index\/)?brendy\//, '')
      .split('/')[0]
      ?.toLowerCase();

    if (brandSlugRaw) {
      const regEntry = resolveBrandEntry(brandSlugRaw);
      const canonicalSlug = regEntry ? regEntry.slug : brandNameToSlug(brandSlugRaw);

      if (canonicalSlug && ACTIVE_BRAND_SLUGS.has(canonicalSlug)) {
        return NextResponse.redirect(buildRedirectUrl(`/brands/${canonicalSlug}`, request), 301);
      }
    }
    return NextResponse.redirect(buildRedirectUrl('/brands', request), 301);
  }

  // =========================================================================
  // 3. Legacy Shop URLs: /shop and /shop/:path*
  // =========================================================================
  if (cleanPath === '/shop') {
    return NextResponse.redirect(buildRedirectUrl('/catalog', request), 301);
  }

  if (cleanPath.startsWith('/shop/')) {
    // 3.1. Direct product match from redirects.json (checking sanitized path with & without trailing slash)
    const target =
      redirects[rawPathname] ||
      redirects[cleanPath] ||
      redirects[`${cleanPath}/`];

    if (target) {
      return NextResponse.redirect(buildRedirectUrl(target, request), 301);
    }

    const segments = cleanPath.replace(/^\/shop\//, '').split('/').filter(Boolean);

    // 3.2. Outlet & Discontinued Showroom Sale Section: /shop/ucenennye_tovary/...
    if (segments[0]?.toLowerCase() === 'ucenennye_tovary') {
      if (segments.length === 1) {
        return NextResponse.redirect(buildRedirectUrl('/catalog/ucenennye-tovary', request), 301);
      }

      // Sold / archived outlet item -> redirect to its closest category + brand (or /catalog/ucenennye-tovary)
      const restSlug = segments.slice(1).join('/');
      const inferredCategory = inferCategorySlugFromUmiSlug(restSlug);
      const detectedBrand = extractBrandFromUmiSegments(segments.slice(1));
      const validBrand = detectedBrand && ACTIVE_BRAND_SLUGS.has(detectedBrand.slug) ? detectedBrand : null;

      if (inferredCategory) {
        const dest = validBrand
          ? `/catalog/${inferredCategory}?brand=${encodeURIComponent(validBrand.dbBrand)}`
          : `/catalog/${inferredCategory}`;
        return NextResponse.redirect(buildRedirectUrl(dest, request), 301);
      }

      if (validBrand) {
        return NextResponse.redirect(buildRedirectUrl(`/brands/${validBrand.slug}`, request), 301);
      }

      return NextResponse.redirect(buildRedirectUrl('/catalog/ucenennye-tovary', request), 301);
    }

    // 3.3. Smart category, macro-section, and compound-brand matching for old UMI.CMS category trees
    let matchedCategorySlug: string | null = null;
    let detectedBrandEntry = null;

    for (let len = Math.min(segments.length, 3); len >= 1; len--) {
      const candidateKey = segments.slice(0, len).join('/').toLowerCase();
      if (candidateKey in UMI_CATEGORY_MAP) {
        matchedCategorySlug = UMI_CATEGORY_MAP[candidateKey];
        const restSegments = segments.slice(len);
        detectedBrandEntry = extractBrandFromUmiSegments(restSegments);
        break;
      }
    }

    if (matchedCategorySlug) {
      let destination = `/catalog/${matchedCategorySlug}`;
      if (detectedBrandEntry && ACTIVE_BRAND_SLUGS.has(detectedBrandEntry.slug)) {
        destination += `?brand=${encodeURIComponent(detectedBrandEntry.dbBrand)}`;
      }
      return NextResponse.redirect(buildRedirectUrl(destination, request), 301);
    }

    // 3.4. Fallback for completely unrecognizable paths -> pass to 404 page (Zero Soft 404)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/&(.*)',
    '/shop',
    '/shop/:path*',
    '/brendy',
    '/brendy/:path*',
    '/index/brendy',
    '/index/brendy/:path*',
    '/rasprodazha',
    '/rasprodazha/:path*',
    '/main',
    '/main/:path*',
    '/politika',
    '/politika/:path*',
    '/privacy',
    '/delivery_payment',
    '/delivery_payment/:path*',
    '/kredit',
    '/kredit/:path*',
    '/service_warranty',
    '/service_warranty/:path*',
    '/return_exchange_warranty',
    '/return_exchange_warranty/:path*',
    '/nashli_deshevle_snizim_cenu',
    '/nashli_deshevle_snizim_cenu/:path*',
    '/actions_sales',
    '/actions_sales/:path*',
    '/akcii_dlya_tovarov',
    '/akcii_dlya_tovarov/:path*',
    '/promos/:path*',
    '/optovyj_otdel',
    '/optovyj_otdel/:path*',
    '/partners',
    '/partners/:path*',
    '/podbor_bytovoj_tehniki',
    '/podbor_bytovoj_tehniki/:path*',
    '/catalog/duhovye-shkafy',
    '/catalog/izmelchiteli-othodov',
  ],
};
