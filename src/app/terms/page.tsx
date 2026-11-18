import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCTOR_INFO } from '@/data/healthData';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms that govern your use of ConciousLivin Health Academy guides, calculators, and consultation services.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Last updated: 18 November 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-semibold">Educational use only</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              ConciousLivin Health Academy publishes educational material authored by{' '}
              {DOCTOR_INFO.name}. Guides, articles, calculators, quiz results, and chat replies are
              general information, not a diagnosis, prescription, or substitute for care from your
              own licensed clinician. Never delay or stop medical treatment because of something you
              read here.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Your account</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              You must provide accurate information, keep your password confidential, and use one
              account per person. You are responsible for activity under your account. We may
              suspend accounts that share paid content, attempt to bypass access controls, or abuse
              the service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Purchases and access</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Paid guides are licensed to the purchasing account for personal, non-commercial use.
              Prices are shown in your selected currency and are charged through PayPal. Access is
              granted after a completed payment; you agree not to redistribute, resell, or publicly
              post purchased files.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Consultations</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Consultation requests are reviewed before a booking is confirmed. A consultation does
              not create a doctor-patient relationship until both sides confirm it, and it does not
              replace emergency care. If you have a medical emergency, contact your local emergency
              service immediately.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Acceptable use</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Do not attempt to access another person&apos;s account, downloads, or orders.</li>
              <li>Do not scrape, copy, or republish the academy&apos;s content without permission.</li>
              <li>Do not use the chat assistant or forms to send unlawful, harmful, or misleading content.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Intellectual property</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              All guides, articles, illustrations, and brand elements on this site belong to
              ConciousLivin Health Academy and its author. Your purchase grants a personal licence,
              not ownership of the content.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Limitation of liability</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              To the extent permitted by law, ConciousLivin Health Academy is not liable for
              indirect or consequential losses arising from use of the site or reliance on its
              educational content. Nothing in these terms limits rights that cannot be excluded by
              law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Contact</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Questions about these terms can be sent to{' '}
              <a className="font-semibold text-[#0F766E] underline dark:text-[#14B8A6]" href={`mailto:${DOCTOR_INFO.email}`}>
                {DOCTOR_INFO.email}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-6 text-sm dark:border-[#334155]">
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/refund">
            Refund Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
