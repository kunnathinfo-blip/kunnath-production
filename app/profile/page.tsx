'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Container } from '@/Components/ui/Container';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, isLoading: isAuthLoading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Authenticated state route guard
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login');
    } else if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAadhaarInput('');
    }
  }, [user, isAuthLoading, router]);

  // Real-time Aadhaar formatting: XXXX XXXX XXXX
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Numbers only
    if (rawVal.length > 12) return; // Cap at 12 digits

    const parts = [];
    for (let i = 0; i < rawVal.length; i += 4) {
      parts.push(rawVal.substring(i, i + 4));
    }
    setAadhaarInput(parts.join(' '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);
    setIsSaving(true);

    const cleanedAadhaar = aadhaarInput.replace(/\D/g, '');
    
    // Validations
    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      setIsSaving(false);
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }

    if (cleanedAadhaar && cleanedAadhaar.length !== 12) {
      setLocalError('Please enter a valid 12-digit Aadhaar Card number.');
      setIsSaving(false);
      return;
    }

    try {
      const dataToUpdate: any = { name, email };
      if (cleanedAadhaar) {
        dataToUpdate.aadhaarNumber = cleanedAadhaar;
      }
      await updateProfile(dataToUpdate);
      setSuccessMsg('Your profile changes have been saved successfully.');
      setAadhaarInput(''); // Clear Aadhaar input for security after update
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-tr from-gray-100 via-gray-50 to-amber-50/20 min-h-screen relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />

      {/* Floating Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3.5 bg-white/95 border border-emerald-100 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-6 fade-in max-w-sm">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Profile Updated</h4>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{successMsg}</p>
          </div>
        </div>
      )}

      <Container className="max-w-xl relative">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold font-serif text-gray-900 tracking-tight">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Keep your contact and compliance details up to date</p>
        </div>

        {/* Status Messages */}
        {localError && (
          <div className="bg-red-50/80 border border-red-200/50 text-red-600 p-4 rounded-xl text-sm text-center mb-6 backdrop-blur-sm">
            {localError}
          </div>
        )}

        {/* Form Card */}
        <Card className="backdrop-blur-md bg-white/75 border border-white/40 p-8 shadow-2xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Phone Number (Read Only) */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Mobile Number (Login ID - Read Only)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-semibold border-r border-gray-200/60 pr-2">
                  +91
                </span>
                <input
                  type="text"
                  disabled
                  value={user.phoneNumber || ''}
                  className="block w-full rounded-lg border-0 py-3 pl-16 pr-3 text-gray-400 bg-gray-100/50 cursor-not-allowed ring-1 ring-inset ring-gray-200 sm:text-sm sm:leading-6 font-medium"
                />
              </div>
            </div>

            {/* Full Name field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Address field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                placeholder="email@example.com"
              />
            </div>

            {/* Aadhaar field */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Update Aadhaar Card Number
              </label>
              <input
                type="text"
                value={aadhaarInput}
                onChange={handleAadhaarChange}
                className="block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E53935] sm:text-sm sm:leading-6 bg-white/50"
                placeholder="•••• •••• •••• (Leave blank to keep current)"
              />
              <p className="mt-1.5 text-[11px] text-gray-400 leading-normal">
                For compliance verification. Aadhaar is encrypted and stored securely.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-100/60">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white shadow-lg shadow-red-500/10"
                disabled={isSaving}
              >
                {isSaving ? 'Saving changes...' : 'Save Profile'}
              </Button>
            </div>

          </form>
        </Card>
      </Container>
    </div>
  );
}
