'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Target, Volume2, Heart } from 'lucide-react';
import { topicsData, getVocabularyByTopic } from '@/lib/data';

export default function TopicDetailPage({ params }) {
  const [favorites, setFavorites] = useState([]);
  
  const topic = topicsData.find(t => t.id === params.id);
  const vocabulary = getVocabularyByTopic(params.id);

  if (!topic) {
    notFound();
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }
  };

  const toggleFavorite = (wordId) => {
    setFavorites(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/topics"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Quay lại chủ đề
        </Link>
        
        <div className={`p-6 rounded-xl border-2 ${getColorClasses(topic.color)}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">
              {topic.icon}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {topic.name}
              </h1>
              <p className="text-lg opacity-80">
                {topic.description}
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              {vocabulary.length} từ vựng
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href={`/learn?topic=${topic.id}`}
          className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all"
        >
          <div className="p-2 bg-blue-50 rounded-xl">
            <BookOpen className="text-blue-600" size={20} />
          </div>
          <div>
            <div className="font-semibold text-gray-800">Học với Flashcard</div>
            <div className="text-sm text-gray-600">Học từ vựng theo chủ đề này</div>
          </div>
        </Link>

        <Link
          href={`/quiz?topic=${topic.id}`}
          className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all"
        >
          <div className="p-2 bg-green-50 rounded-xl">
            <Target className="text-green-600" size={20} />
          </div>
          <div>
            <div className="font-semibold text-gray-800">Kiểm tra</div>
            <div className="text-sm text-gray-600">Quiz từ vựng chủ đề này</div>
          </div>
        </Link>
      </div>

      {/* Vocabulary List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách từ vựng
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {vocabulary.map((word, index) => {
            const isFavorite = favorites.includes(word.id);
            
            return (
              <div key={word.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-sm text-gray-500 font-medium min-w-[24px]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {word.chinese}
                        </div>
                        <div className="text-gray-600">
                          {word.pinyin}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-10">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-800">
                          {word.vietnamese}
                        </span>
                        <span className="text-gray-600 ml-2">
                          ({word.english})
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <div className="text-gray-800 text-sm mb-1">
                          {word.example}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {word.exampleTranslation}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => speakWord(word.chinese)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Phát âm"
                    >
                      <Volume2 size={20} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(word.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isFavorite 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title="Yêu thích"
                    >
                      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Progress */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tiến trình học tập
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">
              0
            </div>
            <div className="text-sm text-gray-600">Đã học</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              0
            </div>
            <div className="text-sm text-gray-600">Thành thạo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">
              {favorites.length}
            </div>
            <div className="text-sm text-gray-600">Yêu thích</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600">
              0%
            </div>
            <div className="text-sm text-gray-600">Hoàn thành</div>
          </div>
        </div>
      </div>
    </div>
  );
}
