import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SyncRequest, SyncResponse, ExtensionListing, SUBSCRIPTION_LIMITS } from '@/types/listing';

// POST /api/listings/sync - Bulk sync listings from extension
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth (via session or API token)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no session, check for API token in Authorization header
    let userId = user?.id;

    if (!userId) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // TODO: Verify token hash against api_tokens table
        // For now, return unauthorized
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    const tier = userData?.subscription_tier || 'free';
    const limits = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS];

    // Parse request body
    const body: SyncRequest = await request.json();
    const { listings: incomingListings, syncMode = 'merge' } = body;

    if (!Array.isArray(incomingListings)) {
      return NextResponse.json({ error: 'Invalid request: listings must be an array' }, { status: 400 });
    }

    // Get current listing count
    const { count: currentCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_deleted', false);

    // Start sync log
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        user_id: userId,
        items_synced: 0,
        items_failed: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    const response: SyncResponse = {
      success: true,
      synced: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      priceChanges: [],
    };

    // Get existing listings for this user
    const existingIds = incomingListings.map(l => l.id);
    const { data: existingListings } = await supabase
      .from('listings')
      .select('id, external_id, current_price, original_price')
      .eq('user_id', userId)
      .in('external_id', existingIds);

    const existingMap = new Map(
      (existingListings || []).map(l => [l.external_id, l])
    );

    // Process each listing
    for (const incoming of incomingListings) {
      try {
        const existing = existingMap.get(incoming.id);

        if (existing) {
          // Update existing listing
          const priceChanged = existing.current_price !== incoming.price;

          const { error: updateError } = await supabase
            .from('listings')
            .update({
              title: incoming.title,
              current_price: incoming.price,
              year: incoming.year,
              mileage: incoming.mileage,
              make: incoming.make,
              model: incoming.model,
              location: incoming.location,
              image_url: incoming.imageUrl,
              price_dropped: incoming.price < (existing.original_price || existing.current_price),
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error('Error updating listing:', updateError);
            response.skipped++;
            continue;
          }

          // Record price change
          if (priceChanged) {
            await supabase.from('price_history').insert({
              listing_id: existing.id,
              price: incoming.price,
              source: 'sync',
            });

            response.priceChanges.push({
              listingId: existing.id,
              oldPrice: existing.current_price,
              newPrice: incoming.price,
            });
          }

          response.updated++;
          response.synced++;
        } else {
          // Check if we can add more listings
          const totalAfterAdd = (currentCount || 0) + response.created;
          if (totalAfterAdd >= limits.maxListings) {
            response.skipped++;
            continue;
          }

          // Create new listing
          const { data: newListing, error: insertError } = await supabase
            .from('listings')
            .insert({
              user_id: userId,
              external_id: incoming.id,
              url: incoming.url,
              title: incoming.title,
              price: incoming.price || 0,
              year: incoming.year,
              mileage: incoming.mileage,
              make: incoming.make,
              model: incoming.model,
              location: incoming.location,
              image_url: incoming.imageUrl,
              platform: 'trademe', // TODO: detect from URL
              current_price: incoming.price || 0,
              original_price: incoming.price || 0,
              price_dropped: false,
              saved_at: incoming.savedAt || new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting listing:', insertError);
            response.skipped++;
            continue;
          }

          // Record initial price
          if (newListing) {
            await supabase.from('price_history').insert({
              listing_id: newListing.id,
              price: incoming.price || 0,
              source: 'sync',
            });
          }

          response.created++;
          response.synced++;
        }
      } catch (err) {
        console.error('Error processing listing:', err);
        response.skipped++;
      }
    }

    // Update sync log
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          items_synced: response.synced,
          items_failed: response.skipped,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncLog.id);
    }

    // Update user's last_sync_at
    await supabase
      .from('users')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', userId);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/listings/sync:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
