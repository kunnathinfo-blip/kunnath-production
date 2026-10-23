'use client';

import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Button } from '@/Components/ui/Button';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Send, 
    CheckCircle2, 
    Sparkles, 
    MessageSquare, 
    User, 
    HelpCircle,
    Navigation,
    ShieldCheck
} from 'lucide-react';
import api from '@/lib/axios';
import { AnalyticsEvents } from '@/lib/analytics';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await api.post('/contact', formData);
            AnalyticsEvents.contactSubmitted(formData.subject);
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen pb-20 font-sans">
            {/* Hero Header matching luxury site standard (Commented out for later use)
            <section className="bg-gray-900 text-white py-16 sm:py-20 md:py-24 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/90 to-gray-900" />
                
                <Container className="relative z-10 text-center max-w-4xl">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3.5 inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
                        <Sparkles size={14} className="text-primary" /> Concierge & Inquiries
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
                        We'd Love To Hear From You
                    </h1>
                    <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                        Whether you are planning a serene weekend getaway, hosting a private celebration, or curious about our amenities, our concierge team is always here for you.
                    </p>
                </Container>
            </section>
            */}

            {/* Main Content Area */}
            <Container className="py-10 sm:py-14 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch max-w-7xl mx-auto">

                    {/* Contact Details & Map (Left Column) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full">

                        {/* Quick Contact Cards */}
                        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] border border-gray-100/80 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Get in Touch</h3>
                                <p className="text-sm text-gray-500">Reach out directly via call, WhatsApp, or email.</p>
                            </div>

                            {/* Phone & WhatsApp */}
                            <div className="group rounded-2xl p-4 bg-gray-50/70 hover:bg-white hover:shadow-md border border-gray-100 transition-all duration-300 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Phone size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-gray-900">Phone & WhatsApp</h4>
                                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">8 AM - 8 PM</span>
                                    </div>
                                    <p className="text-base font-semibold text-gray-800 mt-1">
                                        <a href="tel:7702402505" className="hover:text-primary transition-colors">7702402505</a>
                                        <span className="text-gray-400 mx-1.5 font-normal">/</span>
                                        <a href="tel:7900306655" className="hover:text-primary transition-colors">7900306655</a>
                                    </p>
                                    <div className="mt-3">
                                        <a
                                            href="https://wa.me/917900306655"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => AnalyticsEvents.contactClick('whatsapp')}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                            Quick WhatsApp Chat
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group rounded-2xl p-4 bg-gray-50/70 hover:bg-white hover:shadow-md border border-gray-100 transition-all duration-300 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Mail size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900">Email Address</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Replies within 24 hours</p>
                                    <a
                                        href="mailto:hello@kunnathhouse.com"
                                        onClick={() => AnalyticsEvents.contactClick('email')}
                                        className="inline-block mt-1 font-semibold text-gray-900 hover:text-primary transition-colors text-sm"
                                    >
                                        hello@kunnathhouse.com
                                    </a>
                                </div>
                            </div>

                            {/* Location Address */}
                            <div className="group rounded-2xl p-4 bg-gray-50/70 hover:bg-white hover:shadow-md border border-gray-100 transition-all duration-300 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <MapPin size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900">Estate Location</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                                        Kunnath House Arya Private Limited,<br />
                                        Jeedipally Village, Manoharabad,<br />
                                        Kompally-Medchal Highway, Telangana 502336
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Card */}
                        <div className="bg-white rounded-[32px] p-2.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] border border-gray-100/80 overflow-hidden flex flex-col flex-1 min-h-[220px]">
                            <div className="p-4 pb-2 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <Navigation size={16} className="text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Find Us On Google Maps</span>
                                </div>
                                <a 
                                    href="https://maps.app.goo.gl/KunnathHouse" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-primary font-bold hover:underline"
                                >
                                    Directions
                                </a>
                            </div>
                            <div className="w-full flex-1 min-h-[180px] rounded-[24px] overflow-hidden border border-gray-100 shadow-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.9662212671265!2d78.4679647!3d17.746230699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc775bf397e4d1%3A0x830514304966871a!2sKunnath%20House%20Farm%20House!5e0!3m2!1sen!2sin!4v1782287360836!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* Form (Right Column) */}
                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="bg-white p-7 sm:p-10 md:p-12 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] border border-gray-100/80 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
                                <div>
                                    <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Direct Message</span>
                                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Send Us an Inquiry</h2>
                                </div>
                                <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-primary/10 text-primary items-center justify-center">
                                    <Send size={20} />
                                </div>
                            </div>

                            {status === 'success' ? (
                                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-8 sm:p-12 text-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-sm">
                                        <CheckCircle2 size={34} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">Inquiry Received!</h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                                        Thank you for reaching out. A representative from our hospitality team will contact you shortly.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStatus('idle')}
                                        className="mx-auto rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                                    >
                                        Send Another Inquiry
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 flex items-center gap-2">
                                            <span>⚠️ {errorMessage}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Full Name <span className="text-primary">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-800"
                                                placeholder="e.g. John Doe"
                                                required
                                                disabled={status === 'loading'}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                Email Address <span className="text-primary">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-800"
                                                    placeholder="john@example.com"
                                                    required
                                                    disabled={status === 'loading'}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                Phone Number <span className="text-primary">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Phone size={18} />
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm font-medium text-gray-800"
                                                    placeholder="+91 98765 43210"
                                                    required
                                                    disabled={status === 'loading'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Inquiry Purpose
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <HelpCircle size={18} />
                                            </div>
                                            <select
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/60 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-800 cursor-pointer"
                                                disabled={status === 'loading'}
                                            >
                                                <option>General Inquiry</option>
                                                <option>Farm Stay Booking</option>
                                                <option>Private Event Hosting</option>
                                                <option>Sports Arena & Clubhouse</option>
                                                <option>Membership Program</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Your Message <span className="text-primary">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none text-gray-400">
                                                <MessageSquare size={18} />
                                            </div>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50/60 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-gray-400 text-sm font-medium text-gray-800"
                                                placeholder="Tell us about your requirements, dates, or questions..."
                                                required
                                                disabled={status === 'loading'}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all rounded-2xl flex items-center justify-center gap-2"
                                            isLoading={status === 'loading'}
                                        >
                                            <Send size={16} />
                                            <span>Send Message</span>
                                        </Button>

                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            Your details are kept strictly confidential.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}




