'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 via-gray-50 to-amber-50/20">
      <div className="text-center">
        <div className="h-10 w-10 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Redirecting to unified authentication gateway...</p>
      </div>
    </div>
  );
}
