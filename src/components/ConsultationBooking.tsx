'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CONSULTATION_PACKAGES } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { Calendar, Video } from 'lucide-react';

export const ConsultationBooking: React.FC = () => {
  const router = useRouter();
  const { addToast } = useCart();
  const { formatPrice } = useCountryCurrency();

  const handleOpenBooking = (pkg: (typeof CONSULTATION_PACKAGES)[number]) => {
    router.push(`/consultation/book?package=${pkg.id}`);
    addToast('Booking page opened', `Opening the ${pkg.title} booking page.`, 'info');
  };

  return (
    <section id="consultation" className="py-20 bg-[#F9FAFB] dark:bg-[#0F172A] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>PRIVATE VIRTUAL CLINIC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Book a 1-on-1 Consultation With Dr. Arif Chowdhury
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-base">
            Work directly with Dr. Arif via high-definition video consultation. Review your blood work,
            uncover the root cause of fatigue or digestive distress, and receive a customized clinical roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONSULTATION_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 transition-colors hover:border-[#0F766E]"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                <Video className="h-4 w-4" />
                <span>{pkg.duration}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{pkg.title}</h3>
              <p className="mt-2 min-h-10 text-sm text-[#64748B] dark:text-[#94A3B8]">{pkg.description}</p>
              <p className="mt-5 text-3xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{formatPrice(pkg.price)}</p>
              <button
                onClick={() => handleOpenBooking(pkg)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#115E59]"
              >
                <Calendar className="h-4 w-4" />
                <span>Choose time</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
