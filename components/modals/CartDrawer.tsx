import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CreditCard, ArrowRight, CheckCircle2, Store, Truck, Package } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { formatPrice } from '@/lib/utils';
import { trackEcommercePurchase, trackGoal } from '@/lib/analytics/tracker';

export function CartDrawer() {
  const router = useRouter();
  const analyticsData = useAnalyticsData();
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useStore();
  const [deliveryType, setDeliveryType] = useState<'PICKUP_WAREHOUSE_KOMINTERNA' | 'PICKUP_BELINSKOGO_15' | 'WHITE_GLOVE_DELIVERY'>('PICKUP_WAREHOUSE_KOMINTERNA');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

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
          name: item.product.name,
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
        products: cart.map(i => ({
          id: i.product.sku || i.product.id,
          name: i.product.name,
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-black/[0.08] text-[#16181B] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-simona-teal" />
              <h3 className="text-lg font-montserrat font-bold text-[#16181B]">Корзина (Категория А)</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#87888A] hover:text-[#16181B] rounded-full hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-simona-teal/10 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">Заказ №{orderSuccess} оформлен!</h3>
                <p className="text-xs text-[#6E7074] font-normal max-w-xs mx-auto leading-relaxed mb-6">
                  Чек 54-ФЗ и ссылка на оплату через ЮKassa (СБП/Карты) отправлены в SMS. Менеджер салона СИМОНА подготовит выдачу.
                </p>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCartOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  Продолжить покупки
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#87888A] mx-auto mb-3" />
                <p className="text-sm text-[#3E3D40] font-bold">Ваша корзина пуста</p>
                <p className="text-xs text-[#6E7074] mt-1">
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
                      className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/[0.04] flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-black/[0.06] p-0.5">
                          <img
                            src={
                              Array.isArray(product.images)
                                ? product.images[0]
                                : typeof product.imagesJson === 'string'
                                ? JSON.parse(product.imagesJson || '[]')[0]
                                : ''
                            }
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#16181B] truncate">{product.name}</div>
                          <div className="text-xs font-montserrat font-bold text-simona-teal mt-0.5">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center bg-white rounded-lg p-0.5 border border-black/[0.08] shadow-xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-[#87888A] hover:text-[#16181B]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#16181B]">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-[#87888A] hover:text-[#16181B]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-[#87888A] hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick 1-click Order Accordion */}
                <div className="pt-3 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowQuickForm(!showQuickForm)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-simona-teal hover:text-simona-teal-hover py-1"
                  >
                    <span>{showQuickForm ? 'Скрыть быстрый заказ' : '⚡ Оформить быстрый заказ в 1 клик'}</span>
                    <span className="text-[10px] text-[#87888A] font-normal">{showQuickForm ? '▲' : '▼'}</span>
                  </button>

                  {showQuickForm && (
                    <form onSubmit={handleQuickCheckout} id="quick-cart-form" className="space-y-3 pt-3 text-xs">
                      <div>
                        <label className="block text-[#3E3D40] mb-1.5 font-semibold text-[11px]">Способ получения</label>
                        <div className="space-y-1.5">
                          <label className="flex items-center p-2 rounded-xl bg-[#F8F9FA] border border-black/[0.06] cursor-pointer hover:border-simona-teal">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'}
                              onChange={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                              className="text-simona-teal focus:ring-0 mr-2"
                            />
                            <div>
                              <span className="text-[#16181B] font-semibold text-[11px]">Самовывоз: Склад (Коминтерна, 27)</span>
                              <span className="block text-[9px] text-[#87888A]">Терминал выдачи крупной техники • Бесплатно</span>
                            </div>
                          </label>

                          <label className="flex items-center p-2 rounded-xl bg-[#F8F9FA] border border-black/[0.06] cursor-pointer hover:border-simona-teal">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryType === 'PICKUP_BELINSKOGO_15'}
                              onChange={() => setDeliveryType('PICKUP_BELINSKOGO_15')}
                              className="text-simona-teal focus:ring-0 mr-2"
                            />
                            <div>
                              <span className="text-[#16181B] font-semibold text-[11px]">Самовывоз: Салон (Белинского, 15)</span>
                              <span className="block text-[9px] text-[#87888A]">Экспресс-выдача малой техники • Бесплатно</span>
                            </div>
                          </label>

                          <label className="flex items-center p-2 rounded-xl bg-[#F8F9FA] border border-black/[0.06] cursor-pointer hover:border-simona-teal">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryType === 'WHITE_GLOVE_DELIVERY'}
                              onChange={() => setDeliveryType('WHITE_GLOVE_DELIVERY')}
                              className="text-simona-teal focus:ring-0 mr-2"
                            />
                            <div>
                              <span className="text-[#16181B] font-semibold text-[11px]">Доставка в белых перчатках</span>
                              <span className="block text-[9px] text-[#87888A]">По Нижнему Новгороду и области</span>
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
                          className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] text-xs focus:outline-none focus:border-simona-teal focus:bg-white"
                        />
                      </div>

                      <div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Телефон для подтверждения *"
                          className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] text-xs focus:outline-none focus:border-simona-teal focus:bg-white"
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
                            className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] text-xs focus:outline-none focus:border-simona-teal focus:bg-white"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center space-x-2"
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
            <div className="p-5 border-t border-black/[0.06] bg-[#F8F9FA] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#6E7074] font-medium">Итого к оплате:</span>
                <span className="text-2xl font-montserrat font-bold text-[#16181B]">{formatPrice(cartTotal)}</span>
              </div>

              <button
                type="button"
                onClick={handleGoToCheckout}
                className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-simona-teal/25 flex items-center justify-center space-x-2 active:scale-98"
              >
                <span>Перейти к оформлению заказа</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#87888A]">
                <ShieldCheck className="w-3.5 h-3.5 text-simona-teal" />
                <span>Оплата в салоне • Онлайн картой • Безналичный расчет B2B</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
