/**
 * Universal Quiet Luxury Product Title Normalizer for SIMONA-BT.
 * 
 * Strict Project Standard (AGENTS.md & PRODUCT.md):
 * Formula: [Группа товара] + [Бренд] + [Артикул]
 * Examples:
 *   - "Индукционная варочная панель ASKO HI 5643FMG1"
 *   - "Газовая варочная панель MIDEA MG 3270TGB"
 *   - "Духовой шкаф MIDEA MO 78100CGB"
 *   - "Стиральная машина MIELE WEA 125 WCS"
 * 
 * Automatically cleans legacy UMI/1C artifacts:
 *   - Strips trailing service tags: FIX, СПЕЦ/ВИТРИНА, ПРОМО, АГЕНТ/БЕЗ НДС, etc.
 *   - Fixes inverted legacy naming: [Article] [Group] -> [Group] [Brand] [Article]
 *   - Refines appliance subtypes based on vendor series (e.g., MIH -> Индукционная, MG -> Газовая)
 */

import { formatBrandName } from '@/lib/formatters';

interface ProductLike {
  name?: string;
  brand?: string;
  category?: string;
  categorySlug?: string;
  sku?: string;
}

const SINGULAR_CATEGORY_MAP: Record<string, string> = {
  'Варочные панели': 'Варочная панель',
  'Духовые шкафы': 'Духовой шкаф',
  'Вытяжки': 'Вытяжка',
  'Холодильники': 'Холодильник',
  'Посудомоечные машины': 'Посудомоечная машина',
  'Стиральные машины': 'Стиральная машина',
  'Сушильные машины': 'Сушильная машина',
  'Микроволновые печи': 'Микроволновая печь',
  'Кофемашины': 'Кофемашина',
  'Мойки': 'Мойка',
  'Смесители': 'Смеситель',
  'Винные шкафы': 'Винный шкаф',
  'Морозильные камеры': 'Морозильная камера',
  'Измельчители': 'Измельчитель пищевых отходов',
  'Подогреватели посуды': 'Подогреватель посуды',
  'Вакууматоры': 'Вакууматор',
  'Пароварки': 'Пароварка',
  'Чайники': 'Электрический чайник',
  'Тостеры': 'Тостер',
  'Блендеры': 'Блендер',
  'Миксеры': 'Миксер',
  'Грили': 'Гриль',
  'Аксессуары': 'Аксессуар',
};

/**
 * Strips legacy service suffixes like "FIX", "СПЕЦ/ВИТРИНА", "СПЕЦПРЕДЛОЖЕНИЕ", "ПРОМО", "АГЕНТ/БЕЗ НДС", etc.
 */
export function cleanLegacySuffixes(raw: string): string {
  if (!raw) return '';
  let res = raw;
  // Multi-pass to handle compound suffixes like "FIX СПЕЦ/ВИТРИНА" or "АГЕНТ/БЕЗ НДС СПЕЦ/ВИТРИНА"
  for (let i = 0; i < 3; i++) {
    res = res.replace(/(?:^|\s+)(?:FIX|[CСсc]ПЕЦ\/[^\s]+|[CСсc]ПЕЦПРЕДЛОЖЕНИЕ|ПРОМО|ВИТРИНА|АГЕНТ[^\s]*(?:\s+БЕЗ)?(?:\s+НДС)?|БЕЗ\s+НДС)(?:\s+|$)/gi, ' ');
  }
  return res.replace(/\s+/g, ' ').trim();
}

export const CANONICAL_BRANDS: Record<string, string> = {
  'korting': 'Körting',
  'körting': 'Körting',
  'falmec': 'Falmec',
  'evelux': 'Evelux',
  'vard': 'Vard',
  'asko': 'Asko',
  'smeg': 'Smeg',
  'miele': 'Miele',
  'midea': 'Midea',
  'omoikiri': 'Omoikiri',
  'liebherr': 'Liebherr',
  'bosch': 'Bosch',
  'neff': 'Neff',
  'siemens': 'Siemens',
  'kuppersbusch': 'Küppersbusch',
  'küppersbusch': 'Küppersbusch',
  'bertazzoni': 'Bertazzoni',
  'elica': 'Elica',
  'graude': 'Graude',
};

export function getCanonicalBrand(brand: string): string {
  if (!brand) return '';
  const key = brand.trim().toLowerCase();
  return CANONICAL_BRANDS[key] || formatBrandName(brand);
}

export function cleanSystemArticle(article: string): string {
  if (!article) return '';
  return cleanLegacySuffixes(article)
    .replace(/[\s\/-]+/g, '')
    .toUpperCase();
}

function refineGroupAndArticle(group: string, brandUpper: string, articleOrRest: string): string {
  let g = group.trim();
  const artUpper = articleOrRest.trim().toUpperCase();

  if (g === 'Чайник эл.' || g === 'Чайник') {
    g = 'Электрический чайник';
  }

  if (brandUpper === 'MIDEA' && g === 'Варочная панель') {
    if (artUpper.startsWith('MIH')) g = 'Индукционная варочная панель';
    else if (artUpper.startsWith('MG')) g = 'Газовая варочная панель';
    else if (artUpper.startsWith('MCH')) g = 'Электрическая варочная панель';
  }

  if (brandUpper === 'ASKO' && g === 'Варочная панель') {
    if (artUpper.startsWith('HG')) g = 'Газовая варочная панель';
    else if (artUpper.startsWith('HI')) g = 'Индукционная варочная панель';
  }

  return g;
}

/**
 * Formats or normalizes any product title to comply with the standard:
 * "Группа товара + Бренд + Артикул"
 */
export function formatProductName(product: ProductLike): string {
  let name = cleanLegacySuffixes(product.name || '');
  const rawBrand = (product.brand || '').trim();
  const canonicalBrand = getCanonicalBrand(rawBrand);
  const brandUpper = rawBrand.toUpperCase();

  // If name is completely empty, construct from category, brand, and SKU
  if (!name) {
    const group = (product.category && SINGULAR_CATEGORY_MAP[product.category]) || product.category || 'Прибор';
    return [group, canonicalBrand, product.sku].filter(Boolean).join(' ');
  }

  // 1. If name already has the brand and starts with Russian text
  if (rawBrand && name.toUpperCase().includes(brandUpper) && /^[А-Яа-яЁё]/.test(name)) {
    const regex = new RegExp(`^(.*?)\\s+${brandUpper}\\s+(.*)$`, 'i');
    const match = name.match(regex);
    if (match) {
      const refinedGroup = refineGroupAndArticle(match[1], brandUpper, match[2]);
      const cleanArt = cleanLegacySuffixes(match[2]);
      return `${refinedGroup} ${canonicalBrand} ${cleanArt}`.replace(/\s+/g, ' ').trim();
    }
    const brandReplaceRegex = new RegExp(`(^|\\s+)${brandUpper}(\\s+|$)`, 'i');
    const normalized = name.replace(brandReplaceRegex, `$1${canonicalBrand}$2`);
    return normalized.replace(/\s+/g, ' ').trim();
  }

  // 2. Detect legacy inverted pattern: [Article] [Group]
  const invertedMatch = name.match(/^(.*?)\s+([А-Яа-яЁё][а-яёА-ЯЁ\s\.-]+)$/);
  if (invertedMatch && rawBrand) {
    const article = cleanLegacySuffixes(invertedMatch[1].trim());
    const group = refineGroupAndArticle(invertedMatch[2].trim(), brandUpper, article);

    return `${group} ${canonicalBrand} ${article}`.replace(/\s+/g, ' ').trim();
  }

  // 3. Fallback: if group cannot be extracted cleanly, use category
  const categoryGroup = (product.category && SINGULAR_CATEGORY_MAP[product.category]) || product.category || 'Бытовая техника';
  
  // Clean categoryGroup from name if it was embedded in the middle
  const cleanArticle = name
    .replace(new RegExp('(^|\\s+)' + categoryGroup + '(\\s+|$)', 'gi'), ' ')
    .replace(new RegExp('(^|\\s+)' + brandUpper + '(\\s+|$)', 'gi'), ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const refinedFallbackGroup = refineGroupAndArticle(categoryGroup, brandUpper, cleanArticle);
  return `${refinedFallbackGroup} ${canonicalBrand} ${cleanArticle}`.replace(/\s+/g, ' ').trim();
}
