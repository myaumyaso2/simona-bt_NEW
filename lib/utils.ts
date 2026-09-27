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
  SHOWROOM: {
    badge: "На витрине",
    location: "Салоны на ул. Белинского",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Оценить вживую в салоне",
    secondaryButton: "Запросить расчет комплекта",
    icon: "MapPin",
  },
  LOCAL_STOCK: {
    badge: "На складе",
    location: "Склад в Нижнем Новгороде",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Заказать со склада",
    secondaryButton: "Спецификация",
    icon: "Package",
  },
  REMOTE_STOCK: {
    badge: "На удаленном складе",
    location: "Центральный склад в РФ",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Заказать с доставкой",
    secondaryButton: "Спецификация и сроки",
    icon: "Truck",
  },
  ON_ORDER: {
    badge: "Под заказ",
    location: "Индивидуальный заказ из Европы",
    badgeClass: "bg-white/10 text-[#D7D9DB] border border-white/15",
    primaryButton: "Консультация эксперта",
    secondaryButton: "Спецификация и сроки",
    icon: "Clock",
  },
  ACTIVE_KITCHEN: {
    badge: "На витрине",
    location: "ул. Белинского, 15",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Записаться на тест-драйв",
    secondaryButton: "Схема встройки (PDF)",
    icon: "Flame",
  },
  EXHIBITION_15: {
    badge: "На витрине",
    location: "ул. Белинского, 15",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Оценить вживую в салоне",
    secondaryButton: "Запросить расчет комплекта",
    icon: "MapPin",
  },
  EXHIBITION_11: {
    badge: "На витрине",
    location: "ул. Белинского, 11/66",
    badgeClass: "bg-simona-teal/20 text-simona-teal border border-simona-teal/40",
    primaryButton: "Оценить вживую в салоне",
    secondaryButton: "Запросить расчет комплекта",
    icon: "MapPin",
  },
} as const;

export type PhysicalStatusKey = keyof typeof PHYSICAL_STATUS_CONFIG;

export type EffectivePhysicalStatus = 'SHOWROOM' | 'LOCAL_STOCK' | 'REMOTE_STOCK' | 'ON_ORDER';

/**
 * Returns single deterministic physical status based on priority:
 * 1. SHOWROOM (витрина в салоне на Белинского)
 * 2. LOCAL_STOCK (склад в НН на Коминтерна)
 * 3. REMOTE_STOCK (удаленный склад в РФ)
 * 4. ON_ORDER (под заказ)
 */
export function getProductPhysicalStatus(product: {
  physicalStatus?: string;
  stockBelinskogo15?: number;
  stockKominterna?: number;
  stockRemote?: number;
  inStock?: boolean;
}): EffectivePhysicalStatus {
  const isShowroom =
    product.physicalStatus === 'SHOWROOM' ||
    product.physicalStatus === 'ACTIVE_KITCHEN' ||
    product.physicalStatus === 'EXHIBITION_15' ||
    product.physicalStatus === 'EXHIBITION_11' ||
    (product.stockBelinskogo15 !== undefined && product.stockBelinskogo15 > 0);

  if (isShowroom) return 'SHOWROOM';

  const isLocal =
    product.physicalStatus === 'LOCAL_STOCK' ||
    Boolean(product.inStock) ||
    (product.stockKominterna !== undefined && product.stockKominterna > 0);

  if (isLocal) return 'LOCAL_STOCK';

  const isRemote =
    product.physicalStatus === 'REMOTE_STOCK' ||
    (product.stockRemote !== undefined && product.stockRemote > 0);

  if (isRemote) return 'REMOTE_STOCK';

  return 'ON_ORDER';
}
