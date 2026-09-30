'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { DeepParallaxBackground } from '@/components/backgrounds/DeepParallaxBackground';
import { useSiteContent } from '@/components/providers/ContentContext';
import { SimonaIconArrowRight, SimonaIconPlus } from '@/components/brand/SimonaIcons';
import { KeyDirectionItem } from '@/types/siteContent';

const DEFAULT_CATEGORIES: KeyDirectionItem[] = [
  // Row 1
  {
    title: 'Стиральные машины ASKO',
    desc: 'Шведская надежность: барабан Active Drum, конструкция Quattro и уплотнитель Steel Seal без резиновой манжеты',
    count: '25 моделей',
    categorySlug: 'stiralnye-mashiny',
    brand: 'ASKO',
    image: '/showrooms/belinskogo-15/asko_zone_01.jpg',
    span: 'lg:col-span-8',
  },
  {
    title: 'Холодильники LIEBHERR',
    desc: 'Немецкие технологии свежести BioFresh, бесшумные инверторные компрессоры, зоны DuoCooling и NoFrost',
    count: '64 модели',
    categorySlug: 'holodilniki',
    brand: 'LIEBHERR',
    image: '/showrooms/belinskogo-15/wine_storage_01.jpg',
    span: 'lg:col-span-4',
  },
  // Row 2
  {
    title: 'Варочные панели BOSCH',
    desc: 'Индукционные поверхности с сенсорным управлением DirectSelect, объединением зон CombiZone и сенсором PerfectFry',
    count: '32 модели',
    categorySlug: 'varochnye-paneli',
    brand: 'BOSCH',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/88451.jpg',
    span: 'lg:col-span-4',
  },
  {
    title: 'Кухонные вытяжки ELICA',
    desc: 'Итальянская эстетика аспирации, бесшумные турбины, периметральное всасывание и скрытые встраиваемые модули',
    count: '292 модели',
    categorySlug: 'vytyazhki',
    brand: 'ELICA',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/63694.jpg',
    span: 'lg:col-span-4',
  },
  {
    title: 'Духовые шкафы MIELE',
    desc: 'Немецкий премиум: пиролитическая самоочистка, конвекция с увлажнением Moisture Plus и термощуп',
    count: '12 моделей',
    categorySlug: 'vstraivaemye-duhovye-shkafy',
    brand: 'MIELE',
    image: '/showrooms/belinskogo-15/miele_zone_01.jpg',
    span: 'lg:col-span-4',
  },
  // Row 3
  {
    title: 'Посудомоечные машины KORTING',
    desc: 'Немецкая эргономика: 3-й уровень загрузки для приборов, автооткрывание двери и бережная защита хрупкого стекла',
    count: '27 моделей',
    categorySlug: 'vstraivaemye-posudomoechnye-mashiny',
    brand: 'KORTING',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/88700.jpg',
    span: 'lg:col-span-4',
  },
  {
    title: 'Дизайнерская техника SMEG',
    desc: 'Итальянский стиль в коллекциях Cortina, Coloniale, Linea и Dolce Stil Novo: духовые шкафы и варочные панели',
    count: '62 модели',
    categorySlug: 'vstraivaemye-duhovye-shkafy',
    brand: 'SMEG',
    image: '/showrooms/belinskogo-15/smeg_zone_01.jpg',
    span: 'lg:col-span-4',
  },
  {
    title: 'Встраиваемая техника MIDEA',
    desc: 'Современные варочные поверхности и духовые шкафы с сенсорным управлением, надежной гарантией и функциональностью',
    count: '21 модель',
    categorySlug: 'varochnye-paneli',
    brand: 'MIDEA',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/92208.jpg',
    span: 'lg:col-span-4',
  },
  // Row 4
  {
    title: 'Кухонные мойки OMOIKIRI',
    desc: 'Японский композит Tetogranit, Artgranit и нержавеющая сталь с PVD-оттенками золота, меди и графита',
    count: '836 моделей',
    categorySlug: 'mojki-dlya-kuhni',
    brand: 'OMOIKIRI',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/81618.jpg',
    span: 'lg:col-span-6',
  },
  {
    title: 'Смесители для кухни OMOIKIRI',
    desc: 'Смесители 2-в-1 с подключением фильтра питьевой воды Pure Life, выдвижные изливы и фактурные покрытия в тон мойки',
    count: '290 моделей',
    categorySlug: 'smesiteli-dlya-kuhni',
    brand: 'OMOIKIRI',
    image: 'https://simona-bt.ru/images/cms/data/photo_code/88783.jpg',
    span: 'lg:col-span-6',
  },
];

export function KeyDirectionsSection() {
  const content = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Card reveals and inner image parallax
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.direction-card');
        cards.forEach((card) => {
          // Soft entry on scroll
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
              },
            }
          );

          // Inner image parallax scrub
          const img = card.querySelector('.parallax-img');
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="catalog"
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-[#111315] border-t border-[#2B313A] overflow-hidden"
    >
      {/* Interactive Deep Parallax Watermarks Background */}
      <DeepParallaxBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Catalog Link */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              {content.keyDirections.badge}
            </SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight">
              {content.keyDirections.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {content.keyDirections.subtitle}
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-sm font-medium text-simona-teal hover:text-simona-teal-light transition-colors group self-start md:self-auto"
          >
            <span>Смотреть весь каталог (8 000+ SKU)</span>
            <SimonaIconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetrical Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
        >
          {(content.keyDirections.items && content.keyDirections.items.length > 0
            ? content.keyDirections.items
            : DEFAULT_CATEGORIES
          ).map((cat, idx) => {
            const href = `/catalog/${cat.categorySlug}${cat.brand ? `?brand=${encodeURIComponent(cat.brand)}` : ''}`;
            return (
              <Link
                key={idx}
                href={href}
                className={`direction-card group relative rounded-2xl overflow-hidden border border-[#2B313A] hover:border-simona-teal/60 bg-[#16191D] p-6 sm:p-7 flex flex-col justify-end min-h-[260px] sm:min-h-[280px] transition-colors duration-500 shadow-xl ${
                  cat.span || 'lg:col-span-4'
                }`}
              >
                {/* Card Photo Background with Overflow Hidden & Inner Parallax Container */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="parallax-img absolute -inset-y-[12%] inset-x-0 w-full h-[124%] will-change-transform">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-[#16191D]/80 to-transparent pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="relative z-10 space-y-2 text-left">
                  <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#87888A] line-clamp-2 max-w-xl leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-simona-teal">
                      {cat.count}
                    </span>

                    <span className="inline-flex items-center space-x-1.5 text-xs text-[#D7D9DB] group-hover:text-white transition-colors">
                      <span>В каталог</span>
                      <SimonaIconPlus className="w-3.5 h-3.5 text-simona-teal group-hover:rotate-90 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
