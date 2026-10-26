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

export interface KeyDirectionItem {
  title: string;
  desc: string;
  count: string;
  categorySlug: string;
  brand: string;
  image: string;
  span?: string;
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
    phoneService: string;
    phoneServiceRaw: string;
    emailService: string;
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
    items?: KeyDirectionItem[];
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
    channelUrl?: string;
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
  servicesPage: ServicesPageContent;
  warrantyPage: WarrantyPageContent;
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
  deliveryPaymentPage: DeliveryPaymentPageContent;
  priceMatchPage: PriceMatchPageContent;
  certificatePage: CertificatePageContent;
  seoBlocks: SeoBlocksContent;
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

export interface DeliveryTariffItem {
  units: string;
  price: string;
}

export interface DeliveryZone {
  title: string;
  subtitle: string;
  cities: string;
  tariffs: DeliveryTariffItem[];
}

export interface DeliveryRuleItem {
  num: string;
  title: string;
  desc: string;
}

export interface PaymentMethodItem {
  id: string;
  title: string;
  desc: string;
  details?: string[];
  note?: string;
}

export interface DeliveryPaymentPageContent {
  badge: string;
  title: string;
  subtitle: string;
  heroNotice: string;
  selfPickup: {
    badge: string;
    title: string;
    address: string;
    office: string;
    territory: string;
    passCode: string;
    scheduleWeekday: string;
    scheduleSaturday: string;
    scheduleSunday: string;
    storageNotice: string;
  };
  nnDelivery: {
    badge: string;
    title: string;
    lead: string;
    schedule: string;
    intervalNote: string;
    tariffs: DeliveryTariffItem[];
    sideBySideNote: string;
  };
  oblastDelivery: {
    badge: string;
    title: string;
    lead: string;
    schedule: string;
    sideBySideNote: string;
    over100kmNote: string;
    zones: DeliveryZone[];
  };
  rules: {
    badge: string;
    title: string;
    lead: string;
    items: DeliveryRuleItem[];
  };
  intercityTK: {
    badge: string;
    title: string;
    lead: string;
    terms: string[];
    docsFiz: string;
    docsYur: string;
    damageNotice: string;
  };
  paymentMethods: {
    badge: string;
    title: string;
    subtitle: string;
    prepaymentNotice: string;
    items: PaymentMethodItem[];
  };
}

export interface ServicePillarItem {
  num: string;
  title: string;
  desc: string;
  highlight?: string;
  points: string[];
}

export interface ServicesPageContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaButton: string;
  pillarsTitle: string;
  pillars: ServicePillarItem[];
  pdfGuide: {
    badge: string;
    title: string;
    desc: string;
    downloadText: string;
    fileUrl: string;
    fileSize: string;
  };
  orderService: {
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    successTitle: string;
    successDesc: string;
  };
  contactsBar: {
    title: string;
    subtitle: string;
    phone: string;
    phoneRaw: string;
    email: string;
  };
}

export interface BrandWarrantyItem {
  brand: string;
  period: string;
  desc: string;
  hotline: string;
}

export interface WarrantyPillarItem {
  title: string;
  desc: string;
}

export interface WarrantyReturnPeriodItem {
  period: string;
  title: string;
  desc: string;
}

export interface WarrantyPageContent {
  badge: string;
  title: string;
  subtitle: string;
  ctaButton: string;
  pillars: WarrantyPillarItem[];
  brandSection: {
    badge: string;
    title: string;
    subtitle: string;
    brands: BrandWarrantyItem[];
  };
  ascRule: {
    badge: string;
    title: string;
    lead: string;
    points: string[];
    salonRoleTitle: string;
    salonRoleDesc: string;
  };
  returnsSection: {
    badge: string;
    title: string;
    lead: string;
    offlineTitle: string;
    offlineDesc: string;
    distanceTitle: string;
    distanceDesc: string;
    distancePoints: string[];
    defectTitle: string;
    defectDesc: string;
    defectPoints15Days: string[];
    defectPointsAfter15Days: string[];
    expertTitle: string;
    expertDesc: string;
    periods: WarrantyReturnPeriodItem[];
    blankDownloadTitle: string;
    blankDownloadDesc: string;
    blankDownloadButton: string;
  };
  warrantyConditions: {
    badge: string;
    title: string;
    lead: string;
    rules: { title: string; desc: string }[];
    voidNoticeTitle: string;
    voidNoticeDesc: string;
  };
  claimForm: {
    badge: string;
    title: string;
    subtitle: string;
    buttonText: string;
    successTitle: string;
    successDesc: string;
  };
}

export interface PriceMatchStepItem {
  num: string;
  title: string;
  desc: string;
}

export interface PriceMatchPageContent {
  badge: string;
  title: string;
  subtitle: string;
  noticeTitle: string;
  noticeDesc: string;
  stepsTitle: string;
  stepsSubtitle: string;
  steps: PriceMatchStepItem[];
  catalogButtonText: string;
  formBadge: string;
  formTitle: string;
  formSubtitle: string;
  formSuccessTitle: string;
  formSuccessDesc: string;
}

export interface CertificatePageContent {
  badge: string;
  title: string;
  subtitle: string;
  nominalsSummary: string;
  catalogSectionTitle: string;
  catalogSectionSubtitle: string;
  salonBlock: {
    badge: string;
    title: string;
    salonName: string;
    address: string;
    phone: string;
    phoneRaw: string;
    schedule: string;
    description: string;
  };
  rulesSection: {
    badge: string;
    title: string;
    rules: string[];
    pdfTitle: string;
    pdfDesc: string;
    pdfButtonText: string;
    pdfUrl: string;
  };
}

export interface SeoBlocksContent {
  categoryBrandsHeading: string;
  categoryResetBrandText: string;
  categoryPillarGuaranteeTitle: string;
  categoryPillarGuaranteeDesc: string;
  categoryPillarLogisticsTitle: string;
  categoryPillarLogisticsDesc: string;
  categoryPillarInstallTitle: string;
  categoryPillarInstallDesc: string;
  brandFaqTitle: string;
  brandCategoriesHeading: string;
}



