'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import {
  SimonaIconCart,
  SimonaIconTrash,
  SimonaIconGuarantee,
  SimonaIconCheckCircle,
} from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { formatPrice } from '@/lib/utils';
import { trackEcommercePurchase, trackGoal } from '@/lib/analytics/tracker';
import { formatProductName } from '@/lib/catalog/productTitle';

export function CartDrawer() {
  const router = useRouter();
  const analyticsData = useAnalyticsData();
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useStore();
  const [deliveryType, setDeliveryType] = useState<
    'PICKUP_WAREHOUSE_KOMINTERNA' | 'PICKUP_BELINSKOGO_15' | 'WHITE_GLOVE_DELIVERY'
  >('PICKUP_WAREHOUSE_KOMINTERNA');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleQuickCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerName: name,
        customerPhone: phone,
        deliveryType,
        deliveryAddress: deliveryType === 'WHITE_GLOVE_DELIVERY' ? address : null,
        paymentMethod: 'IN_SALON',
        items: cart.map((item) => ({
          productId: item.product.id,
          sku: item.product.sku,
          name: formatProductName(item.product),
          price: item.product.price,
          quantity: item.quantity,
          brand: item.product.brand,
          image: item.product.images?.[0] || null,
        })),
        ...analyticsData,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при сохранении заказа');
      setOrderSuccess(data.orderNumber);
      trackEcommercePurchase({
        id: data.orderNumber,
        revenue: cartTotal,
        products: cart.map((i) => ({
          id: i.product.sku || i.product.id,
          name: formatProductName(i.product),
          price: i.product.price,
          brand: i.product.brand || 'СИМОНА',
          category: i.product.category,
          quantity: i.quantity,
        })),
      });
      trackGoal('ORDER_CONFIRMED', { orderNumber: data.orderNumber, total: cartTotal });
      clearCart();
    } catch (e) {
      console.error(e);
      alert('Не удалось оформить заказ. Пожалуйста, воспользуйтесь полной страницей оформления.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="w-screen max-w-md bg-[#16191D] border-l border-[#2B313A] text-white shadow-2xl flex flex-col justify-between z-10"
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#2B313A] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <SimonaIconCart className="w-5 h-5 text-simona-teal" />
                  <h3 className="text-lg font-montserrat font-bold text-white tracking-tight">
                    Корзина товаров
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 rounded-xl border border-[#2B313A] text-[#87888A] hover:text-white hover:bg-[#1E2228] flex items-center justify-center transition cursor-pointer"
                  aria-label="Закрыть корзину"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {orderSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(0,151,156,0.2)]">
                      <SimonaIconCheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-montserrat font-bold text-white mb-2">
                      Заказ №{orderSuccess} оформлен!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#87888A] font-normal max-w-xs mx-auto leading-relaxed mb-6">
                      Чек 54-ФЗ и ссылка на оплату через ЮKassa (СБП/Карты) отправлены в SMS. Менеджер салона СИМОНА подготовит выдачу.
                    </p>
                    <button
                      onClick={() => {
                        setOrderSuccess(null);
                        setIsCartOpen(false);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] text-white text-xs font-semibold border border-[#2B313A] transition shadow-sm cursor-pointer"
                    >
                      Продолжить покупки
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16">
                    <SimonaIconCart className="w-12 h-12 text-[#87888A] mx-auto mb-3 opacity-60" />
                    <p className="text-sm text-white font-bold">Ваша корзина пуста</p>
                    <p className="text-xs text-[#87888A] mt-1.5 max-w-xs mx-auto leading-relaxed">
                      Добавьте премиальную технику ASKO, Miele, SMEG, аксессуары OMOIKIRI или фирменную химию.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Item List */}
                    <div className="space-y-3">
                      {cart.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="p-3.5 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-between gap-3 shadow-sm"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-[#111315] overflow-hidden shrink-0 border border-[#2B313A] p-0.5 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  Array.isArray(product.images)
                                    ? product.images[0]
                                    : typeof product.imagesJson === 'string'
                                    ? JSON.parse(product.imagesJson || '[]')[0]
                                    : ''
                                }
                                alt={product.name}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                {formatProductName(product)}
                              </div>
                              <div className="text-[10px] font-mono text-[#87888A]">
                                Код: {product.sku}
                              </div>
                              <div className="text-xs font-montserrat font-bold text-simona-teal mt-0.5">
                                {formatPrice(product.price)}
                              </div>
                            </div>
                          </div>

                          {/* Quantity & Delete */}
                          <div className="flex items-center space-x-2 shrink-0">
                            <div className="flex items-center bg-[#111315] rounded-xl p-0.5 border border-[#2B313A]">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="p-1 text-[#87888A] hover:text-white cursor-pointer transition-colors"
                                aria-label="Уменьшить количество"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-white">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="p-1 text-[#87888A] hover:text-white cursor-pointer transition-colors"
                                aria-label="Увеличить количество"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="p-1.5 text-[#87888A] hover:text-red-400 transition cursor-pointer"
                              aria-label="Удалить из корзины"
                            >
                              <SimonaIconTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick 1-click Order Accordion */}
                    <div className="pt-3 border-t border-[#2B313A]">
                      <button
                        type="button"
                        onClick={() => setShowQuickForm(!showQuickForm)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-simona-teal hover:text-simona-teal-hover py-1 cursor-pointer transition-colors"
                      >
                        <span>
                          {showQuickForm ? 'Скрыть быстрый заказ' : '⚡ Оформить быстрый заказ в 1 клик'}
                        </span>
                        <span className="text-[10px] text-[#87888A] font-normal">
                          {showQuickForm ? '▲' : '▼'}
                        </span>
                      </button>

                      {showQuickForm && (
                        <form
                          onSubmit={handleQuickCheckout}
                          id="quick-cart-form"
                          className="space-y-3 pt-3 text-xs"
                        >
                          <div>
                            <label className="block text-[#D7D9DB] mb-1.5 font-medium text-[11px]">
                              Способ получения
                            </label>
                            <div className="space-y-1.5">
                              <label className="flex items-center p-2 rounded-xl bg-[#111315] border border-[#2B313A] cursor-pointer hover:border-simona-teal/50 transition">
                                <input
                                  type="radio"
                                  name="delivery"
                                  checked={deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'}
                                  onChange={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                                  className="text-simona-teal focus:ring-0 mr-2"
                                />
                                <div>
                                  <span className="text-white font-medium text-[11px]">
                                    Самовывоз: Склад (Коминтерна, 27)
                                  </span>
                                  <span className="block text-[9px] text-[#87888A]">
                                    Терминал выдачи крупной техники • Бесплатно
                                  </span>
                                </div>
                              </label>

                              <label className="flex items-center p-2 rounded-xl bg-[#111315] border border-[#2B313A] cursor-pointer hover:border-simona-teal/50 transition">
                                <input
                                  type="radio"
                                  name="delivery"
                                  checked={deliveryType === 'PICKUP_BELINSKOGO_15'}
                                  onChange={() => setDeliveryType('PICKUP_BELINSKOGO_15')}
                                  className="text-simona-teal focus:ring-0 mr-2"
                                />
                                <div>
                                  <span className="text-white font-medium text-[11px]">
                                    Самовывоз: Салон (Белинского, 15)
                                  </span>
                                  <span className="block text-[9px] text-[#87888A]">
                                    Экспресс-выдача малой техники • Бесплатно
                                  </span>
                                </div>
                              </label>

                              <label className="flex items-center p-2 rounded-xl bg-[#111315] border border-[#2B313A] cursor-pointer hover:border-simona-teal/50 transition">
                                <input
                                  type="radio"
                                  name="delivery"
                                  checked={deliveryType === 'WHITE_GLOVE_DELIVERY'}
                                  onChange={() => setDeliveryType('WHITE_GLOVE_DELIVERY')}
                                  className="text-simona-teal focus:ring-0 mr-2"
                                />
                                <div>
                                  <span className="text-white font-medium text-[11px]">
                                    Аккуратная доставка собственной службой
                                  </span>
                                  <span className="block text-[9px] text-[#87888A]">
                                    По Нижнему Новгороду и области
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Ваше имя *"
                              className="w-full px-3 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 font-medium"
                            />
                          </div>

                          <div>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Телефон для подтверждения *"
                              className="w-full px-3 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 font-medium"
                            />
                          </div>

                          {deliveryType === 'WHITE_GLOVE_DELIVERY' && (
                            <div>
                              <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Адрес доставки (улица, дом, квартира)"
                                className="w-full px-3 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 font-medium"
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-white text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                          >
                            <span>{loading ? 'Отправка...' : 'Подтвердить быстрый заказ'}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Payment summary & Direct Checkout Button */}
              {cart.length > 0 && !orderSuccess && (
                <div className="p-5 border-t border-[#2B313A] bg-[#111315]/90 backdrop-blur-md space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#87888A] font-medium">Итого к оплате:</span>
                    <span className="text-2xl font-montserrat font-bold text-white">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToCheckout}
                    className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white font-semibold text-sm transition shadow-lg shadow-simona-teal/25 flex items-center justify-center space-x-2 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Перейти к оформлению заказа</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-[#87888A]">
                    <SimonaIconGuarantee className="w-3.5 h-3.5 text-simona-teal" />
                    <span>Оплата в салоне • Онлайн картой • Безналичный расчет B2B</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
