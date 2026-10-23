'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  SimonaIconDownload,
  SimonaIconSearch,
  SimonaIconCheckCircle,
  SimonaIconExternalLink,
  SimonaIconPlus,
  SimonaIconPackage,
  SimonaIconBuilding,
  SimonaIconClock,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import {
  GlobalCategoryNode,
  SubcategoryNode,
  BrandNode,
  ProductNodeItem,
} from '@/app/api/manager/products-no-photo/route';
import {
  PhotoUploadBatchResult,
  PhotoUploadLogEntry,
  parsePhotoFileName,
} from '@/lib/catalog/photoUploadService';

export function ManagerProductsNoPhotoView() {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<GlobalCategoryNode[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalInStockCount, setTotalInStockCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Accordion expanded state maps
  const [expandedGlobals, setExpandedGlobals] = useState<Record<string, boolean>>({});
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Batch upload state
  const [isDraggingOverZone, setIsDraggingOverZone] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadResult, setUploadResult] = useState<PhotoUploadBatchResult | null>(null);

  // Single-product drop state
  const [dragOverProductSku, setDragOverProductSku] = useState<string | null>(null);

  // Upload logs
  const [logs, setLogs] = useState<PhotoUploadLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  // Fetch products and tree
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (onlyInStock) params.set('onlyInStock', 'true');

      const res = await fetch(`/api/manager/products-no-photo?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки данных');

      setTree(data.tree || []);
      setTotalCount(data.totalCount || 0);
      setTotalInStockCount(data.totalInStockCount || 0);

      // Auto-expand first global category if searching or small list
      if (searchQuery.trim() && data.tree?.length > 0) {
        const autoGlobals: Record<string, boolean> = {};
        const autoSubs: Record<string, boolean> = {};
        const autoBrands: Record<string, boolean> = {};

        data.tree.forEach((g: GlobalCategoryNode) => {
          autoGlobals[g.globalCategory] = true;
          g.subcategories.forEach((s: SubcategoryNode) => {
            autoSubs[`${g.globalCategory}-${s.subcategory}`] = true;
            s.brands.forEach((b: BrandNode) => {
              autoBrands[`${g.globalCategory}-${s.subcategory}-${b.brand}`] = true;
            });
          });
        });

        setExpandedGlobals(autoGlobals);
        setExpandedSubs(autoSubs);
        setExpandedBrands(autoBrands);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка соединения с сервером';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, onlyInStock]);

  // Fetch logs
  const loadLogs = async () => {
    try {
      const res = await fetch('/api/manager/products-no-photo/logs', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.logs) {
        setLogs(data.logs);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
    loadLogs();
  }, [loadData]);

  // Handle files upload (both batch and single)
  const handleProcessFiles = async (fileList: FileList | File[], specificSku?: string) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setIsUploading(true);
    setUploadProgressText(`Подготовка и проверка ${filesArray.length} файлов...`);
    setUploadResult(null);

    try {
      const formData = new FormData();
      if (specificSku && filesArray.length === 1) {
        formData.append('sku', specificSku);
      }

      for (const file of filesArray) {
        formData.append('files', file);
      }

      setUploadProgressText(`Конвертация в WebP и привязка к товарам 1С...`);

      const res = await fetch('/api/manager/products-no-photo', {
        method: 'POST',
        body: formData,
      });

      const result: PhotoUploadBatchResult = await res.json();
      if (!res.ok) {
        throw new Error((result as unknown as { error?: string }).error || 'Ошибка загрузки файлов');
      }

      setUploadResult(result);
      showToast('success', result.summaryMessage);
      loadData();
      loadLogs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка загрузки';
      showToast('error', msg);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  // Toggle helpers
  const toggleGlobal = (name: string) => {
    setExpandedGlobals((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleSub = (key: string) => {
    setExpandedSubs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBrand = (key: string) => {
    setExpandedBrands((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const gMap: Record<string, boolean> = {};
    const sMap: Record<string, boolean> = {};
    const bMap: Record<string, boolean> = {};
    tree.forEach((g) => {
      gMap[g.globalCategory] = true;
      g.subcategories.forEach((s) => {
        sMap[`${g.globalCategory}-${s.subcategory}`] = true;
        s.brands.forEach((b) => {
          bMap[`${g.globalCategory}-${s.subcategory}-${b.brand}`] = true;
        });
      });
    });
    setExpandedGlobals(gMap);
    setExpandedSubs(sMap);
    setExpandedBrands(bMap);
  };

  const collapseAll = () => {
    setExpandedGlobals({});
    setExpandedSubs({});
    setExpandedBrands({});
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center space-x-2 transition ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
              : 'bg-red-950/90 text-red-300 border-red-500/40'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP SECTION: Drag & Drop Batch Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOverZone(true);
        }}
        onDragLeave={() => setIsDraggingOverZone(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOverZone(false);
          if (e.dataTransfer.files?.length) {
            handleProcessFiles(e.dataTransfer.files);
          }
        }}
        className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all relative overflow-hidden ${
          isDraggingOverZone
            ? 'bg-simona-teal/15 border-simona-teal shadow-2xl shadow-simona-teal/20 scale-[1.005]'
            : 'bg-[#16191D] border-[#2B313A] hover:border-simona-teal/60'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-simona-teal/20 text-simona-teal border border-simona-teal/40">
                SFTP / Web-интеграция
              </span>
              <span className="text-xs text-[#87888A]">
                Каталог: <code className="text-white">/images/cms/data/photo_code/</code>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-montserrat font-bold text-white tracking-tight">
              Пакетная загрузка картинок товаров (Drag & Drop)
            </h2>

            <p className="text-xs text-[#D7D9DB] leading-relaxed">
              Перетащите сюда пачку фотографий в форматах <strong>JPG</strong>, <strong>PNG</strong> или <strong>WebP</strong>.
              Система автоматически проверит имена файлов, сконвертирует в легковесный <strong>WebP</strong> (качество 88%, до 1600px),
              сохранит на сервере и мгновенно активирует карточки товаров на витрине.
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#87888A]">
              <span>
                • Главное фото: <code className="text-simona-teal font-bold">&#123;код_1С&#125;.jpg</code>
              </span>
              <span>
                • Дополнительные кадры: <code className="text-simona-teal font-bold">&#123;код_1С&#125;_2.jpg</code>, <code className="text-simona-teal font-bold">&#123;код_1С&#125;_3.png</code>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <label className="px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2">
              <SimonaIconPlus className="w-4 h-4" />
              <span>{isUploading ? 'Загрузка и обработка...' : 'Выбрать файлы картинок'}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleProcessFiles(e.target.files);
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => setShowLogs(!showLogs)}
              className="px-4 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-xs font-semibold text-[#D7D9DB] hover:text-white transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <SimonaIconClock className="w-4 h-4 text-simona-teal" />
              <span>{showLogs ? 'Скрыть логи' : 'Журнал загрузок'}</span>
            </button>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 pt-6 border-t border-[#2B313A] space-y-2">
            <div className="flex justify-between text-xs font-medium text-white">
              <span>{uploadProgressText}</span>
              <span className="text-simona-teal animate-pulse">Обработка...</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1E2228] overflow-hidden">
              <div className="h-full bg-simona-teal rounded-full animate-pulse w-3/4 transition-all duration-300" />
            </div>
          </div>
        )}
      </div>

      {/* Upload Result Report Card */}
      {uploadResult && (
        <div className="p-5 rounded-2xl bg-[#16191D] border border-simona-teal/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <SimonaIconCheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                {uploadResult.summaryMessage}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUploadResult(null)}
              className="text-xs text-[#87888A] hover:text-white"
            >
              Закрыть отчет ✕
            </button>
          </div>

          {/* Activated items chips */}
          {uploadResult.items.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#87888A]">
                Успешно обработанные файлы и активированные карточки:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {uploadResult.items.map((item, idx) => (
                  <div
                    key={`${item.sku}-${item.filename}-${idx}`}
                    className="p-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center space-x-3 text-xs"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-simona-teal font-bold text-[11px]">
                          {item.sku}
                        </span>
                        <span className="text-[10px] text-[#87888A]">
                          (кадр {item.slotIndex})
                        </span>
                        {item.wasActivated && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                            Активирован
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium truncate text-[11px]">
                        {item.productName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected files warnings */}
          {uploadResult.rejectedFiles.length > 0 && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2">
              <div className="text-xs font-bold text-red-300">
                Отклоненные файлы ({uploadResult.rejectedFiles.length} шт.):
              </div>
              <ul className="text-xs text-red-200/90 space-y-1 max-h-36 overflow-y-auto pr-1">
                {uploadResult.rejectedFiles.map((rf, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <code className="font-mono font-semibold text-white">{rf.filename}</code>
                    <span className="text-red-300 text-[11px] text-right">{rf.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Upload Logs Drawer / Section */}
      {showLogs && (
        <div className="p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B313A] pb-3">
            <div className="flex items-center space-x-2">
              <SimonaIconClock className="w-4 h-4 text-simona-teal" />
              <h3 className="text-sm font-bold text-white">Журнал загрузок картинок товаров</h3>
            </div>
            <span className="text-xs text-[#87888A]">Всего сессий: {logs.length}</span>
          </div>

          {logs.length === 0 ? (
            <p className="text-xs text-[#87888A]">Журнал пока пуст. Загрузите первые изображения.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs transition"
                  >
                    <div
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-white font-semibold">
                          {log.dateFormatted}
                        </span>
                        <span className="text-[#87888A]">—</span>
                        <span className="text-emerald-400 font-bold">
                          {log.uploadedCount} файлов загружено
                        </span>
                        <span className="text-[#87888A]">
                          ({log.updatedProductsCount} товаров обновлено)
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-[#87888A]">
                        {log.rejectedCount > 0 && (
                          <span className="text-red-400 font-semibold">
                            {log.rejectedCount} отклонено
                          </span>
                        )}
                        <span className="text-simona-teal">{isExpanded ? 'Свернуть ▲' : 'Подробнее ▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#2B313A] space-y-2">
                        {log.items.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#87888A] font-semibold uppercase">
                              Загруженные файлы:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {log.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded-lg bg-[#16191D] border border-[#2B313A] flex items-center justify-between text-[11px]"
                                >
                                  <span className="font-mono text-simona-teal">{item.filename}</span>
                                  <span className="text-white truncate max-w-[200px]">
                                    {item.productName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {log.rejectedFiles.length > 0 && (
                          <div className="space-y-1 pt-2">
                            <span className="text-[10px] text-red-400 font-semibold uppercase">
                              Отклоненные файлы:
                            </span>
                            <div className="space-y-1">
                              {log.rejectedFiles.map((rf, i) => (
                                <div
                                  key={i}
                                  className="p-1.5 rounded-lg bg-red-950/20 border border-red-500/20 flex items-center justify-between text-[11px]"
                                >
                                  <code className="text-white font-mono">{rf.filename}</code>
                                  <span className="text-red-300">{rf.reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FILTER & EXCEL TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#16191D] p-4 sm:p-5 rounded-2xl border border-[#2B313A]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <SimonaIconSearch className="w-4 h-4 text-[#87888A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по коду 1С, бренду, подкатегории или модели..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#87888A] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Badges & Excel Download Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOnlyInStock(false)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              !onlyInStock
                ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <span>Все скрытые без фото</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                !onlyInStock ? 'bg-black/30 text-white' : 'bg-white/10 text-white'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyInStock(true)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
              onlyInStock
                ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A]'
            }`}
          >
            <span>Только в наличии на складе</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                onlyInStock ? 'bg-black/30 text-white' : 'bg-white/10 text-white'
              }`}
            >
              {totalInStockCount}
            </span>
          </button>

          <div className="h-5 w-px bg-[#2B313A] mx-1 hidden sm:block" />

          {/* Expand/Collapse All Buttons */}
          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-2 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-[11px] text-[#D7D9DB] transition cursor-pointer"
            title="Раскрыть все уровни дерева"
          >
            Развернуть все
          </button>

          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-2 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] border border-[#2B313A] text-[11px] text-[#D7D9DB] transition cursor-pointer"
            title="Свернуть все уровни дерева"
          >
            Свернуть все
          </button>

          {/* Export to Excel (.xlsx) */}
          <a
            href={`/api/manager/products-no-photo/export?onlyInStock=${onlyInStock ? 'true' : 'false'}`}
            download
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 shrink-0"
          >
            <SimonaIconDownload className="w-4 h-4" />
            <span>Выгрузить в .xlsx</span>
          </a>
        </div>
      </div>

      {/* 4-LEVEL HIERARCHICAL TREE VIEW */}
      {loading ? (
        <div className="p-16 rounded-2xl bg-[#16191D] border border-[#2B313A] text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-simona-teal border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#87888A]">Формирование иерархического каталога товаров без фото...</p>
        </div>
      ) : tree.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#16191D] border border-[#2B313A] text-center space-y-2">
          <SimonaIconCheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-base font-bold text-white">
            {searchQuery || onlyInStock
              ? 'По заданным фильтрам скрытые товары не найдены'
              : 'Все активные товары каталога обеспечены фотографиями!'}
          </p>
          <p className="text-xs text-[#87888A]">
            При появлении новых позиций из 1С без фото они автоматически распределятся по глобальным категориям здесь.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tree.map((globalNode) => {
            const isGlobalExpanded = expandedGlobals[globalNode.globalCategory] ?? false;

            return (
              <div
                key={globalNode.globalCategory}
                className="rounded-2xl bg-[#16191D] border border-[#2B313A] overflow-hidden transition"
              >
                {/* Level 1: Global Category Header */}
                <div
                  onClick={() => toggleGlobal(globalNode.globalCategory)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-[#1E2228]/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-simona-teal text-sm font-bold">
                      {isGlobalExpanded ? '▼' : '►'}
                    </span>
                    <h3 className="text-sm sm:text-base font-montserrat font-bold text-white tracking-tight">
                      {globalNode.globalCategory}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {globalNode.inStockCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {globalNode.inStockCount} в наличии
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A]">
                      {globalNode.count} поз.
                    </span>
                  </div>
                </div>

                {/* Level 2: Subcategories */}
                {isGlobalExpanded && (
                  <div className="px-3 sm:px-6 pb-4 sm:pb-5 space-y-3 pt-1 border-t border-[#2B313A]/60 bg-[#111315]/40">
                    {globalNode.subcategories.map((subNode) => {
                      const subKey = `${globalNode.globalCategory}-${subNode.subcategory}`;
                      const isSubExpanded = expandedSubs[subKey] ?? false;

                      return (
                        <div
                          key={subKey}
                          className="rounded-xl bg-[#16191D] border border-[#2B313A]/80 overflow-hidden"
                        >
                          {/* Subcategory Header */}
                          <div
                            onClick={() => toggleSub(subKey)}
                            className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-[#1E2228] transition"
                          >
                            <div className="flex items-center space-x-2.5 pl-2">
                              <span className="text-xs text-[#87888A]">
                                {isSubExpanded ? '▼' : '►'}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {subNode.subcategory}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              {subNode.inStockCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-300">
                                  {subNode.inStockCount} в наличии
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#1E2228] text-[#87888A]">
                                {subNode.count} шт.
                              </span>
                            </div>
                          </div>

                          {/* Level 3: Brands */}
                          {isSubExpanded && (
                            <div className="px-3 sm:px-4 pb-3 space-y-2 pt-1 border-t border-[#2B313A]/40 bg-[#16191D]">
                              {subNode.brands.map((brandNode) => {
                                const brandKey = `${subKey}-${brandNode.brand}`;
                                const isBrandExpanded = expandedBrands[brandKey] ?? false;

                                return (
                                  <div
                                    key={brandKey}
                                    className="rounded-lg bg-[#1E2228] border border-[#2B313A]/60 overflow-hidden"
                                  >
                                    {/* Brand Header */}
                                    <div
                                      onClick={() => toggleBrand(brandKey)}
                                      className="p-2.5 sm:p-3 flex items-center justify-between cursor-pointer select-none hover:bg-[#252B33] transition"
                                    >
                                      <div className="flex items-center space-x-2 pl-2">
                                        <span className="text-[10px] text-simona-teal">
                                          {isBrandExpanded ? '▼' : '►'}
                                        </span>
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                                          {brandNode.brand}
                                        </span>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        {brandNode.inStockCount > 0 && (
                                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold text-emerald-400">
                                            {brandNode.inStockCount} на складе
                                          </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#87888A] bg-[#16191D]">
                                          {brandNode.count} моделей
                                        </span>
                                      </div>
                                    </div>

                                    {/* Level 4: Products List */}
                                    {isBrandExpanded && (
                                      <div className="divide-y divide-[#2B313A]/40 border-t border-[#2B313A]/40 bg-[#16191D]/70">
                                        {brandNode.products.map((prod) => {
                                          const isProductDropTarget =
                                            dragOverProductSku === prod.sku;

                                          return (
                                            <div
                                              key={prod.id}
                                              onDragOver={(e) => {
                                                e.preventDefault();
                                                setDragOverProductSku(prod.sku);
                                              }}
                                              onDragLeave={() => setDragOverProductSku(null)}
                                              onDrop={(e) => {
                                                e.preventDefault();
                                                setDragOverProductSku(null);
                                                if (e.dataTransfer.files?.length) {
                                                  handleProcessFiles(
                                                    e.dataTransfer.files,
                                                    prod.sku
                                                  );
                                                }
                                              }}
                                              className={`p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition ${
                                                isProductDropTarget
                                                  ? 'bg-simona-teal/20 border-l-4 border-l-simona-teal'
                                                  : 'hover:bg-[#1E2228]/50'
                                              }`}
                                            >
                                              {/* Left: Code 1C + Canonical Title */}
                                              <div className="space-y-1 min-w-0 flex-1">
                                                <div className="flex items-center space-x-2">
                                                  <span className="px-2 py-0.5 rounded-md font-mono text-simona-teal font-bold bg-[#1E2228] border border-simona-teal/30 text-[11px]">
                                                    Код: {prod.sku}
                                                  </span>
                                                  <span className="px-1.5 py-0.5 rounded text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20">
                                                    Скрыт (нет фото)
                                                  </span>
                                                  {prod.inStock ? (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                                      Остаток: {prod.totalStock} шт.
                                                    </span>
                                                  ) : (
                                                    <span className="text-[10px] text-[#87888A]">
                                                      Под заказ
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="font-medium text-white text-xs sm:text-sm">
                                                  {prod.name}
                                                </div>
                                              </div>

                                              {/* Right: Price + Single file upload drop */}
                                              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                                                <div className="text-right">
                                                  <div className="font-montserrat font-bold text-white text-sm">
                                                    {formatPrice(prod.price)}
                                                  </div>
                                                  <div className="text-[10px] text-[#87888A]">
                                                    {prod.stockKominterna > 0
                                                      ? `Склад: ${prod.stockKominterna} шт.`
                                                      : 'Удаленный склад'}
                                                  </div>
                                                </div>

                                                <label
                                                  className="px-3 py-2 rounded-xl bg-[#1E2228] hover:bg-simona-teal hover:text-white border border-[#2B313A] hover:border-simona-teal text-simona-teal text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
                                                  title={`Загрузить фото для товара ${prod.sku}`}
                                                >
                                                  <SimonaIconPlus className="w-3.5 h-3.5" />
                                                  <span>Загрузить фото</span>
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={isUploading}
                                                    onChange={(e) => {
                                                      if (e.target.files?.length) {
                                                        handleProcessFiles(
                                                          e.target.files,
                                                          prod.sku
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
