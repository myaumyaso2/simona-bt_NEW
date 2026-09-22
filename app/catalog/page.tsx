import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogView } from '@/components/catalog/CatalogView';
import { getCatalogProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Каталог духовых шкафов и пароварок | СИМОНА — Премиальная бытовая техника',
  description:
    'Флагманские духовые шкафы с паром, СВЧ и пиролизом от ведущих европейских брендов: Miele, ASKO, SMEG, Bertazzoni. Тест-драйв на «Активной кухне», экспозиция в салонах на ул. Белинского 15 и 11/66 в Нижнем Новгороде.',
  openGraph: {
    title: 'Каталог духовых шкафов и пароварок | СИМОНА',
    description: 'Флагманские приборы с режимами пара и пиролиза. Тест-драйв на Активной кухне.',
    url: 'https://simona-bt.ru/catalog',
  },
};

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const { products, total } = await getCatalogProducts({ limit: 48 });

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
      <CatalogView initialProducts={products} totalCount={total} />
    </Suspense>
  );
}
