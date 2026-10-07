'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import { formatPrice, getProductPhysicalStatus } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { getPromosForProduct } from '@/data/promosData';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
} from '@/components/brand/SimonaIcons';
import { getDiscountBadgeInfo } from '@/lib/catalog/badgeHelper';
import { extractKeySpecs } from '@/lib/productFeatures';
import { formatProductName } from '@/lib/catalog/productTitle';

interface LuxuryProductListCardProps {
  product: ProductItem;
  selectedPromos?: string[];
}

interface SpecRow {
  label: string;
  value: string;
}

function getProductSpecs(product: ProductItem): SpecRow[] {
  const keySpecs = extractKeySpecs(product);
  const rows: SpecRow[] = keySpecs.map((s) => ({ label: s.label, value: s.value }));

  // Supplement if less than 4 specs
  if (rows.length < 4 && product.color) {
    rows.push({ label: 'Цвет', value: product.color });
  }
  if (rows.length < 4 && product.dimensions && !rows.some(r => r.label.includes('Габарит') || r.label.includes('Ширин'))) {
    rows.push({ label: 'Габариты', value: product.dimensions });
  }
  if (rows.length < 4 && product.features && product.features.length > 0) {
    for (const f of product.features) {
      if (rows.length >= 4) break;
      const lower = f.label.toLowerCase();
      if (
        !f.value ||
        f.value === '-' ||
        lower.includes('гарант') ||
        lower.includes('код') ||
        lower.includes('арт') ||
        rows.some((r) => r.label.toLowerCase() === lower)
      ) {
        continue;
      }
      rows.push({ label: f.label, value: f.value });
    }
  }

  return rows.slice(0, 4);
}

export function LuxuryProductListCard({ product, selectedPromos }: LuxuryProductListCardProps) {
  const {
    openModal,
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

  // 1. Get all promos matching this product (strictly observing participatingSkus)
  const rawPromos = useMemo(() => getPromosForProduct(product), [product]);

  // 2. Contextual priority: if selectedPromos has items, move selected promo to top
  const productPromos = useMemo(() => {
    if (!selectedPromos || selectedPromos.length === 0) return rawPromos;
    const prioritized: typeof rawPromos = [];
    const others: typeof rawPromos = [];
    rawPromos.forEach((p) => {
      if (selectedPromos.includes(p.slug)) {
        prioritized.push(p);
      } else {
        others.push(p);
      }
    });
    return [...prioritized, ...others];
  }, [rawPromos, selectedPromos]);

  const activePromo = productPromos[0];
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const promoListRef = useRef<HTMLDivElement>(null);

  const handlePopoverWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = promoListRef.current;
    if (!el) return;

    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    const canScrollUp = el.scrollTop > 2;

    if ((isScrollingDown && canScrollDown) || (isScrollingUp && canScrollUp)) {
      e.stopPropagation();
      if (e.target !== el && !el.contains(e.target as Node)) {
        el.scrollTop += e.deltaY;
      }
    }
  };

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.imagesJson === 'string'
    ? JSON.parse(product.imagesJson || '[]')
    : [];

  const mainImage =
    images[0] ||
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80';

  const specs = getProductSpecs(product);
  const physicalStatus = getProductPhysicalStatus(product);

  const discountBadge = getDiscountBadgeInfo(product);
  const hasPromos = productPromos.length > 0;
  const showTopRightBadges = Boolean(hasPromos || discountBadge);
  const formattedTitle = formatProductName(product);

  const getPluralPromos = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) return `${count} акция`;
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} акции`;
    return `${count} акций`;
  };

  const promoBadgeText = productPromos.length > 1
    ? getPluralPromos(productPromos.length)
    : 'Акция';

  return (
    <div className={`group rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 p-4 sm:p-5 transition-all duration-300 shadow-xl flex flex-col sm:flex-row gap-5 items-stretch relative ${isTooltipOpen ? 'z-40' : 'z-10'}`}>
      {/* 1. Left Media Area: White Showcase Tablet with object-contain */}
      <div className="relative w-full sm:w-52 sm:h-52 md:w-56 md:h-56 aspect-square shrink-0 rounded-xl">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full rounded-xl overflow-hidden bg-white border border-white/10 group-hover:border-simona-teal/50 transition-colors p-3 flex items-center justify-center shadow-inner"
        >
          {/* Badges Stack (Top-Left): Status + Brand directly below */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5 max-w-[85%]">
            {/* Availability Badge */}
            {physicalStatus === 'SHOWROOM' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
                На витрине
              </span>
            ) : physicalStatus === 'LOCAL_STOCK' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
                На складе
              </span>
            ) : physicalStatus === 'REMOTE_STOCK' ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
                На удаленном складе
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-[#16191D]/85 text-[#D7D9DB] border border-[#2B313A] backdrop-blur-md shadow-md">
                Под заказ
              </span>
            )}

            {/* Brand Tag directly below */}
            <span className="px-2.5 py-0.5 rounded-md bg-[#16191D]/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white border border-[#2B313A] shadow-md">
              {product.brand}
            </span>
          </div>

          {/* Product Image (object-contain ensures zero clipping) */}
          <img
            src={mainImage}
            alt={formattedTitle}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 select-none"
            loading="lazy"
          />
        </Link>

        {/* Top-Right Badges Stack: Promo Badge (above) + Discount Badge (below) */}
        {showTopRightBadges && (
          <div className="absolute top-2.5 right-2.5 z-30 flex flex-col items-end gap-1.5">
            {/* 1. Promo Badge (interactive, triggers multi-promo popover) */}
            {hasPromos && (
              <div
                className="relative"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (productPromos.length === 1 && activePromo) {
                      openModal('PROMO_TERMS', { promoData: activePromo });
                    } else if (productPromos.length > 1) {
                      setIsTooltipOpen((prev) => !prev);
                    }
                  }}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold border backdrop-blur-md shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 bg-[#8A151A]/85 hover:bg-[#8A151A]/95 text-white border-[#A81C22]/60"
                  title={
                    productPromos.length > 1
                      ? `Доступно ${productPromos.length} акций. Нажмите для выбора`
                      : activePromo
                      ? 'Нажмите для подробных условий акции'
                      : 'Акция'
                  }
                >
                  <span>{promoBadgeText}</span>
                </button>

                {/* Interactive Tooltip on Hover / Click (Variant 2) */}
                <AnimatePresence>
                  {isTooltipOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      onWheel={handlePopoverWheel}
                      className="absolute right-0 top-full mt-2 w-[340px] p-3 rounded-xl bg-[#16191D]/95 border border-simona-wine/60 text-white shadow-2xl backdrop-blur-2xl z-50 text-left"
                    >
                      {productPromos.length === 1 && activePromo ? (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openModal('PROMO_TERMS', { promoData: activePromo });
                          }}
                          className="p-1 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-[10.5px] text-simona-wine-light font-semibold mb-1">
                            <span className="px-1.5 py-0.2 rounded bg-simona-wine/30 border border-simona-wine/50 text-[10px]">
                              {activePromo.discountBadge || activePromo.badgeText || activePromo.brand}
                            </span>
                            <span className="text-[10px] text-[#87888A]">до {activePromo.endDate}</span>
                          </div>
                          <div className="text-xs font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors leading-snug mb-1.5 line-clamp-2">
                            {activePromo.title}
                          </div>
                          <p className="text-[11px] text-[#D7D9DB] line-clamp-2 leading-relaxed mb-2 font-normal">
                            {activePromo.shortDescription}
                          </p>
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-simona-teal font-medium">
                            <span>Подробнее об акции</span>
                            <span className="text-white text-xs group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-simona-wine animate-pulse" />
                              <span>Доступные акции:</span>
                              <span className="text-simona-wine-light font-semibold">{productPromos.length}</span>
                            </span>
                            <span className="text-[10px] text-[#87888A]">{product.brand}</span>
                          </div>

                          <div
                            ref={promoListRef}
                            className="space-y-2 max-h-[320px] overflow-y-auto pr-1.5 simona-promo-scrollbar overscroll-y-auto"
                          >
                            {productPromos.map((promo) => {
                              const isFiltered = Boolean(selectedPromos?.includes(promo.slug));
                              return (
                                <div
                                  key={promo.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openModal('PROMO_TERMS', { promoData: promo });
                                  }}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer group text-left ${
                                    isFiltered
                                      ? 'bg-simona-wine/20 border-simona-wine/70 hover:border-simona-wine ring-1 ring-simona-wine/40'
                                      : 'bg-white/[0.03] hover:bg-[#8A151A]/15 border-white/10 hover:border-simona-wine/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[10.5px] mb-1.5 gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                      <span className="px-1.5 py-0.5 rounded bg-simona-wine/40 text-simona-wine-light font-semibold text-[10px] shrink-0">
                                        {promo.discountBadge || promo.badgeText || 'Акция'}
                                      </span>
                                      {isFiltered && (
                                        <span className="px-1.5 py-0.5 rounded bg-simona-teal/20 text-simona-teal text-[9.5px] font-bold border border-simona-teal/40 shrink-0">
                                          Выбрана в фильтре
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-[#87888A] shrink-0 whitespace-nowrap">
                                      до {promo.endDate}
                                    </span>
                                  </div>
                                  <div className="text-xs font-semibold text-white group-hover:text-white leading-snug line-clamp-2 mb-1">
                                    {promo.title}
                                  </div>
                                  <div className="flex items-center justify-between text-[10.5px] text-simona-teal font-medium pt-1 border-t border-white/5">
                                    <span>Условия предложения</span>
                                    <span className="group-hover:translate-x-1 transition-transform text-white text-xs">→</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 2. Discount Badge (informational % badge, positioned below promo badge) */}
            {discountBadge && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold border backdrop-blur-md shadow-md select-none ${discountBadge.className}`}
                title={`Скидка ${discountBadge.text}`}
              >
                {discountBadge.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Middle Content & Specifications Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center gap-2 text-[11px] text-[#87888A] mb-1 font-medium">
            <span>{product.category}</span>
            <span>•</span>
            <span className="font-mono text-[#D7D9DB] font-medium">
              Код товара: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors leading-snug">
              {formattedTitle}
            </h3>
          </Link>

          {/* Dynamic Specifications Table with Dot Leaders */}
          <div className="mt-4 space-y-2.5">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-baseline text-xs">
                <span className="text-[#87888A] shrink-0 font-normal">{item.label}</span>
                <span className="flex-1 mx-2 border-b border-dotted border-[#2B313A] relative -top-0.5" />
                <span className="text-white font-medium shrink-0 font-mono text-[11.5px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Right Financial & Action Area (Compact ~200px) */}
      <div className="w-full sm:w-48 md:w-52 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-[#2B313A] pt-4 sm:pt-0 sm:pl-5">
        <div>
          {/* Price Block */}
          <div className="flex items-baseline flex-wrap gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-montserrat font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#87888A] line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#87888A]">
            Профессиональный монтаж
          </p>

          {/* Accent Wine Benefit row per AGENTS.md 8.2 */}
          {activePromo && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal('PROMO_TERMS', { promoData: activePromo });
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-simona-wine-light hover:text-white transition-colors mt-2 cursor-pointer text-left group/benefit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-simona-wine shrink-0 group-hover/benefit:scale-125 transition-transform" />
              <span className="underline decoration-simona-wine/50 underline-offset-2">
                {activePromo.badgeText} ({activePromo.brand})
              </span>
            </button>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="mt-4 pt-3 border-t border-[#2B313A]/50 flex items-center gap-2">
          {inCart ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 h-10 px-3 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal text-white text-xs font-semibold tracking-wide transition shadow-md shadow-simona-teal/20 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span>В корзине</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1, false)}
              className="flex-1 h-10 px-3 rounded-xl bg-[#1E2228] hover:bg-[#242A32] border border-simona-teal text-white text-xs font-bold tracking-wide transition shadow-sm flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 shrink-0 text-simona-teal" />
              <span>Купить</span>
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
            title={inWishlist ? 'В избранном' : 'В избранное'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
              inWishlist
                ? 'bg-simona-teal text-white border border-simona-teal shadow-md shadow-simona-teal/20'
                : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50'
            }`}
          >
            <SimonaIconHeart className="w-4 h-4" />
          </button>

          {/* Compare */}
          <button
            onClick={() => toggleCompare(product.id)}
            aria-label={inCompare ? 'Удалить из сравнения' : 'Добавить в сравнение'}
            title={inCompare ? 'В сравнении' : 'В сравнение'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer ${
              inCompare
                ? 'bg-simona-teal text-white border border-simona-teal shadow-md shadow-simona-teal/20'
                : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50'
            }`}
          >
            <SimonaIconCompare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
