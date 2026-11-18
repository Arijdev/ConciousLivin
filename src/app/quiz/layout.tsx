import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Health Assessment Quiz',
  description:
    'Take the ConciousLivin health quiz to identify the clinical protocol and guide that best matches your nutrition, longevity, and lifestyle goals.',
  path: '/quiz',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
