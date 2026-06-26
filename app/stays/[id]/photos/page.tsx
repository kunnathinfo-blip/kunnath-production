'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Heart, Upload } from 'lucide-react';
import { useStayDetails } from '@/hooks/useStays';
import ShareModal from '@/Components/stays/ShareModal';
import { getOptimizedImageUrl } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
}

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'dining', label: 'Dining' },
  { id: 'activities', label: 'Activities' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'other', label: 'Other Images' },
];

function PhotoGrid({ images }: { images: string[] }) {
  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      {images.map((src, idx) => (
        <div
          key={idx}
          className="w-full overflow-hidden rounded-2xl bg-gray-50 group cursor-default"
        >
          <img
            src={getOptimizedImageUrl(src, 1200)}
            alt=""
            className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.01]"
            style={{ maxHeight: '900px' }}
            loading={idx < 2 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Thumbnail Button ─────────────────────────────────────────────────────────
function ThumbButton({ cat, thumb, onClick }: { cat: Category; thumb: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 group text-center focus:outline-none w-full cursor-pointer"
    >
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 group-hover:shadow-lg group-hover:ring-gray-900 group-active:scale-95">
        <img
          src={getOptimizedImageUrl(thumb, 300)}
          alt={cat.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-[12px] sm:text-[13px] font-bold text-gray-500 group-hover:text-gray-900 transition-all tracking-tight group-hover:translate-y-[-1px]">
        {cat.label}
      </span>
    </button>
  );
}

// ─── Sticky Label Column ──────────────────────────────────────────────────────
function StickyLabel({ cat }: { cat: Category }) {
  return (
    <div
      className="hidden sm:block flex-shrink-0 w-[180px] lg:w-[240px]"
      style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}
    >
      <h2 className="text-[26px] lg:text-[32px] font-bold text-gray-900 leading-[1.1] mb-3 tracking-tight">
        {cat.label}
      </h2>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function PhotoTourPage() {
  const params = useParams();
  const stayId = params.id as string;
  const router = useRouter();
  const { data: stayData, isLoading } = useStayDetails(stayId);
  const [catImages, setCatImages] = useState<Record<string, string[]>>({});
  const [flatImages, setFlatImages] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Fetch gallery – now returns { flat, categorized }
  useEffect(() => {
    if (stayData?.slug) {
      fetch(`/api/gallery/${stayData.slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && typeof data === 'object') {
            // New format: { flat: [...], categorized: { exterior: [...], ... } }
            if (data.categorized && Object.keys(data.categorized).length > 0) {
              setCatImages(data.categorized);
            }
            if (Array.isArray(data.flat) && data.flat.length > 0) {
              setFlatImages(data.flat);
            }
            // Backward compat: if API returns plain array (old format)
            if (Array.isArray(data) && data.length > 0) {
              setFlatImages(data);
            }
          }
        })
        .catch(console.error);
    }
  }, [stayData?.slug]);

  // Use categorized if available, otherwise fall back to distributing flat images
  const hasCategorized = Object.keys(catImages).length > 0;
  const images = flatImages.length > 0 ? flatImages : stayData?.images || [];

  // If no real categories, distribute evenly across available categories
  const effectiveCatImages: Record<string, string[]> = hasCategorized
    ? catImages
    : (() => {
        const cats = CATEGORIES;
        const perCat = Math.max(1, Math.ceil(images.length / cats.length));
        return Object.fromEntries(
          cats.map((cat, i) => [cat.id, images.slice(i * perCat, (i + 1) * perCat)])
        );
      })();

  // Scroll to section
  const scrollTo = useCallback((catId: string) => {
    const el = sectionRefs.current[catId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Keyboard: Escape → back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') router.back(); };
    window.addEventListener('keydown', onKey);
    
    // Disable body scroll when gallery is open to prevent double scrollbars
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gray-100 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  const visibleCats = CATEGORIES.filter((c) => (effectiveCatImages[c.id]?.length ?? 0) > 0);

  return (
    <div
      className="fixed inset-0 bg-white z-50 overflow-y-auto scroll-smooth"
      style={{
        fontFamily:
          "Circular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/[0.98] backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
          {/* Close */}
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} className="text-gray-900" />
          </button>

          {/* Property title — centered absolutely */}
          <p className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md pointer-events-none hidden md:block">
            {stayData?.name || 'Photo tour'}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all active:scale-95"
            >
              <Upload size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ──────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-10 pb-32">

        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-[36px] font-bold text-gray-900 tracking-tight">
            Photo tour
          </h1>
        </div>

        {/* ── Thumbnail Strip ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pb-10 mb-16 border-b border-gray-100">
          {visibleCats.map((cat) => {
            const thumb = effectiveCatImages[cat.id]?.[0];
            if (!thumb) return null;
            return (
              <ThumbButton
                key={cat.id}
                cat={cat}
                thumb={thumb}
                onClick={() => scrollTo(cat.id)}
              />
            );
          })}
        </div>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <div className="space-y-24 sm:space-y-32">
          {visibleCats.map((cat, idx) => {
            const imgs = effectiveCatImages[cat.id] ?? [];
            if (!imgs.length) return null;

            return (
              <section
                key={cat.id}
                ref={(el) => { sectionRefs.current[cat.id] = el; }}
                className="scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Mobile: stacked header */}
                <div className="sm:hidden mb-6">
                  <h2 className="text-[20px] font-bold text-gray-900">{cat.label}</h2>
                  <p className="text-[13px] text-gray-500 mt-1">
                    {imgs.length} photo{imgs.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Desktop: sticky label + photo grid side by side */}
                <div className="flex gap-10 lg:gap-20 items-start">
                  <StickyLabel cat={cat} />

                  {/* Photo grid — takes all remaining width */}
                  <div className="flex-1 min-w-0">
                    <PhotoGrid images={imgs} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={stayData?.name || 'Farm Stay'}
        url={typeof window !== 'undefined' ? window.location.href.split('/photos')[0] : ''}
        image={stayData?.images?.[0]}
        bedrooms={stayData?.bedrooms}
        capacity={stayData?.capacity}
      />
    </div>
  );
}