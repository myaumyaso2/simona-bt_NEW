'use client';

import React from 'react';
import { Award, Briefcase, Clock, ShieldCheck, Upload, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

const B2B_BENEFITS = [
  {
    icon: Percent,
    title: 'Партнерское вознаграждение до 10%',
    desc: 'Прозрачная и официальная система агентских выплат по всем европейским брендам без задержек.',
  },
  {
    icon: Clock,
    title: 'Технический расчет за 24 часа',
    desc: 'Наши инженеры проверят все схемы встройки, зазоры, вентиляционные каналы и электровыводы.',
  },
  {
    icon: Briefcase,
    title: 'Салон как ваша переговорная база',
    desc: 'Проводите встречи с заказчиками в комфортных лаунж-зонах флагманского салона на Белинского, 15 с кофе и живой демонстрацией техники.',
  },
  {
    icon: ShieldCheck,
    title: 'Защита и резервирование проектов',
    desc: 'Фиксация спецификации за вашим проектом, заморозка цен и бесплатное хранение на складе до окончания ремонта.',
  },
];

export function B2BClubSection() {
  const { openModal } = useStore();

  return (
    <section id="b2b-club" className="py-24 bg-[#111317] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Benefits & Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-simona-teal/10 border border-simona-teal/30 text-simona-teal text-xs font-medium mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>Специальная программа для профессионалов</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white leading-tight">
              Клуб архитекторов <br />
              <span className="italic text-simona-teal">и дизайнеров интерьеров</span>
            </h2>

            <p className="mt-4 text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
              Мы берем на себя всю инженерную рутину по бытовой технике: от подбора артикулов по визуализациям до шеф-монтажа и гарантийного сервиса перед вашим клиентом.
            </p>

            {/* Benefits Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {B2B_BENEFITS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="p-2 w-fit rounded-lg bg-simona-teal/10 text-simona-teal mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: B2B Quick Submission Card */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-2 text-xs font-semibold text-simona-teal uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Вступить в Клуб / Загрузить проект</span>
              </div>
              <h3 className="text-xl font-serif text-white font-normal mb-2">
                Спецификация и расчет за 24 часа
              </h3>
              <p className="text-xs text-zinc-400 font-light mb-6">
                Прикрепите чертеж, коллаж или список техники (.pdf, .dwg, .zip), и персональный B2B-менеджер подготовит расчет.
              </p>

              <button
                onClick={() => openModal('B2B_CLUB')}
                className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-simona-teal/25 flex items-center justify-center group mb-3"
              >
                <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Загрузить дизайн-проект
              </button>

              <div className="text-center">
                <span className="text-[11px] text-zinc-500">
                  или свяжитесь с B2B-куратором напрямую:{' '}
                  <a href="tel:+78312170015" className="text-zinc-300 hover:text-simona-teal underline">
                    +7 (831) 217-00-15
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
