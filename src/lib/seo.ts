import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shopclip.app';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ShopClip - Save & Compare Products From Any Website',
    template: '%s | ShopClip',
  },
  description:
    'Save and compare products from any website. Like Grammarly for text or Honey for discounts — but for shopping. Works on Facebook Marketplace, Amazon, eBay, IKEA, and more.',
  keywords: [
    'product comparison',
    'compare products',
    'price tracker',
    'shopping comparison tool',
    'Facebook Marketplace',
    'Amazon',
    'eBay',
    'IKEA',
    'buy online',
    'shopping assistant',
    'cross platform shopping comparison',
    'save products',
    'shopping clipboard',
  ],
  authors: [{ name: 'ShopClip' }],
  creator: 'ShopClip',
  publisher: 'ShopClip',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en',
    url: BASE_URL,
    siteName: 'ShopClip',
    title: 'ShopClip - Save & Compare Products From Any Website',
    description:
      'Like Grammarly for text or Honey for discounts — but for shopping. Save products from Facebook, Amazon, eBay, and more. Compare side-by-side.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShopClip - Save & Compare Products From Any Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopClip - Save & Compare Products From Any Website',
    description:
      'Like Grammarly for text or Honey for discounts — but for shopping. Compare products from any website.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en': BASE_URL,
      'en-NZ': `${BASE_URL}/nz`,
      'en-AU': `${BASE_URL}/au`,
      'en-GB': `${BASE_URL}/uk`,
      'en-US': `${BASE_URL}/us`,
    },
  },
};

// JSON-LD structured data for the homepage
export function getHomePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'ShopClip',
        description: 'Save and compare products from any website worldwide',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'ShopClip',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.png`,
        },
        sameAs: [],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${BASE_URL}/#software`,
        name: 'ShopClip',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web, Chrome, Edge, Brave, Opera',
        description:
          'Browser extension and web dashboard for saving and comparing products from any website. Works on Facebook Marketplace, Amazon, eBay, IKEA, and more.',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free: 4 slots to save products from any platform',
          },
          {
            '@type': 'Offer',
            price: '9.99',
            priceCurrency: 'USD',
            description: '5 slots pack - $2 per save',
          },
          {
            '@type': 'Offer',
            price: '14.99',
            priceCurrency: 'USD',
            description: '10 slots pack - $1.50 per save (best value)',
          },
          {
            '@type': 'Offer',
            price: '24.99',
            priceCurrency: 'USD',
            description: '25 slots pack - $1 per save',
          },
        ],
        featureList: [
          'Save products from any website with one click',
          'Compare items side-by-side from different platforms',
          'Track price changes over time',
          'Works on Facebook Marketplace, Amazon, eBay, IKEA, and more',
          'Notes and tags for organization',
          'Cloud sync across devices',
          'Export to CSV',
          'Universal shopping clipboard',
        ],
        screenshot: `${BASE_URL}/screenshot.png`,
        softwareVersion: '2.0.0',
        author: {
          '@id': `${BASE_URL}/#organization`,
        },
        areaServed: [
          { '@type': 'Country', name: 'New Zealand' },
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United States' },
        ],
      },
    ],
  };
}

// FAQ JSON-LD for homepage
export function getFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What websites does ShopClip work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ShopClip works on virtually any shopping website worldwide including Facebook Marketplace, Amazon, eBay, IKEA, Craigslist, local marketplaces, and dealer websites. We support any site with products to save.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is ShopClip free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! ShopClip gives you 4 free slots to save products from ANY platform. That\'s enough to compare items from different websites. Need more? Buy slot packs starting at $9.99 for 5 slots. No subscription required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare products from different websites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes! That's ShopClip's superpower. Found a product on Amazon and another on Facebook? Save both and compare them side-by-side in your dashboard — price, features, everything.",
        },
      },
      {
        '@type': 'Question',
        name: 'How does price tracking work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "When you save a product multiple times, ShopClip tracks price changes automatically. You'll see if the price went up or down since you first saved it, helping you spot deals.",
        },
      },
      {
        '@type': 'Question',
        name: 'Which browsers are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "ShopClip works on all Chromium-based browsers: Chrome, Edge, Brave, Opera, Arc, and Vivaldi. That's 83% of browser users. Firefox and Safari support coming soon.",
        },
      },
    ],
  };
}
