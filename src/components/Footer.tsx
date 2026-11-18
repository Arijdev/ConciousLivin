'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOCTOR_INFO, FAQS } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { 
  HeartPulse, 
  ChevronDown, 
  Mail, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Phone, 
  MapPin,
  ExternalLink,
  Radio,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    addToast('Subscribed!', 'Welcome to Dr. Arif Chowdhury’s Weekly Longevity Protocol.', 'success');
  };

  return (
    <footer className="bg-[#F1F5F9] dark:bg-[#1E293B]/70 text-[#1E293B] dark:text-[#E2E8F0] pt-20 pb-12 border-t border-[#E2E8F0] dark:border-[#334155] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
              Clinical, Guide & Purchase Details
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
              Clear answers regarding our health guides, digital access, and consultation procedures.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  suppressHydrationWarning
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#1E293B] dark:text-[#E2E8F0] hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#0F766E] dark:text-[#14B8A6] transition-transform duration-200 shrink-0 ${openFaq === idx ? '' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed border-t border-[#E2E8F0] dark:border-[#334155]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#1E293B] border border-[#334155] text-center space-y-4 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase">
            <Mail className="w-3.5 h-3.5" />
            <span>WEEKLY CLINICAL INSIGHTS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-semibold">
            Join 35,000+ Readers on Dr. Arif’s Longevity Protocol
          </h3>
          <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
            Get an actionable 3-minute medical breakdown every Sunday morning on reversing biological age, gut microbiome optimization, and free health PDF updates.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                suppressHydrationWarning
                className="flex-1 px-4 py-3 rounded-xl bg-white text-[#1E293B] text-xs border border-[#334155] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Subscribe Free</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-white text-xs font-semibold inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! You are now subscribed to the Sunday Protocol.</span>
            </div>
          )}
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-[#E2E8F0] dark:border-[#334155] text-xs">
          
          {/* Col 1: Doctor Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0] block leading-tight">
                  ConciousLivin HEALTH ACADEMY
                </span>
                <span className="text-xs text-[#0F766E] dark:text-[#14B8A6] font-semibold">
                  {DOCTOR_INFO.name}, MD
                </span>
              </div>
            </div>
            <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-md">
              {DOCTOR_INFO.tagline}
            </p>
            <div className="pt-2 text-[#64748B] dark:text-[#94A3B8] space-y-1">
              <p>📍 {DOCTOR_INFO.clinicLocation}</p>
              <p>✉️ {DOCTOR_INFO.email}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0] uppercase tracking-wider text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-[#64748B] dark:text-[#94A3B8] font-normal">
              <li><a href="#guides" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Free PDF Downloads</a></li>
              <li><a href="#guides" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Premium Health eBooks</a></li>
              <li><a href="/calculators" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">BMI & Hydration Calculators</a></li>
              <li><a href="/quiz" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">Health Diagnostic Quiz</a></li>
              <li><a href="/consultation" className="hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors">1-on-1 Consultation Booking</a></li>
            </ul>
          </div>

          {/* Col 3: Medical Topics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1E293B] dark:text-[#E2E8F0] uppercase tracking-wider text-xs">
              Health Focus Areas
            </h4>
            <ul className="space-y-2 text-[#64748B] dark:text-[#94A3B8] font-normal">
              <li>Clinical Nutrition & Leaky Gut</li>
              <li>Autophagy & Intermittent Fasting</li>
              <li>Mitochondria & Cellular Biohacking</li>
              <li>Cardiometabolic & Nitric Oxide</li>
              <li>Circadian Sleep Alignment</li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#334155] text-[11px] text-[#64748B] dark:text-[#94A3B8] space-y-3 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B]/80 border border-[#E2E8F0] dark:border-[#334155] flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#1E293B] dark:text-[#E2E8F0] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#1E293B] dark:text-[#E2E8F0]">Medical Disclaimer:</strong> The content, PDF guides, calculators, and protocols published on this website are authored for educational and informative purposes only. They are not intended as a substitute for individualized clinical diagnosis, medical evaluation, or treatment by a licensed physician. Always seek the advice of your personal physician or other qualified healthcare provider before initiating any new dietary, fasting, or supplement regimen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p className="text-[#64748B] dark:text-[#94A3B8] font-normal">
              © {new Date().getFullYear()} ConciousLivin Health Academy — Dr. Arif Chowdhury. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 text-[#64748B] dark:text-[#94A3B8]">
              <span className="hover:text-[#1E293B] dark:hover:text-[#E2E8F0] cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-[#1E293B] dark:hover:text-[#E2E8F0] cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-[#1E293B] dark:hover:text-[#E2E8F0] cursor-pointer">Digital Product Refund Policy</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
