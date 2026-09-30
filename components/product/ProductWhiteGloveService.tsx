'use client';

import React from 'react';
import { SectionBadge } from '@/components/ui/SectionBadge';

const WHITE_GLOVE_SERVICES = [
  {
    num: '01',
    title: 'Профессиональная установка и подключение',
    desc: 'Официальная авторизация сервиса, строгое соблюдение заводских регламентов производителей, сохранение полной гарантии бренда.',
  },
  {
    num: '02',
    title: 'Хранение до конца ремонта',
    desc: 'Бесплатный охраняемый климатический склад до 6 месяцев. Резервируйте технику по фиксированной цене уже сейчас.',
  },
  {
    num: '03',
    title: 'Аккуратная доставка и подъем на этаж',
    desc: 'Собственная служба доставки, бережный занос прямо в квартиру, распаковка при вас, проверка целостности и вывоз упаковки.',
  },
  {
    num: '04',
    title: 'Персональный эксперт',
    desc: 'Закрепленный специалист на всех этапах от выбора модели до финальной пусконаладки и консультаций по эксплуатации.',
  },
];

export function ProductWhiteGloveService() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 border-t border-[#2B313A]">
      <div className="flex flex-col gap-2 mb-10 text-left">
        <SectionBadge text="Сервисный стандарт СИМОНА" />
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white text-left">
          Надежное сопровождение на каждом этапе
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {WHITE_GLOVE_SERVICES.map((item) => (
          <div
            key={item.num}
            className="rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-md group"
          >
            <div>
              <span className="text-3xl font-montserrat font-extrabold text-simona-teal mb-3 block group-hover:scale-105 transition-transform">
                {item.num}
              </span>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-simona-teal transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
