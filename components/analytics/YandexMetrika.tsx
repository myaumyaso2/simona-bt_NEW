'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { captureUtmParams } from '@/lib/analytics/utm';

export const METRIKA_COUNTER_ID = 1351807;

function MetrikaHitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Re-capture UTM/ysclid params on route change
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
