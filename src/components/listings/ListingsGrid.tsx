'use client';

import { useState } from 'react';
import { ListingCard } from './ListingCard';
import { Button } from '@/components/ui/button';
import { CarListing } from '@/types/listing';
import { ShoppingBag, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock data for development - will be replaced with real data from Supabase
const MOCK_LISTINGS: CarListing[] = [
  {
    id: '1',
    user_id: 'user1',
    external_id: 'abc123',
    url: 'https://www.facebook.com/marketplace/item/123456789',
    title: 'IKEA KALLAX Shelf Unit 4x4 - White',
    price: 150,
    year: null,
    mileage: null,
    make: null,
    model: null,
    location: 'Auckland',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    platform: 'facebook',
    current_price: 120,
    original_price: 150,
    price_dropped: true,
    saved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
    is_deleted: false,
    notes: null,
  },
  {
    id: '2',
    user_id: 'user1',
    external_id: 'def456',
    url: 'https://www.amazon.com/dp/B08N5WRWNW',
    title: 'Sony WH-1000XM4 Wireless Headphones',
    price: 349,
    year: null,
    mileage: null,
    make: 'Sony',
    model: 'WH-1000XM4',
    location: null,
    image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
    platform: 'amazon',
    current_price: 349,
    original_price: 349,
    price_dropped: false,
    saved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
    is_deleted: false,
    notes: null,
  },
  {
    id: '3',
    user_id: 'user1',
    external_id: 'ghi789',
    url: 'https://www.ebay.com/itm/234567890',
    title: 'Vintage Mid-Century Modern Coffee Table',
    price: 450,
    year: null,
    mileage: null,
    make: null,
    model: null,
    location: 'Wellington',
    image_url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400',
    platform: 'ebay',
    current_price: 380,
    original_price: 450,
    price_dropped: true,
    saved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
    is_deleted: false,
    notes: null,
  },
  {
    id: '4',
    user_id: 'user1',
    external_id: 'jkl012',
    url: 'https://www.ikea.com/nz/en/p/soderhamn-sofa-12345678/',
    title: 'SÖDERHAMN 3-seat Sofa - Samsta Dark Grey',
    price: 1299,
    year: null,
    mileage: null,
    make: null,
    model: null,
    location: null,
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400',
    platform: 'ikea',
    current_price: 1299,
    original_price: 1299,
    price_dropped: false,
    saved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_archived: false,
    is_deleted: false,
    notes: null,
  },
];

export function ListingsGrid() {
  const [listings, setListings] = useState<CarListing[]>(MOCK_LISTINGS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 4) {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (listings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
            <Link
              href={`/dashboard/compare?ids=${Array.from(selectedIds).join(',')}`}
            >
              <Button size="sm">Compare Selected</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isSelected={selectedIds.has(listing.id)}
            onToggleSelect={toggleSelect}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-slate-500">
          Showing {listings.length} of {listings.length} items
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No items yet</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Install the Grabbit Chrome extension and save your first product
        from any website.
      </p>
      <Link
        href="https://chrome.google.com/webstore"
        target="_blank"
        rel="noopener"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Install Extension
        </Button>
      </Link>
    </div>
  );
}
