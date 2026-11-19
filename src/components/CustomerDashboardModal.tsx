'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { useCart } from '@/context/CartContext';
import { HealthResource } from '@/types/health';
import { 
  X, 
  User, 
  Download, 
  BookOpen, 
  Receipt, 
  ShieldCheck, 
  LogOut,
  Camera,
  Pencil,
  Save,
  Bookmark
} from 'lucide-react';

export const CustomerDashboardModal: React.FC = () => {
  const { formatPrice } = useCountryCurrency();
  const { 
    user, 
    isCustomerDashboardOpen, 
    setIsCustomerDashboardOpen, 
    logout, 
    downloadHistory, 
    purchaseHistory,
    updateProfile,
  } = useAuth();
  
  const { 
    resources, 
    unlockedResources, 
    openReader, 
    downloadResourceDoc,
    isBookClaimed
  } = useCart();

  const [activeTab, setActiveTab] = useState<'library' | 'downloads' | 'orders' | 'profile'>('library');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!photoPreview.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  if (!isCustomerDashboardOpen || !user) return null;

  const unlockedList = resources.filter(r => 
    r.isFree || unlockedResources.includes(r.id)
  );

  const claimedList = resources.filter(r => 
    r.isFree && isBookClaimed(r.id)
  );

  // Combine unlocked and claimed, deduplicate
  const allLibraryBooksMap = new Map<string, HealthResource>();
  unlockedList.forEach(r => allLibraryBooksMap.set(r.id, r));
  claimedList.forEach(r => allLibraryBooksMap.set(r.id, r));
  const allLibraryBooks = Array.from(allLibraryBooksMap.values());

  const cancelProfileEdit = () => {
    setEditName(user.name);
    setSelectedPhoto(null);
    setPhotoPreview('');
    setProfileError('');
    setProfileSaved(false);
    setIsEditingProfile(false);
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSaved(false);
    const { error: saveError } = await updateProfile(editName, selectedPhoto);
    setProfileSaving(false);
    if (saveError) {
      setProfileError(saveError);
      return;
    }
    setProfileSaved(true);
    setSelectedPhoto(null);
    setPhotoPreview('');
    setIsEditingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E293B] animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] my-auto">
        
        {/* Top Header */}
        <div className="p-6 bg-[#1E293B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 shrink-0">
              <Image
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={user.name}
                fill
                unoptimized
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold uppercase tracking-wider">
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsCustomerDashboardOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#F9FAFB] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
activeTab === 'library'
? 'bg-[#0F766E] text-white'
: 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]'
}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Library ({allLibraryBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
activeTab === 'downloads'
? 'bg-[#0F766E] text-white'
: 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]'
}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download History ({downloadHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
activeTab === 'orders'
? 'bg-[#0F766E] text-white'
: 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]'
}`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Purchase Invoices ({purchaseHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
activeTab === 'profile'
? 'bg-[#0F766E] text-white'
: 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0]'
}`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Profile</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: UNLOCKED LIBRARY */}
{activeTab === 'library' && (
            <div className="space-y-6">
              {/* Unlocked Books Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      Available Health Guides & Masterclasses
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Access your free and purchased digital guides anytime.
                    </p>
                  </div>
                </div>

                {unlockedList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unlockedList.map(resource => (
                      <div
                        key={resource.id}
                        className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                            <Image
                              src={resource.coverImage}
                              alt={resource.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          resource.isFree ? 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]' : 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]'
                        }`}>
                              {resource.isFree ? 'Free Digital Guide' : 'Purchased Masterclass'}
                            </span>
                            <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] mt-1 line-clamp-1">
                              {resource.title}
                            </h5>
                            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                              {resource.pages} Pages • Full Access
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                          <button
                            onClick={() => {
                              openReader(resource);
                              setIsCustomerDashboardOpen(false);
                            }}
                            className="py-2 px-3 rounded-xl bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors flex items-center justify-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read</span>
                          </button>

                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            className="py-2 px-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 space-y-3">
                    <BookOpen className="w-10 h-10 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">
                      No unlocked guides yet. Browse the library to add free guides.
                    </p>
                    <button
                      onClick={() => {
                        setIsCustomerDashboardOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold"
                    >
                      Explore Library
                    </button>
                  </div>
                )}
              </div>

              {/* Claimed Books Section (Free books saved to library) */}
              {claimedList.length > 0 && (
                <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bookmark className="w-5 h-5 text-[#14B8A6]" />
                    <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                      My Saved Library ({claimedList.length})
                    </h4>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">
                    Free guides you've saved to your personal library for quick access.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {claimedList.map(resource => (
                      <div
                        key={resource.id}
                        className="p-4 rounded-2xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                            <Image
                              src={resource.coverImage}
                              alt={resource.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]">
                              Saved to Library
                            </span>
                            <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] mt-1 line-clamp-1">
                              {resource.title}
                            </h5>
                            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                              {resource.pages} Pages • Free Guide
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                          <button
                            onClick={() => {
                              openReader(resource);
                              setIsCustomerDashboardOpen(false);
                            }}
                            className="py-2 px-3 rounded-xl bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors flex items-center justify-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read</span>
                          </button>

                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            className="py-2 px-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOWNLOAD HISTORY */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  Your Download History Log
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Every guide you&apos;ve downloaded is permanently archived here for instant 1-click re-download.
                </p>
              </div>

              {downloadHistory.length === 0 ? (
                <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 space-y-3">
                  <Download className="w-10 h-10 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">
                    You have not downloaded any guides yet.
                  </p>
                  <button
                    onClick={() => setActiveTab('library')}
                    className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold"
                  >
                    Explore Free Library
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {downloadHistory.map(item => {
                    const resourceObj = resources.find(r => r.id === item.resourceId);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center shrink-0">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] truncate">
                              {item.resourceTitle}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                              <span>Downloaded: {item.downloadedAt}</span>
                              <span>•</span>
                              <span>{item.fileFormat}</span>
                            </div>
                          </div>
                        </div>

                        {resourceObj && (
                          <button
                            onClick={() => downloadResourceDoc(resourceObj)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-semibold transition-all flex items-center gap-1 shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Again</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PURCHASE INVOICES */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                  Purchase Orders & Tax Receipts
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Detailed receipts for your transactions with Dr. Arif Chowdhury&apos;s academy.
                </p>
              </div>

              {purchaseHistory.length === 0 ? (
                <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 space-y-3">
                  <Receipt className="w-10 h-10 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">
                    No orders on record for this account.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.map(order => (
                    <div
                      key={order.orderId}
                      className="p-5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] pb-3 gap-2">
                        <div>
                          <span className="text-xs font-semibold font-mono text-[#0F766E] dark:text-[#14B8A6]">
                            {order.orderId}
                          </span>
                          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                            Date: {order.purchasedAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                            {formatPrice(order.totalPaid)}
                          </span>
                          <span className="text-[10px] block text-[#0F766E] dark:text-[#14B8A6] font-semibold">
                            PAID • INSTANT DISPATCH
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map(it => {
                          const resObj = resources.find(r => r.id === it.resourceId);
                          return (
                            <div key={it.resourceId} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#1E293B] dark:text-[#E2E8F0] truncate max-w-sm">
                                • {it.title}
                              </span>
                              {it.appointmentDate && it.appointmentTime ? (
                                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                  {it.appointmentDate} at {it.appointmentTime}
                                </span>
                              ) : null}
                              {resObj && (
                                <button
                                  onClick={() => downloadResourceDoc(resObj)}
                                  className="text-[#0F766E] dark:text-[#14B8A6] hover:underline font-semibold flex items-center gap-1 shrink-0"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download PDF</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PATIENT PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F9FAFB] dark:bg-[#0F172A] p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">Profile details</h4>
                    <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">Update your display name and profile photo.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => { setEditName(user.name); setProfileError(''); setProfileSaved(false); setIsEditingProfile(true); }}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition hover:border-[#0F766E] hover:text-[#0F766E] dark:hover:text-[#14B8A6]"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit profile</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={saveProfile} className="space-y-5">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#E2E8F0]">
                        <Image
                          src={photoPreview || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                          alt="Profile photo preview"
                          fill
                          sizes="80px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition hover:border-[#0F766E] hover:text-[#0F766E] dark:hover:text-[#14B8A6]">
                          <Camera className="h-4 w-4" />
                          <span>Choose photo</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setSelectedPhoto(file);
                              setPhotoPreview(file ? URL.createObjectURL(file) : '');
                              setProfileError('');
                            }}
                          />
                        </label>
                        <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">JPG, PNG, or WebP. Maximum 5 MB.</p>
                        {selectedPhoto ? <p className="mt-1 max-w-xs truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{selectedPhoto.name}</p> : null}
                      </div>
                    </div>

                    <label className="block max-w-xl text-sm font-normal text-[#1E293B] dark:text-[#E2E8F0]">
                      Display name
                      <input
                        type="text"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        maxLength={80}
                        required
                        className="mt-2 w-full rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2.5 text-sm outline-none focus:border-[#0F766E]"
                      />
                    </label>

                    {profileError ? <p role="alert" className="text-sm text-[#1E293B] dark:text-[#E2E8F0]">{profileError}</p> : null}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" />
                        <span>{profileSaving ? 'Saving…' : 'Save changes'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={profileSaving}
                        onClick={cancelProfileEdit}
                        className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-2.5 text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] transition hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#E2E8F0]">
                      <Image
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        fill
                          unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="wrap-break-word text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{user.name}</p>
                      <p className="break-all text-sm text-[#64748B] dark:text-[#94A3B8]">{user.email}</p>
                      {profileSaved ? <p role="status" className="mt-2 text-sm font-normal text-[#0F766E] dark:text-[#14B8A6]">Profile updated.</p> : null}
                    </div>
                  </div>
                )}
              </section>

              <div className="p-5 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-4">
                <h4 className="text-sm font-semibold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" />
                  <span>Verified Medical Account Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block">Full Name:</span>
                    <span className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block">Registered Email:</span>
                    <span className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block">Account Tier:</span>
                    <span className="font-semibold text-[#0F766E] dark:text-[#14B8A6]">Full Access Patient & Student</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block">Member Since:</span>
                    <span className="font-semibold text-[#1E293B] dark:text-[#E2E8F0]">{user.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] border border-[#0F766E] text-xs text-[#1E293B] dark:text-[#E2E8F0] leading-relaxed">
                🩺 <strong>Need to consult with Dr. Arif Chowdhury?</strong> You can schedule a 1-on-1 virtual medical audit at any time with direct video consultation.
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of My Account</span>
                </button>

                <button
                  onClick={() => setIsCustomerDashboardOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-white text-xs font-semibold"
                >
                  Close Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
