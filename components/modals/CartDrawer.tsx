'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useStore();
  const [deliveryType, setDeliveryType] = useState<'PICKUP_15' | 'PICKUP_11' | 'WHITE_GLOVE_DELIVERY'>('PICKUP_15');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate /api/orders & YooKassa redirect creation
      await new Promise((resolve) => setTimeout(resolve, 800));
      const orderNumber = `SIM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderSuccess(orderNumber);
      clearCart();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121417] border-l border-zinc-800 text-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-simona-teal" />
              <h3 className="text-lg font-serif">Корзина (Категория А)</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-simona-teal/20 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Заказ №{orderSuccess} оформлен!</h3>
                <p className="text-xs text-zinc-400 font-light max-w-xs mx-auto leading-relaxed mb-6">
                  Чек 54-ФЗ и ссылка на оплату через ЮKassa (СБП/Карты) отправлены в SMS. Менеджер салона СИМОНА подготовит выдачу.
                </p>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Продолжить покупки
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">Ваша корзина пуста</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Добавьте малую технику SMEG, аксессуары OMOIKIRI или фирменную химию Miele.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Item List */}
                <div className="space-y-3">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
                          <img
                            src={
                              Array.isArray(product.images)
                                ? product.images[0]
                                : typeof product.imagesJson === 'string'
                                ? JSON.parse(product.imagesJson || '[]')[0]
                                : ''
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-white truncate">{product.name}</div>
                          <div className="text-xs font-serif text-simona-teal mt-0.5">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} id="cart-form" className="space-y-4 pt-4 border-t border-zinc-800 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1.5 font-medium">Способ получения</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryType === 'PICKUP_15'}
                          onChange={() => setDeliveryType('PICKUP_15')}
                          className="text-simona-teal focus:ring-0 mr-2.5"
                        />
                        <div>
                          <span className="text-white font-medium">Самовывоз: Белинского, 15</span>
                          <span className="block text-[10px] text-zinc-500">Флагман СИМОНА • Бесплатно</span>
                        </div>
                      </label>

                      <label className="flex items-center p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryType === 'PICKUP_11'}
                          onChange={() => setDeliveryType('PICKUP_11')}
                          className="text-simona-teal focus:ring-0 mr-2.5"
                        />
                        <div>
                          <span className="text-white font-medium">Самовывоз: Белинского, 11/66</span>
                          <span className="block text-[10px] text-zinc-500">Салон OMOIKIRI • Бесплатно</span>
                        </div>
                      </label>

                      <label className="flex items-center p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryType === 'WHITE_GLOVE_DELIVERY'}
                          onChange={() => setDeliveryType('WHITE_GLOVE_DELIVERY')}
                          className="text-simona-teal focus:ring-0 mr-2.5"
                        />
                        <div>
                          <span className="text-white font-medium">Доставка в белых перчатках</span>
                          <span className="block text-[10px] text-zinc-500">По Нижнему Новгороду и области</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Имя покупателя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ольга"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Телефон для подтверждения *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (900) 000-00-00"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  {deliveryType === 'WHITE_GLOVE_DELIVERY' && (
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium">Адрес доставки</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Улица, дом, квартира"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-simona-teal"
                      />
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer with Payment summary */}
          {cart.length > 0 && !orderSuccess && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-400">Итого к оплате:</span>
                <span className="text-2xl font-serif text-white">{formatPrice(cartTotal)}</span>
              </div>

              <button
                type="submit"
                form="cart-form"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-light text-white font-semibold text-xs uppercase tracking-wider transition shadow-lg shadow-simona-teal/25 flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? 'Формирование чека...' : 'Оформить и оплатить (ЮKassa / СБП)'}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-simona-teal" />
                <span>Безопасная оплата • Фискальный чек по 54-ФЗ</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
