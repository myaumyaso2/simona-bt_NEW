import React from 'react';
import type { Metadata } from 'next';
import { PriceMatchView } from '@/components/price-match/PriceMatchView';

export const metadata: Metadata = {
  title: 'Нашли дешевле? Снизим цену! — Салоны бытовой техники «СИМОНА»',
  description:
    'Если вы нашли интересующий товар дешевле в другом магазине Нижнего Новгорода — мы постараемся сделать более выгодное предложение с учетом стоимости доставки.',
  openGraph: {
    title: 'Нашли дешевле? Снизим цену! | СИМОНА Нижний Новгород',
    description:
      'Мы стремимся предложить лучшие цены. Отправьте нам ссылку на товар конкурента, и мы подготовим персональное выгодное предложение.',
    url: 'https://www.simona-bt.ru/price-match',
  },
};

export const dynamic = 'force-dynamic';

export default function PriceMatchPage() {
  return <PriceMatchView />;
}
