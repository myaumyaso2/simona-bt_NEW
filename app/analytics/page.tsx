'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Lock, Download, RefreshCw, BarChart3, TrendingUp, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { DirectCampaignStat, DirectReportSummary } from '@/lib/integrations/direct/types';

interface SummaryData {
  totalOrders: number;
  paidOrdersCount: number;
  totalRevenue: number;
  averageCheck: number;
  ymOrdersCount: number;
  leadsCount: number;
  conversionRate: string;
  directSpend?: number;
  directPaidRevenue?: number;
  directPaidCount?: number;
  drrPercent?: string;
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
  yclid: string | null;
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
  const [directStats, setDirectStats] = useState<DirectReportSummary | null>(null);
  const [utmStats, setUtmStats] = useState<UtmStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // State for direct offline conversions upload
  const [isSyncingConversions, setIsSyncingConversions] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
      setDirectStats(data.directStats || null);
      setUtmStats(data.utmStats || []);
      setStatusStats(data.statusStats || []);
      setOrders(data.recentOrders || []);
    } catch (err) {
      console.error('Failed to load analytics stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiConversionsSync = async () => {
    setIsSyncingConversions(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/analytics/sync-conversions', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage({
          type: 'success',
          text: data.message || `Успешно отправлено ${data.uploadedCount} конверсий в Метрику!`,
        });
      } else {
        setSyncMessage({
          type: 'error',
          text: data.message || data.error || 'Ошибка отправки конверсий',
        });
      }
    } catch (err: any) {
      setSyncMessage({
        type: 'error',
        text: `Ошибка соединения: ${err.message}`,
      });
    } finally {
      setIsSyncingConversions(false);
      // Авто-скрытие сообщения через 8 секунд
      setTimeout(() => setSyncMessage(null), 8000);
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
              Управленческий пульт. Введите PIN-код руководителя.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#87888A] mb-1.5">
                Пароль администратора / PIN
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

  const drrValue = parseFloat(summary?.drrPercent || '0');
  const isDrrSafe = drrValue <= 5.0;

  return (
    <div className="min-h-screen bg-[#111315] text-white pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B313A] pb-6">
          <div>
            <div className="mb-2">
              <span className="text-xs text-[#87888A] font-mono">
                Метрика №1351807 • Директ API v5 • 1С 7.7 (Переходный режим)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Сквозная аналитика: Директ → Сайт → Касса 1С
            </h1>
            <p className="text-sm text-[#87888A] mt-1">
              Управленческий пульт директора. Контроль расходов, окупаемости (ДРР) и кассовых чеков.
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

            {/* Direct API Upload Button */}
            <button
              onClick={handleApiConversionsSync}
              disabled={isSyncingConversions}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-simona-teal/20 hover:bg-simona-teal/30 border border-simona-teal/40 rounded-xl text-xs font-semibold text-simona-teal hover:text-white transition-all shadow-sm disabled:opacity-50"
              title="Автоматическая отправка оплат (PAID и DELIVERED) в Яндекс Метрику по API"
            >
              <Send className={`w-3.5 h-3.5 ${isSyncingConversions ? 'animate-pulse' : ''}`} />
              <span>{isSyncingConversions ? 'Отправка...' : 'Отправить в Метрику API'}</span>
            </button>

            {/* Offline Conversions CSV Button (Backup) */}
            <a
              href="/api/analytics/offline-conversions"
              download
              className="inline-flex items-center space-x-2 px-3 py-2.5 bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] rounded-xl text-xs font-medium text-[#87888A] hover:text-white transition-all"
              title="Резервная выгрузка CSV для ручной загрузки"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
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

        {/* Sync notification message banner */}
        {syncMessage && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              syncMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {syncMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{syncMessage.text}</span>
            </div>
            <button
              onClick={() => setSyncMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 ml-4 font-mono"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Главные 4 управленческие цифры директора (Executive Summary Bar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Расход Директа */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Потрачено на рекламу (Директ)</span>
              <BarChart3 className="w-4 h-4 text-simona-teal" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatPrice(summary?.directSpend || directStats?.totalCostRub || 0)}
            </div>
            <div className="text-xs text-[#87888A] mt-2 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal" />
              <span>Лимит: 18 750 ₽/нед • {directStats?.totalClicks || 0} кликов</span>
            </div>
          </div>

          {/* Оформлено на сайте */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Оформлено на сайте</span>
              <SimonaIconPackage className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {summary?.totalOrders || 0}{' '}
              <span className="text-sm font-normal text-[#87888A]">заказов</span>
            </div>
            <div className="text-xs text-amber-400/90 mt-2">
              +{summary?.leadsCount || 0} обращений и заявок
            </div>
          </div>

          {/* Реально оплачено в 1С (Касса) */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Реально оплачено в кассах 1С</span>
              <SimonaIconCreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatPrice(summary?.totalRevenue || 0)}
            </div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
              <SimonaIconCheckCircle className="w-3.5 h-3.5" />
              <span>{summary?.paidOrdersCount || 0} оплачено / доставлено</span>
            </div>
          </div>

          {/* ДРР (Доля рекламных расходов) */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-[#87888A] mb-2 font-medium">
              <span>Доля рекламных расходов (ДРР)</span>
              <TrendingUp className={`w-4 h-4 ${isDrrSafe ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {summary?.drrPercent || '0.0'}%
            </div>
            <div className="text-xs mt-2 flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDrrSafe ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className={isDrrSafe ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                {isDrrSafe ? 'Целевой норматив: не более 5%' : 'Внимание: превышение нормы 5%'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Кампании Яндекс Директ: факт затрат и отдачи по площадкам */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2B313A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Рекламные кампании Яндекс Директ (Нижний Новгород)
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Товарная галерея по фиду «На складе», горячий бренд-поиск и перехват конкурентов (ЦВТ, Мороз и кофе)
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#87888A] bg-[#111315] px-2.5 py-1 rounded border border-[#2B313A]">
              Источник: {directStats?.source === 'api' ? 'Direct Reports API (Live)' : 'Калиброванная модель'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111315] text-[#87888A] uppercase tracking-wider border-b border-[#2B313A]">
                <tr>
                  <th className="px-6 py-3.5">Кампания и формат</th>
                  <th className="px-6 py-3.5 text-right">Показы</th>
                  <th className="px-6 py-3.5 text-right">Клики</th>
                  <th className="px-6 py-3.5 text-right">CTR</th>
                  <th className="px-6 py-3.5 text-right">Цена клика (CPC)</th>
                  <th className="px-6 py-3.5 text-right">Затраты</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]/60">
                {!directStats?.campaigns || directStats.campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#87888A]">
                      Нет активных данных по кампаниям Директа
                    </td>
                  </tr>
                ) : (
                  directStats.campaigns.map((c) => (
                    <tr key={c.campaignId} className="hover:bg-[#1E2228]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-simona-teal" />
                        <span>{c.campaignName}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#87888A] font-mono">{c.impressions}</td>
                      <td className="px-6 py-4 text-right text-white font-mono">{c.clicks}</td>
                      <td className="px-6 py-4 text-right text-[#87888A] font-mono">{c.ctr}%</td>
                      <td className="px-6 py-4 text-right text-white font-mono">{c.cpc} ₽</td>
                      <td className="px-6 py-4 text-right font-bold text-white font-mono">
                        {formatPrice(c.costRub)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. End-to-End O2O Funnel */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Сквозная воронка Online-to-Offline (O2O)
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Конверсия рекламных касаний в визиты шоурумов на Белинского и чеки 1С
              </p>
            </div>
            <span className="text-xs text-simona-teal bg-simona-teal/10 px-3 py-1.5 rounded-lg font-medium border border-simona-teal/20">
              Конверсия витрины: {summary?.conversionRate || '0.0'}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                1. Реклама и Поиск
              </div>
              <div className="text-lg font-bold text-white">
                {directStats?.totalClicks || 0} переходов
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                Фиксация меток yclid и сквозного ClientID в cookie
              </p>
            </div>

            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                2. Заявки и формы
              </div>
              <div className="text-lg font-bold text-simona-teal">
                {summary?.leadsCount || 0} обращений
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                Подбор комплекта, запись в салон, консультация
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
                Корзина, экспресс-заказ со склада на Коминтерна
              </p>
            </div>

            <div className="bg-[#111315] border border-[#2B313A] rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#87888A] font-semibold mb-1">
                4. Оплата в 1С / Кассе
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {formatPrice(summary?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-[#87888A] mt-1">
                {summary?.paidOrdersCount || 0} чеков со статусом PAID / DELIVERED
              </p>
            </div>
          </div>
        </div>

        {/* 4. Traffic Channel Performance Table (UTM Stats) */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2B313A] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Эффективность каналов привлечения (`utm_source`)
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Разбивка заказов и кассовой выручки по источникам трафика
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111315] text-[#87888A] uppercase tracking-wider border-b border-[#2B313A]">
                <tr>
                  <th className="px-6 py-3.5">Источник трафика</th>
                  <th className="px-6 py-3.5 text-right">Заказов</th>
                  <th className="px-6 py-3.5 text-right">Оплачено / Доставлено</th>
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
                      <td className="px-6 py-4 text-right text-white font-mono">
                        {formatPrice(u.avgCheck)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-white font-mono">
                        {formatPrice(u.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Recent Orders with ClientID Tracking Table */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2B313A] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Последние заказы и статус сквозной атрибуции
              </h2>
              <p className="text-xs text-[#87888A] mt-1">
                Передача офлайн-конверсий в Метрику по ClientID и yclid
              </p>
            </div>
            <Link
              href="/manager/orders"
              className="text-xs text-simona-teal hover:underline flex items-center space-x-1 font-medium"
            >
              <span>Операционная панель заказов</span>
              <SimonaIconExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111315] text-[#87888A] uppercase tracking-wider border-b border-[#2B313A]">
                <tr>
                  <th className="px-6 py-3.5">Номер</th>
                  <th className="px-6 py-3.5">Покупатель</th>
                  <th className="px-6 py-3.5">Сумма</th>
                  <th className="px-6 py-3.5">Статус</th>
                  <th className="px-6 py-3.5">Оплата</th>
                  <th className="px-6 py-3.5">Yandex ClientID / yclid</th>
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
                      <td className="px-6 py-4 font-bold text-white font-mono">
                        {formatPrice(o.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                            o.status === 'PAID' || o.status === 'COMPLETED' || o.status === 'DELIVERED'
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
                          <div className="space-y-0.5">
                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                              {o.ymClientId}
                            </span>
                            {o.yclid && (
                              <div className="text-[10px] text-simona-teal truncate max-w-[150px]" title={o.yclid}>
                                yclid: {o.yclid}
                              </div>
                            )}
                          </div>
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
