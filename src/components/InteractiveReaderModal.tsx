'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

import { 
  X, 
  BookOpen, 
  Download, 
  ShoppingBag, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Coffee,
  Lock,
  Bookmark,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

interface LibraryItem {
  id: string;
  user_id: string;
  resource_id: string;
  claimed_at: string;
  last_read_at: string | null;
  last_read_chapter: number;
  reading_progress: Record<string, unknown>;
}

export const InteractiveReaderModal: React.FC = () => {
  const { formatPrice } = useCountryCurrency();
  const { 
    activeReaderResource: resource, 
    closeReader, 
    isResourceUnlocked, 
    addToCart, 
    downloadResourceDoc,
    claimBook,
    isBookClaimed
  } = useCart();

  const [activeTab, setActiveTab] = useState<'reader' | 'toc' | 'protocol'>('reader');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [lastReadChapter, setLastReadChapter] = useState(0);

  // Check if book is claimed in library
  useEffect(() => {
    if (!resource) return;
    const checkClaimed = async () => {
      try {
        const response = await fetch(`/api/library/claim?id=${resource.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsClaimed(data.inLibrary);
          if (data.libraryItem) {
            setLastReadChapter(data.libraryItem.last_read_chapter || 0);
          }
        }
      } catch (error) {
        console.error('Failed to check library status:', error);
      }
    };
    checkClaimed();
  }, [resource?.id]);

  // Save progress when chapter changes
  useEffect(() => {
    if (!resource || !isClaimed) return;
    handleSaveProgress(activeChapterIndex);
  }, [resource?.id, activeChapterIndex, isClaimed]);

  if (!resource) return null;

  const isUnlocked = isResourceUnlocked(resource.id);
  const chapters = resource.fullContent.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleClaim = async () => {
    if (isClaiming || isClaimed) return;
    setIsClaiming(true);
    setClaimError(null);
    try {
      const response = await fetch('/api/library/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resourceId: resource.id,
          claimedFrom: 'reader'
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsClaimed(true);
        claimBook(resource.id);
      } else {
        setClaimError(data.message || 'Failed to claim book');
      }
    } catch (error) {
      setClaimError('Failed to claim book. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSaveProgress = async (chapterIndex: number) => {
    setLastReadChapter(chapterIndex);
    try {
      await fetch('/api/library/claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resourceId: resource.id,
          lastReadChapter: chapterIndex,
        }),
      });
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const themeClasses = {
    light: 'bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] border-[#E2E8F0] dark:border-[#334155]',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e6d5b8]',
    dark: 'bg-[#1E293B] text-white border-[#334155]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1E293B] animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155]">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#1E293B] text-white border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0F766E] dark:text-[#14B8A6]">
                  {resource.isFree ? 'Free Digital Guide' : isUnlocked ? 'Unlocked Masterclass' : 'Sample Preview'}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">• Dr. Arif Chowdhury</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center bg-[#334155] rounded-lg p-0.5 border border-[#E2E8F0] dark:border-[#334155]">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 text-xs rounded font-semibold ${fontSize === 'sm' ? 'bg-[#0F766E] text-white' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-xs rounded font-semibold ${fontSize === 'base' ? 'bg-[#0F766E] text-white' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Default text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-xs rounded font-semibold ${fontSize === 'lg' ? 'bg-[#0F766E] text-white' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Reading Theme Switcher */}
            <div className="hidden md:flex items-center bg-[#334155] rounded-lg p-0.5 border border-[#E2E8F0] dark:border-[#334155]">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded ${readerTheme === 'light' ? 'bg-[#334155] text-white' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded ${readerTheme === 'sepia' ? 'bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0]' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Sepia Mode"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded ${readerTheme === 'dark' ? 'bg-[#334155] text-white' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-white'}`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button - Available for all books */}
            <button
              onClick={() => downloadResourceDoc(resource)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            {/* Claim to Library Button */}
            {!isClaimed && resource.isFree && (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0F766E] text-white text-xs font-semibold transition-colors"
                title="Add to My Library"
              >
                {isClaiming ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Adding...</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Save to Library</span>
                  </>
                )}
              </button>
            )}

            {/* Claimed Badge */}
            {isClaimed && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold">
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">In Library</span>
              </span>
            )}

            {/* Claim Error */}
            {claimError && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FEF2F2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] text-xs font-semibold">
                <span className="w-3.5 h-3.5">⚠</span>
                <span className="hidden sm:inline">{claimError}</span>
              </span>
            )}

            {/* Close Button */}
            <button
              onClick={closeReader}
              aria-label="Close reader"
              className="p-2 rounded-lg bg-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-white hover:bg-[#334155] dark:hover:bg-[#0F172A] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation in Reader */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-[#F1F5F9] dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
          activeTab === 'reader'
            ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6]'
            : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0]'
        }`}
          >
            📖 Book Reader
          </button>
          <button
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
          activeTab === 'toc'
            ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6]'
            : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0]'
        }`}
          >
            📋 Table of Contents ({resource.tableOfContents.length})
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
          activeTab === 'protocol'
            ? 'bg-white dark:bg-[#1E293B] text-[#0F766E] dark:text-[#14B8A6]'
            : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0]'
        }`}
          >
            ⭐ Action Checklist
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chapter Sidebar (Desktop) */}
          <div className="hidden lg:flex flex-col w-72 bg-[#F9FAFB] dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-[#334155] p-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 p-2 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
              <div className="relative w-12 h-16 rounded overflow-hidden shrink-0">
                <Image
                  src={resource.coverImage}
                  alt={resource.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] line-clamp-2">
                  {resource.title}
                </h4>
                <p className="text-[11px] text-[#0F766E] dark:text-[#14B8A6] font-semibold mt-0.5">
                  {chapters.length} Clinical Chapters
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2">
              Chapters Navigation
            </span>

            <div className="space-y-1">
              {chapters.map((ch, idx) => {
                const isLockedChapter = !isUnlocked && !resource.isFree && idx > 0;
                const isCurrentChapter = activeChapterIndex === idx && activeTab === 'reader';
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isLockedChapter) {
                        setActiveChapterIndex(idx);
                        setActiveTab('reader');
                      }
                    }}
                    disabled={isLockedChapter}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-normal transition-all flex items-start gap-2 ${
                  isCurrentChapter
                    ? 'bg-[#0F766E] text-white font-semibold'
                    : isLockedChapter
                    ? 'text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed opacity-70'
                    : 'text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#E2E8F0]/60'
                }`}
                  >
                    {isLockedChapter ? (
                      <Lock className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-semibold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="line-clamp-2">{ch.title}</span>
                  </button>
                );
              })}
            </div>

            {!isUnlocked && !resource.isFree && (
              <div className="mt-auto pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
                <div className="p-3 rounded-xl bg-[#0F766E] border border-[#0F766E] text-center space-y-2">
                  <Lock className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6] mx-auto" />
                  <p className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                    Unlock All {chapters.length} Chapters
                  </p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Instant lifetime access + complete PDF download
                  </p>
                  <button
                    onClick={() => {
                      addToCart(resource);
                      closeReader();
                    }}
                    className="w-full py-2 bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    Unlock for {formatPrice(resource.price)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Reading View Pane */}
          <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${themeClasses[readerTheme]} transition-colors duration-300`}>
            
            {/* View 1: Reader */}
            {activeTab === 'reader' && (
              <div className="max-w-2xl mx-auto space-y-8 pb-12">
                
                {/* Introduction Callout on Chapter 1 */}
                {activeChapterIndex === 0 && (
                  <div className="p-5 rounded-2xl bg-[#0F766E]/10 border border-[#0F766E]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F766E] dark:text-[#14B8A6] mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Author's Clinical Introduction</span>
                    </h4>
                    <p className="text-sm italic leading-relaxed text-[#1E293B] dark:text-[#E2E8F0]">
                      &ldquo;{resource.fullContent.introduction}&rdquo;
                    </p>
                  </div>
                )}

                {/* Chapter Title */}
                <div>
                  <div className="inline-block text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] uppercase tracking-widest mb-1">
                    Section {activeChapterIndex + 1} of {chapters.length}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {currentChapter.title}
                  </h2>
                </div>

                {/* Chapter Body Content */}
                <div className={` space-y-4 ${fontSizeClasses[fontSize]}`}>
                  <Markdown>{currentChapter.content}</Markdown>
                </div>

                {/* Key Clinical Takeaways */}
                {currentChapter.keyTakeaways && currentChapter.keyTakeaways.length > 0 && (
                  <div className="p-6 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] space-y-3">
                    <h4 className="text-sm font-semibold text-[#0F766E] dark:text-[#14B8A6] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                      <span>Action Steps & Clinical Pearls:</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentChapter.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#1E293B] dark:text-[#E2E8F0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-2 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Doctor's Signature Tip Callout */}
                {currentChapter.doctorTip && (
                  <div className="p-5 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] text-[#0F766E] dark:text-[#14B8A6] text-xs sm:text-sm font-semibold flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <span className="font-semibold block text-[#0F766E] dark:text-[#14B8A6] mb-0.5">
                        Dr. Arif's Practitioner Insight:
                      </span>
                      {currentChapter.doctorTip}
                    </div>
                  </div>
                )}

                {/* Locked Chapter Notice for Paid Guides */}
                {!isUnlocked && !resource.isFree && (
                  <div className="mt-10 p-8 rounded-3xl bg-[#0F766E] text-white text-center space-y-4 border border-[#E2E8F0] dark:border-[#334155]">
                    <div className="w-12 h-12 rounded-full bg-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      You are previewing Chapter 1 of &ldquo;{resource.title}&rdquo;
                    </h3>
                    <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                      Unlock the remaining {chapters.length - 1} comprehensive chapters, 30-day meal plans, supplement dosages, and get the complete high-res printable PDF.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          addToCart(resource);
                          closeReader();
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F766E] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart — {formatPrice(resource.price)}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Between Chapters */}
                <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
                  <button
                    onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeChapterIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">
                    {activeChapterIndex + 1} of {chapters.length}
                  </span>

                  <button
                    onClick={() => {
                      if (isUnlocked || resource.isFree || activeChapterIndex < chapters.length - 1) {
                        setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
                      }
                    }}
                    disabled={(!isUnlocked && !resource.isFree) || activeChapterIndex >= chapters.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#115E59] transition-colors"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* View 2: Table of Contents */}
            {activeTab === 'toc' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
                  <h3 className="text-xl font-semibold">Complete Table of Contents</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                    {resource.title} ({resource.pages} Total Pages)
                  </p>
                </div>

                <div className="space-y-3">
                  {resource.tableOfContents.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-xs sm:text-sm font-normal"
                    >
                      <span className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                        {item}
                      </span>
                      <span className="text-xs font-mono text-[#0F766E] dark:text-[#14B8A6]">
                        Sec {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Daily Action Protocol */}
            {activeTab === 'protocol' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
                  <h3 className="text-xl font-semibold">Dr. Arif's Actionable Protocol Checklist</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Daily practical non-negotiable habits to implement from this guide.
                  </p>
                </div>

                <div className="space-y-3">
                  {resource.fullContent.protocolSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-[#1E293B] dark:text-[#E2E8F0] font-normal leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] text-center">
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Need personalized clinical adjustments?
                  </p>
                  <a
                    href="/consultation"
                    onClick={closeReader}
                    className="inline-block mt-2 text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6] hover:underline"
                  >
                    Schedule a 1-on-1 Consultation with Dr. Arif →
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};