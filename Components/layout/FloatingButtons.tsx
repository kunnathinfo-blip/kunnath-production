'use client';

import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingButtons = () => {
  const whatsappNumber = "+917702402505"; // Replace with real number
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none"
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp size={32} />
        <span className="absolute right-16 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
          Chat with us
        </span>
      </a>

      {/* Instagram Button */}
      {/* <a
        href="#"
        className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 translate-x-1"
        aria-label="Instagram"
      >
        <Instagram size={22} />
        <span className="absolute right-16 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
          Instagram
        </span>
      </a> */}

      {/* Facebook Button */}
      {/* <a
        href="#"
        className="group relative flex items-center justify-center w-12 h-12 bg-[#1877F2] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 translate-x-1"
        aria-label="Facebook"
      >
        <Facebook size={22} className="fill-current" />
        <span className="absolute right-16 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
          Facebook
        </span>
      </a> */}
    </div>
  );
};

export default FloatingButtons;
