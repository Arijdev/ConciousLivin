import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCTOR_INFO } from '@/data/healthData';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Digital Product Refund Policy',
  description:
    'The 30-day money-back guarantee and refund process for ConciousLivin Health Academy digital guides.',
  path: '/refund',
});

export default function RefundPolicyPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-4xl">
          Digital Product Refund Policy
        </h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Last updated: 18 November 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-semibold">30-day money-back guarantee</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Every paid guide comes with a 30-day money-back guarantee. If you apply the protocols
              and do not experience a noticeable improvement in your health and vitality, email us
              within 30 days of purchase and we will refund the amount you paid for that guide.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">How to request a refund</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[#64748B] dark:text-[#94A3B8]">
              <li>
                Email{' '}
                <a className="font-semibold text-[#0F766E] underline dark:text-[#14B8A6]" href={`mailto:${DOCTOR_INFO.email}`}>
                  {DOCTOR_INFO.email}
                </a>{' '}
                from the address on your account.
              </li>
              <li>Include the order ID from your account&apos;s order history and the guide title.</li>
              <li>Tell us briefly why the guide did not meet your expectations.</li>
            </ol>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              We reply within one business day. Approved refunds are returned through PayPal to the
              original payment method, usually within 5–10 business days once processed.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">What is covered</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Individual paid guides purchased on this site.</li>
              <li>Duplicate charges for the same guide or order.</li>
              <li>A paid guide that cannot be opened or downloaded because of a fault on our side.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">What is not covered</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Free guides, calculators, articles, and quiz results.</li>
              <li>Completed one-on-one consultations, which are scheduled services rather than digital products.</li>
              <li>Requests made more than 30 days after the purchase date.</li>
              <li>Chargeback fees or currency conversion differences charged by your bank or PayPal.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Access after a refund</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              When a refund is issued, access to the refunded guide is removed from your account.
              Other guides you purchased remain available.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Medical disclaimer</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Refunds are not based on medical outcomes. Guides are educational material and are not
              a substitute for individualized clinical care. Please speak with your own clinician
              before changing any treatment plan.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-6 text-sm dark:border-[#334155]">
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/terms">
            Terms of Service
          </Link>
        </div>
      </div>
    </section>
  );
}
