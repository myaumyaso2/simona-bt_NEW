import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { ManufacturerPromosSection } from '@/components/sections/ManufacturerPromosSection';
import { BrandAtlas } from '@/components/sections/BrandAtlas';
import { ShowroomsFigmaSection } from '@/components/sections/ShowroomsFigmaSection';
import { KeyDirectionsSection } from '@/components/sections/KeyDirectionsSection';
import { ServiceContour } from '@/components/sections/ServiceContour';
import { TelegramLiveSection } from '@/components/sections/TelegramLiveSection';
import { ShowroomMapSection } from '@/components/sections/ShowroomMapSection';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#111315] min-h-screen">
      {/* 1. Hero Screen per AGENTS.md 8.1 */}
      <HeroSection />

      {/* 2. Акции производителей (ManufacturerPromosSection) per AGENTS.md 8.1 */}
      <ManufacturerPromosSection />

      {/* 3. Authorized Dealer Brand Wall per AGENTS.md 8.1 */}
      <BrandAtlas />

      {/* 4. Физические шоурумы на Белинского per AGENTS.md 8.1 */}
      <ShowroomsFigmaSection />

      {/* 5. Каталог-магнит по ключевым направлениям per AGENTS.md 8.1 */}
      <KeyDirectionsSection />

      {/* 6. Премиальный сервисный стандарт per AGENTS.md 8.1 */}
      <ServiceContour />

      {/* 7. Telegram Live-контент per AGENTS.md 8.1 */}
      <TelegramLiveSection />

      {/* 8. Схема проезда (Яндекс.Карта с Luxury Dark Shader) per AGENTS.md 8.1 */}
      <ShowroomMapSection />
    </div>
  );
}
