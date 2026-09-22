'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlexusConstellationBackground } from '@/components/backgrounds/PlexusConstellationBackground';

export interface BrandItem {
  name: string;
  country: string;
  badge: string;
  tag: string;
  slug: string;
}

export const LUXURY_BRANDS: BrandItem[] = [
  {
    name: 'Miele',
    country: 'Германия',
    badge: 'Премиум встройка',
    tag: 'Флагман 15',
    slug: 'miele',
  },
  {
    name: 'ASKO',
    country: 'Швеция',
    badge: 'Активная кухня',
    tag: 'Тест-драйв',
    slug: 'asko',
  },
  {
    name: 'Liebherr',
    country: 'Германия',
    badge: 'Холод и вино',
    tag: 'BioFresh',
    slug: 'liebherr',
  },
  {
    name: 'SMEG',
    country: 'Италия',
    badge: 'Дизайнерские серии',
    tag: 'Dolce&Gabbana',
    slug: 'smeg',
  },
  {
    name: 'Bertazzoni',
    country: 'Италия',
    badge: 'Кухонные блоки',
    tag: 'С 1882 года',
    slug: 'bertazzoni',
  },
  {
    name: 'Falmec',
    country: 'Италия',
    badge: 'Тихая аспирация',
    tag: 'Circle.Tech',
    slug: 'falmec',
  },
  {
    name: 'OMOIKIRI',
    country: 'Япония',
    badge: 'Мойки и смесители',
    tag: 'Салон 11/66',
    slug: 'omoikiri',
  },
  {
    name: 'VARD',
    country: 'Европа',
    badge: 'Надежность',
    tag: 'Гарантия 5 лет',
    slug: 'vard',
  },
  {
    name: 'Schulthess',
    country: 'Швейцария',
    badge: 'Швейцарский эталон',
    tag: 'Swiss Made',
    slug: 'schulthess',
  },
  {
    name: 'Dunavox',
    country: 'Венгрия',
    badge: 'Винные шкафы',
    tag: 'Премиум хранение',
    slug: 'dunavox',
  },
];

function BrandCardItem({ brand }: { brand: BrandItem }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: x * 0.05,
      rotateX: -y * 0.05,
      transformPerspective: 900,
      duration: 0.25,
      ease: 'power2.out',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0.22,
        x: e.clientX - rect.left - 80,
        y: e.clientY - rect.top - 80,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/catalog?brand=${brand.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="brand-card group relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-xl bg-[#16191D]/90 backdrop-blur-md border border-[#2B313A]/90 hover:border-simona-teal/70 hover:bg-[#1E2228] transition-all duration-300 min-h-[108px] text-center will-change-transform shadow-lg shadow-black/40"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={sheenRef}
        className="pointer-events-none absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(0,181,186,0.35)_0%,transparent_70%)] opacity-0 -translate-x-1/2 -translate-y-1/2"
      />
      <span className="font-montserrat text-lg font-bold text-white group-hover:text-simona-teal transition-colors tracking-wide relative z-10">
        {brand.name}
      </span>
      <span className="text-[11px] text-[#87888A] mt-1 font-medium group-hover:text-[#D7D9DB] transition-colors relative z-10">
        {brand.country} • {brand.badge}
      </span>
    </Link>
  );
}

export function BrandAtlas() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.brand-card');
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brands"
      ref={sectionRef}
      className="relative py-20 sm:py-24 bg-[#111315] border-t border-[#2B313A]/70 overflow-hidden"
    >
      {/* Interactive Plexus Constellation Background */}
      <PlexusConstellationBackground nodeCount={38} maxDist={145} mouseRadius={220} />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        {/* Section Header: Asymmetrical Split-Header */}
        <div
          ref={titleRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 pointer-events-auto"
        >
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              Официальный дилер
            </SectionBadge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight font-montserrat">
              Авторизованный дилер мировых брендов
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] mt-2.5 max-w-xl leading-relaxed">
              Прямые поставки оригинальной техники из Германии, Швеции, Италии и Японии с официальной гарантией производителя и сертифицированным сервисом.
            </p>
          </div>

          <div className="shrink-0 self-start md:self-end">
            <Link
              href="/catalog"
              className="group inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors"
            >
              <span>Смотреть брендовые коллекции</span>
              <ArrowRight className="w-4 h-4 text-simona-teal group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 10 Brands Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 pointer-events-auto"
        >
          {LUXURY_BRANDS.map((brand) => (
            <BrandCardItem key={brand.slug} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
