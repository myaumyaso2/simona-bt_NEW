'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/components/providers/StoreContext';
import {
  SimonaIconChat,
  SimonaIconClose,
  SimonaIconArrowRight,
  SimonaIconPhoneSolid,
  SimonaIconCheckCircle,
  SimonaIconMax,
} from '@/components/brand/SimonaIcons';

interface ChatMessageItem {
  id: string;
  sender: 'CLIENT' | 'MANAGER' | 'SYSTEM';
  text: string;
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'simona_chat_session_id';
const CLIENT_PHONE_STORAGE_KEY = 'simona_chat_client_phone';
const CLIENT_NAME_STORAGE_KEY = 'simona_chat_client_name';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'sess_ssr';
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing && existing.length >= 6) return existing;
  const created = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'welcome-system',
  sender: 'SYSTEM',
  text: 'Здравствуйте! Я дежурный эксперт салонов «СИМОНА». Подсказать наличие прибора на витрине в Нижнем Новгороде, проверить схему встройки или записать на тест-драйв «Активной кухни» на ул. Белинского, 15?',
  createdAt: new Date().toISOString(),
};

export function LiveChatWidget() {
  const pathname = usePathname();
  const { isCartOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([DEFAULT_WELCOME_MESSAGE]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    const savedPhone = window.localStorage.getItem(CLIENT_PHONE_STORAGE_KEY) || '';
    const savedName = window.localStorage.getItem(CLIENT_NAME_STORAGE_KEY) || '';
    if (savedPhone) {
      setPhone(savedPhone);
      setPhoneSubmitted(true);
    }
    if (savedName) {
      setClientName(savedName);
    }
  }, []);

  const fetchSessionMessages = useCallback(async (sid: string) => {
    if (!sid) return;
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${encodeURIComponent(sid)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok && Array.isArray(data.messages)) {
        const dbMsgs = data.messages as ChatMessageItem[];
        if (dbMsgs.length > 0) {
          setMessages([DEFAULT_WELCOME_MESSAGE, ...dbMsgs]);
        }
      }
    } catch {
      // ignore transient network errors during polling
    }
  }, []);

  // Poll every 4 seconds when chat window is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;
    fetchSessionMessages(sessionId);
    const interval = setInterval(() => {
      fetchSessionMessages(sessionId);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, fetchSessionMessages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !sessionId || isSending) return;

    setIsSending(true);
    setInputText('');

    const optimisticMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      sender: 'CLIENT',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: trimmed,
          clientName: clientName || 'Гость сайта',
          clientPhone: phone || null,
          pageUrl: typeof window !== 'undefined' ? window.location.href : null,
        }),
      });
      if (res.ok) {
        await fetchSessionMessages(sessionId);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !sessionId) return;

    window.localStorage.setItem(CLIENT_PHONE_STORAGE_KEY, phone.trim());
    if (clientName.trim()) {
      window.localStorage.setItem(CLIENT_NAME_STORAGE_KEY, clientName.trim());
    }
    setPhoneSubmitted(true);

    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: `Контакт для связи: ${clientName ? clientName + ', ' : ''}${phone.trim()}`,
          clientName: clientName || 'Посетитель онлайн-чата',
          clientPhone: phone.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : null,
        }),
      });
      await fetchSessionMessages(sessionId);
    } catch (err) {
      console.error('Error submitting phone in chat:', err);
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (isCartOpen) return null;

  const isProductPage = pathname?.startsWith('/product/');
  const positionClass = isProductPage ? 'bottom-24 md:bottom-6' : 'bottom-5 md:bottom-6';

  return (
    <div className={`fixed ${positionClass} right-3 sm:right-6 z-30`}>
      {/* Trigger Button (Quiet Luxury Online Indicator, strict rounded-xl) */}
      {!isOpen && (
        <div className="relative flex items-center justify-center">
          <span className="absolute -inset-1 rounded-xl bg-simona-teal/25 animate-pulse blur-[3px] pointer-events-none" />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-simona-teal hover:bg-[#008489] text-white shadow-xl shadow-simona-teal/30 hover:shadow-simona-teal/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Онлайн-консультант СИМОНА"
            title="Онлайн-консультант СИМОНА"
          >
            <SimonaIconChat className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] max-w-[360px] sm:w-[390px] h-[480px] sm:h-[510px] rounded-2xl bg-[#16191D] border border-[#2B313A] shadow-2xl flex flex-col justify-between overflow-hidden text-xs text-white">
          {/* Top Bar */}
          <div className="p-4 bg-[#1E2228] border-b border-[#2B313A] flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-simona-teal/20 text-simona-teal font-montserrat font-bold text-sm flex items-center justify-center border border-simona-teal/40">
                  С
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-md bg-simona-teal border border-[#1E2228] shadow-[0_0_6px_rgba(0,151,156,0.8)]" />
              </div>
              <div>
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <span>Салоны «СИМОНА»</span>
                  <SimonaIconMax className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] text-simona-teal flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-md bg-simona-teal mr-1.5 animate-pulse" />
                  <span>Дежурный эксперт онлайн (MAX)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#87888A] hover:text-white rounded-xl hover:bg-[#16191D] transition"
              aria-label="Закрыть чат"
            >
              <SimonaIconClose className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#111315] text-left">
            {messages.map((msg) => {
              const isClient = msg.sender === 'CLIENT';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                >
                  {msg.sender === 'MANAGER' && (
                    <span className="text-[10px] text-simona-teal font-semibold mb-1 px-1">
                      Эксперт салона «СИМОНА»
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                      isClient
                        ? 'bg-simona-teal text-white'
                        : 'bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#87888A] mt-1 px-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })}

            {/* Quick Phone Input in chat */}
            {!phoneSubmitted ? (
              <form
                onSubmit={handleSendPhone}
                className="mt-3 p-3 rounded-xl bg-[#16191D] border border-[#2B313A] space-y-2"
              >
                <div className="text-[11px] text-[#D7D9DB] font-medium flex items-center">
                  <SimonaIconPhoneSolid className="w-3 h-3 mr-1.5 text-simona-teal" />
                  <span>Оставьте контакт для прямой связи с экспертом:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ваше имя"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (910) 000-00-00"
                      className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-[11px] font-semibold transition"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-2.5 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-[#D7D9DB] text-[11px] flex items-center">
                <SimonaIconCheckCircle className="w-3.5 h-3.5 mr-1.5 text-simona-teal shrink-0" />
                <span>Контакт {phone} передан эксперту в мессенджер MAX.</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#1E2228] border-t border-[#2B313A] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите вопрос эксперту салона..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white transition disabled:opacity-50"
              disabled={!inputText.trim() || isSending}
              aria-label="Отправить сообщение"
            >
              <SimonaIconArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
