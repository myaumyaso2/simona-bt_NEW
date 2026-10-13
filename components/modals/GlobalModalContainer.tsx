'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { TestDriveModal } from '@/components/modals/TestDriveModal';
import { ShowroomVisitModal } from '@/components/modals/ShowroomVisitModal';
import { B2BLeadModal } from '@/components/modals/B2BLeadModal';
import { ProjectMatchingModal } from '@/components/modals/ProjectMatchingModal';
import { QuickConsultModal } from '@/components/modals/QuickConsultModal';
import { FastSearchModal } from '@/components/modals/FastSearchModal';
import { CartDrawer } from '@/components/modals/CartDrawer';
import { VideoPreviewModal } from '@/components/modals/VideoPreviewModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { EquipmentSelectionModal } from '@/components/modals/EquipmentSelectionModal';
import { PromoTermsModal } from '@/components/modals/PromoTermsModal';
import { PriceMatchModal } from '@/components/modals/PriceMatchModal';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';
import { ModalDeepLinkListener } from '@/components/modals/ModalDeepLinkListener';

export function GlobalModalContainer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <ModalDeepLinkListener />
      </Suspense>
      <TestDriveModal />
      <ShowroomVisitModal />
      <B2BLeadModal />
      <ProjectMatchingModal />
      <QuickConsultModal />
      <FastSearchModal />
      <CartDrawer />
      <VideoPreviewModal />
      <AuthModal />
      <EquipmentSelectionModal />
      <PromoTermsModal />
      <PriceMatchModal />
      <LiveChatWidget />
    </>
  );
}
