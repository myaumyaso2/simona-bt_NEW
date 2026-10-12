'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconChevronRight,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
  SimonaIconFile,
  SimonaIconDownload,
  SimonaIconCheckCircle,
  SimonaIconTag,
} from '@/components/brand/SimonaIcons';
import { LuxuryProductCard } from '@/components/catalog/LuxuryProductCard';
import { useSiteContent } from '@/components/providers/ContentContext';
import { ProductItem } from '@/types';

interface CertificatePageViewProps {
  initialProducts: ProductItem[];
}

export function CertificatePageView({ initialProducts }: CertificatePageViewProps) {
  const content = useSiteContent();
  const certData = content.certificatePage;
  const catalogRef = useRef<HTMLDivElement>(null);
  const salonRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSalon = () => {
    salonRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-24 pb-20 selection:bg-simona-teal/30 selection:text-white">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#2B313A] bg-[#16191D]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-[#87888A] truncate" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <SimonaIconChevronRight className="w-3 h-3 text-[#87888A] shrink-0" />
            <span className="text-white font-medium truncate">
              {certData.badge}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8 sm:mt-12">
        {/* 2. Hero Presentation Banner */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Info */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <SectionBadge variant="teal">
                {certData.badge}
              </SectionBadge>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
                {certData.title}
              </h1>

              <p className="text-sm sm:text-base text-[#87888A] leading-relaxed max-w-2xl">
                {certData.subtitle}
              </p>

              {/* Nominals Summary Pill */}
              <div className="inline-flex items-center gap-3 p-3.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white">
                <SimonaIconTag className="w-4 h-4 text-simona-teal shrink-0" />
                <span className="font-medium text-[#D7D9DB]">
                  {certData.nominalsSummary}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
                >
                  Выбрать номинал
                </button>
                <button
                  type="button"
                  onClick={scrollToSalon}
                  className="px-6 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition"
                >
                  Купить в салоне
                </button>
              </div>
            </div>

            {/* Right Col: Official Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[16/10] rounded-xl overflow-hidden border border-[#2B313A] bg-[#111315] shadow-2xl group">
                <Image
                  src="/images/certificate/gift_sert_hero.jpg"
                  alt="Подарочный сертификат СИМОНА"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[11px] font-mono tracking-wider text-simona-teal uppercase font-semibold">
                    Фирменный бланк в конверте
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Catalog Products Grid */}
        <div ref={catalogRef} className="space-y-6 text-left">
          <div className="border-b border-[#2B313A] pb-4">
            <SectionBadge variant="wine">
              Каталог
            </SectionBadge>
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight mt-2">
              {certData.catalogSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] mt-1 max-w-2xl">
              {certData.catalogSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {initialProducts.map((product) => (
              <LuxuryProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* 4. Salon Acquisition Section */}
        <div ref={salonRef} className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-10 relative overflow-hidden text-left space-y-6">
          <div className="border-b border-[#2B313A] pb-4">
            <SectionBadge variant="wine">
              {certData.salonBlock.badge}
            </SectionBadge>
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight mt-2">
              {certData.salonBlock.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] mt-1 leading-relaxed max-w-2xl">
              {certData.salonBlock.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Address */}
            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <SimonaIconPin className="w-4 h-4 text-simona-teal shrink-0" />
                <span>{certData.salonBlock.salonName}</span>
              </div>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {certData.salonBlock.address}
              </p>
            </div>

            {/* Schedule */}
            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <SimonaIconClock className="w-4 h-4 text-simona-teal shrink-0" />
                <span>Режим работы</span>
              </div>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {certData.salonBlock.schedule}
              </p>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <SimonaIconPhoneSolid className="w-4 h-4 text-simona-teal shrink-0" />
                <span>Телефон салона</span>
              </div>
              <div>
                <a
                  href={`tel:${certData.salonBlock.phoneRaw}`}
                  className="text-xs font-semibold text-white hover:text-simona-teal transition-colors"
                >
                  {certData.salonBlock.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Rules & Transparency Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-10 space-y-8 text-left">
          <div className="border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {certData.rulesSection.badge}
            </SectionBadge>
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight mt-2">
              {certData.rulesSection.title}
            </h2>
          </div>

          {/* 6 Official Rules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certData.rulesSection.rules.map((rule, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-md bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center shrink-0 mt-0.5">
                  <SimonaIconCheckCircle className="w-3.5 h-3.5 text-simona-teal" />
                </div>
                <p className="text-xs text-[#D7D9DB] leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {/* Official Regulation PDF Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#1E2228]/80 border border-[#2B313A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-simona-wine/15 border border-simona-wine/30 flex items-center justify-center shrink-0">
                <SimonaIconFile className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {certData.rulesSection.pdfTitle}
                </div>
                <div className="text-xs text-[#87888A] leading-relaxed max-w-xl">
                  {certData.rulesSection.pdfDesc}
                </div>
              </div>
            </div>

            <a
              href={certData.rulesSection.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#252A33] hover:bg-[#2C333D] border border-[#3E4654] text-white text-xs font-semibold tracking-wide transition shrink-0"
            >
              <SimonaIconDownload className="w-4 h-4 text-simona-teal" />
              <span>{certData.rulesSection.pdfButtonText}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
