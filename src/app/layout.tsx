import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { AppShell } from '@/components/AppShell';
import { SITE_URL } from '@/lib/seo';
import { ALL_KEYWORDS } from '@/lib/keywords';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Conscious Living Health Academy | Dr. Arif Chowdhury MD',
    template: '%s | Conscious Living Health Academy',
  },
  description:
    'Conscious Living Health Academy by Dr. Arif Chowdhury MD (MBBS, M.S. Clinical Nutrition) offers evidence-based clinical health guides, virtual consultations, health calculators, and longevity protocols. Master conscious living through clinical nutrition, gut health, heart health, fasting, and metabolic optimization.',
  applicationName: 'Conscious Living Health Academy',
  authors: [{ name: 'Dr. Arif Chowdhury', url: SITE_URL }],
  creator: 'Dr. Arif Chowdhury',
  publisher: 'Conscious Living Health Academy',
  category: 'health',
  keywords: ALL_KEYWORDS,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Conscious Living Health Academy',
    title: 'Conscious Living Health Academy | Dr. Arif Chowdhury MD',
    description:
      'Conscious Living Health Academy by Dr. Arif Chowdhury MD offers evidence-based clinical health guides, virtual consultations, health calculators, and longevity protocols for conscious living.',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Conscious Living Health Academy - Dr. Arif Chowdhury MD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conscious Living Health Academy | Dr. Arif Chowdhury MD',
    description:
      'Evidence-based clinical health guides, virtual consultations, and longevity protocols by Dr. Arif Chowdhury MD for conscious living.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/logo-mark.svg', type: 'image/svg+xml' }],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9FAFB' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Conscious Living Health Academy',
      alternateName: 'ConciousLivin Health Academy',
      url: SITE_URL,
      logo: `${SITE_URL}/logo-mark.svg`,
      email: 'dr.arif@conciouslivin.in',
      telephone: '+1-555-0100',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressRegion: 'CA',
      },
      founder: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Dr. Arif Chowdhury',
        alternateName: 'Arif Chowdhury MD',
        medicalSpecialty: 'Clinical Nutrition',
        jobTitle: 'Clinical Nutritionist, MBBS, M.S. Clinical Nutrition',
        description: 'MBBS, M.S. Clinical Nutrition. Author of Conscious Living clinical health guides and protocols.',
        url: SITE_URL,
        sameAs: [
          'https://linkedin.com/in/drarifchowdhury',
          'https://twitter.com/drarifchowdhury',
        ],
      },
      knowsAbout: [
        'Clinical Nutrition',
        'Longevity Medicine',
        'Gut Health',
        'Cardiovascular Health',
        'Intermittent Fasting',
        'Metabolic Health',
        'Conscious Living',
      ],
      hasCredential: 'MBBS, M.S. Clinical Nutrition',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Conscious Living Health Academy',
      alternateName: 'ConciousLivin Health Academy',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/guides?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'MedicalWebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Conscious Living Health Academy - Clinical Health Guides & Consultations',
      description: 'Evidence-based clinical health guides, virtual consultations, health calculators, and longevity protocols by Dr. Arif Chowdhury MD for conscious living.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      author: { '@id': `${SITE_URL}/#person` },
      inLanguage: 'en-US',
      mainEntityOfPage: { '@id': `${SITE_URL}/#webpage` },
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString().split('T')[0],
      audience: {
        '@type': 'MedicalAudience',
        audienceType: 'Patient',
        geographicArea: 'Worldwide',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('conciouslivin_theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className="min-h-screen bg-[#F9FAFB] text-[#1E293B] antialiased dark:bg-[#0F172A] dark:text-[#E2E8F0]"
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
