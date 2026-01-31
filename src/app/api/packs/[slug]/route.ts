import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/packs/[slug] - Get public pack (no auth required)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Get public collection by slug
    const { data: collection, error: collectionError } = await supabase
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

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Increment view count (fire and forget)
    supabase.rpc('increment_collection_views', { p_collection_id: collection.id }).then(() => {});

    // Get items in collection
    const { data: collectionItems, error: itemsError } = await supabase
      .from('collection_items')
      .select(`
        added_at,
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

    if (itemsError) {
      console.error('Error fetching pack items:', itemsError);
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }

    const items = collectionItems?.map(ci => ci.item).filter(Boolean) || [];
    const totalValue = (items as Array<{ price_value?: number }>).reduce((sum, item) => {
      return sum + (item?.price_value || 0);
    }, 0);

    // Get author display name (first part of email)
    const authorEmail = (collection.user as { email?: string })?.email || '';
    const authorName = authorEmail.split('@')[0] || 'anonymous';

    return NextResponse.json({
      pack: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        color: collection.color,
        icon: collection.icon,
        cover_image_url: collection.cover_image_url,
        views_count: (collection.views_count || 0) + 1, // Include current view
        clones_count: collection.clones_count || 0,
        created_at: collection.created_at,
        published_at: collection.published_at,
        author: authorName,
        items,
        item_count: items.length,
        total_value: totalValue,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/packs/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
