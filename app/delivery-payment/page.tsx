'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteContent } from '@/components/providers/ContentContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconBuilding,
  SimonaIconPackage,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
  SimonaIconCheck,
  SimonaIconFile,
  SimonaIconArrowRight,
  SimonaIconCreditCard,
  SimonaIconQrCode,
  SimonaIconBanknote,
  SimonaIconShieldCheck,
  SimonaIconInfo,
} from '@/components/brand/SimonaIcons';

export default function DeliveryPaymentPage() {
  const content = useSiteContent();
  const data = content.deliveryPaymentPage;

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* 1. Header Hero */}
        <section className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              {data.badge}
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-semibold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              {data.subtitle}
            </p>

            {/* Service Notice Box */}
            <div className="p-4 rounded-xl bg-[#1E2228] border border-simona-teal/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-simona-teal/10 text-simona-teal flex items-center justify-center shrink-0 mt-0.5">
                <SimonaIconPhoneSolid className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <span>{data.heroNotice}</span>
                <span className="block text-xs text-[#87888A] mt-1">
                  Единый справочный телефон: <a href={`tel:${content.contacts.phoneRaw}`} className="text-simona-teal font-medium hover:underline">{content.contacts.phone}</a>
                </span>
              </div>
            </div>

            {/* Quick Anchor Navigation */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="#pickup"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconBuilding className="w-3.5 h-3.5 text-simona-teal" />
                <span>Самовывоз</span>
              </a>
              <a
                href="#nn-delivery"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconDelivery className="w-3.5 h-3.5 text-simona-teal" />
                <span>Нижний Новгород</span>
              </a>
              <a
                href="#oblast-delivery"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconDelivery className="w-3.5 h-3.5 text-simona-teal" />
                <span>Область</span>
              </a>
              <a
                href="#rules"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconInfo className="w-3.5 h-3.5 text-simona-teal" />
                <span>Правила приемки</span>
              </a>
              <a
                href="#intercity"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconShieldCheck className="w-3.5 h-3.5 text-simona-teal" />
                <span>Регионы РФ</span>
              </a>
              <a
                href="#payment"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-medium tracking-wide transition hover:border-simona-teal/40"
              >
                <SimonaIconCreditCard className="w-3.5 h-3.5 text-simona-teal" />
                <span>Способы оплаты</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. Self-pickup from Warehouse */}
        <section id="pickup" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.selfPickup.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.selfPickup.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A]">
              Выдача оплаченных заказов и крупногабаритной техники непосредственно со склада компании.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Address & Checkpoint instructions */}
            <div className="lg:col-span-7 bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0">
                  <SimonaIconPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-montserrat font-semibold text-white">
                    {data.selfPickup.address}
                  </h3>
                  <div className="text-xs text-[#87888A] mt-0.5">
                    {data.selfPickup.territory}
                  </div>
                </div>
              </div>

              {/* Passcode Callout */}
              <div className="p-4 rounded-xl bg-[#16191D] border border-simona-teal/40 text-xs text-zinc-300 space-y-1">
                <div className="text-simona-teal font-semibold flex items-center gap-1.5">
                  <SimonaIconInfo className="w-4 h-4 shrink-0" />
                  <span>Порядок проезда через КПП:</span>
                </div>
                <p className="leading-relaxed pl-5 text-[#D7D9DB]">
                  {data.selfPickup.passCode}
                </p>
              </div>

              {/* Storage Standard from PRODUCT.md */}
              <div className="p-4 rounded-xl bg-[#16191D] border border-[#2B313A] text-xs text-[#87888A] space-y-1">
                <div className="text-white font-medium flex items-center gap-1.5">
                  <SimonaIconShieldCheck className="w-4 h-4 text-simona-teal shrink-0" />
                  <span>Сервис ответственного хранения:</span>
                </div>
                <p className="leading-relaxed pl-5">
                  {data.selfPickup.storageNotice}
                </p>
              </div>
            </div>

            {/* Warehouse Working Hours */}
            <div className="lg:col-span-5 bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0">
                  <SimonaIconClock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-montserrat font-semibold text-white">
                  Режим работы склада
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-3 rounded-lg bg-[#16191D] border border-[#2B313A]">
                  <span className="text-[#87888A]">Понедельник — пятница</span>
                  <span className="text-white font-semibold">10:00 — 17:00</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-[#16191D] border border-[#2B313A]">
                  <span className="text-[#87888A]">Суббота</span>
                  <span className="text-white font-semibold">10:00 — 14:30</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-[#16191D] border border-[#2B313A]">
                  <span className="text-[#87888A]">Воскресенье</span>
                  <span className="text-rose-400 font-semibold">Выходной</span>
                </div>
              </div>

              <div className="text-[11px] text-[#87888A] pt-1">
                Перед визитом на склад рекомендуем связаться с вашим менеджером для подтверждения готовности документов к отгрузке.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Nizhny Novgorod Delivery */}
        <section id="nn-delivery" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.nnDelivery.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.nnDelivery.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.nnDelivery.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tariff Table */}
            <div className="lg:col-span-8 bg-[#1E2228] border border-[#2B313A] rounded-xl overflow-hidden">
              <div className="p-4 bg-[#16191D] border-b border-[#2B313A] text-xs font-semibold text-white flex justify-between items-center">
                <span>Количество приборов в заказе</span>
                <span>Стоимость доставки</span>
              </div>
              <div className="divide-y divide-[#2B313A] text-xs sm:text-sm">
                {data.nnDelivery.tariffs.map((t, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center hover:bg-[#252B33] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-simona-teal/10 text-simona-teal flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </div>
                      <span className="text-[#D7D9DB] font-medium">{t.units}</span>
                    </div>
                    <span className="font-montserrat font-bold text-white text-base sm:text-lg">
                      {t.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Side by side footnote */}
              <div className="p-4 bg-[#16191D] border-t border-[#2B313A] text-xs text-[#87888A] flex items-start gap-2.5">
                <SimonaIconPackage className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                <span>{data.nnDelivery.sideBySideNote}</span>
              </div>
            </div>

            {/* Schedule & Intervals */}
            <div className="lg:col-span-4 bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0">
                  <SimonaIconClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-montserrat font-semibold text-white">
                    График и интервалы
                  </h3>
                  <div className="text-[11px] text-simona-teal">
                    С 10:00 до 22:00 (кроме вторника)
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#87888A] leading-relaxed">
                {data.nnDelivery.intervalNote}
              </p>

              <div className="p-3 rounded-lg bg-[#16191D] border border-[#2B313A] text-xs text-zinc-300">
                <span className="text-white font-medium block mb-1">Точный двухчасовой интервал:</span>
                За день до доставки логистическая служба согласует с вами удобное двухчасовое окно прибытия экипажа.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Nizhny Novgorod Oblast Delivery */}
        <section id="oblast-delivery" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.oblastDelivery.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.oblastDelivery.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.oblastDelivery.lead}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-simona-teal/10 text-simona-teal text-xs font-semibold">
              <SimonaIconClock className="w-3.5 h-3.5" />
              <span>{data.oblastDelivery.schedule}</span>
            </div>
          </div>

          {/* Zones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.oblastDelivery.zones.map((zone, zIdx) => (
              <div key={zIdx} className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-simona-teal uppercase tracking-wide">
                      Тарифная зона {zIdx + 1}
                    </span>
                    <span className="text-[11px] text-[#87888A]">по вторникам</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-montserrat font-semibold text-white">
                    {zone.title}
                  </h3>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {zone.cities}
                  </p>
                </div>

                {/* Tariffs List */}
                <div className="pt-2 border-t border-[#2B313A] space-y-2">
                  {zone.tariffs.map((t, tIdx) => (
                    <div key={tIdx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-[#16191D] border border-[#2B313A]">
                      <span className="text-[#D7D9DB]">{t.units}</span>
                      <span className="font-montserrat font-bold text-white text-sm">
                        {t.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Oblast Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#87888A]">
            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-2.5">
              <SimonaIconPackage className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
              <span>{data.oblastDelivery.sideBySideNote}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-2.5">
              <SimonaIconDelivery className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
              <span>{data.oblastDelivery.over100kmNote}</span>
            </div>
          </div>
        </section>

        {/* 5. Operational Rules & Inspection («Обратите внимание!») */}
        <section id="rules" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.rules.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.rules.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.rules.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.rules.items.map((rule, idx) => (
              <div key={idx} className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-5 space-y-3 hover:border-simona-teal/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-simona-teal">
                    {rule.num}
                  </span>
                  <SimonaIconInfo className="w-3.5 h-3.5 text-[#87888A]" />
                </div>
                <h3 className="text-sm font-montserrat font-semibold text-white">
                  {rule.title}
                </h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Intercity Delivery Across Russia */}
        <section id="intercity" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.intercityTK.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.intercityTK.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.intercityTK.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* TK Terms List */}
            <div className="lg:col-span-7 bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-3.5 text-xs">
              <h3 className="text-sm font-montserrat font-semibold text-white mb-2">
                Регламент и гарантии транспортировки:
              </h3>
              <ul className="space-y-3 text-zinc-300">
                {data.intercityTK.terms.map((term, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2.5">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Requirements & Damage Notice */}
            <div className="lg:col-span-5 space-y-4">
              {/* Documents Box */}
              <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 space-y-3 text-xs">
                <h3 className="text-sm font-montserrat font-semibold text-white flex items-center gap-2">
                  <SimonaIconFile className="w-4 h-4 text-simona-teal" />
                  <span>Документы для получения в ТК:</span>
                </h3>
                <div className="p-3 rounded-lg bg-[#16191D] border border-[#2B313A] text-[#87888A] space-y-2">
                  <div>
                    <span className="text-white font-medium block">Физическим лицам:</span>
                    <span>{data.intercityTK.docsFiz}</span>
                  </div>
                  <div className="pt-1 border-t border-[#2B313A]">
                    <span className="text-white font-medium block">Юридическим лицам:</span>
                    <span>{data.intercityTK.docsYur}</span>
                  </div>
                </div>
              </div>

              {/* Damage Protocol Notice */}
              <div className="bg-[#1E2228] border border-amber-500/40 rounded-xl p-5 text-xs space-y-2">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <SimonaIconShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Внимание при осмотре груза:</span>
                </div>
                <p className="text-[#D7D9DB] leading-relaxed">
                  {data.intercityTK.damageNotice}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Payment Methods */}
        <section id="payment" className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="text-left space-y-2 border-b border-[#2B313A] pb-4">
            <SectionBadge variant="teal">
              {data.paymentMethods.badge}
            </SectionBadge>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-white tracking-tight">
              {data.paymentMethods.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {data.paymentMethods.subtitle}
            </p>

            {/* Prepayment Notice */}
            <div className="p-4 rounded-xl bg-[#1E2228] border border-amber-500/40 text-xs text-[#D7D9DB] flex items-start gap-3 mt-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <SimonaIconInfo className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-0.5">Особый порядок для заказных приборов:</span>
                <span>{data.paymentMethods.prepaymentNotice}</span>
              </div>
            </div>
          </div>

          {/* 4 Direct Payment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.paymentMethods.items.map((method) => {
              // Icon mapping based on method id
              let MethodIcon = SimonaIconCreditCard;
              if (method.id === 'cash-delivery') MethodIcon = SimonaIconBanknote;
              if (method.id === 'salon-cash-card') MethodIcon = SimonaIconBuilding;
              if (method.id === 'online-yookassa') MethodIcon = SimonaIconCreditCard;
              if (method.id === 'bank-transfer') MethodIcon = SimonaIconFile;

              return (
                <div
                  key={method.id}
                  className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-6 sm:p-7 space-y-4 hover:border-simona-teal/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
                      <MethodIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-montserrat font-semibold text-white">
                      {method.title}
                    </h3>
                    <p className="text-xs text-[#87888A] leading-relaxed">
                      {method.desc}
                    </p>
                  </div>

                  {method.details && method.details.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-zinc-300 pt-3 border-t border-[#2B313A]/60">
                      {method.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#16191D] via-[#1E2228] to-[#16191D] border border-[#2B313A] rounded-xl p-8 sm:p-12 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-montserrat font-semibold text-white tracking-tight">
              Готовы выбрать бытовую технику для кухни?
            </h3>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              В каталоге «СИМОНА» представлено более 8 000 сертифицированных моделей ведущих мировых брендов с честным указанием складских остатков и официальной гарантией.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 shrink-0"
          >
            <span>Перейти в каталог</span>
            <SimonaIconArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </main>
  );
}
