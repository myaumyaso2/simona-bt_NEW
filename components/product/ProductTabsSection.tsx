'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import {
  MIELE_SUITE_BUNDLE,
  MIELE_CARE_ACCESSORIES,
  BundleItem,
  AccessoryItem,
} from '@/data/catalogData';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import {
  Download,
  Box,
  FileText,
  Star,
  Check,
  Plus,
  Equal,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { SimonaIconCart } from '@/components/brand/SimonaIcons';

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
  const { addToCart, setIsCartOpen } = useStore();

  // Bundle selection state
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([
    'bundle-oven',
    'bundle-coffee',
    'bundle-drawer',
  ]);

  const toggleBundleItem = (id: string) => {
    setSelectedBundleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bundle calculations
  const bundleItems = MIELE_SUITE_BUNDLE;
  const rawTotal = bundleItems
    .filter((item) => selectedBundleIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const hasAllThree = selectedBundleIds.length === 3;
  const bundleDiscountPercent = hasAllThree ? 0.1 : 0;
  const discountAmount = Math.round(rawTotal * bundleDiscountPercent);
  const finalBundleTotal = rawTotal - discountAmount;

  const handleAddBundleToCart = () => {
    bundleItems
      .filter((item) => selectedBundleIds.includes(item.id))
      .forEach((item) => {
        addToCart(
          {
            id: item.id,
            sku: item.sku,
            name: item.name,
            slug: item.id,
            brand: 'Miele',
            category: item.category,
            categoryType: 'CATEGORY_B',
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
        brand: 'Miele',
        category: acc.category,
        categoryType: 'CATEGORY_A',
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
      {/* TAB 1: О ПРИБОРЕ И ТЕХНОЛОГИЯХ */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
              ИННОВАЦИИ GENERATION 7000
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white mt-1">
              Инженерные технологии приготовления Miele
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(product.technologies || []).map((tech, idx) => (
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B313A]">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
                ПОЛНЫЕ ТЕХНИЧЕСКИЕ ПАРАМЕТРЫ
              </span>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white mt-1">
                Технические характеристики
              </h2>
            </div>

            {product.schematicPdfUrl && (
              <a
                href={product.schematicPdfUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-simona-teal" />
                <span>Скачать паспорт модели (PDF)</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {(product.specGroups || []).map((group, gIdx) => (
              <div
                key={gIdx}
                className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col gap-4"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-simona-teal border-b border-[#2B313A] pb-3">
                  {group.groupName}
                </h3>

                <div className="flex flex-col gap-3.5">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex items-baseline justify-between text-xs gap-3"
                    >
                      <span className="text-[#87888A] shrink-0 font-medium">
                        {item.label}
                      </span>
                      <span className="grow border-b border-dotted border-[#2B313A] mx-2" />
                      <span className="text-white font-semibold text-right shrink-0">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: СХЕМЫ ВСТРОЙКИ (PDF/DWG) */}
      {/* ========================================================================= */}
      {activeTab === 'schematics' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
              АРХИТЕКТУРНЫЕ ЧЕРТЕЖИ И ГЕОМЕТРИЯ
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white mt-1">
              Схемы встройки и монтажные узлы
            </h2>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
            {/* Left: Blueprint Vector Graphic */}
            <div className="w-full lg:w-1/2 bg-[#1E2228] border border-[#2B313A] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-3 left-3 text-[10px] font-mono text-[#87888A] uppercase">
                ЧЕРТЕЖ: MIELE GENERATION 7000 (60 СМ)
              </div>

              {/* Minimal SVG architectural schematic */}
              <div className="w-full max-w-sm py-4">
                <svg viewBox="0 0 400 320" className="w-full h-auto text-simona-teal stroke-current fill-none">
                  {/* Outer Niche outline */}
                  <rect x="50" y="30" width="280" height="260" stroke="#2B313A" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Ventilation Airflow */}
                  <path d="M 190 20 L 190 40 M 200 15 L 200 40 M 210 20 L 210 40" stroke="#00979C" strokeWidth="1.5" />
                  <text x="220" y="25" fill="#00979C" fontSize="10" fontFamily="Montserrat">Вент. зазор 50 мм</text>

                  {/* Appliance Body */}
                  <rect x="65" y="45" width="250" height="235" stroke="#FFFFFF" strokeWidth="2" fill="#16191D" />
                  {/* Cavity Glass */}
                  <rect x="90" y="70" width="200" height="150" stroke="#00979C" strokeWidth="1.5" />
                  {/* Control Panel Area */}
                  <rect x="90" y="55" width="200" height="12" stroke="#87888A" strokeWidth="1" />
                  
                  {/* Dimension lines */}
                  {/* Height */}
                  <line x1="30" y1="45" x2="30" y2="280" stroke="#87888A" strokeWidth="1" />
                  <line x1="25" y1="45" x2="35" y2="45" stroke="#87888A" strokeWidth="1" />
                  <line x1="25" y1="280" x2="35" y2="280" stroke="#87888A" strokeWidth="1" />
                  <text x="5" y="165" fill="#D7D9DB" fontSize="10" transform="rotate(-90 5 165)" fontFamily="Montserrat">596 мм</text>

                  {/* Width */}
                  <line x1="65" y1="295" x2="315" y2="295" stroke="#87888A" strokeWidth="1" />
                  <line x1="65" y1="290" x2="65" y2="300" stroke="#87888A" strokeWidth="1" />
                  <line x1="315" y1="290" x2="315" y2="300" stroke="#87888A" strokeWidth="1" />
                  <text x="175" y="310" fill="#D7D9DB" fontSize="10" fontFamily="Montserrat">595 мм</text>
                </svg>
              </div>

              <span className="text-[11px] text-[#87888A] mt-2">
                Рекомендуемый проем ниши: 590–595 × 560–568 × 550 мм
              </span>
            </div>

            {/* Right: Actions and Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-simona-teal/15 border border-simona-teal/30 text-simona-teal text-xs font-semibold w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Сертифицированные файлы Miele</span>
              </div>

              <h3 className="text-xl font-montserrat font-bold text-white">
                Материалы для архитекторов, дизайнеров и инженеров
              </h3>

              <p className="text-xs text-[#87888A] leading-relaxed">
                Точные чертежи ниши встройки, точки подвода электричества и требования к вентиляционным зазорам. Готовые 3D-модели для интеграции в проекты 3ds Max, Archicad и AutoCAD.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                <a
                  href="/schematics/miele-dgc7860.pdf"
                  download
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-simona-teal" />
                  <span>Схема встройки (PDF, 2.4 МБ)</span>
                </a>

                <a
                  href="/schematics/miele-dgc7860.dwg"
                  download
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
                >
                  <Box className="w-4 h-4 text-simona-teal" />
                  <span>3D CAD / DWG модель</span>
                </a>

                <a
                  href="/manuals/miele-dgc7860-ru.pdf"
                  download
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-simona-teal" />
                  <span>Инструкция по эксплуатации</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: КОМПЛЕКТ В ЕДИНОМ СТИЛЕ */}
      {/* ========================================================================= */}
      {activeTab === 'bundle' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-simona-teal/15 border border-simona-teal/30 text-simona-teal text-xs font-semibold w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Выгода 10% на комплект</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white">
              Соберите дизайнерский комплект в единой отделке Obsidian Black
            </h2>
            <p className="text-xs text-[#87888A] mt-1">
              Идеальное визуальное совпадение фасадов и бесшовный монтаж в колонну. При заказе 3 приборов предоставляется специальная скидка.
            </p>
          </div>

          {/* Interactive Bundle Builder */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col xl:flex-row items-center justify-between gap-6">
            {/* Products Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              {bundleItems.map((item, index) => {
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
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        {item.isMain && (
                          <span className="text-[10px] font-semibold text-simona-teal bg-simona-teal/15 px-2 py-0.5 rounded">
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

                    {index < bundleItems.length - 1 && (
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
                Выбрано приборов: {selectedBundleIds.length} из 3
              </span>

              <div className="flex flex-col gap-1">
                {hasAllThree && (
                  <div className="flex items-baseline justify-between text-xs text-[#87888A]">
                    <span>Цена без скидки:</span>
                    <span className="line-through">{formatPrice(rawTotal)}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-white">Итого:</span>
                  <span className="text-2xl font-montserrat font-extrabold text-white">
                    {formatPrice(finalBundleTotal)}
                  </span>
                </div>

                {hasAllThree && (
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

          {/* Original Accessories Carousel */}
          <div className="flex flex-col gap-5 pt-6">
            <h3 className="text-xl font-montserrat font-bold text-white">
              Оригинальные аксессуары и средства Miele CareCollection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {MIELE_CARE_ACCESSORIES.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 flex flex-col justify-between hover:border-simona-teal/50 transition-all duration-300 group"
                >
                  <div>
                    <div className="h-36 w-full rounded-xl bg-[#1E2228] overflow-hidden mb-3 flex items-center justify-center p-3 relative">
                      {acc.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold text-simona-teal bg-simona-teal/20 px-2 py-0.5 rounded">
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
                      Арт. {acc.sku}
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
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ОТЗЫВЫ И ЭКСПЕРТИЗА */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
              РЕАЛЬНЫЙ ОПЫТ ЭКСПЛУАТАЦИИ И ИНЖЕНЕРНЫЙ АНАЛИЗ
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white mt-1">
              Оценки и отзывы владельцев (4.9 / 5.0)
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
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{score.score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right: Customer Reviews */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {(product.reviews || []).map((review) => (
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
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
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
                        <Star
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
                          className="w-16 h-16 rounded-lg object-cover border border-[#2B313A]"
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
