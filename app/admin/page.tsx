'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { SiteContent } from '@/types/siteContent';
import {
  ADMIN_TABS,
  AdminTabDef,
  AdminFieldDef,
  getValueByPath,
  setValueByPath,
} from '@/lib/adminContentSchema';

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Content state
  const [content, setContent] = useState<SiteContent | null>(null);
  const [savedContent, setSavedContent] = useState<SiteContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(ADMIN_TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth', { method: 'GET' });
        const data = await res.json();
        if (data.authenticated) {
          setAuthStatus('authenticated');
          loadContent();
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch {
        setAuthStatus('unauthenticated');
      }
    }
    checkAuth();
  }, []);

  const loadContent = async () => {
    setIsLoadingContent(true);
    try {
      const res = await fetch('/api/admin/content', { method: 'GET' });
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        setSavedContent(data.content);
      } else {
        setSaveToast({ type: 'error', message: 'Не удалось загрузить контент' });
      }
    } catch (err: any) {
      setSaveToast({ type: 'error', message: err.message || 'Ошибка сети при загрузке' });
    } finally {
      setIsLoadingContent(false);
    }
  };

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
        loadContent();
      } else {
        setLoginError(data.error || 'Неверный пароль');
      }
    } catch {
      setLoginError('Ошибка связи с сервером');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } finally {
      setAuthStatus('unauthenticated');
      setContent(null);
      setSavedContent(null);
      setPassword('');
    }
  };

  const handleFieldChange = useCallback((keyPath: string, newValue: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      return setValueByPath(prev, keyPath, newValue);
    });
  }, []);

  const handleRevertField = useCallback((keyPath: string) => {
    if (!savedContent) return;
    const originalValue = getValueByPath(savedContent, keyPath);
    handleFieldChange(keyPath, originalValue);
  }, [savedContent, handleFieldChange]);

  const handleResetAllChanges = () => {
    if (!savedContent) return;
    if (window.confirm('Сбросить все несохраненные правки к значениям на сервере?')) {
      setContent(JSON.parse(JSON.stringify(savedContent)));
    }
  };

  const handleSave = async () => {
    if (!content || isSaving) return;

    setIsSaving(true);
    setSaveToast(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSavedContent(JSON.parse(JSON.stringify(content)));
        setSaveToast({
          type: 'success',
          message: `✓ Изменения успешно сохранены! Резервная копия создана: ${data.backupFile}`,
        });
      } else {
        setSaveToast({
          type: 'error',
          message: data.error || 'Ошибка при сохранении на сервере',
        });
      }
    } catch (err: any) {
      setSaveToast({
        type: 'error',
        message: err.message || 'Ошибка сети при сохранении',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-dismiss success toast after 6 seconds
  useEffect(() => {
    if (saveToast?.type === 'success') {
      const timer = setTimeout(() => setSaveToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  // Calculate modified fields per tab and total
  const modifiedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!content || !savedContent) return map;

    ADMIN_TABS.forEach((tab) => {
      tab.fields.forEach((field) => {
        const cur = getValueByPath(content, field.keyPath);
        const saved = getValueByPath(savedContent, field.keyPath);
        if (cur !== saved) {
          map.set(field.keyPath, true);
        }
      });
    });

    return map;
  }, [content, savedContent]);

  const totalModifiedCount = modifiedMap.size;

  const tabModifiedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ADMIN_TABS.forEach((tab) => {
      let count = 0;
      tab.fields.forEach((f) => {
        if (modifiedMap.has(f.keyPath)) count++;
      });
      counts[tab.id] = count;
    });
    return counts;
  }, [modifiedMap]);

  const currentTab = useMemo(() => {
    return ADMIN_TABS.find((t) => t.id === activeTabId) || ADMIN_TABS[0];
  }, [activeTabId]);

  // Filter fields in current tab by search query
  const filteredFields = useMemo(() => {
    if (!searchQuery.trim() || !content) return currentTab.fields;
    const q = searchQuery.toLowerCase().trim();

    return currentTab.fields.filter((field) => {
      const val = getValueByPath(content, field.keyPath).toLowerCase();
      const label = field.label.toLowerCase();
      const sec = field.section.toLowerCase();
      const kp = field.keyPath.toLowerCase();
      return val.includes(q) || label.includes(q) || sec.includes(q) || kp.includes(q);
    });
  }, [currentTab, searchQuery, content]);

  // 1. Loading screen
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#111315] text-white flex items-center justify-center font-montserrat">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-simona-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-simona-muted tracking-wider">Проверка доступа к CMS «СИМОНА»...</p>
        </div>
      </div>
    );
  }

  // 2. Login screen
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#111315] text-white flex items-center justify-center px-4 font-montserrat">
        <div className="w-full max-w-md bg-[#16191D] border border-simona-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-simona-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-simona-wine/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <span className="inline-block px-3 py-1 bg-simona-surface border border-simona-border rounded-md text-[11px] font-medium text-simona-teal tracking-wider uppercase mb-3">
              Управление витриной
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              СИМОНА <span className="text-simona-teal font-light">CMS</span>
            </h1>
            <p className="text-xs text-simona-muted leading-relaxed">
              Редактирование текстов сайта в реальном времени. Введите пароль администратора для входа.
            </p>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Пароль администратора
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                autoFocus
                className="w-full px-4 py-3 bg-[#111315] border border-simona-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-simona-teal transition-colors text-sm"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-simona-wine/20 border border-simona-wine/50 rounded-xl text-xs text-red-200">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              className="w-full py-3.5 bg-simona-teal hover:bg-[#008287] disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-simona-teal/20 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Проверка...</span>
                </>
              ) : (
                <span>Войти в CMS</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-simona-border/40 pt-4">
            <Link
              href="/"
              className="text-xs text-simona-muted hover:text-white transition-colors"
            >
              ← Вернуться на главную страницу сайта
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Dashboard
  return (
    <div className="min-h-screen bg-[#111315] text-white font-montserrat flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#16191D]/95 backdrop-blur-md border-b border-simona-border px-6 py-3.5">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-lg tracking-tight text-white">
                СИМОНА <span className="text-simona-teal font-light">CMS</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium rounded-md">
                Live F5
              </span>
            </div>

            <div className="h-4 w-px bg-simona-border hidden sm:block" />

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-simona-muted hover:text-simona-teal transition-colors flex items-center gap-1.5 group"
              title="Открыть витрину в новой вкладке"
            >
              <span>Открыть витрину</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[10px]">
                ↗
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {totalModifiedCount > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Не сохранено: <strong>{totalModifiedCount}</strong> {totalModifiedCount === 1 ? 'поле' : totalModifiedCount < 5 ? 'поля' : 'полей'}</span>
                <button
                  onClick={handleResetAllChanges}
                  className="ml-1 text-gray-400 hover:text-white underline text-[11px]"
                  title="Отменить все изменения"
                >
                  сбросить
                </button>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving || totalModifiedCount === 0}
              className={`px-5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 shadow-lg ${
                totalModifiedCount > 0
                  ? 'bg-simona-teal hover:bg-[#008287] text-white shadow-simona-teal/25 ring-2 ring-simona-teal/40'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Сохранение на сервере...</span>
                </>
              ) : (
                <>
                  <span>Сохранить изменения</span>
                  {totalModifiedCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-black/30 rounded text-[10px] font-bold">
                      {totalModifiedCount}
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-simona-muted hover:text-white border border-simona-border rounded-xl text-xs transition-colors"
              title="Выйти из сессии CMS"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Tabs & Search Toolbar */}
      <div className="bg-[#121417] border-b border-simona-border/60 sticky top-[61px] z-30 px-6 py-2.5">
        <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Tabs navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {ADMIN_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              const tabCount = tabModifiedCounts[tab.id] || 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-simona-surface border border-simona-teal/50 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.title}</span>
                  {tabCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold">
                      {tabCount}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 hidden sm:inline">
                      {tab.fields.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick search filter */}
          <div className="relative min-w-[260px] max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по строкам и ключам..."
              className="w-full px-3.5 py-1.5 bg-[#16191D] border border-simona-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-simona-teal transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-6 py-6">
        {/* Tab Intro Description */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-simona-border/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-wide">
                {currentTab.title}
              </h2>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] rounded-md font-mono">
                {currentTab.badge}
              </span>
            </div>
            <p className="text-xs text-simona-muted mt-0.5">
              {currentTab.description}
            </p>
          </div>

          <div className="text-xs text-gray-400">
            Отображается полей: <strong className="text-white">{filteredFields.length}</strong> из {currentTab.fields.length}
          </div>
        </div>

        {/* Content Table (Mirroring CONTENT_GUIDE.md) */}
        {isLoadingContent ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-simona-teal border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-simona-muted">Загрузка структуры контента...</p>
          </div>
        ) : filteredFields.length === 0 ? (
          <div className="py-16 text-center bg-[#16191D] border border-simona-border rounded-2xl p-8">
            <p className="text-sm text-gray-300 mb-1">Ничего не найдено по запросу «{searchQuery}»</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-simona-teal hover:underline"
            >
              Сбросить поисковый фильтр
            </button>
          </div>
        ) : (
          <div className="bg-[#16191D] border border-simona-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1C2026] border-b border-simona-border text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                    <th className="py-3 px-4 w-[16%]">Раздел на сайте</th>
                    <th className="py-3 px-4 w-[18%]">Ключ в JSON</th>
                    <th className="py-3 px-4 w-[24%]">Что отображается (Описание)</th>
                    <th className="py-3 px-4 w-[42%]">Редактируемый текст</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-simona-border/40 text-xs">
                  {filteredFields.map((field) => {
                    const currentValue = content ? getValueByPath(content, field.keyPath) : '';
                    const originalValue = savedContent ? getValueByPath(savedContent, field.keyPath) : '';
                    const isModified = currentValue !== originalValue;

                    return (
                      <tr
                        key={field.keyPath}
                        className={`transition-colors hover:bg-white/[0.02] ${
                          isModified ? 'bg-simona-teal/[0.04]' : ''
                        }`}
                      >
                        {/* Section */}
                        <td className="py-3.5 px-4 align-top">
                          <span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 rounded-md text-[11px] font-medium">
                            {field.section}
                          </span>
                        </td>

                        {/* JSON Key */}
                        <td className="py-3.5 px-4 align-top">
                          <code className="block font-mono text-[11px] text-teal-400/90 bg-black/40 px-2 py-1 rounded border border-white/5 break-all select-all">
                            {field.keyPath}
                          </code>
                        </td>

                        {/* Label / Description */}
                        <td className="py-3.5 px-4 align-top text-gray-300 font-medium leading-relaxed">
                          {field.label}
                        </td>

                        {/* Editable Field */}
                        <td className="py-3 px-4 align-top">
                          <div className="space-y-1.5">
                            {field.type === 'textarea' ? (
                              <textarea
                                value={currentValue}
                                onChange={(e) => handleFieldChange(field.keyPath, e.target.value)}
                                rows={Math.min(6, Math.max(2, currentValue.split('\n').length + 1))}
                                className={`w-full px-3 py-2 bg-[#111315] border rounded-xl text-white text-xs leading-relaxed placeholder-gray-600 focus:outline-none transition-all resize-y ${
                                  isModified
                                    ? 'border-simona-teal ring-1 ring-simona-teal/40 bg-simona-teal/[0.02]'
                                    : 'border-simona-border focus:border-simona-teal'
                                }`}
                              />
                            ) : (
                              <input
                                type={field.type === 'url' ? 'url' : 'text'}
                                value={currentValue}
                                onChange={(e) => handleFieldChange(field.keyPath, e.target.value)}
                                className={`w-full px-3 py-2 bg-[#111315] border rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none transition-all ${
                                  isModified
                                    ? 'border-simona-teal ring-1 ring-simona-teal/40 bg-simona-teal/[0.02]'
                                    : 'border-simona-border focus:border-simona-teal'
                                }`}
                              />
                            )}

                            {/* Modified indicator & Undo */}
                            {isModified && (
                              <div className="flex items-center justify-between text-[11px] pt-0.5">
                                <span className="text-amber-400 flex items-center gap-1 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  Изменено (не сохранено)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRevertField(field.keyPath)}
                                  className="text-gray-400 hover:text-white transition-colors underline flex items-center gap-1"
                                  title="Вернуть исходный текст с сервера"
                                >
                                  ↺ вернуть исходное
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Toast Notification */}
      {saveToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs max-w-md flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
            saveToast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
              : 'bg-red-950/90 border-red-500/40 text-red-100'
          }`}
        >
          <span className="text-base leading-none">
            {saveToast.type === 'success' ? '✓' : '⚠️'}
          </span>
          <div className="flex-1 leading-relaxed">
            {saveToast.message}
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="text-gray-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
