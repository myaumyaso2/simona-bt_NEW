'use client';

import React from 'react';
import { MapPin, Phone, Clock, Navigation, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconChef } from '@/components/brand/SimonaIcons';

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
    image: '/showrooms/belinskogo-15/salon_01.jpg',
    mapQuery: 'Нижний Новгород, улица Белинского, 15',
    mapUrl: 'https://yandex.ru/maps/-/CTh94C5D',
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
    <section id="showrooms" className="py-24 md:py-32 bg-[#F8F9FA] border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.035} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-3">
            Офлайн-пространства в Нижнем Новгороде
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
            2 салона на ул. Белинского
          </h2>
          <p className="mt-4 text-sm text-[#6E7074] font-normal leading-relaxed">
            Приглашаем вас прикоснуться к премиальным материалам, оценить тактильность переключателей и насладиться авторским кофе.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SHOWROOMS.map((room) => (
            <div
              key={room.id}
              className="p-1.5 rounded-[2rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-xl flex flex-col justify-between"
            >
              <div className="rounded-[calc(2rem-6px)] overflow-hidden bg-white shadow-sm border border-black/[0.03] h-full flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-simona-teal border border-simona-teal/30 shadow-md">
                        {room.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">{room.title}</h3>

                    <div className="mt-4 space-y-2 text-xs text-[#3E3D40]">
                      <div className="flex items-center space-x-2.5">
                        <MapPin className="w-4 h-4 text-simona-teal shrink-0" />
                        <span>{room.address} <span className="text-[#87888A]">({room.metro})</span></span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-4 h-4 text-[#87888A] shrink-0" />
                        <span>{room.hours}</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Phone className="w-4 h-4 text-simona-teal shrink-0" />
                        <a href="tel:+78312170015" className="hover:text-simona-teal transition-colors font-semibold text-[#16181B]">
                          {room.phone}
                        </a>
                      </div>
                    </div>

                    <p className="mt-5 text-xs sm:text-sm text-[#6E7074] font-normal leading-relaxed">
                      {room.desc}
                    </p>

                    <div className="mt-6 pt-5 border-t border-black/[0.06] space-y-2">
                      {room.highlights.map((h, i) => (
                        <div key={i} className="flex items-center text-xs text-[#3E3D40] font-medium space-x-2">
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
                    className="flex-1 pl-6 pr-2 py-2 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-simona-teal/20 flex items-center justify-between group active:scale-98"
                  >
                    <span>Забронировать визит</span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </span>
                  </button>
                  <a
                    href={room.mapUrl || `https://yandex.ru/maps/?text=${encodeURIComponent(room.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pl-5 pr-4 py-2.5 rounded-full bg-[#F2F3F4] hover:bg-zinc-200/80 text-[#16181B] text-xs font-semibold transition flex items-center justify-center border border-black/[0.06] active:scale-98"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                    Маршрут на карте
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
