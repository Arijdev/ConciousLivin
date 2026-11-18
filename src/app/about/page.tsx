'use client';

import React from 'react';
import { AboutDoctor } from '@/components/AboutDoctor';
import { 
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Stethoscope,
  Clock
} from 'lucide-react';

const credentials = [
  { icon: GraduationCap, title: 'MBBS', desc: 'Bachelor of Medicine, Bachelor of Surgery' },
  { icon: Award, title: 'M.S. Clinical Nutrition', desc: 'Master of Science in Clinical Nutrition' },
  { icon: Stethoscope, title: '15+ Years Practice', desc: 'Internal Medicine & Functional Nutrition' },
  { icon: Users, title: '12,000+ Patients', desc: 'Successfully guided through clinical protocols' },
  { icon: BookOpen, title: '28 Published Protocols', desc: 'Evidence-based clinical guides & masterclasses' },
  { icon: Clock, title: 'Ongoing Research', desc: 'Active in longevity & metabolic health research' },
];

const philosophy = [
  'Root Cause Over Symptom Management: Identify and address the fundamental drivers of dysfunction rather than masking symptoms.',
  'Food as Information: Nutrients are signaling molecules that regulate gene expression, hormone function, and cellular repair.',
  'Mitochondria First: Cellular energy production is the foundation of all physiological function and longevity.',
  'Personalization Over Protocols: Every patient has unique genetics, epigenetics, and environmental exposures requiring tailored approaches.',
  'Measurement Drives Management: Track biomarkers, subjective metrics, and functional outcomes to guide clinical decisions.',
  'Sustainable Systems Over Quick Fixes: Build resilient daily habits that compound over decades, not 30-day challenges.',
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pt-28 pb-20 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>ABOUT DR. ARIF CHOWDHURY MD</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Clinical Excellence Meets Root Cause Medicine
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-lg">
            Bridging conventional internal medicine with cutting-edge functional nutrition for sustainable health transformation.
          </p>
        </div>

        {/* Credentials */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {credentials.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center hover:border-[#E2E8F0] dark:hover:border-[#334155] transition-colors">
              <item.icon className="w-6 h-6 text-[#1E293B] dark:text-[#E2E8F0] mx-auto mb-2" />
              <h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{item.title}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Clinical Philosophy */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
              Clinical Philosophy
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mt-2">
              Six pillars that guide every patient interaction and protocol design
            </p>
          </div>
          <div className="space-y-4">
            {philosophy.map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] flex items-center justify-center">
                  <span className="text-[#1E293B] dark:text-[#E2E8F0] font-semibold text-lg">{i + 1}</span>
                </div>
                <p className="text-[#1E293B] dark:text-[#E2E8F0] pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Doctor Component */}
      <AboutDoctor />
    </section>
  );
}