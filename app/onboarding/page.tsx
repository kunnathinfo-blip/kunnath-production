'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, onboard, isLoading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState('/');

  // Parse redirect query parameter safely on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get('redirect');
      if (redir) {
        setRedirect(redir);
      }
    }
  }, []);

  useEffect(() => {
    // If not loaded, wait. Once loaded, if user is not logged in, redirect to login.
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
    // If user is already verified and onboarded, redirect to Landing
    if (!isLoading && user && user.isVerified) {
      router.replace(redirect);
    }
  }, [user, isLoading, router, redirect]);

  // Real-time Aadhaar formatting: XXXX XXXX XXXX
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Numbers only
    if (rawVal.length > 12) return; // Cap at 12 digits

    // Format as 4-digit groups separated by spaces
    const parts = [];
    for (let i = 0; i < rawVal.length; i += 4) {
      parts.push(rawVal.substring(i, i + 4));
    }
    setAadhaarInput(parts.join(' '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanedAadhaar = aadhaarInput.replace(/\D/g, '');
    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (cleanedAadhaar.length !== 12) {
      setLocalError('Please enter a valid 12-digit Aadhaar Card number.');
      return;
    }

    try {
      await onboard(name, cleanedAadhaar);
      router.push(redirect);
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Onboarding registration failed.');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-50 via-gray-100 to-amber-50/10">
        <div className="text-center animate-in fade-in duration-300">
          <div className="h-10 w-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Left Column: Visual Brand Sidebar (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-end justify-start p-16">
        {/* Background Image of Stay property */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out hover:scale-105"
          style={{ backgroundImage: "url('/stays/orange/Mainview.JPG')" }}
        />
        {/* Sleek Overlay Gradient for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-gray-950/20" />
        
        {/* Brand visual info */}
        <div className="relative z-10 text-white max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-amber-300">
            ★ Premium Private Sanctuary
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight font-serif leading-tight">
              Kunnath House
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              Experience the perfect blend of private luxury stays, elite sports club amenities, and tranquil recreation designed for premium leisure.
            </p>
          </div>

          {/* Testimonial/Badge widget */}
          <div className="pt-6 border-t border-white/15 flex items-center gap-4">
            <div className="flex -space-x-2">
              <span className="h-8 w-8 rounded-full border border-gray-950 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">G1</span>
              <span className="h-8 w-8 rounded-full border border-gray-950 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">G2</span>
              <span className="h-8 w-8 rounded-full border border-gray-950 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">G3</span>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">Loved by Families & Athletes</p>
              <p className="text-gray-400 text-xs font-light">5.0 Star rated hospitality and facilities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Modern Onboarding Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 bg-gradient-to-tr from-gray-50 via-gray-100 to-amber-50/10 min-h-screen relative">
        
        {/* Top Header Branding (Mobile/Tablet only) */}
        <div className="w-full max-w-md flex justify-between items-center lg:justify-end mb-6">
          <div className="lg:hidden animate-in fade-in duration-300">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900 font-serif">Kunnath House</h2>
            <p className="text-[9px] tracking-widest text-amber-700 uppercase font-bold">Recreation</p>
          </div>
        </div>

        {/* Main Content Form Card */}
        <div className="w-full max-w-md my-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* Form Header */}
          <div className="space-y-2.5">
            <div className="h-12 w-12 rounded-2xl bg-[#E53935]/10 flex items-center justify-center text-[#E53935] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif">
              Complete Your Profile
            </h2>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Please provide your details below to activate your account and start booking.
            </p>
          </div>

          {/* Error Alert Box */}
          {(error || localError) && (
            <div className="bg-red-50/70 border border-red-200/40 text-red-700 p-4 rounded-xl text-xs flex items-start gap-3 backdrop-blur-md animate-in fade-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span className="font-medium leading-relaxed">{localError || error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Full Name input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Full Name (as per identity card)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300/80 py-3.5 px-4 text-gray-900 placeholder:text-gray-400/80 focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/10 sm:text-sm bg-white/70 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Aadhaar Number input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Aadhaar Card Number
                </label>
                <input
                  type="text"
                  required
                  value={aadhaarInput}
                  onChange={handleAadhaarChange}
                  className="block w-full rounded-xl border border-gray-300/80 py-3.5 px-4 text-gray-900 placeholder:text-gray-400/80 focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/10 sm:text-sm bg-white/70 transition-all outline-none"
                  placeholder="0000 0000 0000"
                />
                <p className="text-[11px] text-gray-400/85 font-light leading-relaxed">
                  Your Aadhaar details are encrypted securely for compliance validation.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-4 focus:ring-[#E53935]/20 shadow-xl shadow-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer legal text */}
        <div className="w-full max-w-md text-center text-xs text-gray-400 font-light mt-8">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-gray-600 transition-colors">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
