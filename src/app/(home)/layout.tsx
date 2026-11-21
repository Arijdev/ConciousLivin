import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getPageKeywords } from '@/lib/keywords';
import { AppShell } from '@/components/AppShell';

export const metadata = pageMetadata({
  title: 'Conscious Living Health Academy | Dr. Arif Chowdhury MD',
  description:
    'Conscious Living Health Academy by Dr. Arif Chowdhury MD (MBBS, M.S. Clinical Nutrition). Evidence-based clinical health guides, virtual consultations, health calculators, and longevity protocols for conscious living. Master your health through clinical nutrition, gut health, heart health, fasting, and metabolic optimization.',
  path: '/',
  ogImage: '/og-home.png',
  keywords: getPageKeywords('home'),
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}