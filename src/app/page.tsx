import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHomePageJsonLd, getFaqJsonLd } from '@/lib/seo';
import {
  ShoppingBag,
  Search,
  TrendingDown,
  BarChart3,
  Chrome,
  Globe,
  Layers,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomePageJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd()),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">ShopClip</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm hover:text-blue-600">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm hover:text-blue-600">
                How It Works
              </Link>
              <Link href="/pricing" className="text-sm hover:text-blue-600">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm hover:text-blue-600">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            Works on Facebook Marketplace, Amazon, eBay, IKEA & any site
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Shopping Clipboard
            <br />
            <span className="text-blue-600">For The Entire Internet</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Like Pinterest — but for actual shopping. Save products from any website,
            organize into collections, compare side-by-side, and track prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener"
            >
              <Button size="lg" className="gap-2">
                <Chrome className="h-5 w-5" />
                Install Free Extension
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Open Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Works on Chrome, Edge, Brave, Opera & all Chromium browsers
          </p>
        </section>

        {/* Supported Platforms */}
        <section className="container mx-auto px-4 py-12">
          <p className="text-center text-sm text-slate-500 mb-6">Works with your favorite shopping sites</p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            <span className="font-semibold">Facebook Marketplace</span>
            <span className="font-semibold">Amazon</span>
            <span className="font-semibold">eBay</span>
            <span className="font-semibold">IKEA</span>
            <span className="font-semibold">Etsy</span>
            <span className="font-semibold">+ Any website</span>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Your Personal Shopping Assistant
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Stop managing 50 browser tabs. Save products from anywhere, organize them your way.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Layers className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Cross-Platform Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Found a sofa on FB Marketplace AND IKEA? Compare them side-by-side.
                  ShopClip works on any shopping website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>One-Click Save</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Browse any shopping site. Click the ShopClip button to save.
                  No copying URLs, no screenshots, no spreadsheets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingDown className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Track Price Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Re-save items to track prices over time. Know when something
                  drops in price so you can make your move.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Works Globally</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  US, UK, EU, Australia, NZ — ShopClip works on shopping sites
                  worldwide. Same tool, any country.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Smart Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Organize into collections: "Living Room", "Gift Ideas", "Wish List".
                  Filter by price, sort by date, find what you need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Share2 className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Share With Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get a second opinion. Share your saved items with friends or family.
                  Perfect for group decisions on big purchases.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Install Extension</h3>
                <p className="text-slate-600 text-sm">
                  Add ShopClip to your browser. Works on Chrome, Edge, Brave,
                  and all Chromium browsers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Save From Anywhere</h3>
                <p className="text-slate-600 text-sm">
                  Browse Facebook Marketplace, Amazon, IKEA, eBay — click
                  &quot;Save to ShopClip&quot; on any product.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Compare & Decide</h3>
                <p className="text-slate-600 text-sm">
                  Open your dashboard to filter, sort, and compare items from
                  all platforms in one view.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Start free. Upgrade when you need more.
          </p>

          {/* Free Start */}
          <Card className="max-w-md mx-auto mb-8 border-green-200 bg-green-50/50">
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-2 bg-green-600">Free Forever</Badge>
              <CardTitle>Unlimited Saves</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold mb-2">$0</p>
              <p className="text-sm text-slate-600 mb-4">
                Save unlimited items, basic collections, compare side-by-side
              </p>
              <Link href="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Features */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="border-blue-600 border-2">
              <CardHeader className="text-center">
                <Badge className="w-fit mx-auto mb-2">Pro</Badge>
                <CardTitle>Price Tracking</CardTitle>
                <p className="text-2xl font-bold">$4.99/mo</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>✓ Price drop alerts</li>
                  <li>✓ Price history charts</li>
                  <li>✓ Export to CSV/PDF</li>
                  <li>✓ Unlimited collections</li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-4">Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Team</CardTitle>
                <p className="text-2xl font-bold">$9.99/mo</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Share collections</li>
                  <li>✓ Comments & reactions</li>
                  <li>✓ Up to 5 team members</li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-4" variant="outline">
                    Start Team Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  What websites does ShopClip work with?
                </h3>
                <p className="text-slate-600 text-sm">
                  ShopClip works on virtually any shopping website including
                  Facebook Marketplace, Amazon, eBay, IKEA, Etsy, Craigslist,
                  and thousands more. If it has a product page, ShopClip can save it.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  Is ShopClip free to use?
                </h3>
                <p className="text-slate-600 text-sm">
                  Yes! ShopClip is free forever for unlimited saves and basic features.
                  Pro features like price tracking and alerts are $4.99/month.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  Can I compare items from different websites?
                </h3>
                <p className="text-slate-600 text-sm">
                  Absolutely! That&apos;s ShopClip&apos;s superpower. Found a coffee table on
                  Facebook Marketplace and another on IKEA? Save both and compare
                  them side-by-side in your dashboard.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  How does price tracking work?
                </h3>
                <p className="text-slate-600 text-sm">
                  With Pro, ShopClip monitors your saved items and notifies you
                  when prices drop. You&apos;ll see price history charts so you know
                  the best time to buy.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  Which browsers are supported?
                </h3>
                <p className="text-slate-600 text-sm">
                  ShopClip works on all Chromium-based browsers: Chrome, Edge,
                  Brave, Opera, Arc, and Vivaldi. Firefox and Safari coming soon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shop Smarter?
          </h2>
          <p className="text-slate-600 mb-8">
            Join thousands of smart shoppers using ShopClip to save time and money.
          </p>
          <Link href="/login">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">ShopClip</span>
              </div>
              <nav className="flex gap-6 text-sm text-slate-600">
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
                <Link href="mailto:support@shopclip.app" className="hover:text-blue-600">
                  Contact
                </Link>
              </nav>
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} ShopClip. A{' '}
                <Link href="https://brainops.dev" target="_blank" rel="noopener" className="hover:text-blue-600 underline">
                  BrainOps
                </Link>{' '}
                product.
              </p>
            </div>
            <p className="text-xs text-slate-400 text-center mt-8">
              ShopClip is a user-initiated productivity tool. We help you save what you&apos;re
              already viewing in your browser — like Grammarly for text or Honey for coupons.
              We store only your personal browsing data and delete it when you close your account.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
