import Link from 'next/link';
import { CircleX } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-8 text-center">
        <CircleX className="mx-auto h-10 w-10 text-[#64748B] dark:text-[#94A3B8]" />
        <h1 className="mt-4 text-2xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">Payment cancelled</h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">No payment was captured. You can return to your cart or choose a consultation slot again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/guides" className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59]">Return to health guides</Link>
          <Link href="/consultation" className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] px-4 py-2.5 text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F9FAFB] dark:hover:bg-[#0F172A]">Consultations</Link>
        </div>
      </section>
    </main>
  );
}
