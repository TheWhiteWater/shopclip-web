import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://carscout.app';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CarScout - Compare Car Listings Across New Zealand',
    template: '%s | CarScout',
  },
  description:
    'Save and compare car listings from TradeMe in one place. Track price changes, compare vehicles side-by-side, and find your perfect car in New Zealand.',
  keywords: [
    'car comparison NZ',
    'TradeMe cars',
    'compare car listings',
    'New Zealand used cars',
    'car price tracker',
    'vehicle comparison tool',
    'TradeMe Motors',
    'buy used car NZ',
  ],
  authors: [{ name: 'CarScout' }],
  creator: 'CarScout',
  publisher: 'CarScout',
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
    locale: 'en_NZ',
    url: BASE_URL,
    siteName: 'CarScout',
    title: 'CarScout - Compare Car Listings Across New Zealand',
    description:
      'Save and compare car listings from TradeMe in one place. Track price changes and find your perfect car.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CarScout - Compare Car Listings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarScout - Compare Car Listings Across New Zealand',
    description:
      'Save and compare car listings from TradeMe. Track price changes and find your perfect car.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-NZ': BASE_URL,
    },
  },
  other: {
    'geo.region': 'NZ',
    'geo.placename': 'New Zealand',
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
        name: 'CarScout',
        description: 'Compare car listings across New Zealand',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'CarScout',
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
        name: 'CarScout',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web, Chrome',
        description:
          'Chrome extension and web dashboard for comparing car listings from TradeMe New Zealand',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'NZD',
          description: 'Free tier with 25 listings',
        },
        featureList: [
          'Save car listings with one click',
          'Compare vehicles side-by-side',
          'Track price changes over time',
          'Filter and sort listings',
          'Export to CSV',
        ],
        screenshot: `${BASE_URL}/screenshot.png`,
        softwareVersion: '1.0.0',
        author: {
          '@id': `${BASE_URL}/#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'New Zealand',
        },
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
        name: 'How do I compare cars from TradeMe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Install the CarScout Chrome extension, browse TradeMe car listings, and click "Save to CarScout" on any listing you want to compare. All saved listings appear in your dashboard where you can compare them side-by-side.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is CarScout free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! CarScout offers a free tier that lets you save up to 25 car listings. For unlimited listings, price history tracking, and CSV export, upgrade to CarScout Pro for $5.99/month.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does CarScout work with Facebook Marketplace?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Currently, CarScout supports TradeMe Motors listings. Support for Facebook Marketplace and other platforms is planned for future updates.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does price tracking work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "When you save a listing multiple times, CarScout tracks price changes automatically. You'll see if the price went up or down since you first saved it, helping you spot good deals.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your data is stored securely in our cloud database. We never share your saved listings with anyone. You can delete your account and all data at any time.',
        },
      },
    ],
  };
}
