'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { captureUtmParams } from '@/lib/analytics/utm';
import { METRIKA_COUNTER_ID, trackGoal } from '@/lib/analytics/tracker';

export { METRIKA_COUNTER_ID };

function MetrikaHitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const prevUrlRef = useRef<string | null>(null);

  // Глобальный трекинг кликов по номерам телефонов (цель 47836282: phone_click в Метрике и Директе)
  useEffect(() => {
    const handleTelClick = (e: MouseEvent) => {
      if (typeof window === 'undefined') return;
      const currentPath = window.location.pathname;
      // Исключаем служебные клики менеджеров по номерам клиентов в админке и на дашборде
      if (currentPath.startsWith('/manager') || currentPath.startsWith('/analytics')) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      trackGoal('phone_click', {
        phoneHref: anchor.getAttribute('href') || '',
        pagePath: currentPath,
      });
    };

    document.addEventListener('click', handleTelClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleTelClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    // Re-capture UTM/yclid/ysclid params on route change
    captureUtmParams();

    const search = searchParams?.toString();
    const currentUrl = search ? `${pathname}?${search}` : pathname;

    // Skip on first render because ym("init") triggers the initial pageview
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevUrlRef.current = typeof window !== 'undefined' ? window.location.href : null;
      return;
    }

    if (
      typeof window !== 'undefined' &&
      typeof (window as unknown as { ym?: (...args: unknown[]) => void }).ym === 'function'
    ) {
      (window as unknown as { ym: (...args: unknown[]) => void }).ym(
        METRIKA_COUNTER_ID,
        'hit',
        currentUrl,
        {
          referer: prevUrlRef.current || document.referrer || undefined,
        }
      );
    }

    prevUrlRef.current = typeof window !== 'undefined' ? window.location.href : null;
  }, [pathname, searchParams]);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Suspense fallback={null}>
        <MetrikaHitTracker />
      </Suspense>
      <Script
        id="yandex-metrika"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${METRIKA_COUNTER_ID}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              ecommerce: "dataLayer",
              url: window.location.href,
              referrer: document.referrer
            });
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<div><img src="https://mc.yandex.ru/watch/${METRIKA_COUNTER_ID}" style="position:absolute;left:-9999px;" alt="" /></div>`,
        }}
      />
    </>
  );
}
