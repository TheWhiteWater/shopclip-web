import { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, LayoutDashboard, GitCompare, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span className="font-bold">ShopClip</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Items
              </Button>
            </Link>
            <Link href="/dashboard/compare">
              <Button variant="ghost" size="sm" className="gap-2">
                <GitCompare className="h-4 w-4" />
                Compare
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 hidden sm:block">
              Free Plan
            </span>
            <Link href="/pricing">
              <Button size="sm" variant="outline">
                Upgrade
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
