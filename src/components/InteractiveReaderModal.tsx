'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  AlertCircle,
  Search,
  Menu,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  BookmarkCheck,
  Timer,
  Zap,
  ArrowLeft,
  ArrowRight
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
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{chapter: number, title: string, excerpt: string}[]>([]);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousChapterRef = useRef(0);

  const isUnlocked = useMemo(() => resource ? isResourceUnlocked(resource.id) : false, [resource, isResourceUnlocked]);
  const chapters = useMemo(() => resource?.fullContent.chapters || [], [resource]);
  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const progress = chapters.length > 0 ? ((activeChapterIndex + 1) / chapters.length) * 100 : 0;
  const isLockedChapter = !isUnlocked && !resource?.isFree && activeChapterIndex > 0;

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const themeColors = {
    light: {
      bg: '#ffffff',
      bgSecondary: '#f8f8fc',
      bgTertiary: '#f0f0f8',
      text: '#1a1a2e',
      textSecondary: '#4a4a5e',
      textMuted: '#6a6a7e',
      border: '#e8e8f0',
      borderStrong: '#d0d0e0',
      accent: '#0d6b64',
      accentBg: 'rgba(13, 107, 100, 0.1)',
      accentBorder: '#0d6b64',
      accentHover: 'rgba(13, 107, 100, 0.2)',
      cardBg: '#ffffff',
      cardBorder: '#e8e8f0',
      inputBg: '#f8f8fc',
      inputBorder: '#d0d0e0',
      overlay: 'rgba(0, 0, 0, 0.4)',
      modalBg: '#ffffff',
      scrollbarThumb: '#c0c0d0',
    },
    sepia: {
      bg: '#fdf8f0',
      bgSecondary: '#f5efe5',
      bgTertiary: '#ebe3d7',
      text: '#3d342a',
      textSecondary: '#5a4f3f',
      textMuted: '#7a6f5f',
      border: '#e8dcc8',
      borderStrong: '#d8c8b0',
      accent: '#8b6b2e',
      accentBg: 'rgba(139, 107, 46, 0.1)',
      accentBorder: '#8b6b2e',
      accentHover: 'rgba(139, 107, 46, 0.2)',
      cardBg: '#fdf8f0',
      cardBorder: '#e8dcc8',
      inputBg: '#f5efe5',
      inputBorder: '#d8c8b0',
      overlay: 'rgba(26, 22, 16, 0.6)',
      modalBg: '#fdf8f0',
      scrollbarThumb: '#b8a888',
    },
    dark: {
      bg: '#0f0f1a',
      bgSecondary: '#161622',
      bgTertiary: '#1e1e2e',
      text: '#e8e8f0',
      textSecondary: '#b8b8d0',
      textMuted: '#8a8a9e',
      border: '#2a2a3e',
      borderStrong: '#3a3a4e',
      accent: '#14b8a6',
      accentBg: 'rgba(20, 184, 166, 0.15)',
      accentBorder: '#14b8a6',
      accentHover: 'rgba(20, 184, 166, 0.25)',
      cardBg: '#161622',
      cardBorder: '#2a2a3e',
      inputBg: '#1e1e2e',
      inputBorder: '#3a3a4e',
      overlay: 'rgba(0, 0, 0, 0.7)',
      modalBg: '#131320',
      scrollbarThumb: '#444455',
    }
  };

  const tc = themeColors[readerTheme];

  const tabs = [
    { id: 'reader', label: 'Read', icon: BookOpen, count: null },
    { id: 'toc', label: 'Contents', icon: Bookmark, count: chapters.length },
    { id: 'protocol', label: 'Protocol', icon: Zap, count: resource?.fullContent.protocolSummary.length ?? 0 }
  ] as const;

  const handleClaim = async () => {
    if (isClaiming || isClaimed || !resource) return;
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
    if (!resource) return;
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

  const handleResumeReading = () => {
    setActiveChapterIndex(lastReadChapter);
    setShowResumePrompt(false);
  };

  const handleSearchResultClick = (chapterIndex: number) => {
    if (!resource || !isUnlocked && !resource.isFree && chapterIndex > 0) return;
    setActiveChapterIndex(chapterIndex);
    setActiveTab('reader');
    setShowMobileNav(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    if (!resource) return;
    const checkClaimed = async () => {
      try {
        const response = await fetch(`/api/library/claim?id=${resource.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsClaimed(data.inLibrary);
          if (data.libraryItem) {
            const lastChapter = data.libraryItem.last_read_chapter || 0;
            setLastReadChapter(lastChapter);
            if (lastChapter > 0) {
              setShowResumePrompt(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to check library status:', error);
      }
    };
    checkClaimed();
  }, [resource?.id]);

  useEffect(() => {
    if (!resource || !isClaimed) return;
    handleSaveProgress(activeChapterIndex);
  }, [resource?.id, activeChapterIndex, isClaimed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (activeChapterIndex > 0) {
            setActiveChapterIndex(prev => prev - 1);
            e.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (resource && activeChapterIndex < chapters.length - 1) {
            if (isUnlocked || resource.isFree || activeChapterIndex < chapters.length - 1) {
              setActiveChapterIndex(prev => prev + 1);
              e.preventDefault();
            }
          }
          break;
        case 'Escape':
          closeReader();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapterIndex, chapters.length, resource, isUnlocked, closeReader]);

  useEffect(() => {
    if (!resource || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = chapters
      .map((ch, idx) => {
        const content = ch.content.toLowerCase();
        if (content.includes(query) || ch.title.toLowerCase().includes(query)) {
          const index = content.indexOf(query);
          const start = Math.max(0, index - 100);
          const excerpt = ch.content.substring(start, index + 150) + '...';
          return { chapter: idx, title: ch.title, excerpt };
        }
        return null;
      })
      .filter(Boolean) as {chapter: number, title: string, excerpt: string}[];
    setSearchResults(results.slice(0, 5));
  }, [searchQuery, chapters]);

  if (!resource) return null;

  const sx = (styles: React.CSSProperties) => styles;

  const containerStyle = sx({ backgroundColor: tc.bg, color: tc.text });
  const cardStyle = sx({ backgroundColor: tc.cardBg, borderColor: tc.cardBorder, color: tc.text });
  const inputStyle = sx({ backgroundColor: tc.inputBg, borderColor: tc.inputBorder, color: tc.text });
  const accentStyle = sx({ backgroundColor: tc.accent, color: '#ffffff' });
  const accentHoverStyle = sx({ backgroundColor: tc.accentHover, color: '#ffffff' });
  const overlayStyle = sx({ backgroundColor: tc.overlay });
  const modalBgStyle = sx({ backgroundColor: tc.modalBg, borderColor: tc.border, color: tc.text });
  const borderStyle = sx({ borderColor: tc.border });
  const textStyle = sx({ color: tc.text });
  const textMutedStyle = sx({ color: tc.textMuted });
  const textSecondaryStyle = sx({ color: tc.textSecondary });
  const accentTextStyle = sx({ color: tc.accent });
  const accentBgStyle = sx({ backgroundColor: tc.accentBg });
  const accentBgHoverStyle = sx({ backgroundColor: tc.accentHover });
  const bgSecondaryStyle = sx({ backgroundColor: tc.bgSecondary });
  const bgTertiaryStyle = sx({ backgroundColor: tc.bgTertiary });
  const progressStyle = sx({ width: `${progress}%`, backgroundColor: tc.accent });
  const progressBgStyle = sx({ backgroundColor: tc.border });

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceGentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-bounce-gentle { animation: bounceGentle 2s ease-in-out infinite; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Mobile Bottom Sheet Navigation */}
      {showMobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 animate-fadeIn" 
            style={overlayStyle}
            onClick={() => setShowMobileNav(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col animate-slideUp" 
               style={modalBgStyle}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={borderStyle}>
              <h3 className="font-semibold" style={textStyle}>Chapters</h3>
              <button onClick={() => setShowMobileNav(false)} className="p-2 rounded-lg" style={textMutedStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.bgTertiary} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-4 py-3 border-b" style={borderStyle}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={textMutedStyle} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search within book..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm placeholder:text-muted"
                  style={inputStyle}
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchResultClick(result.chapter)}
                      className="w-full text-left p-3 rounded-xl border text-sm transition-colors"
                      style={{ 
                        backgroundColor: tc.bgSecondary, 
                        borderColor: tc.border,
                        color: tc.text
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.bgTertiary}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = tc.bgSecondary}
                    >
                      <div className="font-medium line-clamp-1" style={textStyle}>{result.title}</div>
                      <div className="text-xs line-clamp-1" style={textMutedStyle}>{result.excerpt}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {chapters.map((ch, idx) => {
                const isLockedChapterItem = !isUnlocked && !resource.isFree && idx > 0;
                const isCurrentChapter = activeChapterIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isLockedChapterItem) {
                        setActiveChapterIndex(idx);
                        setActiveTab('reader');
                        setShowMobileNav(false);
                      }
                    }}
                    disabled={isLockedChapterItem}
                    className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3"
                    style={{ 
                      color: isCurrentChapter ? 'white' : isLockedChapterItem ? tc.textMuted : tc.text,
                      backgroundColor: isCurrentChapter ? tc.accent : 'transparent',
                      fontWeight: isCurrentChapter ? '600' : '400',
                    }}
                    onMouseEnter={e => { if (!isCurrentChapter && !isLockedChapterItem) e.currentTarget.style.backgroundColor = tc.accentBg; }}
                    onMouseLeave={e => { if (!isCurrentChapter && !isLockedChapterItem) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {isLockedChapterItem ? (
                      <Lock className="w-4 h-4 shrink-0" style={{ color: tc.textMuted }} />
                    ) : (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-semibold" style={{ 
                        backgroundColor: isCurrentChapter ? 'rgba(255,255,255,0.2)' : tc.accentBg,
                        color: isCurrentChapter ? 'white' : tc.accent,
                      }}>
                        {idx + 1}
                      </span>
                    )}
                    <span className="flex-1 text-sm">{ch.title}</span>
                    {isCurrentChapter && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isCurrentChapter ? 'white' : tc.accent }} />}
                  </button>
                );
              })}
            </div>

            {!isUnlocked && !resource.isFree && (
              <div className="p-4 border-t" style={borderStyle}>
                <button
                  onClick={() => { addToCart(resource); closeReader(); }}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  style={accentStyle}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.accentHover}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Unlock All Chapters — {formatPrice(resource.price)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resume Reading Prompt */}
      {showResumePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" style={overlayStyle}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-slideUp" style={modalBgStyle}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: tc.accentBg, color: tc.accent }}>
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold" style={textStyle}>Continue Reading?</h3>
                <p className="text-xs" style={textMutedStyle}>You left off at Chapter {lastReadChapter + 1}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResumeReading}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors text-white"
                style={accentStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.accentHover}
              >
                Resume Reading
              </button>
              <button
                onClick={() => { setShowResumePrompt(false); setActiveChapterIndex(0); }}
                className="flex-1 py-2.5 rounded-xl border font-semibold text-sm transition-colors"
                style={{ borderColor: tc.border, color: tc.text, backgroundColor: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.bgTertiary}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reader Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn" style={overlayStyle}>
        <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl" style={modalBgStyle}>
          
          {/* Top App Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b" style={{ backgroundColor: '#1e293b', borderColor: tc.border, color: 'white' }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(15, 118, 110, 0.2)', color: '#14b8a6' }}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#14b8a6' }}>
                    {resource.isFree ? 'Free Digital Guide' : isUnlocked ? 'Unlocked Masterclass' : 'Sample Preview'}
                  </span>
                  <span className="text-[11px]" style={{ color: '#94a3b8' }}>• Dr. Arif Chowdhury</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {resource.title}
                </h3>
              </div>
            </div>

            {/* Reader Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-end">
              <button
                onClick={() => setShowMobileNav(true)}
                className="lg:hidden p-2 rounded-lg" 
                style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
                aria-label="Open chapter navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center bg-[#334155] rounded-lg p-0.5 border hidden sm:flex" style={borderStyle}>
                <span className="px-2 text-xs" style={{ color: '#94a3b8' }}>A</span>
                <button
                  onClick={() => setFontSize(prev => prev === 'sm' ? 'sm' : prev === 'base' ? 'sm' : prev === 'lg' ? 'base' : 'lg')}
                  className="p-1.5 rounded text-xs transition-colors"
                  style={{ color: fontSize === 'sm' ? 'white' : '#94a3b8', backgroundColor: fontSize === 'sm' ? tc.accent : 'transparent' }}
                  title="Decrease font size"
                  aria-label="Decrease font size"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-medium min-w-[1.5rem] text-center" style={{ color: '#94a3b8' }}>
                  {fontSize === 'sm' ? 'S' : fontSize === 'base' ? 'M' : fontSize === 'lg' ? 'L' : 'XL'}
                </span>
                <button
                  onClick={() => setFontSize(prev => prev === 'xl' ? 'xl' : prev === 'lg' ? 'xl' : prev === 'base' ? 'lg' : 'base')}
                  className="p-1.5 rounded text-xs transition-colors"
                  style={{ color: fontSize === 'xl' ? 'white' : '#94a3b8', backgroundColor: fontSize === 'xl' ? tc.accent : 'transparent' }}
                  title="Increase font size"
                  aria-label="Increase font size"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center bg-[#334155] rounded-lg p-0.5 border hidden md:flex" style={borderStyle}>
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`p-1.5 rounded transition-colors ${readerTheme === 'light' ? 'bg-[#334155] text-white' : ''}`}
                  style={{ color: readerTheme === 'light' ? 'white' : '#94a3b8' }}
                  onMouseEnter={e => { if (readerTheme !== 'light') { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}}
                  onMouseLeave={e => { if (readerTheme !== 'light') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}
                  title="Light Mode"
                  aria-label="Light mode"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`p-1.5 rounded transition-colors ${readerTheme === 'sepia' ? 'bg-[#334155] text-white' : ''}`}
                  style={{ color: readerTheme === 'sepia' ? 'white' : '#94a3b8' }}
                  onMouseEnter={e => { if (readerTheme !== 'sepia') { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}}
                  onMouseLeave={e => { if (readerTheme !== 'sepia') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}
                  title="Sepia Mode"
                  aria-label="Sepia mode"
                >
                  <Coffee className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`p-1.5 rounded transition-colors ${readerTheme === 'dark' ? 'bg-[#334155] text-white' : ''}`}
                  style={{ color: readerTheme === 'dark' ? 'white' : '#94a3b8' }}
                  onMouseEnter={e => { if (readerTheme !== 'dark') { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}}
                  onMouseLeave={e => { if (readerTheme !== 'dark') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}}
                  title="Dark Mode"
                  aria-label="Dark mode"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowProgress(!showProgress)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
                title={`Reading progress: ${Math.round(progress)}%`}
                aria-label={`Reading progress: ${Math.round(progress)}%`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{Math.round(progress)}%</span>
              </button>

              <button
                onClick={() => downloadResourceDoc(resource)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                style={accentStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.accentHover}
                title="Download PDF"
                aria-label="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save PDF</span>
              </button>

              {!isClaimed && resource.isFree && (
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                  style={{ backgroundColor: '#14b8a6' }}
                  onMouseEnter={e => { if (!isClaiming) e.currentTarget.style.backgroundColor = '#0f766e'; }}
                  title="Add to My Library"
                  aria-label="Add to library"
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

              {isClaimed && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" 
                      style={{ 
                        backgroundColor: 'rgba(15, 118, 110, 0.1)', 
                        color: '#0f766e',
                        border: '1px solid rgba(15, 118, 110, 0.2)'
                      }}>
                  <BookmarkCheck className="w-3.5 h-3.5" style={{ color: '#0f766e' }} />
                  <span className="hidden sm:inline">In Library</span>
                </span>
              )}

              {claimError && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" 
                      style={{ 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626',
                        border: '1px solid #fecaca'
                      }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{claimError}</span>
                </span>
              )}

              <button
                onClick={closeReader}
                aria-label="Close reader"
                className="p-2 rounded-lg transition-colors ml-1"
                style={{ backgroundColor: '#334155', color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#475569'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="h-1 relative overflow-hidden" style={progressBgStyle}>
              <div 
                className="h-full transition-all duration-300 ease-out" 
                style={progressStyle}
              />
              <div className="absolute top-full left-0 right-0 h-8 px-4 py-1 flex items-center justify-between text-xs" 
                   style={{ 
                     backgroundColor: tc.modalBg, 
                     borderTop: `1px solid ${tc.border}`,
                     color: tc.textMuted
                   }}>
                <span>Chapter {activeChapterIndex + 1} of {chapters.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b overflow-x-auto scrollbar-hide" 
               style={{ backgroundColor: tc.bgSecondary, borderColor: tc.border }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowMobileNav(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id 
                  ? 'shadow-sm' 
                  : ''}`}
                style={{ 
                  backgroundColor: activeTab === tab.id ? tc.modalBg : 'transparent',
                  color: activeTab === tab.id ? tc.accent : tc.textMuted,
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = tc.bgTertiary; e.currentTarget.style.color = tc.text; }}}
                onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = tc.textMuted; }}}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs font-semibold">{tab.label}</span>
                {tab.count && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: activeTab === tab.id ? tc.accentBg : tc.bgTertiary,
                    color: activeTab === tab.id ? tc.accent : tc.textMuted
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Chapter Sidebar (Desktop) */}
            <aside className="hidden lg:flex flex-col w-72 border-r p-4 overflow-y-auto" style={{ backgroundColor: tc.bgSecondary, borderColor: tc.border, color: tc.text }}>
              <div className="flex items-center gap-3 mb-4 p-2 rounded-xl border" style={cardStyle}>
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
                  <h4 className="text-xs font-semibold line-clamp-2" style={textStyle}>
                    {resource.title}
                  </h4>
                  <p className="text-[11px] font-semibold mt-0.5" style={accentTextStyle}>
                    {chapters.length} Clinical Chapters
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={textMutedStyle} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm placeholder:text-muted"
                    style={inputStyle}
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchResultClick(result.chapter)}
                        className="w-full text-left p-2 rounded-lg border text-xs transition-colors"
                        style={{ 
                          backgroundColor: tc.bgSecondary, 
                          borderColor: tc.border,
                          color: tc.text
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.accentBg}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = tc.bgSecondary}
                      >
                        <div className="font-medium line-clamp-1" style={textStyle}>{result.title}</div>
                        <div className="text-[10px] line-clamp-1" style={textMutedStyle}>{result.excerpt}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={textMutedStyle}>
                Chapters Navigation
              </span>

              <div className="space-y-1 flex-1 overflow-y-auto">
                {chapters.map((ch, idx) => {
                  const isLockedChapterItem = !isUnlocked && !resource.isFree && idx > 0;
                  const isCurrentChapter = activeChapterIndex === idx && activeTab === 'reader';
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isLockedChapterItem) {
                          setActiveChapterIndex(idx);
                          setActiveTab('reader');
                        }
                      }}
                      disabled={isLockedChapterItem}
                      className="w-full text-left p-2.5 rounded-xl text-xs font-normal transition-all flex items-start gap-2"
                      style={{ 
                        color: isCurrentChapter ? 'white' : isLockedChapterItem ? tc.textMuted : tc.text,
                        backgroundColor: isCurrentChapter ? tc.accent : 'transparent',
                        fontWeight: isCurrentChapter ? '600' : '400',
                      }}
                      onMouseEnter={e => { if (!isCurrentChapter && !isLockedChapterItem) e.currentTarget.style.backgroundColor = tc.accentBg; }}
                      onMouseLeave={e => { if (!isCurrentChapter && !isLockedChapterItem) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {isLockedChapterItem ? (
                        <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: tc.textMuted }} />
                      ) : (
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-semibold" style={{ 
                          backgroundColor: isCurrentChapter ? 'rgba(255,255,255,0.2)' : tc.accentBg,
                          color: isCurrentChapter ? 'white' : tc.accent,
                        }}>
                          {idx + 1}
                        </span>
                      )}
                      <span className="line-clamp-2 flex-1">{ch.title}</span>
                      {isCurrentChapter && <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: isCurrentChapter ? 'white' : tc.accent }} />}
                    </button>
                  );
                })}
              </div>

              {!isUnlocked && !resource.isFree && (
                <div className="mt-auto pt-4 border-t" style={borderStyle}>
                  <div className="p-3 rounded-xl text-center space-y-2" style={accentStyle}>
                    <Lock className="w-5 h-5 mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }} />
                    <p className="text-xs font-semibold" style={{ color: 'white' }}>
                      Unlock All {chapters.length} Chapters
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Instant lifetime access + complete PDF download
                    </p>
                    <button
                      onClick={() => { addToCart(resource); closeReader(); }}
                      className="w-full py-2 font-semibold text-xs rounded-lg transition-all"
                      style={{ backgroundColor: 'white', color: tc.accent }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.bgTertiary}
                    >
                      Unlock for {formatPrice(resource.price)}
                    </button>
                  </div>
                </div>
              )}
            </aside>

            {/* Mobile Chapter Nav Button (floating) */}
            <div className="lg:hidden fixed bottom-6 right-4 z-30">
              <button
                onClick={() => setShowMobileNav(true)}
                className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center animate-bounce-gentle"
                style={accentStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.accentHover}
                aria-label="Open chapter navigation"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Main Reading View Pane */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 transition-colors duration-300" ref={contentRef} style={containerStyle}>
              
              {/* View 1: Reader */}
              {activeTab === 'reader' && (
                <article className="max-w-2xl mx-auto space-y-8 pb-16">
                  
                  {/* Introduction Callout on Chapter 1 */}
                  {activeChapterIndex === 0 && (
                    <div className="p-5 rounded-2xl border" style={accentBgStyle}>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={accentTextStyle}>
                        <Sparkles className="w-4 h-4" />
                        <span>Author's Clinical Introduction</span>
                      </h4>
                      <p className="text-sm italic leading-relaxed" style={textStyle}>
                        &ldquo;{resource.fullContent.introduction}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Chapter Header */}
                  <header className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={accentTextStyle}>
                      <span>Section {activeChapterIndex + 1} of {chapters.length}</span>
                      {isLockedChapter && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ 
                          backgroundColor: '#fef2f2', 
                          color: '#dc2626',
                          border: '1px solid #fecaca'
                        }}>
                          <Lock className="w-3 h-3" />
                          Preview Only
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight" style={textStyle}>
                      {currentChapter.title}
                    </h1>
                  </header>

                  {/* Estimated Reading Time */}
                  <div className="flex items-center gap-2 text-xs" style={textMutedStyle}>
                    <Timer className="w-3 h-3" />
                    <span>~{Math.ceil(currentChapter.content.split(' ').length / 200)} min read</span>
                    <span className="w-px h-4 mx-1" style={borderStyle} />
                    <span>{currentChapter.content.split(' ').length.toLocaleString()} words</span>
                  </div>

                  {/* Chapter Body Content */}
                  <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none space-y-4 ${fontSizeClasses[fontSize]} dark:prose-invert`}>
                    <Markdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: (props) => <h2 {...props} className="text-xl sm:text-2xl font-bold mt-8 mb-4 pb-2 border-b flex items-center gap-2" style={{ color: tc.text, borderColor: tc.border }} />,
                        h3: (props) => <h3 {...props} className="text-lg sm:text-xl font-bold mt-6 mb-3" style={{ color: tc.accent }} />,
                        h4: (props) => <h4 {...props} className="text-base font-semibold mt-4 mb-2" style={{ color: tc.text }} />,
                        p: (props) => <p {...props} className="leading-relaxed mb-4" style={{ color: tc.text }} />,
                        ul: (props) => <ul {...props} className="list-disc list-outside ml-6 space-y-2 mb-4" style={{ color: tc.text }} />,
                        ol: (props) => <ol {...props} className="list-decimal list-outside ml-6 space-y-2 mb-4" style={{ color: tc.text }} />,
                        li: (props) => <li {...props} className="leading-relaxed pl-1" style={{ color: tc.text }} />,
                        blockquote: (props) => <blockquote {...props} className="border-l-4 pl-4 py-2 italic my-4 rounded-r-xl" style={{ borderColor: tc.accent, backgroundColor: tc.accentBg, color: tc.text }} />,
                        code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                          const isDiagram = className?.includes('language-diagram') || className?.includes('language-flowchart') || className?.includes('language-ascii');
                          if (isDiagram) {
                            return (
                              <div className="my-6 rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: tc.border, backgroundColor: tc.bgTertiary }}>
                                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b" style={{ backgroundColor: tc.accentBg, color: tc.accent, borderColor: tc.border }}>
                                  <span>📊 Clinical Flow Diagram</span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed" style={{ color: tc.text }}>
                                  <code>{children}</code>
                                </pre>
                              </div>
                            );
                          }
                          return (
                            <code {...props} className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: tc.bgTertiary, color: tc.accent }}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => <div className="my-4">{children}</div>,
                        strong: (props) => <strong {...props} className="font-semibold" style={{ color: tc.text }} />,
                        a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80" style={{ color: tc.accent }} />,
                        table: ({ children }) => (
                          <div className="my-6 w-full overflow-x-auto rounded-2xl border shadow-sm" style={{ borderColor: tc.border, backgroundColor: tc.bgSecondary }}>
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="border-b font-semibold text-xs uppercase tracking-wider" style={{ backgroundColor: tc.bgTertiary, borderColor: tc.border, color: tc.text }}>
                            {children}
                          </thead>
                        ),
                        tbody: ({ children }) => <tbody className="divide-y" style={{ borderColor: tc.border }}>{children}</tbody>,
                        tr: ({ children }) => (
                          <tr className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">{children}</tr>
                        ),
                        th: ({ children }) => <th className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{children}</th>,
                        td: ({ children }) => <td className="px-4 py-3 align-top leading-normal" style={{ color: tc.textSecondary }}>{children}</td>,
                        img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
                          <figure className="my-6 rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: tc.border, backgroundColor: tc.bgSecondary }}>
                            <div className="relative w-full max-h-[420px] overflow-hidden bg-slate-900/5 dark:bg-slate-900/40 flex items-center justify-center p-2 sm:p-4">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={alt || 'Clinical illustration'}
                                className="w-full max-h-[380px] object-contain rounded-lg transition-transform duration-300 hover:scale-[1.01]"
                                {...props}
                              />
                            </div>
                            {alt && (
                              <figcaption className="px-4 py-2.5 text-xs text-center border-t italic font-medium flex items-center justify-center gap-1.5" style={{ borderColor: tc.border, color: tc.textMuted }}>
                                <span>🔍</span>
                                <span>{alt}</span>
                              </figcaption>
                            )}
                          </figure>
                        ),
                      }}
                    >{currentChapter.content}</Markdown>
                  </div>

                  {/* Key Clinical Takeaways */}
                  {currentChapter.keyTakeaways && currentChapter.keyTakeaways.length > 0 && (
                    <section className="p-6 rounded-2xl border space-y-3" style={accentBgStyle}>
                      <h4 className="text-sm font-semibold flex items-center gap-2" style={accentTextStyle}>
                        <CheckCircle2 className="w-4 h-4" style={accentTextStyle} />
                        <span>Action Steps & Clinical Pearls:</span>
                      </h4>
                      <ul className="space-y-2">
                        {currentChapter.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm" style={textStyle}>
                            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={accentStyle} />
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Doctor's Signature Tip Callout */}
                  {currentChapter.doctorTip && (
                    <section className="p-5 rounded-2xl border text-xs sm:text-sm font-normal flex items-start gap-3" style={accentBgStyle}>
                      <span className="text-xl shrink-0">💡</span>
                      <div>
                        <span className="font-semibold block mb-0.5" style={accentTextStyle}>
                          Dr. Arif's Practitioner Insight:
                        </span>
                        {currentChapter.doctorTip}
                      </div>
                    </section>
                  )}

                  {/* Locked Chapter Notice for Paid Guides */}
                  {isLockedChapter && (
                    <section className="mt-10 p-8 rounded-3xl text-white text-center space-y-4 border" style={{ backgroundColor: tc.accent, borderColor: tc.border }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: tc.accent }}>
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">You are previewing Chapter 1 of &ldquo;{resource.title}&rdquo;</h3>
                      <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Unlock the remaining {chapters.length - 1} comprehensive chapters, 30-day meal plans, supplement dosages, and get the complete high-res printable PDF.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={() => { addToCart(resource); closeReader(); }}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'white', color: tc.accent }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = tc.bgTertiary}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart — {formatPrice(resource.price)}</span>
                        </button>
                      </div>
                    </section>
                  )}

                  {/* Chapter Navigation */}
                  <nav className="pt-8 border-t flex items-center justify-between gap-4" style={borderStyle}>
                    <button
                      onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                      disabled={activeChapterIndex === 0}
                      className="flex-1 sm:flex-none flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors justify-center"
                      style={{ borderColor: tc.border, color: tc.text, backgroundColor: 'transparent' }}
                      onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = tc.bgTertiary; }}
                      onMouseLeave={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      aria-label="Previous chapter"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex-1 text-center">
                      <span className="text-xs font-normal" style={textMutedStyle}>
                        {activeChapterIndex + 1} of {chapters.length}
                      </span>
                      <div className="h-1 rounded-full mt-1.5 overflow-hidden w-full max-w-xs mx-auto sm:hidden" style={{ backgroundColor: tc.border }}>
                        <div 
                          className="h-full transition-all duration-300" 
                          style={{ width: `${progress}%`, backgroundColor: tc.accent }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isUnlocked || resource.isFree || activeChapterIndex < chapters.length - 1) {
                          setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
                        }
                      }}
                      disabled={(!isUnlocked && !resource.isFree) || activeChapterIndex >= chapters.length - 1}
                      className="flex-1 sm:flex-none flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors justify-center"
                      style={accentStyle}
                      onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = tc.accentHover; }}
                      aria-label="Next chapter"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>

                </article>
              )}

              {/* View 2: Table of Contents */}
              {activeTab === 'toc' && (
                <section className="max-w-2xl mx-auto space-y-6">
                  <header className="border-b pb-4" style={borderStyle}>
                    <h2 className="text-xl font-semibold" style={textStyle}>Complete Table of Contents</h2>
                    <p className="text-xs mt-1" style={textMutedStyle}>
                      {resource.title} ({resource.pages} Total Pages, ~{resource.readingTime})
                    </p>
                  </header>

                  <div className="space-y-3">
                    {resource.tableOfContents.map((item, idx) => {
                      const isLocked = !isUnlocked && !resource.isFree && idx > 0;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!isLocked) {
                              setActiveChapterIndex(idx);
                              setActiveTab('reader');
                              setShowMobileNav(false);
                            }
                          }}
                          disabled={isLocked}
                          className="flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm font-normal transition-colors"
                          style={{ 
                            backgroundColor: isLocked ? tc.bgSecondary : activeChapterIndex === idx ? tc.accentBg : tc.cardBg,
                            borderColor: isLocked ? tc.border : activeChapterIndex === idx ? tc.accent : tc.cardBorder,
                            color: isLocked ? tc.textMuted : activeChapterIndex === idx ? tc.text : tc.text,
                          }}
                          onMouseEnter={e => { if (!isLocked && activeChapterIndex !== idx) { e.currentTarget.style.backgroundColor = tc.accentBg; e.currentTarget.style.borderColor = tc.accent; }}}
                          onMouseLeave={e => { if (!isLocked && activeChapterIndex !== idx) { e.currentTarget.style.backgroundColor = tc.cardBg; e.currentTarget.style.borderColor = tc.cardBorder; }}}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isLocked ? (
                              <Lock className="w-5 h-5 shrink-0" style={textMutedStyle} />
                            ) : (
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ 
                                backgroundColor: activeChapterIndex === idx ? tc.accent : tc.accentBg,
                                color: activeChapterIndex === idx ? 'white' : tc.accent,
                              }}>
                                {idx + 1}
                              </span>
                            )}
                            <span className="font-normal text-sm line-clamp-1" style={isLocked ? textMutedStyle : textStyle}>{item}</span>
                          </div>
                          {activeChapterIndex === idx && !isLocked && <div className="w-2 h-2 rounded-full shrink-0 ml-2" style={accentStyle} />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* View 3: Daily Action Protocol */}
              {activeTab === 'protocol' && (
                <section className="max-w-2xl mx-auto space-y-6">
                  <header className="border-b pb-4" style={borderStyle}>
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={textStyle}>
                      <Zap className="w-5 h-5" style={accentTextStyle} />
                      Dr. Arif's Actionable Protocol Checklist
                    </h2>
                    <p className="text-xs mt-1" style={textMutedStyle}>
                      Daily practical non-negotiable habits to implement from this guide.
                    </p>
                  </header>

                  <div className="space-y-3">
                    {resource.fullContent.protocolSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl border"
                        style={accentBgStyle}
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5" style={accentStyle}>
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm font-normal leading-relaxed" style={textStyle}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl text-center border" style={cardStyle}>
                    <p className="text-xs" style={textMutedStyle}>
                      Need personalized clinical adjustments?
                    </p>
                    <a
                      href="/consultation"
                      onClick={closeReader}
                      className="inline-block mt-2 text-xs font-semibold hover:underline" style={accentTextStyle}
                    >
                      Schedule a 1-on-1 Consultation with Dr. Arif →
                    </a>
                  </div>
                </section>
              )}

            </main>

          </div>

        </div>
      </div>
    </>
  );
};