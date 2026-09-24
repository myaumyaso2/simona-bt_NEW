'use client';

import React from 'react';
import { X, Play, ExternalLink, Eye, Send } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function VideoPreviewModal() {
  const { modal, closeModal } = useStore();

  if (modal.type !== 'VIDEO_PREVIEW' || !modal.videoData) {
    return null;
  }

  const { title, views, thumbnail, telegramUrl } = modal.videoData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2B313A]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-simona-teal animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-semibold text-simona-teal">
              Live из салонов «СИМОНА»
            </span>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-xl border border-[#2B313A] text-[#87888A] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area / Preview */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
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
            className="relative z-10 flex flex-col items-center justify-center space-y-3 cursor-pointer group/btn"
          >
            <div className="w-16 h-16 rounded-xl bg-simona-teal/90 group-hover/btn:bg-simona-teal text-white flex items-center justify-center shadow-lg shadow-simona-teal/30 group-hover/btn:scale-105 transition-all duration-300">
              <Play className="w-7 h-7 ml-1 fill-white" />
            </div>
            <span className="px-4 py-1.5 rounded-md bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/20">
              Смотреть полный обзор в Telegram
            </span>
          </a>

          <div className="absolute bottom-4 left-6 flex items-center space-x-2 text-xs text-white/80">
            <Eye className="w-4 h-4 text-simona-teal" />
            <span>{views} просмотров в канале</span>
          </div>
        </div>

        {/* Footer / Description & Direct Telegram Link */}
        <div className="p-6 bg-[#16191D]">
          <h3 className="text-lg font-montserrat font-semibold text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-[#87888A] mb-5 leading-relaxed">
            Эксклюзивный видеообзор и демонстрация в салоне «СИМОНА» на ул. Белинского, 15. Подключайтесь к обсуждению модели с нашими бренд-шефами.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2B313A]">
            <span className="text-xs text-[#87888A]">
              Канал: <strong className="text-white font-medium">@simona_bt</strong>
            </span>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-simona-teal/25 space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Перейти к просмотру в Telegram</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
