import React from 'react';
import { Metadata } from 'next';
import { ManagerPanelView } from '@/components/manager/ManagerPanelView';

export const metadata: Metadata = {
  title: 'Синхронизация 1С | Рабочее место менеджера СИМОНА',
  robots: { index: false, follow: false },
};

export default function ManagerSyncPage() {
  return <ManagerPanelView initialTab="sync" />;
}
