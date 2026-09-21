'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsLoading(true);

    // Simulate express 1-click order creation
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
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
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Заказ успешно оформлен
                </h3>
                <p className="text-xs text-[#87888A] mt-2 max-w-sm">
                  Менеджер флагманского салона «СИМОНА» свяжется с вами в течение 10 минут по номеру {phone} для согласования адреса доставки и шеф-монтажа.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Вернуться к товару
                </button>
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
                <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-3 flex items-center gap-3">
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-[#111315] border border-[#2B313A]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#87888A] font-mono uppercase">
                      {product.sku}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {product.name}
                    </h4>
                    <span className="text-sm font-extrabold text-white">
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
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#1E2228] border border-[#2B313A] focus:border-simona-teal text-white text-xs placeholder:text-[#87888A] outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#87888A] pt-1">
                    <ShieldCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Официальная гарантия производителя Miele 2 года</span>
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
