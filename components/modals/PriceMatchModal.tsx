'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, Link as LinkIcon } from 'lucide-react';
import {
  SimonaIconCheckCircle,
  SimonaIconTag,
  SimonaIconTelegram,
  SimonaIconMax,
} from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { LuxuryModalShell } from '@/components/modals/LuxuryModalShell';
import { formatProductName } from '@/lib/catalog/productTitle';
import { formatPrice } from '@/lib/utils';
import { formatBrandName } from '@/lib/formatters';

export function PriceMatchModal() {
  const { modal, closeModal } = useStore();
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Нижний Новгород');
  const [comment, setComment] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOpen = modal.type === 'PRICE_MATCH';
  const product = modal.product;

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setCompetitorUrl('');
    setCompetitorPrice('');
    setPhone('');
    setName('');
    setCity('Нижний Новгород');
    setComment('');
    setAgree(true);
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError('Необходимо согласие на обработку персональных данных');
      return;
    }
    if (!competitorUrl.trim()) {
      setError('Пожалуйста, укажите ссылку на товар у конкурента');
      return;
    }
    if (!phone.trim()) {
      setError('Пожалуйста, укажите контактный телефон');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const compiledComment = [
        `[Ссылка конкурента]: ${competitorUrl.trim()}`,
        competitorPrice.trim() ? `[Предложенная цена]: ${competitorPrice.trim()} ₽` : null,
        city.trim() ? `[Город]: ${city.trim()}` : null,
        comment.trim() ? `[Комментарий]: ${comment.trim()}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PRICE_MATCH',
          name: name.trim() || 'Покупатель (Снизим цену)',
          phone: phone.trim(),
          productId: product?.id,
          productName: product ? formatProductName(product) : undefined,
          comment: compiledComment,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка отправки заявки');

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Не удалось отправить заявку. Попробуйте еще раз.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuxuryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-xl"
      padding="p-5 sm:p-7"
      badgeText={!success ? 'Гарантия лучшей цены' : undefined}
      badgeVariant="teal"
      title={!success ? 'Нашли дешевле? Снизим цену!' : undefined}
      subtitle={
        !success
          ? 'Пришлите нам ссылку на этот товар в другом магазине, и мы сделаем цену еще выгоднее.'
          : undefined
      }
    >
      {success ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal shadow-[0_0_24px_rgba(0,151,156,0.25)]">
            <SimonaIconCheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white mb-2">
            Заявка принята!
          </h3>
          <p className="text-xs sm:text-sm text-[#87888A] max-w-md mx-auto leading-relaxed mb-6 font-normal">
            Наш менеджер проверит предложение конкурента и свяжется с вами в течение рабочего дня с персональной ценой.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] text-white text-xs font-semibold border border-[#2B313A] transition shadow-sm cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Product Mini-Card Preview */}
          {product && (
            <div className="p-3.5 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex items-center gap-3.5">
              {product.images?.[0] ? (
                <div className="relative w-14 h-14 rounded-xl bg-white p-1 shrink-0 overflow-hidden border border-[#2B313A]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#111315] border border-[#2B313A] flex items-center justify-center shrink-0">
                  <SimonaIconTag className="w-6 h-6 text-simona-teal" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-[#87888A] mb-0.5">
                  <span className="font-semibold text-white">
                    {formatBrandName(product.brand)}
                  </span>
                  <span>•</span>
                  <span>Код: {product.sku}</span>
                </div>
                <div className="text-xs font-semibold text-white truncate font-montserrat">
                  {formatProductName(product)}
                </div>
                <div className="text-xs text-simona-teal font-bold mt-1">
                  Цена в СИМОНА: {formatPrice(product.price)}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Competitor URL */}
            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                Ссылка на товар в другом магазине <span className="text-simona-teal">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                  placeholder="https://market... или ссылка на сайт магазина"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
                <LinkIcon className="w-4 h-4 text-[#87888A] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Price at competitor & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Цена в другом магазине, ₽
                </label>
                <input
                  type="text"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(e.target.value)}
                  placeholder="например, 169 000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Город доставки
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Нижний Новгород"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>
            </div>

            {/* Phone & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Контактный телефон <span className="text-simona-teal">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                Комментарий
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Условия акции у конкурента, промокод или пожелания по заказу"
                className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-xs placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition resize-none font-medium"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Consent checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#87888A] leading-relaxed">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 rounded border-[#2B313A] bg-[#111315] text-simona-teal focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>
                  Соглашаюсь с{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="underline text-simona-teal hover:text-simona-teal-light transition-colors"
                  >
                    политикой конфиденциальности
                  </a>{' '}
                  и пользовательским соглашением компании
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-6 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/20 hover:shadow-simona-teal/40 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2 mt-2"
            >
              <span>{loading ? 'Отправка...' : 'Отправить заявку'}</span>
            </button>

            {/* Fast Messengers alternative */}
            <div className="pt-2 text-center text-[11px] text-[#87888A]">
              <span>Или отправьте ссылку сразу в мессенджер: </span>
              <a
                href={`https://t.me/SimonaExpert?text=${encodeURIComponent(
                  `Здравствуйте. Нашел дешевле товар ${
                    product ? formatProductName(product) : ''
                  }. Ссылка:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-simona-teal hover:underline inline-flex items-center gap-1 ml-1"
              >
                <SimonaIconTelegram className="w-3 h-3" />
                <span>Telegram</span>
              </a>
              <span className="mx-1">•</span>
              <a
                href="https://max.ru/u/f9LHodD0cOIuy7am7AqiTUQzRCTzos1MKUnVod70alUJhmKBTjkjQi7MYf4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-simona-teal hover:underline inline-flex items-center gap-1"
              >
                <SimonaIconMax className="w-3 h-3" />
                <span>MAX</span>
              </a>
            </div>
          </form>
        </div>
      )}
    </LuxuryModalShell>
  );
}
