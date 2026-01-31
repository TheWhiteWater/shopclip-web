import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/collections/[id]/items - Add item(s) to collection
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: collectionId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify collection ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .single();

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const body = await request.json();
    const { item_ids } = body;

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return NextResponse.json({ error: 'item_ids array is required' }, { status: 400 });
    }

    // Verify items belong to user
    const { data: userItems } = await supabase
      .from('items')
      .select('id')
      .eq('user_id', user.id)
      .in('id', item_ids);

    const validItemIds = userItems?.map(i => i.id) || [];

    if (validItemIds.length === 0) {
      return NextResponse.json({ error: 'No valid items found' }, { status: 400 });
    }

    // Add items to collection (ignore duplicates)
    const insertData = validItemIds.map(itemId => ({
      collection_id: collectionId,
      item_id: itemId,
    }));

    const { error } = await supabase
      .from('collection_items')
      .upsert(insertData, { onConflict: 'collection_id,item_id' });

    if (error) {
      console.error('Error adding items to collection:', error);
      return NextResponse.json({ error: 'Failed to add items' }, { status: 500 });
    }

    // Update collection cover image from first item if not set
    const { data: firstItem } = await supabase
      .from('collection_items')
      .select('item:items(image_url)')
      .eq('collection_id', collectionId)
      .order('added_at', { ascending: true })
      .limit(1)
      .single();

    if (firstItem?.item) {
      await supabase
        .from('collections')
        .update({ cover_image_url: (firstItem.item as { image_url?: string }).image_url })
        .eq('id', collectionId)
        .is('cover_image_url', null);
    }

    return NextResponse.json({
      success: true,
      added_count: validItemIds.length,
    });
  } catch (error) {
    console.error('Error in POST /api/collections/[id]/items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/collections/[id]/items - Remove item(s) from collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: collectionId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify collection ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('id')
      .eq('id', collectionId)
      .eq('user_id', user.id)
      .single();

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const body = await request.json();
    const { item_ids } = body;

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return NextResponse.json({ error: 'item_ids array is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .in('item_id', item_ids);

    if (error) {
      console.error('Error removing items from collection:', error);
      return NextResponse.json({ error: 'Failed to remove items' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      removed_count: item_ids.length,
    });
  } catch (error) {
    console.error('Error in DELETE /api/collections/[id]/items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
