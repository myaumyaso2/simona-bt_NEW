'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SimonaIconDownload,
  SimonaIconSearch,
  SimonaIconCheckCircle,
  SimonaIconCheck,
  SimonaIconExternalLink,
  SimonaIconPlus,
  SimonaIconPackage,
  SimonaIconBuilding,
  SimonaIconClock,
  SimonaIconFile,
  SimonaIconFilter,
  SimonaIconSparkles,
  SimonaIconClose,
  SimonaIconTrash,
  SimonaIconChevronDown,
  SimonaIconChevronRight,
  SimonaIconInfo,
} from '@/components/brand/SimonaIcons';
import { formatPrice } from '@/lib/utils';
import {
  ProductSpecNodeItem,
  SpecGlobalCategoryNode,
  SpecSubcategoryNode,
  SpecBrandNode,
} from '@/app/api/manager/specs/route';
import { CategorySpecSchema, CategorySpecField } from '@/data/categorySpecSchemas';
import { SpecAuditLogEntry } from '@/lib/catalog/specAuditService';
import { SpecProductChangeSummary } from '@/lib/catalog/specExcelService';

export function ManagerSpecsView() {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<SpecGlobalCategoryNode[]>([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState(0);
  const [missingSpecsTotal, setMissingSpecsTotal] = useState(0);
  const [incompleteSpecsTotal, setIncompleteSpecsTotal] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // Filters
  const [filterMode, setFilterMode] = useState<'missing' | 'incomplete' | 'all'>('missing');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion expanded state maps
  const [expandedGlobals, setExpandedGlobals] = useState<Record<string, boolean>>({});
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Product Edit Drawer/Modal
  const [editingProduct, setEditingProduct] = useState<ProductSpecNodeItem | null>(null);
  const [editSchema, setEditSchema] = useState<CategorySpecSchema | null>(null);
  const [editFeatures, setEditFeatures] = useState<Array<{ label: string; value: string }>>([]);
  const [editDescription, setEditDescription] = useState('');
  const [editSchematicPdfUrl, setEditSchematicPdfUrl] = useState('');
  const [customFields, setCustomFields] = useState<Array<{ label: string; value: string }>>([]);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isAiEnriching, setIsAiEnriching] = useState(false);

  // Excel Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSubcategory, setImportSubcategory] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDryRun, setIsDryRun] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    dryRun: boolean;
    summaryMessage: string;
    changedProducts: SpecProductChangeSummary[];
  } | null>(null);

  // Audit Logs Modal
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logs, setLogs] = useState<SpecAuditLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isRollingBackId, setIsRollingBackId] = useState<string | null>(null);

  // Available subcategories for selector
  const [allSubcategories, setAllSubcategories] = useState<string[]>([]);

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  // Load tree data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('filter', filterMode);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/manager/specs?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки данных');

      setTree(data.tree || []);
      setTotalCatalogCount(data.totalCatalogCount || 0);
      setMissingSpecsTotal(data.missingSpecsTotal || 0);
      setIncompleteSpecsTotal(data.incompleteSpecsTotal || 0);
      setFilteredCount(data.filteredCount || 0);

      // Collect all subcategory names for Excel import dropdown
      const subs = new Set<string>();
      (data.tree || []).forEach((g: SpecGlobalCategoryNode) => {
        g.subcategories.forEach((s) => subs.add(s.subcategory));
      });
      setAllSubcategories(Array.from(subs).sort((a, b) => a.localeCompare(b, 'ru')));

      // Auto-expand tree if searching or small list
      if (searchQuery.trim() && data.tree?.length > 0) {
        const autoGlobals: Record<string, boolean> = {};
        const autoSubs: Record<string, boolean> = {};
        const autoBrands: Record<string, boolean> = {};

        data.tree.forEach((g: SpecGlobalCategoryNode) => {
          autoGlobals[g.globalCategory] = true;
          g.subcategories.forEach((s: SpecSubcategoryNode) => {
            autoSubs[`${g.globalCategory}-${s.subcategory}`] = true;
            s.brands.forEach((b: SpecBrandNode) => {
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
  }, [filterMode, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load audit logs
  const loadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/manager/specs/logs', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.logs) {
        setLogs(data.logs);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleOpenLogs = () => {
    setShowLogsModal(true);
    loadLogs();
  };

  const handleRollback = async (logId: string) => {
    if (!confirm('Вы уверены, что хотите откатить эту операцию? Исходные значения характеристик будут восстановлены в базе.')) {
      return;
    }
    setIsRollingBackId(logId);
    try {
      const res = await fetch('/api/manager/specs/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отката');
      showToast('success', data.summaryMessage);
      loadLogs();
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось выполнить откат';
      showToast('error', msg);
    } finally {
      setIsRollingBackId(null);
    }
  };

  // Open product editor
  const handleOpenEditProduct = async (product: ProductSpecNodeItem) => {
    setEditingProduct(product);
    setEditDescription(product.description || '');
    setEditSchematicPdfUrl(product.schematicPdfUrl || '');

    // Fetch category schema
    try {
      const res = await fetch(`/api/manager/specs/schemas?subcategory=${encodeURIComponent(product.subcategory)}`);
      const data = await res.json();
      if (res.ok && data.schema) {
        setEditSchema(data.schema);
        const schemaLabels = new Set(data.schema.fields.map((f: CategorySpecField) => f.label.toLowerCase().trim()));

        // Separate existing product features into schema fields and custom fields
        const schemaFeats: Array<{ label: string; value: string }> = [];
        const extraFeats: Array<{ label: string; value: string }> = [];

        (product.features || []).forEach((f) => {
          if (schemaLabels.has(f.label.toLowerCase().trim())) {
            schemaFeats.push({ ...f });
          } else {
            extraFeats.push({ ...f });
          }
        });

        setEditFeatures(schemaFeats);
        setCustomFields(extraFeats);
      } else {
        setEditSchema(null);
        setEditFeatures(product.features || []);
        setCustomFields([]);
      }
    } catch {
      setEditSchema(null);
      setEditFeatures(product.features || []);
      setCustomFields([]);
    }
  };

  // Trigger AI enrichment for editing product
  const handleAiEnrich = async () => {
    if (!editingProduct) return;
    setIsAiEnriching(true);
    try {
      const res = await fetch('/api/manager/specs/ai-enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: editingProduct.sku }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка AI-генерации');

      if (data.suggestedFeatures) {
        const schemaLabels = editSchema
          ? new Set(editSchema.fields.map((f) => f.label.toLowerCase().trim()))
          : new Set<string>();

        const newSchemaFeats: Array<{ label: string; value: string }> = [];
        const newExtraFeats: Array<{ label: string; value: string }> = [];

        data.suggestedFeatures.forEach((f: { label: string; value: string }) => {
          if (schemaLabels.has(f.label.toLowerCase().trim())) {
            newSchemaFeats.push({ ...f });
          } else {
            newExtraFeats.push({ ...f });
          }
        });

        setEditFeatures(newSchemaFeats);
        setCustomFields(newExtraFeats);
      }

      showToast('success', `AI успешно подобрал ${data.suggestedFeatures?.length || 0} характеристик по артикулу модели`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка AI-генерации';
      showToast('error', msg);
    } finally {
      setIsAiEnriching(false);
    }
  };

  // Save product changes
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSavingProduct(true);

    const allCombined = [
      ...editFeatures.filter((f) => f.value && f.value.trim() !== ''),
      ...customFields.filter((f) => f.label && f.label.trim() !== '' && f.value && f.value.trim() !== ''),
    ];

    try {
      const res = await fetch('/api/manager/specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: editingProduct.sku,
          features: allCombined,
          description: editDescription,
          schematicPdfUrl: editSchematicPdfUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');

      showToast('success', data.summaryMessage || 'Характеристики товара успешно сохранены');
      setEditingProduct(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось сохранить товар';
      showToast('error', msg);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Trigger Excel download for subcategory
  const handleDownloadExcel = (subcategory: string) => {
    const url = `/api/manager/specs/export?subcategory=${encodeURIComponent(subcategory)}&filter=${filterMode}`;
    window.open(url, '_blank');
  };

  // Open import modal
  const handleOpenImport = (defaultSubcategory?: string) => {
    setImportSubcategory(defaultSubcategory || allSubcategories[0] || '');
    setImportFile(null);
    setImportResult(null);
    setIsDryRun(true);
    setShowImportModal(true);
  };

  // Execute Excel Import / Dry Run
  const handleExecuteImport = async (forceCommit = false) => {
    if (!importFile || !importSubcategory) {
      showToast('error', 'Выберите файл и подкатегорию');
      return;
    }

    const currentDryRun = forceCommit ? false : isDryRun;
    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('subcategory', importSubcategory);
      formData.append('dryRun', currentDryRun ? 'true' : 'false');

      const res = await fetch('/api/manager/specs/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка импорта');

      setImportResult(data);
      showToast('success', data.summaryMessage);

      if (!currentDryRun) {
        // If committed, refresh data and close modal after delay
        loadData();
        setTimeout(() => {
          setShowImportModal(false);
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обработки файла';
      showToast('error', msg);
    } finally {
      setIsImporting(false);
    }
  };

  // Derived auto-preview dimensions and color for editor
  const previewDerived = useMemo(() => {
    let width = '';
    let height = '';
    let depth = '';
    let color: string | null = null;

    const all = [...editFeatures, ...customFields];
    for (const f of all) {
      const l = (f.label || '').toLowerCase().trim();
      const v = (f.value || '').trim();
      if (!v) continue;

      if (l === 'цвет') color = v;
      else if (l.includes('ширина')) width = v;
      else if (l.includes('высота')) height = v;
      else if (l.includes('глубина') || l.includes('длина')) depth = v;
    }

    const dimensions = (width || height || depth) ? `${width || '?'} × ${height || '?'} × ${depth || '?'} см` : null;
    return { dimensions, color };
  }, [editFeatures, customFields]);

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/90 border-red-500/50 text-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <SimonaIconCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <SimonaIconInfo className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <SimonaIconClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#16191D] border border-[#2B313A] rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-center text-simona-teal">
                <SimonaIconSparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Характеристики товаров
                </h1>
                <p className="text-xs text-zinc-400">
                  Эталонные шаблоны спецификаций, выгрузка Excel по подкатегориям и AI-обогащение новинок
                </p>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium">
              <span className="px-3 py-1.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-zinc-300">
                Всего в каталоге: <strong className="text-white ml-1">{totalCatalogCount}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Без характеристик: <strong className="text-amber-200 ml-1">{missingSpecsTotal}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300">
                Неполные (&lt; 4 полей): <strong className="text-sky-200 ml-1">{incompleteSpecsTotal}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenLogs}
              className="px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] hover:border-zinc-500 text-zinc-200 hover:text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <SimonaIconClock className="w-4 h-4 text-zinc-400" />
              Журнал и откат
            </button>
            <button
              onClick={() => handleOpenImport()}
              className="px-4 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal/90 text-white text-xs font-semibold tracking-wide shadow-lg shadow-simona-teal/20 transition-all flex items-center gap-2"
            >
              <SimonaIconFile className="w-4 h-4" />
              Загрузить Excel
            </button>
          </div>
        </div>

        {/* Toolbar: Filter switcher and Search */}
        <div className="mt-6 pt-5 border-t border-[#2B313A] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* 3 Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#111315] p-1 rounded-xl border border-[#2B313A]">
            <button
              onClick={() => setFilterMode('missing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'missing'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Без характеристик ({missingSpecsTotal})
            </button>
            <button
              onClick={() => setFilterMode('incomplete')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'incomplete'
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Неполные ({incompleteSpecsTotal})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-simona-teal/20 text-simona-teal border border-simona-teal/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Все товары ({totalCatalogCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px] lg:min-w-[340px]">
            <SimonaIconSearch className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по Коду 1С, бренду, модели..."
              className="w-full bg-[#111315] border border-[#2B313A] focus:border-simona-teal focus:ring-1 focus:ring-simona-teal rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <SimonaIconClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Hierarchy Tree */}
      {loading ? (
        <div className="bg-[#16191D] border border-[#2B313A] rounded-xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-simona-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-400">Формирование дерева характеристик каталога...</p>
        </div>
      ) : tree.length === 0 ? (
        <div className="bg-[#16191D] border border-[#2B313A] rounded-xl p-12 text-center">
          <SimonaIconCheckCircle className="w-12 h-12 text-emerald-400/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Все характеристики заполнены!</h3>
          <p className="text-xs text-zinc-400 mt-1">
            {filterMode === 'missing'
              ? 'В каталоге нет активных товаров с нулевым количеством характеристик.'
              : 'По выбранным критериям фильтрации товары не найдены.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tree.map((globalNode) => {
            const isGlobalExpanded = expandedGlobals[globalNode.globalCategory] ?? false;

            return (
              <div
                key={globalNode.globalCategory}
                className="bg-[#16191D] border border-[#2B313A] rounded-xl overflow-hidden shadow-sm"
              >
                {/* Global category row */}
                <button
                  onClick={() =>
                    setExpandedGlobals((prev) => ({
                      ...prev,
                      [globalNode.globalCategory]: !isGlobalExpanded,
                    }))
                  }
                  className="w-full px-5 py-3.5 bg-[#191D22] hover:bg-[#1E2228] transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">
                      {isGlobalExpanded ? (
                        <SimonaIconChevronDown className="w-4 h-4 text-simona-teal" />
                      ) : (
                        <SimonaIconChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <span className="font-semibold text-sm text-white tracking-wide">
                      {globalNode.globalCategory}
                    </span>
                    <span className="text-xs text-zinc-400">
                      ({globalNode.subcategories.length} подкатегорий)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {globalNode.missingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                        {globalNode.missingCount} без хар-к
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-md bg-[#111315] border border-[#2B313A] text-zinc-300 text-xs font-medium">
                      {globalNode.count} товаров
                    </span>
                  </div>
                </button>

                {/* Subcategories list */}
                {isGlobalExpanded && (
                  <div className="divide-y divide-[#2B313A]/50 bg-[#14171A]">
                    {globalNode.subcategories.map((subNode) => {
                      const subKey = `${globalNode.globalCategory}-${subNode.subcategory}`;
                      const isSubExpanded = expandedSubs[subKey] ?? false;

                      return (
                        <div key={subNode.subcategory}>
                          {/* Subcategory row */}
                          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#16191D]/70 hover:bg-[#1A1E24] transition-colors">
                            <button
                              onClick={() =>
                                setExpandedSubs((prev) => ({
                                  ...prev,
                                  [subKey]: !isSubExpanded,
                                }))
                              }
                              className="flex items-center gap-2.5 text-left grow"
                            >
                              <span className="text-zinc-500">
                                {isSubExpanded ? (
                                  <SimonaIconChevronDown className="w-3.5 h-3.5 text-simona-teal" />
                                ) : (
                                  <SimonaIconChevronRight className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <span className="font-medium text-xs text-zinc-200 hover:text-white transition-colors">
                                {subNode.subcategory}
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                ({subNode.brands.length} брендов • {subNode.count} шт)
                              </span>
                            </button>

                            {/* Subcategory Excel buttons */}
                            <div className="flex items-center gap-2">
                              {subNode.missingCount > 0 && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                                  {subNode.missingCount} новых
                                </span>
                              )}
                              <button
                                onClick={() => handleDownloadExcel(subNode.subcategory)}
                                title="Скачать Excel подкатегории для заполнения"
                                className="px-2.5 py-1 rounded-lg bg-[#1E2228] hover:bg-[#282E37] border border-[#2B313A] hover:border-simona-teal/50 text-zinc-300 hover:text-white text-xs transition-colors flex items-center gap-1.5"
                              >
                                <SimonaIconDownload className="w-3.5 h-3.5 text-simona-teal" />
                                <span>Excel</span>
                              </button>
                              <button
                                onClick={() => handleOpenImport(subNode.subcategory)}
                                title="Загрузить заполненный Excel файл"
                                className="px-2.5 py-1 rounded-lg bg-[#1E2228] hover:bg-[#282E37] border border-[#2B313A] hover:border-emerald-500/50 text-zinc-300 hover:text-white text-xs transition-colors flex items-center gap-1.5"
                              >
                                <SimonaIconFile className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Импорт</span>
                              </button>
                            </div>
                          </div>

                          {/* Brands and Products */}
                          {isSubExpanded && (
                            <div className="pl-8 pr-5 py-2 space-y-2 bg-[#111315]">
                              {subNode.brands.map((brandNode) => {
                                const brandKey = `${subKey}-${brandNode.brand}`;
                                const isBrandExpanded = expandedBrands[brandKey] ?? false;

                                return (
                                  <div
                                    key={brandNode.brand}
                                    className="border border-[#2B313A]/60 rounded-xl overflow-hidden bg-[#16191D]"
                                  >
                                    {/* Brand header row */}
                                    <button
                                      onClick={() =>
                                        setExpandedBrands((prev) => ({
                                          ...prev,
                                          [brandKey]: !isBrandExpanded,
                                        }))
                                      }
                                      className="w-full px-4 py-2.5 bg-[#191D22] hover:bg-[#1D2127] transition-colors flex items-center justify-between text-left"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-500">
                                          {isBrandExpanded ? (
                                            <SimonaIconChevronDown className="w-3 h-3 text-simona-teal" />
                                          ) : (
                                            <SimonaIconChevronRight className="w-3 h-3" />
                                          )}
                                        </span>
                                        <span className="font-semibold text-xs text-white">
                                          {brandNode.brand}
                                        </span>
                                        <span className="text-[11px] text-zinc-500">
                                          ({brandNode.products.length} моделей)
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-xs">
                                        {brandNode.missingCount > 0 && (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-medium border border-amber-500/20">
                                            {brandNode.missingCount} без хар-к
                                          </span>
                                        )}
                                      </div>
                                    </button>

                                    {/* Products list */}
                                    {isBrandExpanded && (
                                      <div className="divide-y divide-[#2B313A]/40">
                                        {brandNode.products.map((p) => {
                                          return (
                                            <div
                                              key={p.id}
                                              className="p-3.5 hover:bg-[#1A1E24] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                            >
                                              {/* Left: Product Info */}
                                              <div className="flex items-start gap-3 grow">
                                                {/* Thumbnail */}
                                                <div className="w-12 h-12 rounded-lg bg-[#111315] border border-[#2B313A] overflow-hidden shrink-0 flex items-center justify-center relative">
                                                  {p.images && p.images[0] ? (
                                                    <Image
                                                      src={p.images[0]}
                                                      alt={p.name}
                                                      fill
                                                      className="object-cover"
                                                      unoptimized
                                                    />
                                                  ) : (
                                                    <SimonaIconPackage className="w-5 h-5 text-zinc-600" />
                                                  )}
                                                </div>

                                                <div>
                                                  <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-[11px] font-bold text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded border border-simona-teal/20">
                                                      Код: {p.sku}
                                                    </span>
                                                    <span className="text-xs font-semibold text-white">
                                                      {p.name}
                                                    </span>
                                                    <span className="text-[11px] text-zinc-400">
                                                      {formatPrice(p.price)}
                                                    </span>
                                                  </div>

                                                  {/* Feature stats and preview chips */}
                                                  <div className="flex items-center gap-2 flex-wrap mt-2">
                                                    {p.featureCount === 0 ? (
                                                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        0 характеристик (пусто)
                                                      </span>
                                                    ) : p.featureCount < 4 ? (
                                                      <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-medium">
                                                        {p.featureCount} хар-ки (неполные)
                                                      </span>
                                                    ) : (
                                                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                                                        <SimonaIconCheck className="w-3 h-3 text-emerald-400" />
                                                        {p.featureCount} характеристик
                                                      </span>
                                                    )}

                                                    {/* Sample 3 features */}
                                                    {p.features.slice(0, 3).map((f, i) => (
                                                      <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded bg-[#111315] border border-[#2B313A] text-zinc-400 text-[10px]"
                                                      >
                                                        {f.label}: <strong className="text-zinc-200">{f.value}</strong>
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Right: Actions */}
                                              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                                <button
                                                  onClick={() => handleOpenEditProduct(p)}
                                                  className="px-3 py-1.5 rounded-xl bg-simona-teal hover:bg-simona-teal/90 text-white text-xs font-semibold tracking-wide shadow transition-all flex items-center gap-1.5"
                                                >
                                                  <span>Редактировать</span>
                                                </button>
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

      {/* ========================================================================= */}
      {/* MODAL 1: Product Spec Visual Editor Drawer                                 */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#16191D] border-l border-[#2B313A] h-full overflow-y-auto flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#2B313A] bg-[#191D22] sticky top-0 z-20 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs font-bold text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded border border-simona-teal/20">
                    Код 1С: {editingProduct.sku}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {editingProduct.subcategory} ({editingProduct.brand})
                  </span>
                </div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  {editingProduct.name}
                </h2>
              </div>

              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-lg bg-[#111315] hover:bg-zinc-800 border border-[#2B313A] text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <SimonaIconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 grow">
              {/* AI Auto-Enrichment Banner */}
              <div className="p-4 rounded-xl bg-simona-teal/10 border border-simona-teal/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-simona-teal/20 flex items-center justify-center text-simona-teal shrink-0">
                    <SimonaIconSparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI-автозаполнение по модели</h4>
                    <p className="text-[11px] text-zinc-400">
                      Подобрать характеристики по артикулу и каноническому шаблону {editingProduct.subcategory}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAiEnriching}
                  onClick={handleAiEnrich}
                  className="px-3.5 py-1.5 rounded-xl bg-simona-teal hover:bg-simona-teal/90 text-white text-xs font-semibold tracking-wide transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAiEnriching ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Поиск...</span>
                    </>
                  ) : (
                    <>
                      <SimonaIconSparkles className="w-3.5 h-3.5" />
                      <span>Заполнить через AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description & Schematic Inputs */}
              <div className="space-y-4 bg-[#111315] p-4 rounded-xl border border-[#2B313A]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Базовые параметры карточки
                </h3>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Описание товара (description)
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Полное текстовое описание прибора..."
                    className="w-full bg-[#16191D] border border-[#2B313A] focus:border-simona-teal rounded-xl p-3 text-xs text-white placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Схема встройки PDF (schematicPdfUrl)
                  </label>
                  <input
                    type="text"
                    value={editSchematicPdfUrl}
                    onChange={(e) => setEditSchematicPdfUrl(e.target.value)}
                    placeholder="https://... или /schematics/..."
                    className="w-full bg-[#16191D] border border-[#2B313A] focus:border-simona-teal rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500"
                  />
                </div>

                {/* Live auto-derived indicator */}
                <div className="pt-2 border-t border-[#2B313A]/50 flex items-center gap-4 text-xs text-zinc-400">
                  <span>
                    Авто-габариты: <strong className="text-white">{previewDerived.dimensions || 'не определены'}</strong>
                  </span>
                  <span>
                    Авто-цвет: <strong className="text-white">{previewDerived.color || 'не определен'}</strong>
                  </span>
                </div>
              </div>

              {/* Canonical Schema Fields */}
              {editSchema && editSchema.fields.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Спецификация подкатегории ({editSchema.fields.length} полей)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editSchema.fields.map((field) => {
                      const currentVal =
                        editFeatures.find((f) => f.label.toLowerCase().trim() === field.label.toLowerCase().trim())
                          ?.value || '';

                      const datalistId = `datalist-${field.label.replace(/[^a-zA-Z0-9]/g, '')}`;

                      return (
                        <div
                          key={field.label}
                          className="p-3 rounded-xl bg-[#111315] border border-[#2B313A] space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-medium text-zinc-300 truncate" title={field.label}>
                              {field.label}
                            </label>
                            {field.unit && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16191D] border border-[#2B313A] text-zinc-400">
                                {field.unit}
                              </span>
                            )}
                          </div>

                          <input
                            type="text"
                            list={datalistId}
                            value={currentVal}
                            placeholder={field.commonValues[0] || 'Значение'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditFeatures((prev) => {
                                const existsIdx = prev.findIndex(
                                  (f) => f.label.toLowerCase().trim() === field.label.toLowerCase().trim()
                                );
                                if (existsIdx >= 0) {
                                  const copy = [...prev];
                                  copy[existsIdx] = { label: field.label, value: val };
                                  return copy;
                                } else {
                                  return [...prev, { label: field.label, value: val }];
                                }
                              });
                            }}
                            className="w-full bg-[#16191D] border border-[#2B313A] focus:border-simona-teal rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600"
                          />

                          {/* Autocomplete Datalist */}
                          {field.commonValues && field.commonValues.length > 0 && (
                            <datalist id={datalistId}>
                              {field.commonValues.map((cv, idx) => (
                                <option key={idx} value={cv} />
                              ))}
                            </datalist>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom / Non-schema Fields */}
              <div className="space-y-3 pt-3 border-t border-[#2B313A]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Дополнительные произвольные свойства
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCustomFields((prev) => [...prev, { label: '', value: '' }])}
                    className="px-2.5 py-1 rounded-lg bg-[#1E2228] hover:bg-[#282E37] border border-[#2B313A] text-xs text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <SimonaIconPlus className="w-3.5 h-3.5 text-simona-teal" />
                    <span>Добавить свойство</span>
                  </button>
                </div>

                {customFields.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Нет дополнительных пользовательских свойств.</p>
                ) : (
                  <div className="space-y-2">
                    {customFields.map((cf, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Название (например: Wi-Fi управление)"
                          value={cf.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomFields((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], label: val };
                              return copy;
                            });
                          }}
                          className="w-1/2 bg-[#111315] border border-[#2B313A] focus:border-simona-teal rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500"
                        />
                        <input
                          type="text"
                          placeholder="Значение (например: есть)"
                          value={cf.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomFields((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], value: val };
                              return copy;
                            });
                          }}
                          className="w-1/2 bg-[#111315] border border-[#2B313A] focus:border-simona-teal rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500"
                        />
                        <button
                          type="button"
                          onClick={() => setCustomFields((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <SimonaIconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-[#2B313A] bg-[#191D22] sticky bottom-0 z-20 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-[#111315] hover:bg-zinc-800 border border-[#2B313A] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Отмена
              </button>

              <button
                type="button"
                disabled={isSavingProduct}
                onClick={handleSaveProduct}
                className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal/90 text-white text-xs font-bold tracking-wide shadow-lg shadow-simona-teal/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingProduct ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <SimonaIconCheck className="w-4 h-4" />
                    <span>Сохранить характеристики</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Excel Import & Dry-Run Review Modal                              */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#16191D] border border-[#2B313A] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2B313A] bg-[#191D22] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <SimonaIconFile className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Импорт характеристик из Excel (.xlsx)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Полная перезапись характеристик товаров подкатегории по Коду 1С
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <SimonaIconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto grow">
              {/* Subcategory select */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Целевая подкатегория каталога
                </label>
                <select
                  value={importSubcategory}
                  onChange={(e) => {
                    setImportSubcategory(e.target.value);
                    setImportResult(null);
                  }}
                  className="w-full bg-[#111315] border border-[#2B313A] focus:border-simona-teal rounded-xl px-3 py-2 text-xs text-white"
                >
                  {allSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropzone */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Файл шаблона Excel (.xlsx)
                </label>
                <div className="border-2 border-dashed border-[#2B313A] hover:border-simona-teal/50 rounded-xl p-6 text-center transition-colors bg-[#111315]/50 relative">
                  <input
                    type="file"
                    accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFile(e.target.files[0]);
                        setImportResult(null);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <SimonaIconDownload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                  {importFile ? (
                    <div>
                      <p className="text-xs font-semibold text-white">{importFile.name}</p>
                      <p className="text-[11px] text-zinc-500">{(importFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-zinc-300">
                        Перетащите сюда файл Excel или <span className="text-simona-teal underline">выберите на компьютере</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">Поддерживается только формат .xlsx</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dry-Run Checkbox */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#111315] border border-[#2B313A]">
                <input
                  type="checkbox"
                  id="dryRunCheck"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 text-simona-teal focus:ring-simona-teal bg-[#16191D]"
                />
                <label htmlFor="dryRunCheck" className="text-xs text-zinc-300 cursor-pointer">
                  <strong>Безопасный предпросмотр (Dry-Run)</strong>
                  <span className="block text-[11px] text-zinc-500">
                    Сначала проверить diff изменений без немедленной записи в базу данных
                  </span>
                </label>
              </div>

              {/* Import Results Table (Dry-Run / Finished) */}
              {importResult && (
                <div className="space-y-3 pt-3 border-t border-[#2B313A]">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
                    {importResult.summaryMessage}
                  </div>

                  {importResult.changedProducts.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Изменения по товарам ({importResult.changedProducts.length}):
                      </h4>
                      {importResult.changedProducts.map((p) => (
                        <div
                          key={p.sku}
                          className="p-3 rounded-lg bg-[#111315] border border-[#2B313A] text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-simona-teal">Код {p.sku}</span>
                            <span className="text-zinc-300 truncate max-w-[280px]">{p.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.changes.map((c, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                  c.type === 'ADDED'
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                    : c.type === 'UPDATED'
                                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                                    : 'bg-red-500/15 border-red-500/30 text-red-300'
                                }`}
                              >
                                {c.type === 'ADDED' && '+ '}
                                {c.type === 'REMOVED' && '- '}
                                {c.label}: {c.newValue || c.oldValue}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#2B313A] bg-[#191D22] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#111315] hover:bg-zinc-800 border border-[#2B313A] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Закрыть
              </button>

              <div className="flex items-center gap-3">
                {importResult?.dryRun && importResult.changedProducts.length > 0 && (
                  <button
                    type="button"
                    disabled={isImporting}
                    onClick={() => handleExecuteImport(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide shadow transition-all flex items-center gap-2"
                  >
                    <SimonaIconCheck className="w-4 h-4" />
                    <span>Подтвердить и применить в БД</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={!importFile || isImporting}
                  onClick={() => handleExecuteImport(false)}
                  className="px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal/90 text-white text-xs font-bold tracking-wide shadow transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Обработка Excel...</span>
                    </>
                  ) : (
                    <>
                      <SimonaIconFile className="w-4 h-4" />
                      <span>{isDryRun ? 'Предпросмотр diff' : 'Импортировать в БД'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Audit Logs & 1-Click Rollback Modal                              */}
      {/* ========================================================================= */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#16191D] border border-[#2B313A] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#2B313A] bg-[#191D22] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center">
                  <SimonaIconClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Журнал изменений характеристик и откат
                  </h3>
                  <p className="text-xs text-zinc-400">
                    История всех операций (ручных правок, Excel-импортов) с возможностью отката в 1 клик
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <SimonaIconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto grow">
              {isLoadingLogs ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-simona-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-zinc-400">Загрузка журнала операций...</p>
                </div>
              ) : logs.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">Журнал пуст. Операции еще не фиксировались.</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        entry.isRolledBack
                          ? 'bg-[#111315]/50 border-zinc-800 opacity-60'
                          : 'bg-[#111315] border-[#2B313A]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[11px] font-mono text-zinc-400">{entry.dateFormatted}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                entry.actionType === 'EXCEL_IMPORT'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : entry.actionType === 'AI_ENRICH'
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {entry.actionType}
                            </span>
                            {entry.isRolledBack && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/15 text-red-300 border border-red-500/30">
                                Откатано
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-white">{entry.details}</p>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            Оператор: {entry.operator} • Затронуто товаров: {entry.affectedCount}
                          </p>
                        </div>

                        {!entry.isRolledBack && (
                          <button
                            type="button"
                            disabled={isRollingBackId === entry.id}
                            onClick={() => handleRollback(entry.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isRollingBackId === entry.id ? (
                              <>
                                <span className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                                <span>Откат...</span>
                              </>
                            ) : (
                              <span>Откатить</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#2B313A] bg-[#191D22] flex justify-end">
              <button
                type="button"
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#111315] hover:bg-zinc-800 border border-[#2B313A] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
