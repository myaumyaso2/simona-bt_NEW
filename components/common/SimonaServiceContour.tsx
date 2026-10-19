'use client';

import React from 'react';
import Link from 'next/link';
import { ProductItem } from '@/types';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconArrowRight } from '@/components/brand/SimonaIcons';

export interface SimonaServiceContourProps {
  product?: ProductItem;
  className?: string;
  id?: string;
}

export function SimonaServiceContour({
  product,
  className = 'w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-[#2B313A]',
  id = 'service',
}: SimonaServiceContourProps) {
  const { openModal } = useStore();

  const cardClasses =
    'p-6 sm:p-7 rounded-2xl bg-[#16191D] hover:bg-[#1B1F25] border border-[#2B313A] hover:border-simona-teal/70 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-simona-teal/10 transition-all duration-300 flex flex-col justify-between shadow-lg group';

  return (
    <section id={id} className={className}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-montserrat font-semibold text-white tracking-tight">
          Сервисный стандарт СИМОНА
        </h2>
        <span className="text-xs font-medium text-[#87888A] tracking-wider hidden sm:inline-block">
          Более 30 лет на рынке
        </span>
      </div>

      {/* 4 Cards Grid: 01 Expert, 02 Storage, 03 Delivery, 04 Installation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 01: Персональный эксперт */}
        <div className={cardClasses}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                01
              </span>
              <span className="text-[11px] font-medium text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/20">
                Экспертиза
              </span>
            </div>

            <h3 className="text-base font-montserrat font-bold text-white mb-2.5 group-hover:text-simona-teal transition-colors">
              Персональный эксперт
            </h3>

            <p className="text-xs text-[#87888A] leading-relaxed">
              Закрепленный специалист салона на всех этапах: подбор комплекта под дизайн-проект кухни, сверка монтажных схем и ведение заказа.
            </p>
          </div>

          <div className="pt-5 mt-auto">
            <button
              type="button"
              onClick={() => openModal('QUICK_CONSULT', product ? { product } : undefined)}
              className="inline-flex items-center gap-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-semibold transition-colors group/btn cursor-pointer"
            >
              <span>Задать вопрос эксперту</span>
              <SimonaIconArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 02: Хранение до конца ремонта */}
        <div className={cardClasses}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                02
              </span>
              <span className="text-[11px] font-medium text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/20">
                0 ₽ • до 6 мес.
              </span>
            </div>

            <h3 className="text-base font-montserrat font-bold text-white mb-2.5 group-hover:text-simona-teal transition-colors">
              Хранение до конца ремонта
            </h3>

            <p className="text-xs text-[#87888A] leading-relaxed">
              Резервируйте технику по фиксированной цене. Бесплатный охраняемый отапливаемый склад до окончания ремонта и готовности кухонного гарнитура.
            </p>
          </div>

          <div className="pt-5 mt-auto">
            <div className="text-[11px] text-[#87888A]">
              Центральный склад: ул. Коминтерна, 27
            </div>
          </div>
        </div>

        {/* Card 03: Аккуратная доставка и самовывоз */}
        <div className={cardClasses}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                03
              </span>
              <span className="text-[11px] font-medium text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/20">
                Своя служба
              </span>
            </div>

            <h3 className="text-base font-montserrat font-bold text-white mb-2.5 group-hover:text-simona-teal transition-colors">
              Аккуратная доставка и самовывоз
            </h3>

            <p className="text-xs text-[#87888A] leading-relaxed">
              Собственная служба доставки. Бережный подъем в квартиру на любой этаж, распаковка и проверка целостности при вас.
            </p>
          </div>

          <div className="pt-5 mt-auto">
            <Link
              href="/delivery-payment"
              className="inline-flex items-center gap-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-semibold transition-colors group/btn cursor-pointer"
            >
              <span>Доставка и самовывоз</span>
              <SimonaIconArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Card 04: Профессиональная установка */}
        <div className={cardClasses}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                04
              </span>
              <span className="text-[11px] font-medium text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/20">
                Гарантия
              </span>
            </div>

            <h3 className="text-base font-montserrat font-bold text-white mb-2.5 group-hover:text-simona-teal transition-colors">
              Профессиональная установка
            </h3>

            <p className="text-xs text-[#87888A] leading-relaxed">
              Профессионально устанавливаем и подключаем встраиваемую бытовую технику строго по заводским регламентам брендов с сохранением официальной гарантии.
            </p>
          </div>

          <div className="pt-5 mt-auto">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-semibold transition-colors group/btn cursor-pointer"
            >
              <span>Установка и сервис</span>
              <SimonaIconArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
