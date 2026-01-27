import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'CarScout pricing plans. Start free with 25 listings or upgrade to Pro for unlimited listings, price tracking, and CSV export. Simple pricing, no hidden fees.',
  openGraph: {
    title: 'Pricing | CarScout',
    description:
      'Compare car listings from TradeMe. Free tier includes 25 listings. Pro includes unlimited listings, price history, and CSV export for $5.99/month.',
  },
};

const features = [
  { name: 'Saved listings', free: '25 listings', pro: 'Unlimited' },
  { name: 'Side-by-side comparison', free: true, pro: true },
  { name: 'Basic filters (price, year, km)', free: true, pro: true },
  { name: 'Advanced filters', free: false, pro: true },
  { name: 'Price history tracking', free: false, pro: true },
  { name: 'Price change notifications', free: false, pro: true },
  { name: 'CSV export', free: false, pro: true },
  { name: 'Priority support', free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">CarScout</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm hover:text-blue-600">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm hover:text-blue-600">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm text-blue-600 font-medium">
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm hover:text-blue-600">
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Start free with everything you need to compare cars. Upgrade to Pro
          when you need more power.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <p className="text-4xl font-bold mt-2">
                $0
                <span className="text-base font-normal text-slate-600">
                  /month
                </span>
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Perfect for casual car shoppers
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Up to 25 saved listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Side-by-side comparison</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Basic filters (price, year, km)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Chrome extension access</span>
                </li>
              </ul>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <p className="text-xs text-slate-500 text-center mt-3">
                No credit card required
              </p>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="relative border-blue-600 border-2">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <p className="text-4xl font-bold mt-2">
                $5.99
                <span className="text-base font-normal text-slate-600">
                  /month
                </span>
              </p>
              <p className="text-slate-600 text-sm mt-2">
                For serious car buyers
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">Unlimited saved listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Everything in Free, plus:</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Price history tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Price change notifications</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>CSV export</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  Upgrade to Pro
                </Button>
              </Link>
              <p className="text-xs text-slate-500 text-center mt-3">
                Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">Free</th>
                  <th className="text-center py-4 px-6 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={index !== features.length - 1 ? 'border-b' : ''}
                  >
                    <td className="py-4 px-6 text-sm">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-blue-600">
                          {feature.pro}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Pricing Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-slate-600 text-sm">
              Yes! You can cancel your Pro subscription at any time. You&apos;ll
              continue to have Pro access until the end of your billing period,
              then revert to the Free tier.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">
              What happens to my listings if I downgrade?
            </h3>
            <p className="text-slate-600 text-sm">
              Your saved listings are preserved when you downgrade. However,
              you&apos;ll only be able to access the most recent 25 listings
              until you upgrade again.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-slate-600 text-sm">
              We offer a full refund within 7 days of your first Pro
              subscription if you&apos;re not satisfied. Contact us at
              support@carscout.app.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Perfect Car?
        </h2>
        <p className="text-slate-600 mb-8">
          Start comparing cars from TradeMe today.
        </p>
        <Link href="/login">
          <Button size="lg">Get Started Free</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">CarScout</span>
            </Link>
            <nav className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
              <Link
                href="mailto:support@carscout.app"
                className="hover:text-blue-600"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} CarScout. Made in New Zealand.
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center mt-8">
            CarScout is not affiliated with TradeMe. Users are responsible for
            compliance with third-party terms of service.
          </p>
        </div>
      </footer>
    </div>
  );
}
