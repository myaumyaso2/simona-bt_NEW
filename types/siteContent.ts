export interface SiteFeature {
  title: string;
  description: string;
}

export interface ServiceCard {
  number: string;
  title: string;
  description: string;
}

export interface TelegramVideoItem {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  telegramUrl: string;
}

export interface PillarItem {
  num: string;
  title: string;
  desc: string;
  highlight?: string;
}

export interface SiteContent {
  contacts: {
    phone: string;
    phoneRaw: string;
    phoneFlagman: string;
    phoneOmoikiri: string;
    flagmanAddress: string;
    flagmanMapUrl: string;
    omoikiriAddress: string;
    warehouseAddress: string;
    schedule: string;
    kuhniUrl: string;
    telegramUrl: string;
    telegramHandle: string;
  };
  navigation: {
    catalog: string;
    promos: string;
    designers: string;
    opt: string;
    services: string;
    showrooms: string;
    searchPlaceholder: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    features: {
      experts: SiteFeature;
      activeKitchen: SiteFeature;
      b2b: SiteFeature;
    };
  };
  promosSection: {
    badge: string;
    title: string;
    subtitle: string;
    allPromosCta: string;
  };
  brandAtlas: {
    badge: string;
    title: string;
    subtitle: string;
  };
  showroomsSection: {
    badge: string;
    title: string;
    subtitle: string;
    flagmanTitle: string;
    flagmanAddress: string;
    flagmanHours: string;
    flagmanParking: string;
    omoikiriTitle: string;
    omoikiriAddress: string;
    omoikiriHours: string;
    omoikiriParking: string;
  };
  keyDirections: {
    badge: string;
    title: string;
    subtitle: string;
  };
  service: {
    badge: string;
    title: string;
    subtitle: string;
    consultationCta: string;
    cards: ServiceCard[];
  };
  telegram: {
    badge: string;
    title: string;
    subtitle: string;
    subscribeCta: string;
    askQuestionCta: string;
  };
  designersPage: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    secondaryButton: string;
    pillars: PillarItem[];
  };
  optPage: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    secondaryButton: string;
    pillars: PillarItem[];
  };
  servicesPage: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    pillarsTitle: string;
    pillars: PillarItem[];
  };
  showroomsPage: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    flagmanName: string;
    omoikiriName: string;
  };
  promosPage: {
    badge: string;
    title: string;
    subtitle: string;
  };
  footer: {
    brandTagline: string;
    kuhniLinkText: string;
    salonsHeading: string;
    navHeading: string;
    designersHeading: string;
    designersText: string;
    designersCta: string;
    copyright: string;
    privacyPolicyText: string;
    userAgreementText: string;
  };
}
