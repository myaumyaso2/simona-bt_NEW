'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconGuarantee,
  SimonaIconShieldCheck,
  SimonaIconBuilding,
  SimonaIconCheck,
  SimonaIconCheckCircle,
  SimonaIconFile,
  SimonaIconDownload,
  SimonaIconPhoneSolid,
  SimonaIconArrowRight,
  SimonaIconClock,
  SimonaIconInfo,
} from '@/components/brand/SimonaIcons';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';
import { useSiteContent } from '@/components/providers/ContentContext';

export default function WarrantyPage() {
  const content = useSiteContent();
  const data = content.warrantyPage;
  const contacts = content.contacts;
  const analyticsData = useAnalyticsData();

  const [claimType, setClaimType] = useState<'WARRANTY' | 'RETURN'>('WARRANTY');
  const [activeReturnTab, setActiveReturnTab] = useState<'offline' | 'distance' | 'defect' | 'expert'>('distance');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('ASKO');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: claimType === 'WARRANTY' ? 'WARRANTY_CLAIM' : 'RETURN_REQUEST',
          name,
          phone,
          comment: `Тип: ${claimType === 'WARRANTY' ? 'Гарантийный выезд' : 'Возврат/обмен'} | Бренд: ${brand} | Модель: ${model} | Сер. номер: ${serial} | Описание: ${issue}`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка отправки заявки');
      setSuccess(true);
      trackGoal('WARRANTY_CLAIM_SUBMIT', { brand, model, claimType });
    } catch (err) {
      console.error(err);
      alert(`Ошибка при отправке. Пожалуйста, свяжитесь с нами: ${contacts.phoneService || '+7 (951) 905-33-91'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadBlank = () => {
    const formContent = `ЗАЯВЛЕНИЕ О ВОЗВРАТЕ / ГАРАНТИЙНОМ ОБСЛУЖИВАНИИ ТОВАРА
В Службу клиентского сервиса «СИМОНА» (г. Нижний Новгород, ул. Белинского, 15)
От покупателя (ФИО): __________________________________________________
Паспортные данные: Серия ______ Номер ________ Кем выдан: ______________
Телефон: _______________________ Email: _______________________________

ЗАЯВЛЕНИЕ
Прошу принять к рассмотрению товар:
Наименование прибора: ________________________________________________
Бренд: _____________________ Модель (артикул): ________________________
Серийный номер (S/N): _________________ Дата покупки: ________________
Номер кассового/товарного чека или заказа 1С: _________________________

Характер обращения:
[ ] Возврат товара надлежащего качества (дистанционная покупка, 7 дней)
[ ] Обнаружен производственный дефект в течение 15 дней (ст. 18 ЗоЗПП РФ)
[ ] Существенный недостаток / гарантийный ремонт свыше 45 дней

Подробное описание дефекта или причины обращения:
______________________________________________________________________

Прошу:
[ ] Произвести гарантийный ремонт в авторизованном СЦ
[ ] Произвести замену на аналогичный прибор
[ ] Вернуть денежные средства на банковскую карту / расчетный счет

Банковские реквизиты для возврата (при необходимости):
Банк получателя: _____________________ БИК: __________________________
Корр. счет: __________________________ Номер счета: __________________

Дата: «____» ____________ 202__ г.     Подпись: ______________________`;

    const blob = new Blob([formContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Zayavlenie_na_vozvrat_Simona_bt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPillarIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <SimonaIconFile className="w-5 h-5 text-simona-teal" />;
      case 1:
        return <SimonaIconShieldCheck className="w-5 h-5 text-simona-teal" />;
      case 2:
        return <SimonaIconGuarantee className="w-5 h-5 text-simona-teal" />;
      case 3:
      default:
        return <SimonaIconClock className="w-5 h-5 text-simona-teal" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. Hero Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              {data.badge}
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              {data.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#claim-form"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>{data.ctaButton}</span>
                <SimonaIconArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#brands"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconGuarantee className="w-4 h-4 text-simona-teal" />
                <span>Гарантии брендов</span>
              </a>
              <a
                href="#returns"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconShieldCheck className="w-4 h-4 text-simona-teal" />
                <span>Возврат и обмен (ЗоЗПП)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. 4 Pillars of Warranty Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.pillars?.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center">
                {getPillarIcon(idx)}
              </div>
              <h3 className="text-base font-montserrat font-bold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 3. Brand Warranties Grid */}
        <div id="brands" className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
              {data.brandSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              {data.brandSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A]">
              {data.brandSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.brandSection.brands?.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">{item.brand}</div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-simona-teal/10 text-simona-teal border border-simona-teal/20 text-xs font-semibold">
                    {item.period}
                  </div>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#2B313A]/60 flex items-center justify-between text-xs">
                  <span className="text-[#87888A]">Горячая линия:</span>
                  <a
                    href={`tel:${item.hotline.replace(/[^+\d]/g, '')}`}
                    className="text-white hover:text-simona-teal font-medium transition-colors font-mono"
                  >
                    {item.hotline}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Authorized Service Centers Rule */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-left space-y-1">
            <SectionBadge variant="teal">
              {data.ascRule.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              {data.ascRule.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A]">
              {data.ascRule.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Регламент взаимодействия с АСЦ:</h3>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                {data.ascRule.points?.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#1E2228] border border-simona-teal/30 space-y-2.5">
              <div className="flex items-center space-x-2">
                <SimonaIconBuilding className="w-5 h-5 text-simona-teal shrink-0" />
                <h3 className="text-sm font-bold text-white">
                  {data.ascRule.salonRoleTitle}
                </h3>
              </div>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {data.ascRule.salonRoleDesc}
              </p>
              <div className="pt-2 text-xs text-zinc-300">
                <span>Флагманский салон: г. Нижний Новгород, ул. Белинского, 15 • </span>
                <a href={`tel:${contacts.phoneRaw}`} className="text-simona-teal hover:underline font-mono">
                  {contacts.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Returns & Exchange Section (ЗоЗПП РФ) */}
        <div id="returns" className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B313A] pb-4">
            <div className="text-left space-y-1">
              <SectionBadge variant="teal">
                {data.returnsSection.badge}
              </SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                {data.returnsSection.title}
              </h2>
              <p className="text-xs text-[#87888A]">
                {data.returnsSection.lead}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveReturnTab('distance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeReturnTab === 'distance'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Интернет-магазин (7 дней)
              </button>
              <button
                type="button"
                onClick={() => setActiveReturnTab('offline')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeReturnTab === 'offline'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Покупка в салоне (офлайн)
              </button>
              <button
                type="button"
                onClick={() => setActiveReturnTab('defect')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeReturnTab === 'defect'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Производственный брак
              </button>
              <button
                type="button"
                onClick={() => setActiveReturnTab('expert')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeReturnTab === 'expert'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Сроки и экспертиза
              </button>
            </div>
          </div>

          {/* Tab 1: Distance */}
          {activeReturnTab === 'distance' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed text-left">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A]">
                <strong className="text-white text-sm block mb-1">
                  {data.returnsSection.distanceTitle}
                </strong>
                <span>{data.returnsSection.distanceDesc}</span>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-white">Требования к возврату надлежащего качества:</h4>
                <ul className="space-y-1.5 pl-2">
                  {data.returnsSection.distancePoints?.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Offline */}
          {activeReturnTab === 'offline' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed text-left">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A]">
                <strong className="text-white text-sm block mb-1">
                  {data.returnsSection.offlineTitle}
                </strong>
                <span>{data.returnsSection.offlineDesc}</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                Постановление Правительства РФ от 10.11.2011 № 924 относит холодильники, стиральные машины, духовые шкафы, варочные панели и кухонные комбайны к технически сложным товарам. Обмен исправного прибора после покупки в торговом зале законом не предусмотрен.
              </div>
            </div>
          )}

          {/* Tab 3: Defect */}
          {activeReturnTab === 'defect' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed text-left">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A]">
                <strong className="text-white text-sm block mb-1">
                  {data.returnsSection.defectTitle}
                </strong>
                <span>{data.returnsSection.defectDesc}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#1E2228]/60 border border-[#2B313A] space-y-2">
                  <span className="text-simona-teal font-semibold text-xs block">В первые 15 дней с момента покупки:</span>
                  <ul className="space-y-1.5 pl-2 text-zinc-300">
                    {data.returnsSection.defectPoints15Days?.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#1E2228]/60 border border-[#2B313A] space-y-2">
                  <span className="text-simona-teal font-semibold text-xs block">По истечении 15 дней:</span>
                  <ul className="space-y-1.5 pl-2 text-zinc-300">
                    {data.returnsSection.defectPointsAfter15Days?.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Expert & Periods */}
          {activeReturnTab === 'expert' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed text-left">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A]">
                <strong className="text-white text-sm block mb-1">
                  {data.returnsSection.expertTitle}
                </strong>
                <span>{data.returnsSection.expertDesc}</span>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-white">Сроки удовлетворения требований (ЗоЗПП РФ):</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.returnsSection.periods?.map((item, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-2xl bg-[#1E2228]/60 border border-[#2B313A] space-y-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-simona-teal/15 text-simona-teal font-mono font-bold text-xs">
                        {item.period}
                      </span>
                      <div className="font-semibold text-white">{item.title}</div>
                      <p className="text-[11px] text-[#87888A] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blank Download Banner */}
          <div className="p-5 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <div className="text-white font-semibold text-sm">
                {data.returnsSection.blankDownloadTitle}
              </div>
              <p className="text-xs text-[#87888A] max-w-xl mt-1">
                {data.returnsSection.blankDownloadDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBlank}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 shrink-0"
            >
              <SimonaIconDownload className="w-4 h-4" />
              <span>{data.returnsSection.blankDownloadButton}</span>
            </button>
          </div>
        </div>

        {/* 6. Diagnostic Form & Conditions Split */}
        <div id="claim-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Rules & Precautions (5 Cols) */}
          <div className="lg:col-span-5 bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div>
              <SectionBadge variant="teal">
                {data.warrantyConditions.badge}
              </SectionBadge>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                {data.warrantyConditions.title}
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {data.warrantyConditions.lead}
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300">
              {data.warrantyConditions.rules?.map((rule, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2.5">
                  <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{rule.title}: </strong>
                    <span>{rule.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] space-y-1.5 text-xs">
              <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                <SimonaIconInfo className="w-4 h-4 shrink-0" />
                <span>{data.warrantyConditions.voidNoticeTitle}</span>
              </div>
              <p className="text-[#87888A] leading-relaxed text-[11px]">
                {data.warrantyConditions.voidNoticeDesc}
              </p>
            </div>
          </div>

          {/* Electronic Claim Submission Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div>
              <SectionBadge variant="teal">
                {data.claimForm.badge}
              </SectionBadge>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                {data.claimForm.title}
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                {data.claimForm.subtitle}
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <SimonaIconCheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">
                  {data.claimForm.successTitle}
                </h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  {data.claimForm.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide"
                >
                  Подать еще одно обращение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1.5 font-semibold">Характер обращения *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setClaimType('WARRANTY')}
                      className={`p-3 rounded-xl border text-left transition ${
                        claimType === 'WARRANTY'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">Гарантийный случай</div>
                      <div className="text-[10px] text-[#87888A]">Неисправность, вызов мастера АСЦ</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setClaimType('RETURN')}
                      className={`p-3 rounded-xl border text-left transition ${
                        claimType === 'RETURN'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">Возврат или замена</div>
                      <div className="text-[10px] text-[#87888A]">7 дней интернет / производственный дефект</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Сергей"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Номер телефона *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Бренд техники *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal transition"
                    >
                      <option value="ASKO">ASKO</option>
                      <option value="Miele">Miele</option>
                      <option value="Liebherr">Liebherr</option>
                      <option value="Smeg">Smeg</option>
                      <option value="Körting">Körting</option>
                      <option value="Omoikiri">Omoikiri</option>
                      <option value="VARD">VARD</option>
                      <option value="Midea">Midea</option>
                      <option value="Другой">Другой производитель</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Модель (артикул)</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Например: HI 1995 G"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Серийный номер (S/N)</label>
                    <input
                      type="text"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="С шильдика прибора"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Описание дефекта или причина обращения *</label>
                  <textarea
                    required
                    rows={3}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Опишите дефект (код ошибки, характер неисправности) либо причину возврата..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Регистрация...' : data.claimForm.buttonText}</span>
                  <SimonaIconArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-[#87888A] text-center">
                  Все обращения регистрируются в соответствии со ст. 18–22 Закона РФ «О защите прав потребителей».
                </p>
              </form>
            )}
          </div>

        </div>

        {/* 7. Authentic Hot Contact Bar */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 text-simona-teal flex items-center justify-center shrink-0">
              <SimonaIconPhoneSolid className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Служба сервисной поддержки СИМОНА</span>
              <span className="text-[#87888A]">Консультации по гарантийным случаям и координация вызова мастера</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${contacts.phoneServiceRaw || '+79519053391'}`}
              className="text-white hover:text-simona-teal font-semibold font-mono text-sm transition"
            >
              {contacts.phoneService || '+7 (951) 905-33-91'}
            </a>
            <span className="text-[#3E4550]">|</span>
            <a
              href={`mailto:${contacts.emailService || 'service1@simona-bt.ru'}`}
              className="text-[#87888A] hover:text-white transition"
            >
              {contacts.emailService || 'service1@simona-bt.ru'}
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
