import React from 'react';
import type { Metadata } from 'next';
import { getCertificateProducts } from '@/lib/products';
import { CertificatePageView } from '@/components/certificate/CertificatePageView';

export const metadata: Metadata = {
  title: 'Подарочный сертификат на бытовую технику в Нижнем Новгороде | СИМОНА',
  description:
    'Купить подарочный сертификат на бытовую технику в салонах СИМОНА в Нижнем Новгороде. Номиналы: 3 000, 5 000, 10 000, 30 000, 50 000, 100 000 ₽. Оплата до 100% стоимости заказа.',
  openGraph: {
    title: 'Подарочный сертификат на бытовую технику | СИМОНА',
    description:
      'Подарочные сертификаты на бытовую технику в Нижнем Новгороде. Номиналы от 3 000 до 100 000 ₽. Оплата до 100% стоимости покупки.',
    url: 'https://simona-bt.ru/certificate',
    images: ['/images/certificate/gift_sert_hero.jpg'],
  },
};

export const dynamic = 'force-dynamic';

export default async function CertificatePage() {
  const products = await getCertificateProducts();

  return <CertificatePageView initialProducts={products} />;
}
