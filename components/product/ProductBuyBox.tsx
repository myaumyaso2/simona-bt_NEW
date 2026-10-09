'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { extractKeySpecs } from '@/lib/productFeatures';
import { useStore } from '@/components/providers/StoreContext';
import { ArrowRight } from 'lucide-react';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
  SimonaIconDelivery,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconStar,
  SimonaIconCheck,
  SimonaIconTag,
} from '@/components/brand/SimonaIcons';
import { getPromosForProduct, getPromosForCategory } from '@/data/promosData';
import { getDiscountBadgeInfo } from '@/lib/catalog/badgeHelper';
import { formatBrandName } from '@/lib/formatters';
import { getProductO2OInfo } from '@/lib/productO2O';
import { formatProductName } from '@/lib/catalog/productTitle';

interface ProductBuyBoxProps {
  product: ProductItem;
  onOpenOneClickBuy: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export function ProductBuyBox({
  product,
  onOpenOneClickBuy,
  onNavigateToTab,
}: ProductBuyBoxProps) {
  const {
    addToCart,
    setIsCartOpen,
    isInCart,
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
    openModal,
  } = useStore();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const [selectedColorId, setSelectedColorId] = useState(
    product.colors?.[0]?.id || ''
  );
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const brandFormatted = formatBrandName(product.brand);
  const formattedTitle = formatProductName(product);
  const o2oInfo = useMemo(() => getProductO2OInfo(product), [product]);

  const productPromos = getPromosForProduct(product);
  const activePromo = productPromos[0];
  const categoryPromos = getPromosForCategory(product.category);
  // Show category promo only if it relates to the same brand to prevent showing competitor promos
  const categoryPromo = !activePromo
    ? categoryPromos.find(
        (p) => p.brand.toLowerCase() === (product.brand || '').toLowerCase()
      ) || null
    : null;

  const hasMultipleColors = Boolean(product.colors && product.colors.length > 1);
  const colors = product.colors || [];
  const selectedColor = colors.find((c) => c.id === selectedColorId) || colors[0];

  const keySpecs = useMemo(() => extractKeySpecs(product), [product]);

  const handleAddToCart = () => {
    addToCart(product, 1, false);
    setIsAddedAnimation(true);
    setTimeout(() => {
      setIsAddedAnimation(false);
      setIsCartOpen(true);
    }, 400);
  };

  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  const hasRealReviews = Boolean(product.reviews && product.reviews.length > 0);
  const reviewCount = product.reviews?.length || 0;
  const averageRating = product.rating || 5.0;

  return (
    <div className="w-full bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-xl">
      {/* 1. Brand Tag & SKU (Anti-Caps compliant) */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-semibold tracking-wider text-white">
          {brandFormatted}
        </div>
        <span className="font-mono text-xs text-[#87888A]">
          Код товара: {product.sku}
        </span>
      </div>

      {/* 2. Title & Verified Rating / Expertise */}
      <div>
        <h1 className="text-xl sm:text-2xl font-montserrat font-bold text-white leading-tight tracking-tight">
          {formattedTitle}
        </h1>

        {(hasRealReviews || Boolean(product.expertVerdict)) && (
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-[#87888A]">
            {hasRealReviews && (
              <>
                <div className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                  <SimonaIconStar className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span>{averageRating.toFixed(1)} / 5.0</span>
                </div>
                <span>•</span>
                <button
                  onClick={() => onNavigateToTab('reviews')}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  {reviewCount} {reviewCount === 1 ? 'отзыв владельца' : 'отзывов владельцев'}
                </button>
              </>
            )}
            {hasRealReviews && Boolean(product.expertVerdict) && <span>•</span>}
            {Boolean(product.expertVerdict) && (
              <button
                onClick={() => onNavigateToTab('about')}
                className="text-simona-teal hover:text-simona-teal-light transition-colors font-medium cursor-pointer"
              >
                Экспертная оценка СИМОНА
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Color / Finish Selection (Rendered ONLY if genuine variations exist) */}
      {hasMultipleColors && selectedColor && (
        <div className="pt-2 border-t border-[#2B313A]/60">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="text-[#87888A]">Цвет фасада:</span>
            <span className="text-white font-medium">{selectedColor.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {colors.map((color) => {
              const isSelected = color.id === selectedColorId;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)}
                  title={color.name}
                  className={`w-7 h-7 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-simona-teal ring-offset-2 ring-offset-[#16191D] scale-110'
                      : 'border border-[#2B313A] hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.colorHex }}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Key Specs Grid (2x2 aligned, no floating dot clutter) */}
      {keySpecs.length > 0 && (
        <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-3.5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
          {keySpecs.map((spec, idx) => (
            <div key={idx} className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-[#87888A] shrink-0">{spec.label}:</span>
              <span className="font-semibold text-white truncate">{spec.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4.1. Official Dealer, Warranty & Certification Benefits */}
      <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-white font-medium">
          <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
          <span>Официальный дилер {brandFormatted}</span>
        </div>
        <div className="flex items-center gap-2 text-white font-medium">
          <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
          <span>Официальная заводская гарантия</span>
        </div>
        <div className="flex items-center gap-2 text-white font-medium">
          <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
          <span>Прибор сертифицирован для эксплуатации в РФ</span>
        </div>
      </div>

      {/* 5. Price Box */}
      <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[#87888A] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(() => {
              const discountBadge = getDiscountBadgeInfo(product);
              if (discountBadge) {
                return (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${discountBadge.className}`}
                  >
                    {discountBadge.text}
                  </span>
                );
              }
              return null;
            })()}

            {savings > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-simona-wine text-white shadow-sm">
                Выгода {formatPrice(savings)}
              </span>
            )}
          </div>
        </div>

        {/* Best Price Guarantee trigger */}
        <div className="pt-2 border-t border-[#2B313A]/50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => openModal('PRICE_MATCH', { product })}
            className="inline-flex items-center gap-1.5 text-xs text-[#87888A] hover:text-white transition-colors cursor-pointer group"
          >
            <SimonaIconTag className="w-3.5 h-3.5 text-simona-teal group-hover:scale-110 transition-transform" />
            <span className="underline decoration-[#2B313A] group-hover:decoration-simona-teal underline-offset-4">
              Нашли дешевле? Снизим цену!
            </span>
          </button>
          <span className="text-[11px] text-[#87888A]">Гарантия лучшей цены</span>
        </div>
      </div>

      {/* 5.1. Accent Wine Manufacturer Promo Modules */}
      {productPromos.length > 0 ? (
        <div className="space-y-3">
          {productPromos.map((promo) => (
            <div
              key={promo.id}
              className="rounded-xl border border-simona-wine/60 bg-simona-wine/10 p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-lg relative overflow-hidden transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-simona-wine/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-simona-wine/25 text-white shadow-sm border border-simona-wine/50 backdrop-blur-md">
                  <span>
                    {promo.discountBadge || promo.badgeText} ({formatBrandName(promo.brand)})
                  </span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-simona-wine-light font-medium">
                  <SimonaIconClock className="w-3 h-3 shrink-0" />
                  <span>до {promo.endDate}</span>
                </div>
              </div>

              <div className="text-sm font-montserrat font-bold text-white leading-snug">
                {promo.title}
              </div>

              <p className="text-xs text-[#D7D9DB] leading-relaxed line-clamp-2">
                {promo.shortDescription}
              </p>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openModal('PROMO_TERMS', { promoData: promo })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-simona-wine-light transition-colors group cursor-pointer"
                >
                  <span className="underline decoration-simona-wine/60 underline-offset-4">
                    Подробнее об акции и подарках
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-simona-wine-light group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : categoryPromo ? (
        <div className="rounded-xl border border-simona-wine/30 bg-simona-wine/5 p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-[#D7D9DB]">
            <span className="w-1.5 h-1.5 rounded-full bg-simona-wine shrink-0" />
            <span>
              Для бренда <strong className="text-white font-semibold">{brandFormatted}</strong> действует акция:{' '}
              <strong className="text-simona-wine-light">
                {categoryPromo.badgeText}
              </strong>
            </span>
          </div>
          <Link
            href={`/catalog?promo=${encodeURIComponent(categoryPromo.slug)}`}
            className="inline-flex items-center gap-1 text-simona-wine-light hover:text-white font-semibold whitespace-nowrap transition-colors group shrink-0"
          >
            <span>Смотреть условия</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : null}

      {/* 6. Action Row: Buy/Cart + Wishlist + Compare + 1-Click Buy */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          {/* Main Cart / Buy Button */}
          {inCart ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 h-12 px-4 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.01] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>В корзину</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`flex-1 h-12 px-4 rounded-xl text-white text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md ${
                isAddedAnimation
                  ? 'bg-simona-teal scale-[0.98]'
                  : 'bg-[#16191D] hover:bg-[#1E2228] border border-simona-teal shadow-simona-teal/10 hover:shadow-simona-teal/20 hover:scale-[1.01] active:scale-98'
              }`}
            >
              {isAddedAnimation ? (
                <>
                  <SimonaIconCheck className="w-4 h-4 mr-2 text-white" />
                  <span>Добавлено</span>
                </>
              ) : (
                <>
                  <SimonaIconCart className="w-4 h-4 mr-2 flex-shrink-0 text-simona-teal" />
                  <span>Купить</span>
                </>
              )}
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
            title={inWishlist ? 'В избранном' : 'В избранное'}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
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
            aria-label={inCompare ? 'Удалить из сравнения' : 'Добавить к сравнению'}
            title={inCompare ? 'В сравнении' : 'В сравнение'}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
              inCompare
                ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
            }`}
          >
            <SimonaIconCompare className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary CTA: 1-Click Buy */}
        <button
          onClick={onOpenOneClickBuy}
          className="w-full h-11 rounded-xl bg-transparent hover:bg-white/5 border border-[#2B313A] hover:border-white/30 text-white font-medium text-xs tracking-wider transition-all duration-200 cursor-pointer"
        >
          Купить в 1 клик
        </button>
      </div>

      {/* 7. Integrated Service Standards & Logistics Block (Double-Bezel 01 / 02 / 03) */}
      <div className="pt-4 border-t border-[#2B313A] flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#87888A] tracking-wider">
          <span>Сервисный стандарт СИМОНА</span>
          <span className="text-simona-teal font-medium">30+ лет на рынке</span>
        </div>

        <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-3.5 flex flex-col gap-3 text-xs shadow-md">
          {/* 01 Бесплатное бережное хранение на складе */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#2B313A]/60">
            <span className="font-montserrat font-bold text-xs text-simona-teal shrink-0 mt-0.5">
              01
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold flex items-center justify-between gap-1">
                <span>Бесплатное бережное хранение</span>
                <span className="text-[10px] text-simona-teal bg-simona-teal/10 px-1.5 py-0.5 rounded border border-simona-teal/20 font-medium">
                  0 ₽
                </span>
              </div>
              <p className="text-[#87888A] text-[11px] leading-relaxed mt-0.5 font-normal">
                Резервируйте технику по фиксированной цене на теплом складе до окончания ремонта кухни
              </p>
            </div>
          </div>

          {/* 02 Профессиональная установка и подключение */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#2B313A]/60">
            <span className="font-montserrat font-bold text-xs text-simona-teal shrink-0 mt-0.5">
              02
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold">
                Профессиональная установка и подключение
              </div>
              <p className="text-[#87888A] text-[11px] leading-relaxed mt-0.5 font-normal">
                Монтаж строго по заводским регламентам брендов с сохранением полной гарантии
              </p>
            </div>
          </div>

          {/* 03 Аккуратная доставка и самовывоз */}
          <div className="flex items-start gap-2.5">
            <span className="font-montserrat font-bold text-xs text-simona-teal shrink-0 mt-0.5">
              03
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="text-white font-semibold">
                Аккуратная доставка собственной службой
              </div>

              {/* Delivery Details */}
              <div className="flex items-start gap-2 text-[#D7D9DB] text-[11px] bg-[#16191D] p-2 rounded-lg border border-[#2B313A]/70">
                <SimonaIconDelivery className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#87888A]">Доставка по Нижнему Новгороду: </span>
                  <span className="text-white font-medium">{o2oInfo.deliveryText.time}</span>
                  <span className="text-[#87888A]"> — {o2oInfo.deliveryText.details}</span>
                </div>
              </div>

              {/* Pickup Details (Unified Brand Teal) */}
              <div className="flex items-start gap-2 text-[#D7D9DB] text-[11px] bg-[#16191D] p-2 rounded-lg border border-[#2B313A]/70">
                <SimonaIconPin className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#87888A]">Самовывоз: </span>
                  <span className="text-white font-medium">{o2oInfo.pickupText.time}</span>
                  <span className="text-[#87888A]"> — {o2oInfo.pickupText.location}</span>
                </div>
              </div>

              {/* Showroom Consultation Link */}
              <div className="flex items-start gap-2 text-[11px] pt-0.5">
                <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                <div className="text-[#87888A]">
                  <span>Консультация: {o2oInfo.consultationText} — </span>
                  <button
                    type="button"
                    onClick={() =>
                      openModal('SHOWROOM_VISIT', {
                        product,
                        preferredShowroom: o2oInfo.showroomId,
                      })
                    }
                    className="text-simona-teal hover:text-simona-teal-light underline font-medium cursor-pointer"
                  >
                    Записаться на показ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
