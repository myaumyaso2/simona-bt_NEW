'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconGuarantee,
  SimonaIconConsultation,
  SimonaIconBuilding,
  SimonaIconCheck,
  SimonaIconCheckCircle,
  SimonaIconFile,
  SimonaIconDownload,
  SimonaIconPhoneSolid,
  SimonaIconArrowRight,
} from '@/components/brand/SimonaIcons';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';
import { useSiteContent } from '@/components/providers/ContentContext';

const tocItems = [
  { id: 'installation', num: '01.', label: 'Установка и подключение' },
  { id: 'scheme-audit', num: '02.', label: 'Сверка схем под проект кухни' },
  { id: 'storage', num: '03.', label: 'Бесплатное хранение на складе' },
  { id: 'delivery', num: '04.', label: 'Аккуратная доставка и занос' },
  { id: 'pdf-guide', num: '05.', label: 'Регламент монтажа (PDF)' },
  { id: 'order-service', num: '06.', label: 'Оставить заявку на монтаж' },
];

const pillarAnchorIds = ['installation', 'scheme-audit', 'storage', 'delivery'];

export default function ServicesPage() {
  const content = useSiteContent();
  const data = content.servicesPage;
  const contacts = content.contacts;
  const analyticsData = useAnalyticsData();

  const [serviceType, setServiceType] = useState('INSTALLATION');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;

    const target = document.getElementById(id);
    if (!target) return;

    const lenis = (window as any).__simonaLenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { offset: -100, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROJECT_MATCHING',
          name,
          phone,
          comment: `Услуга: ${serviceType === 'INSTALLATION' ? 'Установка и подключение' : 'Сверка монтажных схем'} | Адрес: ${address} | Детали: ${comment}`,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка отправки заявки');

      setSuccess(true);
      trackGoal('SERVICE_REQUEST_SUBMIT', { serviceType, name, phone });
    } catch (err) {
      console.error(err);
      alert(`Ошибка при отправке. Пожалуйста, свяжитесь с нами: ${contacts.phoneService || '+7 (951) 905-33-91'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getPillarIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <SimonaIconGuarantee className="w-6 h-6 text-simona-teal" />;
      case 1:
        return <SimonaIconConsultation className="w-6 h-6 text-simona-teal" />;
      case 2:
        return <SimonaIconBuilding className="w-6 h-6 text-simona-teal" />;
      case 3:
      default:
        return <SimonaIconDelivery className="w-6 h-6 text-simona-teal" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. Hero Header */}
        <section className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl text-left space-y-5">
            <SectionBadge variant="teal">
              {data.badge}
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              {data.subtitle}
            </p>

            {/* Table of Contents / Quick Navigation */}
            <div className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 p-4 sm:p-5 rounded-xl bg-[#1E2228] border border-[#2B313A]">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="flex items-center justify-between py-2 sm:py-2.5 border-b border-[#2B313A]/50 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0 text-xs sm:text-sm text-left group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono font-semibold text-simona-teal shrink-0">
                        {item.num}
                      </span>
                      <span className="font-medium text-[#D7D9DB] group-hover:text-white truncate transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <SimonaIconArrowRight className="w-3.5 h-3.5 text-[#87888A] group-hover:text-simona-teal group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. 4 Pillars of Service */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Стандарты качества" />
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              {data.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.pillars?.map((pillar, idx) => (
              <div
                key={idx}
                id={pillarAnchorIds[idx]}
                className="scroll-mt-28 bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center">
                      {getPillarIcon(idx)}
                    </div>
                    <span className="font-montserrat text-2xl font-bold text-[#3E4550]">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-5">
                    {pillar.desc}
                  </p>

                  {pillar.points && pillar.points.length > 0 && (
                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {pillar.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-2">
                          <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#2B313A] flex items-center justify-between text-xs">
                  <span className="font-medium text-simona-teal">
                    {pillar.highlight}
                  </span>
                  {idx === 3 && (
                    <Link
                      href="/delivery-payment"
                      className="text-[#87888A] hover:text-white inline-flex items-center gap-1 transition"
                    >
                      <span>Тарифы доставки</span>
                      <SimonaIconArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Official PDF Guide Card */}
        {data.pdfGuide && (
          <div id="pdf-guide" className="scroll-mt-28 bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl text-left">
                <SectionBadge variant="teal">
                  {data.pdfGuide.badge}
                </SectionBadge>
                <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
                  {data.pdfGuide.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
                  {data.pdfGuide.desc}
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={data.pdfGuide.fileUrl}
                  download="SIMONA_podklyuchenie.pdf"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
                >
                  <SimonaIconDownload className="w-4 h-4" />
                  <span>{data.pdfGuide.downloadText}</span>
                  <span className="text-[10px] text-white/70 ml-1">({data.pdfGuide.fileSize})</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 4. Order Service Form */}
        <div id="order-service" className="scroll-mt-28 bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-left space-y-2 mb-8">
              <SectionBadge variant="teal">
                {data.orderService.badge}
              </SectionBadge>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                {data.orderService.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A]">
                {data.orderService.subtitle}
              </p>
            </div>

            {success ? (
              <div className="bg-[#1E2228] border border-simona-teal/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto">
                  <SimonaIconCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white">
                  {data.orderService.successTitle}
                </h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto leading-relaxed">
                  {data.orderService.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide"
                >
                  Оформить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2">Какая услуга вам требуется?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType('INSTALLATION')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        serviceType === 'INSTALLATION'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Установка и подключение</div>
                      <div className="text-[10px] text-[#87888A] mt-0.5">Встройка приборов, навеска фасадов, пусконаладка</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('SCHEME_AUDIT')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        serviceType === 'SCHEME_AUDIT'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Сверка схем встройки</div>
                      <div className="text-[10px] text-[#87888A] mt-0.5">Проверка чертежей ниш и электрики по проекту</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Сергей"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Номер телефона *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (900) 000-00-00"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Адрес объекта (город, улица, дом)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="г. Нижний Новгород, ул. Белинского, кв. 14"
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Комментарий или перечень приборов</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: варочная панель ASKO, духовой шкаф Miele, вытяжка, посудомоечная машина..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Отправка...' : data.orderService.buttonText}</span>
                    <SimonaIconArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 5. Authentic Hot Contact Bar */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 text-simona-teal flex items-center justify-center shrink-0">
              <SimonaIconPhoneSolid className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                {data.contactsBar.title}
              </span>
              <span className="text-[#87888A]">
                {data.contactsBar.subtitle}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${data.contactsBar.phoneRaw || '+79519053391'}`}
              className="text-white hover:text-simona-teal font-semibold font-mono text-sm transition"
            >
              {data.contactsBar.phone || '+7 (951) 905-33-91'}
            </a>
            <span className="text-[#3E4550]">|</span>
            <a
              href={`mailto:${data.contactsBar.email || 'service1@simona-bt.ru'}`}
              className="text-[#87888A] hover:text-white transition"
            >
              {data.contactsBar.email || 'service1@simona-bt.ru'}
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
