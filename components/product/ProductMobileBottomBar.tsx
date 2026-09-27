'use client';

import React, { useMemo } from 'react';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconCart, SimonaIconHeart } from '@/components/brand/SimonaIcons';
import { getProductO2OInfo } from '@/lib/productO2O';

interface ProductMobileBottomBarProps {
  product: ProductItem;
}

export function ProductMobileBottomBar({ product }: ProductMobileBottomBarProps) {
  const { addToCart, setIsCartOpen, isInWishlist, toggleWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);
  const o2oInfo = useMemo(() => getProductO2OInfo(product), [product]);

  const handleAddToCart = () => {
    addToCart(product, 1, false);
    setIsCartOpen(true);
  };

  const statusLabel = useMemo(() => {
    switch (o2oInfo.physicalStatus) {
      case 'SHOWROOM':
        return '• В экспозиции в салоне';
      case 'LOCAL_STOCK':
        return '• На складе в НН (1–2 дня)';
      case 'REMOTE_STOCK':
        return '• Удаленный склад (3–7 дней)';
      case 'ON_ORDER':
      default:
        return '• Фабричный заказ из Европы';
    }
  }, [o2oInfo.physicalStatus]);

  const statusColor =
    o2oInfo.physicalStatus === 'ON_ORDER'
      ? 'text-[#D7D9DB]'
      : o2oInfo.physicalStatus === 'REMOTE_STOCK'
      ? 'text-simona-teal'
      : 'text-emerald-400';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16191D]/95 backdrop-blur-lg border-t border-[#2B313A] px-4 py-3 flex items-center justify-between shadow-2xl safe-area-bottom">
      {/* Left: Price and In-Stock */}
      <div className="flex flex-col">
        <span className="text-base font-montserrat font-extrabold text-white">
          {formatPrice(product.price)}
        </span>
        <span className={`text-[10px] font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
            inWishlist
              ? 'bg-simona-wine/30 border-simona-wine text-simona-wine'
              : 'bg-[#1E2228] border-[#2B313A] text-[#D7D9DB]'
          }`}
          title="В избранное"
        >
          <SimonaIconHeart
            className={`w-4 h-4 ${inWishlist ? 'text-simona-wine fill-simona-wine' : ''}`}
          />
        </button>

        <button
          onClick={handleAddToCart}
          className="h-10 px-5 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-bold text-xs tracking-wide transition-colors flex items-center gap-2 shadow-md cursor-pointer"
        >
          <SimonaIconCart className="w-3.5 h-3.5" />
          <span>В корзину</span>
        </button>
      </div>
    </div>
  );
}
