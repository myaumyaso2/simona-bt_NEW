import React from 'react';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';

export interface CategoryBrandLinkItem {
  displayName: string;
  dbBrand: string;
  count: number;
  href: string;
  isActive?: boolean;
}

interface CategorySeoBlockProps {
  categoryTitle: string;
  categorySlug?: string;
  categoryDescription?: string;
  brand?: string;
  totalModels?: number;
  inStockCount?: number;
  showroomCount?: number;
  minPrice?: number;
  brandLinks?: CategoryBrandLinkItem[];
}

export function CategorySeoBlock({
  categoryTitle,
  categorySlug,
  categoryDescription,
  brand,
  totalModels = 0,
  inStockCount = 0,
  showroomCount = 0,
  minPrice = 0,
  brandLinks = [],
}: CategorySeoBlockProps) {
  const { seoBlocks } = getSiteContent();

  const headingText = brand
    ? `${categoryTitle} ${brand} в Нижнем Новгороде — наличие и подбор в «СИМОНА»`
    : `${categoryTitle} в Нижнем Новгороде — каталог и подбор в салонах «СИМОНА»`;

  const statsFragments: string[] = [];
  if (totalModels > 0) {
    statsFragments.push(`в актуальном каталоге представлено ${totalModels.toLocaleString('ru-RU')} моделей`);
  }
  if (minPrice > 0) {
    statsFragments.push(`по цене от ${Math.round(minPrice).toLocaleString('ru-RU')} ₽`);
  }
  if (inStockCount > 0) {
    statsFragments.push(`${inStockCount.toLocaleString('ru-RU')} приборов доступно к оперативной отгрузке со склада`);
  }
  if (showroomCount > 0) {
    statsFragments.push(`${showroomCount.toLocaleString('ru-RU')} образцов представлено вживую на витрине салонов`);
  }

  const dynamicSummary =
    statsFragments.length > 0
      ? `Сегодня ${statsFragments.join(', ')}. `
      : '';

  return (
    <section className="mt-16 pt-12 border-t border-[#2B313A]/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#16191D]/90 to-[#111315]/95 border border-[#2B313A]/80 backdrop-blur-md space-y-6">
          {/* 1. Dynamic Category Overview */}
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-bold font-montserrat text-white tracking-tight">
              {headingText}
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#87888A] max-w-4xl leading-relaxed">
              {categoryDescription ? `${categoryDescription} ` : ''}
              {dynamicSummary}
              Более 30 лет помогаем укомплектовать кухню и дом надежной бытовой техникой в каждом ценовом сегменте — предложим оптимальный комплект под ваш бюджет и размеры мебели.
            </p>
          </div>

          {/* 2. Internal Linking Hub: Category + Brand Landing Pages */}
          {brandLinks.length > 0 && (
            <div className="pt-5 border-t border-[#2B313A]/50 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-white font-montserrat">
                  {seoBlocks.categoryBrandsHeading}
                </h3>
                {brand && categorySlug && (
                  <Link
                    href={`/catalog/${categorySlug}`}
                    className="text-xs text-simona-teal hover:underline font-medium"
                  >
                    {seoBlocks.categoryResetBrandText}
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {brandLinks.map((item) => (
                  <Link
                    key={item.dbBrand}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      item.isActive
                        ? 'bg-simona-teal text-white border border-simona-teal shadow-sm'
                        : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/60 hover:text-white'
                    }`}
                  >
                    <span>{item.displayName}</span>
                    <span
                      className={`text-[11px] font-mono ${
                        item.isActive ? 'text-white/90' : 'text-[#87888A]'
                      }`}
                    >
                      {item.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. Service Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-[#2B313A]/50 text-left">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-simona-teal shrink-0" />
                <span>{seoBlocks.categoryPillarGuaranteeTitle}</span>
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {seoBlocks.categoryPillarGuaranteeDesc}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-simona-teal shrink-0" />
                <span>{seoBlocks.categoryPillarLogisticsTitle}</span>
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {seoBlocks.categoryPillarLogisticsDesc}
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-md bg-simona-teal shrink-0" />
                <span>{seoBlocks.categoryPillarInstallTitle}</span>
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {seoBlocks.categoryPillarInstallDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
