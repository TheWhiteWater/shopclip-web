import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Grabbit pricing. Start with 4 free saves. Buy more slots as you need them: 5 for $9.99, 10 for $14.99, 25 for $24.99. No subscription required.',
  openGraph: {
    title: 'Pricing | Grabbit',
    description:
      'Pay for what you use. 4 free saves to start. Buy more slots when you need them. No monthly subscription.',
  },
};

const slotPackages = [
  { slots: 5, price: 9.99, perSlot: 2.0 },
  { slots: 10, price: 14.99, perSlot: 1.5, popular: true },
  { slots: 25, price: 24.99, perSlot: 1.0 },
];

const includedFeatures = [
  'Save from ALL platforms',
  'Side-by-side comparison',
  'Price tracking (90 days)',
  'Notes & tags',
  'Cloud sync',
  'CSV export',
  'Share link',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Grabbit</span>
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
          Pay For What You Use
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          No subscription. Buy slots when you need them.
          <br />
          Like buying research credits.
        </p>
      </section>

      {/* Free Tier */}
      <section className="container mx-auto px-4 pb-8">
        <Card className="max-w-md mx-auto border-green-200 bg-green-50/50">
          <CardHeader className="text-center">
            <Badge className="w-fit mx-auto mb-2 bg-green-600">Start Free</Badge>
            <CardTitle className="text-2xl">4 Free Slots</CardTitle>
            <p className="text-slate-600 text-sm mt-2">
              Try the magic of cross-platform comparison
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold mb-4">
              $0
            </p>
            <p className="text-sm text-slate-600 mb-4">
              Save 2 from Amazon + 2 from Facebook = see why it works
            </p>
            <Link href="/login" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Get 4 Free Slots
              </Button>
            </Link>
            <p className="text-xs text-slate-500 mt-3">
              No credit card required
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Slot Packages */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          Need More? Buy Slot Packs
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {slotPackages.map((pkg) => (
            <Card
              key={pkg.slots}
              className={pkg.popular ? 'border-blue-600 border-2 relative' : ''}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Best Value
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">+{pkg.slots} Slots</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  ${pkg.price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-500">
                  ${pkg.perSlot.toFixed(2)} per slot
                </p>
              </CardHeader>
              <CardContent>
                <Link href="/login" className="block">
                  <Button
                    className="w-full"
                    variant={pkg.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Buy {pkg.slots} Slots
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-6">
            Every Slot Includes
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {includedFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            No feature limits. Pay for saves, get everything.
          </p>
        </div>
      </section>

      {/* How Slots Work */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          How Slots Work
        </h2>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">You start with 4 free slots</h3>
                <p className="text-sm text-slate-600">
                  Enough to save 2 products from Amazon and 2 from Facebook — and see
                  the cross-platform comparison magic.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Each save uses 1 slot</h3>
                <p className="text-sm text-slate-600">
                  Slots are consumed when you save — like buying a bookmark.
                  You&apos;re paying for the curation, not storage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Buy more when you need them</h3>
                <p className="text-sm text-slate-600">
                  No subscription. No monthly fee. Just buy a pack when you run out.
                  Most shopping projects use 15-20 slots total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Why is this worth it?</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-slate-700 mb-4">
              Shopping takes time. Compare the value:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold text-lg">Hours</div>
                <div className="text-slate-600">Saved searching</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold text-lg">$100s</div>
                <div className="text-slate-600">Better deals</div>
              </div>
              <div className="bg-white p-3 rounded-lg col-span-2 md:col-span-1">
                <div className="font-bold text-lg">One place</div>
                <div className="text-slate-600">All your finds</div>
              </div>
            </div>
            <p className="text-slate-700">
              <strong>Grabbit for entire project: ~$15-25</strong>
              <br />
              <span className="text-sm text-slate-500">
                (4 free + 10-25 purchased slots)
              </span>
            </p>
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
            <h3 className="font-semibold mb-2">Why slots instead of a subscription?</h3>
            <p className="text-slate-600 text-sm">
              Shopping is temporary — you research for a few weeks, buy what you need, then you&apos;re
              done. A subscription doesn&apos;t match that. With slots, you pay for
              what you use and never worry about forgetting to cancel.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Do slots expire?</h3>
            <p className="text-slate-600 text-sm">
              No! Purchased slots never expire. Use them whenever you need them.
              Price tracking on saved items works for 90 days (typical shopping duration).
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">What if I delete a saved item?</h3>
            <p className="text-slate-600 text-sm">
              Slots are consumed when you save — deleting doesn&apos;t return the slot.
              Think of it like saving a webpage: once bookmarked, it&apos;s part of your
              collection history.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">How many slots do I need?</h3>
            <p className="text-slate-600 text-sm">
              Most shopping projects involve saving 15-25 items across multiple sites. Start with
              the 4 free slots, then buy a 10-pack ($14.99) when you need more.
              That covers most projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-slate-600 text-sm">
              Yes — if you haven&apos;t used your purchased slots, we&apos;ll refund within
              7 days. Contact support@grabbitapp.com.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center bg-slate-50">
        <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">
          Start With 4 Free Slots
        </h2>
        <p className="text-slate-600 mb-8">
          No credit card. No commitment. Just try it.
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
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Grabbit</span>
            </Link>
            <nav className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
              <Link
                href="mailto:support@grabbitapp.com"
                className="hover:text-blue-600"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Grabbit
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center mt-8">
            Grabbit is a user-initiated productivity tool. We help you save what you&apos;re
            already viewing in your browser — like Grammarly for text or Honey for coupons.
            We store only your personal browsing data and delete it when you close your account.
          </p>
        </div>
      </footer>
    </div>
  );
}
