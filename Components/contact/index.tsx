'use client';

import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Button } from '@/Components/ui/Button';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
            setStatus('success');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="py-24 bg-white min-h-screen">
            <Container>
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
                        We'd love to hear from you
                    </h1>
                    <p className="text-lg md:text-xl text-[#666666] leading-relaxed">
                        Whether you have a question about booking a farm stay, planning an event, or just want to say hello, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">

                    {/* Contact Details & Map (Left Column) */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* Quick Info */}
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Phone & WhatsApp</h3>
                                    <p className="text-[#666666] mb-3">Mon-Sun from 8am to 8pm.</p>
                                    <a
                                        href="https://wa.me/911234567890"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors bg-[#FAFAFA] hover:bg-green-50 text-green-600 border border-green-200 hover:border-green-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Email</h3>
                                    <p className="text-[#666666] mb-2">We typically reply within 24 hours.</p>
                                    <a href="mailto:hello@kunnathhouse.com" className="font-medium text-[#1A1A1A] hover:underline">hello@kunnath.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Location</h3>
                                    <p className="text-[#666666] leading-relaxed">
                                        Kunnath House Estate<br />
                                        Survey No. 45/2, Hillside Road<br />
                                        Hyderabad, Telangana 500075
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-soft border border-[#E0E0E0]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121820.67253507106!2d78.37568574163973!3d17.4121530663738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>

                    {/* Form (Right Column) */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#FAFAFA] p-8 md:p-12 rounded-[2rem] shadow-soft border border-[#E0E0E0]">
                            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Send us a message</h2>

                            {status === 'success' ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Message Sent!</h3>
                                    <p className="text-[#666666] mb-8">
                                        Thanks for reaching out. Our team will get back to you shortly.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStatus('idle')}
                                        className="mx-auto"
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-[#1A1A1A] mb-2">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#FFCDD2] focus:border-[#E53935] outline-none transition-all placeholder:text-gray-400"
                                                placeholder="John"
                                                required
                                                disabled={status === 'loading'}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-[#1A1A1A] mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#FFCDD2] focus:border-[#E53935] outline-none transition-all placeholder:text-gray-400"
                                                placeholder="Doe"
                                                required
                                                disabled={status === 'loading'}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#FFCDD2] focus:border-[#E53935] outline-none transition-all placeholder:text-gray-400"
                                            placeholder="john@example.com"
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-[#1A1A1A] mb-2">Subject</label>
                                        <select
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#FFCDD2] focus:border-[#E53935] outline-none transition-all text-[#1A1A1A]"
                                            disabled={status === 'loading'}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Farm Stay Booking</option>
                                            <option>Event Hosting</option>
                                            <option>Membership Program</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-[#1A1A1A] mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#FFCDD2] focus:border-[#E53935] outline-none transition-all resize-none placeholder:text-gray-400"
                                            placeholder="How can we help you?"
                                            required
                                            disabled={status === 'loading'}
                                        ></textarea>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full sm:w-auto px-8 py-4 text-base bg-[#E53935] hover:bg-[#C62828] shadow-md hover:shadow-lg transition-all rounded-xl"
                                            isLoading={status === 'loading'}
                                        >
                                            Send Message
                                        </Button>
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




