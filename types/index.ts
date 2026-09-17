export type CategoryType = 'CATEGORY_A' | 'CATEGORY_B';

export type PhysicalStatus =
  | 'SHOWROOM'
  | 'LOCAL_STOCK'
  | 'REMOTE_STOCK'
  | 'ON_ORDER'
  | 'ACTIVE_KITCHEN'
  | 'EXHIBITION_15'
  | 'EXHIBITION_11';

export interface ProductFeature {
  label: string;
  value: string;
}

export interface ProductTechnology {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export interface ProductColorOption {
  id: string;
  name: string;
  colorHex: string;
  slug?: string;
  isAvailable?: boolean;
}

export interface ProductSpecGroup {
  groupName: string;
  items: { label: string; value: string }[];
}

export interface ProductReview {
  id: string;
  author: string;
  verifiedPurchase: boolean;
  location?: string;
  rating: number;
  date: string;
  text: string;
  photos?: string[];
}

export interface ProductExpertVerdict {
  expertName: string;
  expertRole: string;
  avatarUrl: string;
  title: string;
  quote: string;
  scores: { label: string; score: number }[];
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categoryType: CategoryType;
  physicalStatus: PhysicalStatus;
  price: number;
  oldPrice?: number | null;
  inStock: boolean;
  stockCount: number;
  shortDesc?: string | null;
  description: string;
  features?: ProductFeature[];
  featuresJson?: string;
  dimensions?: string | null;
  schematicPdfUrl?: string | null;
  schematicDwgUrl?: string | null;
  manualUrl?: string | null;
  images?: string[];
  imagesJson?: string;
  badge?: string | null;
  isFeatured?: boolean;
  colors?: ProductColorOption[];
  technologies?: ProductTechnology[];
  specGroups?: ProductSpecGroup[];
  expertVerdict?: ProductExpertVerdict;
  reviews?: ProductReview[];
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface LookbookHotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  product: {
    name: string;
    brand: string;
    sku: string;
    price: number;
    physicalStatus: PhysicalStatus;
    slug: string;
  };
}

export interface LookbookProject {
  id: string;
  title: string;
  designer: string;
  location: string;
  imageUrl: string;
  description: string;
  hotspots: LookbookHotspot[];
}

export type LeadType =
  | 'ACTIVE_KITCHEN_TESTDRIVE'
  | 'SHOWROOM_VISIT'
  | 'PROJECT_MATCHING'
  | 'B2B_CLUB'
  | 'KITCHEN_ESTIMATE'
  | 'QUICK_CONSULT'
  | 'CART_ORDER';
