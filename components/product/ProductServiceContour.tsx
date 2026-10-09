'use client';

import React, { useMemo } from 'react';
import { ProductItem } from '@/types';
import { getProductO2OInfo } from '@/lib/productO2O';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconArrowRight,
} from '@/components/brand/SimonaIcons';

interface ProductServiceContourProps {
  product: ProductItem;
}

export function ProductServiceContour({ product }: ProductServiceContourProps) {
  const { openModal } = useStore();
  const o2oInfo = useMemo(() => getProductO2OInfo(product), [product]);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 pb-12 border-t border-[#2B313A]">
      {/* Header: Concise Quiet Luxury Badge */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <SectionBadge variant="teal">
          Сервисный стандарт СИМОНА
        </SectionBadge>
        <span className="text-[11px] font-medium text-[#87888A] tracking-wider uppercase hidden sm:inline-block">
          30+ лет на рынке
        </span>
      </div>

      {/* 4 Cards Grid: 01 Expert, 02 Storage, 03 Installation, 04 Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 01: Персональный эксперт (1-е место по согласованию) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all duration-300 flex flex-col justify-between shadow-lg group">
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
              onClick={() => openModal('QUICK_CONSULT', { product })}
              className="inline-flex items-center gap-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-semibold transition-colors group/btn cursor-pointer"
            >
              <span>Задать вопрос эксперту</span>
              <SimonaIconArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 02: Хранение до конца ремонта */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all duration-300 flex flex-col justify-between shadow-lg group">
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

        {/* Card 03: Профессиональная установка и подключение */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all duration-300 flex flex-col justify-between shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                03
              </span>
              <span className="text-[11px] font-medium text-white/70 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
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
            <div className="text-[11px] text-[#87888A]">
              Сертифицированные специалисты
            </div>
          </div>
        </div>

        {/* Card 04: Аккуратная доставка и самовывоз (с динамическими данными товара) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all duration-300 flex flex-col justify-between shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-simona-teal tracking-tight group-hover:scale-105 transition-transform">
                04
              </span>
              <span className="text-[11px] font-medium text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/20">
                Своя служба
              </span>
            </div>

            <h3 className="text-base font-montserrat font-bold text-white mb-2.5 group-hover:text-simona-teal transition-colors">
              Аккуратная доставка и самовывоз
            </h3>

            <p className="text-xs text-[#87888A] leading-relaxed mb-3">
              Собственная служба доставки. Бережный подъем в квартиру на этаж, распаковка и проверка целостности при вас.
            </p>

            {/* Dynamic Product Logistics Pill */}
            <div className="space-y-1.5 text-[11px] bg-[#111315] p-2.5 rounded-xl border border-[#2B313A]">
              <div className="flex items-start gap-1.5 text-[#D7D9DB]">
                <SimonaIconDelivery className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong className="text-white font-medium">Доставка по НН:</strong> {o2oInfo.deliveryText.time}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-[#D7D9DB]">
                <SimonaIconPin className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong className="text-white font-medium">Самовывоз:</strong> {o2oInfo.pickupText.time} (ул. Коминтерна, 27)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-auto">
            <button
              type="button"
              onClick={() =>
                openModal('SHOWROOM_VISIT', {
                  product,
                  preferredShowroom: o2oInfo.showroomId,
                })
              }
              className="inline-flex items-center gap-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-medium underline underline-offset-4 cursor-pointer"
            >
              <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal shrink-0" />
              <span>Записаться на показ в салоне</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
