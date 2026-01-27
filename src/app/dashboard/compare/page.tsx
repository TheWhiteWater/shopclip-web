'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { formatPrice, formatMileage } from '@/lib/format';
import { CarListing } from '@/types/listing';

function CompareContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      const idsParam = searchParams.get('ids');
      if (!idsParam) {
        setLoading(false);
        return;
      }

      const ids = idsParam.split(',').filter(Boolean);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch each listing by ID
        const fetchPromises = ids.map(id =>
          fetch(`/api/listings/${id}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch listing ${id}`);
            return res.json();
          })
        );

        const results = await Promise.all(fetchPromises);
        const fetchedListings = results
          .filter(r => r.listing)
          .map(r => r.listing);

        setListings(fetchedListings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">No cars to compare</h2>
        <p className="text-slate-500 mb-6">
          Select 2-4 cars from your listings to compare them.
        </p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  // Find best/worst values for highlighting
  const prices = listings.map((l) => l.current_price);
  const years = listings.map((l) => l.year).filter(Boolean) as number[];
  const mileages = listings.map((l) => l.mileage).filter(Boolean) as number[];

  const bestPrice = Math.min(...prices);
  const bestYear = Math.max(...years);
  const bestMileage = Math.min(...mileages);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            Compare {listings.length} Cars
          </h1>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `200px repeat(${listings.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* Header row - Images */}
          <div />
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-[16/10] bg-slate-100 relative">
                {listing.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <a
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white/90 rounded p-1 hover:bg-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate" title={listing.title}>
                  {listing.title}
                </h3>
              </div>
            </Card>
          ))}

          {/* Price row */}
          <CompareRow label="Price">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={formatPrice(listing.current_price)}
                isBest={listing.current_price === bestPrice}
                highlight="green"
              />
            ))}
          </CompareRow>

          {/* Year row */}
          <CompareRow label="Year">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={listing.year?.toString() || 'N/A'}
                isBest={listing.year === bestYear}
                highlight="green"
              />
            ))}
          </CompareRow>

          {/* Mileage row */}
          <CompareRow label="Mileage">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={formatMileage(listing.mileage)}
                isBest={listing.mileage === bestMileage}
                highlight="green"
              />
            ))}
          </CompareRow>

          {/* Make row */}
          <CompareRow label="Make">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={listing.make || 'N/A'}
              />
            ))}
          </CompareRow>

          {/* Model row */}
          <CompareRow label="Model">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={listing.model || 'N/A'}
              />
            ))}
          </CompareRow>

          {/* Location row */}
          <CompareRow label="Location">
            {listings.map((listing) => (
              <CompareCell
                key={listing.id}
                value={listing.location || 'N/A'}
              />
            ))}
          </CompareRow>

          {/* Price Change row */}
          <CompareRow label="Price Change">
            {listings.map((listing) => {
              const change = listing.original_price
                ? listing.current_price - listing.original_price
                : 0;
              return (
                <CompareCell
                  key={listing.id}
                  value={
                    change === 0
                      ? 'No change'
                      : `${change < 0 ? '' : '+'}${formatPrice(change)}`
                  }
                  isBest={change < 0}
                  highlight={change < 0 ? 'green' : change > 0 ? 'red' : undefined}
                />
              );
            })}
          </CompareRow>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center font-medium text-sm text-slate-600 py-3 border-b">
        {label}
      </div>
      {children}
    </>
  );
}

function CompareCell({
  value,
  isBest = false,
  highlight,
}: {
  value: string;
  isBest?: boolean;
  highlight?: 'green' | 'red';
}) {
  return (
    <div className="flex items-center py-3 border-b">
      <span className="text-sm">
        {value}
        {isBest && highlight === 'green' && (
          <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
            Best
          </Badge>
        )}
        {highlight === 'red' && (
          <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
            +
          </Badge>
        )}
      </span>
    </div>
  );
}

function CompareLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <CompareContent />
    </Suspense>
  );
}
