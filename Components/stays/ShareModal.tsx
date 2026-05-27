'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Facebook, Twitter, Mail, Instagram, Check, Link as LinkIcon, BedDouble, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  image?: string;
  bedrooms?: number;
  capacity?: number;
}

export default function ShareModal({ isOpen, onClose, title, url, image, bedrooms, capacity }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle ESC key and Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? <Check className="text-green-600" size={24} /> : <Copy size={24} />,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleCopy();
      },
      color: 'bg-gray-100',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.075.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank'),
      color: 'bg-green-50 text-green-600',
    },
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Messenger',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.256.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.964l-3.062-3.273-5.965 3.273 6.558-6.96 3.149 3.273 5.878-3.273-6.558 6.96z" />
        </svg>
      ),
      onClick: () => window.open(`fb-messenger://share/?link=${encodeURIComponent(url)}`, '_blank'),
      color: 'bg-blue-100 text-blue-700',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={24} />,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'),
      color: 'bg-sky-50 text-sky-500',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={24} />,
      onClick: async () => {
        await handleCopy();
        window.open('https://www.instagram.com/', '_blank');
      },
      color: 'bg-pink-50 text-pink-600',
    },
    {
      name: 'Email',
      icon: <Mail size={24} />,
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check this out: ' + url)}`, '_blank'),
      color: 'bg-red-50 text-red-500',
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center border-b border-gray-100">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95 z-10"
          >
            <X size={20} strokeWidth={2.5} className="text-gray-900" />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center -ml-8">
            <h2 className="text-[16px] font-black text-gray-900 tracking-tight leading-none mb-1.5">
              {title}
            </h2>
            
            {(bedrooms || capacity) && (
              <div className="flex items-center gap-3">
                {bedrooms && (
                  <div className="flex items-center gap-1">
                    <BedDouble size={11} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500">{bedrooms} BHK</span>
                  </div>
                )}
                {capacity && (
                  <div className="flex items-center gap-1">
                    <Users size={11} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500">Up to {capacity} Guests</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
          {/* Property Info Preview */}
          <div className="flex items-center gap-4 mb-8">
            {image && (
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100">
                <img src={image} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-[14px] font-medium text-gray-600 leading-snug">
              Share this premium farm stay experience with your network.
            </p>
          </div>

          {/* Share Grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={(e) => {
                  option.onClick(e as any);
                  // Optional: close on certain actions
                  if (option.name !== 'Copy Link') onClose();
                }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-primary/10 hover:border-primary/20 transition-all active:scale-[0.97] group text-left"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  option.color
                )}>
                  {option.icon}
                </div>
                <span className="text-[14px] font-bold text-gray-800">
                  {option.name}
                </span>
              </button>
            ))}
          </div>

          {/* Copy Link Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 group-focus-within:border-primary/30 transition-colors">
              <LinkIcon size={18} className="text-gray-400" />
              <input 
                type="text" 
                readOnly 
                value={url} 
                className="bg-transparent text-sm text-gray-500 outline-none flex-1 truncate font-semibold"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="text-[13px] font-black text-primary hover:text-primary-hover px-2 active:scale-95 transition-all"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
