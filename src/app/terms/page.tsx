import type { Metadata } from 'next';
import { Car } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'CarScout terms of service. Read our terms and conditions for using the CarScout website and Chrome extension for comparing car listings in New Zealand.',
  openGraph: {
    title: 'Terms of Service | CarScout',
    description:
      'Terms and conditions for using CarScout. Understand your rights and responsibilities when using our car comparison service.',
  },
};

export default function TermsPage() {
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
            <Link href="/pricing" className="text-sm hover:text-blue-600">
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

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing or using CarScout (&quot;Service&quot;), including our website
              at carscout.app and Chrome extension, you agree to be bound by
              these Terms of Service (&quot;Terms&quot;). If you do not agree to these
              Terms, do not use the Service.
            </p>
            <p className="text-slate-600">
              These Terms constitute a legally binding agreement between you and
              CarScout (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We may update these Terms from
              time to time, and your continued use of the Service after such
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p className="text-slate-600 mb-4">
              CarScout provides tools to help users save, organise, and compare
              car listings from third-party websites (currently TradeMe Motors).
              The Service includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>A Chrome browser extension for saving car listings</li>
              <li>A web dashboard for viewing and comparing saved listings</li>
              <li>
                Optional premium features available through a paid subscription
              </li>
            </ul>
          </section>

          <section className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-amber-900">
              3. TradeMe Disclaimer
            </h2>
            <p className="text-amber-800 mb-4 font-medium">
              IMPORTANT: CarScout is not affiliated with, endorsed by, or
              connected to TradeMe Limited or any of its subsidiaries.
            </p>
            <p className="text-amber-800 mb-4">
              TradeMe is a registered trademark of TradeMe Limited. Our Service
              allows users to save publicly available listing information for
              personal use. We do not scrape, crawl, or automatically collect
              data from TradeMe.
            </p>
            <p className="text-amber-800 mb-4">
              <strong>User Responsibility:</strong> You are solely responsible
              for ensuring your use of CarScout complies with TradeMe&apos;s Terms of
              Use and any applicable laws. By using CarScout, you acknowledge
              that:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-2">
              <li>
                You will only save listings for personal, non-commercial use
              </li>
              <li>
                You will not use the Service to violate TradeMe&apos;s terms or
                policies
              </li>
              <li>
                We are not responsible for any disputes between you and TradeMe
              </li>
              <li>
                We do not guarantee the accuracy or availability of listing data
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p className="text-slate-600 mb-4">
              To use certain features of the Service, you must create an
              account. You agree to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>
                Notify us immediately of any unauthorised access or use
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
              We reserve the right to suspend or terminate accounts that violate
              these Terms or for any other reason at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-slate-600 mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                Use the Service for any unlawful purpose or to promote illegal
                activities
              </li>
              <li>
                Attempt to gain unauthorised access to our systems or other
                users&apos; accounts
              </li>
              <li>
                Use automated scripts, bots, or other means to access the
                Service
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to it
              </li>
              <li>
                Resell, redistribute, or commercialise the Service without
                permission
              </li>
              <li>
                Use the Service in any way that could harm, disable, or impair
                the Service
              </li>
              <li>
                Collect or harvest personal information from other users
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Subscriptions and Payments
            </h2>
            <h3 className="text-xl font-medium mb-3">6.1 Free Tier</h3>
            <p className="text-slate-600 mb-4">
              The free tier allows you to save up to 25 car listings at no cost.
              Free tier features may be modified at any time.
            </p>

            <h3 className="text-xl font-medium mb-3">6.2 Pro Subscription</h3>
            <p className="text-slate-600 mb-4">
              CarScout Pro is available for NZD $5.99 per month. By subscribing:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>
                You authorise us to charge your payment method on a recurring
                monthly basis
              </li>
              <li>
                Your subscription will automatically renew unless cancelled
              </li>
              <li>
                You can cancel at any time through the Settings page
              </li>
              <li>
                No refunds for partial months, except as described below
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.3 Refund Policy</h3>
            <p className="text-slate-600">
              We offer a full refund within 7 days of your first Pro
              subscription. After this period, refunds are provided at our
              discretion. To request a refund, contact support@carscout.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-slate-600 mb-4">
              The Service, including its original content, features, and
              functionality, is owned by CarScout and is protected by
              international copyright, trademark, and other intellectual
              property laws.
            </p>
            <p className="text-slate-600">
              You retain ownership of any data you save using the Service.
              However, you grant us a non-exclusive, worldwide licence to store,
              process, and display your data as necessary to provide the
              Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-slate-600 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of listing data</li>
              <li>
                Uninterrupted, secure, or error-free operation
              </li>
              <li>
                Compatibility with your devices or third-party services
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
              We do not guarantee that saved listings will remain available on
              TradeMe or that prices and information are accurate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CARSCOUT AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                Any indirect, incidental, special, consequential, or punitive
                damages
              </li>
              <li>
                Loss of profits, data, use, goodwill, or other intangible losses
              </li>
              <li>
                Any damages resulting from your use or inability to use the
                Service
              </li>
              <li>
                Any third-party conduct or content on the Service
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
              Our total liability shall not exceed the amount you paid us in the
              12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-slate-600">
              You agree to indemnify, defend, and hold harmless CarScout and its
              officers, directors, employees, and agents from any claims,
              damages, losses, liabilities, and expenses (including legal fees)
              arising from your use of the Service, violation of these Terms, or
              violation of any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-slate-600 mb-4">
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice, for any reason, including if
              you breach these Terms.
            </p>
            <p className="text-slate-600">
              Upon termination, your right to use the Service will cease
              immediately. Provisions that by their nature should survive
              termination will survive, including ownership provisions, warranty
              disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              12. Governing Law and Disputes
            </h2>
            <p className="text-slate-600 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of New Zealand, without regard to conflict of law
              principles.
            </p>
            <p className="text-slate-600">
              Any disputes arising from these Terms or the Service shall be
              resolved exclusively in the courts of New Zealand. You consent to
              the personal jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
            <p className="text-slate-600">
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision will be limited or eliminated to the
              minimum extent necessary so that these Terms will otherwise remain
              in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              14. Changes to Terms
            </h2>
            <p className="text-slate-600">
              We reserve the right to modify these Terms at any time. We will
              notify you of significant changes by email or through the Service.
              Your continued use of the Service after changes constitutes
              acceptance of the new Terms. If you do not agree to the modified
              Terms, you must stop using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about these Terms, contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">
                <strong>CarScout</strong>
                <br />
                Email: legal@carscout.app
                <br />
                New Zealand
              </p>
            </div>
          </section>
        </div>
      </main>

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
              <Link href="/terms" className="text-blue-600 font-medium">
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
        </div>
      </footer>
    </div>
  );
}
