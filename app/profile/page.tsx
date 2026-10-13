'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { LuxuryProductCard } from '@/components/catalog/LuxuryProductCard';
import {
  SimonaIconHeart,
  SimonaIconGuarantee,
  SimonaIconClock,
  SimonaIconCheckCircle,
  SimonaIconBuilding,
  SimonaIconPackage,
  SimonaIconUser,
  SimonaIconArrowRight,
  SimonaIconCreditCard,
  SimonaIconCart,
  SimonaIconPercent,
  SimonaIconShieldCheck,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import { formatProductName } from '@/lib/catalog/productTitle';
import { ProductItem } from '@/types';

type TabType = 'orders' | 'wishlist' | 'data';
type AuthMode = 'otp' | 'password';

interface OrderItemRecord {
  id?: string;
  productId?: string | null;
  sku?: string | null;
  name: string;
  price: number;
  quantity: number;
  brand?: string | null;
  image?: string | null;
  slug?: string | null;
  physicalStatus?: string | null;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryType: string;
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  deliveryComment?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentLink?: string | null;
  itemsJson?: string;
  orderItems?: OrderItemRecord[];
  createdAt: string;
}

interface CustomerProfile {
  id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  role: string;
  companyName?: string | null;
  address?: string | null;
  bonusPoints: number;
}

function parseOrderItemsFallback(order: OrderRecord): OrderItemRecord[] {
  if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
    return order.orderItems;
  }
  if (order.itemsJson) {
    try {
      const parsed = JSON.parse(order.itemsJson);
      if (Array.isArray(parsed)) return parsed as OrderItemRecord[];
    } catch {
      return [];
    }
  }
  return [];
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') as TabType;
  const initialTab: TabType =
    rawTab === 'wishlist' || rawTab === 'data' ? rawTab : 'orders';

  const { wishlist, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [wishlistProducts, setWishlistProducts] = useState<ProductItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Auth & Profile state
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Login Form state
  const [authMode, setAuthMode] = useState<AuthMode>('otp');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [extraEmail, setExtraEmail] = useState('');
  const [needsExtraEmail, setNeedsExtraEmail] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Personal Data Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [preferredSalon, setPreferredSalon] = useState('Белинского, 15');
  const [isSaved, setIsSaved] = useState(false);
  const [repeatingOrderId, setRepeatingOrderId] = useState<string | null>(null);

  const loadAuthenticatedProfile = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data.authenticated && data.customer) {
        const cust = data.customer as CustomerProfile;
        setAuthenticated(true);
        setCustomer(cust);
        setOrders(Array.isArray(data.orders) ? (data.orders as OrderRecord[]) : []);
        setClientName(cust.name || '');
        setClientPhone(cust.phone || '');
        setClientEmail(cust.email || '');
        setClientAddress(cust.address || '');
        setClientCompany(cust.companyName || '');
      } else {
        setAuthenticated(false);
        setCustomer(null);
        setOrders([]);
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadAuthenticatedProfile();
  }, []);

  // Load wishlist products
  useEffect(() => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    const loadWishlist = async () => {
      setLoadingWishlist(true);
      try {
        const res = await fetch('/api/products/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: wishlist }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setWishlistProducts(data.products as ProductItem[]);
        }
      } catch (err) {
        console.error('Failed to load wishlist products', err);
      } finally {
        setLoadingWishlist(false);
      }
    };
    loadWishlist();
  }, [wishlist]);

  const displayedWishlistProducts = useMemo(() => {
    return wishlistProducts.filter((p) => wishlist.includes(p.id));
  }, [wishlistProducts, wishlist]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          ...(needsExtraEmail && extraEmail ? { email: extraEmail } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsEmail) {
          setNeedsExtraEmail(true);
        }
        throw new Error(data.error || 'Не удалось отправить код');
      }
      setOtpSentTo(data.sentTo || loginIdentifier);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Ошибка отправки кода');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          code: otpCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Неверный код подтверждения');
      }
      setOtpSentTo(null);
      setOtpCode('');
      await loadAuthenticatedProfile();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Ошибка проверки кода');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: loginIdentifier,
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Неверный логин или пароль');
      }
      setPasswordInput('');
      await loadAuthenticatedProfile();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Ошибка входа по паролю');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setCustomer(null);
    setOrders([]);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          address: clientAddress,
          companyName: clientCompany,
        }),
      });
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        await loadAuthenticatedProfile();
      }
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  const handleRepeatOrder = async (order: OrderRecord) => {
    setRepeatingOrderId(order.id);
    try {
      const items = parseOrderItemsFallback(order);
      for (const item of items) {
        const fallbackProduct: ProductItem = {
          id: item.productId || `order-item-${item.sku || item.name}`,
          sku: item.sku || 'АРХИВ',
          name: formatProductName({
            name: item.name,
            brand: item.brand || '',
            category: '',
          }),
          slug: item.slug || 'catalog-item',
          brand: item.brand || 'СИМОНА',
          category: 'Бытовая техника',
          categoryType: 'CATEGORY_B',
          physicalStatus:
            (item.physicalStatus as ProductItem['physicalStatus']) || 'LOCAL_STOCK',
          price: Number(item.price) || 0,
          inStock: true,
          stockCount: 1,
          description: item.name,
          images: item.image ? [item.image] : ['/images/placeholder-appliance.webp'],
          stockBelinskogo15: 0,
          stockKominterna: 1,
        };
        addToCart(fallbackProduct, Number(item.quantity) || 1);
      }
      router.push('/checkout');
    } finally {
      setRepeatingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <SimonaIconCheckCircle className="w-3.5 h-3.5" />
            <span>Выполнен</span>
          </span>
        );
      case 'READY_FOR_PICKUP':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-xs font-semibold">
            <SimonaIconBuilding className="w-3.5 h-3.5" />
            <span>Готов к выдаче</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <SimonaIconCheckCircle className="w-3.5 h-3.5" />
            <span>Подтвержден экспертом</span>
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <SimonaIconCheckCircle className="w-3.5 h-3.5" />
            <span>Оплачен</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
            <span>Отменен</span>
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs font-semibold">
            <SimonaIconClock className="w-3.5 h-3.5" />
            <span>В обработке</span>
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'PAID':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
            <SimonaIconCreditCard className="w-3 h-3" />
            <span>Оплачено (54-ФЗ)</span>
          </span>
        );
      case 'HOLD':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-[11px] font-semibold">
            <SimonaIconCreditCard className="w-3 h-3" />
            <span>Средства захолдированы</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-500/15 text-zinc-300 border border-zinc-500/30 text-[11px] font-semibold">
            <span>Возврат средств</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-semibold">
            <span>Холд отменен</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#1E2228] text-[#87888A] border border-[#2B313A] text-[11px] font-medium">
            <span>Ожидает оплаты</span>
          </span>
        );
    }
  };

  const getDeliveryLabel = (type: string, address?: string | null) => {
    switch (type) {
      case 'PICKUP_WAREHOUSE_KOMINTERNA':
        return 'Самовывоз: Центральный склад (ул. Коминтерна, 27)';
      case 'PICKUP_BELINSKOGO_15':
        return 'Самовывоз: Флагманский салон (ул. Белинского, 15)';
      case 'COURIER_DELIVERY':
      case 'WHITE_GLOVE_DELIVERY':
        return address
          ? `Аккуратная доставка: ${address}`
          : 'Аккуратная доставка и подъем на этаж собственной службой';
      default:
        return 'Самовывоз со склада (ул. Коминтерна, 27)';
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'IN_SALON':
        return 'В салоне СИМОНА (картой или наличными)';
      case 'CARD_ONLINE':
        return 'Онлайн картой / СБП (ЮKassa)';
      case 'ON_RECEIPT':
        return 'Оплата при получении';
      case 'B2B_INVOICE':
        return 'Безналичный расчет с НДС';
      default:
        return 'В салоне СИМОНА';
    }
  };

  const renderLoginBox = () => (
    <div className="max-w-xl bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8 text-left">
      <div className="mb-6">
        <SectionBadge variant="teal" text="Единый профиль СИМОНА" />
        <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white mt-3">
          Вход в личный кабинет и историю заказов
        </h2>
        <p className="text-xs text-[#87888A] mt-1.5 leading-relaxed">
          Авторизуйтесь по одноразовому коду из письма или используйте ваш пароль со старого сайта simona-bt.ru — вся история заказов за 30 лет работы сохранена.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#111315] border border-[#2B313A] mb-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode('otp');
            setAuthError(null);
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
            authMode === 'otp'
              ? 'bg-simona-teal text-white shadow-sm'
              : 'text-[#87888A] hover:text-white'
          }`}
        >
          По коду из письма
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('password');
            setAuthError(null);
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
            authMode === 'password'
              ? 'bg-simona-teal text-white shadow-sm'
              : 'text-[#87888A] hover:text-white'
          }`}
        >
          По паролю
        </button>
      </div>

      {authError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {authError}
        </div>
      )}

      {authMode === 'otp' ? (
        !otpSentTo ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                Ваш Email или номер телефона
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="client@mail.ru или +7 (910) 123-45-67"
                className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
              />
            </div>

            {needsExtraEmail && (
              <div>
                <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                  Укажите Email для отправки 6-значного кода
                </label>
                <input
                  type="email"
                  required
                  value={extraEmail}
                  onChange={(e) => setExtraEmail(e.target.value)}
                  placeholder="client@mail.ru"
                  className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 disabled:opacity-50"
            >
              {authSubmitting ? 'Отправка кода...' : 'Получить 6-значный код на почту'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-xs text-[#D7D9DB]">
              Одноразовый 6-значный код отправлен на адрес{' '}
              <strong className="text-white">{otpSentTo}</strong>
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
                Код подтверждения из письма (6 цифр)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white font-mono text-base tracking-widest placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={authSubmitting || otpCode.length < 6}
                className="flex-1 py-3.5 px-6 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 disabled:opacity-50"
              >
                {authSubmitting ? 'Проверка...' : 'Подтвердить и войти'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpSentTo(null);
                  setOtpCode('');
                }}
                className="py-3.5 px-4 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] text-xs font-semibold text-[#87888A] hover:text-white transition"
              >
                Изменить адрес
              </button>
            </div>
          </form>
        )
      ) : (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
              Email или номер телефона
            </label>
            <input
              type="text"
              required
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="client@mail.ru или +7 (910) 123-45-67"
              className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-semibold mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Введите ваш пароль"
              className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
            />
          </div>

          <button
            type="submit"
            disabled={authSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 disabled:opacity-50"
          >
            {authSubmitting ? 'Вход в кабинет...' : 'Войти по паролю'}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#2B313A] pb-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Персональный кабинет клиента" />
            <h1 className="text-3xl sm:text-4xl font-montserrat font-bold text-white tracking-tight">
              Кабинет СИМОНА
            </h1>
            <p className="text-sm text-[#87888A] max-w-xl">
              Управление заказами бытовой техники, онлайн-оплата со склада, сохраненные подборки и персональные данные.
            </p>
          </div>

          {/* User Monogram & Quick Badge */}
          {authenticated && customer && (
            <div className="flex items-center space-x-3 bg-[#16191D] border border-[#2B313A] px-4 py-3 rounded-xl shrink-0">
              <div className="w-10 h-10 rounded-xl bg-simona-teal/20 border border-simona-teal/40 text-simona-teal flex items-center justify-center font-bold font-montserrat text-sm">
                {(customer.name || 'КС')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">
                  {customer.name || customer.phone}
                </div>
                {customer.role === 'DESIGNER' ? (
                  <div className="text-[11px] text-[#FDBF3E] font-medium flex items-center space-x-1">
                    <SimonaIconPercent className="w-3 h-3 inline" />
                    <span>Клуб дизайнеров и архитекторов</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-simona-teal font-medium flex items-center space-x-1">
                    <SimonaIconGuarantee className="w-3 h-3 inline" />
                    <span>Постоянный клиент • {customer.phone}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 px-3 py-1.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] text-[11px] font-semibold text-[#87888A] hover:text-white transition"
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-[#2B313A]/50 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'orders'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <SimonaIconPackage className="w-4 h-4" />
            <span>Мои заказы ({authenticated ? orders.length : 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'wishlist'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <SimonaIconHeart className="w-4 h-4" />
            <span>Избранное ({wishlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition shrink-0 ${
              activeTab === 'data'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <SimonaIconUser className="w-4 h-4" />
            <span>Персональные данные</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {authLoading ? (
              <div className="text-left py-16 text-xs text-[#87888A]">
                Проверка сессии и загрузка истории заказов...
              </div>
            ) : !authenticated ? (
              renderLoginBox()
            ) : orders.length === 0 ? (
              <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-12 text-left">
                <SimonaIconPackage className="w-12 h-12 text-[#87888A] mb-4" />
                <h3 className="text-base font-semibold text-white mb-1">
                  У вас пока нет оформленных заказов
                </h3>
                <p className="text-xs text-[#87888A] max-w-md mb-6">
                  Выберите бытовую технику из каталога или оформите индивидуальный подбор комплекта со специалистом.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-md"
                >
                  <span>Перейти в каталог</span>
                  <SimonaIconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = parseOrderItemsFallback(order);
                  const showPayOnlineButton =
                    Boolean(order.paymentLink && order.paymentLink.trim()) &&
                    order.paymentStatus === 'PENDING' &&
                    order.status !== 'CANCELLED';

                  return (
                    <div
                      key={order.id}
                      className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 sm:p-6 transition hover:border-[#3E3D40] text-left"
                    >
                      {/* Order Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B313A] pb-4 mb-4">
                        <div>
                          <div className="flex items-center flex-wrap gap-2.5">
                            <span className="font-mono font-bold text-white text-base">
                              №{order.orderNumber}
                            </span>
                            <span className="text-xs text-[#87888A]">
                              от {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                          <div className="text-xs text-[#87888A] mt-1.5 flex flex-wrap items-center gap-2">
                            <span>
                              {getDeliveryLabel(order.deliveryType, order.deliveryAddress)}
                            </span>
                            <span>•</span>
                            <span>{getPaymentLabel(order.paymentMethod)}</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-xs text-[#87888A] block">Сумма заказа:</span>
                          <span className="text-lg font-montserrat font-bold text-simona-teal">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {items.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex items-center justify-between py-2 border-b border-[#2B313A]/30 last:border-0 text-xs"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              {item.image && (
                                <div className="w-10 h-10 rounded-md bg-[#1E2228] border border-[#2B313A] overflow-hidden shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-semibold text-white block truncate">
                                  {formatProductName({
                                    name: item.name,
                                    brand: item.brand || '',
                                    category: '',
                                  })}
                                </span>
                                <span className="text-[11px] text-[#87888A] font-mono">
                                  Код: {item.sku || 'АРХИВ'}{' '}
                                  {item.brand ? `• ${item.brand}` : ''}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <span className="text-zinc-300 font-medium">
                                {item.quantity} шт. × {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions Footer: Оплатить онлайн & Повторить заказ */}
                      <div className="mt-4 pt-4 border-t border-[#2B313A] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {showPayOnlineButton && (
                            <a
                              href={order.paymentLink!.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-md shadow-simona-teal/20"
                            >
                              <SimonaIconCreditCard className="w-4 h-4" />
                              <span>Оплатить онлайн — {formatPrice(order.totalAmount)}</span>
                            </a>
                          )}

                          <button
                            type="button"
                            disabled={repeatingOrderId === order.id}
                            onClick={() => handleRepeatOrder(order)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] text-white text-xs font-semibold transition disabled:opacity-50"
                          >
                            <SimonaIconCart className="w-4 h-4 text-simona-teal" />
                            <span>
                              {repeatingOrderId === order.id
                                ? 'Добавление в корзину...'
                                : 'Повторить заказ'}
                            </span>
                          </button>
                        </div>

                        {showPayOnlineButton && (
                          <span className="text-[11px] text-simona-teal flex items-center space-x-1.5">
                            <SimonaIconShieldCheck className="w-3.5 h-3.5" />
                            <span>Заказ проверен экспертом и готов к онлайн-оплате (54-ФЗ)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {loadingWishlist && wishlistProducts.length === 0 ? (
              <div className="text-left py-16 text-xs text-[#87888A]">
                Загрузка избранного...
              </div>
            ) : displayedWishlistProducts.length === 0 ? (
              <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-12 text-left">
                <SimonaIconHeart className="w-12 h-12 text-[#87888A] mb-4" />
                <h3 className="text-base font-semibold text-white mb-1">
                  Список избранного пуст
                </h3>
                <p className="text-xs text-[#87888A] max-w-md mb-6">
                  Нажимайте на иконку сердца в карточках товаров каталога, чтобы сохранять приборы для дизайн-проекта.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-md"
                >
                  <span>Открыть каталог</span>
                  <SimonaIconArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedWishlistProducts.map((item) => (
                  <LuxuryProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Data */}
        {activeTab === 'data' && (
          <div>
            {!authenticated ? (
              renderLoginBox()
            ) : (
              <div className="max-w-2xl bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8 text-left">
                <h3 className="text-lg font-montserrat font-semibold text-white mb-2">
                  Персональные данные и адреса
                </h3>
                <p className="text-xs text-[#87888A] mb-6 leading-relaxed">
                  Информация используется для подтверждения заказов, бронирования визитов в салоны и аккуратной доставки бытовой техники собственной службой.
                </p>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">
                      ФИО контактного лица
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1.5">
                        Номер телефона
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-[#87888A] cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1.5">
                        Электронная почта
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                      />
                    </div>
                  </div>

                  {customer?.role === 'DESIGNER' && (
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1.5">
                        Студия дизайна / Архитектурное бюро
                      </label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">
                      Основной адрес доставки
                    </label>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Город, улица, дом, квартира"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">
                      Предпочтительный салон для визитов
                    </label>
                    <select
                      value={preferredSalon}
                      onChange={(e) => setPreferredSalon(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    >
                      <option value="Белинского, 15">
                        Флагманский салон: ул. Белинского, 15 (Miele, ASKO, Liebherr, SMEG)
                      </option>
                      <option value="Белинского, 11/66">
                        Монобрендовый салон Omoikiri &amp; Körting: ул. Белинского, 11/66
                      </option>
                      <option value="Коминтерна, 27">
                        Центральный склад самовывоза: ул. Коминтерна, 27
                      </option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-md"
                    >
                      Сохранить изменения
                    </button>
                    {isSaved && (
                      <span className="text-xs text-emerald-400 flex items-center space-x-1">
                        <SimonaIconCheckCircle className="w-4 h-4" />
                        <span>Данные успешно обновлены</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
      <ProfileContent />
    </Suspense>
  );
}
