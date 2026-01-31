import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth/extension';
import { ListingFilters, CarListing, SUBSCRIPTION_LIMITS } from '@/types/listing';

// GET /api/listings - List user's listings with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth (supports both session and extension token)
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const filters: ListingFilters = {
      platform: searchParams.get('platform') as ListingFilters['platform'],
      make: searchParams.get('make') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      minYear: searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined,
      maxYear: searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined,
      maxMileage: searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage')!) : undefined,
      priceDropped: searchParams.get('priceDropped') === 'true',
      sort: (searchParams.get('sort') as ListingFilters['sort']) || 'savedAt',
      order: (searchParams.get('order') as ListingFilters['order']) || 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    // Build query
    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    // Apply filters
    if (filters.platform) {
      query = query.eq('platform', filters.platform);
    }
    if (filters.make) {
      query = query.ilike('make', filters.make);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('current_price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('current_price', filters.maxPrice);
    }
    if (filters.minYear !== undefined) {
      query = query.gte('year', filters.minYear);
    }
    if (filters.maxYear !== undefined) {
      query = query.lte('year', filters.maxYear);
    }
    if (filters.maxMileage !== undefined) {
      query = query.lte('mileage', filters.maxMileage);
    }
    if (filters.priceDropped) {
      query = query.eq('price_dropped', true);
    }

    // Apply sorting
    const sortColumn = filters.sort === 'savedAt' ? 'saved_at' :
                       filters.sort === 'price' ? 'current_price' :
                       filters.sort || 'saved_at';
    query = query.order(sortColumn, { ascending: filters.order === 'asc' });

    // Apply pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: listings, count, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }

    return NextResponse.json({
      listings: listings || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/listings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/listings - Create a single listing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth (supports both session and extension token)
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription tier
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = userData?.subscription_tier || 'free';
    const limits = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS];

    // Check listing count
    const { count: currentCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if ((currentCount || 0) >= limits.maxListings) {
      return NextResponse.json({
        error: 'Listing limit reached',
        code: 'LIMIT_EXCEEDED',
        limit: limits.maxListings,
        current: currentCount,
      }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const listing: Partial<CarListing> = {
      user_id: user.id,
      external_id: body.external_id || body.id,
      url: body.url,
      title: body.title,
      price: body.price || 0,
      year: body.year,
      mileage: body.mileage,
      make: body.make,
      model: body.model,
      location: body.location,
      image_url: body.image_url || body.imageUrl,
      platform: body.platform || 'trademe',
      current_price: body.price || 0,
      original_price: body.price || 0,
      price_dropped: false,
      saved_at: body.saved_at || body.savedAt || new Date().toISOString(),
    };

    // Upsert (update if exists, insert if not)
    const { data, error } = await supabase
      .from('listings')
      .upsert(
        listing,
        { onConflict: 'user_id,external_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
    }

    return NextResponse.json({ listing: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/listings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
