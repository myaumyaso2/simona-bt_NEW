import React from 'react';
import { Metadata } from 'next';
import { ManagerPanelView } from '@/components/manager/ManagerPanelView';

export const metadata: Metadata = {
  title: 'Заказы | Рабочее место менеджера СИМОНА',
  robots: { index: false, follow: false },
};

export default function ManagerOrdersPage() {
  return <ManagerPanelView initialTab="orders" />;
}
