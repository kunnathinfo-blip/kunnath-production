'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import FloatingButtons from './FloatingButtons';
import { useEffect, useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/onboarding';
  const isAdminPage = pathname?.startsWith('/admin');
  const [isDevDomain, setIsDevDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.endsWith('.in') || 
        hostname.includes('vercel.app')
      ) {
        setIsDevDomain(true);
      }
    }
  }, []);

  if (isAuthPage || isAdminPage) {
    return (
      <main className="min-h-screen">
        {children}
        {isDevDomain && <DevBadge />}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      {isDevDomain && <DevBadge />}
    </>
  );
}

function DevBadge() {
  return (
    <div className="fixed bottom-6 left-6 z-[9999] pointer-events-auto">
      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.15)] text-xs font-semibold select-none transition-all duration-300 hover:scale-105 hover:bg-slate-950">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span>Development Phase</span>
      </div>
    </div>
  );
}

