'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthResource, CartItem, Coupon } from '@/types/health';
import { DISCOUNT_COUPONS, HEALTH_RESOURCES } from '@/data/healthData';
import { useAuth } from './AuthContext';
import { useCountryCurrency } from './CountryCurrencyContext';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'cart' | 'error';
}

interface CartContextType {
  resources: HealthResource[];
  loading: boolean;
  addCustomResource: (newResource: HealthResource) => void;
  updateResource: (id: string, updated: Partial<HealthResource>) => void;
  deleteResource: (id: string) => void;
  cart: CartItem[];
  addToCart: (resource: HealthResource) => void;
  removeFromCart: (resourceId: string) => void;
  updateQuantity: (resourceId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  cartCount: number;
  unlockedResources: string[];
  unlockResource: (resourceId: string) => void;
  isResourceUnlocked: (resourceId: string) => boolean;
  activeReaderResource: HealthResource | null;
  openReader: (resource: HealthResource) => void;
  closeReader: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'cart' | 'error') => void;
  removeToast: (id: string) => void;
  downloadResourceDoc: (resource: HealthResource) => void;
  refreshResources: () => Promise<void>;
  claimBook: (resourceId: string) => void;
  isBookClaimed: (resourceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, openAuthModal, recordDownload, purchaseHistory } = useAuth();
  const { formatPrice } = useCountryCurrency();
  const [resources, setResources] = useState<HealthResource[]>(HEALTH_RESOURCES);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [unlockedResources, setUnlockedResources] = useState<string[]>([]);
  const [claimedResources, setClaimedResources] = useState<string[]>([]);
  const [activeReaderResource, setActiveReaderResource] = useState<HealthResource | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch resources from Supabase API
  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        if (data.resources && data.resources.length > 0) {
          const mappedResources: HealthResource[] = data.resources.map((r: Record<string, unknown>) => ({
            id: r.id,
            title: r.title,
            subtitle: r.subtitle || 'A Clinical Protocol by Dr. Arif Chowdhury',
            category: r.category as HealthResource['category'],
            isFree: r.is_free,
            price: r.price || 0,
            originalPrice: r.original_price || 29.99,
            rating: r.rating || 5.0,
            reviewCount: r.review_count || 0,
            pages: r.pages || 80,
            readingTime: r.reading_time || '2 hours',
            coverImage: r.cover_image_url || r.thumbnail_url || '/images/book_nutrition.jpg',
            pdfFileName: (r.pdf_url as string) || `/pdfs/${r.id}.pdf`,
            badge: r.badge || (r.is_free ? '100% Free Guide 🎁' : "Doctor's Special Edition"),
            badgeColor: r.badge_color || 'emerald',
            description: r.description || '',
            highlights: r.highlights || [],
            tableOfContents: r.table_of_contents || [],
            fullContent: (r.full_content as HealthResource['fullContent']) || {},
            uploadedBy: 'Dr. Arif Chowdhury',
            publishedAt: r.published_at ? new Date(r.published_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          }));
          setResources(mappedResources);
        }
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load resources on mount
  useEffect(() => {
    fetchResources();
  }, []);

  // Save custom resources
  const saveResourcesToStorage = (newList: HealthResource[]) => {
    setResources(newList);
    try {
      localStorage.setItem('conciouslivin_resources', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving resources', e);
    }
  };

  const addCustomResource = (newRes: HealthResource) => {
    const updated = [newRes, ...resources];
    saveResourcesToStorage(updated);
    addToast('Published Successfully! 🎉', `"${newRes.title}" is now live in the health library.`, 'success');
  };

  const updateResource = (id: string, updatedFields: Partial<HealthResource>) => {
    const updated = resources.map(r => (r.id === id ? { ...r, ...updatedFields } : r));
    saveResourcesToStorage(updated);
    addToast('Updated Guide', 'Resource changes saved successfully.', 'info');
  };

  const deleteResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id);
    saveResourcesToStorage(updated);
    addToast('Resource Removed', 'Guide has been removed from the academy.', 'info');
  };

  // Load cart and unlocked resources from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('conciouslivin_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUnlocked = localStorage.getItem('conciouslivin_unlocked');
      if (savedUnlocked) {
        setUnlockedResources(JSON.parse(savedUnlocked));
      } else {
        // Automatically unlock all free guides by default
        const freeIds = HEALTH_RESOURCES.filter(r => r.isFree).map(r => r.id);
        setUnlockedResources(freeIds);
        localStorage.setItem('conciouslivin_unlocked', JSON.stringify(freeIds));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
  }, []);

  useEffect(() => {
    const purchasedResourceIds = purchaseHistory.flatMap((purchase) =>
      purchase.items
        .map((item) => item.resourceId)
        .filter((resourceId) => !resourceId.startsWith('consultation:')),
    );
    if (purchasedResourceIds.length > 0) {
      setUnlockedResources((current) => Array.from(new Set([...current, ...purchasedResourceIds])));
    }
  }, [purchaseHistory]);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('conciouslivin_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [cart]);

  // Save unlocked changes
  useEffect(() => {
    try {
      if (unlockedResources.length > 0) {
        localStorage.setItem('conciouslivin_unlocked', JSON.stringify(unlockedResources));
      }
    } catch (e) {
      console.error('Error saving unlocked resources', e);
    }
  }, [unlockedResources]);

  let toastIdCounter = 0;

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'cart' | 'error' = 'success') => {
    const id = `toast_${++toastIdCounter}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (resource: HealthResource) => {
    if (resource.isFree) {
      if (!isAuthenticated) {
        openAuthModal('customer-login', `Please log in or create a free patient account to read & download "${resource.title}".`);
        return;
      }
      unlockResource(resource.id);
      addToast('Free Guide Ready!', `"${resource.title}" is ready in your library.`, 'info');
      openReader(resource);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.resource.id === resource.id);
      if (existing) {
        addToast('Cart Updated', `Added another copy of "${resource.title}".`, 'cart');
        return prev.map(item =>
          item.resource.id === resource.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        addToast('Added to Cart', `"${resource.title}" was added to your cart.`, 'cart');
        return [...prev, { resource, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (resourceId: string) => {
    setCart(prev => prev.filter(item => item.resource.id !== resourceId));
    addToast('Removed', 'Item removed from your cart.', 'info');
  };

  const updateQuantity = (resourceId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.resource.id === resourceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = DISCOUNT_COUPONS.find(c => c.code.toUpperCase() === clean);
    if (found) {
      setAppliedCoupon(found);
      const couponMessage = found.discountAmount
        ? `${formatPrice(found.discountAmount)} Instant Cart Discount`
        : found.description;
      addToast('Promo Code Applied!', couponMessage, 'success');
      return { success: true, message: `Promo code ${found.code} applied successfully!` };
    }
    return { success: false, message: 'Invalid coupon code. Try ARIF50 or HEALTH20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Standard pricing restored.', 'info');
  };

  const unlockResource = (resourceId: string) => {
    setUnlockedResources(prev => {
      if (!prev.includes(resourceId)) {
        return [...prev, resourceId];
      }
      return prev;
    });
  };

  const isResourceUnlocked = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource?.isFree) return true;
    return unlockedResources.includes(resourceId);
  };

  // Load claimed resources from localStorage on mount
  useEffect(() => {
    try {
      const savedClaimed = localStorage.getItem('conciouslivin_claimed');
      if (savedClaimed) {
        setClaimedResources(JSON.parse(savedClaimed));
      }
    } catch (e) {
      console.error('Error loading claimed resources from storage', e);
    }
  }, []);

  // Save claimed changes
  useEffect(() => {
    try {
      if (claimedResources.length > 0) {
        localStorage.setItem('conciouslivin_claimed', JSON.stringify(claimedResources));
      }
    } catch (e) {
      console.error('Error saving claimed resources', e);
    }
  }, [claimedResources]);

  const claimBook = (resourceId: string) => {
    setClaimedResources(prev => {
      if (!prev.includes(resourceId)) {
        return [...prev, resourceId];
      }
      return prev;
    });
  };

  const isBookClaimed = (resourceId: string) => {
    return claimedResources.includes(resourceId);
  };

  const openReader = (resource: HealthResource) => {
    setActiveReaderResource(resource);
  };

  const closeReader = () => {
    setActiveReaderResource(null);
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.resource.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

// Download PDF Document with Auth Guard (allows preview downloads)
  const downloadResourceDoc = async (resource: HealthResource) => {
    if (!isAuthenticated) {
      openAuthModal('customer-login', `Please sign in or create a free patient account to download "${resource.title}".`);
      return;
    }

    // Generate PDF from full content on-the-fly
    try {
      const response = await fetch(`/api/download-pdf/${resource.id}`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}_Dr_Arif_Chowdhury.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record download to Supabase
      try {
        await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceId: resource.id,
            resourceTitle: resource.title,
            resourceCategory: resource.category,
            coverImageUrl: resource.coverImage,
            isFree: resource.isFree,
          }),
        });
      } catch (err) {
        console.error('Failed to record download:', err);
      }

      recordDownload(resource);
      unlockResource(resource.id);
      addToast('Download Complete!', `"${resource.title}" PDF generated with full content.`, 'success');
    } catch (error) {
      console.error('PDF generation failed:', error);
      addToast('Download Failed', 'Could not generate PDF. Please try again.', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        resources,
        loading,
        addCustomResource,
        updateResource,
        deleteResource,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
        cartCount,
        unlockedResources,
        unlockResource,
        isResourceUnlocked,
        activeReaderResource,
        openReader,
        closeReader,
        toasts,
        addToast,
        removeToast,
        downloadResourceDoc,
        refreshResources: fetchResources,
        claimBook,
        isBookClaimed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
