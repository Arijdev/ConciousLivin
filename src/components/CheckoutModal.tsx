'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck,
  ArrowRight, 
  Mail, 
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    total, 
    discountAmount, 
    appliedCoupon, 
  } = useCart();

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { formatPrice } = useCountryCurrency();

  // Customer info
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Sync user details if logged in
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // If guest, prompt them to create an account
    if (!isAuthenticated) {
      openAuthModal('customer-register', `Create an account to complete your purchase and access your guides.`);
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'resources',
          items: cart.map((item) => ({ resourceId: item.resource.id, quantity: item.quantity })),
          couponCode: appliedCoupon?.code,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.approvalUrl) {
        throw new Error(result.error || 'Could not start PayPal checkout.');
      }
      window.location.assign(result.approvalUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start PayPal checkout.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E293B] animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] text-white border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Secure PayPal Checkout</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Dr. Arif Chowdhury — ConciousLivin Health Academy
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="p-2 rounded-lg bg-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Payment Form */}
        <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6">
            
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>1. Digital Delivery Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] text-xs border border-[#E2E8F0] dark:border-[#334155] focus:ring-2 focus:ring-[#0F766E] outline-none"
                    placeholder="e.g. Alex Rahman"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] mb-1">
                    Email for Instant PDF Delivery
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] text-xs border border-[#E2E8F0] dark:border-[#334155] focus:ring-2 focus:ring-[#0F766E] outline-none"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                <span>2. Pay securely with PayPal</span>
              </h4>

              <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F9FAFB] dark:bg-[#0F172A] p-4 text-sm">
                <Globe className="h-5 w-5 shrink-0 text-[#1E293B] dark:text-[#E2E8F0]" />
                <div>
                  <p className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">PayPal</p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Secure payment approval through your PayPal account.</p>
                </div>
              </div>
            </div>

            {paymentError && (
              <p role="alert" className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F1F5F9] dark:bg-[#1E293B] px-4 py-3 text-sm text-[#1E293B] dark:text-[#E2E8F0]">
                {paymentError}
              </p>
            )}

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Local currency is an estimate. PayPal currently charges the order in USD ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}).
            </p>

            {/* Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] space-y-2">
              <div className="flex justify-between items-center text-xs text-[#1E293B] dark:text-[#E2E8F0]">
                <span>Items in Order:</span>
                <span className="font-semibold">{cart.length} eBooks / Guides</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-[#0F766E] dark:text-[#14B8A6] font-semibold">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] pt-2 border-t border-[#0F766E]">
                <span>Total Amount Due:</span>
                <span className="text-[#0F766E] dark:text-[#14B8A6] text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#1E293B] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Connecting to PayPal…' : `Continue to PayPal (${formatPrice(total)})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-normal pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>30-Day Money Back Guarantee</span>
            </div>
          </form>

      </div>
    </div>
  );
};
