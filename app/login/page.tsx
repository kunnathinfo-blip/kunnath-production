'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, isLoading, error } = useAuthStore();
  
  // Phone flow state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [localError, setLocalError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

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

  // Initialize Recaptcha Verifier
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

    // Bypass Firebase SMS send for test numbers
    const testNumbers = ['8247027216', '1234567890', '9999999999', '8888888888', '7777777777'];
    if (testNumbers.includes(cleaned)) {
      setShowOtpScreen(true);
      setTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return;
    }

    try {
      // Setup formatted phone number with country code for Firebase
      const formattedPhone = `+91${cleaned}`;
      const appVerifier = (window as any).recaptchaVerifier;

      if (!appVerifier) {
        setLocalError('reCAPTCHA verification is not initialized. Please refresh the page.');
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
      if (err.code === 'auth/too-many-requests' || err.message?.includes('too-many-requests')) {
        setLocalError('SMS limits exceeded. Redirecting to manual bypass mode. Enter code: 123456.');
        setShowOtpScreen(true);
        setTimer(60);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setLocalError(err.message || 'Failed to send OTP. Please try again.');
      }
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLocalError(null);
    try {
      const cleaned = phoneNumber.replace(/\D/g, '');
      
      // Bypass Firebase SMS send for test numbers
      const testNumbers = ['8247027216', '1234567890', '9999999999', '8888888888', '7777777777'];
      if (testNumbers.includes(cleaned)) {
        setTimer(60);
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
        return;
      }

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
      if (err.code === 'auth/too-many-requests' || err.message?.includes('too-many-requests')) {
        setLocalError('SMS limits exceeded. Please use manual bypass code: 123456.');
        setTimer(60);
        setOtp(Array(6).fill(''));
        otpRefs.current[0]?.focus();
      } else {
        setLocalError(err.message || 'Failed to resend OTP.');
      }
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

      let result;
      // Support master test code bypass
      if (otpCode === '123456') {
        result = await verifyOtp(cleaned, otpCode);
      } else {
        const confirmationResult = (window as any).confirmationResult;
        if (!confirmationResult) {
          setLocalError('No active verification session. Please request a new code.');
          return;
        }

        const userCredential = await confirmationResult.confirm(otpCode);
        const idToken = await userCredential.user.getIdToken();

        // Pass Firebase ID token to the backend for session creation
        result = await verifyOtp(cleaned, undefined, idToken);
      }

      if (result.userExists) {
        if (result.user.name && result.user.isVerified) {
          router.push('/');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/onboarding');
      }
    } catch (err: any) {
      console.error('OTP confirmation/verification failed:', err);
      setLocalError(err.message || 'Verification failed. Incorrect code.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 via-gray-50 to-amber-50/20 px-4 py-12 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Main Glassmorphic Wrapper */}
      <div className="w-full max-w-md backdrop-blur-md bg-white/75 border border-white/40 p-8 shadow-2xl rounded-2xl transition-all duration-350 ease-in-out">
        {/* Invisible reCAPTCHA Anchor */}
        <div id="recaptcha-container" className="hidden"></div>
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-serif">Kunnath House</h1>
          <p className="text-xs tracking-[0.25em] text-amber-700 uppercase mt-1">Crafted for Recreation</p>
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-800">
            {showOtpScreen ? 'Verification Code' : 'Sign In with Mobile'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {showOtpScreen 
              ? `Enter the 6-digit OTP code sent to +91 ${phoneNumber}` 
              : 'Enter your phone number to login or register'}
          </p>
        </div>

        {/* Global Errors */}
        {(error || localError) && (
          <div className="bg-red-50/80 border border-red-200/50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 backdrop-blur-sm animate-pulse">
            {localError || error}
          </div>
        )}

        {/* Phone Authentication Section */}
        <div>
          {!showOtpScreen ? (
            // Step 1: Mobile number input
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div className="relative rounded-lg shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-semibold border-r border-gray-200/60 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="block w-full rounded-lg border-0 py-3 pl-16 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                  placeholder="Enter mobile number"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935] shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Get Verification Code'}
              </button>
            </form>
          ) : (
            // Step 2: OTP Entry screen
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="flex justify-between gap-2">
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
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] bg-white/50 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpScreen(false);
                    setLocalError(null);
                  }}
                  className="font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Edit number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`font-semibold transition-colors ${
                    timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#E53935] hover:text-[#C62828]'
                  }`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#E53935] hover:bg-[#C62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E53935] shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
