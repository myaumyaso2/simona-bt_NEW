'use client';

import React from 'react';
import { SimonaServiceContour } from '@/components/common/SimonaServiceContour';

export function ServiceContour() {
  return (
    <div className="w-full bg-[#111315] border-t border-[#2B313A]">
      <SimonaServiceContour
        id="service"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      />
    </div>
  );
}
