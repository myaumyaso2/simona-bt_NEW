'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SectionBadge } from '@/components/ui/SectionBadge';
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

interface LoadedOrderInfo {
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentLink?: string | null;
  deliveryType: string;
  itemsJson?: string | null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderParam =
    searchParams.get('order') || searchParams.get('orderNumber') || 'SIM-948123';
  const paramTotal = Number(searchParams.get('total')) || 0;
  const paramDelivery = searchParams.get('delivery') || 'PICKUP_WAREHOUSE_KOMINTERNA';
  const paramPayment = searchParams.get('payment') || 'IN_SALON';
  const requiresConfirmation = searchParams.get('requiresConfirmation') === '1';

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

  const getDeliveryInfo = () => {
    switch (delivery) {
      case 'PICKUP_WAREHOUSE_KOMINTERNA':
        return {
          title: 'Самовывоз: Центральный склад СИМОНА',
          address: 'г. Нижний Новгород, ул. Коминтерна, 27',
          schedule: 'Пн–Пт: 09:00 – 18:00, Сб: 10:00 – 16:00',
          desc: 'Основной терминал самовывоза крупной и встраиваемой техники. Бесплатная погрузка сотрудниками склада в ваш транспорт.',
          mapsUrl: 'https://yandex.ru/maps/-/CDuWvQ1a',
        };
      case 'PICKUP_BELINSKOGO_15':
        return {
          title: 'Самовывоз: Флагманский салон «СИМОНА»',
          address: 'г. Нижний Новгород, ул. Белинского, 15',
          schedule: 'Ежедневно: 10:00 – 20:00',
          desc: 'Экспресс-выдача малой бытовой техники, посуды и фирменных аксессуаров. Прибор будет подготовлен и упакован к вашему визиту.',
          mapsUrl: 'https://yandex.ru/maps/-/CDuWvEnB',
        };
      case 'COURIER_DELIVERY':
      case 'WHITE_GLOVE_DELIVERY':
      default:
        return {
          title: 'Аккуратная доставка и подъем на этаж собственной службой',
          address: 'По указанному вами адресу',
          schedule: 'Согласованный интервал с экипажем',
          desc: 'Бережный занос на этаж прямо в квартиру, распаковка в вашем присутствии и проверка целостности при вас.',
          mapsUrl: null,
        };
    }
  };

  const getPaymentInfo = () => {
    if (paymentStatus === 'HOLD') {
      return {
        title: 'Онлайн-оплата ЮKassa (Двухстадийный холд)',
        badge: 'Средства захолдированы',
        desc: 'Сумма заказа успешно зарезервирована на вашей карте. Финальное списание и отправка кассового чека 54-ФЗ произойдут после проверки прибора кладовщиком на складе Коминтерна, 27.',
      };
    }
    if (paymentStatus === 'PAID') {
      return {
        title: 'Онлайн-оплата ЮKassa (54-ФЗ)',
        badge: 'Оплачено',
        desc: 'Оплата заказа успешно подтверждена. Электронный фискальный чек 54-ФЗ отправлен на вашу электронную почту.',
      };
    }

    switch (payment) {
      case 'IN_SALON':
        return {
          title: 'Оплата в салоне «СИМОНА» (картой или наличными)',
          badge: 'При визите в салон',
          desc: 'Вы сможете лично осмотреть приборы, проверить работу и проконсультироваться с экспертом во флагманском салоне на ул. Белинского, 15 перед проведением оплаты.',
        };
      case 'CARD_ONLINE':
        return requiresConfirmation
          ? {
              title: 'Банковской картой онлайн (ЮKassa / СБП)',
              badge: 'Ссылка после подтверждения',
              desc: 'В заказе есть позиции, требующие подтверждения наличия или сверки схемы монтажа. Ссылка на онлайн-оплату придет вам на почту сразу после проверки заказа экспертом.',
            }
          : {
              title: 'Банковской картой онлайн (ЮKassa / СБП)',
              badge: 'Онлайн-оплата 54-ФЗ',
              desc: 'Электронный кассовый чек в соответствии с 54-ФЗ и подтверждение заказа отправлены на вашу электронную почту.',
            };
      case 'ON_RECEIPT':
        return {
          title: 'Оплата при получении курьеру',
          badge: 'При передаче заказа',
          desc: 'Оплата банковской картой через терминал или наличными экспедитору после визуального осмотра техники.',
        };
      case 'B2B_INVOICE':
        return {
          title: 'Безналичный расчет для юр. лиц (с НДС)',
          badge: 'Счет на e-mail',
          desc: 'Счет на оплату и проект договора поставки направлены на ваш e-mail. Отгрузка резервируется на 3 банковских дня.',
        };
      default:
        return {
          title: 'Согласование с экспертом',
          badge: 'В обработке',
          desc: 'Менеджер свяжется с вами для уточнения деталей.',
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

          {/* Badge & Status */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <SectionBadge variant="teal" text="Заказ успешно сформирован" />
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal animate-pulse" />
              <span>
                {paymentStatus === 'HOLD'
                  ? 'Средства захолдированы'
                  : paymentStatus === 'PAID'
                  ? 'Оплачен'
                  : 'Принят в обработку'}
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="flex items-start space-x-4 mb-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center shrink-0 mt-1">
              <SimonaIconCheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Благодарим за выбор «СИМОНА»!
              </h1>
              <p className="text-sm text-[#87888A] mt-1.5">
                Заказ <span className="text-white font-mono font-bold text-base">№{orderNumber}</span> зарегистрирован в системе.
                {total > 0 && (
                  <> Сумма к оплате: <span className="text-simona-teal font-montserrat font-bold text-base">{formatPrice(total)}</span></>
                )}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[#2B313A] my-6" />

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
              <p className="text-xs text-[#87888A] mb-2">{delInfo.address}</p>
              <div className="text-[11px] text-[#87888A] space-y-1 mb-3">
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal" />
                  <span>{delInfo.schedule}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{delInfo.desc}</p>

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
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#16191D] border border-[#2B313A] text-[10px] text-zinc-300 mb-2">
                {payInfo.badge}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">{payInfo.desc}</p>
            </div>
          </div>

          {/* Next Steps Notification */}
          <div className="bg-[#1E2228]/60 border border-[#2B313A] rounded-xl p-4 mb-8 flex items-start space-x-3 text-xs text-zinc-300 text-left">
            <SimonaIconShieldCheck className="w-5 h-5 text-simona-teal shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Что происходит дальше?</span>
              <p className="text-[#87888A] leading-relaxed">
                Эксперт салона «СИМОНА» свяжется с вами в течение 15 минут в рабочее время (10:00 – 20:00) для сверки монтажных размеров, проверки комплектации и подтверждения времени готовности или доставки.
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
