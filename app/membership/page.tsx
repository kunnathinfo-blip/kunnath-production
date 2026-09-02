'use client';

import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { 
  Crown, 
  Send, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  ZoomIn, 
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    membershipType: 'Annual Pre-Launch Package (₹24,999/yr)',
    message: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phone, email, membershipType, message } = formData;

    const formattedMessage = 
      `*New Membership Inquiry - Kunnath House*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n` +
      `✉️ *Email:* ${email.trim() ? email : 'Not specified'}\n` +
      `👑 *Interested Plan:* ${membershipType}\n` +
      `💬 *Message:* ${message.trim() ? message : 'I am interested in becoming a member of Kunnath House.'}`;

    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/919700799099?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Hero Header matching site standard */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')" }}
        />
        <Container className="relative z-10 text-center max-w-4xl">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-1.5">
            <Sparkles size={16} /> Exclusive Membership Access
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Kunnath House Membership
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unlock priority stay reservations, private pool access, sports arena perks, and bespoke hospitality crafted for recreation.
          </p>
        </Container>
      </section>

      {/* Main Two-Column Section */}
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
          
          {/* LEFT COLUMN: Membership Inquiry Form Card */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Card className="rounded-[32px] p-6 sm:p-8 md:p-10 border border-gray-100 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block">
                    INQUIRE NOW
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    Limited Time Offer
                  </span>
                </div>

                <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  Request Membership Details
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Fill out the form below. Clicking send will directly connect you with our team on WhatsApp.
                </p>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Mobile / WhatsApp Number <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Interested Membership Tier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Interested Membership Tier
                    </label>
                    <div className="relative">
                      <Crown className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        name="membershipType"
                        value={formData.membershipType}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Annual Pre-Launch Package (₹24,999/yr)">Annual Pre-Launch Package (₹24,999/yr)</option>
                        <option value="Gold Membership">Gold Membership Plan</option>
                        <option value="Platinum Membership">Platinum VIP Membership</option>
                        <option value="General Inquiry">General Membership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Message / Special Requirements
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us any specific preferences or questions..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Send Button */}
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    className="py-4 text-base font-bold rounded-2xl bg-primary text-white hover:bg-primary-hover shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry via WhatsApp</span>
                  </Button>
                </form>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct Team Connection</span>
                </div>
                <span className="text-gray-400">Call / WhatsApp: +91 7842402505</span>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Poster Showcase matching website Card design */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Card className="rounded-[32px] overflow-hidden border border-gray-100 bg-white p-2.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-between h-full">
              <div className="relative aspect-auto overflow-hidden rounded-[24px] group">
                <img
                  src="/membership.jpeg"
                  alt="Kunnath House Membership Offer Poster"
                  className="w-full h-auto object-cover rounded-[24px] group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-2 font-bold text-sm cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                  <span>Click to enlarge poster</span>
                </div>
              </div>

              <div className="p-6 pt-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest">
                      Pre-Launch Offer Poster
                    </span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-primary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Enlarge Poster</span>
                    </button>
                  </div>

                  {/* Price Highlight Row */}
                  <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                        Pre-Launch Price
                      </span>
                      <span className="text-2xl font-black text-primary">₹24,999</span>
                      <span className="text-xs text-gray-500 font-bold ml-1">/ year</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                        Package Value
                      </span>
                      <span className="text-sm font-bold text-gray-400 line-through">
                        ₹1,000,000+
                      </span>
                    </div>
                  </div>

                  {/* Key Features Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-bold text-gray-700">
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Complimentary Stays</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>20+ Sports & Activities</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Party Lawn & Events</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Discount Vouchers</span>
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="md"
                  variant="outline"
                  className="mt-6 py-3 text-sm font-bold rounded-xl border-primary text-primary hover:bg-primary/5 transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  View Poster Fullscreen
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </Container>

      {/* Lightbox Modal for HD Poster */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
              aria-label="Close poster view"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src="/membership.jpeg"
              alt="Kunnath House Membership Poster Full Resolution"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}