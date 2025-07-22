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
    router.push(`/learn?hsk=${word.hskLevel}&startWord=${word.id}`);
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">      {/* Header */}
      <Card className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2">Kho từ vựng</h1>
          <p className="text-blue-100">
            Xem lại và ôn tập tất cả từ vựng đã học
          </p>
        </CardContent>
      </Card>      {/* Filters */}
      <Card className="mb-8 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Filter size={20} />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />            <Input
              type="text"
              placeholder="Tìm kiếm từ vựng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            />
          </div>

          {/* HSK Filter */}          <div>
            <label className="block text-sm font-medium mb-2 text-indigo-700">Cấp độ HSK:</label>
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
            <label className="block text-sm font-medium mb-2 text-indigo-700">Chủ đề:</label>
            <Select
              value={selectedTopic}
              onValueChange={(value) => {
                setSelectedTopic(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
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
      </Card>      {/* Results count */}
      <Card className="mb-6 bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              Hiển thị <span className="font-semibold text-blue-600">{paginatedVocabulary.length}</span> / <span className="font-semibold">{filteredVocabulary.length}</span> từ 
              (Trang <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>)
            </div>
            <div>
              Tổng: <span className="font-semibold text-green-600">{vocabularyData.length}</span> từ vựng
            </div>
          </div>
        </CardContent>
      </Card>      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedVocabulary.map((word) => {
          const topic = topicsData.find(t => t.id === word.topic);
          const isFavorite = favorites.includes(word.id);
          
          // HSK level colors
          const hskColors = {
            'HSK1': 'border-green-300 bg-green-50',
            'HSK2': 'border-blue-300 bg-blue-50',
            'HSK3': 'border-orange-300 bg-orange-50',
            'HSK4': 'border-purple-300 bg-purple-50',
            'HSK5': 'border-red-300 bg-red-50'
          };
          
          const cardClass = hskColors[word.hskLevel] || 'border-gray-200 bg-white';
          
          return (
            <Card key={word.id} className={`${cardClass} hover:shadow-lg transition-all duration-300`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`badge-${word.hskLevel.toLowerCase()}`}>{word.hskLevel}</Badge>
                      {topic && (
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {topic.icon} {topic.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{word.chinese}</CardTitle>
                    <CardDescription className="text-base">{word.pinyin}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(word.id)}
                    className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
                  >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Meaning */}                <div>
                  <div className="font-semibold text-lg text-gray-800">{word.vietnamese}</div>
                  <div className="text-gray-600">{word.english}</div>
                </div>{/* Example */}
                <Card className="bg-white/70 border-gray-100">
                  <CardContent className="p-3">
                    <div className="text-sm mb-1 text-gray-700">{word.example}</div>
                    <div className="text-xs text-gray-500">
                      {word.exampleTranslation}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakWord(word.chinese)}
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Volume2 size={16} className="mr-1" />
                    Phát âm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => reviewWord(word)}
                    className="flex-1 border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <RotateCcw size={16} className="mr-1" />
                    Ôn lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}      {/* Empty state */}
      {filteredVocabulary.length === 0 && (
        <Card className="text-center py-12 border-gray-200 bg-gray-50">
          <CardContent>
            <div className="text-gray-600 text-lg mb-4">
              Không tìm thấy từ vựng nào 😔
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('all');
                setSelectedHSK('ALL');
                setCurrentPage(1);
              }}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
