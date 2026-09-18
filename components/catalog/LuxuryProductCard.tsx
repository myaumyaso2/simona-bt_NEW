'use client';

import React from 'react';
import Link from 'next/link';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
  SimonaIconPercent,
} from '@/components/brand/SimonaIcons';

interface LuxuryProductCardProps {
  product: ProductItem;
}

export function LuxuryProductCard({ product }: LuxuryProductCardProps) {
  const {
    addToCart,
    setIsCartOpen,
    isInCart,
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
  } = useStore();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.imagesJson === 'string'
    ? JSON.parse(product.imagesJson || '[]')
    : [];

  const mainImage =
    images[0] ||
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="group rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 p-4 transition-all duration-300 shadow-xl flex flex-col justify-between">
      <div>
        {/* Top Media Area */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative aspect-[4/3] bg-[#1E2228] rounded-xl overflow-hidden flex items-center justify-center border border-[#2B313A]/50"
        >
          {/* Badges Stack (Top-Left): Availability Status + Brand Tag */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5 max-w-[85%]">
            {product.physicalStatus === 'SHOWROOM' ||
            product.physicalStatus === 'ACTIVE_KITCHEN' ||
            product.physicalStatus === 'EXHIBITION_15' ||
            product.physicalStatus === 'EXHIBITION_11' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
                На витрине
              </span>
            ) : product.physicalStatus === 'LOCAL_STOCK' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
                На складе
              </span>
            ) : product.physicalStatus === 'REMOTE_STOCK' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
                На удаленном складе
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-white/10 text-[#D7D9DB] border border-white/15 backdrop-blur-md shadow-sm">
                Под заказ
              </span>
            )}

            {/* Brand Tag directly below status badge */}
            <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white border border-white/10 shadow-sm">
              {product.brand}
            </span>
          </div>

          {/* Wine Promo Badge (Top-Right) per AGENTS.md 8.2 */}
          {product.oldPrice && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-wine text-white border border-simona-wine-light/50 backdrop-blur-md shadow-sm">
                <SimonaIconPercent className="w-3 h-3 text-white" />
                <span>АКЦИЯ</span>
              </span>
            </div>
          )}

          {/* Product Image */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Content Area */}
        <div className="mt-3.5">
          {/* Category & SKU */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#87888A] mb-1.5 font-medium">
            <span className="truncate">{product.category}</span>
            <span className="font-mono text-[#D7D9DB] shrink-0 font-medium">
              Арт: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-[15px] font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Specs Row */}
          {product.shortDesc && (
            <p className="mt-1.5 text-xs text-[#87888A] font-normal line-clamp-1">
              {product.shortDesc}
            </p>
          )}
        </div>
      </div>

      {/* Price & Smart CTA Actions */}
      <div className="mt-4 pt-3.5 border-t border-[#2B313A]">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline">
            <span className="text-lg font-montserrat font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-xs text-[#87888A] line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Row: [Купить / В корзину] (flex-1) + [В избранное] + [В сравнение] */}
        <div className="flex items-center gap-2 mt-3">
          {/* Main Cart / Buy Button */}
          {inCart ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 h-10 px-3.5 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>В корзину</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1, false)}
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#16191D] hover:bg-[#1E2228] border border-simona-teal text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/10 hover:shadow-simona-teal/20 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-simona-teal" />
              <span>Купить</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
            title={inWishlist ? 'В избранном' : 'В избранное'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
              inWishlist
                ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
            }`}
          >
            <SimonaIconHeart className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          <button
            onClick={() => toggleCompare(product.id)}
            aria-label={inCompare ? 'Удалить из сравнения' : 'Добавить в сравнение'}
            title={inCompare ? 'В сравнении' : 'В сравнение'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
              inCompare
                ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
            }`}
          >
            <SimonaIconCompare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
