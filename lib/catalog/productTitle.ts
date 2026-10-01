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
  'vard': 'VARD',
  'asko': 'ASKO',
  'smeg': 'SMEG',
  'miele': 'Miele',
  'midea': 'Midea',
  'omoikiri': 'Omoikiri',
  'liebherr': 'Liebherr',
  'bosch': 'Bosch',
  'neff': 'Neff',
  'siemens': 'Siemens',
  'kuppersbusch': 'Küppersbusch',
  'bertazzoni': 'Bertazzoni',
  'elica': 'Elica',
  'graude': 'Graude',
};

export function getCanonicalBrand(brand: string): string {
  if (!brand) return '';
  const key = brand.trim().toLowerCase();
  return CANONICAL_BRANDS[key] || brand.trim();
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
    // Replace uppercase or raw brand with canonical brand
    const regex = new RegExp(`(^|\\s+)${brandUpper}(\\s+|$)`, 'i');
    const normalized = name.replace(regex, `$1${canonicalBrand}$2`);
    return normalized.replace(/\s+/g, ' ').trim();
  }

  // 2. Detect legacy inverted pattern: [Article] [Group]
  const invertedMatch = name.match(/^(.*?)\s+([А-Яа-яЁё][а-яёА-ЯЁ\s\.-]+)$/);
  if (invertedMatch && rawBrand) {
    const article = invertedMatch[1].trim();
    let group = invertedMatch[2].trim();

    // Standardize colloquial abbreviations
    if (group === 'Чайник эл.' || group === 'Чайник') group = 'Электрический чайник';

    // Subtype refinement for MIDEA cooktops
    if (brandUpper === 'MIDEA' && group === 'Варочная панель') {
      if (article.startsWith('MIH')) group = 'Индукционная варочная панель';
      else if (article.startsWith('MG')) group = 'Газовая варочная панель';
      else if (article.startsWith('MCH')) group = 'Электрическая варочная панель';
    }

    // Subtype refinement for ASKO gas cooktops
    if (brandUpper === 'ASKO' && group === 'Варочная панель' && article.startsWith('HG')) {
      group = 'Газовая варочная панель';
    }

    return `${group} ${canonicalBrand} ${article}`.trim();
  }

  // 3. Fallback: if group cannot be extracted cleanly, use category
  const categoryGroup = (product.category && SINGULAR_CATEGORY_MAP[product.category]) || product.category || 'Бытовая техника';
  
  // Clean categoryGroup from name if it was embedded in the middle
  const cleanArticle = name
    .replace(new RegExp('(^|\\s+)' + categoryGroup + '(\\s+|$)', 'gi'), ' ')
    .replace(new RegExp('(^|\\s+)' + brandUpper + '(\\s+|$)', 'gi'), ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${categoryGroup} ${canonicalBrand} ${cleanArticle}`.trim();
}
