import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оптовые поставки бытовой техники для кухонных фабрик и дилеров | СИМОНА',
  description:
    'Оптовый отдел компании «СИМОНА» в Нижнем Новгороде: прямые поставки бытовой техники со склада на ул. Коминтерна, 27 для мебельных салонов, застройщиков и корпоративных заказчиков.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/opt',
  },
  openGraph: {
    title: 'Оптовые поставки бытовой техники | СИМОНА Нижний Новгород',
    description:
      'Складской запас на ул. Коминтерна, 27, работа с НДС и оперативная отгрузка для B2B-партнеров.',
    url: 'https://www.simona-bt.ru/opt',
  },
};

export default function OptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
