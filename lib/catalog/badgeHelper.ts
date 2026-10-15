export interface DiscountBadgeInfo {
  text: string;
  variant: 'wine';
  className: string;
}

/**
 * Единый канонический винный бейдж скидки (DESIGN.md Quiet Luxury Brandbook):
 * 1. Спеццена 1C (SPECIAL) -> Винный ярлык с процентом скидки (напр. "-15%")
 * 2. Акция производителя 1C (ACTION) -> Винный ярлык с процентом скидки (напр. "-8%")
 * 3. Fallback (oldPrice > price) -> Винный ярлык с процентом скидки (напр. "-8%")
 * 4. Обычный товар -> null (без ярлыка)
 */
export function getDiscountBadgeInfo(product: {
  badge?: string | null;
  price: number;
  oldPrice?: number | null;
}): DiscountBadgeInfo | null {
  if (product.badge) {
    if (product.badge.startsWith('SPECIAL:')) {
      const text = product.badge.replace('SPECIAL:', '');
      return {
        text,
        variant: 'wine',
        className: 'bg-[#8A151A]/85 hover:bg-[#8A151A]/95 text-white border border-[#A81C22]/60 shadow-md',
      };
    }
    if (product.badge.startsWith('ACTION:')) {
      const text = product.badge.replace('ACTION:', '');
      return {
        text,
        variant: 'wine',
        className: 'bg-[#8A151A]/85 hover:bg-[#8A151A]/95 text-white border border-[#A81C22]/60 shadow-md',
      };
    }
  }

  // Fallback для товаров со старой ценой без префикса
  if (product.oldPrice && product.oldPrice > product.price) {
    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    if (discount > 0) {
      return {
        text: `-${discount}%`,
        variant: 'wine',
        className: 'bg-[#8A151A]/85 hover:bg-[#8A151A]/95 text-white border border-[#A81C22]/60 shadow-md',
      };
    }
  }

  return null;
}
