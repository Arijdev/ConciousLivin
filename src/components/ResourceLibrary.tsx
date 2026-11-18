'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HealthResource } from '@/types/health';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { 
  BookOpen, 
  Download, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  Check, 
  Tag, 
  ExternalLink,
  ShieldCheck,
  Eye,
  Lock
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { PdfPreviewModal } from './PdfPreviewModal';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

interface ResourceLibraryProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ 
  searchQuery: externalQuery = '', 
  onClearSearch 
}) => {
  const { formatPrice } = useCountryCurrency();
  const { resources, addToCart, isResourceUnlocked, openReader, downloadResourceDoc } = useCart();
  const { isDoctor, setIsDoctorPortalOpen, isAuthenticated } = useAuth();
  const [internalQuery, setInternalQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'price-high'>('popular');
  const [pdfPreviewResource, setPdfPreviewResource] = useState<HealthResource | null>(null);

  const activeSearch = externalQuery || internalQuery;

  const freeCount = resources.filter(r => r.isFree).length;
  const paidCount = resources.filter(r => !r.isFree).length;

  const categories = [
    { id: 'all', label: `All Guides (${resources.length})` },
    { id: 'free', label: `Free Downloads 🎁 (${freeCount})` },
    { id: 'paid', label: `Premium eBooks 🛒 (${paidCount})` },
    { id: 'nutrition', label: 'Nutrition & Gut' },
    { id: 'longevity', label: 'Longevity & Cellular' },
    { id: 'heart', label: 'Heart & Blood Pressure' },
    { id: 'fasting', label: 'Intermittent Fasting' },
    { id: 'detox', label: 'Metabolic Reset' },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Category filter
      if (activeCategory === 'free' && !resource.isFree) return false;
      if (activeCategory === 'paid' && resource.isFree) return false;
      if (
        activeCategory !== 'all' && 
        activeCategory !== 'free' && 
        activeCategory !== 'paid' && 
        resource.category !== activeCategory
      ) {
        return false;
      }

      // Search filter
      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesSubtitle = resource.subtitle.toLowerCase().includes(query);
        const matchesDesc = resource.description.toLowerCase().includes(query);
        const matchesHighlights = resource.highlights.some(h => h.toLowerCase().includes(query));
        return matchesTitle || matchesSubtitle || matchesDesc || matchesHighlights;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [resources, activeCategory, activeSearch, sortBy]);

  return (
    <section id="guides" className="py-20 bg-[#F9FAFB] dark:bg-[#0F172A] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CLINICAL RESOURCE LIBRARY & STORE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] tracking-tight">
            Medical Health Guides & eBooks by Dr. Arif Chowdhury
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-base sm:text-lg">
            Dive into science-backed medical protocols. Access our complimentary free PDF guides or purchase comprehensive clinical masterclasses with instant lifetime digital access.
          </p>
        </div>

        {/* Controls Bar: Search, Category Tabs, Sort */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-[#E2E8F0] dark:border-[#334155] mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search guides, gut health, fasting..."
                value={activeSearch}
                onChange={e => setInternalQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] text-sm border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {activeSearch && (
                <button
                  onClick={() => {
                    setInternalQuery('');
                    if (onClearSearch) onClearSearch();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#F9FAFB] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-normal border border-[#E2E8F0] dark:border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated ★</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-thin pt-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
activeCategory === cat.id
? 'bg-[#0F766E] text-white'
: 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]'
}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] p-8">
            <BookOpen className="w-12 h-12 text-[#64748B] dark:text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0]">No health guides found</h3>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
              Try adjusting your search query or switching category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setInternalQuery('');
                if (onClearSearch) onClearSearch();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredResources.map(resource => {
              const unlocked = isResourceUnlocked(resource.id);

              return (
                <div
                  key={resource.id}
                  className="flex flex-col bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] hover:border-[#0F766E] transition-colors group"
                >
                  {/* Book Cover Area */}
                  <div className="relative w-full aspect-[3/4] max-h-80 bg-[#1E293B] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                    
                    {/* Badge */}
                    {resource.isFree ? (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#0F766E] text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>100% Free Guide</span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wider uppercase border border-white/25 backdrop-blur-none">
                        {resource.badge || 'Premium Masterclass'}
                      </div>
                    )}

                    {/* Unlocked status badge */}
                    {unlocked && (
                      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-[#0F766E]/90 text-white text-[11px] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Unlocked</span>
                      </div>
                    )}

                    {/* 3D Cover Image with tilt effect */}
                    <div className="relative w-full max-w-48 h-full max-h-64 rounded-lg overflow-hidden">
                      <Image
                        src={resource.coverImage}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <button
                      onClick={() => openReader(resource)}
                      className="absolute inset-0 bg-[#0F172A]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-semibold text-xs transition-opacity"
                    >
                      <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 flex items-center gap-2 hover:bg-white/30">
                        <Eye className="w-4 h-4" />
                        <span>Quick Look & Chapters</span>
                      </div>
                    </button>
                  </div>

                  {/* Book Details Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta Info: Rating & Pages */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                        <div className="flex items-center gap-1 font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                          <Star className="w-4 h-4 fill-[#0F766E] text-[#0F766E]" />
                          <span>{resource.rating}</span>
                          <span className="text-[#64748B] dark:text-[#94A3B8] font-normal">({resource.reviewCount.toLocaleString()})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                            {resource.pages} pgs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                            {resource.readingTime}
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0] group-hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors line-clamp-1">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                          {resource.subtitle}
                        </p>
                      </div>

                      {/* Highlights checklist */}
                      <div className="space-y-1.5 pt-1">
                        {resource.highlights.slice(0, 3).map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Area */}
                    <div className="space-y-3 border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
                      <div className="min-w-0">
                        {resource.isFree ? (
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span className="text-xl font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                                FREE
                              </span>
                              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] line-through">
                                {formatPrice(resource.originalPrice || 0)}
                              </span>
                          </div>
                        ) : (
                          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-xl font-semibold text-[#1E293B] dark:text-[#E2E8F0] sm:text-2xl">
                              {formatPrice(resource.price)}
                            </span>
                            {resource.originalPrice && (
                              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] line-through">
                                {formatPrice(resource.originalPrice)}
                              </span>
                            )}
                            <span className="rounded bg-[#F1F5F9] dark:bg-[#1E293B] px-1.5 py-0.5 text-[10px] font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                              SAVE 50%
                            </span>
                          </div>
                        )}
                        <p className="mt-1 text-[11px] font-normal text-[#64748B] dark:text-[#94A3B8]">
                          Digital PDF + Web Reader
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Button 1: Read Online / Preview */}
                        <button
                          onClick={() => openReader(resource)}
                          className="flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] px-2 py-2.5 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition-colors hover:bg-[#E2E8F0] sm:px-3"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                            <span className="text-center leading-tight">{unlocked ? 'Read Full' : 'Read Preview'}</span>
                        </button>

                        {/* Button 2: Free Download OR Add to Cart / Unlocked Download */}
                        {resource.isFree ? (
                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            disabled={!isAuthenticated}
                            className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:px-3 ${
isAuthenticated
? 'bg-[#0F766E] hover:bg-[#115E59] text-white'
: 'bg-[#E2E8F0] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed opacity-70'
}`}
                            title={isAuthenticated ? '' : 'Please log in to download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-center leading-tight">{isAuthenticated ? 'Download PDF' : 'Sign in to download'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        ) : unlocked ? (
                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            disabled={!isAuthenticated}
                            className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:px-3 ${
isAuthenticated
? 'bg-[#0F766E] hover:bg-[#115E59] text-white'
: 'bg-[#E2E8F0] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed opacity-70'
}`}
                            title={isAuthenticated ? '' : 'Please log in to download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-center leading-tight">{isAuthenticated ? 'Download' : 'Sign in to download'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(resource)}
                            disabled={!isAuthenticated}
                            className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:px-3 ${
isAuthenticated
? 'bg-[#0F766E] hover:bg-[#115E59] text-white'
: 'bg-[#E2E8F0] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed opacity-70'
}`}
                            title={isAuthenticated ? '' : 'Please log in to add to cart'}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span className="text-center leading-tight">{isAuthenticated ? 'Add to Cart' : 'Sign in to buy'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Promo Code Banner in Store */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#1E293B] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-white" />
              <span>SPECIAL ACADEMY DISCOUNT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold">
              Get 50% Off Any Premium Guide Today
            </h3>
            <p className="text-[#CBD5E1] text-xs sm:text-sm">
              Use promo code <strong className="underline text-white tracking-wider">ARIF50</strong> at checkout for instant savings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white/10 rounded-xl border border-white/25 text-sm font-mono font-semibold tracking-widest text-white">
              ARIF50
            </div>
            <a
              href="#guides"
              className="px-5 py-2.5 rounded-xl bg-[#0F766E] text-white font-semibold text-xs hover:bg-[#115E59] transition-colors"
            >
              Browse Books
            </a>
          </div>
        </div>

</div>

      {pdfPreviewResource && pdfPreviewResource.pdfFileName && (
        <PdfPreviewModal
          pdfUrl={pdfPreviewResource.pdfFileName}
          title={pdfPreviewResource.title}
          onClose={() => setPdfPreviewResource(null)}
          onDownload={() => downloadResourceDoc(pdfPreviewResource!)}
        />
      )}
      </section>
    );
  };
