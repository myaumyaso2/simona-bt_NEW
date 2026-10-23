import { CATALOG_CATEGORIES, CatalogCategory } from '@/data/catalogCategories';

export interface ProductHierarchyInfo {
  globalCategory: string;
  subcategory: string;
}

const SECTION_PRIORITY: Record<string, number> = {
  'Встраиваемая техника': 1,
  'Крупная бытовая техника': 2,
  'Малая бытовая техника': 3,
  'Мойки и смесители': 4,
  'Климатическая техника': 5,
  'Бокалы и посуда': 6,
  'Средства по уходу за техникой': 7,
  'Аксессуары для бытовой техники': 8,
  'Прочая техника и аксессуары': 9,
};

export function getSectionPriority(section: string): number {
  return SECTION_PRIORITY[section] || 99;
}

export function resolveProductHierarchy(product: {
  category?: string | null;
  productGroup?: string | null;
  name?: string | null;
}): ProductHierarchyInfo {
  const cat = (product.category || '').trim();
  const group = (product.productGroup || '').trim();
  const name = (product.name || '').trim();

  // 1. Direct match by exact category in CATALOG_CATEGORIES
  if (cat) {
    const direct = CATALOG_CATEGORIES.find(
      (c: CatalogCategory) =>
        c.dbCategories.some((db: string) => db.toLowerCase() === cat.toLowerCase()) ||
        c.title.toLowerCase() === cat.toLowerCase() ||
        c.menuTitle.toLowerCase() === cat.toLowerCase()
    );
    if (direct) {
      return {
        globalCategory: direct.sectionTitle,
        subcategory: direct.menuTitle || direct.title,
      };
    }
  }

  // 2. Direct match by productGroup in CATALOG_CATEGORIES
  if (group) {
    const groupMatch = CATALOG_CATEGORIES.find(
      (c: CatalogCategory) =>
        c.dbCategories.some((db: string) => db.toLowerCase() === group.toLowerCase()) ||
        c.title.toLowerCase() === group.toLowerCase() ||
        c.menuTitle.toLowerCase() === group.toLowerCase()
    );
    if (groupMatch) {
      return {
        globalCategory: groupMatch.sectionTitle,
        subcategory: groupMatch.menuTitle || groupMatch.title,
      };
    }
  }

  // 3. Normalized semantic fallback based on Russian appliance taxonomy
  const searchStr = `${cat} ${group} ${name}`.toLowerCase();

  // Sinks & Mixers
  if (
    searchStr.includes('мойк') ||
    searchStr.includes('смесител') ||
    searchStr.includes('дозатор') ||
    searchStr.includes('измельчител') ||
    searchStr.includes('сифон') ||
    searchStr.includes('колландер')
  ) {
    let sub = cat || group || 'Мойки и смесители';
    if (searchStr.includes('мойк')) sub = 'Мойки для кухни';
    else if (searchStr.includes('смесител')) sub = 'Смесители для кухни';
    else if (searchStr.includes('измельчител')) sub = 'Измельчители пищевых отходов';
    else if (searchStr.includes('дозатор')) sub = 'Врезные дозаторы';
    return { globalCategory: 'Мойки и смесители', subcategory: sub };
  }

  // Built-in appliances
  if (
    searchStr.includes('встраиваем') ||
    searchStr.includes('варочн') ||
    searchStr.includes('духов') ||
    searchStr.includes('вытяжк') ||
    searchStr.includes('подогреват') ||
    searchStr.includes('вакууматор')
  ) {
    let sub = cat || group || 'Встраиваемая техника';
    if (searchStr.includes('варочн')) sub = 'Варочные панели';
    else if (searchStr.includes('духов')) sub = 'Духовые шкафы';
    else if (searchStr.includes('вытяжк')) sub = 'Кухонные вытяжки';
    else if (searchStr.includes('посудомоечн')) sub = 'Встраиваемые посудомоечные машины';
    else if (searchStr.includes('холодильн')) sub = 'Встраиваемые холодильники';
    else if (searchStr.includes('подогреват')) sub = 'Подогреватели посуды';
    else if (searchStr.includes('вакууматор')) sub = 'Встраиваемые вакууматоры';
    else if (searchStr.includes('микроволн') || searchStr.includes('свч')) sub = 'Встраиваемые микроволновые печи';
    else if (searchStr.includes('кофемаш')) sub = 'Встраиваемые кофемашины';
    else if (searchStr.includes('винн')) sub = 'Встраиваемые винные шкафы';
    return { globalCategory: 'Встраиваемая техника', subcategory: sub };
  }

  // Large Freestanding Appliances
  if (
    searchStr.includes('стиральн') ||
    searchStr.includes('сушильн') ||
    searchStr.includes('холодильн') ||
    searchStr.includes('морозильн') ||
    searchStr.includes('плит') ||
    searchStr.includes('винн')
  ) {
    let sub = cat || group || 'Крупная бытовая техника';
    if (searchStr.includes('стиральн')) sub = 'Стиральные машины';
    else if (searchStr.includes('сушильн')) sub = 'Сушильные машины';
    else if (searchStr.includes('холодильн') || searchStr.includes('морозильн')) sub = 'Отдельностоящие холодильники';
    else if (searchStr.includes('плит')) sub = 'Кухонные плиты';
    else if (searchStr.includes('винн')) sub = 'Винные шкафы';
    return { globalCategory: 'Крупная бытовая техника', subcategory: sub };
  }

  // Small Domestic Appliances
  if (
    searchStr.includes('пылесос') ||
    searchStr.includes('чайник') ||
    searchStr.includes('тостер') ||
    searchStr.includes('блендер') ||
    searchStr.includes('миксер') ||
    searchStr.includes('кофеварк') ||
    searchStr.includes('кофемаш') ||
    searchStr.includes('утюг') ||
    searchStr.includes('гладильн') ||
    searchStr.includes('гриль') ||
    searchStr.includes('комбайн') ||
    searchStr.includes('термопот') ||
    searchStr.includes('сушилк для продукт')
  ) {
    let sub = cat || group || 'Малая бытовая техника';
    if (searchStr.includes('пылесос')) sub = 'Пылесосы';
    else if (searchStr.includes('чайник')) sub = 'Электрические чайники';
    else if (searchStr.includes('тостер')) sub = 'Тостеры';
    else if (searchStr.includes('блендер')) sub = 'Блендеры';
    else if (searchStr.includes('кофе')) sub = 'Кофемашины и кофеварки';
    else if (searchStr.includes('гриль')) sub = 'Электрогрили';
    else if (searchStr.includes('гладильн') || searchStr.includes('утюг')) sub = 'Уход за одеждой';
    return { globalCategory: 'Малая бытовая техника', subcategory: sub };
  }

  // Care and detergents
  if (
    searchStr.includes('уход') ||
    searchStr.includes('чистк') ||
    searchStr.includes('накип') ||
    searchStr.includes('стирк') ||
    searchStr.includes('ароматизатор') ||
    searchStr.includes('моющее')
  ) {
    return {
      globalCategory: 'Средства по уходу за техникой',
      subcategory: cat || group || 'Чистящие средства и уход',
    };
  }

  // Tableware
  if (searchStr.includes('бокал') || searchStr.includes('посуд') || searchStr.includes('нож')) {
    return {
      globalCategory: 'Бокалы и посуда',
      subcategory: cat || group || 'Кухонная посуда',
    };
  }

  // Accessories
  if (searchStr.includes('для ') || searchStr.includes('аксессуар') || searchStr.includes('фильтр')) {
    return {
      globalCategory: 'Аксессуары для бытовой техники',
      subcategory: cat || group || 'Аксессуары',
    };
  }

  return {
    globalCategory: 'Прочая техника и аксессуары',
    subcategory: cat || group || 'Разное',
  };
}
