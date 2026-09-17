'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Check, Phone } from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  time: string;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'm1',
      sender: 'BOT',
      text: 'Здравствуйте! Я дежурный эксперт салонов СИМОНА. Подсказать наличие прибора на экспозиции или записать на тест-драйв «Активной кухни» на ул. Белинского, 15?',
      time: '10:00',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'USER',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate Telegram bridge response
    setTimeout(() => {
      const replyMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'BOT',
        text: 'Ваше сообщение передано в Telegram-чат дежурным экспертам салонов на ул. Белинского. Укажите ваш телефон, чтобы мы сразу прислали схему встройки или подтвердили время визита.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUICK_CONSULT',
          name: 'Посетитель онлайн-чата',
          phone,
          comment: `Сообщения из чата: ${messages.map((m) => `${m.sender}: ${m.text}`).join(' | ')}`,
        }),
      });
      setPhoneSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
      {/* Trigger Button (Pulse Aura - Quiet Luxury Online Indicator) */}
      {!isOpen && (
        <div className="relative flex items-center justify-center">
          {/* Subtle breathing turquoise aura */}
          <span className="absolute -inset-1.5 rounded-full bg-simona-teal/25 animate-pulse blur-[3px] pointer-events-none" />
          <span className="absolute inset-0 rounded-full border border-simona-teal/60 animate-ping opacity-40 [animation-duration:3.5s] pointer-events-none" />

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-simona-teal hover:bg-[#008489] text-white shadow-xl shadow-simona-teal/30 hover:shadow-simona-teal/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
            aria-label="Онлайн-консультант СИМОНА"
            title="Онлайн-консультант СИМОНА"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] rounded-2xl bg-[#14161A] border border-zinc-700 shadow-2xl flex flex-col justify-between overflow-hidden animate-scale text-xs text-white">
          {/* Top Bar */}
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-simona-teal/20 text-simona-teal font-montserrat font-bold text-sm flex items-center justify-center border border-simona-teal/40">
                  С
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-simona-teal border border-zinc-900 shadow-[0_0_6px_rgba(0,151,156,0.8)]" />
              </div>
              <div>
                <div className="font-medium text-white flex items-center">
                  <span>Салоны «СИМОНА»</span>
                </div>
                <div className="text-[10px] text-simona-teal flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-simona-teal mr-1.5 animate-pulse shadow-[0_0_6px_rgba(0,151,156,0.8)]" />
                  Дежурный эксперт в Telegram
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0F1114]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'USER'
                      ? 'bg-simona-teal text-white rounded-br-none'
                      : 'bg-zinc-800/90 text-zinc-200 rounded-bl-none border border-zinc-700/60'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Quick Phone Input in chat */}
            {!phoneSubmitted ? (
              <form onSubmit={handleSendPhone} className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-700">
                <div className="text-[11px] text-zinc-300 font-medium mb-1.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-simona-teal" />
                  Оставить телефон для быстрого ответа:
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (900) 000-00-00"
                    className="flex-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-simona-teal"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-simona-teal hover:bg-simona-teal-hover text-white text-[11px] font-semibold"
                  >
                    OK
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-[11px] flex items-center">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Телефон сохранен. Эксперт ответит вам прямо сейчас.
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите вопрос по технике..."
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-simona-teal hover:bg-simona-teal-hover text-white transition disabled:opacity-50"
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
