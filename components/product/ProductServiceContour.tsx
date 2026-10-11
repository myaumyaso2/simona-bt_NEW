'use client';

import React from 'react';
import { ProductItem } from '@/types';
import { SimonaServiceContour } from '@/components/common/SimonaServiceContour';

interface ProductServiceContourProps {
  product: ProductItem;
}

export function ProductServiceContour({ product }: ProductServiceContourProps) {
  return (
    <SimonaServiceContour
      product={product}
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 pb-12 border-t border-[#2B313A]"
    />
  );
}
