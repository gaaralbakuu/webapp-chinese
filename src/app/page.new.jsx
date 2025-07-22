import Link from 'next/link';
import { BookOpen, Target, Trophy, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Học Từ Vựng Tiếng Trung
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Nắm vững từ vựng tiếng Trung qua flashcard, quiz và các bài học tương tác. 
          Bắt đầu hành trình học tập của bạn ngay hôm nay!
        </p>
        
        <Link 
          href="/learn"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <BookOpen size={20} />
          Bắt đầu học
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Từ đã học</h3>
          </div>
          <p className="text-2xl font-semibold text-blue-600">0</p>
          <p className="text-sm text-gray-500">từ vựng</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-xl">
              <Target className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Độ chính xác</h3>
          </div>
          <p className="text-2xl font-semibold text-green-600">--</p>
          <p className="text-sm text-gray-500">phần trăm</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Clock className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Chuỗi ngày</h3>
          </div>
          <p className="text-2xl font-semibold text-orange-600">0</p>
          <p className="text-sm text-gray-500">ngày liên tiếp</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/learn"
          className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 group-hover:bg-blue-100 rounded-xl">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Học từ mới</h3>
          </div>
          <p className="text-gray-600">Khám phá từ vựng mới với flashcard tương tác</p>
        </Link>

        <Link 
          href="/quiz"
          className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 group-hover:bg-green-100 rounded-xl">
              <Target className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Kiểm tra</h3>
          </div>
          <p className="text-gray-600">Thử thách bản thân với các bài quiz</p>
        </Link>

        <Link 
          href="/topics"
          className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-50 group-hover:bg-purple-100 rounded-xl">
              <Trophy className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Chủ đề</h3>
          </div>
          <p className="text-gray-600">Học theo chủ đề cụ thể như gia đình, du lịch</p>
        </Link>
      </div>
    </div>
  );
}
