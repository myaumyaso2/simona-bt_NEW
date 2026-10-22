import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsMap from '@/data/redirects.json';

const redirects: Record<string, string> = redirectsMap;

// 1. Tier-1 anchor brand slugs (13 flagship brands)
const TIER1_BRANDS: Record<string, string> = {
  miele: 'miele',
  asko: 'asko',
  smeg: 'smeg',
  liebherr: 'liebherr',
  korting: 'korting',
  koerting: 'korting',
  omoikiri: 'omoikiri',
  falmec: 'falmec',
  vard: 'vard',
  midea: 'midea',
  bosch: 'bosch',
  elica: 'elica',
  gorenje: 'gorenje',
  evelux: 'evelux',
};

// 2. Canonical brand names for Tier-2 and filtering
const BRAND_CANONICAL_NAMES: Record<string, string> = {
  siemens: 'SIEMENS',
  neff: 'NEFF',
  gaggenau: 'Gaggenau',
  dedietrich: 'De Dietrich',
  de_dietrich: 'De Dietrich',
  bertazzoni: 'BERTAZZONI',
  riedel: 'RIEDEL',
  nivona: 'NIVONA',
  meyvel: 'Meyvel',
  dunavox: 'Dunavox',
  franke: 'FRANKE',
  teka: 'TEKA',
  laurastar: 'Laurastar',
  graude: 'GRAUDE',
  elikor: 'ELIKOR',
  longran: 'LONGRAN',
  kuppersberg: 'KUPPERSBERG',
  caso: 'CASO',
  jetair: 'JETAIR',
  schulthess: 'SCHULTHESS',
  steba: 'STEBA',
  hiberg: 'HIBERG',
  indesit: 'INDESIT',
  bone_crusher: 'BONE CRUSHER',
  bonecrusher: 'BONE CRUSHER',
  karcher: 'KARCHER',
  beko: 'BEKO',
  whirlpool: 'WHIRLPOOL',
  hitachi: 'HITACHI',
  miele: 'Miele',
  asko: 'ASKO',
  smeg: 'SMEG',
  liebherr: 'Liebherr',
  korting: 'KÖRTING',
  koerting: 'KÖRTING',
  omoikiri: 'OMOIKIRI',
  falmec: 'Falmec',
  vard: 'VARD',
  midea: 'MIDEA',
  bosch: 'BOSCH',
  elica: 'ELICA',
  gorenje: 'Gorenje',
  evelux: 'Evelux',
};

// 3. Mapping of old UMI.CMS category paths to new catalog categories / sections
const UMI_CATEGORY_MAP: Record<string, string> = {
  'vstraivaemaya_tehnika/varochnye_paneli': 'varochnye-paneli',
  'vstraivaemaya_tehnika/duhovye_shkafy': 'duhovye-shkafy',
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

// 4. Legacy static utility page redirects
const LEGACY_UTILITY_ROUTES: Record<string, string> = {
  '/politika': '/policy',
  '/delivery_payment': '/delivery-payment',
  '/service_warranty': '/warranty',
  '/return_exchange_warranty': '/returns',
  '/nashli_deshevle_snizim_cenu': '/price-match',
  '/optovyj_otdel': '/opt',
  '/catalog/izmelchiteli-othodov': '/catalog/izmelchiteli-pishchevyh-othodov',
};

// Helper to construct 301 redirect URL while strictly preserving incoming query parameters
// (such as ?ysclid=..., ?yclid=..., ?gclid=..., and UTM parameters)
function buildRedirectUrl(destination: string, request: NextRequest): URL {
  const targetUrl = new URL(destination, request.url);
  // Merge original search parameters from request.nextUrl, keeping any destination-specific parameters intact
  request.nextUrl.searchParams.forEach((value, key) => {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
    }
  });
  return targetUrl;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleanPath = pathname.replace(/\/+$/, '');

  // =========================================================================
  // 1. Legacy Static Utility Routes (301 Permanent Redirect)
  // =========================================================================
  if (cleanPath in LEGACY_UTILITY_ROUTES) {
    const target = LEGACY_UTILITY_ROUTES[cleanPath];
    return NextResponse.redirect(buildRedirectUrl(target, request), 301);
  }

  if (pathname.startsWith('/actions_sales')) {
    return NextResponse.redirect(buildRedirectUrl('/promos', request), 301);
  }

  // =========================================================================
  // 2. Legacy Brand URLs: /brendy and /brendy/:slug
  // =========================================================================
  if (pathname === '/brendy' || pathname === '/brendy/') {
    return NextResponse.redirect(buildRedirectUrl('/brands', request), 301);
  }

  if (pathname.startsWith('/brendy/')) {
    const brandSlugRaw = pathname.replace(/^\/brendy\//, '').split('/')[0]?.toLowerCase();
    if (brandSlugRaw) {
      // Tier-1: 13 anchor brands -> /brands/:slug
      if (brandSlugRaw in TIER1_BRANDS) {
        const canonicalSlug = TIER1_BRANDS[brandSlugRaw];
        return NextResponse.redirect(buildRedirectUrl(`/brands/${canonicalSlug}`, request), 301);
      }

      // Tier-2: other brands -> /catalog?brand=:BRAND
      const brandName =
        BRAND_CANONICAL_NAMES[brandSlugRaw] || brandSlugRaw.toUpperCase();
      return NextResponse.redirect(
        buildRedirectUrl(`/catalog?brand=${encodeURIComponent(brandName)}`, request),
        301
      );
    }
    return NextResponse.redirect(buildRedirectUrl('/brands', request), 301);
  }

  // =========================================================================
  // 3. Legacy Shop URLs: /shop/:path*
  // =========================================================================
  if (pathname.startsWith('/shop/')) {
    // 3.1. Direct product match from redirects.json
    let target = redirects[pathname];
    if (!target && !pathname.endsWith('/')) {
      target = redirects[pathname + '/'];
    }
    if (!target && pathname.endsWith('/')) {
      target = redirects[pathname.slice(0, -1)];
    }

    if (target) {
      return NextResponse.redirect(buildRedirectUrl(target, request), 301);
    }

    // 3.2. Smart category and brand matching for old UMI.CMS category trees
    const segments = pathname.replace(/^\/shop\//, '').replace(/\/+$/, '').split('/');

    // Check 3-level or 2-level category path
    let matchedCategorySlug: string | null = null;
    let detectedBrand: string | null = null;

    for (let len = Math.min(segments.length, 3); len >= 1; len--) {
      const candidateKey = segments.slice(0, len).join('/');
      if (candidateKey in UMI_CATEGORY_MAP) {
        matchedCategorySlug = UMI_CATEGORY_MAP[candidateKey];
        // Check remaining segments for brand keywords
        const restSegments = segments.slice(len);
        for (const seg of restSegments) {
          const segLower = seg.toLowerCase();
          if (segLower in BRAND_CANONICAL_NAMES) {
            detectedBrand = BRAND_CANONICAL_NAMES[segLower];
            break;
          }
        }
        break;
      }
    }

    if (matchedCategorySlug) {
      // Section or specific category
      const isDirectCategory = !matchedCategorySlug.endsWith('-tehnika') &&
        matchedCategorySlug !== 'mojki-i-smesiteli' &&
        matchedCategorySlug !== 'bokaly-i-posuda' &&
        matchedCategorySlug !== 'uhod-i-aksessuary';

      let destination = isDirectCategory
        ? `/catalog/${matchedCategorySlug}`
        : `/catalog?category=${matchedCategorySlug}`;

      if (detectedBrand) {
        destination += (destination.includes('?') ? '&' : '?') + `brand=${encodeURIComponent(detectedBrand)}`;
      }

      return NextResponse.redirect(buildRedirectUrl(destination, request), 301);
    }

    // 3.3. Default fallback for discontinued items -> /catalog
    return NextResponse.redirect(buildRedirectUrl('/catalog', request), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/shop/:path*',
    '/brendy/:path*',
    '/brendy',
    '/politika',
    '/delivery_payment',
    '/service_warranty',
    '/return_exchange_warranty',
    '/nashli_deshevle_snizim_cenu',
    '/actions_sales/:path*',
    '/actions_sales',
    '/optovyj_otdel',
    '/catalog/izmelchiteli-othodov',
  ],
};
