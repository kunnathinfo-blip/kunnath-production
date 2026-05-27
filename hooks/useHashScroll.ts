// hooks/useHashScroll.js
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useHashScroll = () => {
    const pathname = usePathname();

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#stays') {
                const element = document.getElementById('stays');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        // Scroll on initial load if hash is #stays
        handleHashChange();

        // Listen for hash changes (popstate and hashchange events)
        window.addEventListener('hashchange', handleHashChange);
        // Also listen for clicks that change hash without firing hashchange (e.g., Next.js Link)
        window.addEventListener('popstate', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    }, [pathname]); // re-run when route changes (to handle new page)
};