'use client';

import React from 'react';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function GuidesPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pt-28 pb-20 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CLINICAL RESOURCE LIBRARY & STORE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Medical Health Guides & eBooks
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-lg">
            Dive into science-backed medical protocols. Access our complimentary free PDF guides or purchase comprehensive clinical masterclasses with instant lifetime digital access.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Sparkles, label: 'Evidence-Based', desc: 'Peer-reviewed protocols' },
            { icon: ShieldCheck, label: 'Doctor Authored', desc: 'By Dr. Arif Chowdhury MD' },
            { icon: BookOpen, label: 'Instant Access', desc: 'PDF + Web Reader' },
            { icon: ArrowRight, label: 'Lifetime Updates', desc: 'Free future revisions' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center">
              <item.icon className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6] mx-auto mb-2" />
              <h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{item.label}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Library */}
      <ResourceLibrary />
    </section>
  );
}