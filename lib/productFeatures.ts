import { ProductFeature, ProductItem } from '@/types';

export interface GroupedFeature {
  groupName: string;
  items: { label: string; value: string }[];
}

/**
 * Intelligent grouping of raw flat product specifications into 4 Quiet Luxury semantic sections:
 * 1. Основные параметры (Brand, Country, Warranty, Color, Main Type, Capacity)
 * 2. Габариты и монтаж (Height, Width, Depth, Weight, Installation, Power, Niche)
 * 3. Функции и режимы (Heating modes, Speeds, Burners, Microwave, Steam, Programs)
 * 4. Комфорт, уход и безопасность (Cleaning, Noise, Child lock, Lighting, Door closing)
 */
export function groupProductFeatures(features: ProductFeature[] = []): GroupedFeature[] {
  if (!features || features.length === 0) return [];

  const groups: Record<string, { label: string; value: string }[]> = {
    'Основные параметры': [],
    'Габариты и монтаж': [],
    'Функции и режимы': [],
    'Комфорт, уход и безопасность': [],
    'Дополнительные характеристики': [],
  };

  const dimKeywords = [
    'высота', 'ширина', 'глубина', 'габарит', 'вес', 'монтаж', 'встройк', 
    'ниши', 'размер', 'диаметр', 'длина', 'подключен', 'мощность', 'напряжение', 
    'установка', 'встраиван'
  ];
  const funcKeywords = [
    'режим', 'функци', 'нагрев', 'пар', 'свч', 'гриль', 'конвекц', 'скорост', 
    'производительн', 'конфор', 'индукц', 'таймер', 'температур', 'охлажден', 
    'заморозк', 'отжим', 'программ', 'давлен', 'переключател', 'эллиптическ'
  ];
  const comfortKeywords = [
    'очистк', 'безопасн', 'дет', 'шум', 'освещен', 'фильтр', 'доводчик', 
    'блокировк', 'стекл', 'комплект', 'уход', 'автоотключ', 'самодиагностик',
    'индикатор', 'сенсор'
  ];
  const mainKeywords = [
    'тип', 'цвет', 'страна', 'гарант', 'бренд', 'материал', 'управлен', 
    'объем', 'загрузк', 'энергопотреблен', 'серия', 'линейка', 'стиль',
    'исполнение', 'покрытие'
  ];

  features.forEach((feat) => {
    if (!feat.value || feat.value === '-' || feat.value.trim() === '') return;
    const l = feat.label.toLowerCase();

    if (dimKeywords.some((k) => l.includes(k))) {
      groups['Габариты и монтаж'].push(feat);
    } else if (funcKeywords.some((k) => l.includes(k))) {
      groups['Функции и режимы'].push(feat);
    } else if (comfortKeywords.some((k) => l.includes(k))) {
      groups['Комфорт, уход и безопасность'].push(feat);
    } else if (mainKeywords.some((k) => l.includes(k))) {
      groups['Основные параметры'].push(feat);
    } else {
      groups['Дополнительные характеристики'].push(feat);
    }
  });

  return Object.entries(groups)
    .filter(([_, items]) => items.length > 0)
    .map(([groupName, items]) => ({ groupName, items }));
}

export interface KeySpecBadge {
  label: string;
  value: string;
}

/**
 * Extracts 3-4 key highlight specifications for the ProductBuyBox capsule.
 */
export function extractKeySpecs(product: ProductItem): KeySpecBadge[] {
  const specs: KeySpecBadge[] = [];
  const feats = product.features || [];

  // 1. Dimensions / Width
  const widthFeat = feats.find((f) => f.label.toLowerCase().includes('ширина'));
  if (widthFeat && widthFeat.value) {
    const val = widthFeat.value.includes('см') ? widthFeat.value : `${widthFeat.value} см`;
    specs.push({ label: 'Ширина', value: val });
  } else if (product.dimensions) {
    specs.push({ label: 'Габариты', value: product.dimensions });
  }

  // 2. Capacity / Volume / Performance / Burners / Load
  const capFeat = feats.find((f) => {
    const l = f.label.toLowerCase();
    return (
      l.includes('объем') ||
      l.includes('производительн') ||
      l.includes('всего конфорок') ||
      l.includes('количество чаш') ||
      l.includes('загрузка')
    );
  });
  if (capFeat && capFeat.value) {
    const cleanLabel = capFeat.label.replace(/\s*\(.*\)/, '').trim();
    let val = capFeat.value;
    if (/^\d+(\.\d+)?$/.test(val)) {
      if (cleanLabel.toLowerCase().includes('объем')) val += ' л';
      else if (cleanLabel.toLowerCase().includes('загрузк')) val += ' кг';
      else if (cleanLabel.toLowerCase().includes('производит')) val += ' м³/ч';
    }
    specs.push({ label: cleanLabel, value: val });
  }

  // 3. Key technology / Mode / Cleaning / Material
  const techFeat = feats.find((f) => {
    const l = f.label.toLowerCase();
    return (
      l.includes('очистк') ||
      l.includes('режимы работы') ||
      l.includes('материал') ||
      l.includes('управление') ||
      l.includes('переключател')
    );
  });
  if (techFeat && techFeat.value) {
    const cleanLabel = techFeat.label.replace(/\s*\(.*\)/, '').trim();
    specs.push({ label: cleanLabel, value: techFeat.value });
  }

  // 4. Country of origin or Warranty
  const countryFeat = feats.find((f) => f.label.toLowerCase().includes('страна'));
  if (countryFeat && countryFeat.value && specs.length < 4) {
    specs.push({ label: 'Страна', value: countryFeat.value });
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

/**
 * Computes top dynamic filter facets for the current product selection in catalog.
 */
export function getCategoryFacets(products: ProductItem[], maxFacets = 5): CategoryFacet[] {
  if (!products || products.length === 0) return [];

  // Exclude labels that are already handled by primary filters
  const excludeLabels = new Set([
    'бренд', 'цена', 'страна производства', 'гарантия',
    'высота (см)', 'ширина (см)', 'глубина (см)', 'цвет',
    'артикул', 'код', 'модель'
  ]);

  const labelCounts: Record<string, number> = {};
  const labelValues: Record<string, Record<string, number>> = {};

  products.forEach((p) => {
    (p.features || []).forEach((f) => {
      const norm = f.label.trim();
      const lower = norm.toLowerCase();
      if (excludeLabels.has(lower)) return;
      if (!f.value || f.value === '-' || f.value.toLowerCase() === 'нет') return;

      labelCounts[norm] = (labelCounts[norm] || 0) + 1;
      if (!labelValues[norm]) labelValues[norm] = {};
      const val = f.value.trim();
      labelValues[norm][val] = (labelValues[norm][val] || 0) + 1;
    });
  });

  const sortedLabels = Object.entries(labelCounts)
    .filter(([label, count]) => {
      const vals = Object.keys(labelValues[label]);
      // Meaningful facets: at least 2 distinct values, at most 20, covering a decent subset of products
      return vals.length >= 2 && vals.length <= 20 && count >= Math.min(2, products.length * 0.1);
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
