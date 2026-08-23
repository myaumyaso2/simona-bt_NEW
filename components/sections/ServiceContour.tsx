'use client';

import React from 'react';
import { Warehouse, Wrench, Shield, Sparkles } from 'lucide-react';

const SERVICES = [
  {
    icon: Warehouse,
    title: 'Бесплатное хранение на складе',
    desc: 'Зафиксируйте цену и акции сейчас. Мы бережно сохраним весь комплект техники на нашем отапливаемом складе до окончания чистовой отделки квартиры.',
  },
  {
    icon: Wrench,
    title: 'Шеф-монтаж сертифицированными мастерами',
    desc: 'Установка и подключение специалистами, прошедшими обучение в академиях Miele, ASKO и SMEG. Сохранение официальной заводской гарантии.',
  },
  {
    icon: Shield,
    title: 'Бережная доставка в белых перчатках',
    desc: 'Собственная служба доставки бережно занесет технику в квартиру, распакует, проверит целостность и вывезет транспортировочную упаковку.',
  },
];

export function ServiceContour() {
  return (
    <section className="py-24 bg-[#0E1012] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-simona-teal mb-3">
            Премиальный стандарт заботы
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">
            Сервисный контур СИМОНА
          </h2>
          <p className="mt-4 text-sm text-zinc-400 font-light">
            Покупка премиальной техники — это непрерывный комфорт от первого визита в салон до первого включения прибора на вашей кухне.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-simona-teal/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 text-simona-teal flex items-center justify-center mb-6">
                  <srv.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-white mb-3">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
