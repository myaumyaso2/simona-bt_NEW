import { ProductFeature, ProductItem } from '@/types';

export interface GroupedFeature {
  groupName: string;
  items: { label: string; value: string }[];
}

export type SemanticFeatureGroup =
  | 'Основные параметры'
  | 'Габариты и монтаж'
  | 'Функции и режимы'
  | 'Комфорт, уход и безопасность'
  | 'Дополнительные характеристики';

export const SEMANTIC_FEATURE_GROUPS: SemanticFeatureGroup[] = [
  'Основные параметры',
  'Габариты и монтаж',
  'Функции и режимы',
  'Комфорт, уход и безопасность',
  'Дополнительные характеристики',
];

/**
 * Categorizes a single specification label into one of the 4 core Quiet Luxury semantic groups.
 */
export function getFeatureSemanticGroup(label: string): SemanticFeatureGroup {
  const l = label.toLowerCase().trim();

  // 1. Габариты и монтаж (Dimensions, Niche, Weight, Power connections)
  const dimKeywords = [
    'высота', 'ширина', 'глубина', 'габарит', 'вес', 'монтаж', 'встройк', 
    'ниши', 'размер', 'диаметр', 'длина', 'подключен', 'мощность', 'напряжение', 
    'установка', 'встраиван', 'баз', 'вырез', 'фасад', 'короб', 'воздуховод', 
    'потребляем', 'длина кабел', 'сетевой шнур', 'толщин'
  ];
  if (dimKeywords.some((k) => l.includes(k))) {
    return 'Габариты и монтаж';
  }

  // 2. Комфорт, уход и безопасность (Protection, Noise, Cleaning, Sensors, Safety)
  const comfortKeywords = [
    'очистк', 'безопасн', 'дет', 'шум', 'освещен', 'фильтр', 'доводчик', 
    'блокировк', 'стекл', 'комплект', 'уход', 'автоотключ', 'отключен', 'защит', 
    'самодиагностик', 'индикатор', 'сенсор', 'газ-контрол', 'aquastop', 'аквастоп', 
    'протечк', 'перелив', 'луч на полу', 'проекци', 'звуков', 'сигнал', 'дверц', 
    'петл', 'плавн', 'дезодорир', 'угольн', 'остаточн', 'вентилятор охлажден', 
    'холодный фронт', 'тройное остеклен', 'двойное остеклен'
  ];
  if (comfortKeywords.some((k) => l.includes(k))) {
    return 'Комфорт, уход и безопасность';
  }

  // 3. Функции и режимы (Cooking modes, Burners, Speeds, Capacity, Automation)
  const funcKeywords = [
    'режим', 'функци', 'нагрев', 'пар', 'свч', 'гриль', 'конвекц', 'скорост', 
    'производительн', 'конфор', 'индукц', 'таймер', 'температур', 'охлажден', 
    'заморозк', 'отжим', 'программ', 'давлен', 'переключател', 'эллиптическ', 
    'бустер', 'booster', 'bridge', 'мост', 'зона', 'чаш', 'излив', 'стру', 
    'комплект посуд', 'ступен', 'автоприготовлен', 'рецепт', 'размороз', 
    'термощуп', 'вертел', 'сушк', 'ионизац', 'суперзаморозк', 'суперохлажден', 
    'биофреш', 'biofresh', 'nofrost', 'ноу фрост', 'управлен'
  ];
  if (funcKeywords.some((k) => l.includes(k))) {
    return 'Функции и режимы';
  }

  // 4. Основные параметры (Type, Color, Brand, Country, Material, Series, Style)
  const mainKeywords = [
    'тип', 'цвет', 'страна', 'гарант', 'бренд', 'материал', 'объем', 'загрузк', 
    'энергопотреблен', 'класс', 'серия', 'линейка', 'стиль', 'исполнение', 
    'покрытие', 'форма', 'оборачиваем', 'коллекци', 'дизайн', 'поверхност', 
    'отделк'
  ];
  if (mainKeywords.some((k) => l.includes(k))) {
    return 'Основные параметры';
  }

  return 'Дополнительные характеристики';
}

/**
 * Intelligent grouping of raw flat product specifications into Quiet Luxury semantic sections:
 * 1. Основные параметры (Brand, Country, Warranty, Color, Main Type, Capacity)
 * 2. Габариты и монтаж (Height, Width, Depth, Weight, Installation, Power, Niche)
 * 3. Функции и режимы (Heating modes, Speeds, Burners, Microwave, Steam, Programs)
 * 4. Комфорт, уход и безопасность (Cleaning, Noise, Child lock, Lighting, Door closing)
 */
export function groupProductFeatures(features: ProductFeature[] = []): GroupedFeature[] {
  if (!features || features.length === 0) return [];

  const groups: Record<SemanticFeatureGroup, { label: string; value: string }[]> = {
    'Основные параметры': [],
    'Габариты и монтаж': [],
    'Функции и режимы': [],
    'Комфорт, уход и безопасность': [],
    'Дополнительные характеристики': [],
  };

  features.forEach((feat) => {
    if (!feat.value || feat.value === '-' || feat.value.trim() === '') return;
    const group = getFeatureSemanticGroup(feat.label);
    groups[group].push(feat);
  });

  return SEMANTIC_FEATURE_GROUPS
    .filter((g) => groups[g].length > 0)
    .map((groupName) => ({ groupName, items: groups[groupName] }));
}

export interface KeySpecBadge {
  label: string;
  value: string;
}

/**
 * Normalizes units and cleans up label brackets (e.g. "Высота (см)" -> label: "Высота", value: "190.6 см")
 */
function formatSpecItem(rawLabel: string, rawValue: string): KeySpecBadge {
  const label = rawLabel.replace(/\s*\(.*?\)/, '').trim();
  let value = rawValue.trim();
  const lLower = rawLabel.toLowerCase();

  // Add unit if pure number and unit missing
  if (/^\d+(\.\d+)?$/.test(value)) {
    if (lLower.includes('(см)') || lLower.includes('высота') || lLower.includes('ширина') || lLower.includes('глубина')) {
      value += ' см';
    } else if (lLower.includes('(мм)')) {
      value += ' мм';
    } else if (lLower.includes('объем') || lLower.includes('(л)')) {
      value += ' л';
    } else if (lLower.includes('загрузк') || lLower.includes('(кг)') || lLower.includes('вес')) {
      value += ' кг';
    } else if (lLower.includes('производит') || lLower.includes('м³/ч') || lLower.includes('м3/ч')) {
      value += ' м³/ч';
    } else if (lLower.includes('шум') || lLower.includes('(дб)')) {
      value += ' дБ';
    } else if (lLower.includes('мощность') || lLower.includes('(вт)')) {
      value += ' Вт';
    } else if (lLower.includes('отжим') || lLower.includes('об/мин')) {
      value += ' об/мин';
    } else if (lLower.includes('комплект')) {
      value += ' компл.';
    }
  }

  return { label, value };
}

function isValidDimensions(dim?: string | null): boolean {
  if (!dim || typeof dim !== 'string') return false;
  const d = dim.trim();
  if (d === '' || d === '-' || /0\s*[×x*]\s*0\s*[×x*]\s*0/i.test(d)) return false;
  return true;
}

/**
 * Extracts 3-4 key highlight specifications for the ProductBuyBox capsule,
 * tailored to specific categories with an intelligent fallback guaranteeing full 4-slot coverage.
 */
export function extractKeySpecs(product: ProductItem): KeySpecBadge[] {
  const specs: KeySpecBadge[] = [];
  const feats = (product.features || []).filter(
    (f) => f && f.value && f.value !== '-' && f.value.trim() !== ''
  );

  const usedLabels = new Set<string>();

  const addSpec = (feat?: { label: string; value: string }) => {
    if (!feat || specs.length >= 4) return false;
    const norm = feat.label.toLowerCase().trim();
    if (usedLabels.has(norm)) return false;
    usedLabels.add(norm);
    specs.push(formatSpecItem(feat.label, feat.value));
    return true;
  };

  const findFeat = (...preds: (string | ((l: string) => boolean))[]) => {
    for (const pred of preds) {
      const match = feats.find((f) => {
        const l = f.label.toLowerCase().trim();
        return !usedLabels.has(l) && (typeof pred === 'string' ? l.includes(pred) : pred(l));
      });
      if (match) return match;
    }
    return undefined;
  };

  const cat = (product.category || '').toLowerCase();

  // 1. REFRIGERATORS & FREEZERS
  if (cat.includes('холодильн') || cat.includes('морозил') || cat.includes('винн')) {
    // Height prioritized for kitchen integration
    const heightFeat = findFeat('высота');
    if (heightFeat) {
      addSpec(heightFeat);
    } else if (isValidDimensions(product.dimensions)) {
      specs.push({ label: 'Габариты', value: product.dimensions! });
    }
    addSpec(findFeat('общий объем', 'объем холодильной', 'объем морозильной', 'объем'));
    addSpec(findFeat('no frost', 'размороз'));
    addSpec(findFeat('зона свежести', 'управление', 'количество камер', 'шум'));
  }
  // 2. OVENS & COOKERS
  else if (cat.includes('духов') || cat.includes('плит')) {
    addSpec(findFeat('объем'));
    addSpec(findFeat('очистк'));
    addSpec(findFeat('управление'));
    addSpec(findFeat('режим', 'конвекц', 'гриль', 'ширина'));
  }
  // 3. HOBS / COOKTOPS
  else if (cat.includes('варочн')) {
    const widthFeat = findFeat('ширина');
    if (widthFeat) {
      addSpec(widthFeat);
    } else if (isValidDimensions(product.dimensions)) {
      specs.push({ label: 'Габариты', value: product.dimensions! });
    }
    addSpec(findFeat('всего конфорок', 'конфор', 'зон'));
    addSpec(findFeat('материал панели', 'материал'));
    addSpec(findFeat('управление', 'мощность'));
  }
  // 4. HOODS
  else if (cat.includes('вытяжк')) {
    addSpec(findFeat('производит', 'м³/ч'));
    const widthFeat = findFeat('ширина');
    if (widthFeat) {
      addSpec(widthFeat);
    } else if (isValidDimensions(product.dimensions)) {
      specs.push({ label: 'Габариты', value: product.dimensions! });
    }
    addSpec(findFeat('уровень шума', 'шум'));
    addSpec(findFeat('управление', 'скорост', 'режим'));
  }
  // 5. DISHWASHERS
  else if (cat.includes('посудомо')) {
    addSpec(findFeat('комплект', 'вместим'));
    const widthFeat = findFeat('ширина');
    if (widthFeat) {
      addSpec(widthFeat);
    } else if (isValidDimensions(product.dimensions)) {
      specs.push({ label: 'Габариты', value: product.dimensions! });
    }
    addSpec(findFeat('защита от протечек', 'протечк', 'aquastop', 'аквастоп'));
    addSpec(findFeat('уровень шума', 'шум', 'программ', 'управление'));
  }
  // 6. WASHING & DRYING MACHINES
  else if (cat.includes('стиральн') || cat.includes('сушильн')) {
    addSpec(findFeat('загрузк'));
    addSpec(findFeat('скорость отжима', 'отжим'));
    addSpec(findFeat('управление'));
    addSpec(findFeat('глубина', 'ширина', 'класс энерго'));
  }
  // 7. SINKS
  else if (cat.includes('мойк')) {
    const widthFeat = findFeat('ширина', 'размер');
    if (widthFeat) {
      addSpec(widthFeat);
    } else if (isValidDimensions(product.dimensions)) {
      specs.push({ label: 'Габариты', value: product.dimensions! });
    }
    addSpec(findFeat('материал'));
    addSpec(findFeat('количество чаш', 'чаш'));
    addSpec(findFeat('крыло', 'форма', 'монтаж', 'база'));
  }
  // 8. TAPS & FAUCETS
  else if (cat.includes('смесител')) {
    addSpec(findFeat('материал', 'покрыт', 'цвет'));
    addSpec(findFeat('высота излива', 'излив', 'высота'));
    addSpec(findFeat('выдвижной', 'фильтр'));
    addSpec(findFeat('управление', 'тип картриджа'));
  }

  // GENERAL FALLBACK PASS
  if (specs.length < 4) {
    if (!specs.some((s) => s.label.toLowerCase().includes('ширин') || s.label.toLowerCase().includes('габарит') || s.label.toLowerCase().includes('высот'))) {
      const dim = findFeat('ширина', 'высота');
      if (dim) addSpec(dim);
      else if (isValidDimensions(product.dimensions)) specs.push({ label: 'Габариты', value: product.dimensions! });
    }
  }

  if (specs.length < 4) {
    addSpec(findFeat('объем', 'производит', 'загрузк', 'мощность'));
  }

  if (specs.length < 4) {
    addSpec(findFeat('управление', 'материал', 'очистк', 'режим'));
  }

  // GUARANTEED INTELLIGENT BACKFILL TO 4 ITEMS
  if (specs.length < 4) {
    const excludeLabels = new Set([
      'бренд', 'цена', 'код', 'артикул', 'id', 'модель', 'название', 'описание',
      'код товара', 'артикул производителя'
    ]);

    for (const f of feats) {
      if (specs.length >= 4) break;
      const l = f.label.toLowerCase().trim();
      if (!excludeLabels.has(l) && !usedLabels.has(l)) {
        addSpec(f);
      }
    }
  }

  return specs.slice(0, 4);
}

export interface FacetOption {
  value: string;
  count: number;
}

export interface CategoryFacet {
  label: string;
  totalCount: number;
  options: FacetOption[];
}

export interface GroupedCategoryFacets {
  groupName: SemanticFeatureGroup;
  facets: CategoryFacet[];
}

/**
 * Groups catalog filter facets into canonical semantic groups.
 */
export function groupCategoryFacets(facets: CategoryFacet[]): GroupedCategoryFacets[] {
  const map = new Map<SemanticFeatureGroup, CategoryFacet[]>();
  SEMANTIC_FEATURE_GROUPS.forEach((g) => map.set(g, []));

  facets.forEach((facet) => {
    const group = getFeatureSemanticGroup(facet.label);
    map.get(group)?.push(facet);
  });

  return SEMANTIC_FEATURE_GROUPS
    .map((groupName) => ({
      groupName,
      facets: map.get(groupName) || [],
    }))
    .filter((g) => g.facets.length > 0);
}

/**
 * Computes top dynamic filter facets for the current product selection in catalog.
 */
export function getCategoryFacets(products: ProductItem[], maxFacets = 16): CategoryFacet[] {
  if (!products || products.length === 0) return [];

  // Exclude labels that are internal or raw dimensional decimals
  const excludeLabels = new Set([
    'бренд', 'цена', 'гарантия',
    'артикул', 'код', 'модель', 'id', 'описание',
    'длина (см)', 'высота (см)', 'глубина (см)', 'вес (кг)',
    'габариты упаковки (см)', 'вес в упаковке (кг)'
  ]);

  const labelCounts: Record<string, number> = {};
  const labelValues: Record<string, Record<string, number>> = {};

  products.forEach((p) => {
    (p.features || []).forEach((f) => {
      let norm = f.label.trim();
      const lower = norm.toLowerCase();
      if (excludeLabels.has(lower)) return;
      if (!f.value || f.value === '-' || f.value.toLowerCase() === 'нет') return;

      let val = f.value.trim();

      // Normalize width values into standard Quiet Luxury installation buckets
      if (lower.includes('ширина')) {
        norm = 'Ширина';
        const num = parseFloat(val.replace(',', '.'));
        if (!isNaN(num)) {
          if (num < 37) val = '30 см';
          else if (num < 55) val = '45 см';
          else if (num < 67) val = '60 см';
          else if (num < 77) val = '70–75 см';
          else if (num < 86) val = '80–85 см';
          else val = '90 см и шире';
        }
      }

      labelCounts[norm] = (labelCounts[norm] || 0) + 1;
      if (!labelValues[norm]) labelValues[norm] = {};
      labelValues[norm][val] = (labelValues[norm][val] || 0) + 1;
    });
  });

  const totalProducts = products.length;

  const sortedLabels = Object.entries(labelCounts)
    .filter(([label, count]) => {
      const vals = Object.keys(labelValues[label]);
      // Skip if 100% of products have identical single value (useless filter)
      if (vals.length === 1 && count >= totalProducts * 0.98) return false;
      // Meaningful facets:
      // Multi-value facets: 2 to 20 options
      // Boolean facets: 1 option with 5% to 95% prevalence
      const isMultiValue = vals.length >= 2 && vals.length <= 20 && count >= Math.min(2, totalProducts * 0.05);
      const isUsefulBoolean = vals.length === 1 && count >= Math.min(2, totalProducts * 0.05) && count <= totalProducts * 0.95;
      return isMultiValue || isUsefulBoolean;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxFacets);

  return sortedLabels.map(([label, count]) => {
    const rawVals = labelValues[label];
    const options = Object.entries(rawVals)
      .map(([value, valCount]) => ({ value, count: valCount }))
      .sort((a, b) => b.count - a.count);
    return {
      label,
      totalCount: count,
      options,
    };
  });
}

/**
 * Accurately matches a product against selected dynamic facet values.
 */
export function matchProductFeature(
  product: ProductItem,
  facetLabel: string,
  selectedValues: string[]
): boolean {
  if (!selectedValues || selectedValues.length === 0) return true;
  const targetLower = facetLabel.trim().toLowerCase();

  return (product.features || []).some((f) => {
    const fLower = f.label.trim().toLowerCase();
    let val = f.value?.trim() || '';
    if (!val || val === '-' || val.toLowerCase() === 'нет') return false;

    // Width handling with same architectural buckets
    if (fLower.includes('ширина') && (targetLower.includes('ширина') || targetLower === 'ширина')) {
      const num = parseFloat(val.replace(',', '.'));
      if (!isNaN(num)) {
        if (num < 37) val = '30 см';
        else if (num < 55) val = '45 см';
        else if (num < 67) val = '60 см';
        else if (num < 77) val = '70–75 см';
        else if (num < 86) val = '80–85 см';
        else val = '90 см и шире';
      }
      return selectedValues.includes(val);
    }

    if (fLower === targetLower) {
      return selectedValues.includes(val);
    }

    return false;
  });
}
