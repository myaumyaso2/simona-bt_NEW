'use client';

import { ProductItem } from '@/types';
import { METRIKA_COUNTER_ID } from '@/components/analytics/YandexMetrika';

declare global {
  interface Window {
    dataLayer?: any[];
    ym?: (counterId: number, method: string, ...args: any[]) => void;
  }
}

/**
 * Enhanced Ecommerce: Просмотр карточки товара
 */
export function trackEcommerceDetail(product: ProductItem) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      detail: {
        products: [
          {
            id: product.sku || product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            category: product.category,
          },
        ],
      },
    },
  });
}

/**
 * Enhanced Ecommerce: Добавление товара в корзину
 */
export function trackEcommerceAddToCart(product: ProductItem, quantity: number = 1) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      add: {
        products: [
          {
            id: product.sku || product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            category: product.category,
            quantity,
          },
        ],
      },
    },
  });
}

/**
 * Enhanced Ecommerce: Удаление товара из корзины
 */
export function trackEcommerceRemoveFromCart(product: ProductItem, quantity: number = 1) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      remove: {
        products: [
          {
            id: product.sku || product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            category: product.category,
            quantity,
          },
        ],
      },
    },
  });
}

/**
 * Enhanced Ecommerce: Успешная покупка / Заказ
 */
export function trackEcommercePurchase(order: {
  id: string;
  revenue: number;
  shipping?: number;
  products: {
    id: string;
    name: string;
    price: number;
    brand: string;
    category?: string;
    quantity: number;
  }[];
}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      purchase: {
        actionField: {
          id: order.id,
          revenue: order.revenue,
          shipping: order.shipping || 0,
        },
        products: order.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          brand: p.brand,
          category: p.category || 'Бытовая техника',
          quantity: p.quantity,
        })),
      },
    },
  });
}

/**
 * Достижение цели в Яндекс Метрике
 */
export function trackGoal(goalName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(METRIKA_COUNTER_ID, 'reachGoal', goalName, params);
  } catch (e) {
    console.error('Metrika trackGoal error:', e);
  }
}

/**
 * Асинхронное получение ClientID Яндекс Метрики
 */
export async function getYandexClientId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // 1. Попытка извлечь из cookie _ym_uid
  const match = document.cookie.match(/(?:^|; )_ym_uid=([^;]*)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // 2. Попытка через ym(counterId, 'getClientID', callback)
  if (typeof window.ym === 'function') {
    return new Promise((resolve) => {
      try {
        window.ym!(METRIKA_COUNTER_ID, 'getClientID', (id: string) => {
          resolve(id || null);
        });
      } catch {
        resolve(null);
      }
    });
  }

  return null;
}
