import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, RefreshCw, Trash2, CreditCard, AlertTriangle } from 'lucide-react';
import { SubscriptionTier } from '@/types/listing';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  // Mock data - will come from Supabase
  const user: { email: string; tier: SubscriptionTier; listingCount: number; listingLimit: number } = {
    email: 'user@example.com',
    tier: 'free',
    listingCount: 8,
    listingLimit: 25,
  };

  const apiToken = {
    id: '1',
    name: 'Chrome Extension',
    lastUsed: '2 hours ago',
    createdAt: 'Jan 15, 2026',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={user.email} disabled className="mt-1.5" />
          </div>

          <div>
            <label className="text-sm font-medium">Plan</label>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge variant={user.tier === 'pro' ? 'default' : 'secondary'}>
                {user.tier === 'pro' ? 'Pro' : 'Free'}
              </Badge>
              <span className="text-sm text-slate-500">
                {user.listingCount} / {user.listingLimit} listings used
              </span>
              {user.tier === 'free' && (
                <Button size="sm" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Tokens
          </CardTitle>
          <CardDescription>
            Tokens are used by the Chrome extension to sync your listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Existing Token */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{apiToken.name}</p>
                <p className="text-sm text-slate-500">
                  Last used: {apiToken.lastUsed} · Created: {apiToken.createdAt}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Token Security</p>
                <p className="text-amber-700 mt-1">
                  Tokens are shown only once when created. If you lose your
                  token, you&apos;ll need to generate a new one.
                </p>
              </div>
            </div>
          </div>

          <Button className="mt-4">
            <Key className="h-4 w-4 mr-2" />
            Generate New Token
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-slate-500">
                Permanently delete your account and all your data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
