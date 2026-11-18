'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discountAmount, 
    total, 
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    addToCart
  } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { formatPrice } = useCountryCurrency();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      openAuthModal('customer-login', 'Please log in or create an account to proceed to checkout.');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#0F172A]/60 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E293B] flex flex-col border-l border-[#E2E8F0] dark:border-[#334155]">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#0F172A]/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F766E]/10 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  Your Health Cart
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] hover:bg-[#E2E8F0]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mx-auto">
                  Explore Dr. Arif Chowdhury&apos;s health guides to power your health transformation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const samplePaid = HEALTH_RESOURCES.find(r => !r.isFree);
                      if (samplePaid) addToCart(samplePaid);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-all"
                  >
                    Add Recommended Bestseller Guide
                  </button>
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.resource.id}
                  className="flex gap-3 p-3.5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]"
                >
                  {/* Book Cover Thumbnail */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                    <Image
                      src={item.resource.coverImage}
                      alt={item.resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] line-clamp-1">
                          {item.resource.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.resource.id)}
                          aria-label="Remove item"
                          className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-normal mt-0.5">
                        Digital PDF & Interactive eBook
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E2E8F0] dark:border-[#334155]">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-white dark:bg-[#1E293B] rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                        <button
                          onClick={() => updateQuantity(item.resource.id, -1)}
                          className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.resource.id, 1)}
                          className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                        {formatPrice(item.resource.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Guaranteed Badges */}
            {cart.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A]/70 border border-[#0F766E] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                  <ShieldCheck className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                  <span>30-Day 100% Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                  <Download className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                  <span>Instant PDF Download & In-App Web Access</span>
                </div>
              </div>
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E2E8F0] dark:border-[#334155] bg-[#F9FAFB] dark:bg-[#0F172A] space-y-4">
              
              {/* Coupon Section */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A]/70 border border-[#0F766E] text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                      <span className="font-semibold text-[#0F766E] dark:text-[#14B8A6]">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[#0F766E] dark:text-[#14B8A6]">
                        (-{formatPrice(discountAmount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#0F766E] dark:text-[#14B8A6] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. ARIF50)"
                        value={couponInput}
                        onChange={e => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs border border-[#E2E8F0] dark:border-[#334155] uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] dark:hover:bg-[#0F172A] text-white text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-[#1E293B] dark:text-[#E2E8F0] pl-1">{couponError}</p>
                    )}
                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] pl-1">
                      Tip: Try promo code <span className="font-mono font-semibold text-[#0F766E] dark:text-[#14B8A6]">ARIF50</span> for 50% off
                    </p>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#0F766E] dark:text-[#14B8A6] font-semibold">
                    <span>Discount Applied</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                  <span>Digital Delivery & Tax</span>
                  <span className="text-[#0F766E] dark:text-[#14B8A6] font-normal">FREE ({formatPrice(0)})</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0] pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                  <span>Total</span>
                  <span className="text-[#0F766E] dark:text-[#14B8A6]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-semibold text-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
