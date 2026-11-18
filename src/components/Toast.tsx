'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Info, ShoppingBag, X, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 pointer-events-none sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border transition-colors bg-white/95 dark:bg-[#1E293B]/95 border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#E2E8F0]"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />}
            {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#0F766E] dark:text-[#14B8A6]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#1E293B] dark:text-[#E2E8F0]" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#E2E8F0] transition-colors p-1"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
