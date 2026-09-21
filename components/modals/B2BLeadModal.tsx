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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-[#16181B]">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-[#87888A] hover:text-[#16181B] rounded-full hover:bg-zinc-100 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-simona-wine/10 text-simona-wine flex items-center justify-center mx-auto mb-4 border border-simona-wine/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">Проект принят на расчет!</h3>
            <p className="text-sm text-[#6E7074] font-normal max-w-sm mx-auto leading-relaxed">
              B2B-куратор салона СИМОНА подготовит полную инженерную спецификацию, схемы встройки и расчет партнерского вознаграждения в течение 24 часов.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-simona-wine/10 text-simona-wine border border-simona-wine/25 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Клуб архитекторов и дизайнеров</span>
            </div>

            <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">
              Загрузка проекта на расчет
            </h3>
            <p className="text-xs text-[#6E7074] font-normal mt-1">
              Получите полную спецификацию приборов, 3D-модели и условия агентского вознаграждения до 10%.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Ваше имя / Студия *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Мария Иванова / Studio Design"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-wine focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Телефон для связи *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-wine focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Ссылка на портфолио / соцсети</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://t.me/... или сайт студии"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-wine focus:bg-white transition"
                />
              </div>

              {/* File Upload Trigger */}
              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Прикрепить проект (PDF / DWG / ZIP)</label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-black/[0.1] hover:border-simona-wine rounded-2xl cursor-pointer bg-[#F8F9FA] hover:bg-zinc-100 transition">
                  <Upload className="w-5 h-5 text-simona-wine mb-1" />
                  <span className="text-xs text-[#3E3D40] font-medium">
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
                <label className="block text-[#3E3D40] mb-1 font-semibold">Комментарий или ориентир по бюджету</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Квартира 120м², нужен встроенный холод, духовой шкаф с паром и тихая вытяжка..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-wine focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-wine/25 active:scale-98"
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
