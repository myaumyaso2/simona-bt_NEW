'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Home, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconConsultation, SimonaIconMax } from '@/components/brand/SimonaIcons';

export function EquipmentSelectionModal() {
  const { modal, closeModal } = useStore();
  const [needHomeVisit, setNeedHomeVisit] = useState(false);
  const [equipmentList, setEquipmentList] = useState('');
  const [budget, setBudget] = useState('');
  const [brands, setBrands] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (modal.type !== 'EQUIPMENT_SELECTION') return null;

  const popularBrands = ['Miele', 'ASKO', 'Liebherr', 'SMEG', 'OMOIKIRI', 'Falmec'];

  const toggleBrand = (brandName: string) => {
    if (brands.includes(brandName)) {
      setBrands(
        brands
          .split(',')
          .map((b) => b.trim())
          .filter((b) => b !== brandName)
          .join(', ')
      );
    } else {
      setBrands(brands ? `${brands}, ${brandName}` : brandName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Пожалуйста, укажите контактный телефон');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const commentDetails = [
        needHomeVisit ? '⚡ ТРЕБУЕТСЯ ВЫЕЗД НА ДОМ / ЗАМЕР' : null,
        equipmentList ? `Техника: ${equipmentList}` : null,
        budget ? `Бюджет: ${budget}` : null,
        brands ? `Бренды: ${brands}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EQUIPMENT_SELECTION',
          name: name.trim() || 'Клиент (Подбор)',
          phone: phone.trim(),
          comment: commentDetails || 'Заявка на подбор бытовой техники',
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка отправки');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setNeedHomeVisit(false);
    setEquipmentList('');
    setBudget('');
    setBrands('');
    setName('');
    setPhone('');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#16191D] border border-[#2B313A] shadow-2xl p-5 sm:p-7 text-white my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-[#87888A] hover:text-white rounded-xl hover:bg-[#1E2228] transition z-10"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-montserrat font-bold text-white mb-3">
              Заявка на подбор принята!
            </h3>
            <p className="text-sm text-[#D7D9DB] max-w-md mx-auto leading-relaxed mb-6">
              Эксперты салонов «СИМОНА» на ул. Белинского свяжутся с вами в ближайшее время, чтобы предложить оптимальные варианты приборов и подготовить спецификацию.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-sm font-semibold transition"
            >
              Отлично, понятно
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-start sm:items-center space-x-3 mb-2 pr-9">
              <div className="w-10 h-10 rounded-xl bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal flex-shrink-0 mt-0.5 sm:mt-0">
                <SimonaIconConsultation className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-montserrat font-bold text-white tracking-tight leading-snug">
                  Подбор бытовой техники
                </h2>
                <p className="text-[11px] sm:text-xs text-[#87888A]">
                  Флагманские шоурумы СИМОНА · ул. Белинского 15 и 11/66
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D7D9DB] mb-5 leading-relaxed">
              Отправьте запрос или список пожеланий — эксперты составят персональную спецификацию с выверкой монтажных схем и эксклюзивными условиями.
            </p>

            {/* Quick Messengers Block */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] mb-5">
              <div className="text-xs font-medium text-[#87888A] mb-3 text-center sm:text-left">
                Быстрая консультация в мессенджерах:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Telegram */}
                <a
                  href="https://t.me/SimonaExpert?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5.%20%D0%9C%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#2AABEE] hover:bg-[#2296d2] text-white text-xs sm:text-sm font-semibold transition space-x-2 shadow-md hover:shadow-lg hover:shadow-[#2AABEE]/25"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#2AABEE" />
                    <path
                      d="M5.4 11.95L17.15 7.42C17.69 7.22 18.17 7.55 17.99 8.28L15.99 17.71C15.84 18.39 15.44 18.55 14.87 18.23L11.82 15.98L10.35 17.39C10.19 17.55 10.05 17.69 9.74 17.69L9.96 14.54L15.69 9.36C15.94 9.14 15.64 9.02 15.31 9.24L8.23 13.7L5.18 12.75C4.52 12.54 4.51 12.09 5.4 11.95Z"
                      fill="white"
                    />
                  </svg>
                  <span>Написать в Telegram</span>
                </a>

                {/* MAX */}
                <a
                  href="https://max.ru/u/f9LHodD0cOIuy7am7AqiTUQzRCTzos1MKUnVod70alUJhmKBTjkjQi7MYf4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#5C3BFE] hover:bg-[#4B2BE8] text-white text-xs sm:text-sm font-semibold transition space-x-2 shadow-md hover:shadow-lg hover:shadow-[#5C3BFE]/25"
                >
                  <SimonaIconMax className="w-4 h-4" />
                  <span>Написать в MAX</span>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2B313A]" />
              </div>
              <div className="relative px-3 bg-[#16191D] text-[11px] uppercase tracking-wider text-[#87888A]">
                или заполните параметры заявки
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Home Visit Card */}
              <div
                onClick={() => setNeedHomeVisit(!needHomeVisit)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  needHomeVisit
                    ? 'bg-simona-teal/10 border-simona-teal shadow-[0_0_15px_rgba(0,151,156,0.15)]'
                    : 'bg-[#1E2228] border-[#2B313A] hover:border-[#3E3D40]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      needHomeVisit
                        ? 'bg-simona-teal text-white'
                        : 'bg-[#111315] text-[#87888A]'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Нужен выезд на дом / замер на объекте!
                    </div>
                    <div className="text-xs text-[#87888A]">
                      Инженер снимет точные размеры ниш, розеток и вентиляции
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={needHomeVisit}
                  onChange={() => {}}
                  className="w-5 h-5 rounded accent-simona-teal pointer-events-none cursor-pointer"
                />
              </div>

              {/* Equipment Needs Textarea */}
              <div>
                <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                  Какая техника вам нужна?
                </label>
                <textarea
                  rows={2}
                  value={equipmentList}
                  onChange={(e) => setEquipmentList(e.target.value)}
                  placeholder="Например: духовой шкаф, индукция 80 см, вытяжка, посудомойка, винный шкаф..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition resize-none"
                />
              </div>

              {/* Budget & Brands (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                    Какой бюджет?
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Например: до 500 000 ₽"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                    Какие бренды предпочтительны?
                  </label>
                  <input
                    type="text"
                    value={brands}
                    onChange={(e) => setBrands(e.target.value)}
                    placeholder="Miele, ASKO, SMEG..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>
              </div>

              {/* Popular Brand Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-[#87888A] mr-1">Быстрый выбор:</span>
                {popularBrands.map((b) => {
                  const selected = brands.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBrand(b)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        selected
                          ? 'bg-simona-teal text-white'
                          : 'bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
                      }`}
                    >
                      {selected ? `✓ ${b}` : `+ ${b}`}
                    </button>
                  );
                })}
              </div>

              {/* Name & Phone (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                    Контактный телефон <span className="text-simona-teal">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="selection_agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-simona-teal cursor-pointer"
                />
                <label
                  htmlFor="selection_agree"
                  className="text-xs text-[#87888A] leading-tight cursor-pointer"
                >
                  Соглашаюсь с{' '}
                  <a
                    href="/politika"
                    target="_blank"
                    className="text-[#D7D9DB] hover:text-white underline"
                  >
                    политикой конфиденциальности компании
                  </a>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agree}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/25 hover:shadow-simona-teal/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Отправить заявку эксперту</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
