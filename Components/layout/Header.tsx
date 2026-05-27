// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import { Menu, X, User, Phone, LogOut } from 'lucide-react';
// import { Container } from '../ui/Container';

// export function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const { user, logout } = useAuthStore();
//   const pathname = usePathname();

//   const navLinks = [
//     { name: 'Farm Stays', href: '/#stays' },
//     { name: 'Sports', href: '/sports' },
//     { name: 'Events', href: '/events' },
//     { name: 'Membership', href: '/membership' },
//     { name: 'Contact', href: '/contact' },
//   ];

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
//       <Container>
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <Link href="/" className="flex items-center gap-2">
//               <span className="text-2xl font-bold font-display text-primary">Kunnath House</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary font-semibold' : 'text-text-primary'
//                   }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Right Section: Phone + Auth */}
//           <div className="hidden md:flex items-center space-x-6">
//             <a href="tel:+911234567890" className="flex items-center text-sm font-medium text-text-primary hover:text-primary transition-colors">
//               <Phone size={16} className="mr-2" />
//               +91 12345 67890
//             </a>

//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center space-x-2 border border-gray-200 p-2 rounded-full hover:shadow-soft transition-all"
//                 >
//                   <Menu size={16} className="text-gray-500" />
//                   <div className="bg-gray-200 rounded-full p-1">
//                     <User size={16} className="text-gray-600" />
//                   </div>
//                 </button>

//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{user.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                     </div>
//                     <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsProfileOpen(false)}>
//                       My Bookings
//                     </Link>
//                     <button
//                       onClick={() => {
//                         logout();
//                         setIsProfileOpen(false);
//                       }}
//                       className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                     >
//                       <LogOut size={16} className="mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="flex items-center space-x-2 border border-gray-200 p-2 px-4 rounded-full hover:shadow-soft transition-all text-sm font-medium"
//               >
//                 <User size={16} className="text-gray-500" />
//                 <span>Login</span>
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="flex items-center md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </Container>

//       {/* Mobile menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-b border-gray-200 absolute w-full">
//           <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-primary"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <a
//               href="tel:+911234567890"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-primary"
//                   <button
//                     onClick={() => {
//                       logout();
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   href="/login"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Login / Sign up
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, User, Phone, LogOut, Instagram, Home, Settings, Calendar } from 'lucide-react';
import { Container } from '../ui/Container';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleConfirmLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const handleStayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/#stays');
    // Wait for DOM update then scroll
    setTimeout(() => {
      document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navLinks = [
    { name: 'Stays', href: '/stays' },
    { name: 'Sports', href: '/sports' },
    { name: 'Events', href: '/events' },
    { name: 'Membership', href: '/membership' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.02)]">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-[14px] bg-[radial-gradient(circle_at_top_right,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:shadow-[0_8px_20px_-5px_rgba(220,39,67,0.4)] group-hover:scale-110 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                <Home size={22} className="text-white relative z-10 drop-shadow-sm" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black font-display text-gray-900 tracking-tighter group-hover:text-primary transition-colors duration-300">
                  Kunnath<span className="text-gray-900"> House</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400 mt-1 opacity-80">Crafted for Recreation</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center bg-gray-100/40 border border-gray-200/50 rounded-full p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-6 py-2 text-[13px] font-bold rounded-full transition-all duration-500 relative overflow-hidden flex items-center justify-center",
                    isActive
                      ? "bg-white text-primary shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)] scale-[1.02] -translate-y-[0.5px]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Phone + Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center bg-gray-100/40 border border-gray-200/50 rounded-full px-4 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              <a
                href="tel:+917702402505"
                className="flex items-center text-[11px] font-black text-gray-700 hover:text-primary transition-colors border-r border-gray-200 pr-4 mr-4"
              >
                <Phone size={13} className="mr-2 text-primary/70" />
                +91 7702402505
              </a>

              <a
                href="https://www.instagram.com/kunnath_farmhouse?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center transition-all duration-500 hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(225,48,108,0.5)] active:scale-90 group/insta relative"
              >
                {/* Subtle pulse ring around the icon */}
                <div className="absolute inset-0 rounded-full bg-pink-500/10 animate-ping duration-3000 opacity-0 group-hover/insta:opacity-100"></div>
                
                <img 
                  src="/Logo/insta/instagram.png" 
                  alt="Instagram" 
                  className="w-full h-full object-contain drop-shadow-sm transition-all duration-500"
                />
              </a>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 border border-gray-200/60 bg-white p-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                >
                  <div className="bg-gray-50 rounded-full p-2 group-hover:bg-primary/5 transition-colors">
                    <User size={15} className="text-gray-600" />
                  </div>
                  <Menu size={15} className="text-gray-400 mr-2" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header Section */}
                    <div className="px-4 py-3 border-b border-gray-100/80 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E53935] to-[#C62828] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-red-500/10 flex-shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate leading-snug">{user.name}</p>
                        {user.phoneNumber && (
                          <p className="text-[11px] text-gray-400 font-medium tracking-wide mt-0.5 truncate">
                            +91 {user.phoneNumber.replace(/^\+91/, '')}
                          </p>
                        )}
                        {user.email && (
                          <p className="text-[11px] text-gray-400 font-medium tracking-wide truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[#E53935] hover:bg-[#E53935]/5 rounded-xl transition-all duration-200 font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} className="text-gray-400" />
                        <span>Edit Profile</span>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:text-[#E53935] hover:bg-[#E53935]/5 rounded-xl transition-all duration-200 font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Calendar size={16} className="text-gray-400" />
                        <span>My Bookings</span>
                      </Link>

                      <div className="border-t border-gray-100/60 my-1.5"></div>

                      <button
                        onClick={() => {
                          setShowLogoutConfirm(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-semibold text-left cursor-pointer"
                      >
                        <LogOut size={16} className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 border border-gray-200 p-2 px-4 rounded-full hover:shadow-soft transition-all text-sm font-medium"
              >
                <User size={16} className="text-gray-500" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-base font-semibold transition-all",
                    isActive
                      ? "bg-primary/5 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href="tel:+911234567890"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-primary"
            >
              Call Us: +91 12345 67890
            </a>
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E53935] to-[#C62828] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-red-500/10">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate leading-snug">{user.name}</p>
                      {user.phoneNumber && (
                        <p className="text-[11px] text-gray-400 font-medium tracking-wide mt-0.5 truncate">
                          +91 {user.phoneNumber.replace(/^\+91/, '')}
                        </p>
                      )}
                      {user.email && (
                        <p className="text-[11px] text-gray-400 font-medium tracking-wide truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings size={14} className="text-gray-400" />
                      <span>Edit Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar size={14} className="text-gray-400" />
                      <span>My Bookings</span>
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100/90 text-center animate-in zoom-in-95 duration-200">
            {/* Soft Red logout indicator circle */}
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#E53935] mb-4">
              <LogOut size={22} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-lg font-extrabold text-gray-950 font-serif">Log out</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed px-1">
              Are you sure you want to log out from <strong>Kunnath House</strong>? You'll need to verify your phone number to sign in again.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full bg-[#E53935] hover:bg-[#C62828] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-red-500/10 transition-all cursor-pointer active:scale-98"
              >
                Yes, Logout
              </button>
              
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all border border-gray-200/40 cursor-pointer active:scale-98"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}