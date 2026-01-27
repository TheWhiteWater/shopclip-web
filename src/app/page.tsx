import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHomePageJsonLd, getFaqJsonLd } from '@/lib/seo';
import {
  Car,
  Search,
  TrendingDown,
  BarChart3,
  Chrome,
  CheckCircle2,
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
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">CarScout</span>
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
            Now supporting TradeMe Motors
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Compare Car Listings
            <br />
            <span className="text-blue-600">Across New Zealand</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Save car listings from TradeMe with one click. Compare prices,
            track changes, and find your perfect vehicle — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener"
            >
              <Button size="lg" className="gap-2">
                <Chrome className="h-5 w-5" />
                Install Chrome Extension
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Open Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Free to use. No credit card required.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Compare Cars
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>One-Click Save</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Browse TradeMe as usual. Click &quot;Save to CarScout&quot; on any
                  listing to add it to your comparison list.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Side-by-Side Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Compare up to 4 cars at once. See price, mileage, year, and
                  location in a clear comparison view.
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
                  Re-save listings to track price changes. Get notified when
                  prices drop on cars you&apos;re watching.
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
                  Add CarScout to Chrome from the Web Store. It&apos;s free and takes
                  seconds.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Save Listings</h3>
                <p className="text-slate-600 text-sm">
                  Browse TradeMe Motors. Click the CarScout button on any
                  listing page.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Compare & Decide</h3>
                <p className="text-slate-600 text-sm">
                  Open your dashboard to filter, sort, and compare all your
                  saved cars.
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
            Start free, upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <p className="text-3xl font-bold">$0</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Up to 25 saved listings
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Basic filtering
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Side-by-side comparison
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-600 border-2">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <p className="text-3xl font-bold">
                  $5.99<span className="text-sm font-normal">/month</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Unlimited listings
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Price history tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    CSV export
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6">Upgrade to Pro</Button>
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
                  How do I compare cars from TradeMe?
                </h3>
                <p className="text-slate-600 text-sm">
                  Install the CarScout Chrome extension, browse TradeMe car
                  listings, and click &quot;Save to CarScout&quot; on any listing you
                  want to compare. All saved listings appear in your dashboard
                  where you can compare them side-by-side.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  Is CarScout free to use?
                </h3>
                <p className="text-slate-600 text-sm">
                  Yes! CarScout offers a free tier that lets you save up to 25
                  car listings. For unlimited listings, price history tracking,
                  and CSV export, upgrade to CarScout Pro for $5.99/month.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  Does CarScout work with Facebook Marketplace?
                </h3>
                <p className="text-slate-600 text-sm">
                  Currently, CarScout supports TradeMe Motors listings. Support
                  for Facebook Marketplace and other platforms is planned for
                  future updates.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">
                  How does price tracking work?
                </h3>
                <p className="text-slate-600 text-sm">
                  When you save a listing multiple times, CarScout tracks price
                  changes automatically. You&apos;ll see if the price went up or down
                  since you first saved it, helping you spot good deals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Is my data secure?</h3>
                <p className="text-slate-600 text-sm">
                  Yes. Your data is stored securely in our cloud database. We
                  never share your saved listings with anyone. You can delete
                  your account and all data at any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-slate-600 mb-8">
            Join thousands of New Zealanders using CarScout to compare cars.
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
                <Car className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">CarScout</span>
              </div>
              <nav className="flex gap-6 text-sm text-slate-600">
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
                <Link href="mailto:support@carscout.app" className="hover:text-blue-600">
                  Contact
                </Link>
              </nav>
              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} CarScout. Made in New Zealand.
              </p>
            </div>
            <p className="text-xs text-slate-400 text-center mt-8">
              CarScout is not affiliated with TradeMe. Users are responsible
              for compliance with third-party terms of service.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
