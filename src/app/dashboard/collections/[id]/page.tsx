'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Loader2,
  Globe,
  Lock,
  Share2,
  ExternalLink,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatPrice } from '@/lib/format';

interface CollectionItem {
  id: string;
  title: string;
  price: string;
  price_value: number;
  currency: string;
  image_url: string | null;
  url: string;
  platform: string;
  location: string | null;
  condition: string | null;
}

interface CollectionDetail {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  is_public: boolean;
  slug: string | null;
  items: CollectionItem[];
  item_count: number;
  total_value: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCollection = useCallback(async () => {
    try {
      const res = await fetch(`/api/collections/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Collection not found');
        }
        throw new Error('Failed to fetch collection');
      }
      const data = await res.json();
      setCollection(data.collection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item from the collection?')) {
      return;
    }

    try {
      const res = await fetch(`/api/collections/${id}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to remove item');
      }
      fetchCollection();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const handleCopyLink = async () => {
    if (collection?.slug) {
      const url = `${window.location.origin}/p/${collection.slug}`;
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Collection not found'}</p>
        <Link href="/dashboard/collections">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link
            href="/dashboard/collections"
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{collection.icon}</span>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {collection.name}
                {collection.is_public ? (
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Private
                  </Badge>
                )}
              </h1>
              {collection.description && (
                <p className="text-slate-500">{collection.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {collection.is_public && collection.slug && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link href={`/p/${collection.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-6 p-4 bg-white rounded-lg border">
        <div>
          <div className="text-2xl font-bold">{collection.item_count}</div>
          <div className="text-sm text-slate-500">Items</div>
        </div>
        {collection.total_value > 0 && (
          <div>
            <div className="text-2xl font-bold">{formatPrice(collection.total_value)}</div>
            <div className="text-sm text-slate-500">Total Value</div>
          </div>
        )}
      </div>

      {/* Items Grid */}
      {collection.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-slate-500 mb-4">No items in this collection yet</p>
          <p className="text-sm text-slate-400">
            Use the browser extension to save items to this collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collection.items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-[16/10] bg-slate-100">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 font-bold">
                    {item.price}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate" title={item.title}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      {item.location && <span>{item.location}</span>}
                      {item.condition && <span>{item.condition}</span>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Original
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
