'use client';

import React from 'react';
import Image from 'next/image';
import { DOCTOR_INFO } from '@/data/healthData';
import { 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  HeartHandshake, 
  BookOpen, 
  Sparkles,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

export const AboutDoctor: React.FC = () => {
  const pillars = [
    {
      title: "Root-Cause Functional Medicine",
      desc: "Investigating deep metabolic, cellular, and endocrine imbalances rather than simply prescribing temporary symptom-suppressing drugs."
    },
    {
      title: "Microbiome & Gut Restoration",
      desc: "Rebuilding mucosal endothelial barriers, microbial diversity, and digestive enzyme pathways that fuel 70% of human immunity."
    },
    {
      title: "Mitochondrial Biohacking & Longevity",
      desc: "Utilizing Zone 2 cardio, thermal hormesis (sauna & cold), and NAD+ optimization to multiply cellular ATP energy output."
    },
    {
      title: "Circadian Alignment & Deep Sleep",
      desc: "Synchronizing hypothalamic suprachiasmatic nucleus rhythms through natural morning sunlight and blue-light blocking protocols."
    }
  ];

  return (
    <section id="about-doctor" className="py-20 bg-white dark:bg-[#1E293B] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Doctor Visual & Accreditations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] bg-[#F1F5F9] dark:bg-[#1E293B]">
              <Image
                src="/images/dr_arif.jpg"
                alt="Dr. Arif Chowdhury MD"
                fill
                className="object-cover object-top"
              />
              
              <div className="absolute inset-x-0 bottom-0 bg-[#1E293B] p-6 text-white">
                <span className="text-[#14B8A6] font-semibold text-xs uppercase tracking-wider">
                  Senior Health Tutor & Physician
                </span>
                <h3 className="text-2xl font-semibold">{DOCTOR_INFO.name}</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">{DOCTOR_INFO.title}</p>
              </div>
            </div>

            {/* Certifications Box */}
            <div className="p-5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>Verified Medical Credentials</span>
              </h4>
              <div className="space-y-2">
                {DOCTOR_INFO.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1E293B] dark:text-[#E2E8F0]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bio & Clinical Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>MEET YOUR HEALTH TUTOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
                A Mission to Democratize Science-Based Longevity
              </h2>
            </div>

            <div className="prose text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed space-y-4">
              <p>
                {DOCTOR_INFO.bio}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>The 4 Pillars of Dr. Arif’s Clinical Approach:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-1"
                  >
                    <h5 className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                      {idx + 1}. {pillar.title}
                    </h5>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinic Details */}
            <div className="p-4 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A]/60 border border-[#0F766E] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1E293B] dark:text-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                <span>{DOCTOR_INFO.clinicLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                <span>{DOCTOR_INFO.hours}</span>
              </div>
            </div>

            {/* Consultation Anchor Button */}
            <div className="pt-2">
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E293B] text-white font-semibold text-xs hover:bg-[#334155] dark:hover:bg-[#0F172A] transition-colors"
              >
                <span>Schedule a Clinical Consultation With Dr. Arif</span>
                <HeartHandshake className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
