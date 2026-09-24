'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/providers/StoreContext';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { formatPrice } from '@/lib/utils';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconPin,
  SimonaIconGuarantee,
  SimonaIconCart,
  SimonaIconClock,
  SimonaIconBuilding,
  SimonaIconCheckCircle,
} from '@/components/brand/SimonaIcons';
import {
  CreditCard,
  Wallet,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const analyticsData = useAnalyticsData();

  // Step 1: Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Step 2: Delivery method
  const [deliveryType, setDeliveryType] = useState<
    'PICKUP_WAREHOUSE_KOMINTERNA' | 'PICKUP_BELINSKOGO_15' | 'WHITE_GLOVE_DELIVERY'
  >('PICKUP_WAREHOUSE_KOMINTERNA');

  const [deliveryCity, setDeliveryCity] = useState('Нижний Новгород');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryHouse, setDeliveryHouse] = useState('');
  const [deliveryApartment, setDeliveryApartment] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryComment, setDeliveryComment] = useState('');

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<
    'IN_SALON' | 'CARD_ONLINE' | 'ON_RECEIPT' | 'B2B_INVOICE'
  >('IN_SALON');

  const [companyName, setCompanyName] = useState('');
  const [companyInn, setCompanyInn] = useState('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const deliveryCost =
    deliveryType === 'WHITE_GLOVE_DELIVERY'
      ? cartTotal >= 50000
        ? 0
        : 1500
      : 0;

  const grandTotal = cartTotal + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Ваша корзина пуста. Добавьте товары из каталога.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Укажите имя контактного лица.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Укажите корректный номер телефона для связи.');
      return;
    }

    if (deliveryType === 'WHITE_GLOVE_DELIVERY' && (!deliveryStreet || !deliveryHouse)) {
      setFormError('Укажите улицу и номер дома для доставки.');
      return;
    }

    setIsSubmitting(true);

    const fullAddress =
      deliveryType === 'WHITE_GLOVE_DELIVERY'
        ? `${deliveryCity}, ул. ${deliveryStreet}, д. ${deliveryHouse}${
            deliveryApartment ? ', кв./офис ' + deliveryApartment : ''
          }${deliveryFloor ? ', этаж ' + deliveryFloor : ''}`
        : null;

    const payload = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      deliveryType,
      deliveryAddress: fullAddress,
      deliveryDate: deliveryDate || null,
      deliveryComment: deliveryComment || null,
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        brand: item.product.brand,
        image: item.product.images?.[0] || null,
      })),
      companyName: paymentMethod === 'B2B_INVOICE' ? companyName : undefined,
      companyInn: paymentMethod === 'B2B_INVOICE' ? companyInn : undefined,
      ...analyticsData,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при сохранении заказа');
      }

      // Clear local cart
      clearCart();

      // Redirect to confirmation page
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(
          data.orderNumber
        )}&total=${encodeURIComponent(grandTotal)}&delivery=${encodeURIComponent(
          deliveryType
        )}&payment=${encodeURIComponent(paymentMethod)}`
      );
    } catch (err: any) {
      console.error('Checkout error:', err);
      setFormError(err.message || 'Произошла ошибка при отправке заказа. Попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 text-xs text-[#87888A] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в каталог</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <SectionBadge variant="teal" text="Оформление заказа" />
          <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight mt-3">
            Оформление покупки
          </h1>
          <p className="text-xs sm:text-sm text-[#87888A] mt-1">
            Комплектация со склада в Нижнем Новгороде, гарантия производителя и сервис «СИМОНА»
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#16191D] border border-[#2B313A] text-center max-w-lg mx-auto">
            <SimonaIconCart className="w-12 h-12 text-simona-teal mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Ваша корзина пуста</h2>
            <p className="text-xs text-[#87888A] mb-6">
              Выберите интересующие приборы в каталоге премиальной техники
            </p>
            <Link
              href="/catalog"
              className="inline-block px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Form Steps */}
            <div className="lg:col-span-7 space-y-6">
              {/* Error Notice */}
              {formError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Contacts */}
              <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A]">
                <div className="flex items-center space-x-2.5 mb-4">
                  <span className="w-6 h-6 rounded-md bg-simona-teal/20 text-simona-teal text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Контактные данные
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#D7D9DB] mb-1.5 font-medium">
                      ФИО контактного лица *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Константин Романов"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#D7D9DB] mb-1.5 font-medium">
                      Телефон для связи *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+7 (900) 123-45-67"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#D7D9DB] mb-1.5 font-medium">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="client@simona-bt.ru"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery & Pickup Method */}
              <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A]">
                <div className="flex items-center space-x-2.5 mb-4">
                  <span className="w-6 h-6 rounded-md bg-simona-teal/20 text-simona-teal text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Способ получения
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Warehouse Kominterna 27 (Primary Pickup) */}
                  <label
                    onClick={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'}
                            onChange={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                            className="text-simona-teal focus:ring-0"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">
                              Самовывоз: Центральный склад (ул. Коминтерна, 27)
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-simona-teal/20 text-simona-teal text-[10px] font-semibold">
                              Основной пункт
                            </span>
                          </div>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Основной терминал выдачи крупной и встраиваемой техники. Удобная зона погрузки, проверка комплектности.
                          </p>
                          <div className="flex items-center space-x-3 text-[10px] text-[#D7D9DB] mt-2">
                            <span className="flex items-center space-x-1">
                              <SimonaIconClock className="w-3 h-3 text-simona-teal" />
                              <span>Пн–Сб 09:00–18:00</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <SimonaIconPin className="w-3 h-3 text-simona-teal" />
                              <span>Нижний Новгород, ул. Коминтерна, 27</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal">Бесплатно</span>
                    </div>
                  </label>

                  {/* Option 2: Flagship Belinskogo 15 */}
                  <label
                    onClick={() => setDeliveryType('PICKUP_BELINSKOGO_15')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      deliveryType === 'PICKUP_BELINSKOGO_15'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === 'PICKUP_BELINSKOGO_15'}
                            onChange={() => setDeliveryType('PICKUP_BELINSKOGO_15')}
                            className="text-simona-teal focus:ring-0"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">
                            Самовывоз: Флагманский салон (ул. Белинского, 15)
                          </span>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Экспресс-выдача малой бытовой техники, посуды и аксессуаров. Кофе и консультация эксперта.
                          </p>
                          <div className="flex items-center space-x-3 text-[10px] text-[#D7D9DB] mt-2">
                            <span className="flex items-center space-x-1">
                              <SimonaIconClock className="w-3 h-3 text-simona-teal" />
                              <span>Ежедневно 10:00–20:00</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <SimonaIconPin className="w-3 h-3 text-simona-teal" />
                              <span>Нижний Новгород, ул. Белинского, 15</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal">Бесплатно</span>
                    </div>
                  </label>

                  {/* Option 3: White Glove Delivery */}
                  <label
                    onClick={() => setDeliveryType('WHITE_GLOVE_DELIVERY')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      deliveryType === 'WHITE_GLOVE_DELIVERY'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === 'WHITE_GLOVE_DELIVERY'}
                            onChange={() => setDeliveryType('WHITE_GLOVE_DELIVERY')}
                            className="text-simona-teal focus:ring-0"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">
                              Доставка в белых перчатках
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-simona-wine/20 text-simona-wine-light text-[10px] font-semibold">
                              Премиум сервис
                            </span>
                          </div>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Собственная служба логистики «СИМОНА». Бережный подъем на этаж, занос в квартиру, распаковка прибора и вывоз упаковочных материалов.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal">
                        {cartTotal >= 50000 ? 'Бесплатно' : '1 500 ₽'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Delivery Address Fields (if delivery chosen) */}
                {deliveryType === 'WHITE_GLOVE_DELIVERY' && (
                  <div className="mt-5 pt-5 border-t border-[#2B313A] space-y-3">
                    <h3 className="text-xs font-semibold text-white">Адрес доставки</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-[#87888A] mb-1">Город</label>
                        <input
                          type="text"
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-[#87888A] mb-1">Улица *</label>
                        <input
                          type="text"
                          required
                          value={deliveryStreet}
                          onChange={(e) => setDeliveryStreet(e.target.value)}
                          placeholder="ул. Варварская"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#87888A] mb-1">Дом / Корпус *</label>
                        <input
                          type="text"
                          required
                          value={deliveryHouse}
                          onChange={(e) => setDeliveryHouse(e.target.value)}
                          placeholder="10/2"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#87888A] mb-1">Квартира / Офис</label>
                        <input
                          type="text"
                          value={deliveryApartment}
                          onChange={(e) => setDeliveryApartment(e.target.value)}
                          placeholder="45"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#87888A] mb-1">Этаж / Лифт</label>
                        <input
                          type="text"
                          value={deliveryFloor}
                          onChange={(e) => setDeliveryFloor(e.target.value)}
                          placeholder="5 этаж, грузовой"
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#87888A] mb-1">Желаемая дата</label>
                        <input
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Payment Method (Incorporating User Review Comments!) */}
              <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A]">
                <div className="flex items-center space-x-2.5 mb-4">
                  <span className="w-6 h-6 rounded-md bg-simona-teal/20 text-simona-teal text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Способ оплаты
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: In Salon (Requested by user) */}
                  <label
                    onClick={() => setPaymentMethod('IN_SALON')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'IN_SALON'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'IN_SALON'}
                        onChange={() => setPaymentMethod('IN_SALON')}
                        className="text-simona-teal focus:ring-0 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconBuilding className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">В салоне СИМОНА</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Картой или наличными при визите в салон на ул. Белинского, 15 или 11/66 после осмотра техники
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Card Online (YooKassa) */}
                  <label
                    onClick={() => setPaymentMethod('CARD_ONLINE')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'CARD_ONLINE'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'CARD_ONLINE'}
                        onChange={() => setPaymentMethod('CARD_ONLINE')}
                        className="text-simona-teal focus:ring-0 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <CreditCard className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">Картой онлайн</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          ЮKassa, СБП, МИР, Visa, Mastercard без комиссии с фискальным чеком 54-ФЗ
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: On Receipt */}
                  <label
                    onClick={() => setPaymentMethod('ON_RECEIPT')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'ON_RECEIPT'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'ON_RECEIPT'}
                        onChange={() => setPaymentMethod('ON_RECEIPT')}
                        className="text-simona-teal focus:ring-0 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <Wallet className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">При получении</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Картой или наличными на складе на Коминтерна 27 или курьеру
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 4: B2B Invoice */}
                  <label
                    onClick={() => setPaymentMethod('B2B_INVOICE')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'B2B_INVOICE'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'B2B_INVOICE'}
                        onChange={() => setPaymentMethod('B2B_INVOICE')}
                        className="text-simona-teal focus:ring-0 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconBuilding className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">Счет для юрлиц (B2B)</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Безналичный расчет с НДС для дизайнеров, студий и компаний
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* B2B Details if invoice selected */}
                {paymentMethod === 'B2B_INVOICE' && (
                  <div className="mt-4 pt-4 border-t border-[#2B313A] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#87888A] mb-1">
                        Наименование организации *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="ООО «Студия Интерьера»"
                        className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#87888A] mb-1">ИНН *</label>
                      <input
                        type="text"
                        required
                        value={companyInn}
                        onChange={(e) => setCompanyInn(e.target.value)}
                        placeholder="5260123456"
                        className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ваш заказ ({cart.length})
                </h2>

                {/* Products List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A]/60"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 rounded-md bg-[#16191D] p-1 shrink-0 flex items-center justify-center border border-[#2B313A]">
                          <img
                            src={item.product.images?.[0] || ''}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-[#87888A]">
                            {item.product.brand} • {item.quantity} шт.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-montserrat font-bold text-white shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#2B313A] text-xs">
                  <div className="flex justify-between text-[#87888A]">
                    <span>Товары:</span>
                    <span className="font-montserrat text-white">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#87888A]">
                    <span>Доставка:</span>
                    <span className="font-montserrat text-simona-teal">
                      {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#2B313A]">
                    <span className="text-sm font-bold text-white">Итого к оплате:</span>
                    <span className="text-2xl font-montserrat font-bold text-simona-teal">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Оформление заказа...' : `Подтвердить заказ — ${formatPrice(grandTotal)}`}
                </button>

                {/* Trust Badges */}
                <div className="space-y-2 pt-3 text-[11px] text-[#87888A]">
                  <div className="flex items-center space-x-2">
                    <SimonaIconGuarantee className="w-3.5 h-3.5 text-simona-teal shrink-0" />
                    <span>Официальная гарантия и сертификаты производителей</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SimonaIconCheckCircle className="w-3.5 h-3.5 text-simona-teal shrink-0" />
                    <span>Безопасная обработка данных в соответствии с 152-ФЗ</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
