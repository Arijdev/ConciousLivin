import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { AppShell } from '@/components/AppShell';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ConciousLivin Health Academy | Dr. Arif Chowdhury',
    template: '%s | ConciousLivin Health Academy',
  },
  description:
    'ConciousLivin Health Academy by Dr. Arif Chowdhury offers clinical health guides, virtual consultations, health calculators, and evidence-based longevity resources.',
  applicationName: 'ConciousLivin Health Academy',
  authors: [{ name: 'Dr. Arif Chowdhury', url: SITE_URL }],
  creator: 'Dr. Arif Chowdhury',
  publisher: 'ConciousLivin Health Academy',
  category: 'health',
  keywords: [
    'health guides',
    'clinical nutrition',
    'longevity protocol',
    'Dr. Arif Chowdhury',
    'intermittent fasting',
    'gut health',
    'heart health',
    'virtual consultation',
    'health calculators',
    'evidence-based wellness',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'ConciousLivin Health Academy',
    title: 'ConciousLivin Health Academy | Dr. Arif Chowdhury',
    description:
      'Clinical health guides, virtual consultations, calculators, and evidence-based wellness resources by Dr. Arif Chowdhury.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConciousLivin Health Academy | Dr. Arif Chowdhury',
    description:
      'Clinical health guides, virtual consultations, calculators, and evidence-based wellness resources by Dr. Arif Chowdhury.',
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
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ConciousLivin Health Academy',
      url: SITE_URL,
      logo: `${SITE_URL}/logo-mark.svg`,
      email: 'dr.arif@conciouslivin.in',
      founder: {
        '@type': 'Physician',
        name: 'Dr. Arif Chowdhury',
        medicalSpecialty: 'Clinical Nutrition',
        description:
          'MBBS, M.S. Clinical Nutrition. Author of ConciousLivin clinical health guides and protocols.',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ConciousLivin Health Academy',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
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
