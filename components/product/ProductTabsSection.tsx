'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProductItem } from '@/types';
import { groupProductFeatures } from '@/lib/productFeatures';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { Plus, ArrowRight } from 'lucide-react';
import {
  SimonaIconCart,
  SimonaIconDownload,
  SimonaIconPackage,
  SimonaIconFile,
  SimonaIconStar,
  SimonaIconCheck,
  SimonaIconSparkles,
  SimonaIconSearch,
  SimonaIconClock,
  SimonaIconArrowRight,
} from '@/components/brand/SimonaIcons';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { formatBrandName } from '@/lib/formatters';
import { getProductBundle } from '@/lib/productBundles';
import { AccessoryItem } from '@/data/catalogData';
import { getPromosForProduct, getPromosForCategory } from '@/data/promosData';

interface ProductTabsSectionProps {
  product: ProductItem;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export function ProductTabsSection({
  product,
  activeTab,
  onSelectTab,
}: ProductTabsSectionProps) {
  const { addToCart, setIsCartOpen, openModal } = useStore();

  const brandFormatted = formatBrandName(product.brand);
  const bundleResult = useMemo(() => getProductBundle(product), [product]);

  // Bundle selection state
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>(
    bundleResult.bundleItems.map((item) => item.id)
  );

  const toggleBundleItem = (id: string) => {
    setSelectedBundleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const productPromos = useMemo(() => getPromosForProduct(product), [product]);
  const categoryPromos = useMemo(
    () => getPromosForCategory(product.category),
    [product.category]
  );
  const brandCategoryPromo = useMemo(() => {
    if (productPromos.length > 0) return null;
    return (
      categoryPromos.find(
        (p) => p.brand.toLowerCase() === (product.brand || '').toLowerCase()
      ) || null
    );
  }, [productPromos, categoryPromos, product.brand]);

  const allPromosToDisplay = useMemo(() => {
    if (productPromos.length > 0) return productPromos;
    if (brandCategoryPromo) return [brandCategoryPromo];
    return [];
  }, [productPromos, brandCategoryPromo]);

  const [specQuery, setSpecQuery] = useState('');

  const computedSpecGroups = useMemo(() => {
    let baseGroups =
      product.specGroups && product.specGroups.length > 0
        ? product.specGroups
        : groupProductFeatures(product.features || []);

    // Also inject Dimensions & Warranty if not already in features
    if (product.dimensions) {
      const dimGroup = baseGroups.find((g) => g.groupName === 'Габариты и монтаж');
      if (
        dimGroup &&
        !dimGroup.items.some((i) => i.label.toLowerCase().includes('габарит'))
      ) {
        dimGroup.items.unshift({
          label: 'Габариты (ВхШхГ)',
          value: product.dimensions,
        });
      }
    }

    if (!specQuery.trim()) return baseGroups;

    const q = specQuery.toLowerCase().trim();
    return baseGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [product, specQuery]);

  const totalSpecCount = useMemo(() => {
    return computedSpecGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [computedSpecGroups]);

  // Bundle calculations
  const rawTotal = bundleResult.bundleItems
    .filter((item) => selectedBundleIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const hasAllItems =
    bundleResult.bundleItems.length > 0 &&
    selectedBundleIds.length === bundleResult.bundleItems.length;
  const bundleDiscountPercent = hasAllItems ? 0.1 : 0;
  const discountAmount = Math.round(rawTotal * bundleDiscountPercent);
  const finalBundleTotal = rawTotal - discountAmount;

  const handleAddBundleToCart = () => {
    bundleResult.bundleItems
      .filter((item) => selectedBundleIds.includes(item.id))
      .forEach((item) => {
        addToCart(
          {
            id: item.id,
            sku: item.sku,
            name: item.name,
            slug: item.id,
            brand: product.brand,
            category: item.category,
            categoryType: 'CATEGORY_A',
            physicalStatus: 'SHOWROOM',
            price: item.price,
            inStock: true,
            stockCount: 1,
            description: item.name,
            images: [item.imageUrl],
          },
          1,
          false
        );
      });
    setIsCartOpen(true);
  };

  const handleAddAccessory = (acc: AccessoryItem) => {
    addToCart(
      {
        id: acc.id,
        sku: acc.sku,
        name: acc.name,
        slug: acc.id,
        brand: product.brand,
        category: acc.category,
        categoryType: 'CATEGORY_B',
        physicalStatus: 'LOCAL_STOCK',
        price: acc.price,
        inStock: true,
        stockCount: 5,
        description: acc.name,
        images: [acc.imageUrl],
      },
      1,
      false
    );
    setIsCartOpen(true);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* ========================================================================= */}
      {/* TAB 1: О ПРИБОРЕ И ТЕХНОЛОГИЯХ (Adaptive, Zero Dead Ends) */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          {product.technologies && product.technologies.length > 0 ? (
            <>
              <div className="flex flex-col gap-2">
                <SectionBadge text={`Инновации ${brandFormatted}`} />
                <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                  Инженерные технологии {brandFormatted}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.technologies.map((tech, idx) => (
                  <div
                    key={idx}
                    className="bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                  >
                    <div className="h-52 w-full overflow-hidden bg-[#1E2228] relative">
                      <img
                        src={tech.imageUrl}
                        alt={tech.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-[#87888A] uppercase tracking-wider">
                          {tech.subtitle}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1 group-hover:text-simona-teal transition-colors">
                          {tech.title}
                        </h3>
                        <p className="mt-2.5 text-xs text-[#87888A] leading-relaxed">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Zero Dead Ends: Rich editorial overview when no specific technologies array is supplied */
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <SectionBadge text={`Обзор модели ${brandFormatted}`} />
                <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                  Инженерия и дизайн {product.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-lg">
                  <h3 className="text-lg font-montserrat font-semibold text-white">
                    Описание и особенности эксплуатации
                  </h3>
                  <p className="text-sm text-[#D7D9DB] leading-relaxed whitespace-pre-line">
                    {product.description ||
                      `${product.name} — премиальное решение от европейского производителя ${brandFormatted}. Прибор спроектирован с учетом строгих стандартов энергоэффективности, эргономики и надежности.`}
                  </p>

                  {product.shortDesc && (
                    <div className="pt-4 border-t border-[#2B313A] flex flex-wrap items-center gap-3 text-xs text-simona-teal font-medium">
                      <span>Ключевые преимущества:</span>
                      <span className="text-white font-normal">{product.shortDesc}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col gap-3">
                    <span className="text-xs text-white font-semibold">
                      Нужна помощь с интеграцией в проект?
                    </span>
                    <p className="text-xs text-[#87888A] leading-relaxed">
                      Инженеры салона выверят чертежи подключения и проконсультируют по требованиям к вентиляции и электрике.
                    </p>
                    <button
                      onClick={() =>
                        openModal('EQUIPMENT_SELECTION', { product })
                      }
                      className="w-full h-10 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-bold transition-colors cursor-pointer mt-1"
                    >
                      Запросить консультацию инженера
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ХАРАКТЕРИСТИКИ */}
      {/* ========================================================================= */}
      {activeTab === 'specs' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <SectionBadge text="Полные технические параметры" />
                {totalSpecCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-[11px] font-mono text-[#87888A]">
                    {totalSpecCount} параметров
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                Технические характеристики
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Search inside Specs */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Поиск по параметрам..."
                  value={specQuery}
                  onChange={(e) => setSpecQuery(e.target.value)}
                  className="w-full bg-[#16191D] border border-[#2B313A] focus:border-simona-teal rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#87888A] focus:outline-none transition-colors"
                />
                <SimonaIconSearch className="w-4 h-4 text-[#87888A] absolute left-3 top-2.5 pointer-events-none" />
                {specQuery && (
                  <button
                    onClick={() => setSpecQuery('')}
                    className="absolute right-2.5 top-2.5 text-xs text-[#87888A] hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {product.schematicPdfUrl && (
                <a
                  href={product.schematicPdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors shrink-0"
                >
                  <SimonaIconDownload className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Паспорт (PDF)</span>
                </a>
              )}
            </div>
          </div>

          {computedSpecGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {computedSpecGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-[#3E4550] transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-[#2B313A] pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-simona-teal">
                      {group.groupName}
                    </h3>
                    <span className="text-[11px] font-mono text-[#87888A]">
                      [{group.items.length}]
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {group.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="flex items-baseline justify-between text-xs gap-3 group/item py-0.5 hover:bg-white/[0.02] px-1 rounded transition-colors"
                      >
                        <span className="text-[#87888A] group-hover/item:text-[#D7D9DB] shrink-0 font-medium transition-colors">
                          {item.label}
                        </span>
                        <span className="grow border-b border-dotted border-[#2B313A] mx-2" />
                        <span className="text-white font-semibold text-right shrink-0 max-w-[55%]">
                          {item.label.toLowerCase().includes('бренд')
                            ? formatBrandName(item.value)
                            : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-sm text-[#87888A]">
                {specQuery
                  ? `По запросу «${specQuery}» ничего не найдено`
                  : 'Характеристики не указаны'}
              </span>
              {specQuery && (
                <button
                  onClick={() => setSpecQuery('')}
                  className="text-xs text-simona-teal hover:underline font-semibold"
                >
                  Сбросить поиск
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB: АКЦИИ И ПОДАРКИ ПРОИЗВОДИТЕЛЯ (PROMOTIONS & GIFTS) */}
      {/* ========================================================================= */}
      {activeTab === 'promos' && allPromosToDisplay.length > 0 && (
        <motion.div
          key="tab-promos"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-3">
            <SectionBadge variant="wine">
              Официальные программы производителя
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
              Действующие акции и подарки {brandFormatted} ({allPromosToDisplay.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl leading-relaxed text-left">
              Специальные условия, ступени подарков и каскадные скидки официальных производителей техники при заказе в салонах и интернет-магазине СИМОНА.
            </p>
          </div>

          {/* Cards Grid in Homepage PromoCard Style */}
          <div
            className={`grid grid-cols-1 ${
              allPromosToDisplay.length === 1
                ? 'max-w-md'
                : allPromosToDisplay.length === 2
                ? 'md:grid-cols-2 max-w-4xl'
                : 'md:grid-cols-2 lg:grid-cols-3'
            } gap-6`}
          >
            {allPromosToDisplay.map((promo) => (
              <Link
                key={promo.id}
                href={`/promos/${promo.slug}`}
                className="group flex flex-col justify-between h-full min-h-[460px] rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-wine/60 transition-all duration-500 overflow-hidden shadow-xl"
              >
                {/* Visual Top Media */}
                <div className="relative h-56 w-full overflow-hidden bg-[#111315]">
                  <Image
                    src={promo.thumbnailUrl || promo.bannerUrl}
                    alt={promo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-[#16191D]/40 to-transparent" />

                  {/* Header Tags over Image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    {/* Brand Tag */}
                    <span className="px-2.5 py-1 rounded-md bg-[#111315]/85 backdrop-blur-md border border-[#2B313A] text-xs font-semibold text-white uppercase tracking-wider shadow-sm">
                      {promo.brand}
                    </span>

                    {/* Official Wine Promo Badge */}
                    {(promo.badgeText || promo.discountBadge) && (
                      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-simona-wine/25 text-white text-xs font-semibold shadow-sm border border-simona-wine/50 backdrop-blur-md">
                        <span>{promo.badgeText || promo.discountBadge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {promo.subtitle && (
                      <span className="text-xs uppercase tracking-wider text-[#87888A] font-medium">
                        {promo.subtitle}
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-white group-hover:text-white mt-1.5 leading-snug line-clamp-2">
                      {promo.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#87888A] mt-2.5 leading-relaxed line-clamp-2">
                      {promo.shortDescription}
                    </p>
                  </div>

                  {/* Footer info: Deadline and Arrow CTA */}
                  <div className="pt-5 mt-5 border-t border-[#2B313A]/60 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-[#87888A]">
                      <SimonaIconClock className="w-3.5 h-3.5 text-simona-wine-light" />
                      <span>до {promo.endDate}</span>
                    </div>

                    <div className="inline-flex items-center space-x-1 text-xs font-semibold text-simona-wine-light group-hover:text-white transition-colors">
                      <span>Подробнее</span>
                      <SimonaIconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: СХЕМЫ ВСТРОЙКИ (PDF/DWG) — Rendered only if files exist */}
      {/* ========================================================================= */}
      {activeTab === 'schematics' &&
        (product.schematicPdfUrl || product.schematicDwgUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <SectionBadge text="Архитектурные чертежи и узлы" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                Схемы встройки и монтажная документация {brandFormatted}
              </h2>
            </div>

            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Left: Dimension Blueprint Information */}
              <div className="w-full lg:w-1/2 bg-[#1E2228] border border-[#2B313A] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#87888A] mb-4 pb-2 border-b border-[#2B313A]">
                  <span>ЧЕРТЕЖ: {product.name}</span>
                  <span>АРТИКУЛ: {product.sku}</span>
                </div>

                <div className="w-full py-8 px-4 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center mb-4">
                    <SimonaIconFile className="w-10 h-10 text-simona-teal" />
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Монтажные габариты
                  </h4>
                  <p className="text-sm text-simona-teal font-mono mt-1">
                    {product.dimensions || 'Стандартные установочные размеры'}
                  </p>
                  <span className="text-xs text-[#87888A] mt-2 max-w-sm">
                    Точные параметры ниши, вентиляционные зазоры и точки подвода коммуникаций зафиксированы в официальном техническом паспорте.
                  </span>
                </div>
              </div>

              {/* Right: Actions and Info */}
              <div className="w-full lg:w-1/2 flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-simona-teal/15 border border-simona-teal/30 text-simona-teal text-xs font-semibold w-fit">
                  <SimonaIconSparkles className="w-3.5 h-3.5" />
                  <span>Сертифицированная документация {brandFormatted}</span>
                </div>

                <h3 className="text-xl font-montserrat font-bold text-white text-left">
                  Материалы для архитекторов, дизайнеров и инженеров
                </h3>

                <p className="text-xs text-[#87888A] leading-relaxed text-left">
                  Официальные схемы ниши встройки, точки подвода коммуникаций и требования к вентиляционным зазорам для интеграции в дизайн-проекты.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                  {product.schematicPdfUrl && (
                    <a
                      href={product.schematicPdfUrl}
                      download
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
                    >
                      <SimonaIconDownload className="w-4 h-4 text-simona-teal" />
                      <span>Схема встройки (PDF)</span>
                    </a>
                  )}

                  {product.schematicDwgUrl && (
                    <a
                      href={product.schematicDwgUrl}
                      download
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
                    >
                      <SimonaIconPackage className="w-4 h-4 text-simona-teal" />
                      <span>3D CAD / DWG модель</span>
                    </a>
                  )}

                  <button
                    onClick={() =>
                      openModal('EQUIPMENT_SELECTION', { product })
                    }
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Запросить выверку чертежей инженером</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* ========================================================================= */}
      {/* TAB 4: КОМПЛЕКТ В ЕДИНОМ СТИЛЕ (Smart Bundle / Concierge Fallback) */}
      {/* ========================================================================= */}
      {activeTab === 'bundle' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-12"
        >
          {bundleResult.hasBundle ? (
            <>
              <div className="flex flex-col gap-2">
                <SectionBadge text="Дизайнерский комплект" />
                <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                  {bundleResult.bundleTitle}
                </h2>
                <p className="text-xs text-[#87888A] text-left">
                  {bundleResult.bundleSubtitle}
                </p>
              </div>

              {/* Interactive Bundle Builder */}
              <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col xl:flex-row items-center justify-between gap-6">
                {/* Products Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                  {bundleResult.bundleItems.map((item, index) => {
                    const isChecked = selectedBundleIds.includes(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        <div
                          onClick={() => toggleBundleItem(item.id)}
                          className={`relative w-full sm:w-64 p-4 rounded-2xl bg-[#1E2228] border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                            isChecked
                              ? 'border-simona-teal shadow-lg shadow-teal-950/20'
                              : 'border-[#2B313A] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? 'bg-simona-teal border-simona-teal text-white'
                                  : 'border-[#87888A] bg-transparent'
                              }`}
                            >
                              {isChecked && (
                                <SimonaIconCheck className="w-3.5 h-3.5" />
                              )}
                            </div>
                            {item.isMain && (
                              <span className="text-[10px] font-semibold text-simona-teal bg-simona-teal/15 px-2 py-0.5 rounded-md">
                                Текущий прибор
                              </span>
                            )}
                          </div>

                          <div className="h-32 w-full rounded-xl overflow-hidden bg-[#111315] mb-3 flex items-center justify-center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain p-2"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-[#87888A] uppercase font-mono">
                              {item.sku}
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">
                              {item.name}
                            </h4>
                            <div className="text-sm font-extrabold text-white mt-2">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>

                        {index < bundleResult.bundleItems.length - 1 && (
                          <div className="hidden sm:flex items-center justify-center text-[#87888A]">
                            <Plus className="w-5 h-5" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Bundle Checkout Box */}
                <div className="w-full xl:w-80 bg-[#1E2228] border border-simona-teal/40 rounded-2xl p-6 flex flex-col gap-4 shrink-0">
                  <span className="text-xs text-[#87888A]">
                    Выбрано приборов: {selectedBundleIds.length} из{' '}
                    {bundleResult.bundleItems.length}
                  </span>

                  <div className="flex flex-col gap-1">
                    {hasAllItems && (
                      <div className="flex items-baseline justify-between text-xs text-[#87888A]">
                        <span>Цена без скидки:</span>
                        <span className="line-through">
                          {formatPrice(rawTotal)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-white">
                        Итого:
                      </span>
                      <span className="text-2xl font-montserrat font-extrabold text-white">
                        {formatPrice(finalBundleTotal)}
                      </span>
                    </div>

                    {hasAllItems && (
                      <div className="text-xs font-semibold text-simona-teal mt-1">
                        Экономия: {formatPrice(discountAmount)} (-10%)
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddBundleToCart}
                    disabled={selectedBundleIds.length === 0}
                    className="w-full h-12 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-teal-950/40 disabled:opacity-40"
                  >
                    Купить комплект — {formatPrice(finalBundleTotal)}
                  </button>
                </div>
              </div>

              {/* Original Accessories Carousel (if supplied) */}
              {bundleResult.accessories && bundleResult.accessories.length > 0 && (
                <div className="flex flex-col gap-5 pt-6">
                  <h3 className="text-xl font-montserrat font-bold text-white text-left">
                    {bundleResult.accessoriesTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {bundleResult.accessories.map((acc) => (
                      <div
                        key={acc.id}
                        className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 flex flex-col justify-between hover:border-simona-teal/50 transition-all duration-300 group"
                      >
                        <div>
                          <div className="h-36 w-full rounded-xl bg-[#1E2228] overflow-hidden mb-3 flex items-center justify-center p-3 relative">
                            {acc.badge && (
                              <span className="absolute top-2 left-2 text-[10px] font-semibold text-simona-teal bg-simona-teal/20 px-2 py-0.5 rounded-md">
                                {acc.badge}
                              </span>
                            )}
                            <img
                              src={acc.imageUrl}
                              alt={acc.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>

                          <span className="text-[10px] font-mono text-[#87888A]">
                            Код товара: {acc.sku}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-2 mt-1">
                            {acc.name}
                          </h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#2B313A] flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(acc.price)}
                          </span>
                          <button
                            onClick={() => handleAddAccessory(acc)}
                            className="px-3.5 py-1.5 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <SimonaIconCart className="w-3 h-3" />
                            <span>В корзину</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Premium Concierge fallback when brand has no pre-compiled suite */
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="flex flex-col gap-3 max-w-2xl">
                <SectionBadge text={`Комплектация ${brandFormatted}`} />
                <h3 className="text-2xl font-montserrat font-bold text-white text-left">
                  {bundleResult.bundleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed text-left">
                  Подберем духовой шкаф, варочную панель, вытяжку, винный шкаф и мойку в единой эстетической концепции бренда {brandFormatted} под габариты вашей кухни. Выверка монтажных схем и защита спецификации за 24 часа со специальной скидкой на комплект.
                </p>
                <div className="flex items-center gap-4 text-xs text-simona-teal font-medium mt-2">
                  <span>• Скидка на комплект до 10%</span>
                  <span>• 3D-модели и схемы для кухонщиков</span>
                  <span>• Хранение до конца ремонта</span>
                </div>
              </div>

              <button
                onClick={() =>
                  openModal('EQUIPMENT_SELECTION', { product })
                }
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-teal-950/40 shrink-0"
              >
                Заказать подбор комплекта {brandFormatted}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ОТЗЫВЫ И ЭКСПЕРТИЗА — Rendered only if authentic reviews exist */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' &&
        product.reviews &&
        product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-2">
              <SectionBadge text="Опыт эксплуатации" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
                Оценки и отзывы владельцев ({product.rating || 5.0} / 5.0)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Certified Expert Verdict */}
              {product.expertVerdict && (
                <div className="lg:col-span-5 bg-[#16191D] border border-simona-teal/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl">
                  <div>
                    <div className="flex items-center gap-3.5 mb-6">
                      <img
                        src={product.expertVerdict.avatarUrl}
                        alt={product.expertVerdict.expertName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-simona-teal"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {product.expertVerdict.expertName}
                        </h4>
                        <p className="text-xs text-[#87888A]">
                          {product.expertVerdict.expertRole}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {product.expertVerdict.title}
                    </h3>

                    <blockquote className="text-xs text-[#D7D9DB] italic leading-relaxed pl-3 border-l-2 border-simona-teal">
                      "{product.expertVerdict.quote}"
                    </blockquote>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#2B313A] flex flex-col gap-2.5">
                    {product.expertVerdict.scores.map((score, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-[#87888A]">{score.label}</span>
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <SimonaIconStar className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span>{score.score.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right: Customer Reviews */}
              <div
                className={`${
                  product.expertVerdict ? 'lg:col-span-7' : 'lg:col-span-12'
                } flex flex-col gap-4`}
              >
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {review.author}
                          </span>
                          {review.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                              Проверенный покупатель
                            </span>
                          )}
                        </div>
                        {review.location && (
                          <p className="text-[11px] text-[#87888A] mt-0.5">
                            {review.location}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[#D4AF37]">
                        {[...Array(review.rating)].map((_, i) => (
                          <SimonaIconStar
                            key={i}
                            className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#D7D9DB] leading-relaxed">
                      {review.text}
                    </p>

                    {review.photos && review.photos.length > 0 && (
                      <div className="flex items-center gap-2 pt-2">
                        {review.photos.map((photo, pIdx) => (
                          <img
                            key={pIdx}
                            src={photo}
                            alt="Фото в интерьере"
                            className="w-16 h-16 rounded-md object-cover border border-[#2B313A]"
                          />
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-[#87888A] pt-1">
                      {review.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
    </div>
  );
}
