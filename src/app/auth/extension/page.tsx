'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

function ExtensionAuthContent() {
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenReady, setTokenReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user && state) {
        try {
          const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state }),
          });

          if (response.ok) {
            setTokenReady(true);
          } else {
            const data = await response.json();
            setError(data.error || 'Failed to generate token');
          }
        } catch {
          setError('Failed to connect to server');
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);

          if (state) {
            try {
              const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state }),
              });

              if (response.ok) {
                setTokenReady(true);
              } else {
                const data = await response.json();
                setError(data.error || 'Failed to generate token');
              }
            } catch {
              setError('Failed to connect to server');
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [state]);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const redirectUrl = `${window.location.origin}/auth/extension${state ? `?state=${state}` : ''}`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
      },
    });
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!state) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Invalid Request</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-600">
            This page should be opened from the CarScout extension.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (user && tokenReady) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Successfully Connected!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-600 mb-2">
            Signed in as <strong>{user.email}</strong>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            You can now close this window and return to the extension.
          </p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              The extension will automatically detect your login.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Car className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">CarScout</span>
        </div>
        <CardTitle>Connect Extension</CardTitle>
        <p className="text-sm text-slate-500 mt-2">
          Sign in to connect your CarScout extension
        </p>
      </CardHeader>

      <CardContent>
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <p className="text-xs text-slate-500 text-center mt-6">
          Your CarScout account will be linked to the browser extension.
        </p>
      </CardContent>
    </Card>
  );
}

export default function ExtensionAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      }>
        <ExtensionAuthContent />
      </Suspense>
    </div>
  );
}
