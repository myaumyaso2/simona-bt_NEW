import { ProductItem } from '@/types';

/**
 * Universal classifier for outlet / discounted products
 * Strictly matches DISCOUNT products: isDiscount && !isSpecial, or category/URL marker.
 * Showroom products (isDiscount && isSpecial) are treated as SHOWROOM, not outlet!
 */
export function isProductOutlet(product: {
  category?: string | null;
  isDiscount?: boolean | null;
  isSpecial?: boolean | null;
  physicalStatus?: string | null;
  oldUrl?: string | null;
  name?: string | null;
}): boolean {
  if (product.physicalStatus === 'DISCOUNT') return true;
  if (product.physicalStatus === 'SHOWROOM') return false;
  if (Boolean(product.isDiscount) && !Boolean(product.isSpecial)) return true;
  if (Boolean(product.isDiscount) && Boolean(product.isSpecial)) return false;
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('уцен')) return true;
  const url = (product.oldUrl || '').toLowerCase();
  if (url.includes('ucen')) return true;
  return false;
}

/**
 * Universal classifier for showroom / exhibition products
 * Matches SHOWROOM products: isDiscount && isSpecial, or physicalStatus SHOWROOM.
 */
export function isProductShowroom(product: {
  physicalStatus?: string | null;
  isDiscount?: boolean | null;
  isSpecial?: boolean | null;
  stockBelinskogo15?: number | null;
}): boolean {
  if (
    product.physicalStatus === 'SHOWROOM' ||
    product.physicalStatus === 'ACTIVE_KITCHEN' ||
    product.physicalStatus === 'EXHIBITION_15' ||
    product.physicalStatus === 'EXHIBITION_11'
  ) {
    return true;
  }
  if (Boolean(product.isDiscount) && Boolean(product.isSpecial)) return true;
  if (product.stockBelinskogo15 !== undefined && product.stockBelinskogo15 !== null && product.stockBelinskogo15 > 0) {
    return true;
  }
  return false;
}

/**
 * Maps an outlet product to its canonical CatalogCategory slug
 * using standard product title conventions (e.g. "Электрический духовой шкаф BOSCH..." -> "vstraivaemye-duhovye-shkafy")
 */
export function getOutletCategorySlug(product: {
  name?: string | null;
  productGroup?: string | null;
  category?: string | null;
}): string | null {
  const name = (product.name || '').toLowerCase();
  const group = (product.productGroup || '').toLowerCase();
  const str = `${name} ${group}`;

  if (/духов|духовк/i.test(str)) return 'vstraivaemye-duhovye-shkafy';
  if (/варочн/i.test(str)) return 'varochnye-paneli';
  if (/вытяжк/i.test(str)) return 'vytyazhki';
  if (/посудомоеч/i.test(str)) return 'posudomoechnye-mashiny';
  if (/стиральн/i.test(str)) return 'stiralnye-mashiny';
  if (/сушильн/i.test(str)) return 'sushilnye-mashiny';
  if (/холодильн|морозильн/i.test(str)) return 'holodilniki';
  if (/микроволн|свч/i.test(str)) return 'mikrovolnovye-pechi';
  if (/кофемашин/i.test(str)) return 'kofemashiny';
  if (/чайник/i.test(str)) return 'chajniki';
  if (/тостер/i.test(str)) return 'tostery';
  if (/блендер/i.test(str)) return 'blendery';
  if (/миксер/i.test(str)) return 'miksery';
  if (/соковыжималк/i.test(str)) return 'sokovyzhimalki';
  if (/робот.*окон|мойк.*окон/i.test(str)) return 'roboty-dlya-mojki-okon';
  if (/мойк/i.test(str)) return 'mojki-dlya-kuhni';
  if (/смесител/i.test(str)) return 'smesiteli-dlya-kuhni';
  if (/пароварк/i.test(str)) return 'parovarki';
  if (/подогреват/i.test(str)) return 'podogrevateli-posudy';
  if (/измельчител/i.test(str)) return 'izmelchiteli-pishchevyh-othodov';

  return null;
}

/**
 * Checks if an outlet product matches a specific catalog category slug
 */
export function isProductInOutletCategory(
  product: {
    name?: string | null;
    productGroup?: string | null;
    category?: string | null;
    isDiscount?: boolean | null;
    oldUrl?: string | null;
  },
  categorySlug: string
): boolean {
  if (!isProductOutlet(product)) return false;
  return getOutletCategorySlug(product) === categorySlug;
}

/**
 * Extracts a human-friendly appliance group for outlet products
 * to display in the sidebar "Тип прибора" filter when browsing multi-category outlet goods.
 */
export function getOutletApplianceGroup(product: {
  name?: string | null;
  productGroup?: string | null;
  brand?: string | null;
}): string {
  if (product.productGroup && product.productGroup.trim()) {
    return product.productGroup.trim();
  }
  const name = product.name || '';
  const brand = product.brand || '';
  if (brand && name.includes(brand)) {
    const prefix = name.split(brand)[0].trim();
    if (prefix) return prefix;
  }
  const slug = getOutletCategorySlug(product);
  if (slug === 'vstraivaemye-duhovye-shkafy') return 'Духовой шкаф';
  if (slug === 'varochnye-paneli') return 'Варочная панель';
  if (slug === 'vytyazhki') return 'Вытяжка';
  if (slug === 'posudomoechnye-mashiny') return 'Посудомоечная машина';
  if (slug === 'stiralnye-mashiny') return 'Стиральная машина';
  if (slug === 'sushilnye-mashiny') return 'Сушильная машина';
  if (slug === 'holodilniki') return 'Холодильник';
  if (slug === 'mikrovolnovye-pechi') return 'Микроволновая печь';
  if (slug === 'kofemashiny') return 'Кофемашина';
  if (slug === 'chajniki') return 'Чайник';
  if (slug === 'tostery') return 'Тостер';
  if (slug === 'blendery') return 'Блендер';
  if (slug === 'miksery') return 'Миксер';
  if (slug === 'sokovyzhimalki') return 'Соковыжималка';
  if (slug === 'mojki-dlya-kuhni') return 'Кухонная мойка';
  if (slug === 'smesiteli-dlya-kuhni') return 'Смеситель';
  if (slug === 'izmelchiteli-pishchevyh-othodov') return 'Измельчитель отходов';

  return 'Другая техника';
}
