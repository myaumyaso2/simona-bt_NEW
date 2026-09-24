'use client';

import React from 'react';
import { useStore } from '@/components/providers/StoreContext';
import { ProductItem } from '@/types';
import { Play } from 'lucide-react';
import { SimonaIconPin, SimonaIconClock, SimonaIconCar } from '@/components/brand/SimonaIcons';

interface ProductShowroomBlockProps {
  product: ProductItem;
}

export function ProductShowroomBlock({ product }: ProductShowroomBlockProps) {
  const { openModal } = useStore();

  const handleOpenShowroomModal = () => {
    openModal('SHOWROOM_VISIT', { product, preferredShowroom: 'belinskogo_15' });
  };

  const handleOpenVideo = () => {
    openModal('VIDEO_PREVIEW', {
      videoData: {
        title: 'Видеоэкскурсия по экспозиции флагманского салона на ул. Белинского, 15',
        views: '1 480 просмотров',
        thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        telegramUrl: 'https://t.me/simonabt_official',
      },
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        {/* Left: Panoramic Showroom Photo with Video Play Overlay */}
        <div className="w-full lg:w-[55%] relative min-h-[320px] lg:min-h-[440px] bg-[#1E2228] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
            alt="Флагманский салон бытовой техники СИМОНА"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Video Play Overlay */}
          <button
            onClick={handleOpenVideo}
            className="absolute inset-0 m-auto w-14 h-14 rounded-xl bg-simona-teal/90 hover:bg-simona-teal text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
            title="Смотреть видеоэкскурсию"
          >
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </button>

          <div className="absolute bottom-4 left-6 text-xs text-[#D7D9DB] font-medium bg-black/60 px-3 py-1.5 rounded-md backdrop-blur-md border border-white/10">
            Видеоэкскурсия по монобрендовой экспозиции Miele
          </div>
        </div>

        {/* Right: Content & Showroom Info */}
        <div className="w-full lg:w-[45%] p-7 sm:p-10 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
              ФЛАГМАНСКИЙ САЛОН «СИМОНА» • НИЖНИЙ НОВГОРОД
            </span>

            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white leading-tight">
              Оцените Miele DGC 7860 вживую во флагманском пространстве
            </h2>

            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              Приглашаем в салон на ул. Белинского, 15. Сертифицированный эксперт продемонстрирует логику управления сенсорным дисплеем M Touch, расскажет обо всех инженерных тонкостях подключения и поможет скомпоновать приборы в гармоничную колонну.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Showroom Details Badges */}
            <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-4 flex flex-col gap-2 text-xs text-[#D7D9DB]">
              <div className="flex items-center gap-2">
                <SimonaIconPin className="w-4 h-4 text-simona-teal shrink-0" />
                <span className="font-semibold text-white">
                  Нижний Новгород, ул. Белинского, 15
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#87888A]">
                <SimonaIconClock className="w-4 h-4 shrink-0" />
                <span>Ежедневно с 10:00 до 20:00</span>
              </div>
              <div className="flex items-center gap-2 text-[#87888A]">
                <SimonaIconCar className="w-4 h-4 shrink-0" />
                <span>Выделенная охраняемая парковка для клиентов</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleOpenShowroomModal}
              className="w-full h-12 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-teal-950/40"
            >
              Забронировать индивидуальный визит с экспертом
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
