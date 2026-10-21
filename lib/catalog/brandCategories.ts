import { ProductItem } from '@/types';
import { CATALOG_CATEGORIES, CatalogCategory } from '@/data/catalogCategories';
import { BRAND_DETAILS_MAP } from '@/data/brandDetails';

export interface BrandCategoryTab {
  slug: string;
  title: string;
  menuTitle: string;
  count: number;
  dbCategories: string[];
}

/**
 * Реестр приоритетных флагманских категорий для брендов (Quiet Luxury Catalog Architecture)
 * Согласовано в рамках /grill-me: при переходе с Брендового атласа открывается флагманская категория марки.
 */
export const BRAND_FLAGSHIP_CATEGORY: Record<string, string> = {
  BOSCH: 'vstraivaemye-duhovye-shkafy',
  ASKO: 'stiralnye-mashiny',
  LIEBHERR: 'holodilniki',
  SMEG: 'varochnye-paneli',
  MIELE: 'vstraivaemye-duhovye-shkafy',
  OMOIKIRI: 'mojki-dlya-kuhni',
  ELICA: 'vytyazhki',
  FALMEC: 'vytyazhki',
  KORTING: 'vstraivaemye-duhovye-shkafy',
  'KÖRTING': 'vstraivaemye-duhovye-shkafy',
  MIDEA: 'vstraivaemye-duhovye-shkafy',
  BERTAZZONI: 'vstraivaemye-duhovye-shkafy',
  DUNAVOX: 'vinnye-shkafy',
  MEYVEL: 'vinnye-shkafy',
  FRANKE: 'mojki-dlya-kuhni',
  VARD: 'vstraivaemye-duhovye-shkafy',
  EVELUX: 'vstraivaemye-duhovye-shkafy',
  GRAUDE: 'vstraivaemye-duhovye-shkafy',
  KUPPERSBERG: 'vstraivaemye-duhovye-shkafy',
  GORENJE: 'vstraivaemye-duhovye-shkafy',
  NIVONA: 'kofemashiny',
  SCHULTHESS: 'stiralnye-mashiny',
  ALVEUS: 'mojki-dlya-kuhni',
  HIBERG: 'holodilniki',
};

export function getBrandFlagshipCategory(brandName: string): string | null {
  const normalized = brandName.trim().toUpperCase();
  return BRAND_FLAGSHIP_CATEGORY[normalized] || null;
}

export interface BrandInfo {
  name: string;
  slug: string;
  country: string;
  showroom: string;
  usp: string;
  heroText?: string;
}

// Fallback metadata for brands
const BRAND_META_FALLBACK: Record<string, { country: string; usp: string; showroom: string }> = {
  BOSCH: {
    country: 'Германия',
    usp: 'Немецкие инженерные традиции и инновации',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  ASKO: {
    country: 'Швеция',
    usp: 'Скандинавский премиальный функционализм',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  MIELE: {
    country: 'Германия',
    usp: 'Эталон надежности и технологий с 1899 года',
    showroom: 'Флагманский салон: ул. Белинского, 15 (Активная кухня)',
  },
  SMEG: {
    country: 'Италия',
    usp: 'Авторский дизайн Dolce Stil Novo и Linea',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  LIEBHERR: {
    country: 'Германия / Австрия',
    usp: 'Мировой лидер в области охлаждения и био-свежести',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  OMOIKIRI: {
    country: 'Япония',
    usp: 'Японское искусство гармонии кухонной зоны',
    showroom: 'Фирменный салон: ул. Белинского, 11/66',
  },
  KORTING: {
    country: 'Германия',
    usp: 'Надежная европейская встраиваемая техника',
    showroom: 'Фирменный салон: ул. Белинского, 11/66',
  },
  FALMEC: {
    country: 'Италия',
    usp: 'Бесшумные вытяжки Circle.Tech и системы NRS',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  ELICA: {
    country: 'Италия',
    usp: 'Дизайнерская аспирация и варочные центры NikolaTesla',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  VARD: {
    country: 'Европа / Россия',
    usp: 'Премиальная встройка с заводской гарантией 3 года',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  BERTAZZONI: {
    country: 'Италия',
    usp: 'Итальянские варочные блоки и духовые центры с 1882 г.',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
  MIDEA: {
    country: 'Инновации',
    usp: 'Современные умные приборы для кухни и дома',
    showroom: 'Флагманский салон: ул. Белинского, 15',
  },
};

/**
 * Get curated brand metadata (country, showroom, USP)
 */
export function getBrandInfo(brandName: string): BrandInfo {
  const normalizedKey = brandName.trim().toUpperCase();
  const slug = brandName.trim().toLowerCase();

  const details = BRAND_DETAILS_MAP?.[slug];
  const fallback = BRAND_META_FALLBACK[normalizedKey] || {
    country: 'Европа',
    usp: 'Официальная авторизованная коллекция',
    showroom: 'Салоны «СИМОНА» на ул. Белинского',
  };

  return {
    name: details?.name || brandName,
    slug,
    country: details?.country || fallback.country,
    showroom: details?.showroom || fallback.showroom,
    usp: fallback.usp,
    heroText: details?.heroText,
  };
}

/**
 * Maps a single product item to its canonical CatalogCategory
 */
export function findCategoryForProduct(product: ProductItem): CatalogCategory | null {
  const pCat = product.category?.trim();
  if (!pCat) return null;

  // 1. Direct match by dbCategories
  const directMatch = CATALOG_CATEGORIES.find((cat) =>
    cat.dbCategories.some((dbCat) => dbCat.trim().toLowerCase() === pCat.toLowerCase())
  );
  if (directMatch) return directMatch;

  // 2. Match by title or menuTitle
  const titleMatch = CATALOG_CATEGORIES.find(
    (cat) =>
      cat.title.trim().toLowerCase() === pCat.toLowerCase() ||
      cat.menuTitle.trim().toLowerCase() === pCat.toLowerCase()
  );
  if (titleMatch) return titleMatch;

  // 3. Fallback: partial match
  const partialMatch = CATALOG_CATEGORIES.find((cat) =>
    cat.dbCategories.some((dbCat) =>
      pCat.toLowerCase().includes(dbCat.toLowerCase()) || dbCat.toLowerCase().includes(pCat.toLowerCase())
    )
  );

  return partialMatch || null;
}

/**
 * Checks whether a product matches a given category slug
 */
export function isProductInCategory(product: ProductItem, categorySlug: string): boolean {
  if (!categorySlug) return true;

  const catMeta = CATALOG_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!catMeta) {
    // If not standard catalog category, check if product category slugified matches
    const productCatSlug = (product.category || '')
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/^-|-$/g, '');
    return productCatSlug === categorySlug;
  }

  const pCat = (product.category || '').trim().toLowerCase();
  return catMeta.dbCategories.some((dbCat) => dbCat.trim().toLowerCase() === pCat);
}

/**
 * Groups a collection of brand products into sorted categories with counts.
 * Strictly excludes service/discounted/junk categories (e.g. "Уцененные товары")
 * and prioritizes the curated flagship category if available.
 */
export function getBrandCategoriesFromProducts(products: ProductItem[], brandName?: string): BrandCategoryTab[] {
  const categoryMap = new Map<string, BrandCategoryTab>();
  const flagshipSlug = brandName ? getBrandFlagshipCategory(brandName) : null;

  for (const product of products) {
    // 1. Strict filter against service, junk, or discount categories
    const rawCat = (product.category || '').trim();
    if (/уцен|архив|разное|не определено/i.test(rawCat)) {
      continue;
    }

    const cat = findCategoryForProduct(product);
    if (cat) {
      if (/уцен|архив/i.test(cat.slug) || /уцен|архив/i.test(cat.title)) {
        continue;
      }
      const existing = categoryMap.get(cat.slug);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(cat.slug, {
          slug: cat.slug,
          title: cat.title,
          menuTitle: cat.menuTitle || cat.title,
          count: 1,
          dbCategories: [...cat.dbCategories],
        });
      }
    }
  }

  // Sort categories: Curated flagship category first, then by count descending
  return Array.from(categoryMap.values()).sort((a, b) => {
    if (flagshipSlug) {
      if (a.slug === flagshipSlug) return -1;
      if (b.slug === flagshipSlug) return 1;
    }
    return b.count - a.count;
  });
}
