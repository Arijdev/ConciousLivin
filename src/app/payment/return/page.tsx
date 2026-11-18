'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

type PaymentDetails = {
  items?: { resourceId: string }[];
};

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft_id');
  const started = useRef(false);
  const { refreshHistory, setIsCustomerDashboardOpen } = useAuth();
  const { clearCart, unlockResource } = useCart();
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment with PayPal…');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const capturePayment = async () => {
      if (!draftId) {
        setState('error');
        setMessage('Payment reference is missing. Contact support if PayPal charged you.');
        return;
      }

      try {
        const response = await fetch('/api/payments/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'PayPal could not verify this payment.');
        }

        if (result.paymentType === 'resources') {
          const details = result.details as PaymentDetails;
          for (const item of details.items || []) unlockResource(item.resourceId);
          clearCart();
          setMessage('Payment confirmed. Your purchased guides are now available in your library and purchase history.');
        } else {
          setMessage('Payment confirmed. Your consultation appointment and receipt are saved in your account history.');
        }
        await refreshHistory();
        setState('success');
      } catch (error) {
        setState('error');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.');
      }
    };

    void capturePayment();
  }, [clearCart, draftId, refreshHistory, unlockResource]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-8 text-center">
        {state === 'loading' ? <LoaderCircle className="mx-auto h-10 w-10 text-[#0F766E] dark:text-[#14B8A6]" /> : null}
        {state === 'success' ? <CheckCircle2 className="mx-auto h-10 w-10 text-[#0F766E] dark:text-[#14B8A6]" /> : null}
        {state === 'error' ? <CircleAlert className="mx-auto h-10 w-10 text-[#1E293B] dark:text-[#E2E8F0]" /> : null}
        <h1 className="mt-4 text-2xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
          {state === 'loading' ? 'Confirming payment' : state === 'success' ? 'Payment complete' : 'Payment needs attention'}
        </h1>
        <p role="status" className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state === 'success' ? (
            <button
              onClick={() => setIsCustomerDashboardOpen(true)}
              className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59]"
            >
              View purchase history
            </button>
          ) : null}
          <Link href="/guides" className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] px-4 py-2.5 text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F9FAFB] dark:hover:bg-[#0F172A]">
            Return to health guides
          </Link>
        </div>
        {state === 'error' ? (
          <p className="mt-5 text-xs text-[#64748B] dark:text-[#94A3B8]">Do not pay again if your PayPal activity already shows a completed charge. Contact support with your PayPal receipt.</p>
        ) : null}
      </section>
    </main>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentReturnContent />
    </Suspense>
  );
}
