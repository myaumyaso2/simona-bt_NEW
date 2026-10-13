import React from 'react';
import { Metadata } from 'next';
import { ManagerPanelView } from '@/components/manager/ManagerPanelView';

export const metadata: Metadata = {
  title: 'Лиды и заявки | Рабочее место менеджера СИМОНА',
  robots: { index: false, follow: false },
};

export default function ManagerLeadsPage() {
  return <ManagerPanelView initialTab="leads" />;
}
