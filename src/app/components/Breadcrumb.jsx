'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const pageNames = {
  '/': 'Trang chủ',
  '/learn': 'Học từ vựng',
  '/quiz': 'Kiểm tra',
  '/vocab': 'Kho từ vựng',
  '/topics': 'Chủ đề',
  '/favorites': 'Yêu thích',
  '/profile': 'Hồ sơ',
  '/settings': 'Cài đặt'
};

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumb on home page
  if (pathname === '/') return null;

  const currentPageName = pageNames[pathname] || 'Không xác định';

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
        title="Về trang chủ"
      >
        <Home size={16} />
        <span className="sr-only">Trang chủ</span>
      </Link>
      
      <ChevronRight size={16} className="text-gray-400" />
      
      <span className="text-gray-800 font-medium" aria-current="page">
        {currentPageName}
      </span>
    </nav>
  );
}
