import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Подарочные сертификаты на бытовую технику в Нижнем Новгороде | СИМОНА',
  description:
    'Подарочные сертификаты сети салонов бытовой техники «СИМОНА» на любую сумму и фиксированные номиналы. Оформление онлайн и в салонах на ул. Белинского, 15 и 11/66.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/certificate',
  },
  openGraph: {
    title: 'Подарочные сертификаты «СИМОНА» | Нижний Новгород',
    description:
      'Практичный подарок для новоселья и обновления дома — действует на весь ассортимент салонов «СИМОНА».',
    url: 'https://www.simona-bt.ru/certificate',
  },
};

export default function CertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
