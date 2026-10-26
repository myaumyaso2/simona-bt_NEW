import fs from 'fs';
import path from 'path';
import { SiteContent } from '@/types/siteContent';
import defaultSiteContent from '@/content/siteContent.json';

let lastValidContent: SiteContent = defaultSiteContent as SiteContent;
let lastModifiedTime: number = 0;

/**
 * Retrieves site content dynamically from content/siteContent.json on the server.
 * Implements:
 * 1. Live F5 updates: Reads fresh JSON from disk if modified.
 * 2. Fault tolerance: If JSON syntax is invalid (missing comma/quotes), catches error and returns last valid content.
 * 3. Deep fallback: Missing keys are filled from defaultSiteContent.
 */
export function getSiteContent(): SiteContent {
  // If running in browser/client bundle, return last valid/bundled default
  if (typeof window !== 'undefined') {
    return lastValidContent;
  }

  const filePath = path.join(process.cwd(), 'content', 'siteContent.json');

  try {
    if (!fs.existsSync(filePath)) {
      return defaultSiteContent as SiteContent;
    }

    const stats = fs.statSync(filePath);
    if (stats.mtimeMs === lastModifiedTime) {
      return lastValidContent;
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(rawData);

    // Deep merge top-level sections with defaults to guarantee all keys exist
    const merged: SiteContent = {
      contacts: { ...defaultSiteContent.contacts, ...(parsed.contacts || {}) },
      navigation: { ...defaultSiteContent.navigation, ...(parsed.navigation || {}) },
      hero: {
        ...defaultSiteContent.hero,
        ...(parsed.hero || {}),
        features: {
          ...defaultSiteContent.hero.features,
          ...(parsed.hero?.features || {}),
        },
      },
      promosSection: { ...defaultSiteContent.promosSection, ...(parsed.promosSection || {}) },
      brandAtlas: { ...defaultSiteContent.brandAtlas, ...(parsed.brandAtlas || {}) },
      showroomsSection: { ...defaultSiteContent.showroomsSection, ...(parsed.showroomsSection || {}) },
      keyDirections: { ...defaultSiteContent.keyDirections, ...(parsed.keyDirections || {}) },
      service: {
        ...defaultSiteContent.service,
        ...(parsed.service || {}),
        cards: parsed.service?.cards || defaultSiteContent.service.cards,
      },
      telegram: { ...defaultSiteContent.telegram, ...(parsed.telegram || {}) },
      designersPage: {
        ...defaultSiteContent.designersPage,
        ...(parsed.designersPage || {}),
        pillars: parsed.designersPage?.pillars || defaultSiteContent.designersPage.pillars,
      },
      optPage: {
        ...defaultSiteContent.optPage,
        ...(parsed.optPage || {}),
        pillars: parsed.optPage?.pillars || defaultSiteContent.optPage.pillars,
      },
      servicesPage: {
        ...defaultSiteContent.servicesPage,
        ...(parsed.servicesPage || {}),
        pillars: parsed.servicesPage?.pillars || defaultSiteContent.servicesPage.pillars,
      },
      warrantyPage: {
        ...((defaultSiteContent as any).warrantyPage || {}),
        ...(parsed.warrantyPage || {}),
      },
      showroomsPage: { ...defaultSiteContent.showroomsPage, ...(parsed.showroomsPage || {}) },
      promosPage: { ...defaultSiteContent.promosPage, ...(parsed.promosPage || {}) },
      deliveryPaymentPage: {
        ...defaultSiteContent.deliveryPaymentPage,
        ...(parsed.deliveryPaymentPage || {}),
        selfPickup: {
          ...defaultSiteContent.deliveryPaymentPage.selfPickup,
          ...(parsed.deliveryPaymentPage?.selfPickup || {}),
        },
        nnDelivery: {
          ...defaultSiteContent.deliveryPaymentPage.nnDelivery,
          ...(parsed.deliveryPaymentPage?.nnDelivery || {}),
          tariffs: parsed.deliveryPaymentPage?.nnDelivery?.tariffs || defaultSiteContent.deliveryPaymentPage.nnDelivery.tariffs,
        },
        oblastDelivery: {
          ...defaultSiteContent.deliveryPaymentPage.oblastDelivery,
          ...(parsed.deliveryPaymentPage?.oblastDelivery || {}),
          zones: parsed.deliveryPaymentPage?.oblastDelivery?.zones || defaultSiteContent.deliveryPaymentPage.oblastDelivery.zones,
        },
        rules: {
          ...defaultSiteContent.deliveryPaymentPage.rules,
          ...(parsed.deliveryPaymentPage?.rules || {}),
          items: parsed.deliveryPaymentPage?.rules?.items || defaultSiteContent.deliveryPaymentPage.rules.items,
        },
        intercityTK: {
          ...defaultSiteContent.deliveryPaymentPage.intercityTK,
          ...(parsed.deliveryPaymentPage?.intercityTK || {}),
          terms: parsed.deliveryPaymentPage?.intercityTK?.terms || defaultSiteContent.deliveryPaymentPage.intercityTK.terms,
        },
        paymentMethods: {
          ...defaultSiteContent.deliveryPaymentPage.paymentMethods,
          ...(parsed.deliveryPaymentPage?.paymentMethods || {}),
          items: parsed.deliveryPaymentPage?.paymentMethods?.items || defaultSiteContent.deliveryPaymentPage.paymentMethods.items,
        },
      },
      priceMatchPage: {
        ...((defaultSiteContent as any).priceMatchPage || {}),
        ...(parsed.priceMatchPage || {}),
        steps: parsed.priceMatchPage?.steps || (defaultSiteContent as any).priceMatchPage?.steps || [],
      },
      certificatePage: {
        ...defaultSiteContent.certificatePage,
        ...(parsed.certificatePage || {}),
        salonBlock: {
          ...defaultSiteContent.certificatePage.salonBlock,
          ...(parsed.certificatePage?.salonBlock || {}),
        },
        rulesSection: {
          ...defaultSiteContent.certificatePage.rulesSection,
          ...(parsed.certificatePage?.rulesSection || {}),
          rules: parsed.certificatePage?.rulesSection?.rules || defaultSiteContent.certificatePage.rulesSection.rules || [],
        },
      },
      seoBlocks: {
        ...defaultSiteContent.seoBlocks,
        ...(parsed.seoBlocks || {}),
      },
      footer: { ...defaultSiteContent.footer, ...(parsed.footer || {}) },
    };

    lastValidContent = merged;
    lastModifiedTime = stats.mtimeMs;
    return merged;
  } catch (error: any) {
    console.warn(
      `⚠️ [SiteContent] Warning: Failed to parse 'content/siteContent.json' (${error.message}). Serving fallback content safely.`
    );
    return lastValidContent;
  }
}
