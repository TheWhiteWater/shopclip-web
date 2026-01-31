import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/collections/[id] - Get collection with items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Get items in collection
    const { data: collectionItems, error: itemsError } = await supabase
      .from('collection_items')
      .select(`
        added_at,
        item:items(*)
      `)
      .eq('collection_id', id)
      .order('added_at', { ascending: false });

    if (itemsError) {
      console.error('Error fetching collection items:', itemsError);
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }

    // Calculate total
    const items = collectionItems?.map(ci => ci.item).filter(Boolean) || [];
    const totalValue = (items as Array<{ price_value?: number }>).reduce((sum, item) => {
      return sum + (item?.price_value || 0);
    }, 0);

    return NextResponse.json({
      collection: {
        ...collection,
        items,
        item_count: items.length,
        total_value: totalValue,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/collections/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/collections/[id] - Update collection
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color, icon, is_public } = body;

    // Check ownership
    const { data: existing } = await supabase
      .from('collections')
      .select('id, slug, is_public')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Generate slug if making public for the first time
    let slug = existing.slug;
    let published_at = undefined;
    if (is_public && !existing.is_public) {
      const { data: slugData } = await supabase.rpc('generate_collection_slug', { p_name: name || 'collection' });
      slug = slugData;
      published_at = new Date().toISOString();
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;
    if (is_public !== undefined) {
      updates.is_public = is_public;
      updates.slug = is_public ? slug : null;
      if (published_at) updates.published_at = published_at;
    }

    const { data: collection, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collection:', error);
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    console.error('Error in PUT /api/collections/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/collections/[id] - Delete collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting collection:', error);
      return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/collections/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
