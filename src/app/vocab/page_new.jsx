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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Kho từ vựng</h1>
        <p className="text-muted-foreground">
          Xem lại và ôn tập tất cả từ vựng đã học
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedVocabulary.map((word) => {
          const topic = topicsData.find(t => t.id === word.topic);
          const isFavorite = favorites.includes(word.id);
          
          return (
            <Card key={word.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{word.hskLevel}</Badge>
                      {topic && (
                        <Badge variant="outline" className="text-xs">
                          {topic.name}
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
                {/* Meaning */}
                <div>
                  <div className="font-semibold text-lg">{word.vietnamese}</div>
                  <div className="text-muted-foreground">{word.english}</div>
                </div>

                {/* Example */}
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="text-sm mb-1">{word.example}</div>
                    <div className="text-xs text-muted-foreground">
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
                    className="flex-1"
                  >
                    <Volume2 size={16} className="mr-1" />
                    Phát âm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => reviewWord(word)}
                    className="flex-1"
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
      )}

      {/* Empty state */}
      {filteredVocabulary.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground text-lg mb-4">
              Không tìm thấy từ vựng nào
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('all');
                setSelectedHSK('ALL');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
