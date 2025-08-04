'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Cursos', href: '/courses' },
  { name: 'Sobre', href: '/about' },
  { name: 'Contato', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0b3b75]/95 backdrop-blur-xl shadow-lg'
            : 'bg-[#0b3b75]'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo with Uniconnect Polo Badge */}
            <Link href="/" className="flex items-center space-x-3 group" aria-label="Home">
              <div className="flex items-center space-x-4">
                <Image
                  src="/root/logo-unicorp.png"
                  width={0}
                  height={0}
                  sizes="100%"
                  alt="Logo"
                  className="object-contain w-36 h-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = '/root/fallback-logo.png'; // Fallback image
                  }}
                />
                {/* Uniconnect Polo Badge */}
                <div className="hidden sm:flex flex-col items-start">
                  <div className=" px-4 py-2">
                    <div className="text-white text-xs font-medium uppercase tracking-wider opacity-90">
                      Polo 
                    </div>
                    <div className="text-white text-lg font-bold tracking-wide">
                    <Image
                  src="/root/logo.webp"
                  width={0}
                  height={0}
                  sizes="100%"
                  alt="Logo"
                  className="object-contain w-36 h-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = '/root/fallback-logo.png'; // Fallback image
                  }}
                />
                    </div>
                  </div>
                </div>
                {/* Mobile Uniconnect Badge */}
                <div className="sm:hidden flex items-center">
                  <div className="bg-[#ff6600] px-3 py-1 rounded-md shadow-md">
                    <div className="text-white text-sm font-bold">
                      UNICONNECT
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main navigation">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href === '/courses' && pathname.startsWith('/courses/'));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group ${
                      isActive
                        ? 'text-white bg-[#ff6600] shadow-lg'
                        : 'text-white hover:text-white hover:bg-[#ff6600]/30'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-[#ff4c00]/30 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                    )}
                  </Link>
                );
              })}
              
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="w-10 h-10 p-0 rounded-xl text-white hover:bg-[#ff4c00]/30"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel */}
        <div
          className={`absolute top-24 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/30 dark:border-gray-800/30 transition-all duration-500 transform ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 p-0 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href === '/courses' && pathname.startsWith('/courses/'));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-base font-semibold transition-all duration-300 rounded-xl ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{item.name}</span>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                  </Link>
                );
              })}
            </div>

           
          </div>
        </div>
      </div>
    </>
  );
}