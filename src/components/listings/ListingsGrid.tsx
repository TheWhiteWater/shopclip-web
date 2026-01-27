'use client';

import { useState } from 'react';
import { ListingCard } from './ListingCard';
import { Button } from '@/components/ui/button';
import { CarListing } from '@/types/listing';
import { Car, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock data for development - will be replaced with real data from Supabase
const MOCK_LISTINGS: CarListing[] = [
  {
    id: '1',
    user_id: 'user1',
    external_id: 'abc123',
    url: 'https://www.trademe.co.nz/a/motors/cars/toyota/corolla/listing/12345678',
    title: '2019 Toyota Corolla GX 1.8L Hybrid',
    price: 28990,
    year: 2019,
    mileage: 45000,
    make: 'Toyota',
    model: 'Corolla',
    location: 'Auckland',
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    platform: 'trademe',
    current_price: 26990,
    original_price: 28990,
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
    url: 'https://www.trademe.co.nz/a/motors/cars/honda/civic/listing/23456789',
    title: '2020 Honda Civic RS Turbo',
    price: 32500,
    year: 2020,
    mileage: 38000,
    make: 'Honda',
    model: 'Civic',
    location: 'Wellington',
    image_url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    platform: 'trademe',
    current_price: 32500,
    original_price: 32500,
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
    url: 'https://www.trademe.co.nz/a/motors/cars/mazda/cx-5/listing/34567890',
    title: '2018 Mazda CX-5 GSX 2.5L AWD',
    price: 29990,
    year: 2018,
    mileage: 62000,
    make: 'Mazda',
    model: 'CX-5',
    location: 'Christchurch',
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    platform: 'trademe',
    current_price: 27500,
    original_price: 29990,
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
    url: 'https://www.trademe.co.nz/a/motors/cars/subaru/outback/listing/45678901',
    title: '2021 Subaru Outback Premium 2.5L',
    price: 42990,
    year: 2021,
    mileage: 28000,
    make: 'Subaru',
    model: 'Outback',
    location: 'Auckland',
    image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    platform: 'trademe',
    current_price: 42990,
    original_price: 42990,
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
            {selectedIds.size} car{selectedIds.size > 1 ? 's' : ''} selected
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
          Showing {listings.length} of {listings.length} listings
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Install the CarScout Chrome extension and save your first car listing
        from TradeMe.
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
