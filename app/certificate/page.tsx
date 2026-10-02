'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import {
  SimonaIconGuarantee,
  SimonaIconCheck,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import {
  Gift,
  Sparkles,
  CreditCard,
  Mail,
  Truck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 200000];

export default function CertificatePage() {
  const { addToCart, setIsCartOpen } = useStore();
  const analyticsData = useAnalyticsData();

  // Form State
  const [format, setFormat] = useState<'PHYSICAL' | 'DIGITAL'>('PHYSICAL');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  // Checkout modal/state
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const effectiveAmount = isCustom ? Number(customAmount) || 5000 : amount;

  const handleSelectPreset = (val: number) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setCustomAmount(e.target.value.replace(/\D/g, ''));
  };

  const handleAddToCart = () => {
    const certProduct = {
      id: `CERT-${effectiveAmount}-${Date.now()}`,
      sku: `CERT-${effectiveAmount}`,
      name: `Подарочный сертификат «СИМОНА» ${effectiveAmount.toLocaleString('ru-RU')} ₽ (${format === 'PHYSICAL' ? 'Конверт' : 'Электронный'})`,
      price: effectiveAmount,
      imageUrl: '/images/hero-1.webp',
      category: 'certificates',
      brand: 'СИМОНА',
      availability: 'IN_STOCK',
      inStock: true,
      description: `Подарочный сертификат на сумму ${effectiveAmount.toLocaleString('ru-RU')} ₽. Кому: ${recipientName || 'Получателю'}. От: ${senderName || 'Дарителя'}.`,
    };

    addToCart(certProduct as any);
    setIsCartOpen(true);
    trackGoal('CERTIFICATE_ADD_TO_CART', { amount: effectiveAmount, format });
  };

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CERTIFICATE_ORDER',
          name: senderName || 'Покупатель сертификата',
          phone: buyerPhone,
          email: buyerEmail,
          comment: `Заказ сертификата: Номинал: ${effectiveAmount} ₽ | Формат: ${format} | Получатель: ${recipientName} | Поздравление: ${message}`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка оформления заказа');
      setSuccess(true);
      trackGoal('CERTIFICATE_ORDER_SUBMIT', { amount: effectiveAmount, format });
    } catch (err) {
      console.error(err);
      alert('Ошибка при оформлении. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="wine">
              Премиальный подарок
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Подарочный сертификат «СИМОНА»
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Безупречный выбор для новоселья, свадьбы или юбилея. Подарите близким свободу выбора надежной европейской бытовой техники, моек и аксессуаров в ведущих салонах Нижнего Новгорода.
            </p>
          </div>
        </div>

        {/* Interactive Visualizer & Configurator Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Card Mockup (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="text-left space-y-1">
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Живой предпросмотр</span>
              <h2 className="text-xl font-montserrat font-bold text-white tracking-tight">
                Карта сертификата
              </h2>
            </div>

            {/* Quiet Luxury Visual Card */}
            <div className="relative aspect-[1.6/1] w-full rounded-2xl bg-gradient-to-br from-[#1C2026] via-[#121417] to-[#0A0B0D] border border-[#2B313A] p-6 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Metallic/Gold Ambient Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,151,156,0.15),transparent_60%)] pointer-events-none" />
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FDBF3E]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <SimonaLogo variant="teal" descriptor="none" size="sm" />
                  <span className="text-[10px] tracking-widest uppercase text-[#87888A] mt-1 block">
                    Салоны бытовой техники
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-[#242A33] border border-[#3E4654] text-[10px] font-mono text-[#FDBF3E] tracking-wider uppercase font-semibold">
                  {format === 'PHYSICAL' ? 'VIP Envelope' : 'E-Certificate'}
                </div>
              </div>

              {/* Card Center: Recipient & Note */}
              <div className="relative z-10 space-y-1 my-auto">
                <div className="text-[11px] text-[#87888A] uppercase tracking-wider">Для кого:</div>
                <div className="text-base sm:text-lg font-montserrat font-bold text-white truncate">
                  {recipientName || 'Уважаемый получатель'}
                </div>
                {message && (
                  <p className="text-[11px] text-zinc-300 italic line-clamp-2">
                    «{message}»
                  </p>
                )}
              </div>

              {/* Card Bottom: Nominal & Code */}
              <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-3">
                <div>
                  <span className="text-[10px] text-[#87888A] uppercase tracking-wider block">Номинал</span>
                  <div className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                    {effectiveAmount.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#87888A] tracking-wider">
                    SIMONA-GC-{effectiveAmount.toString().slice(0, 3)}**
                  </div>
                  <div className="text-[9px] text-[#87888A]">Действителен 1 год</div>
                </div>
              </div>
            </div>

            {/* Delivery/Package Explainer */}
            <div className="p-4 rounded-2xl bg-[#16191D] border border-[#2B313A] space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-white font-semibold">
                {format === 'PHYSICAL' ? (
                  <>
                    <Truck className="w-4 h-4 text-simona-teal" />
                    <span>Подарочный конверт с доставкой</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-simona-teal" />
                    <span>Мгновенный электронный сертификат</span>
                  </>
                )}
              </div>
              <p className="text-[#87888A] leading-relaxed">
                {format === 'PHYSICAL'
                  ? 'Изготавливается на фактурной бумаге ручной работы в бархатном дизайнерском конверте с золотым тиснением. Бесплатная доставка курьером по Нижнему Новгороду или выдача в салоне на ул. Белинского, 15.'
                  : 'Сгенерированный PDF-сертификат высокой четкости с персональным промо-кодом отправляется на email получателя или дарителя сразу после оплаты.'}
              </p>
            </div>
          </div>

          {/* Controls & Configuration (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-9 space-y-8">
            
            {/* Step 1: Format Switcher */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                1. Выберите формат исполнения:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('PHYSICAL')}
                  className={`p-4 rounded-xl border text-left transition ${
                    format === 'PHYSICAL'
                      ? 'bg-simona-teal/10 border-simona-teal text-white'
                      : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-simona-teal" />
                    <span>Фирменный конверт</span>
                  </div>
                  <div className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                    Премиальный физический сертификат в подарочной упаковке
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('DIGITAL')}
                  className={`p-4 rounded-xl border text-left transition ${
                    format === 'DIGITAL'
                      ? 'bg-simona-teal/10 border-simona-teal text-white'
                      : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-simona-teal" />
                    <span>Электронный PDF</span>
                  </div>
                  <div className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                    Мгновенная доставка на email с персональным поздравлением
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Amount Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  2. Выберите номинал:
                </span>
                <span className="text-sm font-mono text-simona-teal font-bold">
                  {effectiveAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition ${
                      !isCustom && amount === val
                        ? 'bg-simona-teal text-white border-simona-teal shadow-md shadow-simona-teal/20'
                        : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                    }`}
                  >
                    {val.toLocaleString('ru-RU')} ₽
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="pt-2">
                <label className="block text-[11px] text-[#87888A] mb-1">
                  Или укажите произвольную сумму (от 3 000 до 1 000 000 ₽):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={isCustom ? customAmount : ''}
                    onChange={handleCustomChange}
                    placeholder="Например: 75000"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border text-white text-xs font-mono focus:outline-none transition ${
                      isCustom ? 'border-simona-teal' : 'border-[#2B313A]'
                    }`}
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-[#87888A]">₽</span>
                </div>
              </div>
            </div>

            {/* Step 3: Personalization */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                3. Персонализация поздравления:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Имя получателя (Кому)</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Александр и Елена"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Ваше имя (От кого)</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Семья Смирновых"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#87888A] mb-1">Текст поздравления</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="С новосельем! Пусть новая кухня радует уютом и кулинарными шедеврами..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal transition resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#2B313A] space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Добавить в корзину ({effectiveAmount.toLocaleString('ru-RU')} ₽)</span>
                </button>
              </div>

              {/* Quick Order by Phone (Split Option) */}
              <div className="pt-2">
                {success ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400">
                    Заказ принят! Наш менеджер свяжется с вами для согласования оплаты и доставки.
                  </div>
                ) : (
                  <form onSubmit={handleQuickOrder} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="Быстрый заказ по телефону: +7 (999) 000-00-00"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {submitting ? 'Оформление...' : 'Заказать в 1 клик'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Rules & Transparency Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#2B313A] pb-4 text-left">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Условия и прозрачность</span>
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
              Правила использования подарочного сертификата
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
            <div className="space-y-2">
              <strong className="text-white text-sm block">100% покрытие заказа</strong>
              <p className="text-[#87888A] leading-relaxed">
                Сертификатом можно оплатить до 100% стоимости любых приборов из каталога (~8000 SKU), сантехники Omoikiri, а также сервисных услуг монтажа и доставки.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="text-white text-sm block">Суммируется с акциями</strong>
              <p className="text-[#87888A] leading-relaxed">
                Действие сертификата суммируется со всеми официальными акциями и скидками производителей (ASKO, Smeg, Körting, Midea), а также с промо-комплектами.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="text-white text-sm block">Срок действия 1 год</strong>
              <p className="text-[#87888A] leading-relaxed">
                Сертификат действителен в течение 365 дней со дня приобретения. Если сумма выбранной техники превышает номинал, разницу можно легко доплатить картой или наличными.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
