import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCTOR_INFO } from '@/data/healthData';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How ConciousLivin Health Academy collects, uses, and protects your personal and health-related information.',
  path: '/privacy',
});

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Last updated: 18 November 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-semibold">Who we are</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              ConciousLivin Health Academy is operated by {DOCTOR_INFO.name} through{' '}
              {DOCTOR_INFO.clinicLocation}. You can reach us about privacy matters at{' '}
              <a className="font-semibold text-[#0F766E] underline dark:text-[#14B8A6]" href={`mailto:${DOCTOR_INFO.email}`}>
                {DOCTOR_INFO.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Information we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Account details you provide: name, email address, and optional phone number.</li>
              <li>Authentication data handled by our authentication provider, including Google sign-in identifiers when you choose that option.</li>
              <li>Order and download records for the guides and consultations you access.</li>
              <li>Messages you send through the consultation form, chat assistant, or newsletter signup.</li>
              <li>Basic technical data such as browser type and approximate region used to set your currency.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">How we use your information</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              We use your information to create and secure your account, deliver purchased or free
              guides, process payments, respond to consultation requests, provide download and
              order history, and send the newsletter you asked for. We do not sell your personal
              information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Service providers</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              We rely on trusted processors to run the academy: Supabase for authentication,
              database, and file storage; PayPal for payment processing; Google for optional
              sign-in and Generative AI for the chat assistant. Each processor receives only the
              data needed to provide its service and is bound by its own privacy terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Health information</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Information you share in a consultation request may include health details. We use it
              only to respond to that request and to prepare your consultation. Educational content,
              calculator results, and quiz outcomes are not a medical record and are not shared with
              third parties for advertising.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Data retention and security</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              Account, purchase, and download records are kept while your account is active and for
              as long as needed to meet legal and accounting obligations. Access to paid content is
              restricted to the purchasing account. Data is transmitted over HTTPS and stored with
              access controls, but no online service can guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Cookies and local storage</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              We use browser storage to keep you signed in, remember your theme and currency
              preference, and preserve your cart. We do not use advertising cookies or third-party
              tracking pixels.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Your choices</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              You can update your profile, change your password, or ask us to delete your account
              and associated data by emailing{' '}
              <a className="font-semibold text-[#0F766E] underline dark:text-[#14B8A6]" href={`mailto:${DOCTOR_INFO.email}`}>
                {DOCTOR_INFO.email}
              </a>
              . You can stop newsletter emails at any time by using the unsubscribe link or
              contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Changes to this policy</h2>
            <p className="mt-2 text-[#64748B] dark:text-[#94A3B8]">
              We may update this policy as the academy evolves. The date at the top of this page
              shows when it last changed.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-6 text-sm dark:border-[#334155]">
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/terms">
            Terms of Service
          </Link>
          <Link className="font-semibold text-[#0F766E] hover:underline dark:text-[#14B8A6]" href="/refund">
            Refund Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
