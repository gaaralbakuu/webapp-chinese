'use client';

import { useState } from 'react';
import Link from 'next/link';
import { topicsData, getWordsByTopic } from '@/lib/data';
import { ChevronRight, BookOpen, Filter } from 'lucide-react';
import HSKSelector from '@/app/components/HSKSelector';
import { useApp } from '@/lib/AppContext';

export default function TopicsPage() {
  const [selectedHSK, setSelectedHSK] = useState('ALL');
  const { studyProgress } = useApp();

  // Calculate topic stats based on selected HSK level
  const getTopicStats = (topic) => {
    const words = getWordsByTopic(topic.id);    const filteredWords = selectedHSK === 'ALL' 
      ? words 
      : words.filter(word => word.hskLevel === selectedHSK);
      const learnedWords = filteredWords.filter(word => 
      studyProgress[word.hskLevel]?.learned.includes(word.id) || false
    );
    
    return {
      totalWords: filteredWords.length,
      learnedWords: learnedWords.length,
      progress: filteredWords.length > 0 ? Math.round((learnedWords.length / filteredWords.length) * 100) : 0
    };
  };

  // Filter topics that have words in selected HSK level
  const filteredTopics = topicsData.filter(topic => {
    if (selectedHSK === 'ALL') return true;
    const words = getWordsByTopic(topic.id);
    return words.some(word => word.hskLevel === selectedHSK);
  });
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    };
    return colors[color] || colors.blue;
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Chủ đề học tập
        </h1>
        <p className="text-gray-600">
          Chọn chủ đề để học từ vựng theo mục tiêu cụ thể
        </p>
      </div>

      {/* HSK Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700">Lọc theo cấp độ HSK:</span>
        </div>        <HSKSelector 
          selectedLevel={selectedHSK === 'ALL' ? null : selectedHSK}
          onLevelChange={(level) => setSelectedHSK(level || 'ALL')}
        />
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTopics.map((topic) => {
          const stats = getTopicStats(topic);
          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}${selectedHSK !== 'ALL' ? `?hsk=${selectedHSK}` : ''}`}
              className={`group p-6 rounded-xl border-2 transition-all hover:shadow-md ${getColorClasses(topic.color)}`}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="text-4xl mb-4">
                  {topic.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {topic.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {topic.description}
                </p>
                
                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-center items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <BookOpen size={16} />
                      {stats.totalWords} từ
                      {selectedHSK !== 'ALL' && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-1">
                          {selectedHSK}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {stats.totalWords > 0 && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Tiến độ</span>
                        <span>{stats.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${stats.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* CTA */}
                <div className="flex items-center justify-center gap-2 text-gray-700 group-hover:text-gray-900">
                  <span className="font-medium">Bắt đầu học</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Không tìm thấy chủ đề nào
          </h3>
          <p className="text-gray-500">
            Không có chủ đề nào có từ vựng cấp độ {selectedHSK}
          </p>
        </div>
      )}      {/* Quick Stats */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Tổng quan chủ đề
          {selectedHSK !== 'ALL' && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              (Cấp độ {selectedHSK})
            </span>
          )}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {filteredTopics.length}
            </div>
            <div className="text-sm text-gray-600">Chủ đề</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              {filteredTopics.reduce((sum, topic) => sum + getTopicStats(topic).totalWords, 0)}
            </div>
            <div className="text-sm text-gray-600">Tổng từ vựng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600">
              {filteredTopics.length > 0 
                ? Math.round(filteredTopics.reduce((sum, topic) => sum + getTopicStats(topic).totalWords, 0) / filteredTopics.length)
                : 0
              }
            </div>
            <div className="text-sm text-gray-600">Trung bình/chủ đề</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600">
              {filteredTopics.length > 0
                ? Math.round(
                    filteredTopics.reduce((sum, topic) => {
                      const stats = getTopicStats(topic);
                      return sum + stats.progress;
                    }, 0) / filteredTopics.length
                  )
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💡 Mẹo học tập hiệu quả
        </h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Tập trung vào một chủ đề mỗi lần để học sâu hơn</li>
          <li>• Luyện tập thường xuyên với flashcard và quiz</li>
          <li>• Sử dụng từ vựng trong câu để ghi nhớ lâu hơn</li>
          <li>• Ôn tập các từ đã học để củng cố kiến thức</li>
        </ul>
      </div>
    </div>
  );
}
