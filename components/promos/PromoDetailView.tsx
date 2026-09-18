'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, CheckCircle2, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import {
  SimonaIconPercent,
  SimonaIconClock,
  SimonaIconPin,
  SimonaIconGuarantee,
  SimonaIconConsultation,
} from '@/components/brand/SimonaIcons';
import { ManufacturerPromo, ProductItem } from '@/types';
import { CATALOG_PRODUCTS } from '@/data/catalogData';
import { LuxuryProductCard } from '@/components/catalog/LuxuryProductCard';
import { useStore } from '@/components/providers/StoreContext';

interface PromoDetailViewProps {
  promo: ManufacturerPromo;
}

export function PromoDetailView({ promo }: PromoDetailViewProps) {
  const { openModal } = useStore();

  // Find participating products from the catalog
  const participatingProducts = CATALOG_PRODUCTS.filter((prod) => {
    if (promo.participatingProductSlugs && promo.participatingProductSlugs.length > 0) {
      return promo.participatingProductSlugs.includes(prod.slug);
    }
    return prod.brand.toLowerCase() === promo.brand.toLowerCase();
  });

  return (
    <div className="bg-[#111315] min-h-screen text-[#D7D9DB]">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#2B313A] bg-[#16191D]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-[#87888A] truncate">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-3 h-3 text-[#87888A] shrink-0" />
            <Link href="/promos" className="hover:text-white transition-colors shrink-0">
              Акции производителей
            </Link>
            <ChevronRight className="w-3 h-3 text-[#87888A] shrink-0" />
            <span className="text-[#D7D9DB] font-medium truncate">{promo.brand}: {promo.title}</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="relative border-b border-[#2B313A] py-14 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background Image with Deep Luxury Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={promo.bannerUrl}
            alt={promo.title}
            fill
            priority
            className="object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/85 to-[#111315]/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Badges Stack */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="px-3 py-1 rounded-full bg-[#16191D] border border-[#2B313A] text-xs font-semibold text-white uppercase tracking-wider">
                {promo.brand} {promo.brandCountry ? `(${promo.brandCountry})` : ''}
              </span>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-simona-wine text-white text-xs font-semibold shadow-lg shadow-simona-wine/35 border border-simona-wine-light/50">
                <SimonaIconPercent className="w-3.5 h-3.5 text-white" />
                <span>{promo.badgeText}</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#16191D] border border-[#2B313A] text-xs text-[#D7D9DB]">
                <SimonaIconClock className="w-3.5 h-3.5 text-simona-wine-light" />
                <span>до {promo.endDate}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              {promo.title}
            </h1>

            <p className="text-base sm:text-lg text-[#87888A] mt-4 leading-relaxed font-normal">
              {promo.shortDescription}
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openModal('EQUIPMENT_SELECTION')}
                className="px-6 py-3.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover text-white text-sm font-semibold transition-all shadow-lg shadow-simona-wine/25 border border-simona-wine-light/50 flex items-center space-x-2 cursor-pointer"
              >
                <SimonaIconPercent className="w-4 h-4 text-white" />
                <span>Зафиксировать условия акции</span>
              </button>

              <button
                onClick={() => openModal('SHOWROOM_VISIT')}
                className="px-6 py-3.5 rounded-xl bg-[#16191D] hover:bg-[#1E2228] text-white text-sm font-semibold transition-all border border-[#2B313A] hover:border-simona-teal/50 flex items-center space-x-2 cursor-pointer"
              >
                <SimonaIconPin className="w-4 h-4 text-simona-teal" />
                <span>Оценить приборы в салоне</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Body Content (2 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Description, Conditions, Products */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Detailed Description */}
            <div className="rounded-2xl border border-[#2B313A] bg-[#16191D] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white tracking-tight mb-4">
                Описание официальной программы
              </h2>
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[#D7D9DB] whitespace-pre-line space-y-4">
                {promo.fullDescription}
              </div>
            </div>

            {/* Official Conditions Checklist */}
            <div className="rounded-2xl border border-[#2B313A] bg-[#16191D] p-6 sm:p-8">
              <div className="flex items-center space-x-2 text-simona-wine-light text-xs font-semibold uppercase tracking-wider mb-3">
                <SimonaIconPercent className="w-4 h-4 text-simona-wine-light" />
                <span>Условия участия и правила акции</span>
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight mb-6">
                Что необходимо для получения выгоды
              </h2>

              <ul className="space-y-3.5">
                {promo.conditions.map((cond, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-[#D7D9DB]">
                    <CheckCircle2 className="w-5 h-5 text-simona-wine-light shrink-0 mt-0.5" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Participating Products Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    Приборы, участвующие в акции
                  </h2>
                  <p className="text-xs sm:text-sm text-[#87888A] mt-1">
                    Модели из каталога «СИМОНА», доступные к заказу на специальных условиях
                  </p>
                </div>

                <Link
                  href="/catalog"
                  className="text-xs text-simona-teal hover:text-white transition-colors"
                >
                  Весь каталог →
                </Link>
              </div>

              {participatingProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {participatingProducts.map((prod) => (
                    <LuxuryProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-[#2B313A] bg-[#16191D] text-center">
                  <p className="text-sm text-[#87888A]">
                    Полный перечень приборов бренда {promo.brand} включает более 150 моделей под заказ.
                  </p>
                  <button
                    onClick={() => openModal('EQUIPMENT_SELECTION')}
                    className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold bg-simona-wine text-white hover:bg-simona-wine-hover transition"
                  >
                    Запросить полный список моделей по акции
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Sidebar with Guarantee and Contacts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              
              {/* Consultation Card */}
              <div className="rounded-2xl border border-simona-wine/40 bg-[#16191D] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-simona-wine/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center space-x-2 text-simona-wine-light text-xs font-semibold uppercase tracking-wider mb-2">
                  <SimonaIconConsultation className="w-4 h-4 text-simona-wine-light" />
                  <span>Персональный менеджер</span>
                </div>

                <h3 className="text-lg font-semibold text-white">
                  Консультация эксперта по акции
                </h3>

                <p className="text-xs text-[#87888A] mt-2 leading-relaxed">
                  Поможем подобрать приборы, проверим совместимость встройки с кухонным гарнитуром и зафиксируем спеццену.
                </p>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => openModal('EQUIPMENT_SELECTION')}
                    className="w-full py-3 rounded-xl bg-simona-wine hover:bg-simona-wine-hover text-white text-xs font-bold transition-all shadow-md shadow-simona-wine/25 border border-simona-wine-light/50 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Рассчитать выгоду комплекта</span>
                  </button>

                  <button
                    onClick={() => openModal('SHOWROOM_VISIT')}
                    className="w-full py-3 rounded-xl bg-[#1E2228] hover:bg-[#242A32] text-white text-xs font-semibold transition-all border border-[#2B313A] hover:border-simona-teal/50 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Забронировать визит в салон</span>
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2B313A] text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-[#D7D9DB]">
                    <Phone className="w-3.5 h-3.5 text-simona-teal" />
                    <a href="tel:+78314237600" className="hover:text-white font-medium">
                      +7 (831) 423-76-00
                    </a>
                  </div>
                  <div className="flex items-start space-x-2 text-[#87888A]">
                    <Clock className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                    <span>Ежедневно с 10:00 до 20:00</span>
                  </div>
                </div>
              </div>

              {/* Showroom Addresses Info */}
              <div className="rounded-2xl border border-[#2B313A] bg-[#16191D] p-6 space-y-4">
                <div className="flex items-center space-x-2 text-simona-teal text-xs font-semibold uppercase tracking-wider">
                  <SimonaIconGuarantee className="w-4 h-4 text-simona-teal" />
                  <span>Шоурумы в Нижнем Новгороде</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A]/60">
                    <p className="font-semibold text-white">Флагманский салон «СИМОНА»</p>
                    <p className="text-[#87888A] mt-0.5">ул. Белинского, 15</p>
                    <p className="text-[#87888A] mt-1 text-[11px]">Бренд-зоны Miele, ASKO, Liebherr, SMEG, VARD, Активная кухня</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A]/60">
                    <p className="font-semibold text-white">Салон OMOIKIRI & KÖRTING</p>
                    <p className="text-[#87888A] mt-0.5">ул. Белинского, 11/66</p>
                    <p className="text-[#87888A] mt-1 text-[11px]">Японские мойки, смесители 2-в-1, встраиваемая техника</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
