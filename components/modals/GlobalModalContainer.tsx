'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ModalDeepLinkListener } from '@/components/modals/ModalDeepLinkListener';

// Dynamic lazy-loading of all modal dialogs to eliminate JS bundle bloat and reduce TBT
const TestDriveModal = dynamic(
  () => import('@/components/modals/TestDriveModal').then((mod) => mod.TestDriveModal),
  { ssr: false }
);
const ShowroomVisitModal = dynamic(
  () => import('@/components/modals/ShowroomVisitModal').then((mod) => mod.ShowroomVisitModal),
  { ssr: false }
);
const B2BLeadModal = dynamic(
  () => import('@/components/modals/B2BLeadModal').then((mod) => mod.B2BLeadModal),
  { ssr: false }
);
const ProjectMatchingModal = dynamic(
  () => import('@/components/modals/ProjectMatchingModal').then((mod) => mod.ProjectMatchingModal),
  { ssr: false }
);
const QuickConsultModal = dynamic(
  () => import('@/components/modals/QuickConsultModal').then((mod) => mod.QuickConsultModal),
  { ssr: false }
);
const FastSearchModal = dynamic(
  () => import('@/components/modals/FastSearchModal').then((mod) => mod.FastSearchModal),
  { ssr: false }
);
const CartDrawer = dynamic(
  () => import('@/components/modals/CartDrawer').then((mod) => mod.CartDrawer),
  { ssr: false }
);
const VideoPreviewModal = dynamic(
  () => import('@/components/modals/VideoPreviewModal').then((mod) => mod.VideoPreviewModal),
  { ssr: false }
);
const AuthModal = dynamic(
  () => import('@/components/modals/AuthModal').then((mod) => mod.AuthModal),
  { ssr: false }
);
const EquipmentSelectionModal = dynamic(
  () => import('@/components/modals/EquipmentSelectionModal').then((mod) => mod.EquipmentSelectionModal),
  { ssr: false }
);
const PromoTermsModal = dynamic(
  () => import('@/components/modals/PromoTermsModal').then((mod) => mod.PromoTermsModal),
  { ssr: false }
);
const PriceMatchModal = dynamic(
  () => import('@/components/modals/PriceMatchModal').then((mod) => mod.PriceMatchModal),
  { ssr: false }
);
const LiveChatWidget = dynamic(
  () => import('@/components/chat/LiveChatWidget').then((mod) => mod.LiveChatWidget),
  { ssr: false }
);

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
