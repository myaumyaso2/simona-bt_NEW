import React from 'react';
import { Metadata } from 'next';
import { ManagerPanelView } from '@/components/manager/ManagerPanelView';

export const metadata: Metadata = {
  title: 'Новинки 1С без фото | Рабочее место менеджера СИМОНА',
  robots: { index: false, follow: false },
};

export default function ManagerProductsNoPhotoPage() {
  return <ManagerPanelView initialTab="products-no-photo" />;
}
