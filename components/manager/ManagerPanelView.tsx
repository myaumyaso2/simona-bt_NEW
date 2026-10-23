'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  SimonaIconPackage,
  SimonaIconChat,
  SimonaIconDownload,
  SimonaIconFile,
  SimonaIconCheckCircle,
  SimonaIconClock,
  SimonaIconSearch,
  SimonaIconCreditCard,
  SimonaIconUser,
  SimonaIconBuilding,
  SimonaIconPin,
  SimonaIconExternalLink,
  SimonaIconPlus,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import { ManagerSyncView } from './ManagerSyncView';
import { ManagerProductsNoPhotoView } from './ManagerProductsNoPhotoView';

export type ManagerTabId = 'orders' | 'leads' | 'products-no-photo' | 'chat' | 'sync';

interface ChatMessageRecord {
  id: string;
  sessionId: string;
  sender: string;
  text: string;
  clientName: string | null;
  clientPhone: string | null;
  pageUrl: string | null;
  createdAt: string;
}

interface ChatSessionRecord {
  sessionId: string;
  clientName: string | null;
  clientPhone: string | null;
  pageUrl: string | null;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: ChatMessageRecord[];
}

interface OrderItemRecord {
  productId?: string;
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  image?: string | null;
  physicalStatus?: string;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryType: string;
  deliveryAddress: string | null;
  deliveryDate: string | null;
  deliveryComment: string | null;
  totalAmount: number;
  status: string;
  isOneClick?: boolean;
  paymentStatus: string;
  paymentMethod: string;
  paymentLink: string | null;
  companyName: string | null;
  companyInn: string | null;
  itemsJson: string;
  ymClientId: string | null;
  yclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  asanaTaskId: string | null;
  createdAt: string;
}

interface LeadRecord {
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  preferredShowroom: string | null;
  productId: string | null;
  productName: string | null;
  portfolioUrl: string | null;
  attachmentPath: string | null;
  comment: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  ymClientId: string | null;
  yclid: string | null;
  status: string;
  asanaTaskId: string | null;
  createdAt: string;
}

const ORDER_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Новый', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { value: 'IN_PROGRESS', label: 'Принят в работу', badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  { value: 'CONFIRMED', label: 'Подтвержден экспертом', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  { value: 'PAID', label: 'Оплачен', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { value: 'READY_FOR_PICKUP', label: 'Готов к выдаче', badgeClass: 'bg-simona-teal/20 text-simona-teal border-simona-teal/40' },
  { value: 'DELIVERED', label: 'Выполнен / Доставлен', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { value: 'CANCELLED', label: 'Отменен', badgeClass: 'bg-[#8A151A]/20 text-red-300 border-[#8A151A]/40' },
  { value: 'TEST', label: 'Тестовый заказ', badgeClass: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/40' },
];

const LEAD_STATUS_OPTIONS = [
  { value: 'NEW', label: 'Новая', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { value: 'IN_PROGRESS', label: 'В работе', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  { value: 'DONE', label: 'Обработана', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
];

const LEAD_TYPE_MAP: Record<string, string> = {
  ACTIVE_KITCHEN_TESTDRIVE: 'Тест-драйв Активной кухни',
  SHOWROOM_VISIT: 'Визит в салон с экспертом',
  PROJECT_MATCHING: 'Расчет по дизайн-проекту',
  B2B_CLUB: 'Клуб дизайнеров и архитекторов',
  B2B_OPT: 'Запрос оптового прайса (Опт)',
  KITCHEN_ESTIMATE: 'Расчет комплекта для кухни',
  QUICK_CONSULT: 'Быстрая консультация',
  EQUIPMENT_SELECTION: 'Подбор комплекта техники',
  PRICE_MATCH: 'Нашли дешевле (Price Match)',
};

const DELIVERY_LABELS: Record<string, string> = {
  PICKUP_WAREHOUSE_KOMINTERNA: 'Самовывоз: Склад (ул. Коминтерна, 27)',
  PICKUP_BELINSKOGO_15: 'Самовывоз: Салон (ул. Белинского, 15)',
  COURIER_DELIVERY: 'Аккуратная доставка и подъем на этаж',
  WHITE_GLOVE_DELIVERY: 'Аккуратная доставка и подъем на этаж',
};

const PAYMENT_LABELS: Record<string, string> = {
  IN_SALON: 'В салоне СИМОНА',
  CARD_ONLINE: 'Картой онлайн (ЮKassa / СБП)',
  ON_RECEIPT: 'При получении',
  B2B_INVOICE: 'Счет для юрлиц (B2B с НДС)',
};

export function ManagerPanelView({ initialTab = 'orders' }: { initialTab?: ManagerTabId }) {
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<ManagerTabId>(initialTab);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [editStatus, setEditStatus] = useState('NEW');
  const [editPaymentLink, setEditPaymentLink] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadTypeFilter, setLeadTypeFilter] = useState('ALL');
  const [leadStatusFilter, setLeadStatusFilter] = useState('ALL');

  // Products no-photo state
  const [totalNoPhotoCount, setTotalNoPhotoCount] = useState(0);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSessionRecord[]>([]);
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null);
  const [managerReplyText, setManagerReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Auto-refresh & background sync state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  }, []);

  const loadAllData = useCallback(async (searchNoPhoto = '', isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);
    try {
      const t = Date.now();
      const [ordersRes, leadsRes, noPhotoRes, chatRes] = await Promise.all([
        fetch(`/api/manager/orders?_t=${t}`, { cache: 'no-store' }),
        fetch(`/api/manager/leads?_t=${t}`, { cache: 'no-store' }),
        fetch(`/api/manager/products-no-photo?q=${encodeURIComponent(searchNoPhoto)}&_t=${t}`, { cache: 'no-store' }),
        fetch(`/api/manager/chat?_t=${t}`, { cache: 'no-store' }),
      ]);

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        const list: OrderRecord[] = oData.orders || [];
        setOrders(list);
        setSelectedOrderId((prev) => {
          if (!prev && list.length > 0) {
            setEditStatus(list[0].status);
            setEditPaymentLink(list[0].paymentLink || '');
            return list[0].id;
          }
          return prev;
        });
      }

      if (leadsRes.ok) {
        const lData = await leadsRes.json();
        setLeads(lData.leads || []);
      }

      if (noPhotoRes.ok) {
        const pData = await noPhotoRes.json();
        setTotalNoPhotoCount(pData.totalCount ?? pData.totalNoPhoto ?? 0);
      }

      if (chatRes.ok) {
        const cData = await chatRes.json();
        const sessions: ChatSessionRecord[] = cData.sessions || [];
        setChatSessions(sessions);
        setSelectedChatSessionId((prev) => {
          if (!prev && sessions.length > 0) {
            return sessions[0].sessionId;
          }
          return prev;
        });
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading manager data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Background auto-refresh polling every 30 seconds
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    const interval = setInterval(() => {
      loadAllData('', true);
    }, 30000);

    return () => clearInterval(interval);
  }, [authStatus, loadAllData]);

  useEffect(() => {
    // Check URL query param ?tab=
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab') as ManagerTabId | null;
      if (t && ['orders', 'leads', 'products-no-photo', 'chat', 'sync'].includes(t)) {
        setActiveTab(t);
      }
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setAuthStatus('authenticated');
          loadAllData();
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch {
        setAuthStatus('unauthenticated');
      }
    }
    checkAuth();
  }, [loadAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthStatus('authenticated');
        loadAllData();
      } else {
        setLoginError(data.error || 'Неверный пароль доступа');
      }
    } catch {
      setLoginError('Ошибка соединения с сервером');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSelectOrder = (order: OrderRecord) => {
    setSelectedOrderId(order.id);
    setEditStatus(order.status);
    setEditPaymentLink(order.paymentLink || '');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    setIsUpdatingOrder(true);

    try {
      const res = await fetch('/api/manager/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrderId,
          status: editStatus,
          paymentLink: editPaymentLink,
          notifyCustomer: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка обновления заказа');

      setOrders((prev) => prev.map((o) => (o.id === selectedOrderId ? data.order : o)));
      const emailSentMsg =
        data.order.status === 'TEST'
          ? ' (тестовый заказ — отправка клиенту пропущена)'
          : data.emailResult?.sent
          ? ' • Письмо отправлено клиенту на почту'
          : data.order.customerEmail
          ? ' • Уведомление записано в журнал отправки'
          : '';
      showToast('success', `Статус заказа №${data.order.orderNumber} обновлен${emailSentMsg}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка сохранения';
      showToast('error', message);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/manager/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка обновления заявки');
      setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
      showToast('success', 'Статус заявки обновлен');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления заявки';
      showToast('error', message);
    }
  };

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#111315] text-white flex items-center justify-center">
        <div className="text-sm text-[#87888A]">Загрузка операционной панели менеджера...</div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#111315] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#16191D] border border-[#2B313A] space-y-6 text-left">
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-white">
              Панель менеджера «СИМОНА»
            </h1>
            <p className="text-xs text-[#87888A] mt-1">
              Управление заказами, заявками с 9 форм и публикация фотографий новинок из 1С
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-[#8A151A]/20 border border-[#8A151A]/50 text-xs text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[#D7D9DB] mb-1.5 font-medium">
                Пароль сотрудника
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-sm focus:outline-none focus:border-simona-teal"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-sm font-semibold transition cursor-pointer"
            >
              {isLoggingIn ? 'Вход...' : 'Войти в операционную панель'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.itemsJson.toLowerCase().includes(q)
    );
  });

  const filteredLeads = leads.filter((l) => {
    if (leadTypeFilter !== 'ALL' && l.type !== leadTypeFilter) return false;
    if (leadStatusFilter !== 'ALL' && l.status !== leadStatusFilter) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#2B313A] pb-6">
          <div className="text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Рабочее место менеджера салона
            </h1>
            <p className="text-xs sm:text-sm text-[#87888A]">
              Обработка заказов, выставление платежных ссылок ЮKassa, лиды с 9 форм и публикация фото новинок 1С
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
              }`}
            >
              <SimonaIconPackage className="w-4 h-4" />
              <span>Заказы ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
              }`}
            >
              <SimonaIconChat className="w-4 h-4" />
              <span>Заявки с форм ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products-no-photo')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'products-no-photo'
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
              }`}
            >
              <SimonaIconFile className="w-4 h-4" />
              <span>Картинки товаров {totalNoPhotoCount > 0 ? `(${totalNoPhotoCount})` : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
              }`}
            >
              <SimonaIconChat className="w-4 h-4" />
              <span>Онлайн-чат ({chatSessions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-[#16191D] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/50'
              }`}
            >
              <SimonaIconClock className="w-4 h-4" />
              <span>Синхронизация 1С</span>
            </button>

            {/* Live refresh & Auto-sync indicator */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => loadAllData('', false)}
                disabled={isRefreshing}
                title="Принудительно обновить список заказов и заявок с сервера"
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#16191D] hover:bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal/50 text-[#D7D9DB] hover:text-white flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                <SimonaIconClock className={`w-3.5 h-3.5 text-simona-teal ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Обновление...' : 'Обновить'}</span>
              </button>
              {lastUpdated && (
                <div className="hidden xl:flex items-center space-x-1.5 text-[11px] text-[#87888A] px-2.5 py-2 bg-[#16191D] rounded-xl border border-[#2B313A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Авто (30с) • {lastUpdated.toLocaleTimeString('ru-RU')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {toast && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
              toast.type === 'success'
                ? 'bg-simona-teal/15 border-simona-teal/40 text-white'
                : 'bg-[#8A151A]/20 border-[#8A151A]/50 text-red-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-[#87888A] hover:text-white ml-4 cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#16191D] p-4 rounded-2xl border border-[#2B313A]">
              <div className="relative flex-1 max-w-md">
                <SimonaIconSearch className="w-4 h-4 text-[#87888A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Поиск по № заказа, клиенту, телефону или коду 1С..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    orderStatusFilter === 'ALL'
                      ? 'bg-simona-teal text-white'
                      : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
                  }`}
                >
                  <span>Все</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    orderStatusFilter === 'ALL' ? 'bg-black/30 text-white' : 'bg-white/10 text-white'
                  }`}>
                    {orders.length}
                  </span>
                </button>
                {ORDER_STATUS_OPTIONS.map((st) => {
                  const count = orders.filter((o) => o.status === st.value).length;
                  return (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => setOrderStatusFilter(st.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                        orderStatusFilter === st.value
                          ? 'bg-simona-teal text-white'
                          : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
                      }`}
                    >
                      <span>{st.label}</span>
                      {count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          orderStatusFilter === st.value ? 'bg-black/30 text-white' : 'bg-white/10 text-white'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 6 cols: Orders List */}
              <div className="lg:col-span-6 space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-[#16191D] border border-[#2B313A] text-left">
                    <p className="text-sm font-semibold text-white">Заказы не найдены</p>
                    <p className="text-xs text-[#87888A] mt-1">
                      Новые заказы с витрины и быстрого чекаута появятся здесь мгновенно.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const stMeta =
                      ORDER_STATUS_OPTIONS.find((s) => s.value === order.status) ||
                      ORDER_STATUS_OPTIONS[0];
                    const isSelected = order.id === selectedOrderId;

                    return (
                      <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`p-5 rounded-2xl border transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#1E2228] border-simona-teal shadow-lg shadow-simona-teal/10'
                            : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono font-bold text-sm text-white">
                                №{order.orderNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${stMeta.badgeClass}`}
                              >
                                {stMeta.label}
                              </span>
                            </div>
                            <div className="text-xs text-white font-medium mt-2">
                              {order.customerName} •{' '}
                              <span className="text-simona-teal">{order.customerPhone}</span>
                            </div>
                            <div className="text-[11px] text-[#87888A] mt-1">
                              {DELIVERY_LABELS[order.deliveryType] || order.deliveryType} •{' '}
                              {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center justify-end gap-2">
                              <div className="text-base font-montserrat font-bold text-simona-teal">
                                {formatPrice(order.totalAmount)}
                              </div>
                              {order.isOneClick && (
                                <span
                                  title="Быстрый заказ в 1 клик"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 select-none"
                                >
                                  <span>⚡ В 1 клик</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#87888A] mt-1">
                              {new Date(order.createdAt).toLocaleString('ru-RU')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right 6 cols: Order Detail Card */}
              <div className="lg:col-span-6">
                {selectedOrder ? (
                  <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] space-y-6 text-left sticky top-28">
                    <div className="flex items-start justify-between border-b border-[#2B313A] pb-4">
                      <div>
                        <span className="text-xs text-[#87888A]">Детальная карточка заказа</span>
                        <h2 className="text-xl font-montserrat font-bold text-white mt-0.5">
                          Заказ №{selectedOrder.orderNumber}
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-xl font-montserrat font-bold text-simona-teal">
                            {formatPrice(selectedOrder.totalAmount)}
                          </div>
                          {selectedOrder.isOneClick && (
                            <span
                              title="Быстрый заказ в 1 клик (признак неизменяем)"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 select-none"
                            >
                              <span>⚡ В 1 клик</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#87888A]">
                          {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Delivery Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs">
                      <div className="space-y-1.5">
                        <div className="text-[#87888A] flex items-center space-x-1.5">
                          <SimonaIconUser className="w-3.5 h-3.5 text-simona-teal" />
                          <span>Покупатель</span>
                        </div>
                        <div className="font-semibold text-white">{selectedOrder.customerName}</div>
                        <div>
                          <a
                            href={`tel:${selectedOrder.customerPhone}`}
                            className="text-simona-teal font-semibold hover:underline"
                          >
                            {selectedOrder.customerPhone}
                          </a>
                        </div>
                        {selectedOrder.customerEmail && (
                          <div className="text-[#D7D9DB]">{selectedOrder.customerEmail}</div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[#87888A] flex items-center space-x-1.5">
                          <SimonaIconPin className="w-3.5 h-3.5 text-simona-teal" />
                          <span>Получение и оплата</span>
                        </div>
                        <div className="font-semibold text-white">
                          {DELIVERY_LABELS[selectedOrder.deliveryType] || selectedOrder.deliveryType}
                        </div>
                        {selectedOrder.deliveryAddress && (
                          <div className="text-[#D7D9DB]">Адрес: {selectedOrder.deliveryAddress}</div>
                        )}
                        {selectedOrder.deliveryDate && (
                          <div className="text-[#D7D9DB]">Дата: {selectedOrder.deliveryDate}</div>
                        )}
                        <div className="text-[#87888A]">
                          Оплата:{' '}
                          <span className="text-white">
                            {PAYMENT_LABELS[selectedOrder.paymentMethod] ||
                              selectedOrder.paymentMethod}
                          </span>
                        </div>
                        {selectedOrder.companyName && (
                          <div className="text-amber-300">
                            Юрлицо: {selectedOrder.companyName} (ИНН: {selectedOrder.companyInn || '—'})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cart Items with 1C SKU */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-semibold text-white">
                        Состав корзины (с кодами 1С):
                      </h3>
                      <div className="space-y-2">
                        {(() => {
                          let parsedItems: OrderItemRecord[] = [];
                          try {
                            parsedItems = JSON.parse(selectedOrder.itemsJson || '[]');
                          } catch {
                            parsedItems = [];
                          }
                          return parsedItems.map((item, idx) => (
                            <div
                              key={`${item.sku || idx}-${idx}`}
                              className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-0.5 rounded-md bg-[#111315] border border-[#2B313A] font-mono text-[11px] text-simona-teal">
                                    Код: {item.sku || '—'}
                                  </span>
                                  {item.physicalStatus && (
                                    <span className="text-[10px] text-[#87888A]">
                                      [{item.physicalStatus}]
                                    </span>
                                  )}
                                </div>
                                <div className="font-semibold text-white mt-1">{item.name}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-montserrat font-bold text-white">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                <div className="text-[11px] text-[#87888A]">
                                  {item.quantity} шт. × {formatPrice(item.price)}
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* End-to-End Attribution */}
                    <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B313A] text-[11px] text-[#87888A] space-y-1">
                      <div className="font-semibold text-[#D7D9DB]">
                        Сквозная атрибуция (Метрика / Директ / Asana):
                      </div>
                      <div>
                        ymClientId:{' '}
                        <span className="text-white font-mono">
                          {selectedOrder.ymClientId || '—'}
                        </span>{' '}
                        • yclid:{' '}
                        <span className="text-white font-mono">{selectedOrder.yclid || '—'}</span>
                      </div>
                      <div>
                        UTM:{' '}
                        <span className="text-white">
                          {[
                            selectedOrder.utmSource,
                            selectedOrder.utmMedium,
                            selectedOrder.utmCampaign,
                            selectedOrder.utmContent,
                            selectedOrder.utmTerm,
                          ]
                            .filter(Boolean)
                            .join(' / ') || 'Прямой переход'}
                        </span>
                      </div>
                      {selectedOrder.asanaTaskId && (
                        <div>
                          Задача Asana:{' '}
                          <span className="text-simona-teal font-mono">
                            {selectedOrder.asanaTaskId}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status & Payment Link Form */}
                    <form onSubmit={handleUpdateOrder} className="space-y-4 pt-4 border-t border-[#2B313A]">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-white">
                            Статус заказа {editStatus === 'TEST' ? '(тестовый — без отправки клиенту и аналитики)' : '(при смене отправляется письмо клиенту)'}
                          </label>
                          {selectedOrder.isOneClick && (
                            <span className="text-[11px] text-amber-300 font-medium">
                              Заказ в 1 клик (тип не меняется)
                            </span>
                          )}
                        </div>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal"
                        >
                          {ORDER_STATUS_OPTIONS.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label} ({st.value})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white mb-1.5">
                          Персональная платежная ссылка ЮKassa (включается в письмо при статусе CONFIRMED)
                        </label>
                        <input
                          type="url"
                          value={editPaymentLink}
                          onChange={(e) => setEditPaymentLink(e.target.value)}
                          placeholder="https://yookassa.ru/my/i/..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#87888A] focus:outline-none focus:border-simona-teal"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingOrder}
                        className="w-full py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-simona-teal/20"
                      >
                        {isUpdatingOrder
                          ? 'Сохранение...'
                          : editStatus === 'TEST'
                          ? 'Сохранить статус (тестовый заказ)'
                          : 'Сохранить статус и уведомить покупателя по Email'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-10 rounded-2xl bg-[#16191D] border border-[#2B313A] text-left">
                    <p className="text-xs text-[#87888A]">Выберите заказ слева для просмотра деталей</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between bg-[#16191D] p-4 rounded-2xl border border-[#2B313A]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#87888A]">Форма:</span>
                <select
                  value={leadTypeFilter}
                  onChange={(e) => setLeadTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white focus:outline-none focus:border-simona-teal"
                >
                  <option value="ALL">Все 9 форм ({leads.length})</option>
                  {Object.entries(LEAD_TYPE_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label} ({key})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setLeadStatusFilter('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    leadStatusFilter === 'ALL'
                      ? 'bg-simona-teal text-white'
                      : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
                  }`}
                >
                  Все статусы
                </button>
                {LEAD_STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setLeadStatusFilter(st.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      leadStatusFilter === st.value
                        ? 'bg-simona-teal text-white'
                        : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredLeads.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#16191D] border border-[#2B313A] text-left">
                  <p className="text-sm font-semibold text-white">Заявки не найдены</p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const stMeta =
                    LEAD_STATUS_OPTIONS.find((s) => s.value === lead.status) ||
                    LEAD_STATUS_OPTIONS[0];
                  return (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-[#16191D] border border-[#2B313A] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-simona-teal/15 border border-simona-teal/30 text-simona-teal text-xs font-semibold">
                            {LEAD_TYPE_MAP[lead.type] || lead.type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${stMeta.badgeClass}`}
                          >
                            {stMeta.label}
                          </span>
                          <span className="text-[11px] text-[#87888A]">
                            {new Date(lead.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>

                        <div className="text-sm font-semibold text-white">
                          {lead.name} •{' '}
                          <a href={`tel:${lead.phone}`} className="text-simona-teal hover:underline">
                            {lead.phone}
                          </a>
                          {lead.email ? (
                            <span className="text-xs text-[#D7D9DB] font-normal ml-2">
                              ({lead.email})
                            </span>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#D7D9DB]">
                          {lead.preferredShowroom && <span>Салон: {lead.preferredShowroom}</span>}
                          {(lead.preferredDate || lead.preferredTime) && (
                            <span>
                              Дата/время: {lead.preferredDate || ''} {lead.preferredTime || ''}
                            </span>
                          )}
                          {lead.productName && <span>Прибор: {lead.productName}</span>}
                          {lead.portfolioUrl && <span>Ссылка: {lead.portfolioUrl}</span>}
                        </div>

                        {lead.comment && (
                          <div className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB]">
                            {lead.comment}
                          </div>
                        )}

                        <div className="text-[11px] text-[#87888A]">
                          ymClientId: <span className="text-white font-mono">{lead.ymClientId || '—'}</span> •
                          yclid: <span className="text-white font-mono">{lead.yclid || '—'}</span> •
                          UTM:{' '}
                          {[lead.utmSource, lead.utmMedium, lead.utmCampaign]
                            .filter(Boolean)
                            .join(' / ') || 'прямой'}
                          {lead.asanaTaskId ? ` • Asana: ${lead.asanaTaskId}` : ''}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {lead.attachmentPath && (
                          <a
                            href={`/api/manager/leads/attachment?id=${encodeURIComponent(lead.id)}`}
                            className="px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-simona-teal/40 text-simona-teal text-xs font-semibold flex items-center space-x-2 transition"
                          >
                            <SimonaIconDownload className="w-4 h-4" />
                            <span>Скачать проект</span>
                          </a>
                        )}

                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white focus:outline-none focus:border-simona-teal"
                        >
                          {LEAD_STATUS_OPTIONS.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS NO PHOTO / PRODUCT IMAGES */}
        {activeTab === 'products-no-photo' && (
          <ManagerProductsNoPhotoView />
        )}

        {/* TAB 4: ONLINE CHAT */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left 4 cols: Sessions List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-white">
                  Диалоги онлайн-чата ({chatSessions.length})
                </h2>
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  className="text-xs text-simona-teal hover:underline cursor-pointer"
                >
                  Обновить
                </button>
              </div>

              {chatSessions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] text-xs text-[#87888A]">
                  Активных диалогов в онлайн-чате пока нет.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {chatSessions.map((sess) => {
                    const isSelected = sess.sessionId === selectedChatSessionId;
                    return (
                      <div
                        key={sess.sessionId}
                        onClick={() => setSelectedChatSessionId(sess.sessionId)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E2228] border-simona-teal shadow-md shadow-simona-teal/10'
                            : 'bg-[#16191D] border-[#2B313A] hover:border-[#3E3D40]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-white truncate">
                            {sess.clientName || 'Гость сайта'}
                          </span>
                          <span className="text-[10px] font-mono text-[#87888A]">
                            #{sess.sessionId.slice(-6)}
                          </span>
                        </div>
                        {sess.clientPhone && (
                          <div className="text-[11px] text-simona-teal font-semibold mb-1">
                            {sess.clientPhone}
                          </div>
                        )}
                        <div className="text-xs text-[#D7D9DB] truncate">
                          {sess.lastMessageText}
                        </div>
                        <div className="text-[10px] text-[#87888A] mt-1.5 flex items-center justify-between">
                          <span>
                            {new Date(sess.lastMessageAt).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {sess.unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-md bg-simona-teal text-white font-bold">
                              +{sess.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 8 cols: Active Conversation Thread */}
            <div className="lg:col-span-8">
              {(() => {
                const activeSession =
                  chatSessions.find((s) => s.sessionId === selectedChatSessionId) || null;
                if (!activeSession) {
                  return (
                    <div className="p-10 rounded-2xl bg-[#16191D] border border-[#2B313A] text-xs text-[#87888A]">
                      Выберите диалог слева для просмотра переписки и отправки ответа покупателю.
                    </div>
                  );
                }

                return (
                  <div className="rounded-2xl bg-[#16191D] border border-[#2B313A] flex flex-col h-[600px] overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-[#1E2228] border-b border-[#2B313A] flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {activeSession.clientName || 'Гость сайта'}{' '}
                          <span className="text-xs font-mono text-[#87888A] ml-1">
                            [#chat_{activeSession.sessionId}]
                          </span>
                        </div>
                        <div className="text-xs text-[#87888A] mt-0.5 flex flex-wrap items-center gap-3">
                          {activeSession.clientPhone && (
                            <a
                              href={`tel:${activeSession.clientPhone}`}
                              className="text-simona-teal font-semibold hover:underline"
                            >
                              {activeSession.clientPhone}
                            </a>
                          )}
                          {activeSession.pageUrl && (
                            <span className="truncate max-w-md">
                              Страница: {activeSession.pageUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#111315]">
                      {activeSession.messages.map((m) => {
                        const isManager = m.sender === 'MANAGER';
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${
                              isManager ? 'items-end' : 'items-start'
                            }`}
                          >
                            <span className="text-[10px] text-[#87888A] mb-1 px-1">
                              {isManager ? 'Вы (Эксперт СИМОНА)' : m.clientName || 'Клиент'} •{' '}
                              {new Date(m.createdAt).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <div
                              className={`p-3.5 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                                isManager
                                  ? 'bg-simona-teal text-white'
                                  : 'bg-[#1E2228] text-white border border-[#2B313A]'
                              }`}
                            >
                              {m.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!managerReplyText.trim() || isSendingReply) return;
                        setIsSendingReply(true);
                        try {
                          const res = await fetch('/api/manager/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              sessionId: activeSession.sessionId,
                              text: managerReplyText.trim(),
                            }),
                          });
                          if (!res.ok) throw new Error('Ошибка отправки ответа');
                          setManagerReplyText('');
                          await loadAllData();
                          showToast('success', 'Ответ отправлен покупателю в онлайн-чат');
                        } catch (err: unknown) {
                          showToast(
                            'error',
                            err instanceof Error ? err.message : 'Ошибка отправки'
                          );
                        } finally {
                          setIsSendingReply(false);
                        }
                      }}
                      className="p-4 bg-[#1E2228] border-t border-[#2B313A] flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={managerReplyText}
                        onChange={(e) => setManagerReplyText(e.target.value)}
                        placeholder="Введите ответ покупателю (доставляется в виджет на сайте)..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal"
                      />
                      <button
                        type="submit"
                        disabled={!managerReplyText.trim() || isSendingReply}
                        className="px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        {isSendingReply ? 'Отправка...' : 'Ответить'}
                      </button>
                    </form>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 1C Sync Tab */}
        {activeTab === 'sync' && <ManagerSyncView />}
      </div>
    </main>
  );
}
