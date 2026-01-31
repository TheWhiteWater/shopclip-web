import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>;
}

// DELETE /api/collections/[id]/items/[itemId] - Remove item from collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, itemId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify collection ownership
    const { data: collection } = await supabase
      .from('collections')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Remove item from collection
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', id)
      .eq('item_id', itemId);

    if (error) {
      console.error('Error removing item from collection:', error);
      return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/collections/[id]/items/[itemId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
