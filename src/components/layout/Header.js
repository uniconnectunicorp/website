'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, GraduationCap, Home, BookOpen, Users, Phone, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Cursos', href: '/cursos', icon: BookOpen },
  { name: 'Sobre', href: '/sobre', icon: Users },
  { name: 'Contato', href: '/contato', icon: Phone },
];

export function Header({ isBlackNovember = false }) {
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
    // Prevenir scroll do body quando menu estiver aberto
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Cleanup do overflow quando componente desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fechar menu ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? isBlackNovember 
              ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-yellow-500/20 border-b border-yellow-500/30'
              : 'bg-[#0b3b75]/95 backdrop-blur-xl shadow-lg'
            : isBlackNovember
              ? 'bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-500/30'
              : 'bg-[#0b3b75]'
          }`}
        role="banner"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo with Uniconnect Polo Badge */}
            <Link href="/" className="flex items-center space-x-3 group" aria-label="Home">
              <div className="flex items-center space-x-4 max-md:space-x-0">
                <Image
                  src="/root/logo.webp"
                  width={0}
                  height={0}
                  sizes="100%"
                  alt="Logo"
                  className="object-contain w-46 max-md:w-36 h-auto transition-transform duration-300 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = '/root/fallback-logo.png'; // Fallback image
                  }}
                />
                <div className="sm:flex flex-col items-start">
                  <div className="px-4 py-2">
                    {/* <div className="text-white text-xs font-medium uppercase tracking-wider opacity-90 mb-1">
                      Parceiro:
                    </div> */}
                    <div className="text-white text-lg font-bold tracking-wide">
                      <Image
                        src="/root/logo-unicorp.png"
                        width={0}
                        height={0}
                        sizes="100%"
                        alt="Logo"
                        className="object-contain w-26 max-md:w-20 h-auto transition-transform duration-300 group-hover:scale-105"
                        priority
                        onError={(e) => {
                          e.currentTarget.src = '/root/fallback-logo.png'; // Fallback image
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </Link>

            {/* Black November Badge */}
            {isBlackNovember && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg shadow-lg shadow-orange-500/50">
                <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Black November</span>
                <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-full">40% OFF</span>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main navigation">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href === '/cursos' && pathname.startsWith('/cursos/'));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group ${isActive
                        ? isBlackNovember
                          ? 'text-black bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
                          : 'text-white bg-[#ff6600] shadow-lg'
                        : isBlackNovember
                          ? 'text-white hover:text-black hover:bg-yellow-400/90'
                          : 'text-white hover:text-white hover:bg-[#ff6600]/30'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {!isActive && (
                      <div className={`absolute inset-0 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ${
                        isBlackNovember ? 'bg-yellow-400/30' : 'bg-[#ff4c00]/30'
                      }`} />
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
                className={`relative w-12 h-12 p-0 rounded-xl text-white transition-all duration-300 group ${
                  isBlackNovember ? 'hover:bg-yellow-400/30' : 'hover:bg-[#ff4c00]/30'
                }`}
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMenuOpen}
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                    }`} />
                  <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`} />
                  <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                    }`} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu - Slide from Right */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação mobile"
      >
        {/* Overlay com blur */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => {
            setIsMenuOpen(false);
            document.body.style.overflow = 'unset';
          }}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel - Slide from Right */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Header do Menu */}
          <div className={`px-6 py-4 text-white ${
            isBlackNovember 
              ? 'bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-yellow-500'
              : 'bg-gradient-to-r from-[#0b3b75] to-[#1e40af]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isBlackNovember ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-white/20'
                }`}>
                  {isBlackNovember ? (
                    <Sparkles className="h-6 w-6 text-black" />
                  ) : (
                    <GraduationCap className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{isBlackNovember ? 'Black November' : 'Menu'}</h2>
                  <p className={`text-sm ${
                    isBlackNovember ? 'text-yellow-400' : 'text-blue-100'
                  }`}>{isBlackNovember ? 'Ofertas Especiais' : 'Navegação'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = 'unset';
                }}
                className="w-10 h-10 p-0 rounded-xl text-white hover:bg-white/20 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || (item.href === '/cursos' && pathname.startsWith('/cursos/'));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.body.style.overflow = 'unset';
                  }}
                  className={`group flex items-center justify-between px-4 py-4 text-base font-medium transition-all duration-300 rounded-xl transform hover:scale-[1.02] ${isActive
                      ? isBlackNovember
                        ? 'text-black bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
                        : 'text-white bg-gradient-to-r from-[#0b3b75] to-[#1e40af] shadow-lg'
                      : isBlackNovember
                        ? 'text-gray-700 hover:text-black hover:bg-yellow-50 active:bg-yellow-100'
                        : 'text-gray-700 hover:text-[#0b3b75] hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive
                        ? isBlackNovember ? 'bg-black/20' : 'bg-white/20'
                        : isBlackNovember
                          ? 'bg-gray-100 group-hover:bg-yellow-400 group-hover:text-black'
                          : 'bg-gray-100 group-hover:bg-[#0b3b75] group-hover:text-white'
                      }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isActive 
                    ? isBlackNovember ? 'text-black/80' : 'text-white/80' 
                    : isBlackNovember
                      ? 'text-gray-400 group-hover:text-black group-hover:translate-x-1'
                      : 'text-gray-400 group-hover:text-[#0b3b75] group-hover:translate-x-1'
                    }`} />
                </Link>
              );
            })}
          </div>

          {/* Footer do Menu */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Image
                  src="/root/logo-unicorp.png"
                  width={80}
                  height={30}
                  alt="Unicorp Logo"
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/root/fallback-logo.png';
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Transformando carreiras através da educação
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}