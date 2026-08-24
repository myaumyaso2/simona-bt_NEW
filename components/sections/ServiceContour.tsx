'use client';

import React from 'react';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconDelivery, SimonaIconGuarantee, SimonaIconStar } from '@/components/brand/SimonaIcons';

const SERVICES = [
  {
    icon: SimonaIconGuarantee,
    title: 'Бесплатное хранение на складе',
    desc: 'Зафиксируйте цену и акции сейчас. Мы бережно сохраним весь комплект техники на нашем отапливаемом складе до окончания чистовой отделки квартиры.',
  },
  {
    icon: SimonaIconStar,
    title: 'Шеф-монтаж сертифицированными мастерами',
    desc: 'Установка и подключение специалистами, прошедшими обучение в академиях Miele, ASKO и SMEG. Сохранение официальной заводской гарантии.',
  },
  {
    icon: SimonaIconDelivery,
    title: 'Бережная доставка в белых перчатках',
    desc: 'Собственная служба доставки бережно занесет технику в квартиру, распакует, проверит целостность и вывезет транспортировочную упаковку.',
  },
];

export function ServiceContour() {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.035} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-3">
            Премиальный стандарт заботы
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
            Сервисный контур СИМОНА
          </h2>
          <p className="mt-4 text-sm text-[#6E7074] font-normal leading-relaxed">
            Покупка премиальной техники — это непрерывный комфорт от первого визита в салон до первого включения прибора на вашей кухне.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-1 rounded-[1.75rem] bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-teal/40 transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div className="p-8 rounded-[calc(1.75rem-4px)] bg-white shadow-sm border border-black/[0.02] h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-6 shadow-sm">
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-montserrat font-bold text-[#16181B] mb-3">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6E7074] font-normal leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
