import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST /api/packs/[slug]/clone - Clone a public pack (auth required)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the public collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', slug)
      .eq('is_public', true)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Clone using the database function
    const { data: newCollectionId, error: cloneError } = await supabase.rpc('clone_collection', {
      p_collection_id: collection.id,
      p_new_user_id: user.id,
    });

    if (cloneError) {
      console.error('Error cloning pack:', cloneError);
      return NextResponse.json({ error: 'Failed to clone pack' }, { status: 500 });
    }

    // Get the new collection
    const { data: newCollection, error: fetchError } = await supabase
      .from('collections')
      .select('*')
      .eq('id', newCollectionId)
      .single();

    if (fetchError) {
      console.error('Error fetching cloned collection:', fetchError);
      return NextResponse.json({ error: 'Pack cloned but failed to fetch' }, { status: 500 });
    }

    // Count items in new collection
    const { count: itemCount } = await supabase
      .from('collection_items')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', newCollectionId);

    return NextResponse.json({
      success: true,
      collection: {
        ...newCollection,
        item_count: itemCount || 0,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/packs/[slug]/clone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
