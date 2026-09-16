'use client';

import React from 'react';
import { Wrench, Building2, UtensilsCrossed, Compass } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

const SERVICES = [
  {
    num: '01',
    title: 'Шеф-монтаж и подключение',
    desc: 'Официальная авторизация брендов, инсталляция строго по заводским регламентам. Сохранение полной гарантии производителя.',
    icon: Wrench,
    action: null,
  },
  {
    num: '02',
    title: 'Хранение до конца ремонта',
    desc: 'Бесплатный охраняемый климатический склад до 6 месяцев. Резервируйте технику по фиксированной цене уже сейчас.',
    icon: Building2,
    action: null,
  },
  {
    num: '03',
    title: 'Активная кухня на Белинского',
    desc: 'Гастрономический тест-драйв техники с бренд-шефом. Убедитесь в работе прибора перед покупкой.',
    icon: UtensilsCrossed,
    action: 'TEST_DRIVE' as const,
  },
  {
    num: '04',
    title: 'Клуб архитекторов и дизайнеров',
    desc: 'Спецификации в DWG/PDF за 24 часа, защита проектов, персональный менеджер и специальные условия.',
    icon: Compass,
    action: 'B2B_CLUB' as const,
  },
];

export function CatalogServiceContour() {
  const { openModal } = useStore();

  return (
    <section className="py-16 border-t border-[#2B313A] bg-[#111315]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                onClick={() => item.action && openModal(item.action)}
                className={`rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 flex flex-col justify-between transition-all duration-300 shadow-md ${
                  item.action
                    ? 'hover:border-simona-teal cursor-pointer hover:-translate-y-1'
                    : 'hover:border-[#3E3D40]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-montserrat font-bold text-simona-teal">
                      {item.num}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-[#87888A]">
                      <Icon className="w-4 h-4 text-simona-teal" />
                    </div>
                  </div>

                  <h4 className="text-[15px] font-montserrat font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="w-10 h-0.5 bg-simona-teal/40 mt-5 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
