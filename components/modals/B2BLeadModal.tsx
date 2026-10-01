'use client';

import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { LuxuryModalShell } from '@/components/modals/LuxuryModalShell';

export function B2BLeadModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [fileName, setFileName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOpen = modal.type === 'B2B_CLUB';

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setName('');
    setPhone('');
    setPortfolio('');
    setFileName('');
    setComment('');
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'B2B_CLUB',
          name,
          phone,
          portfolioUrl: portfolio,
          comment: `Файл проекта: ${fileName || 'не прикреплен'}. Пожелания: ${comment}`,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при отправке';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuxuryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      badgeText={!success ? 'Клуб архитекторов и дизайнеров' : undefined}
      badgeVariant="wine"
      title={!success ? 'Загрузка проекта на расчет' : undefined}
      subtitle={
        !success
          ? 'Получите полную спецификацию приборов, схемы встройки и расчет партнерских условий.'
          : undefined
      }
    >
      {success ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 rounded-2xl bg-simona-wine/15 border border-simona-wine/30 text-simona-wine flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(138,21,26,0.3)]">
            <SimonaIconCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-white mb-2">
            Проект принят на расчет!
          </h3>
          <p className="text-xs sm:text-sm text-[#87888A] font-normal max-w-sm mx-auto leading-relaxed">
            B2B-куратор салона СИМОНА подготовит полную инженерную спецификацию, схемы встройки и расчет партнерского вознаграждения в течение 24 часов.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] text-white text-xs font-semibold border border-[#2B313A] transition shadow-sm cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      ) : (
        <div>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Ваше имя / Студия *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мария Иванова / Studio Design"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-wine focus:ring-1 focus:ring-simona-wine/50 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Телефон для связи *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (900) 000-00-00"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-wine focus:ring-1 focus:ring-simona-wine/50 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Ссылка на портфолио / сайт студии</label>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://t.me/... или сайт студии"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-wine focus:ring-1 focus:ring-simona-wine/50 transition font-medium"
              />
            </div>

            {/* File Upload Trigger */}
            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Прикрепить проект (PDF / DWG / ZIP)</label>
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#2B313A] hover:border-simona-wine/70 rounded-2xl cursor-pointer bg-[#111315] hover:bg-[#1E2228]/50 transition">
                <Upload className="w-5 h-5 text-simona-wine mb-1" />
                <span className="text-xs text-[#D7D9DB] font-medium">
                  {fileName ? fileName : 'Нажмите для выбора файла с устройства'}
                </span>
                <span className="text-[10px] text-[#87888A] mt-0.5">До 50 МБ</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">
                Комментарий или ориентир по комплектации
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Квартира 120м², нужен встроенный холод, духовой шкаф с паром и тихая вытяжка..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-wine focus:ring-1 focus:ring-simona-wine/50 transition font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover disabled:opacity-50 text-white text-sm font-semibold transition shadow-lg shadow-simona-wine/25 active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? 'Отправка...' : 'Отправить проект на расчет'}
            </button>
          </form>
        </div>
      )}
    </LuxuryModalShell>
  );
}
