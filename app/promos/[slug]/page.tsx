import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MANUFACTURER_PROMOS, getPromoBySlug } from '@/data/promosData';
import { PromoDetailView } from '@/components/promos/PromoDetailView';

interface PromoPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PromoPageProps): Promise<Metadata> {
  const promo = getPromoBySlug(params.slug);

  if (!promo) {
    return {
      title: 'Акция не найдена | СИМОНА',
    };
  }

  return {
    title: `${promo.title} — акция ${promo.brand} | СИМОНА`,
    description: `${promo.shortDescription} Официальный салон СИМОНА в Нижнем Новгороде на ул. Белинского 15.`,
    openGraph: {
      title: `${promo.title} | СИМОНА`,
      description: promo.shortDescription,
      images: promo.bannerUrl ? [promo.bannerUrl] : [],
      url: `https://simona-bt.ru/promos/${promo.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return MANUFACTURER_PROMOS.map((promo) => ({
    slug: promo.slug,
  }));
}

export const dynamic = 'force-dynamic';

export default function PromoPage({ params }: PromoPageProps) {
  const promo = getPromoBySlug(params.slug);

  if (!promo) {
    notFound();
  }

  return <PromoDetailView promo={promo} />;
}
