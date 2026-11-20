'use client';

import React from 'react';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { Testimonials } from '@/components/Testimonials';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { BookOpen, CheckCircle2, Sparkles, Shield, HeartPulse, ArrowRight, Stethoscope, Star, Calculator, Brain, FileText, Users, Award, BookOpenCheck, HeartHandshake } from 'lucide-react';
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

function TrendingGuides() {
  const { formatPrice } = useCountryCurrency();
  const { resources } = useCart();

  const trending = [...resources]
    .sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating))
    .slice(0, 3);

  const badgeStyle: Record<string, { bg: string; text: string }> = {
    emerald: { bg: '#D1FAE5', text: '#065F46' },
    indigo: { bg: '#E0E7FF', text: '#3730A3' },
    rose: { bg: '#FFE4E6', text: '#9F1239' },
    amber: { bg: '#FFEDD5', text: '#92400E' },
    violet: { bg: '#F3E8FF', text: '#5B21B6' },
    default: { bg: '#E6F4F1', text: '#0F766E' }
  };

  return (
    <section className="py-20 bg-white dark:bg-[#0F172A]" id="guides">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRENDING GUIDES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight mt-2">
              Top 3 Clinical Guides This Month
            </h2>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6] hover:bg-[#E6F4F1] dark:hover:bg-[#134E4A] transition-colors"
          >
            View All Guides
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((resource) => {
            const bStyle = badgeStyle[resource.badgeColor || 'default'] || badgeStyle.default;
            return (
              <article key={resource.id} className="group flex flex-col bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden transition-colors hover:border-[#0F766E]">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={resource.coverImage}
                    alt={resource.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {resource.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                            style={{ backgroundColor: bStyle.bg, color: bStyle.text }}>
                        {resource.badge}
                      </span>
                    </div>
                  )}
                  {!resource.isFree && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 rounded-full bg-[#FEF2F2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] text-[10px] font-semibold uppercase tracking-wider">
                        Premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#F59E0B' }} />
                      <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{resource.rating}</span>
                    </div>
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">({resource.reviewCount.toLocaleString()})</span>
                    <span className="w-px h-4 mx-2 bg-[#E2E8F0] dark:bg-[#334155]" />
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{resource.pages} pages</span>
                    <span className="w-px h-4 mx-2 bg-[#E2E8F0] dark:bg-[#334155]" />
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{resource.readingTime}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0] line-clamp-2 group-hover:text-[#0F766E] transition-colors mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-3">
                    {resource.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
                    <div className="flex items-center gap-1.5">
                      {resource.isFree ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#D1FAE5] dark:bg-[#064E3B] text-[#065F46] dark:text-[#A7F3D0] text-xs font-semibold">
                          <BookOpen className="w-3 h-3" />
                          Free
                        </span>
                      ) : (
                        <span className="text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                          {formatPrice(resource.price)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => window.location.href = `/guides#${resource.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] hover:bg-[#E6F4F1] dark:hover:bg-[#134E4A] transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-sm transition-colors"
          >
            View All Guides
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

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

      {/* Trending Guides Preview - Top 3 */}
      <TrendingGuides />

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