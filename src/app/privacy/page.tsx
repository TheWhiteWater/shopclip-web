import type { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Grabbit privacy policy. Learn how we collect, use, and protect your personal information in compliance with privacy laws and GDPR.',
  openGraph: {
    title: 'Privacy Policy | Grabbit',
    description:
      'Learn how Grabbit handles your data. We are committed to protecting your privacy and complying with global privacy laws and GDPR.',
  },
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-slate-600 mb-4">
              Grabbit (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website
              (grabbitapp.com) and Chrome extension (collectively, the
              &quot;Service&quot;).
            </p>
            <p className="text-slate-600">
              We comply with applicable data protection laws and, where
              applicable, the General Data Protection Regulation (GDPR) for
              users in the European Economic Area.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium mb-3">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
              <li>
                <strong>Account Information:</strong> Email address and password
                when you create an account
              </li>
              <li>
                <strong>Saved Items:</strong> Product data you save using
                our extension (title, price, details, images, listing URL)
              </li>
              <li>
                <strong>Payment Information:</strong> If you subscribe to Pro,
                payment is processed by Stripe. We do not store your full credit
                card details.
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, and
                interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, and device identifiers
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, and
                referring URLs
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">
              2.3 Chrome Extension Data
            </h3>
            <p className="text-slate-600">
              Our Chrome extension activates on shopping and marketplace
              pages when you explicitly click &quot;Save to Grabbit&quot;. It collects
              product data (title, price, specifications, images) only when
              you save an item. The extension does not track your browsing
              history or collect data without your action.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-slate-600 mb-4">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Store and display your saved products</li>
              <li>Process payments and manage purchases</li>
              <li>Send service-related emails (account verification, password reset)</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Analyse usage patterns to improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Data Sharing and Disclosure
            </h2>
            <p className="text-slate-600 mb-4">
              We do not sell your personal information. We may share your data
              with:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                <strong>Service Providers:</strong> Third parties that help us
                operate the Service (hosting, analytics, payment processing)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights and safety
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-slate-600">
              We retain your personal information for as long as your account is
              active or as needed to provide you the Service. You can delete
              your account at any time through the Settings page. Upon account
              deletion, we will delete your personal data within 30 days, except
              where retention is required for legal or legitimate business
              purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-slate-600">
              We implement appropriate technical and organisational measures to
              protect your personal information, including encryption in transit
              (TLS/SSL), secure cloud infrastructure, and access controls.
              However, no method of transmission over the internet is 100%
              secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Your Rights (GDPR and NZ Privacy Act)
            </h2>
            <p className="text-slate-600 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Rectification:</strong> Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Erasure:</strong> Request deletion of your personal data
              </li>
              <li>
                <strong>Data Portability:</strong> Request your data in a
                machine-readable format
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your
                personal data
              </li>
              <li>
                <strong>Restriction:</strong> Request restriction of processing
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
              To exercise these rights, contact us at privacy@grabbitapp.com. We
              will respond within 30 days in accordance with applicable laws
              (GDPR and other data protection regulations).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-slate-600">
              We use essential cookies for authentication and session
              management. We may also use analytics cookies to understand how
              users interact with our Service. You can control cookies through
              your browser settings, but disabling essential cookies may affect
              Service functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-slate-600">
              Your data may be transferred to and processed in countries
              worldwide. We ensure appropriate safeguards are in place
              for such transfers, including standard contractual clauses
              approved by relevant authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-slate-600">
              The Service is not intended for children under 16. We do not
              knowingly collect personal information from children. If you
              believe we have collected data from a child, please contact us
              immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by email or through the Service.
              Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about this Privacy Policy or our data
              practices, contact us at:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">
                <strong>Grabbit</strong>
                <br />
                Email: privacy@grabbitapp.com
              </p>
            </div>
            <p className="text-slate-600 mt-4">
              For complaints about how we handle your personal information, you
              may contact your local data protection authority as applicable
              under GDPR or your region&apos;s privacy laws.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Grabbit</span>
            </Link>
            <nav className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="text-blue-600 font-medium">
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
        </div>
      </footer>
    </div>
  );
}
