'use client';

import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';import { QUIZ_QUESTIONS, HEALTH_RESOURCES } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  ShoppingBag,
  HeartPulse,
  Flame,
  Zap,
  Leaf,
  Activity,
  BatteryLow,
  Moon,
  Scale,
  Salad,
  ShieldCheck,
  Clock,
  Calendar,
  FileQuestion,
  Shield,
  TrendingUp
} from 'lucide-react';

// Icon map helper
const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Zap,
  HeartPulse,
  Flame,
  BatteryLow,
  Activity,
  Moon,
  CheckCircle2,
  ShoppingBag,
  Scale,
  Salad,
  ShieldCheck,
  TrendingUp,
  Shield,
  FileQuestion,
  Clock,
  Calendar,
  Award
};

export const HealthQuiz: React.FC = () => {
  const { formatPrice } = useCountryCurrency();
  const { addToCart, openReader } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    nutrition: 0,
    longevity: 0,
    heart: 0,
    fasting: 0,
    detox: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectOption = (points: { category: string; score: number }) => {
    setScores(prev => ({
      ...prev,
      [points.category]: (prev[points.category] || 0) + points.score
    }));

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({
      nutrition: 0,
      longevity: 0,
      heart: 0,
      fasting: 0,
      detox: 0
    });
    setIsFinished(false);
  };

  // Find top category
  const getDominantCategory = () => {
    let topCat = 'nutrition';
    let maxVal = -1;
    Object.entries(scores).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCat = cat;
      }
    });
    return topCat;
  };

  const dominantCat = getDominantCategory();
  
  // Recommend books matching dominant category
  const recommendedPaidResource = HEALTH_RESOURCES.find(r => !r.isFree && (r.category === dominantCat || r.category === 'nutrition')) || HEALTH_RESOURCES[0];
  const recommendedFreeResource = HEALTH_RESOURCES.find(r => r.isFree) || HEALTH_RESOURCES[2];

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <section id="quiz" className="py-20 bg-[#F9FAFB] dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DR. ARIF'S 60-SECOND HEALTH ASSESSMENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Discover Your Personalized Wellness Protocol
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm sm:text-base max-w-xl mx-auto">
            Answer 5 quick clinical questions to diagnose your metabolic profile and uncover the optimal guide tailored to your unique biology.
          </p>
        </div>

        {/* Quiz Card Box */}
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] dark:border-[#334155]">
          
          {!isFinished ? (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                  <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                    {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Completed
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F766E] transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  {currentQ.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const Icon = iconMap[opt.icon] || CheckCircle2;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.points)}
                      className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F9FAFB] dark:bg-[#0F172A]/70 hover:border-[#0F766E] hover:bg-[#E6F4F1] dark:hover:bg-[#134E4A]/50 text-left transition-all duration-200 flex items-start gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] group-hover:text-[#0F766E] dark:hover:text-[#14B8A6] leading-snug pt-1">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Quiz Results Display */
            <div className="space-y-8 animate-fadeIn">
              
              {/* Result Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  Your Personalized Health Blueprint is Ready
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
                  Based on your metabolic audit, Dr. Arif Chowdhury recommends the following primary protocol for rapid results:
                </p>
              </div>

              {/* Recommended Guides Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Free Recommended Guide */}
                <div className="p-5 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A]/70 border border-[#0F766E] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0F766E] text-white text-[10px] font-semibold uppercase mb-2">
                      FREE FOUNDATIONAL COMPONENT
                    </div>
                    <h4 className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      {recommendedFreeResource.title}
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2">
                      {recommendedFreeResource.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6]">100% FREE</span>
                    <button
                      onClick={() => openReader(recommendedFreeResource)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#115E59] transition-colors"
                    >
                      Read Now
                    </button>
                  </div>
                </div>

                {/* 2. Premium Recommended Masterclass */}
                <div className="p-5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-[10px] font-semibold uppercase mb-2">
                      RECOMMENDED CLINICAL MASTERCLASS
                    </div>
                    <h4 className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      {recommendedPaidResource.title}
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2">
                      {recommendedPaidResource.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      {formatPrice(recommendedPaidResource.price)}
                    </span>
                    <button
                      onClick={() => addToCart(recommendedPaidResource)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] text-white text-xs font-semibold hover: transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Reset / Retake */}
              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Health Quiz</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
