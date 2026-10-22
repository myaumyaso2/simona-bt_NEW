'use client';

import { useEffect } from 'react';

export function NotFoundTracker() {
  useEffect(() => {
    try {
      const url = window.location.href;
      const referer = document.referrer || null;
      const payload = JSON.stringify({ url, referer });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/log-404',
          new Blob([payload], { type: 'application/json' })
        );
      } else {
        fetch('/api/analytics/log-404', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fail silently to never disrupt UI
    }
  }, []);

  return null;
}
