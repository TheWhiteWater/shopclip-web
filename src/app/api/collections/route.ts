import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/collections - List user's collections
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: collections, error } = await supabase
      .from('collections')
      .select(`
        *,
        items:collection_items(count),
        total_value:collection_items(
          item:items(price_value)
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching collections:', error);
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }

    // Calculate totals for each collection
    const collectionsWithTotals = collections?.map(collection => {
      const itemCount = (collection.items as Array<{ count: number }>)?.[0]?.count || 0;
      const priceItems = collection.total_value as Array<{ item: { price_value?: number } }> || [];
      const totalValue = priceItems.reduce((sum, ci) => {
        return sum + (ci.item?.price_value || 0);
      }, 0);

      const { items: _items, total_value: _tv, ...rest } = collection;
      return {
        ...rest,
        item_count: itemCount,
        total_value: totalValue,
      };
    }) || [];

    return NextResponse.json({ collections: collectionsWithTotals });
  } catch (error) {
    console.error('Error in GET /api/collections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/collections - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color, icon, is_public } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate slug if making public
    let slug = null;
    if (is_public) {
      const { data: slugData } = await supabase.rpc('generate_collection_slug', { p_name: name });
      slug = slugData;
    }

    const { data: collection, error } = await supabase
      .from('collections')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#4F46E5',
        icon: icon || '📦',
        is_public: is_public || false,
        slug,
        published_at: is_public ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating collection:', error);
      return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
    }

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/collections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
