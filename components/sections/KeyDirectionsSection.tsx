'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { DeepParallaxBackground } from '@/components/backgrounds/DeepParallaxBackground';

interface CategoryDirection {
  title: string;
  desc: string;
  count: string;
  slug: string;
  image: string;
  span?: string; // Tailwind grid span
}

const CATEGORIES: CategoryDirection[] = [
  // Row 1
  {
    title: 'Духовые шкафы и пароварки',
    desc: 'Miele, ASKO, Bertazzoni • Пиролиз, приготовление на пару, термощупы',
    count: '420 моделей',
    slug: 'ovens',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    span: 'lg:col-span-8',
  },
  {
    title: 'Винные шкафы',
    desc: 'Liebherr, Dunavox • Мультитемпературные зоны и деревянные полки',
    count: '140 моделей',
    slug: 'wine-cabinets',
    image: '/showrooms/belinskogo-15/wine_storage_01.jpg',
    span: 'lg:col-span-4',
  },
  // Row 2
  {
    title: 'Варочные панели и индукция',
    desc: 'ASKO, Miele, Falmec со встроенной вытяжкой',
    count: '210 моделей',
    slug: 'cooktops',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-4',
  },
  {
    title: 'Холодильники и морозильники',
    desc: 'Liebherr BioFresh, встраиваемые Side-by-Side колонны',
    count: '185 моделей',
    slug: 'refrigerators',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-4',
  },
  {
    title: 'Вытяжки и вентиляция',
    desc: 'Falmec Circle.Tech, островные и скрытые системы',
    count: '90 моделей',
    slug: 'hoods',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-4',
  },
  // Row 3
  {
    title: 'Посудомоечные машины',
    desc: 'Miele Knock2Open, ASKO XL загрузка',
    count: '75 моделей',
    slug: 'dishwashers',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-4',
  },
  {
    title: 'Встраиваемые кофемашины',
    desc: 'Сенсорное управление, OneTouch for Two',
    count: '48 моделей',
    slug: 'coffee-machines',
    image: '/showrooms/belinskogo-15/coffee_corner_01.jpg',
    span: 'lg:col-span-4',
  },
  {
    title: 'Малая техника SMEG',
    desc: 'Ретро-коллекция 50-х: чайники, тостеры, планетарные миксеры',
    count: '120 моделей',
    slug: 'smeg-small',
    image: '/showrooms/belinskogo-15/smeg_zone_01.jpg',
    span: 'lg:col-span-4',
  },
  // Row 4
  {
    title: 'Мойки и смесители OMOIKIRI',
    desc: 'Японский гранит Tetogranit, смесители под фильтр, измельчители',
    count: '160 моделей',
    slug: 'sinks',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    span: 'lg:col-span-6',
  },
  {
    title: 'Уход и аксессуары Miele Care',
    desc: 'Фирменная химия для техники, бокалы Riedel, фильтры',
    count: '340 позиций',
    slug: 'care-accessories',
    image: '/showrooms/belinskogo-15/details_03.jpg',
    span: 'lg:col-span-6',
  },
];

export function KeyDirectionsSection() {
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
              Каталог премиальной техники
            </SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight">
              Ключевые направления коллекции
            </h2>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-sm font-medium text-simona-teal hover:text-simona-teal-light transition-colors group self-start md:self-auto"
          >
            <span>Смотреть весь каталог (8 000+ SKU)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetrical Cards Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
        >
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/catalog?category=${cat.slug}`}
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
              <div className="relative z-10 space-y-2">
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

                  <span className="inline-flex items-center space-x-1 text-xs text-[#D7D9DB] group-hover:text-white transition-colors">
                    <span>В каталог</span>
                    <Plus className="w-3.5 h-3.5 text-simona-teal group-hover:rotate-90 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
