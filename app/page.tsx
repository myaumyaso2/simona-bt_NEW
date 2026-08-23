import React from 'react';
import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/sections/HeroSection';
import { BrandAtlas } from '@/components/sections/BrandAtlas';
import { ActiveKitchenSection } from '@/components/sections/ActiveKitchenSection';
import { MagnetCatalog } from '@/components/sections/MagnetCatalog';
import { LookbookSection } from '@/components/sections/LookbookSection';
import { KitchenModule } from '@/components/sections/KitchenModule';
import { B2BClubSection } from '@/components/sections/B2BClubSection';
import { ServiceContour } from '@/components/sections/ServiceContour';
import { LiveContentWidget } from '@/components/sections/LiveContentWidget';
import { ShowroomsSection } from '@/components/sections/ShowroomsSection';
import { ProductItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: [{ isFeatured: 'desc' }, { price: 'desc' }],
  });

  const products: ProductItem[] = dbProducts.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    categoryType: p.categoryType as ProductItem['categoryType'],
    physicalStatus: p.physicalStatus as ProductItem['physicalStatus'],
    price: p.price,
    oldPrice: p.oldPrice,
    inStock: p.inStock,
    stockCount: p.stockCount,
    shortDesc: p.shortDesc,
    description: p.description,
    features: JSON.parse(p.featuresJson || '[]'),
    dimensions: p.dimensions,
    schematicPdfUrl: p.schematicPdfUrl,
    images: JSON.parse(p.imagesJson || '[]'),
    badge: p.badge,
    isFeatured: p.isFeatured,
  }));

  return (
    <div className="flex flex-col">
      {/* 1. Hero Screen */}
      <HeroSection />

      {/* 2. Brand Wall (Брендовый атлас) */}
      <BrandAtlas />

      {/* 3. УТП «Активная кухня и демонстрация технологий» */}
      <ActiveKitchenSection />

      {/* 4. Каталог-магнит (Гибридная модель O2O / E-commerce) */}
      <MagnetCatalog products={products} />

      {/* 5. Lookbook / Реализованные проекты с Hotspots */}
      <LookbookSection />

      {/* 6. Кросс-модуль «Кухни под ключ» */}
      <KitchenModule />

      {/* 7. B2B-блок «Клуб архитекторов и дизайнеров» */}
      <B2BClubSection />

      {/* 8. Сервисный контур */}
      <ServiceContour />

      {/* 9. Виджет Live-контента */}
      <LiveContentWidget />

      {/* 10. Презентация салонов на ул. Белинского */}
      <ShowroomsSection />
    </div>
  );
}
