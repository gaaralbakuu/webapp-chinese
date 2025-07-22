'use client';

import { Heart, Github, Mail, BookOpen, Users, Star, Coffee } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">
                Học Tiếng Trung HSK
              </h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Ứng dụng học từ vựng tiếng Trung theo cấp độ HSK một cách hiệu quả và thú vị. 
              Với hơn 5000+ từ vựng được phân loại theo từng cấp độ từ HSK1 đến HSK5.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>1000+ học viên</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} />
                <span>4.8/5 đánh giá</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>5000+ từ vựng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              {[
                { name: 'Trang chủ', href: '/' },
                { name: 'Học từ vựng', href: '/learn' },
                { name: 'Luyện tập Quiz', href: '/quiz' },
                { name: 'Kho từ vựng', href: '/vocab' },
                { name: 'Chủ đề', href: '/topics' },
                { name: 'Từ yêu thích', href: '/favorites' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {[
                { name: 'Hướng dẫn sử dụng', href: '#' },
                { name: 'Câu hỏi thường gặp', href: '#' },
                { name: 'Báo cáo lỗi', href: '#' },
                { name: 'Đóng góp ý kiến', href: '#' },
                { name: 'Chính sách riêng tư', href: '#' },
                { name: 'Điều khoản sử dụng', href: '#' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features highlight */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h4 className="font-semibold text-gray-800 mb-4 text-center">Tính năng nổi bật</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🎯', title: 'Học theo cấp độ HSK', desc: 'HSK 1-5' },
              { icon: '🔊', title: 'Phát âm chuẩn', desc: 'Giọng đọc AI' },
              { icon: '📊', title: 'Theo dõi tiến độ', desc: 'Thống kê chi tiết' },
              { icon: '🎮', title: 'Học qua trò chơi', desc: 'Quiz thú vị' }
            ].map(feature => (
              <div key={feature.title} className="p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h5 className="font-medium text-gray-800 text-sm mb-1">{feature.title}</h5>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                © {currentYear} Học Tiếng Trung HSK. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Kết nối với chúng tôi:</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Mail, href: 'mailto:support@example.com', label: 'Email' }
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Made with <Heart size={16} className="text-red-500" /> for Chinese learners
            <Coffee size={16} className="text-amber-600 ml-2" />
          </p>
        </div>
      </div>
    </footer>
  );
}
