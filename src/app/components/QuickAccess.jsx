'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, BookOpen, FileText, Heart, BarChart } from 'lucide-react';

export default function QuickAccess() {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    { href: '/settings', label: 'Cài đặt', icon: Settings, color: 'bg-gray-500' },
    { href: '/learn', label: 'Học ngay', icon: BookOpen, color: 'bg-blue-500' },
    { href: '/quiz', label: 'Quiz', icon: FileText, color: 'bg-green-500' },
    { href: '/favorites', label: 'Yêu thích', icon: Heart, color: 'bg-red-500' },
    { href: '/profile', label: 'Thống kê', icon: BarChart, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick links menu */}
      {isOpen && (
        <div className="mb-4 space-y-2">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl text-white text-sm font-medium
                  ${link.color} shadow-lg hover:shadow-xl transform hover:scale-105 
                  transition-all duration-200 backdrop-blur-sm
                `}
                title={link.label}
              >
                <IconComponent size={16} />
                <span className="whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg 
          flex items-center justify-center hover:bg-blue-700 
          transition-all duration-300 transform hover:scale-110
          ${isOpen ? 'rotate-45' : ''}
        `}
        aria-label="Quick access menu"
        title="Menu nhanh"
      >
        <Settings size={20} className={isOpen ? 'rotate-180' : ''} />
      </button>
    </div>
  );
}
