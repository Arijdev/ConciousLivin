'use client';

import React from 'react';
import { HealthQuiz } from '@/components/HealthQuiz';
import { 
  Brain, 
  ShieldCheck,
  ClipboardList,
  Target,
  Zap,
  HeartPulse
} from 'lucide-react';

const quizBenefits = [
  { icon: Brain, title: 'Personalized Protocol', desc: 'Tailored nutrition, supplement & lifestyle plan' },
  { icon: Target, title: 'Root Cause Analysis', desc: 'Identifies primary health bottlenecks' },
  { icon: Zap, title: '60-Second Completion', desc: 'Evidence-based adaptive questioning' },
  { icon: ClipboardList, title: 'Actionable Steps', desc: 'Immediate 7-day implementation plan' },
  { icon: ShieldCheck, title: 'Clinical Validity', desc: 'Based on functional medicine principles' },
  { icon: HeartPulse, title: 'Progress Tracking', desc: 'Re-assess monthly to measure improvement' },
];

export default function QuizPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pt-28 pb-20 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>60-SECOND TAILORED HEALTH ASSESSMENT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Discover Your Personalized Health Blueprint
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-lg">
            Answer 12 clinical questions. Get a complete protocol targeting your #1 health bottleneck with nutrition, supplements & lifestyle steps.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {quizBenefits.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center hover:border-[#0F766E] transition-colors">
              <item.icon className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6] mx-auto mb-2" />
              <h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{item.title}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Component */}
      <HealthQuiz />
    </section>
  );
}