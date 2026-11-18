'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HEALTH_RESOURCES, HEALTH_ARTICLES } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { openReader } = useCart();
  const { formatPrice } = useCountryCurrency();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredGuides = query.trim()
    ? HEALTH_RESOURCES.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        r.highlights.some(h => h.toLowerCase().includes(query.toLowerCase()))
      )
    : HEALTH_RESOURCES.slice(0, 3);

  const filteredArticles = query.trim()
    ? HEALTH_ARTICLES.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.summary.toLowerCase().includes(query.toLowerCase())
      )
    : HEALTH_ARTICLES;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-20 bg-[#0F172A]/70 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search health topics: gut, fasting, longevity, heart, detox..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#1E293B] dark:text-[#E2E8F0] text-base font-normal outline-none placeholder:text-[#64748B] dark:text-[#94A3B8]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8] p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-2 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Quick Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#64748B] dark:text-[#94A3B8] font-semibold shrink-0">Suggestions:</span>
            {['Gut Health', 'Autophagy', 'Mitochondria', 'Blood Pressure', 'Free PDF'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#E6F4F1] dark:hover:bg-[#134E4A] hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Health Guides Match */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>Medical Guides & Books ({filteredGuides.length})</span>
            </h4>

            <div className="space-y-2">
              {filteredGuides.map(r => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-3 hover:border-[#0F766E] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-14 rounded overflow-hidden shrink-0">
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded ${
r.isFree ? 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]' : 'bg-[#E2E8F0] text-[#1E293B] dark:text-[#E2E8F0]'
}`}>
                          {r.isFree ? 'Free PDF' : formatPrice(r.price)}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] truncate">
                        {r.title}
                      </h5>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      openReader(r);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Articles Match */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>Health Articles & Clinical Posts</span>
            </h4>

            <div className="space-y-2">
              {filteredArticles.map(a => (
                <a
                  key={a.id}
                  href="#articles"
                  onClick={onClose}
                  className="block p-3 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#0F766E] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-[#0F766E] dark:text-[#14B8A6] font-semibold mb-1">
                    <span>{a.category}</span>
                    <span>{a.readTime}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                    {a.title}
                  </h5>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1 mt-0.5">
                    {a.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
