import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Официальная гарантия, сервисное обслуживание и возврат техники | СИМОНА',
  description:
    'Официальная гарантия производителей на всю бытовую технику в сети салонов «СИМОНА» в Нижнем Новгороде. Авторизованные сервисные центры, прозрачные правила обмена и возврата по законодательству РФ.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/warranty',
  },
  openGraph: {
    title: 'Гарантия и сервисная поддержка | СИМОНА Нижний Новгород',
    description:
      'Официальная гарантия и обслуживание в авторизованных сервисных центрах.',
    url: 'https://www.simona-bt.ru/warranty',
  },
};

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
