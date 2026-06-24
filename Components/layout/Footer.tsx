'use client';

// import React from 'react';

// export function Footer() {
//   return (
//     <footer className="bg-gray-50 py-8 border-t border-gray-100 mt-20">
//       <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
//         <p>&copy; {new Date().getFullYear()} Kunnath House. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// }


// components/Footer.tsx
import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Footer = () => {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E0E0E0] pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-semibold text-primary hover:text-primary-hover transition-colors">
              Kunnath House Arya private Limited
            </h3>
            <p className="text-gray-400 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">
              Crafted for Recreation
            </p>
            <div className="mt-4">
              <a
                href="tel:+919876543210"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                +91 7702402505
              </a>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/kunnath_farmhouse?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:scale-110 transition-all overflow-hidden p-2">
                <img src="/Logo/insta/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
              </a>
              <a href="https://www.facebook.com/kunnathfarmhouse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:scale-110 transition-all overflow-hidden p-2">
                <img src="/Logo/insta/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
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

          {/* Social & Newsletter Callout */}
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
            {/* <a
                href="#"
                className="text-[#666666] hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.16-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.38-12.08c0-.213 0-.425-.015-.637A10.025 10.025 0 0024 4.57z" />
                </svg>
              </a> */}
            <div className="mt-4">
              <p className="text-[#666666] text-sm">
                <span className="font-medium">Address:</span> Kunnath House, Kompally-Medchal Highway, Jeedipally
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E0E0E0] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#666666]">
          <p>&copy; {currentYear} Kunnath House Arya private Limited. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

