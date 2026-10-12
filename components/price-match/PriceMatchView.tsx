'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSiteContent } from '@/components/providers/ContentContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconTag,
  SimonaIconClock,
  SimonaIconInfo,
  SimonaIconCheck,
  SimonaIconCheckCircle,
  SimonaIconArrowRight,
  SimonaIconTelegram,
  SimonaIconMax,
} from '@/components/brand/SimonaIcons';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

function formatRuPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  let normalized = digits;
  if (normalized.startsWith('7') || normalized.startsWith('8')) {
    normalized = normalized.slice(1);
  }
  const part1 = normalized.slice(0, 3);
  const part2 = normalized.slice(3, 6);
  const part3 = normalized.slice(6, 8);
  const part4 = normalized.slice(8, 10);

  let formatted = '+7';
  if (part1) formatted += ` (${part1}`;
  if (part1.length === 3) formatted += ')';
  if (part2) formatted += ` ${part2}`;
  if (part3) formatted += `-${part3}`;
  if (part4) formatted += `-${part4}`;
  return formatted;
}

export function PriceMatchView() {
  const content = useSiteContent();
  const data = content.priceMatchPage;
  const analyticsData = useAnalyticsData();

  const [productName, setProductName] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientPhone(formatRuPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agree) {
      setErrorMessage('Пожалуйста, подтвердите согласие на обработку персональных данных');
      return;
    }

    const digitsOnly = clientPhone.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона (10 цифр с кодом оператора)');
      return;
    }

    setSubmitting(true);
    try {
      const commentText = [
        `[Товар / Модель]: ${productName.trim() || 'Не указан'}`,
        `[Ссылка на конкурента]: ${competitorUrl.trim()}`,
        `[Цена у конкурента]: ${competitorPrice.trim()} ₽`,
      ].join('\n');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PRICE_MATCH',
          name: clientName.trim() || 'Покупатель (Снизим цену)',
          phone: clientPhone.trim(),
          productName: productName.trim() || undefined,
          comment: commentText,
          ...analyticsData,
        }),
      });

      if (!res.ok) {
        throw new Error('Ошибка сервера при отправке запроса');
      }

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Не удалось отправить заявку');
      }

      setSuccess(true);
      trackGoal('PRICE_MATCH_SUBMIT', { productName, competitorPrice });
    } catch (err: unknown) {
      console.error('[PriceMatch] Submission error:', err);
      const msg = err instanceof Error ? err.message : 'Произошла ошибка при отправке заявки.';
      setErrorMessage(`${msg} Пожалуйста, свяжитесь с нами по телефону ${content.contacts.phone}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">

        {/* 1. Header Hero Screen */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4 relative z-10">
            <SectionBadge variant="teal">
              {data.badge}
            </SectionBadge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              {data.title}
            </h1>

            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              {data.subtitle}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="#request-form"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Отправить заявку на расчет</span>
                <SimonaIconArrowRight className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition"
              >
                <span>{data.catalogButtonText}</span>
                <SimonaIconArrowRight className="w-3.5 h-3.5 text-[#87888A]" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Honest Consideration Notice (Честный дисклеймер со старого сайта) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#16191D] border border-simona-teal/30 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg shadow-simona-teal/5">
          <div className="w-11 h-11 rounded-xl bg-simona-teal/15 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0">
            <SimonaIconInfo className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-left flex-1">
            <div className="text-sm font-montserrat font-bold text-white">
              {data.noticeTitle}
            </div>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.noticeDesc}
            </p>
          </div>
        </div>

        {/* 3. How It Works: 3 Steps from original site */}
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-simona-teal">
              Порядок действий
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              {data.stepsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl">
              {data.stepsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-simona-teal/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-simona-teal px-2 py-0.5 rounded-md bg-simona-teal/10 border border-simona-teal/20">
                      Шаг {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-[#87888A] group-hover:text-simona-teal transition">
                      {idx === 0 ? (
                        <SimonaIconTag className="w-4 h-4" />
                      ) : idx === 1 ? (
                        <SimonaIconCheck className="w-4 h-4" />
                      ) : (
                        <SimonaIconClock className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-montserrat font-bold text-white group-hover:text-simona-teal-light transition">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx === 0 && (
                  <div className="pt-2">
                    <Link
                      href="/catalog"
                      className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:underline font-medium"
                    >
                      <span>Открыть каталог бытовой техники</span>
                      <SimonaIconArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Submission Form Section */}
        <div id="request-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form Context Info (5 Cols) */}
          <div className="lg:col-span-5 bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 text-left">
            <div>
              <span className="text-xs font-semibold tracking-wider text-simona-teal">
                {data.formBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white mt-1 mb-2">
                {data.formTitle}
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {data.formSubtitle}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-semibold font-montserrat">
                <SimonaIconClock className="w-4 h-4 text-simona-teal shrink-0" />
                <span>Время обработки заявок</span>
              </div>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Специалисты отдела продаж обрабатывают обращения ежедневно с 10:00 до 20:00. Ответ поступает в течение одного часа с момента отправки.
              </p>
            </div>

            <div className="pt-2 border-t border-[#2B313A]/60 space-y-3">
              <div className="text-xs text-[#87888A]">
                Или отправьте ссылку консультанту напрямую в удобный мессенджер:
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`https://t.me/SimonaExpert?text=${encodeURIComponent(
                    'Здравствуйте! Нашел технику дешевле в другом магазине. Хочу согласовать цену в СИМОНЕ. Ссылка:'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-white text-xs font-medium transition"
                >
                  <SimonaIconTelegram className="w-3.5 h-3.5 text-simona-teal" />
                  <span>Telegram</span>
                </a>

                <a
                  href="https://max.ru/u/f9LHodD0cOIuy7am7AqiTUQzRCTzos1MKUnVod70alUJhmKBTjkjQi7MYf4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-white text-xs font-medium transition"
                >
                  <SimonaIconMax className="w-3.5 h-3.5 text-simona-teal" />
                  <span>MAX</span>
                </a>
              </div>
            </div>
          </div>

          {/* Actual Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <SimonaIconCheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-montserrat font-bold text-white">
                  {data.formSuccessTitle}
                </h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  {data.formSuccessDesc}
                </p>
                <div className="pt-3">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-md shadow-simona-teal/20"
                  >
                    <span>Перейти в каталог</span>
                    <SimonaIconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-[#87888A] mb-1.5 font-medium">
                    Модель прибора или артикул в «СИМОНЕ»
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Например: Духовой шкаф Asko OCS8678G или код 89083"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#87888A] mb-1.5 font-medium">
                      Ссылка на товар у конкурента <span className="text-simona-teal">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={competitorUrl}
                      onChange={(e) => setCompetitorUrl(e.target.value)}
                      placeholder="https://magazin.ru/product..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#87888A] mb-1.5 font-medium">
                      Цена у конкурента (₽) <span className="text-simona-teal">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={competitorPrice}
                      onChange={(e) => setCompetitorPrice(e.target.value)}
                      placeholder="98500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#87888A] mb-1.5 font-medium">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Как к вам обращаться"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#87888A] mb-1.5 font-medium">
                      Контактный телефон <span className="text-simona-teal">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition font-mono"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#87888A] leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 rounded border-[#2B313A] bg-[#1E2228] text-simona-teal focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>
                      Согласен с{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-simona-teal hover:underline"
                      >
                        политикой конфиденциальности
                      </Link>{' '}
                      и условиями обработки персональных данных
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Отправка запроса...</span>
                  ) : (
                    <>
                      <span>Отправить заявку</span>
                      <SimonaIconArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#87888A] text-center">
                  Мы свяжемся с вами в течение 1 часа в рабочее время (ежедневно с 10:00 до 20:00).
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
