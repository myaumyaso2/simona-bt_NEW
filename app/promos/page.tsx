import React from 'react';
import type { Metadata } from 'next';
import { PromosHubView } from '@/components/promos/PromosHubView';

export const metadata: Metadata = {
  title: 'Акции производителей бытовой техники в Нижнем Новгороде | СИМОНА',
  description:
    'Официальные программы выгоды, скидки на комплекты и подарки от ведущих европейских брендов: Miele, ASKO, Liebherr, SMEG, Falmec, OMOIKIRI. Шоурумы на ул. Белинского 15 и 11/66.',
  openGraph: {
    title: 'Акции европейских брендов бытовой техники | СИМОНА',
    description:
      'Официальные спецпредложения и комплекты со скидкой от авторизованного партнера в Нижнем Новгороде.',
    url: 'https://simona-bt.ru/promos',
  },
};

export const dynamic = 'force-dynamic';

export default function PromosPage() {
  return <PromosHubView />;
}
