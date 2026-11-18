import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Clinical Health Articles',
  description:
    'Evidence-based articles on nutrition, fasting, heart health, detox, and longevity by Dr. Arif Chowdhury, MD.',
  path: '/articles',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
