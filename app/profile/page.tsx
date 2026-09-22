'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconGuarantee,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPercent,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import {
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Building,
  Store,
  Truck,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

import { useSearchParams } from 'next/navigation';
import { ProductItem } from '@/types';

type TabType = 'orders' | 'wishlist' | 'data' | 'b2b' | 'visits';

interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  image?: string;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryComment?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'orders';
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [wishlistProducts, setWishlistProducts] = useState<ProductItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

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
          setWishlistProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load wishlist products', err);
      } finally {
        setLoadingWishlist(false);
      }
    };
    loadWishlist();
  }, [wishlist]);

  // Client Data State
  const [clientPhone, setClientPhone] = useState('+7 (920) 012-34-56');
  const [clientName, setClientName] = useState('Ольга Николаевна');
  const [clientEmail, setClientEmail] = useState('olga.interior@mail.ru');
  const [clientAddress, setClientAddress] = useState('г. Нижний Новгород, ул. Максима Горького, д. 152, кв. 48');
  const [preferredSalon, setPreferredSalon] = useState('Белинского, 15');
  const [isSaved, setIsSaved] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');

  // Fetch orders from API
  const fetchOrders = async (phoneQuery?: string) => {
    setLoadingOrders(true);
    try {
      const url = phoneQuery
        ? `/api/profile/orders?phone=${encodeURIComponent(phoneQuery)}`
        : '/api/profile/orders';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchOrders = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPhone.trim()) {
      fetchOrders(searchPhone.trim());
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Выполнен</span>
          </span>
        );
      case 'READY_FOR_PICKUP':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>Готов к выдаче</span>
          </span>
        );
      case 'CONFIRMED':
      case 'PAID':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Подтвержден</span>
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>В обработке</span>
          </span>
        );
    }
  };

  const getDeliveryLabel = (type: string, address?: string) => {
    switch (type) {
      case 'PICKUP_WAREHOUSE_KOMINTERNA':
        return 'Самовывоз: Склад (ул. Коминтерна, 27)';
      case 'PICKUP_BELINSKOGO_15':
        return 'Самовывоз: Салон (ул. Белинского, 15)';
      case 'WHITE_GLOVE_DELIVERY':
        return address ? `Доставка: ${address}` : 'Премиальная доставка в белых перчатках';
      default:
        return 'Самовывоз со склада (Коминтерна, 27)';
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'IN_SALON':
        return 'В салоне СИМОНА (картой или наличными)';
      case 'CARD_ONLINE':
        return 'Оплачено онлайн (ЮKassa)';
      case 'ON_RECEIPT':
        return 'Оплата при получении';
      case 'B2B_INVOICE':
        return 'Безналичный расчет с НДС';
      default:
        return 'В салоне СИМОНА';
    }
  };

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
              Управление заказами премиальной бытовой техники, сохраненные подборки, спецификации и условия Архитектурного клуба.
            </p>
          </div>

          {/* User Monogram & Quick Badge */}
          <div className="flex items-center space-x-3 bg-[#16191D] border border-[#2B313A] px-4 py-3 rounded-xl shrink-0">
            <div className="w-10 h-10 rounded-lg bg-simona-teal/20 border border-simona-teal/40 text-simona-teal flex items-center justify-center font-bold font-montserrat text-sm">
              {clientName.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'ОН'}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{clientName}</div>
              <div className="text-[11px] text-simona-teal font-medium flex items-center space-x-1">
                <SimonaIconGuarantee className="w-3 h-3 inline" />
                <span>Премиальный статус • B2B партнер</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-[#2B313A]/50 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 ${
              activeTab === 'orders'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Мои заказы ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 ${
              activeTab === 'wishlist'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <SimonaIconHeart className="w-4 h-4" />
            <span>Избранное ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 ${
              activeTab === 'data'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Персональные данные</span>
          </button>

          <button
            onClick={() => setActiveTab('b2b')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 ${
              activeTab === 'b2b'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>B2B / Архитекторам</span>
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 ${
              activeTab === 'visits'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Визиты и Тест-драйвы</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search orders filter */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Поиск по номеру телефона</h3>
                <p className="text-xs text-[#87888A]">Найдите историю заказов, оформленных в салоне или на сайте</p>
              </div>
              <form onSubmit={handleSearchOrders} className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Orders List */}
            {loadingOrders ? (
              <div className="text-center py-16 text-xs text-[#87888A]">Загрузка истории заказов...</div>
            ) : orders.length === 0 ? (
              <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-12 text-center">
                <Package className="w-12 h-12 text-[#87888A] mx-auto mb-4" />
                <h3 className="text-base font-semibold text-white mb-1">У вас пока нет оформленных заказов</h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto mb-6">
                  Выберите бытовую технику из каталога или оформите индивидуальный подбор со специалистом.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  <span>Перейти в каталог</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 sm:p-6 transition hover:border-[#3E3D40]"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B313A] pb-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono font-bold text-white text-base">№{order.orderNumber}</span>
                          <span className="text-xs text-[#87888A]">
                            от {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-xs text-[#87888A] mt-1 flex items-center space-x-2">
                          <span>{getDeliveryLabel(order.deliveryType, order.deliveryAddress)}</span>
                          <span>•</span>
                          <span>{getPaymentLabel(order.paymentMethod)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#87888A] block">Сумма заказа:</span>
                        <span className="text-lg font-montserrat font-bold text-simona-teal">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-[#2B313A]/30 last:border-0 text-xs">
                          <div className="flex items-center space-x-3 min-w-0">
                            {item.image && (
                              <div className="w-10 h-10 rounded-lg bg-[#1E2228] border border-[#2B313A] overflow-hidden shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-semibold text-white block truncate">{item.name}</span>
                              <span className="text-[11px] text-[#87888A]">Арт: {item.sku} {item.brand ? `• ${item.brand}` : ''}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <span className="text-zinc-300 font-medium">{item.quantity} шт. × {formatPrice(item.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Footer */}
                    <div className="pt-4 mt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="text-[11px] text-[#87888A]">
                        Куратор заказа: Флагманский салон на Белинского, 15 • Телефон (831) 423-76-00
                      </div>
                      <a
                        href="tel:+78314237600"
                        className="text-simona-teal hover:underline font-semibold flex items-center space-x-1"
                      >
                        <SimonaIconPhoneSolid className="w-3.5 h-3.5 inline" />
                        <span>Связаться с менеджером</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {wishlist.length === 0 ? (
              <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-12 text-center">
                <SimonaIconHeart className="w-12 h-12 text-[#87888A] mx-auto mb-4" />
                <h3 className="text-base font-semibold text-white mb-1">Список избранного пуст</h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto mb-6">
                  Нажимайте на иконку сердца в карточках товаров каталога, чтобы сохранять приборы для дизайн-проекта.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  <span>Открыть каталог</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlistProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 flex flex-col justify-between group hover:border-simona-teal/50 transition shadow-md"
                  >
                    <div>
                      <div className="relative aspect-square w-full rounded-xl bg-[#1E2228] overflow-hidden mb-3">
                        <img
                          src={item.images?.[0] || '/images/products/placeholder.webp'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/60 text-white/80 hover:text-red-400 hover:bg-black/80 transition"
                          title="Удалить из избранного"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="text-[11px] font-semibold text-simona-teal uppercase tracking-wider mb-1">
                        {item.brand}
                      </div>
                      <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-2">
                        {item.name}
                      </h4>
                      <div className="text-xs text-[#87888A] mb-3">Арт: {item.sku}</div>
                    </div>

                    <div className="pt-3 border-t border-[#2B313A] flex items-center justify-between">
                      <div className="text-base font-montserrat font-bold text-white">
                        {formatPrice(item.price)}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5"
                      >
                        <SimonaIconCart className="w-3.5 h-3.5" />
                        <span>В корзину</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Data */}
        {activeTab === 'data' && (
          <div className="max-w-2xl bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-montserrat font-semibold text-white mb-2">Персональные данные и адреса</h3>
            <p className="text-xs text-[#87888A] mb-6 leading-relaxed">
              Информация используется для подтверждения заказов, бронирования визитов в шоурумы и доставки в белых перчатках.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">ФИО контактного лица</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Номер телефона</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Электронная почта</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">Основной адрес доставки</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Город, улица, дом, квартира"
                  className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">Предпочтительный салон для визитов</label>
                <select
                  value={preferredSalon}
                  onChange={(e) => setPreferredSalon(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                >
                  <option value="Белинского, 15">Флагманский салон: ул. Белинского, 15 (Miele, ASKO, Liebherr, SMEG)</option>
                  <option value="Белинского, 11/66">Фирменный салон OMOIKIRI & KÖRTING: ул. Белинского, 11/66</option>
                  <option value="Коминтерна, 27">Центральный склад самовывоза: ул. Коминтерна, 27</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider transition shadow-md"
                >
                  Сохранить изменения
                </button>
                {isSaved && (
                  <span className="text-xs text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Данные успешно обновлены</span>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: B2B / Designers */}
        {activeTab === 'b2b' && (
          <div className="space-y-6">
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2B313A]">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
                    <SimonaIconPercent className="w-3.5 h-3.5 text-amber-300" />
                    <span>Участник Архитектурного Клуба СИМОНА</span>
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-white">
                    Дизайн-партнер: Студия интерьера «Арх-Концепт»
                  </h3>
                  <p className="text-xs text-[#87888A] mt-1">
                    Индивидуальная партнерская шкала скидок до 20%, технический контроль встройки и персональный менеджер.
                  </p>
                </div>

                <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-simona-teal/20 text-simona-teal flex items-center justify-center font-bold text-lg font-montserrat">
                    20%
                  </div>
                  <div className="text-xs">
                    <span className="text-[#87888A] block">Базовый дисконт на комплекты:</span>
                    <span className="text-white font-bold text-sm">Премиум-встройка и мойки</span>
                  </div>
                </div>
              </div>

              {/* Personal Manager Card */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-5">
                  <div className="text-xs font-semibold text-simona-teal uppercase tracking-wider mb-2">
                    Ваш персональный куратор
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Мария Воронина</h4>
                  <p className="text-xs text-[#87888A] mb-4">
                    Ведущий эксперт по интеграции премиальной встройки, шеф-монтажу и координации с фабриками кухонь.
                  </p>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div>📞 Телефон / WhatsApp: <a href="tel:+78314237600" className="text-white hover:text-simona-teal">+7 (831) 423-76-00 (доб. 104)</a></div>
                    <div>✉️ Прямая почта: <span className="text-white">b2b@simona-bt.ru</span></div>
                  </div>
                </div>

                <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-simona-teal uppercase tracking-wider mb-2">
                      Загрузка спецификаций и схем
                    </div>
                    <p className="text-xs text-[#87888A] mb-4 leading-relaxed">
                      Отправьте нам PDF-план расстановки или чертеж кухонного гарнитура. Мы проверим вентканалы, электрические мощности и подготовим спецификацию с 3D-моделями за 24 часа.
                    </p>
                  </div>
                  <Link
                    href="/designers"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
                  >
                    <span>Загрузить проект на расчет</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Visits & Test-drives */}
        {activeTab === 'visits' && (
          <div className="space-y-6">
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2B313A]">
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-white">
                    Записи на демонстрацию и тест-драйв
                  </h3>
                  <p className="text-xs text-[#87888A] mt-1">
                    Флагманский салон на ул. Белинского, 15: Активная кухня, винные дегустации и проверка приборов в работе.
                  </p>
                </div>
                <Link
                  href="/showrooms"
                  className="px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shrink-0"
                >
                  Забронировать визит
                </Link>
              </div>

              {/* Sample Upcoming Visit */}
              <div className="mt-6 space-y-4">
                <div className="bg-[#1E2228] border border-simona-teal/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Предстоящий визит</span>
                    </span>
                    <span className="text-xs text-zinc-400">Суббота, 15:00</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Тест-драйв духовых шкафов и индукции Miele / ASKO
                  </h4>
                  <p className="text-xs text-[#87888A] mb-3">
                    Место: Флагман «СИМОНА», г. Нижний Новгород, ул. Белинского, 15 («Активная кухня»).
                  </p>
                  <div className="text-[11px] text-zinc-300">
                    Эксперт шоурума встретит вас с чашкой премиального кофе, покажет пар и термощуп в реальной готовке и продемонстрирует тишину работы приборов.
                  </div>
                </div>
              </div>
            </div>
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
