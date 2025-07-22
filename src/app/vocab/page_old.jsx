'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Volume2, RotateCcw, Heart, Filter } from 'lucide-react';
import { vocabularyData, topicsData } from '@/lib/data';
import { useApp } from '@/lib/AppContext';
import HSKSelector from '@/app/components/HSKSelector';
import Pagination from '@/app/components/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VocabPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedHSK, setSelectedHSK] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const { favorites, toggleFavorite } = useApp();
  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter(word => {
      const matchesSearch = 
        word.chinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTopic = selectedTopic === 'all' || word.topic === selectedTopic;
      const matchesHSK = selectedHSK === 'ALL' || word.hskLevel === selectedHSK;
      
      return matchesSearch && matchesTopic && matchesHSK;
    });
  }, [searchTerm, selectedTopic, selectedHSK]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVocabulary.length / itemsPerPage);
  const paginatedVocabulary = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVocabulary.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVocabulary, currentPage]);

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };
  const reviewWord = (word) => {
    // Chuyển đến trang learn với từ cụ thể (không tải lại trang)
    router.push(`/learn?hsk=${word.hskLevel}&startWord=${word.id}`);
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Kho từ vựng
        </h1>
        <p className="text-gray-600">
          Xem lại và ôn tập tất cả từ vựng đã học
        </p>
      </div>      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Tìm kiếm từ vựng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10"
            />
          </div>

          {/* HSK Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Cấp độ HSK:</label>
            <HSKSelector 
              selectedLevel={selectedHSK === 'ALL' ? null : selectedHSK}
              onLevelChange={(level) => {
                setSelectedHSK(level || 'ALL');
                handleFilterChange();
              }}
            />
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Chủ đề:</label>
            <Select
              value={selectedTopic}
              onValueChange={(value) => {
                setSelectedTopic(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {topicsData.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.icon} {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

          {/* Topic Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Hiển thị {paginatedVocabulary.length} / {filteredVocabulary.length} từ 
          (Trang {currentPage} / {totalPages})
        </div>
        <div className="text-sm text-muted-foreground">
          Tổng: {vocabularyData.length} từ vựng
        </div>
      </div>
      </div>      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedVocabulary.map((word) => {
          const topic = topicsData.find(t => t.id === word.topic);
          const isFavorite = favorites.includes(word.id);
          
          return (
            <div
              key={word.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header with favorite button */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {word.hskLevel}
                    </span>
                    {topic && (
                      <span className="text-xs text-gray-500">
                        {topic.name}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {word.chinese}
                  </div>
                  <div className="text-gray-600">
                    {word.pinyin}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(word.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isFavorite 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Meaning */}
              <div className="mb-4">
                <div className="text-lg font-semibold text-gray-800">
                  {word.vietnamese}
                </div>
                <div className="text-gray-600">
                  {word.english}
                </div>
              </div>

              {/* Example */}
              <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <div className="text-gray-800 text-sm mb-1">
                  {word.example}
                </div>
                <div className="text-gray-600 text-xs">
                  {word.exampleTranslation}
                </div>
              </div>

              {/* Topic and Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{topic?.icon}</span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {topic?.name}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => speakWord(word.chinese)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 size={16} />
                  </button>                  <button
                    onClick={() => reviewWord(word)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                    title="Ôn lại từ này"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          );        })}
      </div>      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}

      {/* Empty state */}
      {filteredVocabulary.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            Không tìm thấy từ vựng nào
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTopic('all');
              setSelectedHSK('ALL');
              setCurrentPage(1);
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thống kê học tập
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {vocabularyData.length}
            </div>
            <div className="text-sm text-gray-600">Tổng từ vựng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              {topicsData.length}
            </div>
            <div className="text-sm text-gray-600">Chủ đề</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">
              {favorites.length}
            </div>
            <div className="text-sm text-gray-600">Yêu thích</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600">
              {Math.round((favorites.length / vocabularyData.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Tiến trình</div>
          </div>
        </div>
      </div>
    </div>
  );
}
