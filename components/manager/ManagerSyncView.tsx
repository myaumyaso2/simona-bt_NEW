'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  SimonaIconClock,
  SimonaIconDownload,
  SimonaIconSearch,
  SimonaIconPackage,
  SimonaIconCheckCircle,
  SimonaIconExternalLink,
  SimonaIconFile,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import { SyncSessionSummary, SyncChangeRecord } from '@/lib/sync/oneCSyncService';

type ChangeFilterType = 'ALL' | 'PRICE' | 'STOCK' | 'CREATED' | 'DEACTIVATED' | 'BADGE';

interface CurrentSessionResponse {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  fileName: string;
  totalRows: number;
  stats: {
    totalChanges: number;
    matchedProducts: number;
    updatedPrices: number;
    updatedStocks: number;
    updatedBadges: number;
    createdProducts: number;
    deactivatedProducts: number;
    inheritedSpecialPhotos: number;
  };
  page: number;
  limit: number;
  totalPages: number;
  totalFiltered: number;
  changes: SyncChangeRecord[];
}

export function ManagerSyncView() {
  const [sessions, setSessions] = useState<SyncSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('latest');
  const [currentSession, setCurrentSession] = useState<CurrentSessionResponse | null>(null);
  const [typeFilter, setTypeFilter] = useState<ChangeFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessionData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        sessionId: selectedSessionId,
        type: typeFilter,
        q: searchQuery,
        page: String(page),
        limit: '50',
      });
      const res = await fetch(`/api/manager/sync?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setCurrentSession(data.currentSession || null);
      }
    } catch (err) {
      console.error('Failed to load sync data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSessionId, typeFilter, searchQuery, page]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  // Handle export to Excel/CSV
  const handleExport = () => {
    const params = new URLSearchParams({
      sessionId: selectedSessionId,
      type: typeFilter,
      q: searchQuery,
    });
    window.open(`/api/manager/sync/export?${params.toString()}`, '_blank');
  };

  const stats = currentSession?.stats;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner and Session Selector */}
      <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          {currentSession && (
            <div className="text-xs text-[#87888A]">
              Файл: <strong className="text-white">{currentSession.fileName}</strong> ({currentSession.totalRows} строк, {Math.round(currentSession.durationMs / 100) / 10}с)
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
            История и детализация импортов 1C_import.csv
          </h2>
          <p className="text-xs sm:text-sm text-[#87888A]">
            Контроль изменения розничных цен, складских остатков, новинок каталога и деактивированных приборов в реальном времени.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Session Selector */}
          {sessions.length > 0 && (
            <div className="relative">
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white focus:outline-none focus:border-simona-teal cursor-pointer pr-8"
              >
                <option value="latest">Последний импорт (актуальный)</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {new Date(s.startedAt).toLocaleString('ru-RU')} ({s.stats.totalChanges} изм.)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Export to CSV Button */}
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-xs font-semibold text-white flex items-center space-x-2 transition cursor-pointer"
            title="Экспорт отчета в Excel (CSV)"
          >
            <SimonaIconDownload className="w-4 h-4 text-simona-teal" />
            <span>Экспорт в Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Prices Card */}
          <button
            type="button"
            onClick={() => {
              setTypeFilter('PRICE');
              setPage(1);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              typeFilter === 'PRICE'
                ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                : 'bg-[#16191D] border-[#2B313A] hover:border-amber-500/30'
            }`}
          >
            <div className="text-xs text-[#87888A] font-medium flex items-center justify-between">
              <span>Цены обновлены</span>
              <span className="text-amber-400 font-bold">💰</span>
            </div>
            <div className="text-2xl font-montserrat font-bold text-white mt-1">
              {stats.updatedPrices}
            </div>
            <div className="text-[11px] text-[#87888A] mt-1">
              Актуализация прайса 1С
            </div>
          </button>

          {/* Stocks Card */}
          <button
            type="button"
            onClick={() => {
              setTypeFilter('STOCK');
              setPage(1);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              typeFilter === 'STOCK'
                ? 'bg-simona-teal/10 border-simona-teal/50 shadow-lg shadow-simona-teal/5'
                : 'bg-[#16191D] border-[#2B313A] hover:border-simona-teal/30'
            }`}
          >
            <div className="text-xs text-[#87888A] font-medium flex items-center justify-between">
              <span>Остатки изменены</span>
              <SimonaIconPackage className="w-4 h-4 text-simona-teal" />
            </div>
            <div className="text-2xl font-montserrat font-bold text-white mt-1">
              {stats.updatedStocks}
            </div>
            <div className="text-[11px] text-[#87888A] mt-1">
              Коминтерна 27 и витрины
            </div>
          </button>

          {/* Created Card */}
          <button
            type="button"
            onClick={() => {
              setTypeFilter('CREATED');
              setPage(1);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              typeFilter === 'CREATED'
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                : 'bg-[#16191D] border-[#2B313A] hover:border-emerald-500/30'
            }`}
          >
            <div className="text-xs text-[#87888A] font-medium flex items-center justify-between">
              <span>Новые товары</span>
              <span className="text-emerald-400 font-bold">🆕</span>
            </div>
            <div className="text-2xl font-montserrat font-bold text-white mt-1">
              {stats.createdProducts}
            </div>
            <div className="text-[11px] text-[#87888A] mt-1">
              Новинки номенклатуры
            </div>
          </button>

          {/* Deactivated Card */}
          <button
            type="button"
            onClick={() => {
              setTypeFilter('DEACTIVATED');
              setPage(1);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              typeFilter === 'DEACTIVATED'
                ? 'bg-[#8A151A]/20 border-[#8A151A]/60 shadow-lg shadow-[#8A151A]/10'
                : 'bg-[#16191D] border-[#2B313A] hover:border-[#8A151A]/40'
            }`}
          >
            <div className="text-xs text-[#87888A] font-medium flex items-center justify-between">
              <span>Сняты с витрины</span>
              <span className="text-red-400 font-bold">❌</span>
            </div>
            <div className="text-2xl font-montserrat font-bold text-white mt-1">
              {stats.deactivatedProducts}
            </div>
            <div className="text-[11px] text-[#87888A] mt-1">
              Архив или без цены
            </div>
          </button>

          {/* Badges / Actions Card */}
          <button
            type="button"
            onClick={() => {
              setTypeFilter('BADGE');
              setPage(1);
            }}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              typeFilter === 'BADGE'
                ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/5'
                : 'bg-[#16191D] border-[#2B313A] hover:border-purple-500/30'
            }`}
          >
            <div className="text-xs text-[#87888A] font-medium flex items-center justify-between">
              <span>Ярлыки и акции</span>
              <span className="text-purple-400 font-bold">🏷</span>
            </div>
            <div className="text-2xl font-montserrat font-bold text-white mt-1">
              {stats.updatedBadges}
            </div>
            <div className="text-[11px] text-[#87888A] mt-1">
              Скидки и спецпредложения
            </div>
          </button>
        </div>
      )}

      {/* Filters and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#16191D] border border-[#2B313A] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTypeFilter('ALL');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-simona-teal text-white'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            Все изменения {stats ? `(${stats.totalChanges})` : ''}
          </button>
          <button
            type="button"
            onClick={() => {
              setTypeFilter('PRICE');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'PRICE'
                ? 'bg-amber-500 text-black'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            Цены {stats ? `(${stats.updatedPrices})` : ''}
          </button>
          <button
            type="button"
            onClick={() => {
              setTypeFilter('STOCK');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'STOCK'
                ? 'bg-simona-teal text-white'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            Остатки {stats ? `(${stats.updatedStocks})` : ''}
          </button>
          <button
            type="button"
            onClick={() => {
              setTypeFilter('CREATED');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'CREATED'
                ? 'bg-emerald-500 text-black'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            Новинки {stats ? `(${stats.createdProducts})` : ''}
          </button>
          <button
            type="button"
            onClick={() => {
              setTypeFilter('DEACTIVATED');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              typeFilter === 'DEACTIVATED'
                ? 'bg-[#8A151A] text-white'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            Сняты {stats ? `(${stats.deactivatedProducts})` : ''}
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px] md:w-80">
          <SimonaIconSearch className="w-4 h-4 text-[#87888A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Поиск по SKU, артикулу, бренду..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal"
          />
        </div>
      </div>

      {/* Changes Table */}
      <div className="rounded-2xl bg-[#16191D] border border-[#2B313A] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#87888A]">
            Загрузка протокола изменений импорта 1С...
          </div>
        ) : !currentSession || currentSession.changes.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-sm text-white font-medium">Изменений не найдено</div>
            <p className="text-xs text-[#87888A]">
              По выбранным фильтрам изменений в этой сессии импорта нет.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#D7D9DB]">
              <thead className="bg-[#1E2228] border-b border-[#2B313A] text-[#87888A] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Код 1С</th>
                  <th className="py-3 px-4">Прибор / Бренд</th>
                  <th className="py-3 px-4">Категория</th>
                  <th className="py-3 px-4">Тип изменения</th>
                  <th className="py-3 px-4">Детализация (Было → Стало)</th>
                  <th className="py-3 px-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]">
                {currentSession.changes.map((item, idx) => (
                  <tr key={`${item.code}-${item.changeType}-${idx}`} className="hover:bg-[#1E2228]/50 transition">
                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono font-medium text-white whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-simona-teal">
                        {item.sku}
                      </span>
                    </td>

                    {/* Name & Brand */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-medium text-white truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#87888A] mt-0.5">
                        {item.brand}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-[#87888A] whitespace-nowrap">
                      {item.category || 'Встраиваемая техника'}
                    </td>

                    {/* Change Type Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.changeType === 'PRICE' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Цена
                        </span>
                      )}
                      {item.changeType === 'STOCK' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40">
                          Остаток
                        </span>
                      )}
                      {item.changeType === 'CREATED' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Новинка
                        </span>
                      )}
                      {item.changeType === 'DEACTIVATED' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#8A151A]/30 text-red-300 border border-[#8A151A]/60">
                          Снят
                        </span>
                      )}
                      {item.changeType === 'BADGE' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Ярлык
                        </span>
                      )}
                      {item.changeType === 'INHERITED_PHOTO' && (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Фото
                        </span>
                      )}
                    </td>

                    {/* Detail / Values */}
                    <td className="py-3.5 px-4">
                      {item.changeType === 'PRICE' && typeof item.oldValue === 'number' && typeof item.newValue === 'number' ? (
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-[#87888A]">{formatPrice(item.oldValue)}</span>
                          <span className="text-[#87888A]">→</span>
                          <span className="font-semibold text-white">{formatPrice(item.newValue)}</span>
                          <span
                            className={`text-[11px] font-bold ${
                              item.newValue < item.oldValue ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            ({item.newValue < item.oldValue ? '' : '+'}{Math.round(((item.newValue - item.oldValue) / item.oldValue) * 100)}%)
                          </span>
                        </div>
                      ) : item.changeType === 'STOCK' && item.oldValue !== undefined && item.newValue !== undefined ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-[#87888A]">{item.oldValue} шт</span>
                          <span className="text-[#87888A]">→</span>
                          <span className="font-semibold text-white">{item.newValue} шт</span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#D7D9DB]">
                          {item.detail}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {item.changeType === 'CREATED' && !item.hasPhoto ? (
                        <Link
                          href="/manager/products-no-photo"
                          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition"
                        >
                          <SimonaIconFile className="w-3.5 h-3.5" />
                          <span>Загрузить фото</span>
                        </Link>
                      ) : item.slug ? (
                        <Link
                          href={`/product/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition"
                        >
                          <span>Товар</span>
                          <SimonaIconExternalLink className="w-3 h-3 text-simona-teal" />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {currentSession && currentSession.totalPages > 1 && (
          <div className="p-4 bg-[#1E2228] border-t border-[#2B313A] flex items-center justify-between text-xs text-[#87888A]">
            <div>
              Показано {currentSession.changes.length} из {currentSession.totalFiltered} изменений (Страница {currentSession.page} из {currentSession.totalPages})
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-[#16191D] border border-[#2B313A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-simona-teal/50 cursor-pointer"
              >
                Назад
              </button>
              <button
                type="button"
                disabled={page >= currentSession.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl bg-[#16191D] border border-[#2B313A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-simona-teal/50 cursor-pointer"
              >
                Вперед
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
