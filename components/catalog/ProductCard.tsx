'use client';

import React from 'react';
import { FileDown, Calendar, Sparkles, MapPin, Package, Check } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatPrice, PHYSICAL_STATUS_CONFIG } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconCart, SimonaIconChef } from '@/components/brand/SimonaIcons';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openModal } = useStore();
  const statusCfg = PHYSICAL_STATUS_CONFIG[product.physicalStatus] || PHYSICAL_STATUS_CONFIG.ON_ORDER;
  const isEcom = product.categoryType === 'CATEGORY_A';

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.imagesJson === 'string'
    ? JSON.parse(product.imagesJson || '[]')
    : [];

  const mainImage = images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group p-1 rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-teal/50 hover:bg-black/[0.03] transition-all duration-300 shadow-sm flex flex-col justify-between">
      <div className="p-4 sm:p-5 rounded-[calc(1.5rem-4px)] bg-white shadow-sm h-full flex flex-col justify-between border border-black/[0.02]">
        <div>
          {/* Top Media Area */}
          <div className="relative aspect-[4/3] bg-[#F8F9FA] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-black/[0.04]">
            {/* Physical Status Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 max-w-[62%]">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md truncate shadow-sm ${statusCfg.badgeClass}`}>
                {statusCfg.badge}
              </span>
            </div>

            {/* Brand Tag */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-[#16181B] border border-black/[0.08] shadow-sm shrink-0">
                {product.brand}
              </span>
            </div>

            {/* Product Image */}
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Content Area */}
          <div className="mt-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#87888A] mb-1.5 font-medium">
              <span className="truncate">{product.category}</span>
              <span className="font-mono text-[#3E3D40] font-semibold shrink-0">Арт: {product.sku}</span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-bold text-[#16181B] group-hover:text-simona-teal transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="mt-2 text-xs text-[#6E7074] font-normal line-clamp-2 leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="mt-2.5 text-[11px] text-[#87888A] flex items-center">
                <span className="text-[#87888A] mr-1.5">Габариты:</span>
                <span className="text-[#3E3D40] font-mono font-medium">{product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Smart CTA Actions */}
        <div className="mt-5 pt-4 border-t border-black/[0.06]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-montserrat font-bold text-[#16181B]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="ml-2 text-xs text-[#87888A] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                <Check className="w-3 h-3 mr-1" />
                В наличии
              </span>
            ) : (
              <span className="text-[11px] text-[#87888A] font-medium">Под заказ</span>
            )}
          </div>

          {/* SMART CTA BUTTONS BASED ON CATEGORY & PHYSICAL STATUS */}
          {isEcom ? (
            /* Category A: E-Commerce */
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(product)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center col-span-2 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>В корзину</span>
              </button>
            </div>
          ) : product.physicalStatus === 'ACTIVE_KITCHEN' ? (
            /* Category B: Active Kitchen */
            <div className="space-y-2">
              <button
                onClick={() => openModal('TEST_DRIVE', { product })}
                className="w-full py-2.5 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold tracking-wide transition flex items-center justify-center shadow-md shadow-amber-500/15 active:scale-98"
              >
                <SimonaIconChef className="w-3.5 h-3.5 mr-1.5 text-zinc-950" />
                Записаться на тест-драйв
              </button>
              {product.schematicPdfUrl && (
                <a
                  href={product.schematicPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 rounded-full bg-[#F2F3F4] hover:bg-zinc-200/80 text-[#3E3D40] text-[11px] font-semibold transition flex items-center justify-center border border-black/[0.04] active:scale-98"
                >
                  <FileDown className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                  Схема встройки (PDF)
                </a>
              )}
            </div>
          ) : product.physicalStatus === 'EXHIBITION_15' || product.physicalStatus === 'EXHIBITION_11' ? (
            /* Category B: Exhibition Showroom */
            <div className="space-y-2">
              <button
                onClick={() =>
                  openModal('SHOWROOM_VISIT', {
                    product,
                    preferredShowroom:
                      product.physicalStatus === 'EXHIBITION_15' ? 'Белинского, 15' : 'Белинского, 11/66',
                  })
                }
                className="w-full py-2.5 px-4 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold tracking-wide transition flex items-center justify-center active:scale-98 shadow-md shadow-simona-teal/20"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Оценить вживую в салоне
              </button>
              <button
                onClick={() => openModal('PROJECT_MATCHING', { product })}
                className="w-full py-1.5 px-3 rounded-full bg-[#F2F3F4] hover:bg-zinc-200/80 text-[#3E3D40] text-[11px] font-semibold transition flex items-center justify-center border border-black/[0.04] active:scale-98"
              >
                Запросить расчет комплекта
              </button>
            </div>
          ) : (
            /* Category B: On Order (~8000 items) */
            <div className="space-y-2">
              <button
                onClick={() => openModal('QUICK_CONSULT', { product })}
                className="w-full py-2.5 px-4 rounded-full bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition flex items-center justify-center shadow-sm active:scale-98"
              >
                <Package className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                Консультация эксперта
              </button>
              <button
                onClick={() => openModal('PROJECT_MATCHING', { product })}
                className="w-full py-1.5 px-3 rounded-full bg-[#F2F3F4] hover:bg-zinc-200/80 text-[#3E3D40] text-[11px] font-medium transition flex items-center justify-center border border-black/[0.04] active:scale-98"
              >
                Спецификация и сроки
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
