'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  HeartPulse, 
  ShoppingBag, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Search, 
  User, 
  Stethoscope,
  Globe2
} from 'lucide-react';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

interface HeaderProps {
  onOpenMyLibrary: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMyLibrary, onOpenSearch }) => {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('conciouslivin_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('conciouslivin_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('conciouslivin_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Health Guides', href: '/guides' },
    { name: 'Health Tools', href: '/calculators' },
    { name: 'Health Quiz', href: '/quiz' },
    { name: 'Articles', href: '/articles' },
    { name: 'About Dr. Arif', href: '/about' },
    { name: 'Consultations', href: '/consultation' },
  ];

  return (
    <>
      {/* Mobile Drawer Menu - Rendered OUTSIDE header for full-screen */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="xl:hidden fixed inset-0 bg-[#1E293B] z-40 animate-fadeIn"
          />
          {/* Drawer - Full Screen on Mobile */}
          <div className="xl:hidden fixed inset-0 z-50 bg-white dark:bg-[#0F172A] animate-slideInRight overflow-y-auto flex flex-col">
            <div className="p-4 pb-6 space-y-3 flex-1">
              {/* Close button at top */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] px-4 py-3 text-left text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F9FAFB] dark:hover:bg-[#0F172A]"
              >
                <Search className="h-4 w-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>Search health guides and articles</span>
              </button>
              
              {/* Nav Links */}
              <nav className="space-y-1">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
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
                      setIsMobileMenuOpen(false);
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
                        setIsMobileMenuOpen(false);
                        openAuthModal('customer-login');
                      }}
                      className="py-3 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59]"
                    >
                      Patient Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Doctor Title */}
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:shrink-0 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E] text-white sm:h-10 sm:w-10">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-base tracking-tight text-[#1E293B] dark:text-[#E2E8F0] sm:text-lg">
                  ConciousLivin
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

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-3">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-[13px] font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition-colors hover:text-[#0F766E] dark:hover:text-[#14B8A6]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-0.5 sm:gap-2.5">
            <label className="hidden xl:flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155] px-2 py-1.5 text-xs text-[#1E293B] dark:text-[#E2E8F0]">
              <Globe2 className="h-4 w-4 text-[#0F766E] dark:text-[#14B8A6]" />
              <span className="sr-only">Country and currency</span>
              <select
                aria-label="Country and currency"
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="max-w-24 bg-transparent outline-none"
              >
                {countries.map((item) => (
                  <option key={item.country} value={item.country}>
                    {item.country} ({item.currency})
                  </option>
                ))}
              </select>
            </label>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDarkMode}
              className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-[#E2E8F0]" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search resources"
              className="hidden sm:inline-flex p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth & Account Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                {isDoctor ? (
                  /* Doctor Badge Button */
                  <button
                    onClick={() => setIsDoctorPortalOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#1E293B] text-white border border-[#334155] text-xs font-semibold hover:bg-[#334155] dark:hover:bg-[#0F172A] transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                    <span className="hidden sm:inline">Doctor Portal</span>
                  </button>
                ) : (
                  /* Customer Account Button */
                  <button
                    onClick={() => setIsCustomerDashboardOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] text-[#1E293B] dark:text-[#E2E8F0] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold transition-colors"
                  >
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 border border-[#0F766E]">
                      <Image
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                    <span className="hidden md:inline px-1.5 py-0.5 bg-[#0F766E] text-white rounded-full text-[10px]">
                      History
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Guest / Login Button */
              <div className="hidden items-center gap-1.5 xl:flex">
                <button
                  onClick={() => openAuthModal('customer-login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-2.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#115E59] sm:gap-2 sm:px-3.5"
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
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#1E293B] dark:text-[#E2E8F0] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors -ml-1"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
