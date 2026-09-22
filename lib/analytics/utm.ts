'use client';

import { useEffect, useState } from 'react';
import { getYandexClientId } from './tracker';

export interface AnalyticsPayload {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  yclid?: string;
  gclid?: string;
  referrer?: string;
  ymClientId?: string;
}

const STORAGE_KEY = 'simona_utm_params';
const COOKIE_EXPIRE_DAYS = 90;

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
}

export function captureUtmParams(): AnalyticsPayload {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  let stored: AnalyticsPayload = {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || getCookie(STORAGE_KEY);
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch {}

  const current: AnalyticsPayload = {
    utmSource: urlParams.get('utm_source') || stored.utmSource || undefined,
    utmMedium: urlParams.get('utm_medium') || stored.utmMedium || undefined,
    utmCampaign: urlParams.get('utm_campaign') || stored.utmCampaign || undefined,
    utmContent: urlParams.get('utm_content') || stored.utmContent || undefined,
    utmTerm: urlParams.get('utm_term') || stored.utmTerm || undefined,
    yclid: urlParams.get('yclid') || stored.yclid || undefined,
    gclid: urlParams.get('gclid') || stored.gclid || undefined,
    referrer: document.referrer || stored.referrer || undefined,
  };

  // Only update storage if there are attributes
  const hasParams = Object.values(current).some(Boolean);
  if (hasParams) {
    try {
      const json = JSON.stringify(current);
      sessionStorage.setItem(STORAGE_KEY, json);
      setCookie(STORAGE_KEY, json, COOKIE_EXPIRE_DAYS);
    } catch {}
  }

  return current;
}

/**
 * Хук для клиентских компонентов форм (Чекаут, заявки, замеры)
 */
export function useAnalyticsData(): AnalyticsPayload {
  const [data, setData] = useState<AnalyticsPayload>({});

  useEffect(() => {
    const utmData = captureUtmParams();
    setData(utmData);

    // Захват ClientID Яндекс Метрики (может инициализироваться через 100-300мс)
    getYandexClientId().then((clientId) => {
      if (clientId) {
        setData((prev) => ({ ...prev, ymClientId: clientId }));
      }
    });
  }, []);

  return data;
}

/**
 * Синхронное/асинхронное получение полного аналитического пейлоада для отправки формы
 */
export async function getFullAnalyticsPayload(): Promise<AnalyticsPayload> {
  const base = captureUtmParams();
  const ymClientId = await getYandexClientId();
  return {
    ...base,
    ymClientId: ymClientId || undefined,
  };
}
