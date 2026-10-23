import React from 'react';
import { Metadata } from 'next';
import { ManagerPanelView } from '@/components/manager/ManagerPanelView';

export const metadata: Metadata = {
  title: 'Характеристики товаров | Рабочее место менеджера СИМОНА',
  robots: { index: false, follow: false },
};

export default function ManagerSpecsPage() {
  return <ManagerPanelView initialTab="specs" />;
}
