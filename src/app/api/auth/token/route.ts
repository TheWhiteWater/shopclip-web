import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// In-memory store for pending extension auth states
// In production, consider using Redis or database for multi-instance support
const pendingStates = new Map<
  string,
  { userId: string; token: string; expiresAt: number }
>();

// Clean up expired states periodically
function cleanupExpiredStates() {
  const now = Date.now();
  for (const [state, data] of pendingStates.entries()) {
    if (data.expiresAt < now) {
      pendingStates.delete(state);
    }
  }
}

// POST: Generate token for authenticated user with state parameter
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { state } = await request.json();

    if (!state || typeof state !== 'string' || state.length < 16) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    // Generate a secure API token for the extension
    const token = randomBytes(32).toString('hex');

    // Store the token in the database for the user
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from('users')
      .update({
        extension_token: token,
        extension_token_created_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to store extension token:', updateError);
      return NextResponse.json(
        { error: 'Failed to generate token' },
        { status: 500 }
      );
    }

    // Store pending state for extension polling (expires in 5 minutes)
    pendingStates.set(state, {
      userId: user.id,
      token,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Cleanup old states
    cleanupExpiredStates();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Check if token is ready for a given state (for extension polling)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter required' },
        { status: 400 }
      );
    }

    // Cleanup expired states
    cleanupExpiredStates();

    const pendingAuth = pendingStates.get(state);

    if (!pendingAuth) {
      return NextResponse.json({ ready: false });
    }

    // Check if expired
    if (pendingAuth.expiresAt < Date.now()) {
      pendingStates.delete(state);
      return NextResponse.json({ ready: false, expired: true });
    }

    // Return the token and remove from pending states
    pendingStates.delete(state);

    return NextResponse.json({
      ready: true,
      token: pendingAuth.token,
      userId: pendingAuth.userId,
    });
  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
