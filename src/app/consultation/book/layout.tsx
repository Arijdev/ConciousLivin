import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Book a Consultation',
  description:
    'Schedule your secure virtual consultation with Dr. Arif Chowdhury, MD and choose the clinical package that fits your health goals.',
  path: '/consultation/book',
  absoluteTitle: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
