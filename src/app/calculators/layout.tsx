import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Health Calculators & Clinical Tools',
  description:
    'Free clinical calculators for BMI, body fat, calorie needs, protein intake, hydration, and heart risk, reviewed by Dr. Arif Chowdhury, MD.',
  path: '/calculators',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
