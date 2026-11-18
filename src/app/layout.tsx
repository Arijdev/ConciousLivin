'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InteractiveReaderModal } from '@/components/InteractiveReaderModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { MyLibraryModal } from '@/components/MyLibraryModal';
import { SearchModal } from '@/components/SearchModal';
import { AuthModal } from '@/components/AuthModal';
import { CustomerDashboardModal } from '@/components/CustomerDashboardModal';
import { DoctorPortalModal } from '@/components/DoctorPortalModal';
import { ToastContainer } from '@/components/Toast';
import { Chatbot } from '@/components/Chatbot';
import { CountryCurrencyProvider } from '@/context/CountryCurrencyContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');

  const handleSelectSearch = (query: string) => {
    setSelectedSearchQuery(query);
    setIsSearchOpen(false);
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('conciouslivin_theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
        <title>ConciousLivin Health Academy | Dr. Arif Chowdhury</title>
        <link rel="canonical" href="https://conciouslivin.in" />
        <meta name="description" content="ConciousLivin Health Academy by Dr. Arif Chowdhury offers clinical health guides, consultations, calculators, and evidence-based wellness resources." />
        <meta property="og:title" content="ConciousLivin Health Academy | Dr. Arif Chowdhury" />
        <meta property="og:description" content="Clinical health guides, consultations, calculators, and evidence-based wellness resources by Dr. Arif Chowdhury." />
        <meta property="og:site_name" content="ConciousLivin Health Academy" />
        <meta property="og:url" content="https://conciouslivin.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ConciousLivin Health Academy | Dr. Arif Chowdhury" />
        <meta name="twitter:description" content="Clinical health guides, consultations, calculators, and evidence-based wellness resources by Dr. Arif Chowdhury." />
      </head>
      <body
        className="min-h-screen bg-[#F9FAFB] text-[#1E293B] antialiased dark:bg-[#0F172A] dark:text-[#E2E8F0]"
        suppressHydrationWarning
      >
        <CountryCurrencyProvider>
          <AuthProvider>
            <CartProvider>
            {/* Navigation Header */}
            <Header
              onOpenMyLibrary={() => setIsLibraryOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Main Content */}
            <main>
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Interactive Overlays & Modals */}
            <InteractiveReaderModal />
            <CartDrawer />
            <CheckoutModal />
            <AuthModal />
            <CustomerDashboardModal />
            <DoctorPortalModal />
            <MyLibraryModal
              isOpen={isLibraryOpen}
              onClose={() => setIsLibraryOpen(false)}
            />
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectResourceSearch={handleSelectSearch}
            />
            <Chatbot />
            <ToastContainer />
            </CartProvider>
          </AuthProvider>
        </CountryCurrencyProvider>
      </body>
    </html>
  );
}