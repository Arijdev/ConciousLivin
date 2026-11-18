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
          <Header />

          <main>{children}</main>

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
