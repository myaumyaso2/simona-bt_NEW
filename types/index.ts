export type CategoryType = 'CATEGORY_A' | 'CATEGORY_B';

export type PhysicalStatus = 'ACTIVE_KITCHEN' | 'EXHIBITION_15' | 'EXHIBITION_11' | 'ON_ORDER';

export interface ProductFeature {
  label: string;
  value: string;
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
  images?: string[];
  imagesJson?: string;
  badge?: string | null;
  isFeatured?: boolean;
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
