import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { Filter, SlidersHorizontal, GitCompare } from 'lucide-react';
import Link from 'next/link';

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const sort = (params.sort as string) || 'savedAt';
  const order = (params.order as string) || 'desc';

  return (
    <div className="flex gap-6">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border p-4 sticky top-20">
          <FilterPanel />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <Suspense fallback={null}>
                    <FilterPanel />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <SortSelect currentSort={sort} currentOrder={order} />
            </div>
          </div>

          {/* Compare Button */}
          <Link href="/dashboard/compare">
            <Button variant="outline" size="sm">
              <GitCompare className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <Suspense fallback={<ListingsGridSkeleton />}>
          <ListingsGrid />
        </Suspense>
      </div>
    </div>
  );
}

function SortSelect({
  currentSort,
  currentOrder,
}: {
  currentSort: string;
  currentOrder: string;
}) {
  const sortValue = `${currentSort}_${currentOrder}`;

  return (
    <Select defaultValue={sortValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="savedAt_desc">Newest first</SelectItem>
        <SelectItem value="savedAt_asc">Oldest first</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="year_desc">Year: Newest</SelectItem>
        <SelectItem value="year_asc">Year: Oldest</SelectItem>
        <SelectItem value="mileage_asc">Mileage: Low to High</SelectItem>
        <SelectItem value="mileage_desc">Mileage: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ListingsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border overflow-hidden animate-pulse"
        >
          <div className="aspect-[16/10] bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
