'use client';

import React from 'react';
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
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

export function GlobalModalContainer() {
  return (
    <>
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
      <LiveChatWidget />
    </>
  );
}
