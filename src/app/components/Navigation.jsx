'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BookOpen, FileText, Layers, Heart, User, Settings, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/learn', label: 'Học từ vựng', icon: BookOpen },
  { href: '/quiz', label: 'Kiểm tra', icon: FileText },
  { href: '/vocab', label: 'Kho từ vựng', icon: Layers },
  { href: '/topics', label: 'Chủ đề', icon: Layers },
  { href: '/favorites', label: 'Yêu thích', icon: Heart },
  { href: '/profile', label: 'Hồ sơ', icon: User },
];

export default function Navigation({ isFixed = false }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };  return (
    <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg nav-transition ${
      isFixed ? 'nav-fixed z-50' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-gray-800 hover:text-blue-600 nav-transition group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </div>
              <div className="flex flex-col">
                <span className="hidden sm:inline text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HSK 中文
                </span>
                <span className="sm:hidden text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HSK
                </span>
                <span className="hidden sm:inline text-xs text-gray-500 -mt-1">
                  Chinese Learning
                </span>
              </div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium nav-transition relative group ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <IconComponent size={16} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  <span className="hidden xl:inline">{item.label}</span>
                  {/* Badge for notifications (example) */}
                  {item.href === '/quiz' && (
                    <span className="nav-badge bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full absolute -top-1 -right-1" title="Có quiz mới">3</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Settings & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Quick Settings Link (Desktop) */}            <Link
              href="/settings"
              className={`nav-item hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium nav-transition group ${
                pathname === '/settings'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
              }`}
              title="Cài đặt"
            >
              <Settings size={16} className={pathname === '/settings' ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="hidden lg:inline">Cài đặt</span>
            </Link>

            {/* Mobile menu button */}            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md nav-transition group"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? 
                <X size={20} className="group-hover:scale-110 transition-transform" /> : 
                <Menu size={20} className="group-hover:scale-110 transition-transform" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="mobile-menu-overlay lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
              {/* Menu */}
            <div className="mobile-menu mobile-menu-enter lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium nav-transition relative group ${
                          isActive 
                            ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md border border-gray-200'
                        }`}
                      >
                        <IconComponent size={18} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                        <span className="font-medium">{item.label}</span>
                        {/* Badge for mobile too */}
                        {item.href === '/quiz' && (
                          <span className="nav-badge bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full absolute -top-1 -right-1">3</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
                
                {/* Settings link for mobile */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium nav-transition group w-full ${
                      pathname === '/settings'
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <Settings size={18} className={pathname === '/settings' ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                    <span className="font-medium">Cài đặt</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
