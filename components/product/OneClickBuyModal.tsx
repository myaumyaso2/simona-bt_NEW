'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { X } from 'lucide-react';
import { SimonaIconCheckCircle, SimonaIconGuarantee } from '@/components/brand/SimonaIcons';
import { formatBrandName } from '@/lib/formatters';
import { formatProductName } from '@/lib/catalog/productTitle';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackEcommercePurchase, trackGoal } from '@/lib/analytics/tracker';
import { formatPhoneMask, isValidRussianPhone } from '@/lib/phone';

interface OneClickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem;
}

export function OneClickBuyModal({
  isOpen,
  onClose,
  product,
}: OneClickBuyModalProps) {
  const analyticsData = useAnalyticsData();
  const displayName = formatProductName(product);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRussianPhone(phone)) {
      setPhoneError('Пожалуйста, введите полный номер телефона (+7 (XXX) XXX-XX-XX)');
      return;
    }
    setPhoneError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout/one-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim(),
          productId: product.id,
          sku: product.sku,
          productName: displayName,
          brand: product.brand,
          price: product.price,
          image: thumbnail,
          slug: product.slug,
          physicalStatus: product.physicalStatus,
          ...analyticsData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при оформлении заказа');
      }

      const assignedNumber = data.orderNumber;
      setSubmittedOrderNumber(assignedNumber);

      trackGoal('ONE_CLICK_PURCHASE', {
        name,
        phone,
        productId: product.id,
        orderNumber: assignedNumber,
        price: product.price,
      });

      trackEcommercePurchase({
        id: assignedNumber,
        revenue: product.price,
        products: [
          {
            id: product.sku || product.id,
            name: displayName,
            price: product.price,
            brand: product.brand || 'СИМОНА',
            category: product.category,
            quantity: 1,
          },
        ],
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('1-Click purchase error:', err);
      // Fallback
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedOrderNumber(null);
    setName('');
    setPhone('');
    onClose();
  };

  const images = product.images || [];
  const thumbnail = images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-simona-teal/20 text-simona-teal border border-simona-teal/30 flex items-center justify-center mb-4">
                  <SimonaIconCheckCircle className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-xs font-semibold tracking-wide mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-simona-teal animate-pulse" />
                  <span>Заказ принят</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-white">
                  {submittedOrderNumber ? `Заказ №${submittedOrderNumber}` : 'Заказ успешно оформлен'}
                </h3>
                <p className="text-xs text-[#87888A] mt-2 max-w-sm leading-relaxed">
                  Эксперт салона «СИМОНА» свяжется с вами по номеру <strong className="text-white whitespace-nowrap">{phone.replace(/ /g, '\u00A0')}</strong> для подтверждения резерва и согласования доставки.
                </p>

                {/* Compact summary */}
                <div className="w-full mt-4 p-3.5 bg-[#1E2228] border border-[#2B313A] rounded-xl text-left flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[#111315] border border-[#2B313A] flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={displayName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2 mb-1" title={displayName}>
                      {displayName}
                    </h4>
                    <div className="text-xs text-[#87888A] flex items-center gap-1.5 font-medium">
                      <span>1 прибор</span>
                      <span className="text-[#4E545E]">•</span>
                      <span className="font-extrabold text-white">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center gap-3 mt-6">
                  {submittedOrderNumber && (
                    <a
                      href={`/checkout/success?orderNumber=${encodeURIComponent(submittedOrderNumber)}&total=${product.price}&requiresConfirmation=1`}
                      className="flex-1 h-11 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-white text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                    >
                      Подробнее о заказе
                    </a>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex-1 h-11 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Вернуться к витрине
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">
                    БЫСТРЫЙ ЗАКАЗ
                  </span>
                  <h3 className="text-xl font-montserrat font-bold text-white mt-0.5">
                    Купить в 1 клик
                  </h3>
                  <p className="text-xs text-[#87888A]">
                    Оставьте ваш номер, и эксперт салона свяжется для подтверждения заказа.
                  </p>
                </div>

                {/* Compact Product Card */}
                <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-3 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[#111315] border border-[#2B313A] flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={displayName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#87888A] font-mono block mb-0.5">
                      Код товара: {product.sku}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug" title={displayName}>
                      {displayName}
                    </h4>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs text-[#87888A] mb-1">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      placeholder="Александр"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#1E2228] border border-[#2B313A] focus:border-simona-teal text-white text-xs placeholder:text-[#87888A] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#87888A] mb-1">
                      Номер телефона <span className="text-simona-teal">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatPhoneMask(e.target.value, phone));
                        if (phoneError) setPhoneError(null);
                      }}
                      className={`w-full h-11 px-4 rounded-xl bg-[#1E2228] border text-white text-xs placeholder:text-[#87888A] outline-none transition-colors ${
                        phoneError
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-[#2B313A] focus:border-simona-teal'
                      }`}
                    />
                    {phoneError && (
                      <span className="block text-[10px] text-red-400 mt-1 pl-1">
                        {phoneError}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#87888A] pt-1">
                    <SimonaIconGuarantee className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Официальная гарантия производителя {formatBrandName(product.brand)} 2 года</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !phone}
                    className="w-full h-12 mt-2 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-lg shadow-teal-950/40"
                  >
                    {isLoading ? 'Оформление...' : 'Оформить заказ в 1 клик'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
