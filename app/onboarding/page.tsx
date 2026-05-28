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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 via-gray-50 to-amber-50/20">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 via-gray-50 to-amber-50/20 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Main Form Box */}
      <div className="w-full max-w-md backdrop-blur-md bg-white/75 border border-white/40 p-8 shadow-2xl rounded-2xl transition-all duration-350">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-serif">KUNNATH</h1>
          <p className="text-xs tracking-[0.25em] text-amber-700 uppercase mt-1">Luxury Stay & Club</p>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-800">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Please provide your details below to activate your account
          </p>
        </div>

        {/* Global Errors */}
        {(error || localError) && (
          <div className="bg-red-50/80 border border-red-200/50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 backdrop-blur-sm">
            {localError || error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Full Name (as per identity card)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                placeholder="John Doe"
              />
            </div>

            {/* Aadhaar Number input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Aadhaar Card Number
              </label>
              <input
                type="text"
                required
                value={aadhaarInput}
                onChange={handleAadhaarChange}
                className="block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                placeholder="0000 0000 0000"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Your Aadhaar details are encrypted securely for compliance validation.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935] shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Saving profile...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
