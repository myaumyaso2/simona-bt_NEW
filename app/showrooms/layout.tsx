import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Салоны бытовой техники в Нижнем Новгороде и Активная кухня | СИМОНА',
  description:
    'Живая экспозиция встраиваемой и соло-техники в салонах «СИМОНА» на ул. Белинского, 15 и 11/66 в Нижнем Новгороде. Тест-драйв приборов в работе на Активной кухне и подбор комплекта под ваш бюджет.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/showrooms',
  },
  openGraph: {
    title: 'Салоны бытовой техники «СИМОНА» на ул. Белинского 15 и 11/66',
    description:
      'Действующая экспозиция техники, Активная кухня для тест-драйва режимов приготовления и парковка для гостей.',
    url: 'https://www.simona-bt.ru/showrooms',
  },
};

export default function ShowroomsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
