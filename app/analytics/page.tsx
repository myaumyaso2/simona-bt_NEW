'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconCreditCard,
  SimonaIconPackage,
  SimonaIconCheckCircle,
  SimonaIconUser,
  SimonaIconClock,
  SimonaIconArrowLeft,
  SimonaIconExternalLink,
  SimonaIconSparkles,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import { Lock, Download, RefreshCw, BarChart3, TrendingUp, Filter } from 'lucide-react';

interface SummaryData {
  totalOrders: number;
  paidOrdersCount: number;
  totalRevenue: number;
  averageCheck: number;
  ymOrdersCount: number;
  leadsCount: number;
  conversionRate: string;
}

interface UtmStat {
  source: string;
  ordersCount: number;
  paidCount: number;
  revenue: number;
  avgCheck: number;
}

interface StatusStat {
  status: string;
  count: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryType: string;
  ymClientId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
}

export default function AnalyticsDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [periodDays, setPeriodDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [utmStats, setUtmStats] = useState<UtmStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Check auth on mount
  useEffect(() => {
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Неверный пароль');
      }
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка авторизации');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const fetchStats = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?days=${periodDays}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setSummary(data.summary || null);
      setUtmStats(data.utmStats || []);
      setStatusStats(data.statusStats || []);
      setOrders(data.recentOrders || []);
    } catch (err) {
      console.error('Failed to load analytics stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, periodDays]);

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#111315] flex items-center justify-center text-[#87888A]">
        <div className="animate-spin w-8 h-8 border-2 border-simona-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  // Login view if unauthorized
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111315] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#16191D] border border-[#2B313A] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-simona-teal via-simona-wine to-simona-teal" />
          
          <div className="mb-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center text-simona-teal">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Сквозная аналитика СИМОНА
            </h1>
            <p className="text-xs text-[#87888A] mt-1.5">
              Доступ ограничен. Введите мастер-пароль администратора.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#87888A] mb-1.5">
                Пароль администратора
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#111315] border border-[#2B313A] rounded-xl text-white text-sm focus:outline-none focus:border-simona-teal transition-colors"
              />
            </div>

            {authError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 bg-simona-teal hover:bg-simona-teal/90 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-lg shadow-simona-teal/20 disabled:opacity-50"
            >
              {isSubmittingAuth ? 'Проверка...' : 'Войти в панель'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#2B313A]/50 text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-[#87888A] hover:text-white transition-colors"
            >
              <SimonaIconArrowLeft className="w-3.5 h-3.5" />
              <span>Вернуться на витрину</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111315] text-white pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B313A] pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <SectionBadge text="Операционный контур" variant="teal" />
              <span className="text-xs text-[#87888A] font-mono">
                Метрика №1351807 • 1C Enterprise • DataLayer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Сквозная аналитика и офлайн-конверсии
            </h1>
            <p className="text-sm text-[#87888A] mt-1">
              Воронка продаж: от рекламы в Яндекс Директе до фискального чека в кассе 1С
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center bg-[#16191D] border border-[#2B313A] rounded-xl p-1 text-xs">
              {[
                { label: '7 дней', val: 7 },
                { label: '30 дней', val: 30 },
                { label: '90 дней', val: 90 },
                { label: 'Все время', val: 0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPeriodDays(p.val)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    periodDays === p.val
                      ? 'bg-simona-teal text-white shadow-sm'
                      : 'text-[#87888A] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Offline Conversions CSV Button */}
            <a
              href="/api/analytics/offline-conversions"
              download
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] rounded-xl text-xs font-semibold text-white transition-all shadow-sm group"
            >
              <Download className="w-3.5 h-3.5 text-simona-teal group-hover:scale-110 transition-transform" />
              <span>Выгрузить CSV в Метрику</span>
            </a>

            {/* Refresh button */}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2.5 bg-[#16191D] hover:bg-[#1E2228] border border-[#2B313A] rounded-xl text-[#87888A] hover:text-white transition-colors"
              title="Обновить данные"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-simona-teal' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Оплаченная выручка</span>
              <SimonaIconCreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatPrice(summary?.totalRevenue || 0)} ₽
            </div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
              <span>{summary?.paidOrdersCount || 0} оплаченных заказов</span>
            </div>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Средний чек</span>
              <TrendingUp className="w-4 h-4 text-simona-teal" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatPrice(summary?.averageCheck || 0)} ₽
            </div>
            <div className="text-xs text-[#87888A] mt-2">
              По завершенным покупкам
            </div>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Заказы со сквозным ymClientId</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {summary?.ymOrdersCount || 0}{' '}
              <span className="text-sm text-[#87888A] font-normal">
                / {summary?.totalOrders || 0}
              </span>
            </div>
            <div className="text-xs text-amber-400/90 mt-2">
              Готовы к загрузке офлайн-конверсий
            </div>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Обращения и лид-формы</span>
              <SimonaIconSparkles className="w-4 h-4 text-simona-wine" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {summary?.leadsCount || 0}
            </div>
            <div className="text-xs text-[#87888A] mt-2">
              Визиты, тест-драйв, B2B, подбор
            </div>
          </div>
        </div>

        {/* 2. End-to-End O2O Funnel */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Сквозная воронка Online-to-Offline (O2O)
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Конверсия рекламных касаний в визиты шоурумов и чеки 1С
              </p>
            </div>
            <span className="text-xs text-simona-teal bg-simona-teal/10 px-3 py-1.5 rounded-lg font-medium border border-simona-teal/20">
              CR: {summary?.conversionRate || '0.0'}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                1. Трафик и реклама
              </div>
              <div className="text-lg font-bold text-white">Яндекс Директ / Органика</div>
              <p className="text-xs text-[#87888A] mt-1">
                Фиксация UTM-меток и ClientID в cookie пользователя
              </p>
            </div>

            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                2. Лиды и консультации
              </div>
              <div className="text-lg font-bold text-simona-teal">
                {summary?.leadsCount || 0} обращений
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                Запись в салон, шеф-кухня, проектные спецификации
              </p>
            </div>

            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                3. Заказы на сайте
              </div>
              <div className="text-lg font-bold text-amber-400">
                {summary?.totalOrders || 0} оформлено
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                Корзина, экспресс-заказ, резервы со склада
              </p>
            </div>

            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                4. Оплата в 1С / Кассе
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {formatPrice(summary?.totalRevenue || 0)} ₽
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                Передача офлайн-конверсий в Метрику для ROAS
              </p>
            </div>
          </div>
        </div>

        {/* 3. Traffic Channel Performance Table (UTM Stats) */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2B313A] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Эффективность рекламных каналов (`utm_source`)
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Разбивка заказов и выручки по рекламным источникам
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111315] text-[#87888A] uppercase tracking-wider border-b border-[#2B313A]">
                <tr>
                  <th className="px-6 py-3.5">Источник трафика</th>
                  <th className="px-6 py-3.5 text-right">Заказов</th>
                  <th className="px-6 py-3.5 text-right">Оплачено</th>
                  <th className="px-6 py-3.5 text-right">Средний чек</th>
                  <th className="px-6 py-3.5 text-right">Выручка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]/60">
                {utmStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#87888A]">
                      Нет данных за выбранный период
                    </td>
                  </tr>
                ) : (
                  utmStats.map((u) => (
                    <tr key={u.source} className="hover:bg-[#1E2228]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-simona-teal" />
                        <span className="font-mono">{u.source}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#87888A]">{u.ordersCount}</td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-semibold">
                        {u.paidCount}
                      </td>
                      <td className="px-6 py-4 text-right text-white">
                        {formatPrice(u.avgCheck)} ₽
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-white">
                        {formatPrice(u.revenue)} ₽
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Recent Orders with ClientID Tracking Table */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2B313A] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Последние заказы и атрибуция Метрики
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Сквозные связки с Yandex ClientID для экспорта конверсий
              </p>
            </div>
            <Link
              href="/manager/orders"
              className="text-xs text-simona-teal hover:underline flex items-center space-x-1 font-medium"
            >
              <span>Панель менеджера</span>
              <SimonaIconExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111315] text-[#87888A] uppercase tracking-wider border-b border-[#2B313A]">
                <tr>
                  <th className="px-6 py-3.5">Номер</th>
                  <th className="px-6 py-3.5">Клиент</th>
                  <th className="px-6 py-3.5">Сумма</th>
                  <th className="px-6 py-3.5">Статус</th>
                  <th className="px-6 py-3.5">Оплата</th>
                  <th className="px-6 py-3.5">Yandex ClientID</th>
                  <th className="px-6 py-3.5 text-right">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]/60">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[#87888A]">
                      Заказов не найдено
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#1E2228]/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-white">
                        {o.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-white">
                        <div>{o.customerName}</div>
                        <div className="text-[11px] text-[#87888A] font-mono">
                          {o.customerPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {formatPrice(o.totalAmount)} ₽
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                            o.status === 'PAID' || o.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : o.status === 'CANCELLED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#87888A]">{o.paymentMethod}</td>
                      <td className="px-6 py-4 font-mono text-[11px]">
                        {o.ymClientId ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {o.ymClientId}
                          </span>
                        ) : (
                          <span className="text-[#87888A]/60">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-[#87888A] whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
