'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SimonaIconPhoneSolid } from '@/components/brand/SimonaIcons';
import { SectionBadge } from '@/components/ui/SectionBadge';

const SERVICES = [
  {
    num: '01',
    title: 'Бесплатное бережное хранение на складе',
    desc: 'Резервируйте технику по фиксированной цене и храните на нашем отапливаемом складе до окончания ремонта и сборки кухонного гарнитура.',
  },
  {
    num: '02',
    title: 'Шеф-монтаж сертифицированными мастерами',
    desc: 'Инсталляция и пусконаладка строго по заводским регламентам брендов. Сохранение полной официальной заводской гарантии производителя.',
  },
  {
    num: '03',
    title: 'Доставка в белых перчатках',
    desc: 'Собственная служба доставки. Аккуратный подъем в квартиру на любой этаж, бережная распаковка при вас, осмотр и утилизация упаковки.',
  },
];

export function ServiceContour() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.service-card');
        const lines = gridRef.current.querySelectorAll('.service-line');
        const nums = gridRef.current.querySelectorAll('.service-num');

        // Step-by-step card ignition
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.18,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );

        // Animated indicator line growth
        gsap.fromTo(
          lines,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.85,
            stagger: 0.18,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );

        // Subtle number pulse
        gsap.fromTo(
          nums,
          { scale: 0.85, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.65,
            stagger: 0.18,
            ease: 'back.out(1.5)',
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
      id="service"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-[#16191D] border-t border-[#2B313A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Asymmetrical Split-Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              Премиальный сервисный стандарт
            </SectionBadge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-semibold text-white tracking-tight">
              Забота о вашем комфорте на каждом этапе
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#87888A] leading-relaxed max-w-xl">
              Сопровождаем покупку от выверки технических схем с производителями кухонь до бережной доставки и фирменного шеф-монтажа.
            </p>
          </div>

          <div className="shrink-0 self-start md:self-end">
            <a
              href="tel:+78314237600"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors py-2.5 px-4 rounded-xl bg-[#111315] border border-[#2B313A] hover:border-simona-teal/50 shadow-sm"
            >
              <SimonaIconPhoneSolid className="w-3.5 h-3.5 text-simona-teal" />
              <span>Служба заботы: (831) 423 76 00</span>
            </a>
          </div>
        </div>

        {/* 3 Columns Cards Grid per Figma node 1:379 */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {SERVICES.map((item) => (
            <div
              key={item.num}
              className="service-card p-8 sm:p-10 rounded-2xl bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal/50 transition-colors duration-300 flex flex-col justify-between space-y-6 shadow-xl group"
            >
              <div>
                <span className="service-num font-montserrat text-3xl sm:text-4xl font-bold text-simona-teal tracking-tight block mb-6 transition-colors">
                  {item.num}
                </span>

                <h3 className="text-xl font-montserrat font-bold text-white leading-snug mb-3 group-hover:text-simona-teal transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#87888A] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="w-16 h-1 bg-[#2B313A] rounded-full overflow-hidden">
                <div className="service-line h-full w-full bg-gradient-to-r from-simona-teal to-simona-teal-light rounded-full will-change-transform shadow-[0_0_8px_rgba(0,151,156,0.6)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
