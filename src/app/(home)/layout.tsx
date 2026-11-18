import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Clinical Health & Longevity Academy',
  url: SITE_URL,
  about: 'Evidence-based clinical health guides, longevity protocols, and virtual consultations.',
  audience: {
    '@type': 'Audience',
    audienceType: 'Adults seeking evidence-based health guidance',
  },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </>
  );
}
