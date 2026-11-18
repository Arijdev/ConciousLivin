'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { 
  X, 
  BookOpen, 
  Download} from 'lucide-react';

interface MyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({ isOpen, onClose }) => {
  const { unlockedResources, openReader, downloadResourceDoc } = useCart();

  if (!isOpen) return null;

  const unlockedList = HEALTH_RESOURCES.filter(r => 
    r.isFree || unlockedResources.includes(r.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E293B] animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] text-white border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F766E]/20 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                My Unlocked Health Library ({unlockedList.length})
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Lifetime digital access & instant PDF downloads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close my library"
            className="p-2 rounded-lg bg-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {unlockedList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-12 h-12 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
              <h4 className="text-base font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                No guides unlocked yet
              </h4>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mx-auto">
                Explore our free downloads or purchase clinical masterclasses to build your library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlockedList.map(resource => (
                <div
                  key={resource.id}
                  className="p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between space-y-4 hover:border-[#0F766E] transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0">
                      <Image
                        src={resource.coverImage}
                        alt={resource.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
resource.isFree ? 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]' : 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]'
}`}>
                          {resource.isFree ? 'Free Guide' : 'Purchased Masterclass'}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0] line-clamp-2">
                        {resource.title}
                      </h5>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                        {resource.pages} Pages • Full Access
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                    <button
                      onClick={() => {
                        openReader(resource);
                        onClose();
                      }}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#E2E8F0] text-xs font-semibold hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online</span>
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
          )}

          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-between items-center text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span>All downloads are free from DRM and print-ready.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1E293B] text-white font-semibold"
            >
              Close Library
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
