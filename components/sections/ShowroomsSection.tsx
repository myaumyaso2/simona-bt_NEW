'use client';

import React from 'react';
import { MapPin, Phone, Clock, Navigation, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

const SHOWROOMS = [
  {
    id: 'belinskogo-15',
    title: 'Флагманский салон «СИМОНА»',
    address: 'г. Нижний Новгород, ул. Белинского, 15',
    metro: 'м. Горьковская (10 мин)',
    hours: 'Ежедневно с 10:00 до 20:00',
    phone: '+7 (831) 217-00-15',
    badge: '🔥 Флагман + Активная кухня',
    desc: 'Премиальная крупная и малая встраиваемая техника, авторские бренд-зоны Miele, ASKO, Liebherr, SMEG. Действующая «Активная кухня» для кулинарных тест-драйвов и лаунж-зона для встреч дизайнеров с клиентами.',
    highlights: [
      'Действующая «Активная кухня» (Miele / ASKO)',
      'Бренд-зоны Liebherr и SMEG',
      'Лаунж-переговорная для дизайнеров',
      'Бесплатная закрытая парковка для гостей',
    ],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    mapQuery: 'Нижний Новгород, улица Белинского, 15',
  },
  {
    id: 'belinskogo-11',
    title: 'Фирменный салон OMOIKIRI & KÖRTING',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66',
    metro: 'м. Горьковская (8 мин)',
    hours: 'Ежедневно с 10:00 до 20:00',
    phone: '+7 (831) 217-00-15',
    badge: '📍 Японская сантехника и встройка',
    desc: 'Крупнейшая в регионе экспозиция японских моек из Artgranit и Tetogranit, смесителей с подключением фильтров PureLife, измельчителей пищевых отходов и встраиваемой техники Körting.',
    highlights: [
      'Полная линейка моек и смесителей OMOIKIRI',
      'Демонстрация измельчителей в работе',
      'Встраиваемая техника Körting',
      'Подбор аксессуаров и дозаторов в тон мойки',
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    mapQuery: 'Нижний Новгород, улица Белинского, 11/66',
  },
];

export function ShowroomsSection() {
  const { openModal } = useStore();

  return (
    <section id="showrooms" className="py-24 bg-[#0E1012] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-simona-teal mb-3">
            Офлайн-пространства в Нижнем Новгороде
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">
            2 салона на ул. Белинского
          </h2>
          <p className="mt-4 text-sm text-zinc-400 font-light">
            Приглашаем вас прикоснуться к премиальным материалам, оценить тактильность переключателей и насладиться чашкой кофе.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SHOWROOMS.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-simona-teal border border-simona-teal/30">
                      {room.badge}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-serif text-white">{room.title}</h3>

                  <div className="mt-4 space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-4 h-4 text-simona-teal shrink-0" />
                      <span>{room.address} <span className="text-zinc-500">({room.metro})</span></span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span>{room.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Phone className="w-4 h-4 text-simona-teal shrink-0" />
                      <a href="tel:+78312170015" className="hover:text-simona-teal transition-colors font-medium">
                        {room.phone}
                      </a>
                    </div>
                  </div>

                  <p className="mt-5 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {room.desc}
                  </p>

                  <div className="mt-6 pt-5 border-t border-zinc-800 space-y-2">
                    {room.highlights.map((h, i) => (
                      <div key={i} className="flex items-center text-xs text-zinc-300 space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-simona-teal shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: room.id === 'belinskogo-15' ? 'Белинского, 15' : 'Белинского, 11/66' })}
                  className="flex-1 py-3 px-4 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold uppercase tracking-wider transition text-center shadow-md shadow-simona-teal/20"
                >
                  Забронировать визит с экспертом
                </button>
                <a
                  href={`https://yandex.ru/maps/?text=${encodeURIComponent(room.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition flex items-center justify-center border border-zinc-700"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                  Маршрут на карте
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
