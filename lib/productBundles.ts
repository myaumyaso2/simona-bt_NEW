import { ProductItem } from '@/types';
import { BundleItem, AccessoryItem, MIELE_SUITE_BUNDLE, MIELE_CARE_ACCESSORIES, CATALOG_PRODUCTS } from '@/data/catalogData';
import { formatBrandName } from '@/lib/formatters';

export interface ProductBundleResult {
  hasBundle: boolean;
  bundleTitle: string;
  bundleSubtitle: string;
  brandFormatted: string;
  bundleItems: BundleItem[];
  accessoriesTitle: string;
  accessories: AccessoryItem[];
}

export function getProductBundle(product: ProductItem): ProductBundleResult {
  const brandFormatted = formatBrandName(product.brand);
  const brandLower = (product.brand || '').toLowerCase().trim();

  // If brand is Miele, use curated Miele suite bundle & accessories
  if (brandLower === 'miele') {
    return {
      hasBundle: true,
      bundleTitle: `Соберите дизайнерский комплект Miele в единой отделке`,
      bundleSubtitle: 'Идеальное визуальное совпадение фасадов и бесшовный монтаж. При заказе комплекта действует специальная партнерская выгода.',
      brandFormatted,
      bundleItems: MIELE_SUITE_BUNDLE,
      accessoriesTitle: `Оригинальные аксессуары и средства Miele CareCollection`,
      accessories: MIELE_CARE_ACCESSORIES,
    };
  }

  // For other brands, search catalogData for companion items from the same brand
  const companionProducts = CATALOG_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.brand || '').toLowerCase().trim() === brandLower &&
      p.category !== product.category
  );

  if (companionProducts.length >= 2) {
    const mainItem: BundleItem = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.images?.[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      isMain: true,
    };

    const bundleItems: BundleItem[] = [
      mainItem,
      ...companionProducts.slice(0, 2).map((cp) => ({
        id: cp.id,
        sku: cp.sku,
        name: cp.name,
        category: cp.category,
        price: cp.price,
        imageUrl: cp.images?.[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        isMain: false,
      })),
    ];

    return {
      hasBundle: true,
      bundleTitle: `Дизайнерский комплект ${brandFormatted} в единой эстетике`,
      bundleSubtitle: `Гармоничное сочетание приборов ${brandFormatted} для комплексного оснащения кухни со скидкой 10% на комплект.`,
      brandFormatted,
      bundleItems,
      accessoriesTitle: `Рекомендованные аксессуары и уход ${brandFormatted}`,
      accessories: [],
    };
  }

  // If not enough companion products exist in database for this brand:
  return {
    hasBundle: false,
    bundleTitle: `Авторский подбор комплекта ${brandFormatted}`,
    bundleSubtitle: `Индивидуальная комплектация кухни техникой ${brandFormatted} с выверкой монтажных узлов и защитой спецификации.`,
    brandFormatted,
    bundleItems: [],
    accessoriesTitle: '',
    accessories: [],
  };
}
