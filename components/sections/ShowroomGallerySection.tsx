'use client';

import React, { useState, useEffect } from 'react';
import { BELINSKOGO_15_PHOTOS, ShowroomPhoto } from '@/data/showroomPhotos';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { useStore } from '@/components/providers/StoreContext';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Camera } from 'lucide-react';

export function ShowroomGallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<ShowroomPhoto | null>(null);
  const { openModal } = useStore();

  const categories = [
    { id: 'ALL', name: 'Все пространства' },
    { id: 'ACTIVE_KITCHEN', name: '🔥 Активная кухня' },
    { id: 'BRANDS', name: 'Бренд-зоны (Miele, ASKO, SMEG)' },
    { id: 'ZONES', name: 'Зоны экспозиции & Сомелье' },
    { id: 'B2B', name: 'Лаунж для дизайнеров' },
    { id: 'DETAILS', name: 'Детали и материалы' },
  ];

  const filteredPhotos = BELINSKOGO_15_PHOTOS.filter((photo) => {
    if (activeCategory === 'ALL') return true;
    return photo.category === activeCategory;
  });

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, filteredPhotos]);

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FAFAFA] border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.04} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-simona-teal/10 border border-simona-teal/20 text-simona-teal text-xs font-bold mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Фотогалерея интерьеров</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
              Флагман на ул. Белинского, 15
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: 'Белинского, 15' })}
              className="px-5 py-2.5 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold shadow-md shadow-simona-teal/20 transition flex items-center group active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform" />
              Забронировать визит с экспертом
            </button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 text-xs no-scrollbar border-b border-black/[0.06]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#16181B] text-white shadow-sm'
                  : 'bg-white text-[#6E7074] hover:text-[#16181B] hover:bg-zinc-100 border border-black/[0.06]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Photo Grid in Light Double-Bezel Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              className="group text-left p-1 rounded-[1.75rem] bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-teal/50 hover:bg-black/[0.03] transition-all duration-300 cursor-pointer shadow-sm flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-simona-teal"
            >
              <div className="w-full rounded-[calc(1.75rem-4px)] bg-white shadow-sm overflow-hidden border border-black/[0.02] flex flex-col h-full">
                {/* Media frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-simona-teal border border-black/[0.06] shadow-sm">
                      {photo.tag}
                    </span>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#16181B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Maximize2 className="w-4 h-4 text-simona-teal" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#87888A] font-medium tracking-wide uppercase block mb-1">
                      {photo.subtitle}
                    </span>
                    <h3 className="text-sm font-bold text-[#16181B] group-hover:text-simona-teal transition-colors">
                      {photo.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#6E7074] leading-relaxed line-clamp-2">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#16181B] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <div className="relative aspect-[16/10] w-full bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next navigation arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition border border-white/10"
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption & Actions in modal footer */}
            <div className="p-6 bg-[#16181B] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-simona-teal/20 text-simona-teal-light text-[10px] font-bold tracking-wider uppercase">
                    {selectedPhoto.tag}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {selectedPhoto.subtitle}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => {
                    const photo = selectedPhoto;
                    setSelectedPhoto(null);
                    if (photo.category === 'ACTIVE_KITCHEN') {
                      openModal('TEST_DRIVE');
                    } else {
                      openModal('SHOWROOM_VISIT', { preferredShowroom: 'Белинского, 15' });
                    }
                  }}
                  className="px-5 py-2 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold shadow-md transition"
                >
                  {selectedPhoto.category === 'ACTIVE_KITCHEN' ? 'Записаться на тест-драйв' : 'Забронировать визит'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
