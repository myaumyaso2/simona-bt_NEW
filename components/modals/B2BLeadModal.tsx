'use client';

import React, { useState } from 'react';
import { X, Award, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

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

  if (modal.type !== 'B2B_CLUB') return null;

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
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#14161A] border border-zinc-700 shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-simona-teal/20 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">Проект принят на расчет!</h3>
            <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
              B2B-куратор салона СИМОНА подготовит полную инженерную спецификацию, схемы встройки и расчет партнерского вознаграждения в течение 24 часов.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider transition"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-simona-teal/10 text-simona-teal border border-simona-teal/30 text-xs font-medium mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Клуб архитекторов и дизайнеров</span>
            </div>

            <h3 className="text-2xl font-serif text-white">
              Загрузка проекта на расчет
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Получите полную спецификацию приборов, 3D-модели и условия агентского вознаграждения до 10%.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Ваше имя / Студия *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Мария Иванова / Studio Design"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Телефон для связи *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Ссылка на портфолио / соцсети</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://t.me/... или сайт студии"
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              {/* File Upload Trigger */}
              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Прикрепить проект (PDF / DWG / ZIP)</label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-700 hover:border-simona-teal rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 transition">
                  <Upload className="w-5 h-5 text-simona-teal mb-1" />
                  <span className="text-xs text-zinc-300">
                    {fileName ? fileName : 'Нажмите для выбора файла с устройства'}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">До 50 МБ</span>
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
                <label className="block text-zinc-300 mb-1 font-medium">Комментарий или ориентир по бюджету</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Квартира 120м², нужен встроенный холод, духовой шкаф с паром и тихая вытяжка..."
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                {loading ? 'Отправка...' : 'Отправить проект на расчет'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
