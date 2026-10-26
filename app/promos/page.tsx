import React from 'react';
import type { Metadata } from 'next';
import { PromosHubView } from '@/components/promos/PromosHubView';

export const metadata: Metadata = {
  title: 'Акции производителей бытовой техники в Нижнем Новгороде | СИМОНА',
  description:
    'Официальные программы выгоды, скидки на комплекты и подарки от ведущих брендов: Miele, Asko, Liebherr, Smeg, Falmec, Körting, Omoikiri, Evelux, Vard. Салоны на ул. Белинского 15 и 11/66.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/promos',
  },
  openGraph: {
    title: 'Акции производителей бытовой техники | СИМОНА',
    description:
      'Официальные спецпредложения и комплекты со скидкой в салонах «СИМОНА» в Нижнем Новгороде.',
    url: 'https://www.simona-bt.ru/promos',
  },
};

export const dynamic = 'force-dynamic';

export default function PromosPage() {
  return <PromosHubView />;
}
