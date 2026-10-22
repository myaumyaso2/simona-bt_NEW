import React from 'react';
import Link from 'next/link';
import {
  SimonaIconSearch,
  SimonaIconArrowRight,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import { NotFoundTracker } from '@/components/analytics/NotFoundTracker';

export const metadata = {
  title: 'Страница не найдена — 404 | СИМОНА Нижний Новгород',
  description:
    'Запрошенная страница не найдена или модель была снята с производства. Воспользуйтесь поиском по каталогу бытовой техники СИМОНА или выберите популярные категории.',
};

const POPULAR_CATEGORIES = [
  { title: 'Варочные панели', href: '/catalog/varochnye-paneli' },
  { title: 'Духовые шкафы', href: '/catalog/duhovye-shkafy' },
  { title: 'Посудомоечные машины', href: '/catalog/vstraivaemye-posudomoechnye-mashiny' },
  { title: 'Холодильники', href: '/catalog/holodilniki' },
  { title: 'Вытяжки', href: '/catalog/vytyazhki' },
  { title: 'Стиральные машины', href: '/catalog/stiralnye-mashiny' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
      <NotFoundTracker />
      <div className="max-w-3xl mx-auto w-full text-left space-y-8">
        {/* Subtle Status */}
        <div className="space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-semibold bg-simona-teal/10 border border-simona-teal/20 text-simona-teal">
            404 • Ошибка адресации
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat text-white tracking-tight">
            Страница не найдена или прибор снят с производства
          </h1>
          <p className="text-sm sm:text-base text-[#87888A] leading-relaxed max-w-2xl">
            Возможно, ссылка устарела или старая модель из архива была заменена более современным прибором из актуального модельного ряда.
          </p>
        </div>

        {/* Search bar form */}
        <form
          action="/catalog"
          method="GET"
          className="relative flex items-center max-w-xl"
        >
          <input
            type="text"
            name="q"
            placeholder="Поиск по названию, бренду или артикулу..."
            className="w-full pl-11 pr-28 py-3.5 rounded-xl bg-[#16191D] border border-[#2B313A] text-white placeholder-[#87888A] text-sm focus:outline-none focus:border-simona-teal transition-colors"
          />
          <SimonaIconSearch className="w-5 h-5 text-[#87888A] absolute left-3.5 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-lg bg-simona-teal text-white text-xs font-semibold hover:bg-simona-teal/90 transition-colors"
          >
            Найти
          </button>
        </form>

        {/* Quick category recovery links */}
        <div className="space-y-4 pt-4 border-t border-[#2B313A]/60">
          <p className="text-xs uppercase tracking-wider text-[#87888A] font-semibold">
            Популярные разделы каталога в наличии:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/70 hover:bg-[#1E2228] transition-all text-xs sm:text-sm font-medium text-white"
              >
                <span>{cat.title}</span>
                <SimonaIconArrowRight className="w-4 h-4 text-[#87888A] group-hover:text-simona-teal group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#2B313A]/60">
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-[#1E2228] border border-simona-teal text-white text-sm font-semibold hover:bg-simona-teal/20 transition-all"
          >
            В весь каталог техники
          </Link>
          <a
            href="tel:+78312118242"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16191D] border border-[#2B313A] text-[#D7D9DB] text-sm font-medium hover:border-simona-teal/50 hover:text-white transition-all"
          >
            <SimonaIconPhoneSolid className="w-3.5 h-3.5 text-simona-teal" />
            <span>Консультация эксперта: +7 (831) 211-82-42</span>
          </a>
        </div>
      </div>
    </main>
  );
}
