'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Share2, Trash2, Edit, ExternalLink, Globe, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  is_public: boolean;
  slug: string | null;
  item_count: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onEdit?: (collection: Collection) => void;
}

export function CollectionCard({ collection, onDelete, onEdit }: CollectionCardProps) {
  const shareUrl = collection.slug ? `${window.location.origin}/p/${collection.slug}` : null;

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <div
        className="h-2"
        style={{ backgroundColor: collection.color }}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/dashboard/collections/${collection.id}`}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{collection.icon}</span>
              <h3 className="font-semibold truncate">{collection.name}</h3>
            </div>
            {collection.description && (
              <p className="text-sm text-slate-500 truncate mb-3">
                {collection.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{collection.item_count} items</span>
              {collection.total_value > 0 && (
                <span className="font-medium text-slate-700">
                  {formatPrice(collection.total_value)}
                </span>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-1">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(collection)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {shareUrl && (
                  <>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/p/${collection.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public Page
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(collection.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
