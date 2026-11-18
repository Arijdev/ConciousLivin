'use client';

import React from 'react';
import { Users, BookOpenCheck, Award, HeartHandshake} from 'lucide-react';
import { DOCTOR_INFO } from '@/data/healthData';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  desc: string;
}

interface StatsBarProps {
  stats?: StatItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats: customStats }) => {
  const defaultStats: StatItem[] = [
    {
      icon: Users,
      value: DOCTOR_INFO.patientsTransformed,
      label: "Patients & Students Mentored",
      desc: "Across 42+ Countries Worldwide"
    },
    {
      icon: Award,
      value: DOCTOR_INFO.yearsExperience,
      label: "Years Clinical Experience",
      desc: "Hospital & Functional Medicine"
    },
    {
      icon: BookOpenCheck,
      value: "8+ Best-Selling",
      label: "Clinical Health Guides",
      desc: "Free & Premium Medical Manuals"
    },
    {
      icon: HeartHandshake,
      value: "98.4%",
      label: "Clinical Satisfaction",
      desc: "Verified Patient Outcomes"
    }
  ];

  const stats = customStats || defaultStats;

  return (
    <section className="border-y border-[#E2E8F0] dark:border-[#334155] bg-[#F9FAFB] dark:bg-[#0F172A]/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 border border-[#E2E8F0] dark:border-[#334155] hover:border-[#0F766E] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mb-3 group-hover:bg-[#0F766E] group-hover:text-white transition-all">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  {stat.desc}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
