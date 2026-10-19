'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconCheckCircle,
  SimonaIconPackage,
  SimonaIconCreditCard,
  SimonaIconArrowRight,
  SimonaIconShieldCheck,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import { trackEcommercePurchase, trackGoal } from '@/lib/analytics/tracker';
import { formatProductName } from '@/lib/catalog/productTitle';

interface LoadedOrderInfo {
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentLink?: string | null;
  deliveryType: string;
  deliveryAddress?: string | null;
  itemsJson?: string | null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderParam =
    searchParams.get('order') || searchParams.get('orderNumber') || 'SIM-948123';
  const paramTotal = Number(searchParams.get('total')) || 0;
  const paramDelivery = searchParams.get('delivery') || 'PICKUP_WAREHOUSE_KOMINTERNA';
  const paramPayment = searchParams.get('payment') || 'IN_SALON';

  const [loadedOrder, setLoadedOrder] = useState<LoadedOrderInfo | null>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!rawOrderParam || rawOrderParam === 'SIM-948123') return;
    fetch(`/api/checkout?order=${encodeURIComponent(rawOrderParam)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          setLoadedOrder(data.order as LoadedOrderInfo);
        }
      })
      .catch(() => {
        // ignore network errors on status check
      });
  }, [rawOrderParam]);

  const orderNumber = loadedOrder?.orderNumber || rawOrderParam;
  const total = loadedOrder?.totalAmount ?? paramTotal;
  const delivery = loadedOrder?.deliveryType || paramDelivery;
  const payment = loadedOrder?.paymentMethod || paramPayment;
  const paymentStatus = loadedOrder?.paymentStatus || 'PENDING';

  const orderItems = useMemo(() => {
    if (!loadedOrder?.itemsJson) return [];
    try {
      const raw = JSON.parse(loadedOrder.itemsJson);
      if (Array.isArray(raw)) {
        return raw.map((item: any) => ({
          id: item.productId || item.id || '',
          sku: item.sku || '',
          name: item.name ? formatProductName(item) : 'Товар',
          brand: item.brand || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image:
            item.image ||
            (Array.isArray(item.images) ? item.images[0] : null) ||
            null,
        }));
      }
    } catch {
      // fallback
    }
    return [];
  }, [loadedOrder?.itemsJson]);

  const totalUnits = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    if (!hasTracked.current && total > 0) {
      hasTracked.current = true;

      let parsedProducts: any[] = [];
      try {
        if (loadedOrder?.itemsJson) {
          const rawItems = JSON.parse(loadedOrder.itemsJson);
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            parsedProducts = rawItems.map((i: any) => ({
              id: i.sku || i.productId || orderNumber,
              name: i.name || `Товар ${orderNumber}`,
              price: Number(i.price) || total,
              brand: i.brand || 'СИМОНА',
              category: i.category || 'Бытовая техника',
              quantity: Number(i.quantity) || 1,
            }));
          }
        }
      } catch {
        parsedProducts = [];
      }

      if (parsedProducts.length === 0) {
        parsedProducts = [
          {
            id: orderNumber,
            name: `Заказ ${orderNumber}`,
            price: total,
            brand: 'СИМОНА',
            quantity: 1,
          },
        ];
      }

      trackEcommercePurchase({
        id: orderNumber,
        revenue: total,
        products: parsedProducts,
      });
      trackGoal('ORDER_CONFIRMED', { orderNumber, total, delivery, payment });
    }
  }, [orderNumber, total, delivery, payment, loadedOrder?.itemsJson]);

  interface DeliveryInfoResult {
    title: string;
    address: string;
    schedule: string;
    desc?: string | null;
    mapsUrl?: string | null;
  }

  interface PaymentInfoResult {
    title: string;
    address?: string | null;
    schedule?: string | null;
    desc?: string | null;
    mapsUrl?: string | null;
  }

  const getDeliveryInfo = (): DeliveryInfoResult => {
    switch (delivery) {
      case 'PICKUP_WAREHOUSE_KOMINTERNA':
        return {
          title: 'Самовывоз со склада (ул. Коминтерна, 27)',
          address: 'Нижний Новгород, ул. Коминтерна, 27',
          schedule: 'Пн–Пт 10:00–17:00, Сб 10:00–14:30',
          desc: null,
          mapsUrl: 'https://yandex.ru/maps/-/CXF1mHJD',
        };
      case 'PICKUP_BELINSKOGO_15':
        return {
          title: 'Самовывоз из салона СИМОНА (ул. Белинского, 15)',
          address: 'Нижний Новгород, ул. Белинского, 15',
          schedule: 'Пн–Сб: 10:00–20:00, Вс: 10:00–18:00',
          desc: null,
          mapsUrl: 'https://yandex.ru/maps/-/CXF1ZJI-',
        };
      case 'COURIER_DELIVERY':
      case 'WHITE_GLOVE_DELIVERY':
      default:
        return {
          title: 'Доставка',
          address: loadedOrder?.deliveryAddress || 'По указанному вами адресу',
          schedule: 'Согласованный интервал с экипажем',
          desc: 'Бережная доставка и подъем на этаж собственной логистической службой по Нижнему Новгороду и Нижегородской области, либо надежной транспортной компанией по РФ.',
          mapsUrl: null,
        };
    }
  };

  const getPaymentInfo = (): PaymentInfoResult => {
    if (paymentStatus === 'HOLD') {
      return {
        title: 'Картой онлайн',
        desc: 'Сумма заказа успешно зарезервирована на вашей карте (ЮKassa). Финальное списание и отправка кассового чека 54-ФЗ произойдут после проверки приборов на складе.',
      };
    }
    if (paymentStatus === 'PAID') {
      return {
        title: 'Картой онлайн',
        desc: 'Оплата заказа успешно подтверждена. Электронный фискальный чек 54-ФЗ отправлен на вашу электронную почту.',
      };
    }

    switch (payment) {
      case 'IN_SALON':
        return {
          title: 'В салоне СИМОНА',
          address: 'Нижний Новгород, ул. Белинского, 15',
          schedule: 'Пн–Сб: 10:00–20:00, Вс: 10:00–18:00',
          desc: null,
          mapsUrl: 'https://yandex.ru/maps/-/CXF1ZJI-',
        };
      case 'AT_WAREHOUSE':
        return {
          title: 'На складе СИМОНА',
          address: 'Нижний Новгород, ул. Коминтерна, 27',
          schedule: 'Пн–Пт 10:00–17:00, Сб 10:00–14:30',
          desc: null,
          mapsUrl: 'https://yandex.ru/maps/-/CXF1mHJD',
        };
      case 'ON_DELIVERY':
      case 'ON_RECEIPT':
        return {
          title: 'В момент доставки',
          desc: 'Наличными курьеру по адресу доставки',
        };
      case 'CARD_ONLINE':
        return {
          title: 'Картой онлайн',
          desc: 'ЮKassa, СБП, МИР, Visa, Mastercard без комиссии с фискальным чеком 54-ФЗ',
        };
      case 'B2B_INVOICE':
        return {
          title: 'Безналичный расчет для юр. лиц (с НДС)',
          desc: 'Счет на оплату и договор поставки с НДС 20% для организаций и ИП',
        };
      default:
        return {
          title: 'Согласование с экспертом',
          desc: 'Менеджер свяжется с вами для уточнения деталей оплаты.',
        };
    }
  };

  const delInfo = getDeliveryInfo();
  const payInfo = getPaymentInfo();

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Teal Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main heading */}
          <div className="flex items-center space-x-4 mb-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,151,156,0.15)]">
              <SimonaIconCheckCircle className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Заказ №{orderNumber} принят в обработку.
            </h1>
          </div>

          {/* Order Items & Summary Block */}
          <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-4 sm:p-5 mb-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B313A] mb-3">
              <div className="flex items-center space-x-2 text-simona-teal">
                <SimonaIconPackage className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide text-white">
                  Содержимое заказа
                </span>
              </div>
              {totalUnits > 0 && (
                <span className="text-[11px] text-[#87888A] font-medium">
                  {totalUnits}{' '}
                  {totalUnits % 10 === 1 && totalUnits % 100 !== 11
                    ? 'прибор'
                    : totalUnits % 10 >= 2 &&
                      totalUnits % 10 <= 4 &&
                      (totalUnits % 100 < 10 || totalUnits % 100 >= 20)
                    ? 'прибора'
                    : 'приборов'}
                </span>
              )}
            </div>

            {orderItems.length > 0 ? (
              <div className="space-y-2.5">
                {orderItems.map((item, idx) => (
                  <div
                    key={item.id || item.sku || idx}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[#16191D] border border-[#2B313A]/60"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#111315] border border-[#2B313A] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <SimonaIconPackage className="w-6 h-6 text-[#6E7074]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white leading-snug line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#87888A] flex flex-wrap items-center gap-1.5 mt-1 font-medium">
                        {item.sku && <span>Код: {item.sku}</span>}
                        {item.sku && <span className="text-[#4E545E]">•</span>}
                        <span>{item.quantity} шт.</span>
                        <span className="text-[#4E545E]">•</span>
                        <span className="text-white font-semibold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-montserrat font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div
              className={`flex items-center justify-between ${
                orderItems.length > 0 ? 'pt-3 mt-3 border-t border-[#2B313A]' : ''
              }`}
            >
              <span className="text-xs text-[#87888A] font-medium">Сумма заказа:</span>
              <span className="text-lg font-montserrat font-bold text-simona-teal">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            {/* Delivery Info */}
            <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-5">
              <div className="flex items-center space-x-2 text-simona-teal mb-3">
                <SimonaIconPackage className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide text-white">
                  Получение заказа
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{delInfo.title}</h3>
              {delInfo.address && (
                <p className="text-xs text-[#87888A] mb-2">{delInfo.address}</p>
              )}
              {delInfo.schedule && (
                <div className="text-[11px] text-[#87888A] space-y-1 mb-3">
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal" />
                    <span>{delInfo.schedule}</span>
                  </div>
                </div>
              )}
              {delInfo.desc && (
                <p className="text-xs text-zinc-400 leading-relaxed">{delInfo.desc}</p>
              )}

              {delInfo.mapsUrl && (
                <a
                  href={delInfo.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:underline mt-3"
                >
                  <SimonaIconPin className="w-3.5 h-3.5" />
                  <span>Открыть на Яндекс.Картах</span>
                </a>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-5">
              <div className="flex items-center space-x-2 text-simona-teal mb-3">
                <SimonaIconCreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide text-white">
                  Оплата
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{payInfo.title}</h3>
              {payInfo.address && (
                <p className="text-xs text-[#87888A] mb-2">{payInfo.address}</p>
              )}
              {payInfo.schedule && (
                <div className="text-[11px] text-[#87888A] space-y-1 mb-3">
                  <div className="flex items-center space-x-1.5 text-zinc-300">
                    <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal" />
                    <span>{payInfo.schedule}</span>
                  </div>
                </div>
              )}
              {payInfo.desc && (
                <p className="text-xs text-zinc-400 leading-relaxed">{payInfo.desc}</p>
              )}

              {payInfo.mapsUrl && (
                <a
                  href={payInfo.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:underline mt-3"
                >
                  <SimonaIconPin className="w-3.5 h-3.5" />
                  <span>Открыть на Яндекс.Картах</span>
                </a>
              )}
            </div>
          </div>

          {/* Next Steps Notification */}
          <div className="bg-[#1E2228]/60 border border-[#2B313A] rounded-xl p-4 mb-8 flex items-start space-x-3 text-xs text-zinc-300 text-left">
            <SimonaIconShieldCheck className="w-5 h-5 text-simona-teal shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Что происходит дальше?</span>
              <p className="text-[#87888A] leading-relaxed">
                Эксперт салона «СИМОНА» свяжется с вами для подтверждения наличия и даты доставки.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#2B313A]">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2"
            >
              <span>В личный кабинет</span>
              <SimonaIconArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/catalog"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] text-xs font-semibold tracking-wide transition"
            >
              Вернуться в каталог
            </Link>
          </div>
        </div>

        {/* Contact Assistance Footer */}
        <div className="mt-8 text-left text-xs text-[#87888A]">
          <span>Возникли вопросы по заказу? Звоните дежурному эксперту: </span>
          <a href="tel:+78314237600" className="text-white hover:text-simona-teal font-semibold transition ml-1">
            +7 (831) 423-76-00
          </a>
          <span className="mx-2">•</span>
          <span>Ежедневно с 10:00 до 20:00</span>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
