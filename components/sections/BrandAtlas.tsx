'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BrandItem {
  name: string;
  country: string;
  badge: string;
  tag: string;
  slug: string;
}

const LUXURY_BRANDS: BrandItem[] = [
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

    // Subtle 3D magnetic tilt physics (Quiet Luxury ~4-5 deg max)
    gsap.to(cardRef.current, {
      rotateY: x * 0.06,
      rotateX: -y * 0.06,
      transformPerspective: 800,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Move sheen reflection towards cursor
    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0.18,
        x: (e.clientX - rect.left) - 80,
        y: (e.clientY - rect.top) - 80,
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
      className="brand-card group relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 hover:bg-[#1E2228] transition-colors duration-300 min-h-[105px] text-center will-change-transform shadow-md"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic Cursor Sheen */}
      <div
        ref={sheenRef}
        className="pointer-events-none absolute w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(0,151,156,0.35)_0%,transparent_70%)] opacity-0 -translate-x-1/2 -translate-y-1/2"
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
      // Staggered wave on scroll into view
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 20, opacity: 0 },
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
          { y: 35, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.05,
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
      className="py-16 sm:py-20 bg-[#111315] border-t border-[#2B313A]/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#87888A]">
            Авторизованный дилер мировых брендов
          </p>
        </div>

        {/* 2x5 Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4"
        >
          {LUXURY_BRANDS.map((brand) => (
            <BrandCardItem key={brand.slug} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
