import type { Metadata } from 'next';
import Link from 'next/link';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Health Guides & eBooks | ConciousLivin Health Academy',
  description:
    'Evidence-based health guides and clinical eBooks by Dr. Arif Chowdhury. Download free PDF guides or purchase premium longevity protocols with lifetime digital access.',
  alternates: {
    canonical: '/guides',
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Page header */}
      <section className="border-b border-[#E2E8F0] pt-24 pb-8 dark:border-[#334155] sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F766E] bg-[#E6F4F1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#0F766E] dark:border-[#14B8A6] dark:bg-[#134E4A] dark:text-[#14B8A6]">
                <BookOpen className="h-3 w-3" />
                <span>Clinical Resource Library</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-4xl">
                Health Guides & eBooks
              </h1>
              <p className="text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8] sm:text-base">
                Doctor-authored protocols for nutrition, longevity, heart health, fasting, detox and
                mental performance. Free guides download instantly; premium masterclasses unlock for
                life.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
              <ShieldCheck className="h-4 w-4 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>Evidence-based · PDF + Web Reader · Lifetime updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section aria-labelledby="catalogue-heading">
        <div className="max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="catalogue-heading"
              className="text-lg font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0]"
            >
              Browse the library
            </h2>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] transition-colors hover:text-[#115E59] dark:text-[#14B8A6] dark:hover:text-[#0D9488]"
            >
              Find my guide
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <ResourceLibrary showHeader={false} showSearch />
      </section>

      {/* Next steps */}
      <section className="border-t border-[#E2E8F0] py-8 dark:border-[#334155]">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Unsure which protocol fits you?
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 text-[#0F766E] transition-colors hover:text-[#115E59] dark:text-[#14B8A6] dark:hover:text-[#0D9488]"
            >
              Take the health quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 text-[#0F766E] transition-colors hover:text-[#115E59] dark:text-[#14B8A6] dark:hover:text-[#0D9488]"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
