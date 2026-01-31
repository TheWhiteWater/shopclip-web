import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email?: string;
}

/**
 * Get authenticated user from either:
 * 1. Supabase session (web app)
 * 2. Extension token (Bearer header)
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // Check Bearer token first (extension)
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return await getUserByExtensionToken(token);
  }

  // Fallback to Supabase session (web app)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return { id: user.id, email: user.email };
  }

  return null;
}

/**
 * Validate extension token and get user
 */
async function getUserByExtensionToken(token: string): Promise<AuthUser | null> {
  if (!token || token.length < 32) {
    return null;
  }

  try {
    const adminClient = createAdminClient();
    const { data: user, error } = await adminClient
      .from('users')
      .select('id, email')
      .eq('extension_token', token)
      .single();

    if (error || !user) {
      return null;
    }

    // Optional: Check token age (e.g., expire after 30 days)
    // const { data: userData } = await adminClient
    //   .from('users')
    //   .select('extension_token_created_at')
    //   .eq('id', user.id)
    //   .single();
    //
    // if (userData?.extension_token_created_at) {
    //   const createdAt = new Date(userData.extension_token_created_at);
    //   const now = new Date();
    //   const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    //   if (daysSinceCreation > 30) return null;
    // }

    return { id: user.id, email: user.email };
  } catch (e) {
    console.error('Extension token validation error:', e);
    return null;
  }
}
