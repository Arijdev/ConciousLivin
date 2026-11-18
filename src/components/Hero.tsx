'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartPulse,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calendar,
  Star,
  Play,
  Award,
  ArrowRight,
  Volume2,
  X
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { DOCTOR_INFO } from '@/data/healthData';

export const Hero: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioTeaser = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#F9FAFB] dark:bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold tracking-wide">
              <LogoMark className="h-4 w-4 shrink-0" />
              <span>ConciousLivin HEALTH ACADEMY • DR. ARIF CHOWDHURY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight leading-[1.15]">
              Master Your Health with{' '}
              <span className="text-[#0F766E] dark:text-[#14B8A6]">
                Dr. Arif Chowdhury
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Functional medicine, clinical nutrition, and longevity biohacking simplified. Access verified medical guides, download free eBooks, optimize your metabolism, and book private 1-on-1 health consultations.
            </p>

            {/* Key Clinical Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] bg-[#F1F5F9] dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                <ShieldCheck className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>Evidence-Based Medicine</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] bg-[#F1F5F9] dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                <Award className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>1+ Years Clinical Practice</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] bg-[#F1F5F9] dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                <Star className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6] fill-[#0F766E]" />
                <span>4.95/5 Rating (2k+ Reviews)</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/#guides"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#0F766E] text-white font-semibold text-base transition-colors hover:bg-[#115E59]"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Health Guides & Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="/quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] font-semibold text-base border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
              >
                <Sparkles className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>Take 60s Health Quiz</span>
              </a>
            </div>

            {/* Audio Quote Banner */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#E2E8F0] dark:border-[#334155] text-xs text-[#1E293B] dark:text-[#E2E8F0]">
                <button
                  onClick={toggleAudioTeaser}
                  className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center hover:bg-[#115E59] transition-colors shrink-0"
                  aria-label="Play Dr. Arif audio message"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="italic">
                  {isPlayingAudio
                    ? '“Your genes load the gun, but lifestyle pulls the trigger. You have the power to heal.” — Dr. Arif Chowdhury'
                    : 'Listen to Dr. Arif’s 10-second daily clinical mindset rule'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Spotlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white dark:bg-[#1E293B] rounded-3xl p-4 border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">

              {/* Doctor Portrait Image Container */}
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                <Image
                  src="/images/dr_arif.jpg"
                  alt="Dr. Arif Chowdhury - Health Tutor & Cardiometabolic Physician"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover object-top"
                  priority
                />

                {/* Floating Video Preview Button */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] dark:hover:bg-[#0F172A] text-white text-xs font-semibold border border-[#334155] transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0F766E] flex items-center justify-center text-white">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </div>
                  <span>Watch Dr. Arif Intro (2 Min)</span>
                </button>

                {/* Floating Status Badge */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F766E] text-white text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Accepting Consultations</span>
                </div>
              </div>

              {/* Doctor Details Bar */}
              <div className="p-4 pt-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      {DOCTOR_INFO.name}
                    </h3>
                    <p className="text-xs text-[#0F766E] dark:text-[#14B8A6] font-semibold mt-0.5">
                      {DOCTOR_INFO.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#0F766E] text-[#0F766E] dark:text-[#14B8A6]" />
                      <span>{DOCTOR_INFO.rating}</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">2k+ reviews</span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                  {DOCTOR_INFO.tagline}
                </p>

                {/* Quick Consultation CTA */}
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                    Next slot: Tomorrow
                  </span>
                  <a
                    href="/consultation"
                    className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] hover:text-[#115E59] dark:hover:text-[#0D9488] flex items-center gap-1"
                  >
                    <span>Book 1-on-1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Video Greeting Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B] animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155]">
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />
                <span className="font-semibold text-sm">A Message from Dr. Arif Chowdhury</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <video
                src="/intro.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="p-8 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#0F766E]">
                <Image
                  src="/images/dr_arif.jpg"
                  alt="Dr. Arif Chowdhury"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex justify-center gap-4">
                <Link
                  href="/guides"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold transition-colors"
                >
                  Start Exploring Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
