import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export const PHYSICAL_STATUS_CONFIG = {
  ACTIVE_KITCHEN: {
    badge: "🔥 Подключено на «Активной кухне»",
    location: "ул. Белинского, 15",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    primaryButton: "Записаться на тест-драйв",
    secondaryButton: "Схема встройки (PDF)",
    icon: "Flame",
  },
  EXHIBITION_15: {
    badge: "📍 В экспозиции салона",
    location: "ул. Белинского, 15",
    badgeClass: "bg-simona-teal/10 text-simona-teal border border-simona-teal/30",
    primaryButton: "Оценить вживую в салоне",
    secondaryButton: "Запросить расчет комплекта",
    icon: "MapPin",
  },
  EXHIBITION_11: {
    badge: "📍 В экспозиции OMOIKIRI & KÖRTING",
    location: "ул. Белинского, 11/66",
    badgeClass: "bg-simona-teal/10 text-simona-teal border border-simona-teal/30",
    primaryButton: "Оценить вживую в салоне",
    secondaryButton: "Запросить расчет комплекта",
    icon: "MapPin",
  },
  ON_ORDER: {
    badge: "📦 Под заказ / Склад",
    location: "Доставка со склада",
    badgeClass: "bg-zinc-800 text-zinc-300 border border-zinc-700/50",
    primaryButton: "Консультация эксперта",
    secondaryButton: "Спецификация и сроки",
    icon: "Package",
  },
} as const;

export type PhysicalStatusKey = keyof typeof PHYSICAL_STATUS_CONFIG;
