'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Helper to transform raw technical error codes into clear, beautiful, user-friendly messages.
const getFriendlyErrorMessage = (err: any): string => {
  // Check if it is an API response error from our backend first
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  const code = err?.code || '';
  const message = err?.message || '';

  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return 'We have detected too many verification requests to this device. For security and to prevent spam, SMS delivery is temporarily locked for your mobile number. Please wait a few minutes before trying again.';
  }
  if (code === 'auth/invalid-phone-number' || message.includes('invalid-phone-number')) {
    return 'The mobile number you entered is incorrect. Please check the digits and try again.';
  }
  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return 'A network error occurred. Please check your internet connection and try again.';
  }
  if (code === 'auth/invalid-verification-code' || message.includes('invalid-verification-code') || message.includes('invalid-credential')) {
    return 'The 6-digit code you entered is incorrect. Please double-check it and try again.';
  }
  if (code === 'auth/code-expired' || message.includes('code-expired')) {
    return 'The verification code has expired. Please click Resend OTP to request a new code.';
  }
  if (code === 'auth/captcha-check-failed' || message.includes('captcha-check-failed')) {
    return 'Security verification (reCAPTCHA) failed. Please refresh the page and try again.';
  }
  if (code === 'auth/user-disabled' || message.includes('user-disabled')) {
    return 'Your account has been deactivated. Please contact Kunnath House support.';
  }

  // Clean raw Firebase messages
  const cleanMsg = message.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\./, '');
  return cleanMsg || 'An unexpected error occurred. Please try again.';
};

export default function LoginPage() {
  const router = useRouter();
  const { verifyOtp, isLoading, error } = useAuthStore();
  
  // Phone flow state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [localError, setLocalError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [redirect, setRedirect] = useState('/');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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

  // Refs for OTP inputs auto-focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpScreen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpScreen, timer]);

  // Initialize reCAPTCHA Verifier
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response: any) => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            // reCAPTCHA expired
          }
        });
      } catch (err) {
        console.error('Error creating RecaptchaVerifier:', err);
      }
    }

    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Handle requesting OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Clean phone number format
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingOtp(true);

    try {
      // Setup formatted phone number with country code for Firebase
      const formattedPhone = `+91${cleaned}`;
      const appVerifier = (window as any).recaptchaVerifier;

      if (!appVerifier) {
        setLocalError('reCAPTCHA verification is not initialized. Please refresh the page.');
        setIsSendingOtp(false);
        return;
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      (window as any).confirmationResult = confirmationResult;

      setShowOtpScreen(true);
      setTimer(60); // Firebase OTP validity
      // Auto focus first OTP input box on next tick
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      console.error('Firebase signInWithPhoneNumber Error:', err);
      setLocalError(getFriendlyErrorMessage(err));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLocalError(null);
    try {
      const cleaned = phoneNumber.replace(/\D/g, '');
      const formattedPhone = `+91${cleaned}`;
      const appVerifier = (window as any).recaptchaVerifier;

      if (!appVerifier) {
        setLocalError('reCAPTCHA verification is not initialized.');
        return;
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      (window as any).confirmationResult = confirmationResult;

      setTimer(60);
      setOtp(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      console.error('Firebase resend OTP Error:', err);
      setLocalError(getFriendlyErrorMessage(err));
    }
  };

  // Handle OTP Inputs key changes
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Digits only

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only keep last digit
    setOtp(newOtp);

    // Move focus forward if input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace or navigation in OTP fields
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle verifying OTP & Login / Redirect to Onboarding
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setLocalError('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      const cleaned = phoneNumber.replace(/\D/g, '');

      const confirmationResult = (window as any).confirmationResult;
      if (!confirmationResult) {
        setLocalError('No active verification session. Please request a new code.');
        return;
      }

      const userCredential = await confirmationResult.confirm(otpCode);
      const idToken = await userCredential.user.getIdToken();

      // Pass Firebase ID token to the backend for session creation
      const result = await verifyOtp(cleaned, undefined, idToken);

      if (result.userExists) {
        if (result.user.name && result.user.isVerified) {
          router.push(redirect);
        } else {
          router.push(`/onboarding?redirect=${encodeURIComponent(redirect)}`);
        }
      } else {
        router.push(`/onboarding?redirect=${encodeURIComponent(redirect)}`);
      }
    } catch (err: any) {
      console.error('OTP confirmation/verification failed:', err);
      setLocalError(getFriendlyErrorMessage(err));
    }
  };

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

      {/* Right Column: Modern Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center p-6 sm:p-12 md:p-16 bg-gradient-to-tr from-gray-50 via-gray-100 to-amber-50/10 min-h-screen relative">
        
        {/* Invisible reCAPTCHA Anchor for Firebase */}
        <div id="recaptcha-container" className="hidden"></div>

        {/* Top Header Branding (Mobile/Tablet only) */}
        <div className="w-full max-w-md flex justify-between items-center lg:justify-end mb-6">
          <div className="lg:hidden">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900 font-serif">Kunnath House</h2>
            <p className="text-[9px] tracking-widest text-amber-700 uppercase font-bold">Recreation</p>
          </div>
        </div>

        {/* Main Content Form Card */}
        <div className="w-full max-w-md my-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* Form Header */}
          <div className="space-y-2.5">
            <div className="h-12 w-12 rounded-2xl bg-[#E53935]/10 flex items-center justify-center text-[#E53935] mb-4">
              {showOtpScreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif">
              {showOtpScreen ? 'Security Verification' : 'Sign In with Mobile'}
            </h2>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              {showOtpScreen 
                ? `Please enter the 6-digit verification code sent to +91 ${phoneNumber}` 
                : 'Enter your 10-digit mobile number to access stays, club bookings, and memberships.'}
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

          {/* Forms Section */}
          <div className="space-y-6">
            {!showOtpScreen ? (
              // Step 1: Mobile Number Input
              <form className="space-y-5" onSubmit={handleRequestOtp}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl shadow-sm transition-all duration-300 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 text-gray-400 font-semibold border-r border-gray-200/85">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="block w-full rounded-xl border border-gray-300/80 py-3.5 pl-16 pr-4 text-gray-900 placeholder:text-gray-400/80 focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/10 sm:text-sm bg-white/70 transition-all outline-none"
                      placeholder="Enter 10-digit number"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-4 focus:ring-[#E53935]/20 shadow-xl shadow-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Verification Code</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              // Step 2: OTP Verification Screen
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-between gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        pattern="\d*"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border border-gray-300/80 rounded-xl focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/10 bg-white/70 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend and Edit Actions */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpScreen(false);
                      setLocalError(null);
                    }}
                    className="font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>← Edit Phone Number</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`font-bold transition-colors cursor-pointer ${
                      timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#E53935] hover:text-[#C62828]'
                    }`}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-4 focus:ring-[#E53935]/20 shadow-xl shadow-red-500/10 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
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
