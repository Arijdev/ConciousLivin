'use client';

import React from 'react';
import { HealthArticles } from '@/components/HealthArticles';

export default function ArticlesPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pb-12 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6]">Articles & research</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-4xl">
            Clear guidance for better health decisions
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
            Browse practical, evidence-informed explainers. Search a topic or choose a subject to find a useful place to start.
          </p>
        </div>

        <HealthArticles />
      </div>
    </section>
  );
}