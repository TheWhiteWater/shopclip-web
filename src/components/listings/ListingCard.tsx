'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CarListing, PriceChange } from '@/types/listing';
import {
  MoreVertical,
  ExternalLink,
  Trash2,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { formatPrice, formatMileage } from '@/lib/format';

interface ListingCardProps {
  listing: CarListing;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  showPriceChange?: boolean;
}

export function ListingCard({
  listing,
  isSelected = false,
  onToggleSelect,
  onDelete,
  showPriceChange = true,
}: ListingCardProps) {
  const priceChange = getPriceChange(listing);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-slate-100">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}

        {/* Selection checkbox */}
        {onToggleSelect && (
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(listing.id)}
              className="bg-white border-2"
            />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-lg font-bold">
            {formatPrice(listing.current_price)}
          </Badge>
        </div>

        {/* Price change indicator */}
        {showPriceChange && priceChange && priceChange.direction !== 'same' && (
          <div className="absolute bottom-2 right-2">
            <PriceChangeIndicator change={priceChange} />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" title={listing.title}>
              {listing.title}
            </h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
              {listing.year && <span>{listing.year}</span>}
              {listing.mileage && <span>{formatMileage(listing.mileage)}</span>}
              {listing.location && <span>{listing.location}</span>}
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on TradeMe
                </a>
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(listing.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceChangeIndicator({ change }: { change: PriceChange }) {
  if (change.direction === 'down') {
    return (
      <Badge className="bg-green-500 text-white gap-1">
        <TrendingDown className="h-3 w-3" />
        {formatPrice(change.amount)}
      </Badge>
    );
  }

  if (change.direction === 'up') {
    return (
      <Badge variant="destructive" className="gap-1">
        <TrendingUp className="h-3 w-3" />
        +{formatPrice(change.amount)}
      </Badge>
    );
  }

  return null;
}

function getPriceChange(listing: CarListing): PriceChange | null {
  if (!listing.original_price || listing.original_price === listing.current_price) {
    return null;
  }

  const diff = listing.current_price - listing.original_price;

  return {
    direction: diff < 0 ? 'down' : diff > 0 ? 'up' : 'same',
    amount: Math.abs(diff),
    percentage: Math.abs((diff / listing.original_price) * 100),
  };
}
