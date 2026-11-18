import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Virtual Health Consultations',
  description:
    'Book a virtual consultation with Dr. Arif Chowdhury, MD for personalised clinical nutrition, longevity, and metabolic health guidance.',
  path: '/consultation',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
