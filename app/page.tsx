import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
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
      {/* 1. Hero Section per Figma node 1:6 */}
      <HeroSection />

      {/* 2. Authorized Dealer Brand Wall per Figma node 1:7 */}
      <BrandAtlas />

      {/* 3. Physical Spaces on Belinskogo per Figma node 1:72 */}
      <ShowroomsFigmaSection />

      {/* 4. Key Directions Collection per Figma node 1:159 */}
      <KeyDirectionsSection />

      {/* 5. Premium Service Standard per Figma node 1:370 */}
      <ServiceContour />

      {/* 6. Telegram Live Channel Reviews per Figma node 1:423 */}
      <TelegramLiveSection />

      {/* 7. Showroom Map Section (Quiet Luxury Yandex Map) */}
      <ShowroomMapSection />
    </div>
  );
}
