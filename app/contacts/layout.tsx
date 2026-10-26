import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты и адреса салонов в Нижнем Новгороде — ул. Белинского 15 и 11/66 | СИМОНА',
  description:
    'Телефоны, график работы, реквизиты и адреса салонов бытовой техники «СИМОНА» в Нижнем Новгороде: флагманский салон на ул. Белинского, 15, салон Omoikiri и Körting на ул. Белинского, 11/66 и центральный склад на ул. Коминтерна, 27.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/contacts',
  },
  openGraph: {
    title: 'Контакты и адреса салонов «СИМОНА» в Нижнем Новгороде',
    description:
      'Салоны на ул. Белинского, 15 и 11/66, склад самовывоза на ул. Коминтерна, 27. Парковка для клиентов, консультация экспертов.',
    url: 'https://www.simona-bt.ru/contacts',
  },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
