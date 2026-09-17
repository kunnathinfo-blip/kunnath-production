'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Footer = () => {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="bg-white border-t border-[#E0E0E0] pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="Kunnath House - Crafted for Recreation"
                width={200}
                height={111}
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              Kunnath House Arya Private Limited — crafted for recreation, private luxury stays, and memorable celebrations.
            </p>
            <div className="pt-1">
              <a
                href="tel:+919700799099"
                className="text-primary hover:text-primary-hover font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <Phone size={15} /> +91 97007 99099
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#1A1A1A] font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stays"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Stays
                </Link>
              </li>
              <li>
                <Link
                  href="/sports"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Sports Activities
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#1A1A1A] font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/house-rules"
                  className="text-[#666666] hover:text-primary transition-colors"
                >
                  House Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Connect Section */}
          <div>
            <h4 className="text-[#1A1A1A] font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/kunnath_farmhouse?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <img src="/Logo/insta/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
              </a>
              <a
                href="https://www.facebook.com/kunnathfarmhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <img src="/Logo/insta/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
              </a>
            </div>

            <div className="mt-4">
              <p className="text-[#666666] text-sm">
                <span className="font-medium">Address:</span> Kunnath House, Kompally-Medchal Highway, Jeedipally
              </p>
            </div>

            {/* Admin Portal Button - only visible to admins */}
            {isMounted && user?.role === 'admin' && (
              <div className="mt-5">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 hover:from-[#E53935] hover:to-[#C62828] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-gray-900/10 hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-0.5 group border border-gray-800"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" />
                  <span>Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E0E0E0] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#666666]">
          <p>&copy; {currentYear} Kunnath House Arya Private Limited. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

