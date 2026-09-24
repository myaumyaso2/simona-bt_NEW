export interface DiscountBadgeInfo {
  text: string;
  variant: 'wine' | 'teal';
  className: string;
}

/**
 * Определение параметров отображения скидочного бейджа на основе правил заказчика:
 * 1. Спеццена (SPECIAL) -> Винный ярлык с процентом скидки (напр. "-15%")
 * 2. Акция производителя (ACTION) -> Бирюзовый ярлык с процентом скидки (напр. "-10%")
 * 3. Обычный товар -> null (без ярлыка)
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
        className: 'bg-simona-wine/25 hover:bg-simona-wine/40 text-white border-simona-wine/50',
      };
    }
    if (product.badge.startsWith('ACTION:')) {
      const text = product.badge.replace('ACTION:', '');
      return {
        text,
        variant: 'teal',
        className: 'bg-simona-teal/20 hover:bg-simona-teal/30 text-simona-teal border-simona-teal/40',
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
        className: 'bg-simona-wine/25 hover:bg-simona-wine/40 text-white border-simona-wine/50',
      };
    }
  }

  return null;
}
