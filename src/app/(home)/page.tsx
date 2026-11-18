'use client';

import React from 'react';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { Testimonials } from '@/components/Testimonials';
import {
  BookOpen,
  Calculator,
  Brain,
  FileText,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  HeartPulse,
  Users,
  Award,
  BookOpenCheck,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: BookOpen,
    title: 'Clinical Health Guides',
    description: 'Evidence-based PDF guides on nutrition, longevity, heart health, fasting & detox by Dr. Arif Chowdhury',
    href: '/guides',
  },
  {
    icon: Calculator,
    title: 'Health Calculators',
    description: 'Interactive clinical tools for BMI, BMR, body fat, macro tracking, hydration & cardiovascular risk',
    href: '/calculators',
  },
  {
    icon: Brain,
    title: 'Health Assessment Quiz',
    description: '60-second personalized health assessment with tailored recommendations & action plans',
    href: '/quiz',
  },
  {
    icon: FileText,
    title: 'Clinical Articles',
    description: 'Peer-reviewed medical articles, research summaries & protocol masterclasses',
    href: '/articles',
  },
  {
    icon: Stethoscope,
    title: 'Virtual Consultations',
    description: 'Book 1-on-1 video consultations with Dr. Arif for personalized clinical guidance',
    href: '/consultation',
  },
  {
    icon: HeartPulse,
    title: 'About Dr. Arif',
    description: 'Learn about Dr. Arif Chowdhury\'s clinical philosophy, credentials & patient success stories',
    href: '/about',
  },
] as const;

const trustMarkers = [
  { icon: Users, value: '12,480+', label: 'Patients Guided', desc: 'Across 42+ Countries' },
  { icon: BookOpenCheck, value: '54,820+', label: 'Free Guides Downloaded', desc: 'Evidence-Based PDFs' },
  { icon: Award, value: '28', label: 'Clinical Protocols', desc: 'Published & Peer-Reviewed' },
  { icon: HeartHandshake, value: '4.96/5', label: 'Patient Rating', desc: 'Verified Clinical Outcomes' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Trust Markers */}
      <StatsBar stats={trustMarkers} />

      {/* Features Grid - Quick Access to All Pages */}
      <section className="py-20 bg-[#F9FAFB] dark:bg-[#0F172A]" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE ConciousLivin ACADEMY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
              Your Complete Clinical Health Platform
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-base sm:text-lg">
              Access science-backed medical protocols, interactive tools, and personalized guidance — all curated by Dr. Arif Chowdhury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group flex h-full flex-col p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] transition-colors hover:border-[#0F766E]"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F1F5F9] dark:bg-[#0F172A] flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6]" />
                    </div>

                    <h3 className="text-xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      {feature.title}
                    </h3>

                    <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6] pt-2">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Preview */}
      <div id="guides" className="scroll-mt-24">
        <ResourceLibrary showSearch={false} />
      </div>

      {/* Patient Success Stories */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-[#1E293B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>MEDICAL DISCLAIMER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Ready to Transform Your Health?
          </h2>
          <p className="text-[#E2E8F0] text-lg sm:text-xl max-w-2xl mx-auto">
            Join 12,000+ patients using Dr. Arif&apos;s clinical protocols. Start with free guides or book a personalized consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Browse Free Guides
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-transparent text-white border border-white/30 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}