'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CountryCurrencyProvider } from '@/context/CountryCurrencyContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InteractiveReaderModal } from '@/components/InteractiveReaderModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { CustomerDashboardModal } from '@/components/CustomerDashboardModal';
import { DoctorPortalModal } from '@/components/DoctorPortalModal';
import { ToastContainer } from '@/components/Toast';
import { Chatbot } from '@/components/Chatbot';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CountryCurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-[#0F766E] focus:font-semibold focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <Header />

          <main id="main-content" role="main" tabIndex={-1}>{children}</main>

          <Footer />

          <InteractiveReaderModal />
          <CartDrawer />
          <CheckoutModal />
          <AuthModal />
          <CustomerDashboardModal />
          <DoctorPortalModal />
          <Chatbot />
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </CountryCurrencyProvider>
  );
}
