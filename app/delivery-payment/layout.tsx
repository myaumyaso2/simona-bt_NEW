import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка, оплата и бесплатное хранение бытовой техники в Нижнем Новгороде | СИМОНА',
  description:
    'Аккуратная доставка и подъем на этаж собственной службой в Нижнем Новгороде и области, самовывоз со склада на ул. Коминтерна, 27, бесплатное хранение техники до окончания ремонта. Оплата картой, по СБП и безналичному счету.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/delivery-payment',
  },
  openGraph: {
    title: 'Доставка и оплата бытовой техники | СИМОНА Нижний Новгород',
    description:
      'Собственная служба аккуратной доставки, самовывоз со склада на ул. Коминтерна, 27 и бесплатное хранение заказа.',
    url: 'https://www.simona-bt.ru/delivery-payment',
  },
};

export default function DeliveryPaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
