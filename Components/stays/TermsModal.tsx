'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, DollarSign, ShieldCheck, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  formatCurrency: (value: number) => string;
}

export default function TermsModal({ isOpen, onClose, totalPrice, formatCurrency }: TermsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  const upfrontAmount = Math.round(totalPrice * 0.5);
  const checkInAmount = totalPrice - upfrontAmount;
  const securityDeposit = 5000;
  const checkInTotal = checkInAmount + securityDeposit;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[32px] w-full max-w-[520px] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-150">
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ClipboardList size={20} className="text-gray-600" />
            Terms & Payment Details
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Close"
          >
            <X size={20} className="text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Policy Information Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm shadow-sm border border-gray-100">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Upfront Confirmation</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  50% of the total booking amount must be paid now to confirm and secure your reservation slots at the property.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm shadow-sm border border-gray-100">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Check-in Balance</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The remaining 50% balance amount is payable at the time of check-in at the property.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-600 font-bold text-sm shadow-sm border border-gray-100">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Refundable Security Deposit</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  A refundable security deposit of {formatCurrency(securityDeposit)} is collected during check-in. This deposit will be fully refunded after check-out, subject to property inspection showing no damages or policy violations.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary Table */}
          <div className="mt-8 pt-6 border-t border-gray-150">
            <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-tight">Payment Summary</h3>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Total Booking Amount</span>
                <span className="font-bold text-gray-800">{formatCurrency(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-200">
                <span className="text-gray-900 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Amount Paying Now (50%)
                </span>
                <span className="text-sm font-black text-green-600">{formatCurrency(upfrontAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-200">
                <span className="text-gray-900 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Amount to Pay at Check-in
                </span>
                <span className="text-sm font-black text-amber-600">{formatCurrency(checkInTotal)}</span>
              </div>

              <div className="bg-white/70 p-3 rounded-xl border border-gray-100 text-[10px] text-gray-500 leading-relaxed space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>• Remaining Balance (50%)</span>
                  <span>{formatCurrency(checkInAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>• Security Deposit (Refundable)</span>
                  <span>{formatCurrency(securityDeposit)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
