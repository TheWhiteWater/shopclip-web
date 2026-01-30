// Grabbit Listing Types
// Based on extension data model + SaaS extensions

export interface CarListing {
  id: string;
  user_id: string;
  external_id: string; // SHA-256 hash from URL (extension ID)
  url: string;
  title: string;
  price: number;
  year: number | null;
  mileage: number | null;
  make: string | null;
  model: string | null;
  location: string | null;
  image_url: string | null;
  platform: Platform;
  current_price: number;
  original_price: number | null;
  price_dropped: boolean;
  saved_at: string;
  updated_at: string;
  is_archived: boolean;
  is_deleted: boolean;
  notes: string | null;
}

export type Platform = 'facebook' | 'amazon' | 'ebay' | 'ikea' | 'marketplace' | 'other';

export interface PriceHistory {
  id: string;
  listing_id: string;
  price: number;
  recorded_at: string;
  source: 'sync' | 'manual' | 'scrape';
}

export interface PriceChange {
  direction: 'up' | 'down' | 'same';
  amount: number;
  percentage: number;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
  last_sync_at: string | null;
}

export type SubscriptionTier = 'free' | 'pro';

export interface ApiToken {
  id: string;
  user_id: string;
  name: string;
  last_used_at: string | null;
  expires_at: string;
  created_at: string;
  // token_hash is never exposed to client
}

export interface SyncLog {
  id: string;
  user_id: string;
  items_synced: number;
  items_failed: number;
  started_at: string;
  completed_at: string | null;
  error: string | null;
}

// API Request/Response types
export interface SyncRequest {
  listings: ExtensionListing[];
  syncMode: 'merge' | 'replace';
}

export interface SyncResponse {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  skipped: number;
  priceChanges: Array<{
    listingId: string;
    oldPrice: number;
    newPrice: number;
  }>;
}

// Extension listing format (what comes from chrome extension)
export interface ExtensionListing {
  id: string; // external_id
  url: string;
  title: string;
  price: number;
  year: number | null;
  mileage: number | null;
  make: string | null;
  model: string | null;
  location: string | null;
  imageUrl: string | null;
  savedAt: string;
}

// Filter types for dashboard
export interface ListingFilters {
  platform?: Platform;
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  priceDropped?: boolean;
  sort?: 'savedAt' | 'price' | 'year' | 'mileage';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    maxListings: 25,
    canExport: false,
    canViewPriceHistory: false,
  },
  pro: {
    maxListings: Infinity,
    canExport: true,
    canViewPriceHistory: true,
  },
} as const;
