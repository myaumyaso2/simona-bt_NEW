'use client';

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconUser, SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';

export function AuthModal() {
  const { modal, closeModal, openModal } = useStore();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'CODE'>('PHONE');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (modal.type !== 'AUTH') return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('CODE');
    }, 600);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600);
  };

  const handleClose = () => {
    setStep('PHONE');
    setPhone('');
    setCode('');
    setSuccess(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#16191D] border border-[#2B313A] shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 text-[#87888A] hover:text-white rounded-xl border border-[#2B313A] hover:bg-[#1E2228] flex items-center justify-center transition cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal">
              <SimonaIconCheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
              Добро пожаловать в СИМОНА
            </h3>
            <p className="text-xs text-[#87888A] max-w-xs mx-auto mb-6">
              Вы успешно авторизованы в личном кабинете. Ваши списки избранного и история заказов синхронизированы.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-simona-teal hover:bg-[#008489] text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
            >
              Перейти к покупкам
            </button>
          </div>
        ) : step === 'PHONE' ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-simona-teal">
                <SimonaIconUser className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-white">
                  Личный кабинет
                </h3>
                <p className="text-xs text-[#87888A]">
                  Вход по номеру телефона
                </p>
              </div>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white placeholder-[#87888A] text-sm focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <p className="text-[11px] text-[#87888A] leading-relaxed">
                На указанный номер поступит SMS с кодом подтверждения для безопасного входа.
              </p>

              <button
                type="submit"
                disabled={loading || phone.length < 5}
                className="w-full py-3 rounded-xl bg-simona-teal hover:bg-[#008489] disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition flex items-center justify-center space-x-2 shadow-lg shadow-simona-teal/20"
              >
                <span>{loading ? 'Отправка...' : 'Получить SMS-код'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#2B313A]/60 flex items-center justify-between text-[11px]">
              <span className="text-[#87888A]">Вы дизайнер или архитектор?</span>
              <button
                onClick={() => {
                  handleClose();
                  openModal('B2B_CLUB');
                }}
                className="text-simona-teal hover:underline font-medium"
              >
                B2B-кабинет
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-simona-teal">
                <SimonaIconUser className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-white">
                  Введите код
                </h3>
                <p className="text-xs text-[#87888A]">
                  Код отправлен на {phone}
                </p>
              </div>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#D7D9DB] mb-1.5">
                  4-значный код из SMS
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="• • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-lg rounded-xl bg-[#1E2228] border border-[#2B313A] text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-[#87888A] hover:text-white transition"
                >
                  Изменить номер
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-simona-teal hover:underline"
                >
                  Отправить повторно
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 4}
                className="w-full py-3 rounded-xl bg-simona-teal hover:bg-[#008489] disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition flex items-center justify-center space-x-2 shadow-lg shadow-simona-teal/20"
              >
                <span>{loading ? 'Проверка...' : 'Войти'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
