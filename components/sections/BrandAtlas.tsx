'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

const BRANDS = [
  {
    name: 'Miele',
    country: 'Германия',
    origin: 'Immer Besser • С 1899 года',
    specialty: 'Встраиваемая техника, кофемашины, пароварки, уход за бельем',
    highlight: 'Флагманская бренд-зона на Белинского, 15',
  },
  {
    name: 'ASKO',
    country: 'Швеция',
    origin: 'Scandinavian Design & Craftsmanship',
    specialty: 'Варочные системы Celsius°Cooking, духовые шкафы, стиральные машины',
    highlight: 'Подключено на Активной кухне',
  },
  {
    name: 'Liebherr',
    country: 'Германия / Австрия',
    origin: 'Quality, Design and Innovation',
    specialty: 'Встраиваемый холод, зона BioFresh, премиальные винные шкафы',
    highlight: 'Экспозиция в салоне',
  },
  {
    name: 'SMEG',
    country: 'Италия',
    origin: 'Technology with style',
    specialty: 'Дизайнерские серии Dolce&Gabbana, Linea, Victoria, малая техника',
    highlight: 'Культовый итальянский стиль',
  },
  {
    name: 'Bertazzoni',
    country: 'Италия',
    origin: 'Guastalla, Emilia-Romagna • С 1882 года',
    specialty: 'Кухонные блоки, шеф-плиты, духовые шкафы и вытяжки',
    highlight: 'Эксклюзивные комплекты под заказ',
  },
  {
    name: 'Falmec',
    country: 'Италия',
    origin: 'Air is life',
    specialty: 'Бесшумная аспирация NRS, вытяжки Circle.Tech, очистка воздуха',
    highlight: 'Итальянская тихая вытяжка',
  },
  {
    name: 'OMOIKIRI',
    country: 'Япония',
    origin: 'Гармония японского минимализма',
    specialty: 'Мойки Artgranit и Tetogranit, смесители 2-в-1, измельчители',
    highlight: 'Фирменный салон на Белинского, 11/66',
  },
  {
    name: 'VARD',
    country: 'Европа / Россия',
    origin: 'Новый премиальный стандарт',
    specialty: 'Встраиваемая кухонная техника с расширенной заводской гарантией',
    highlight: 'Надежность и сервис',
  },
  {
    name: 'Schulthess',
    country: 'Швейцария',
    origin: 'Swiss Made Precision • С 1845 года',
    specialty: 'Швейцарские профессиональные стиральные и сушильные машины',
    highlight: 'Швейцарский эталон ухода',
  },
  {
    name: 'KÖRTING',
    country: 'Германия',
    origin: 'Немецкие традиции качества',
    specialty: 'Компактные духовые шкафы, СВЧ, посудомоечные машины, вытяжки',
    highlight: 'Экспозиция на Белинского, 11/66',
  },
];

export function BrandAtlas() {
  const { openModal } = useStore();

  return (
    <section id="brands" className="py-24 md:py-32 bg-white border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-3">
              Авторизованный партнер фабрик Европы и Азии
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
              Брендовый атлас
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#6E7074] max-w-md font-normal leading-relaxed">
            Прямые поставки от ведущих фабрик Европы, Скандинавии и Японии. Официальная заводская гарантия, подбор аксессуаров и шеф-монтаж.
          </p>
        </div>

        {/* Brands Grid: Light Double-Bezel Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              onClick={() => openModal('QUICK_CONSULT')}
              className="group p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-teal/50 hover:bg-black/[0.03] transition-all duration-300 cursor-pointer shadow-sm"
            >
              <div className="p-5 rounded-xl bg-white shadow-sm h-full flex flex-col justify-between border border-black/[0.02]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#87888A] uppercase">
                      {brand.country}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-black/[0.04] flex items-center justify-center group-hover:bg-simona-teal/15 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#6E7074] group-hover:text-simona-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </span>
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-[#16181B] group-hover:text-simona-teal transition-colors tracking-wide">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#87888A] font-medium italic">
                    {brand.origin}
                  </p>
                  <p className="mt-3 text-xs text-[#6E7074] leading-relaxed font-normal line-clamp-2">
                    {brand.specialty}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-simona-teal font-bold tracking-wide">
                    {brand.highlight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
