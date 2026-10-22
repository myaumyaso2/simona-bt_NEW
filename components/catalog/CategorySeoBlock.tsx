import React from 'react';

interface CategorySeoBlockProps {
  categoryTitle: string;
  brand?: string;
}

export function CategorySeoBlock({ categoryTitle, brand }: CategorySeoBlockProps) {
  const headingText = brand
    ? `${categoryTitle} ${brand} в салонах техники «СИМОНА»`
    : `${categoryTitle} в Нижнем Новгороде — выбор и сервис «СИМОНА»`;

  return (
    <section className="mt-16 pt-12 border-t border-[#2B313A]/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#16191D]/90 to-[#111315]/95 border border-[#2B313A]/80 backdrop-blur-md">
          {/* Header */}
          <div className="text-left mb-6">
            <h2 className="text-lg sm:text-xl font-bold font-montserrat text-white tracking-tight">
              {headingText}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#87888A] max-w-3xl leading-relaxed">
              Более 30 лет экспертно подбираем встраиваемую и соло-технику ведущих производителей. 
              Предложим оптимальный комплект приборов под ваш бюджет и параметры кухонного гарнитура.
            </p>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#2B313A]/50">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shrink-0" />
                Официальная гарантия и статус
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Прямые авторизованные поставки европейских и мировых брендов. На каждый прибор действует официальная гарантия производителя с обслуживанием в сертифицированных сервисных центрах.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shrink-0" />
                Склад и экспозиция в Нижнем Новгороде
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Оперативная отгрузка со склада на ул. Коминтерна, 27 собственной аккуратной службой доставки. Живая экспозиция техники представлена в салонах на ул. Белинского 15 и 11/66.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-simona-teal font-montserrat flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shrink-0" />
                Тест-драйв на «Активной кухне»
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Возможность оценить приборы в реальной работе, сравнить режимы приготовления и уровень шума перед покупкой во флагманском салоне на ул. Белинского, 15.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
