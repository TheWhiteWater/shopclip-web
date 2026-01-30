import type { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'ShopClip terms of service. Read our terms and conditions for using the ShopClip website and Chrome extension for saving and comparing products from any website.',
  openGraph: {
    title: 'Terms of Service | ShopClip',
    description:
      'Terms and conditions for using ShopClip. Understand your rights and responsibilities when using our shopping clipboard service.',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">ShopClip</span>
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
              By accessing or using ShopClip (&quot;Service&quot;), including our website
              at shopclip.app and Chrome extension, you agree to be bound by
              these Terms of Service (&quot;Terms&quot;). If you do not agree to these
              Terms, do not use the Service.
            </p>
            <p className="text-slate-600">
              These Terms constitute a legally binding agreement between you and
              ShopClip (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We may update these Terms from
              time to time, and your continued use of the Service after such
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Service
            </h2>
            <p className="text-slate-600 mb-4">
              ShopClip provides tools to help users save, organise, and compare
              products from any shopping website worldwide.
              The Service includes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>A Chrome browser extension for saving products</li>
              <li>A web dashboard for viewing and comparing saved items</li>
              <li>
                Optional slot packs available for purchase (no subscription)
              </li>
            </ul>
          </section>

          <section className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-amber-900">
              3. Third-Party Websites Disclaimer
            </h2>
            <p className="text-amber-800 mb-4 font-medium">
              IMPORTANT: ShopClip is not affiliated with, endorsed by, or
              connected to any shopping platforms, marketplaces, or e-commerce
              websites.
            </p>
            <p className="text-amber-800 mb-4">
              Our Service allows users to save publicly available product
              information for personal use. We do not scrape, crawl, or
              automatically collect data from websites.
            </p>
            <p className="text-amber-800 mb-4">
              <strong>User Responsibility:</strong> You are solely responsible
              for ensuring your use of ShopClip complies with each website&apos;s Terms of
              Use and any applicable laws. By using ShopClip, you acknowledge
              that:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-2">
              <li>
                You will only save products for personal, non-commercial use
              </li>
              <li>
                You will not use the Service to violate any website&apos;s terms or
                policies
              </li>
              <li>
                We are not responsible for any disputes between you and third-party websites
              </li>
              <li>
                We do not guarantee the accuracy or availability of product data
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
              6. Slot Packs and Payments
            </h2>
            <h3 className="text-xl font-medium mb-3">6.1 Free Tier</h3>
            <p className="text-slate-600 mb-4">
              The free tier provides 4 free slots to save products at no cost.
              Free tier features may be modified at any time.
            </p>

            <h3 className="text-xl font-medium mb-3">6.2 Slot Packs</h3>
            <p className="text-slate-600 mb-4">
              Additional slots are available for purchase in packs. By purchasing:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>
                Slots are consumed when you save a product
              </li>
              <li>
                Purchased slots never expire
              </li>
              <li>
                Slots cannot be refunded once used
              </li>
              <li>
                This is a one-time purchase, not a subscription
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.3 Refund Policy</h3>
            <p className="text-slate-600">
              We offer a full refund within 7 days if you have not used your
              purchased slots. After this period or once slots are used, refunds
              are provided at our discretion. To request a refund, contact support@shopclip.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-slate-600 mb-4">
              The Service, including its original content, features, and
              functionality, is owned by ShopClip and is protected by
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
              <li>Accuracy, reliability, or completeness of product data</li>
              <li>
                Uninterrupted, secure, or error-free operation
              </li>
              <li>
                Compatibility with your devices or third-party services
              </li>
            </ul>
            <p className="text-slate-600 mt-4">
              We do not guarantee that saved products will remain available on
              third-party websites or that prices and information are accurate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHOPCLIP AND ITS OFFICERS,
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
              You agree to indemnify, defend, and hold harmless ShopClip and its
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
              applicable international law, without regard to conflict of law
              principles.
            </p>
            <p className="text-slate-600">
              Any disputes arising from these Terms or the Service shall be
              resolved through binding arbitration or in applicable courts.
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
                <strong>ShopClip</strong>
                <br />
                Email: legal@shopclip.app
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
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">ShopClip</span>
            </Link>
            <nav className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-600 font-medium">
                Terms of Service
              </Link>
              <Link
                href="mailto:support@shopclip.app"
                className="hover:text-blue-600"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} ShopClip
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
