'use client';

import React from 'react';
import { HealthCalculators } from '@/components/HealthCalculators';
import { 
  Calculator, 
  Sparkles, 
  ShieldCheck,
  Brain,
  Heart,
  Droplet,
  Weight,
  Activity
} from 'lucide-react';

const calculatorTypes = [
  { icon: Weight, title: 'BMI Calculator', desc: 'Body Mass Index with clinical interpretation' },
  { icon: Activity, title: 'BMR & TDEE', desc: 'Basal Metabolic Rate & Total Daily Energy Expenditure' },
  { icon: Heart, title: 'Body Fat %', desc: 'Navy Method & Clinical Estimation' },
  { icon: Brain, title: 'Macro Calculator', desc: 'Protein, Carbs, Fat targets by goal' },
  { icon: ShieldCheck, title: 'Hydration Needs', desc: 'Daily water intake by weight & activity' },
  { icon: Droplet, title: 'Cardiovascular Risk', desc: '10-year ASCVD Risk Estimation' },
  { icon: Calculator, title: 'Ideal Body Weight', desc: 'Devine, Robinson, Miller formulas' },
  { icon: Sparkles, title: 'Waist-to-Hip Ratio', desc: 'Metabolic Health Risk Indicator' },
];

export default function CalculatorsPage() {
  return (
    <section className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] pt-28 pb-20 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE CLINICAL HEALTH CALCULATORS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Precision Health Diagnostics
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-lg">
            Clinical-grade calculators for metabolic health, body composition, cardiovascular risk & nutrition planning.
          </p>
        </div>

        {/* Calculator Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {calculatorTypes.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-center hover:border-[#0F766E] transition-colors">
              <item.icon className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6] mx-auto mb-2" />
              <h3 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{item.title}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calculators */}
      <HealthCalculators />
    </section>
  );
}