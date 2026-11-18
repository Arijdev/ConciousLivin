import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About Dr. Arif Chowdhury, MD',
  description:
    'Meet Dr. Arif Chowdhury, MD (MBBS, M.S. Clinical Nutrition) — founder of ConciousLivin Health Academy, author of clinical health guides, and virtual longevity consultant.',
  path: '/about',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
