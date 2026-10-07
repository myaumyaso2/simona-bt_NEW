import { ProductItem } from '@/types';

export interface ProductGroupOption {
  id: string;
  name: string;
  count: number;
}

/**
 * Extracts product group from name if not directly populated on product:
 * Formula: [Группа товара] + [Бренд] + [Артикул]
 */
export function getProductGroup(product: ProductItem): string {
  if (product.productGroup && product.productGroup.trim()) {
    return product.productGroup.trim();
  }

  const name = product.name || '';
  const brand = (product.brand || '').trim();

  if (brand) {
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\s+)${escapedBrand}(?:\\s+|$)`, 'i');
    const parts = name.split(regex);
    if (parts.length > 1 && parts[0].trim().length > 0) {
      return parts[0].trim();
    }
  }

  return product.category || 'Техника';
}

/**
 * Computes available product group facets with counts for the current category products.
 */
export function getCategoryProductGroups(products: ProductItem[]): ProductGroupOption[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    const group = getProductGroup(product);
    if (group) {
      counts.set(group, (counts.get(group) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ id: name, name, count }))
    .sort((a, b) => b.count - a.count);
}
