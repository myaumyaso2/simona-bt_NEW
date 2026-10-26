import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Установка, подключение и подбор встраиваемой бытовой техники в Нижнем Новгороде | СИМОНА',
  description:
    'Профессионально устанавливаем и подключаем встраиваемую бытовую технику в Нижнем Новгороде. Комплексный подбор приборов по дизайн-проекту кухни, проверка схем встройки и бережное хранение на складе.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/services',
  },
  openGraph: {
    title: 'Сервис, подбор и установка бытовой техники | СИМОНА',
    description:
      'Профессиональная установка и подключение встраиваемой техники, проверка технических схем и комплектация кухонь под ключ.',
    url: 'https://www.simona-bt.ru/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
