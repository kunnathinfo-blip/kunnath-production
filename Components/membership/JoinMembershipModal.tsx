'use client';

import React, { useState } from 'react';
import { X, Crown, MessageSquare, Phone, User, Mail, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';

interface JoinMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  price?: number;
}

export default function JoinMembershipModal({
  isOpen,
  onClose,
  price = 29999,
}: JoinMembershipModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleWhatsAppEnrol = (e: React.FormEvent) => {
    e.preventDefault();

    const text =
      `*GOLD MEMBERSHIP ENROLMENT INQUIRY*\n` +
      `--------------------------------\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📱 *Phone:* ${formData.phone}\n` +
      `✉️ *Email:* ${formData.email || 'Not provided'}\n` +
      `💰 *Plan:* Kunnath House Gold Membership (2 Years - ₹29,999)\n` +
      `💬 *Keyword:* GOLD\n` +
      (formData.message ? `📝 *Notes:* ${formData.message}\n` : '') +
      `--------------------------------\n` +
      `Hi Kunnath House team, I would like to enrol as a Founder Member. Please guide me through the registration and payment process.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917900306655?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl border border-amber-200/50 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-6 pb-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-2">
            <Crown size={14} className="text-amber-200" /> Founder Member Enrolment
          </div>

          <h3 className="text-2xl font-black font-display tracking-tight text-white">
            Join Gold Membership
          </h3>
          <p className="text-xs text-white/90 mt-1">
            2 Years of Farm Stays, Adventure & Exclusive Privileges
          </p>

          <div className="mt-3 inline-flex items-baseline gap-2 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20">
            <span className="text-xs text-white/80">Membership Fee:</span>
            <span className="text-xl font-black text-amber-200">{formatCurrency(price)}</span>
            <span className="text-[11px] text-white/70">/ 2 Years</span>
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleWhatsAppEnrol} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Full Name <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User size={16} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Reddy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                WhatsApp Phone Number <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail size={16} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. vikram@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Any questions or requests? (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention any questions regarding family stays or booking dates..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition resize-none"
              />
            </div>

            {/* Quick Benefits Bullet */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles size={14} /> Included in your Founder Package:
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-900/80 space-y-0.5">
                <li>2 Complimentary Stays (Orange or Lotus for 10-12 guests)</li>
                <li>3 Vouchers worth ₹5,000 each (₹15,000 total discount)</li>
                <li>15 Free ATV/Dirt Bike Laps + Free Box Cricket & Sports</li>
              </ul>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="mt-4 py-3.5 rounded-xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
            >
              <Send size={16} />
              <span>Send Enquiry & Enrol (WhatsApp)</span>
            </Button>
          </form>

          <p className="text-[11px] text-center text-gray-400">
            You can also call us directly at <span className="font-bold text-gray-600">7900306655</span> or <span className="font-bold text-gray-600">7702402505</span>
          </p>
        </div>
      </div>
    </div>
  );
}
