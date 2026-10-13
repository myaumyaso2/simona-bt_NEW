'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/components/providers/StoreContext';

/**
 * ModalDeepLinkListener
 * Listens for deep-link URL parameters to open modals automatically
 * Examples:
 *  - /?modal=consult, /?modal=podbor, /?consult=1, /#consult -> EquipmentSelectionModal
 *  - /?modal=showroom, /?modal=visit                         -> ShowroomVisitModal
 *  - /?modal=testdrive, /?modal=kitchen                      -> TestDriveModal (Активная кухня)
 *  - /?modal=b2b, /?modal=club                               -> B2BLeadModal
 *  - /?modal=project                                         -> ProjectMatchingModal
 *  - /?modal=search                                          -> FastSearchModal
 *
 * When the modal is subsequently closed by the user, the 'modal' / 'consult'
 * parameters are quietly removed from window.history without page reload,
 * preserving all UTM and analytics tags.
 */
export function ModalDeepLinkListener() {
  const searchParams = useSearchParams();
  const { openModal, modal } = useStore();
  const hasTriggeredRef = useRef(false);
  const wasOpenRef = useRef(false);

  const checkAndOpenModal = useCallback(() => {
    let modalParam = searchParams?.get('modal')?.toLowerCase()?.trim();
    let consultParam = searchParams?.get('consult')?.toLowerCase()?.trim();

    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (!modalParam) modalParam = urlParams.get('modal')?.toLowerCase()?.trim();
        if (!consultParam) consultParam = urlParams.get('consult')?.toLowerCase()?.trim();

        const hash = window.location.hash.toLowerCase();
        if (hash === '#consult' || hash === '#podbor' || hash.includes('modal=consult')) {
          modalParam = 'consult';
        } else if (hash === '#showroom' || hash.includes('modal=showroom')) {
          modalParam = 'showroom';
        } else if (hash === '#testdrive' || hash.includes('modal=testdrive')) {
          modalParam = 'testdrive';
        }
      } catch {}
    }

    // 1. Consultation / Equipment Selection
    const isConsult =
      modalParam === 'consult' ||
      modalParam === 'podbor' ||
      modalParam === 'equipment' ||
      modalParam === 'selection' ||
      consultParam === '1' ||
      consultParam === 'true' ||
      consultParam === 'yes';

    if (isConsult) {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('EQUIPMENT_SELECTION');
      }, 300);
      return () => clearTimeout(timer);
    }

    // 2. Showroom Visit
    if (modalParam === 'showroom' || modalParam === 'visit') {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('SHOWROOM_VISIT');
      }, 300);
      return () => clearTimeout(timer);
    }

    // 3. Test Drive (Active Kitchen)
    if (
      modalParam === 'testdrive' ||
      modalParam === 'test-drive' ||
      modalParam === 'kitchen' ||
      modalParam === 'active-kitchen'
    ) {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('TEST_DRIVE');
      }, 300);
      return () => clearTimeout(timer);
    }

    // 4. B2B Club / Designers
    if (modalParam === 'b2b' || modalParam === 'club' || modalParam === 'architect') {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('B2B_CLUB');
      }, 300);
      return () => clearTimeout(timer);
    }

    // 5. Project Matching
    if (modalParam === 'project' || modalParam === 'matching') {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('PROJECT_MATCHING');
      }, 300);
      return () => clearTimeout(timer);
    }

    // 6. Fast Search
    if (modalParam === 'search') {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        openModal('SEARCH');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams, openModal]);

  // 1. Initial deep-link detection on mount & URL change
  useEffect(() => {
    if (!hasTriggeredRef.current) {
      checkAndOpenModal();
    }

    if (typeof window !== 'undefined') {
      const handleHashOrPop = () => {
        hasTriggeredRef.current = false;
        checkAndOpenModal();
      };
      window.addEventListener('popstate', handleHashOrPop);
      window.addEventListener('hashchange', handleHashOrPop);
      return () => {
        window.removeEventListener('popstate', handleHashOrPop);
        window.removeEventListener('hashchange', handleHashOrPop);
      };
    }
  }, [checkAndOpenModal]);

  // 2. Quiet URL cleanup when modal closes
  useEffect(() => {
    const isCurrentlyOpen = modal.type !== null;

    if (wasOpenRef.current && !isCurrentlyOpen) {
      // Modal was open, now closed! Clean URL params if deep-link was present
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          let changed = false;

          if (url.searchParams.has('modal')) {
            url.searchParams.delete('modal');
            changed = true;
          }
          if (url.searchParams.has('consult')) {
            url.searchParams.delete('consult');
            changed = true;
          }
          if (
            url.hash === '#consult' ||
            url.hash === '#podbor' ||
            url.hash.includes('modal=')
          ) {
            url.hash = '';
            changed = true;
          }

          if (changed) {
            const cleanQuery = url.searchParams.toString();
            const cleanUrl =
              url.pathname + (cleanQuery ? `?${cleanQuery}` : '') + url.hash;
            window.history.replaceState(window.history.state, '', cleanUrl);
          }
        } catch {
          // Fail-safe: ignore URL parsing issues in non-standard environments
        }
      }
    }

    wasOpenRef.current = isCurrentlyOpen;
  }, [modal.type]);

  return null;
}
