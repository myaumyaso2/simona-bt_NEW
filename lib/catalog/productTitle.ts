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

/**
 * Formats or normalizes any product title to comply with the standard:
 * "Группа товара + Бренд + Артикул"
 */
export function formatProductName(product: ProductLike): string {
  let name = cleanLegacySuffixes(product.name || '');
  const brand = (product.brand || '').trim();
  const brandUpper = brand.toUpperCase();

  // If name is completely empty, construct from category, brand, and SKU
  if (!name) {
    const group = (product.category && SINGULAR_CATEGORY_MAP[product.category]) || product.category || 'Прибор';
    return [group, brandUpper, product.sku].filter(Boolean).join(' ');
  }

  // 1. If name already has the brand and starts with Russian text (e.g. "Индукционная варочная панель ASKO HI ...", "Мельница для специй VARD ...")
  if (brand && name.toUpperCase().includes(brandUpper) && /^[А-Яа-яЁё]/.test(name)) {
    return name.replace(/\s+/g, ' ').trim();
  }

  // 2. Detect legacy inverted pattern: [Article] [Group]
  // e.g. "MIH 45107F Варочная панель", "MG 3270TGB Варочная панель", "KWK 0908 G Чайник эл."
  const invertedMatch = name.match(/^(.*?)\s+([А-Яа-яЁё][а-яёА-ЯЁ\s\.-]+)$/);
  if (invertedMatch && brand) {
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

    return `${group} ${brandUpper} ${article}`.trim();
  }

  // 3. Fallback: if group cannot be extracted cleanly, use category
  const categoryGroup = (product.category && SINGULAR_CATEGORY_MAP[product.category]) || product.category || 'Бытовая техника';
  
  // Clean categoryGroup from name if it was embedded in the middle
  const cleanArticle = name
    .replace(new RegExp('(^|\\s+)' + categoryGroup + '(\\s+|$)', 'gi'), ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${categoryGroup} ${brandUpper} ${cleanArticle}`.trim();
}
