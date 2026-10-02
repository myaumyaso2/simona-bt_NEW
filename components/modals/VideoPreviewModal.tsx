'use client';

import React from 'react';
import { useStore } from '@/components/providers/StoreContext';
import {
  SimonaIconClose,
  SimonaIconPlay,
  SimonaIconEye,
  SimonaIconTelegram,
  SimonaIconExternalLink,
  SimonaIconClock,
} from '@/components/brand/SimonaIcons';

export function VideoPreviewModal() {
  const { modal, closeModal, openModal } = useStore();

  if (modal.type !== 'VIDEO_PREVIEW' || !modal.videoData) {
    return null;
  }

  const { title, views, thumbnail, telegramUrl, postId, description, date, duration, videoUrl } =
    modal.videoData;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-2xl bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#2B313A] bg-[#16191D] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-simona-teal animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-semibold text-simona-teal">
              Live из салонов «СИМОНА»
            </span>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-xl border border-[#2B313A] text-[#87888A] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <SimonaIconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player / Embed */}
        <div className="relative w-full bg-black flex-shrink-0 flex items-center justify-center overflow-hidden">
          {postId ? (
            <div className="w-full aspect-video min-h-[300px] sm:min-h-[380px] bg-black">
              <iframe
                src={`https://t.me/simona_sale/${postId}?embed=1&dark=1`}
                className="w-full h-full border-0"
                allowFullScreen
                title={title}
              />
            </div>
          ) : videoUrl ? (
            <div className="w-full aspect-video min-h-[300px] sm:min-h-[380px] bg-black">
              <video
                src={videoUrl}
                poster={thumbnail}
                controls
                playsInline
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full group">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center space-y-3 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-simona-teal text-white flex items-center justify-center shadow-lg shadow-simona-teal/30 hover:scale-105 transition-transform">
                  <SimonaIconPlay className="w-6 h-6 ml-0.5 fill-white" />
                </div>
                <span className="px-3.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                  Смотреть обзор в Telegram
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Info & Description Area */}
        <div className="p-5 sm:p-6 bg-[#16191D] overflow-y-auto flex-1 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#87888A]">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#111315] border border-[#2B313A]">
              <SimonaIconEye className="w-3.5 h-3.5 text-simona-teal" />
              <span className="text-[#D7D9DB] font-medium">{views}</span>
            </div>
            {duration && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#111315] border border-[#2B313A]">
                <SimonaIconClock className="w-3 h-3 text-[#87888A]" />
                <span className="text-[#D7D9DB]">{duration}</span>
              </div>
            )}
            {formattedDate && (
              <span className="text-[11px] text-[#87888A] hidden sm:inline">
                {formattedDate}
              </span>
            )}
            <span className="text-[11px] text-simona-teal font-medium ml-auto">
              @simona_sale
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-montserrat font-bold text-white leading-snug">
            {title}
          </h3>

          {description && (
            <div className="text-xs sm:text-sm text-[#A0A2A5] leading-relaxed whitespace-pre-line bg-[#111315]/80 p-3.5 rounded-xl border border-[#2B313A]/60 max-h-40 overflow-y-auto">
              {description}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#2B313A]">
            <button
              onClick={() => {
                closeModal();
                openModal('SHOWROOM_VISIT');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#2B313A] hover:border-simona-teal text-white/90 hover:text-white text-xs font-medium transition-colors"
            >
              Записаться в шоурум
            </button>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-simona-teal/25 space-x-2"
            >
              <SimonaIconTelegram className="w-3.5 h-3.5" />
              <span>Открыть в Telegram</span>
              <SimonaIconExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
