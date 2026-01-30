import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_LIMITS } from '@/types/listing';

// GET /api/export - Export listings as CSV
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription tier (export is Pro only)
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = userData?.subscription_tier || 'free';
    const limits = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS];

    if (!limits.canExport) {
      return NextResponse.json({
        error: 'Export is a Pro feature',
        code: 'UPGRADE_REQUIRED',
      }, { status: 403 });
    }

    // Parse filters from query params
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const make = searchParams.get('make');

    // Fetch listings (max 1000 for export)
    let query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false)
      .order('saved_at', { ascending: false })
      .limit(1000);

    if (platform) {
      query = query.eq('platform', platform);
    }
    if (make) {
      query = query.ilike('make', make);
    }

    const { data: listings, error } = await query;

    if (error) {
      console.error('Error fetching listings for export:', error);
      return NextResponse.json({ error: 'Failed to export listings' }, { status: 500 });
    }

    if (!listings || listings.length === 0) {
      return NextResponse.json({ error: 'No listings to export' }, { status: 404 });
    }

    // Generate CSV
    const headers = [
      'Title',
      'Price',
      'Original Price',
      'Year',
      'Mileage',
      'Make',
      'Model',
      'Location',
      'URL',
      'Saved At',
      'Price Dropped',
    ];

    const rows = listings.map(listing => [
      escapeCSV(listing.title),
      listing.current_price || '',
      listing.original_price || '',
      listing.year || '',
      listing.mileage || '',
      escapeCSV(listing.make || ''),
      escapeCSV(listing.model || ''),
      escapeCSV(listing.location || ''),
      listing.url,
      listing.saved_at,
      listing.price_dropped ? 'Yes' : 'No',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Return CSV file
    const filename = `grabbit-export-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Escape CSV value
function escapeCSV(value: string): string {
  if (!value) return '';
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
