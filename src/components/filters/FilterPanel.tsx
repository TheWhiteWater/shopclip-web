'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingFilters } from '@/types/listing';
import { X } from 'lucide-react';

// Common car makes in NZ
const MAKES = [
  'Toyota',
  'Honda',
  'Mazda',
  'Nissan',
  'Subaru',
  'Mitsubishi',
  'Ford',
  'Holden',
  'Suzuki',
  'Hyundai',
  'Kia',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: ListingFilters = {
    make: searchParams.get('make') || undefined,
    minPrice: searchParams.get('minPrice')
      ? parseInt(searchParams.get('minPrice')!)
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? parseInt(searchParams.get('maxPrice')!)
      : undefined,
    minYear: searchParams.get('minYear')
      ? parseInt(searchParams.get('minYear')!)
      : undefined,
    maxYear: searchParams.get('maxYear')
      ? parseInt(searchParams.get('maxYear')!)
      : undefined,
    maxMileage: searchParams.get('maxMileage')
      ? parseInt(searchParams.get('maxMileage')!)
      : undefined,
    priceDropped: searchParams.get('priceDropped') === 'true',
  };

  const updateFilter = useCallback(
    (key: keyof ListingFilters, value: string | number | boolean | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === '' || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      // Reset to page 1 when filters change
      params.delete('page');

      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const hasFilters =
    filters.make ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minYear ||
    filters.maxYear ||
    filters.maxMileage ||
    filters.priceDropped;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Make */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Make</label>
          <Select
            value={filters.make || 'all'}
            onValueChange={(v) => updateFilter('make', v === 'all' ? undefined : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All makes</SelectItem>
              {MAKES.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Price Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) =>
                updateFilter(
                  'minPrice',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                updateFilter(
                  'maxPrice',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Year</label>
          <div className="flex gap-2">
            <Select
              value={filters.minYear?.toString() || 'any'}
              onValueChange={(v) =>
                updateFilter('minYear', v === 'any' ? undefined : parseInt(v))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.maxYear?.toString() || 'any'}
              onValueChange={(v) =>
                updateFilter('maxYear', v === 'any' ? undefined : parseInt(v))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Max Mileage */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Max Mileage</label>
          <Select
            value={filters.maxMileage?.toString() || 'any'}
            onValueChange={(v) =>
              updateFilter('maxMileage', v === 'any' ? undefined : parseInt(v))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any mileage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any mileage</SelectItem>
              <SelectItem value="50000">Under 50,000 km</SelectItem>
              <SelectItem value="100000">Under 100,000 km</SelectItem>
              <SelectItem value="150000">Under 150,000 km</SelectItem>
              <SelectItem value="200000">Under 200,000 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Dropped Filter */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="priceDropped"
            checked={filters.priceDropped}
            onCheckedChange={(checked) =>
              updateFilter('priceDropped', checked === true)
            }
          />
          <label htmlFor="priceDropped" className="text-sm cursor-pointer">
            Price dropped only
          </label>
        </div>
      </div>
    </div>
  );
}
