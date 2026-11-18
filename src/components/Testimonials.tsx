'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/healthData';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>REAL PATIENT TRANSFORMATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Verified Clinical Success Stories
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-base">
            See how individuals transformed their health, reversed metabolic markers, and reclaimed natural vitality through Dr. Arif Chowdhury's protocols.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between space-y-6 transition-colors"
            >
              <div className="space-y-4">
                {/* Top: Avatar & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#0F766E] shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                          {t.name}
                        </h4>
                        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">({t.age} yrs)</span>
                      </div>
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {t.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#0F766E] text-[#0F766E]" />
                    ))}
                  </div>
                </div>

                {/* Clinical Result Pill */}
                <div className="p-3 rounded-xl bg-[#0F766E]/10 border border-[#0F766E] text-xs">
                  <div className="font-semibold text-[#0F766E] dark:text-[#14B8A6] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                    <span>Clinical Outcome:</span>
                  </div>
                  <p className="text-[#0F766E] dark:text-[#14B8A6] font-semibold mt-0.5">
                    {t.result}
                  </p>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Verified Marker */}
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                <span>Initial Condition: <strong>{t.condition}</strong></span>
                <span className="inline-flex items-center gap-1 text-[#0F766E] dark:text-[#14B8A6] font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Patient
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
