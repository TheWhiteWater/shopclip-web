import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Copy, ExternalLink, Eye, Users } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { ClonePackButton } from './ClonePackButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PackItem {
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

async function getPack(slug: string) {
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from('collections')
    .select(`
      id,
      name,
      slug,
      description,
      color,
      icon,
      cover_image_url,
      views_count,
      clones_count,
      created_at,
      published_at,
      user:users(email)
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error || !collection) {
    return null;
  }

  // Get items
  const { data: collectionItems } = await supabase
    .from('collection_items')
    .select(`
      item:items(
        id,
        title,
        price,
        price_value,
        currency,
        image_url,
        url,
        platform,
        location,
        condition
      )
    `)
    .eq('collection_id', collection.id)
    .order('added_at', { ascending: false });

  const items = (collectionItems?.map(ci => ci.item).flat().filter(Boolean) || []) as unknown as PackItem[];
  const totalValue = items.reduce(
    (sum, item) => sum + (item?.price_value || 0),
    0
  );

  const authorEmail = (collection.user as { email?: string })?.email || '';
  const authorName = authorEmail.split('@')[0] || 'anonymous';

  // Increment views (fire and forget)
  supabase.rpc('increment_collection_views', { p_collection_id: collection.id }).then(() => {});

  return {
    ...collection,
    author: authorName,
    items,
    item_count: items.length,
    total_value: totalValue,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pack = await getPack(slug);

  if (!pack) {
    return {
      title: 'Pack Not Found',
    };
  }

  const title = `${pack.icon} ${pack.name} | Grabbit Pack`;
  const description = pack.description
    || `${pack.item_count} items worth ${formatPrice(pack.total_value)} curated by ${pack.author}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.grabbitapp.com/p/${slug}`,
      images: pack.cover_image_url ? [{ url: pack.cover_image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: pack.cover_image_url ? [pack.cover_image_url] : [],
    },
  };
}

export default async function PackPage({ params }: PageProps) {
  const { slug } = await params;
  const pack = await getPack(slug);

  if (!pack) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span className="font-bold">Grabbit</span>
          </Link>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Pack Header */}
      <div
        className="py-12"
        style={{ backgroundColor: `${pack.color}15` }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: pack.color }}
            >
              {pack.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{pack.name}</h1>
              {pack.description && (
                <p className="text-lg text-slate-600 mb-4">{pack.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span>by <strong>{pack.author}</strong></span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {(pack.views_count || 0) + 1} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {pack.clones_count || 0} clones
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ClonePackButton slug={slug} />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Copy className="h-4 w-4 mr-2" />
                  Share
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold">{pack.item_count}</div>
              <div className="text-sm text-slate-500">Items</div>
            </div>
            {pack.total_value > 0 && (
              <div>
                <div className="text-2xl font-bold">{formatPrice(pack.total_value)}</div>
                <div className="text-sm text-slate-500">Total Value</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="container mx-auto px-4 py-8">
        {pack.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-slate-500">This pack is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(pack.items as PackItem[]).map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  <h3 className="font-medium text-sm truncate mb-1" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.location}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Create your own packs with Grabbit
          </h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            Save products from any website, organize them into collections, and share with friends.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
