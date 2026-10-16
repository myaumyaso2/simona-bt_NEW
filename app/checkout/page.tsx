'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/components/providers/StoreContext';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { formatPrice } from '@/lib/utils';
import { formatProductName } from '@/lib/catalog/productTitle';
import { formatPhoneMask, isValidRussianPhone } from '@/lib/phone';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { CATALOG_CATEGORIES } from '@/data/catalogCategories';
import { ProductItem } from '@/types';
import {
  SimonaIconDelivery,
  SimonaIconPin,
  SimonaIconGuarantee,
  SimonaIconCart,
  SimonaIconClock,
  SimonaIconBuilding,
  SimonaIconCheckCircle,
  SimonaIconArrowLeft,
  SimonaIconShieldCheck,
  SimonaIconInfo,
  SimonaIconPackage,
} from '@/components/brand/SimonaIcons';

// Функция проверки: является ли товар крупногабаритным
function isBulkyProduct(product: ProductItem): boolean {
  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Исключения, разрешенные для выдачи в салоне на Белинского, 15:
  // 1. Варочные панели
  if (
    cat.includes('варочн') ||
    name.includes('варочная панель') ||
    name.includes('варочная поверхность')
  ) {
    return false;
  }
  // 2. Отдельностоящие микроволновые печи (встройка - крупногабарит)
  if (
    cat === 'микроволновые печи' ||
    (name.includes('микроволнов') && !cat.includes('встраиваем') && !name.includes('встраиваем'))
  ) {
    return false;
  }
  // 3. Встраиваемые подогреватели пищи или посуды
  if (cat.includes('подогреват') || name.includes('подогреватель')) {
    return false;
  }
  // 4. Встраиваемые вакууматоры
  if (cat.includes('вакууматор') || name.includes('вакууматор')) {
    return false;
  }

  // Проверяем принадлежность к глобальным разделам встраиваемой и крупной техники
  const categoryMeta = CATALOG_CATEGORIES.find(
    (c) => c.dbCategories.includes(product.category) || c.title.toLowerCase() === cat
  );

  if (categoryMeta) {
    if (
      categoryMeta.sectionSlug === 'vstraivaemaya-tehnika' ||
      categoryMeta.sectionSlug === 'krupnaya-bytovaya-tehnika'
    ) {
      if (
        categoryMeta.slug === 'izmelchiteli-pishchevyh-othodov' ||
        categoryMeta.slug === 'sortery-dlya-musora'
      ) {
        return false;
      }
      return true;
    }
  }

  // Запасная проверка по ключевым словам габаритных приборов
  const bulkyKeywords = [
    'духов',
    'холодильник',
    'стиральн',
    'сушильн',
    'посудомоечн',
    'вытяжк',
    'винный шкаф',
    'гладильн',
    'плита',
  ];
  return bulkyKeywords.some((kw) => cat.includes(kw) || name.includes(kw));
}

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
    'PICKUP_WAREHOUSE_KOMINTERNA' | 'PICKUP_BELINSKOGO_15' | 'COURIER_DELIVERY'
  >('PICKUP_WAREHOUSE_KOMINTERNA');

  const [deliveryZone, setDeliveryZone] = useState<
    'NN' | 'OBLAST_ZONE_1' | 'OBLAST_ZONE_2' | 'RUSSIA_TK'
  >('NN');

  const [deliveryCity, setDeliveryCity] = useState('Нижний Новгород');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryHouse, setDeliveryHouse] = useState('');
  const [deliveryApartment, setDeliveryApartment] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryComment, setDeliveryComment] = useState('');
  const [deliveryTransportCompany, setDeliveryTransportCompany] = useState('Деловые Линии');
  const [tkPassportData, setTkPassportData] = useState('');

  // Step 3: Payment method
  const [paymentMethod, setPaymentMethod] = useState<
    'IN_SALON' | 'AT_WAREHOUSE' | 'ON_DELIVERY' | 'CARD_ONLINE' | 'B2B_INVOICE'
  >('IN_SALON');

  const [companyName, setCompanyName] = useState('');
  const [companyInn, setCompanyInn] = useState('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Check bulky appliances and units
  const hasBulkyItems = cart.some((item) => isBulkyProduct(item.product));
  const totalCartUnits = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Fallback to warehouse if cart has bulky items
  useEffect(() => {
    if (hasBulkyItems && deliveryType === 'PICKUP_BELINSKOGO_15') {
      setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA');
    }
  }, [hasBulkyItems, deliveryType]);

  // Check if any item requires manager confirmation (SHOWROOM, REMOTE_STOCK, ON_ORDER)
  const hasNonLocalStockItems = cart.some(
    (item) =>
      item.product.physicalStatus !== 'LOCAL_STOCK' ||
      (typeof item.product.stockKominterna === 'number' && item.product.stockKominterna <= 0)
  );

  // Side-by-Side surcharge
  const hasSideBySide = cart.some((item) => {
    const n = (item.product.name || '').toLowerCase();
    return n.includes('side-by-side') || n.includes('french door') || n.includes('side by side');
  });

  const calculateDeliveryCost = (): { cost: number; isManualQuote: boolean; label: string } => {
    if (deliveryType !== 'COURIER_DELIVERY') {
      return { cost: 0, isManualQuote: false, label: 'Бесплатно' };
    }

    const sideBySideFee = hasSideBySide ? 1000 : 0;

    if (deliveryZone === 'NN') {
      let base = 1000;
      if (totalCartUnits >= 4 && totalCartUnits <= 6) base = 1500;
      else if (totalCartUnits > 6) base = 2000;
      return {
        cost: base + sideBySideFee,
        isManualQuote: false,
        label: `${formatPrice(base + sideBySideFee)}${hasSideBySide ? ' (вкл. Side-by-Side +1 000 ₽)' : ''}`,
      };
    }

    if (deliveryZone === 'OBLAST_ZONE_1') {
      let base = 1700;
      if (totalCartUnits >= 4 && totalCartUnits <= 6) base = 2200;
      else if (totalCartUnits > 6) base = 2700;
      return {
        cost: base + sideBySideFee,
        isManualQuote: false,
        label: `${formatPrice(base + sideBySideFee)}${hasSideBySide ? ' (вкл. Side-by-Side +1 000 ₽)' : ''}`,
      };
    }

    if (deliveryZone === 'OBLAST_ZONE_2') {
      let base = 2700;
      if (totalCartUnits >= 4 && totalCartUnits <= 6) base = 3300;
      else if (totalCartUnits > 6) base = 3600;
      return {
        cost: base + sideBySideFee,
        isManualQuote: false,
        label: `${formatPrice(base + sideBySideFee)}${hasSideBySide ? ' (вкл. Side-by-Side +1 000 ₽)' : ''}`,
      };
    }

    // RUSSIA_TK
    return {
      cost: 0,
      isManualQuote: true,
      label: 'По тарифам ТК (расчет менеджером)',
    };
  };

  const deliveryCalc = calculateDeliveryCost();
  const deliveryCost = deliveryCalc.cost;
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

    if (!isValidRussianPhone(customerPhone)) {
      setFormError('Укажите корректный номер телефона РФ (+7 (XXX) XXX-XX-XX).');
      return;
    }

    if (deliveryType === 'COURIER_DELIVERY') {
      if (deliveryZone === 'RUSSIA_TK') {
        if (!deliveryCity.trim() || !deliveryStreet.trim()) {
          setFormError('Укажите город назначения в РФ и адрес терминала ТК / адрес доставки.');
          return;
        }
      } else {
        if (!deliveryStreet.trim() || !deliveryHouse.trim()) {
          setFormError('Укажите улицу и номер дома для доставки.');
          return;
        }
        if (deliveryZone !== 'NN' && !deliveryCity.trim()) {
          setFormError('Укажите населенный пункт в Нижегородской области.');
          return;
        }
      }
    }

    setIsSubmitting(true);

    const zoneName =
      deliveryZone === 'NN'
        ? 'Нижний Новгород'
        : deliveryZone === 'OBLAST_ZONE_1'
        ? 'Нижегородская область (Зона 1, до 50 км)'
        : deliveryZone === 'OBLAST_ZONE_2'
        ? 'Нижегородская область (Зона 2, 51–100 км)'
        : 'По России (Транспортной компанией)';

    const fullAddress =
      deliveryType === 'COURIER_DELIVERY'
        ? deliveryZone === 'RUSSIA_TK'
          ? `[ТК: ${deliveryTransportCompany || 'Деловые Линии'}] г. ${deliveryCity}, адрес: ${deliveryStreet}${
              tkPassportData ? `, получатель: ${tkPassportData}` : ''
            }`
          : `${deliveryCity}, ул. ${deliveryStreet}, д. ${deliveryHouse}${
              deliveryApartment ? ', кв./офис ' + deliveryApartment : ''
            }${deliveryFloor ? ', этаж ' + deliveryFloor : ''} [Зона: ${zoneName}, доставка: ${deliveryCalc.label}]`
        : null;

    const payload = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      deliveryType,
      deliveryZone: deliveryType === 'COURIER_DELIVERY' ? deliveryZone : undefined,
      deliveryCost,
      deliveryAddress: fullAddress,
      deliveryDate: deliveryDate || null,
      deliveryComment: deliveryComment || null,
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: formatProductName(item.product),
        price: item.product.price,
        quantity: item.quantity,
        brand: item.product.brand,
        image: item.product.images?.[0] || null,
        slug: item.product.slug,
        physicalStatus: item.product.physicalStatus,
        stockKominterna: item.product.stockKominterna,
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

      // If YooKassa confirmationUrl is returned (LOCAL_STOCK + CARD_ONLINE), redirect to YooKassa payment page
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }

      // Otherwise redirect to internal confirmation page
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(
          data.orderNumber
        )}&total=${encodeURIComponent(grandTotal)}&delivery=${encodeURIComponent(
          deliveryType
        )}&payment=${encodeURIComponent(paymentMethod)}&requiresConfirmation=${
          hasNonLocalStockItems ? '1' : '0'
        }`
      );
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Произошла ошибка при отправке заказа. Попробуйте еще раз.';
      setFormError(msg);
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
            <SimonaIconArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в каталог</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-left">
          <SectionBadge variant="teal" text="Оформление заказа" />
          <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight mt-3">
            Оформление покупки
          </h1>
          <p className="text-xs sm:text-sm text-[#87888A] mt-1">
            Комплектация со склада в Нижнем Новгороде, официальная гарантия производителя и сервис «СИМОНА»
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#16191D] border border-[#2B313A] text-left max-w-lg">
            <SimonaIconCart className="w-12 h-12 text-simona-teal mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Ваша корзина пуста</h2>
            <p className="text-xs text-[#87888A] mb-6">
              Выберите интересующие приборы в каталоге бытовой техники «СИМОНА»
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
                  <SimonaIconShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Contacts */}
              <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A]">
                <div className="flex items-center space-x-2.5 mb-4">
                  <span className="w-6 h-6 rounded-md bg-simona-teal/20 text-simona-teal text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-bold text-white tracking-wide">
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
                      onChange={(e) => setCustomerPhone(formatPhoneMask(e.target.value, customerPhone))}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#D7D9DB] mb-1.5 font-medium">
                      Электронная почта (для чека и статуса заказа)
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
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Способ получения
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Warehouse Kominterna 27 */}
                  <label
                    onClick={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === 'PICKUP_WAREHOUSE_KOMINTERNA'}
                            onChange={() => setDeliveryType('PICKUP_WAREHOUSE_KOMINTERNA')}
                            className="accent-simona-teal text-simona-teal focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">
                            Самовывоз со склада (ул. Коминтерна, 27)
                          </span>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Центральный склад «СИМОНА». Удобная зона погрузки, проверка комплектности приборов при вас.
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#D7D9DB] mt-2">
                            <span className="flex items-center space-x-1">
                              <SimonaIconClock className="w-3 h-3 text-simona-teal" />
                              <span>Пн–Пт 10:00–17:00, Сб 10:00–14:30</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <SimonaIconPin className="w-3 h-3 text-simona-teal" />
                              <span>Нижний Новгород, ул. Коминтерна, 27</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal shrink-0">Бесплатно</span>
                    </div>
                  </label>

                  {/* Option 2: Flagship Belinskogo 15 */}
                  <label
                    onClick={() => {
                      if (!hasBulkyItems) {
                        setDeliveryType('PICKUP_BELINSKOGO_15');
                      }
                    }}
                    className={`block p-4 rounded-xl border transition-all ${
                      hasBulkyItems
                        ? 'bg-[#141619] border-[#2B313A]/50 opacity-60 cursor-not-allowed'
                        : deliveryType === 'PICKUP_BELINSKOGO_15'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10 cursor-pointer'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            disabled={hasBulkyItems}
                            checked={deliveryType === 'PICKUP_BELINSKOGO_15'}
                            onChange={() => {
                              if (!hasBulkyItems) setDeliveryType('PICKUP_BELINSKOGO_15');
                            }}
                            className="accent-simona-teal text-simona-teal focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">
                            Самовывоз из салона СИМОНА (ул. Белинского, 15)
                          </span>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Выдача негабаритных товаров (варочные панели, СВЧ, подогреватели посуды, вакууматоры, малая техника, посуда).
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#D7D9DB] mt-2">
                            <span className="flex items-center space-x-1">
                              <SimonaIconClock className="w-3 h-3 text-simona-teal" />
                              <span>Ежедневно 10:00–20:00</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <SimonaIconPin className="w-3 h-3 text-simona-teal" />
                              <span>Нижний Новгород, ул. Белинского, 15</span>
                            </span>
                          </div>

                          {hasBulkyItems && (
                            <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                              <SimonaIconInfo className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>
                                Недоступно для крупногабаритной техники (духовые шкафы, холодильники, вытяжки, стиральные или посудомоечные машины). Доступен самовывоз со склада на ул. Коминтерна, 27 или доставка.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal shrink-0">Бесплатно</span>
                    </div>
                  </label>

                  {/* Option 3: Delivery */}
                  <label
                    onClick={() => setDeliveryType('COURIER_DELIVERY')}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      deliveryType === 'COURIER_DELIVERY'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryType === 'COURIER_DELIVERY'}
                            onChange={() => setDeliveryType('COURIER_DELIVERY')}
                            className="accent-simona-teal text-simona-teal focus:ring-0 cursor-pointer"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">
                            Доставка
                          </span>
                          <p className="text-[11px] text-[#87888A] mt-1 leading-relaxed">
                            Бережная доставка и подъем на этаж собственной логистической службой по Нижнему Новгороду и Нижегородской области, либо надежной транспортной компанией по РФ.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-simona-teal shrink-0">
                        {deliveryCalc.isManualQuote ? 'По тарифам ТК' : deliveryCalc.label}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Delivery Address Fields (if delivery chosen) */}
                {deliveryType === 'COURIER_DELIVERY' && (
                  <div className="mt-5 pt-5 border-t border-[#2B313A] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-white">Адрес и зона доставки</h3>
                      <span className="text-[11px] text-simona-teal font-medium">
                        Приборов в заказе: {totalCartUnits} шт.
                      </span>
                    </div>

                    {/* Zone Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryZone('NN');
                          setDeliveryCity('Нижний Новгород');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          deliveryZone === 'NN'
                            ? 'bg-[#1E2228] border-simona-teal text-white shadow-sm shadow-simona-teal/10'
                            : 'bg-[#16191D] border-[#2B313A] text-[#87888A] hover:text-[#D7D9DB] hover:border-[#3E3D40]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">Нижний Новгород</div>
                        <div className="text-[10px] text-simona-teal font-medium mt-0.5">
                          {totalCartUnits <= 3 ? '1 000 ₽' : totalCartUnits <= 6 ? '1 500 ₽' : '2 000 ₽'}
                        </div>
                        <div className="text-[10px] text-[#87888A] mt-1">Кроме вторника</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryZone('OBLAST_ZONE_1');
                          if (deliveryCity === 'Нижний Новгород') setDeliveryCity('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          deliveryZone === 'OBLAST_ZONE_1' || deliveryZone === 'OBLAST_ZONE_2'
                            ? 'bg-[#1E2228] border-simona-teal text-white shadow-sm shadow-simona-teal/10'
                            : 'bg-[#16191D] border-[#2B313A] text-[#87888A] hover:text-[#D7D9DB] hover:border-[#3E3D40]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">Нижегородская область</div>
                        <div className="text-[10px] text-simona-teal font-medium mt-0.5">
                          {deliveryZone === 'OBLAST_ZONE_2'
                            ? totalCartUnits <= 3 ? '2 700 ₽' : totalCartUnits <= 6 ? '3 300 ₽' : '3 600 ₽'
                            : totalCartUnits <= 3 ? '1 700 ₽' : totalCartUnits <= 6 ? '2 200 ₽' : '2 700 ₽'}
                        </div>
                        <div className="text-[10px] text-[#87888A] mt-1">Рейсы по вторникам</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryZone('RUSSIA_TK');
                          if (deliveryCity === 'Нижний Новгород') setDeliveryCity('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          deliveryZone === 'RUSSIA_TK'
                            ? 'bg-[#1E2228] border-simona-teal text-white shadow-sm shadow-simona-teal/10'
                            : 'bg-[#16191D] border-[#2B313A] text-[#87888A] hover:text-[#D7D9DB] hover:border-[#3E3D40]'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">По России (ТК)</div>
                        <div className="text-[10px] text-simona-teal font-medium mt-0.5">
                          По тарифам ТК
                        </div>
                        <div className="text-[10px] text-[#87888A] mt-1">Обрешетка + страховка</div>
                      </button>
                    </div>

                    {/* Subzone toggle for Oblast */}
                    {(deliveryZone === 'OBLAST_ZONE_1' || deliveryZone === 'OBLAST_ZONE_2') && (
                      <div className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2">
                        <div className="text-[11px] text-[#D7D9DB] font-medium">Выберите зону удаленности от Нижнего Новгорода:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliveryZone('OBLAST_ZONE_1')}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              deliveryZone === 'OBLAST_ZONE_1'
                                ? 'bg-simona-teal/10 border-simona-teal text-white'
                                : 'bg-[#16191D] border-[#2B313A] text-[#87888A]'
                            }`}
                          >
                            <div className="text-xs font-semibold text-white">Зона 1 (до 50 км)</div>
                            <div className="text-[10px] text-simona-teal mt-0.5">
                              {totalCartUnits <= 3 ? '1 700 ₽' : totalCartUnits <= 6 ? '2 200 ₽' : '2 700 ₽'}
                            </div>
                            <div className="text-[10px] text-[#87888A] mt-1">
                              Дзержинск, Кстово, Бор, Балахна, Богородск, Афонино, Новинки, Анкудиновка
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryZone('OBLAST_ZONE_2')}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              deliveryZone === 'OBLAST_ZONE_2'
                                ? 'bg-simona-teal/10 border-simona-teal text-white'
                                : 'bg-[#16191D] border-[#2B313A] text-[#87888A]'
                            }`}
                          >
                            <div className="text-xs font-semibold text-white">Зона 2 (от 51 до 100 км)</div>
                            <div className="text-[10px] text-simona-teal mt-0.5">
                              {totalCartUnits <= 3 ? '2 700 ₽' : totalCartUnits <= 6 ? '3 300 ₽' : '3 600 ₽'}
                            </div>
                            <div className="text-[10px] text-[#87888A] mt-1">
                              Арзамас, Городец, Заволжье, Павлово, Ворсма, Лысково, Семенов, Чкаловск
                            </div>
                          </button>
                        </div>
                        <div className="text-[10px] text-[#87888A] pt-1 flex items-center gap-1.5">
                          <SimonaIconClock className="w-3 h-3 text-simona-teal shrink-0" />
                          <span>Доставка собственной службой по Нижегородской области осуществляется еженедельно <strong>по вторникам</strong>.</span>
                        </div>
                      </div>
                    )}

                    {/* RUSSIA_TK Notice */}
                    {deliveryZone === 'RUSSIA_TK' && (
                      <div className="p-3.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-zinc-300 space-y-1.5">
                        <div className="flex items-center gap-2 text-simona-teal font-semibold text-xs">
                          <SimonaIconPackage className="w-4 h-4" />
                          <span>Доставка по всей России через надежные транспортные компании</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] leading-relaxed">
                          Отправляем заказы через «Деловые Линии», «ПЭК» или «СДЭК». Вся техника упаковывается в жесткую деревянную обрешетку и страхуется на 100% стоимости. Услуги ТК оплачиваются клиентом при получении груза.
                        </p>
                      </div>
                    )}

                    {/* Input fields */}
                    {deliveryZone !== 'RUSSIA_TK' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-[#87888A] mb-1">
                            {deliveryZone === 'NN' ? 'Город' : 'Населенный пункт (город / поселок) *'}
                          </label>
                          <input
                            type="text"
                            required={deliveryZone !== 'NN'}
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            placeholder={deliveryZone === 'NN' ? 'Нижний Новгород' : 'г. Дзержинск / г. Кстово / г. Бор'}
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
                          <label className="block text-[10px] text-[#87888A] mb-1">
                            Желаемая дата {deliveryZone !== 'NN' ? '(по вторникам)' : '(кроме вторника)'}
                          </label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-[#87888A] mb-1">Город назначения в РФ *</label>
                          <input
                            type="text"
                            required
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            placeholder="г. Казань / г. Москва / г. Чебоксары"
                            className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#87888A] mb-1">Транспортная компания</label>
                          <select
                            value={deliveryTransportCompany}
                            onChange={(e) => setDeliveryTransportCompany(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                          >
                            <option value="Деловые Линии">Деловые Линии</option>
                            <option value="ПЭК">ПЭК</option>
                            <option value="СДЭК">СДЭК</option>
                            <option value="Любая удобная (согласовать с менеджером)">Любая удобная (согласовать с менеджером)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-[#87888A] mb-1">Адрес терминала ТК или адрес доставки до двери *</label>
                          <input
                            type="text"
                            required
                            value={deliveryStreet}
                            onChange={(e) => setDeliveryStreet(e.target.value)}
                            placeholder="Адрес филиала ТК или улица, дом, квартира"
                            className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-[#87888A] mb-1">ФИО и паспортные данные получателя (требуются ТК при получении)</label>
                          <input
                            type="text"
                            value={tkPassportData}
                            onChange={(e) => setTkPassportData(e.target.value)}
                            placeholder="Серия и номер паспорта (необязательно, можно сообщить менеджеру по телефону)"
                            className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-[10px] text-[#87888A] mb-1">
                    Комментарий к заказу (пожелания по времени или подключению)
                  </label>
                  <input
                    type="text"
                    value={deliveryComment}
                    onChange={(e) => setDeliveryComment(e.target.value)}
                    placeholder="Например: требуется профессиональная установка и подключение встраиваемой техники"
                    className="w-full px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A]">
                <div className="flex items-center space-x-2.5 mb-4">
                  <span className="w-6 h-6 rounded-md bg-simona-teal/20 text-simona-teal text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Способ оплаты
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: In Salon */}
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
                        className="accent-simona-teal text-simona-teal focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconBuilding className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">В салоне СИМОНА</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Картой или наличными в салоне на ул. Белинского, 15
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: At Warehouse */}
                  <label
                    onClick={() => setPaymentMethod('AT_WAREHOUSE')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'AT_WAREHOUSE'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'AT_WAREHOUSE'}
                        onChange={() => setPaymentMethod('AT_WAREHOUSE')}
                        className="accent-simona-teal text-simona-teal focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconPackage className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">На складе СИМОНА</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Картой или наличными при самовывозе со склада на ул. Коминтерна, 27
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: On Delivery */}
                  <label
                    onClick={() => setPaymentMethod('ON_DELIVERY')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'ON_DELIVERY'
                        ? 'bg-[#1E2228] border-simona-teal shadow-sm shadow-simona-teal/10'
                        : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'ON_DELIVERY'}
                        onChange={() => setPaymentMethod('ON_DELIVERY')}
                        className="accent-simona-teal text-simona-teal focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconDelivery className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">В момент доставки</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          <strong className="text-white font-semibold">Наличными</strong> курьеру по адресу доставки
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 4: Card Online (YooKassa) */}
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
                        className="accent-simona-teal text-simona-teal focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconShieldCheck className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">Картой онлайн</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          ЮKassa, СБП, МИР, Visa, Mastercard без комиссии с фискальным чеком 54-ФЗ
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 5: B2B Invoice */}
                  <label
                    onClick={() => setPaymentMethod('B2B_INVOICE')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer sm:col-span-2 ${
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
                        className="accent-simona-teal text-simona-teal focus:ring-0 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <SimonaIconBuilding className="w-4 h-4 text-simona-teal" />
                          <span className="text-xs font-bold text-white">Счет для юрлиц (B2B)</span>
                        </div>
                        <p className="text-[11px] text-[#87888A] mt-1">
                          Безналичный расчет с НДС 20% для дизайнеров, студий и компаний
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Task 1.4.1: Honest Inventory Payment Notice for CARD_ONLINE */}
                {paymentMethod === 'CARD_ONLINE' && (
                  <div className="mt-4 pt-4 border-t border-[#2B313A]">
                    {hasNonLocalStockItems ? (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                        <SimonaIconClock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-200 leading-relaxed">
                          В заказе есть позиции, требующие подтверждения наличия или сверки схемы монтажа. Ссылка на онлайн-оплату придет вам на почту сразу после проверки заказа экспертом.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-start gap-3">
                        <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                        <p className="text-xs text-[#D7D9DB] leading-relaxed">
                          Все позиции в наличии на центральном складе (Коминтерна, 27). Доступна прямая онлайн-оплата с двухстадийным холдированием средств через ЮKassa (54-ФЗ).
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Ваш заказ
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.product.images?.[0] || ''}
                            alt={formatProductName(item.product)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {formatProductName(item.product)}
                          </p>
                          <p className="text-[10px] text-[#87888A] font-mono">
                            Код: {item.product.sku} • {item.quantity} шт.
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
                    <span>Товары ({totalCartUnits} шт.):</span>
                    <span className="font-montserrat text-white">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#87888A]">
                    <span>Доставка:</span>
                    <span className={`font-montserrat ${deliveryCalc.cost === 0 && !deliveryCalc.isManualQuote ? 'text-simona-teal' : 'text-white'}`}>
                      {deliveryCalc.isManualQuote ? 'По тарифам ТК' : deliveryCalc.cost === 0 ? 'Бесплатно' : formatPrice(deliveryCalc.cost)}
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
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover active:scale-[0.99] text-white font-semibold text-sm tracking-wide transition shadow-lg shadow-simona-teal/20 cursor-pointer disabled:opacity-50"
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
