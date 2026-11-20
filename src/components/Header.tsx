'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  User, 
  Stethoscope,
  Globe2
} from 'lucide-react';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { LogoMark } from '@/components/Logo';

export const Header: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { selectedCountry, countries, setSelectedCountry } = useCountryCurrency();
  const { 
    user, 
    isAuthenticated, 
    isDoctor, 
    openAuthModal, 
    setIsCustomerDashboardOpen, 
    setIsDoctorPortalOpen 
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('conciouslivin_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('conciouslivin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('conciouslivin_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Guides', href: '/guides' },
    { name: 'Tools', href: '/calculators' },
    { name: 'Consult', href: '/consultation' },
    { name: 'Article', href: '/articles' },
    { name: 'Quiz', href: '/quiz' },
  ];

  return (
    <>
      {/* Mobile Drawer Menu - Rendered OUTSIDE header for full-screen */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            ref={backdropRef}
            onClick={closeMobileMenu}
            className="xl:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            aria-hidden="true"
          />
          {/* Drawer - Full Screen on Mobile */}
          <div 
            ref={mobileMenuRef}
            className="xl:hidden fixed inset-0 z-50 bg-white dark:bg-[#0F172A] animate-slideInRight overflow-y-auto flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="p-4 pb-6 space-y-3 flex-1">
              {/* Close button at top */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F9FAFB] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <label className="block px-4 pt-3 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                Country / currency
                <select
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2.5 text-sm text-[#1E293B] dark:text-[#E2E8F0]"
                >
                  {countries.map((item) => (
                    <option key={item.country} value={item.country}>
                      {item.country} ({item.currency})
                    </option>
                  ))}
                </select>
              </label>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      if (isDoctor) setIsDoctorPortalOpen(true);
                      else setIsCustomerDashboardOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6] text-sm font-semibold border border-[#0F766E] flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span>{isDoctor ? 'Doctor Admin Portal' : 'My Account & History'}</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        openAuthModal('customer-login');
                      }}
                      className="py-3 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59]"
                    >
                      Patient Sign In
                    </button>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        openAuthModal('doctor-login');
                      }}
                      className="py-3 rounded-xl bg-[#1E293B] text-white text-sm font-semibold hover:bg-[#334155] dark:hover:bg-[#0F172A]"
                    >
                      Doctor Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0F172A]/95 border-b border-[#E2E8F0] dark:border-[#334155] py-3'
            : 'bg-white/90 dark:bg-[#0F172A]/90 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT: Brand */}
            <Link href="/" className="flex min-w-0 items-center gap-2 sm:shrink-0 sm:gap-3" aria-label="ConciousLivin Home">
              <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
              <div className="flex min-w-0 flex-col hidden sm:flex">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold text-base tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-lg">
                    Concious<span className="text-[#0F766E] dark:text-[#14B8A6]">Livin</span>
                  </span>
                  <span className="hidden rounded-full border border-[#0F766E] bg-[#E6F4F1] dark:bg-[#134E4A] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F766E] dark:text-[#14B8A6] xl:inline-flex">
                    DR. ARIF MD
                  </span>
                </div>
                <span className="hidden text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] xl:inline">
                  Clinical Health & Longevity Academy
                </span>
              </div>
            </Link>

            {/* CENTER: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center justify-center gap-4 flex-1" aria-label="Main navigation">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="whitespace-nowrap text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition-colors hover:text-[#0F766E] dark:hover:text-[#14B8A6] px-3 py-2 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* RIGHT: Action Controls */}
            <div className="flex shrink-0 items-center gap-3 flex-nowrap">
              {/* Country Select - Desktop */}
              <div className="hidden xl:flex items-center gap-1.5" suppressHydrationWarning>
                <Globe2 className="h-4 w-4 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                <select
                  aria-label="Country and currency"
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  className="bg-transparent outline-none shrink-0 text-xs text-[#1E293B] dark:text-[#E2E8F0] min-w-[140px] max-w-[160px]"
                  suppressHydrationWarning
                >
                  {countries.map((item) => (
                    <option key={item.country} value={item.country}>
                      {item.country} ({item.currency})
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDarkMode}
                className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors shrink-0"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-[#E2E8F0]" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Auth & Account */}
              {isAuthenticated && user ? (
                <div className="relative">
                  {isDoctor ? (
                    <button
                      onClick={() => setIsDoctorPortalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E293B] text-white border border-[#334155] text-sm font-semibold hover:bg-[#334155] dark:hover:bg-[#0F172A] transition-colors shrink-0"
                    >
                      <Stethoscope className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                      <span className="hidden sm:inline">Doctor Portal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCustomerDashboardOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] text-[#1E293B] dark:text-[#E2E8F0] border border-[#E2E8F0] dark:border-[#334155] text-sm font-semibold transition-colors shrink-0"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#0F766E]">
                        <Image
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          fill
                          unoptimized
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('customer-login')}
                  className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors shrink-0"
                >
                  <User className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold transition-colors hover:bg-[#115E59] shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1E293B] text-white text-[11px] font-semibold flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
                className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};