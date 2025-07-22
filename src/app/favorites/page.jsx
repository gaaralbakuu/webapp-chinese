'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Volume2, BookOpen, Target, Trash2, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { vocabularyData, topicsData } from '@/lib/data';
import { useApp } from '@/lib/AppContext';
import HSKSelector from '@/app/components/HSKSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function FavoritesPage() {
  const router = useRouter();
  const [selectedHSK, setSelectedHSK] = useState('ALL');
  const { favorites, toggleFavorite } = useApp();

  // Get favorite words from vocabulary data
  const favoriteWords = vocabularyData.filter(word => favorites.includes(word.id));
  
  // Filter favorites by HSK level
  const filteredFavorites = selectedHSK === 'ALL' 
    ? favoriteWords 
    : favoriteWords.filter(word => word.hskLevel === selectedHSK);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }
  };

  const removeFavorite = (wordId) => {
    toggleFavorite(wordId);
  };

  const clearAllFavorites = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả từ yêu thích?')) {
      favorites.forEach(wordId => toggleFavorite(wordId));
    }
  };

  const clearCurrentLevelFavorites = () => {
    if (selectedHSK === 'ALL') {
      clearAllFavorites();
      return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa tất cả từ yêu thích cấp độ ${selectedHSK}?`)) {
      filteredFavorites.forEach(word => toggleFavorite(word.id));
    }
  };

  // Get topic name for a word
  const getTopicName = (topicId) => {
    const topic = topicsData.find(t => t.id === topicId);
    return topic ? topic.name : 'Khác';
  };
  if (favoriteWords.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="text-center py-12">
            <div className="mb-6">
              <Heart className="mx-auto text-pink-300 mb-4" size={64} />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Chưa có từ yêu thích
            </h1>
            <p className="text-gray-600 mb-6">
              Hãy thêm những từ vựng bạn muốn ôn tập thường xuyên vào danh sách yêu thích
            </p>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <a href="/vocab" className="inline-flex items-center gap-2">
                <BookOpen size={20} />
                Khám phá từ vựng
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Heart size={28} />
                Từ yêu thích của bạn
              </h1>
              <p className="text-pink-100">
                {favoriteWords.length} từ vựng đã lưu
                {selectedHSK !== 'ALL' && ` • ${filteredFavorites.length} từ cấp độ ${selectedHSK}`}
              </p>
            </div>
            {favoriteWords.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Trash2 size={16} className="mr-2" />
                    Xóa {selectedHSK === 'ALL' ? 'tất cả' : `cấp ${selectedHSK}`}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa {selectedHSK === 'ALL' ? 'tất cả từ yêu thích' : `tất cả từ yêu thích cấp độ ${selectedHSK}`}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCurrentLevelFavorites} className="bg-red-600 hover:bg-red-700">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>      {/* HSK Filter */}
      {favoriteWords.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-blue-600" />
              <span className="font-medium text-blue-800">Lọc theo cấp độ HSK:</span>
            </div>          
            <HSKSelector 
              selectedLevel={selectedHSK === 'ALL' ? null : selectedHSK}
              onLevelChange={(level) => setSelectedHSK(level || 'ALL')}
            />
          </CardContent>
        </Card>
      )}      {/* Empty state for filtered results */}
      {favoriteWords.length > 0 && filteredFavorites.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không có từ yêu thích nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa có từ yêu thích nào ở cấp độ {selectedHSK}
            </p>
          </CardContent>
        </Card>
      )}      {/* Vocabulary Grid */}
      {filteredFavorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredFavorites.map((word) => (
            <Card key={word.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-pink-300 bg-gradient-to-br from-white to-pink-50/30">
              <CardContent className="p-6">
                {/* Header with heart */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        {word.hskLevel}
                      </Badge>
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        {getTopicName(word.topic)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(word.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Heart size={18} fill="currentColor" />
                  </Button>
                </div>

                {/* Chinese character */}
                <div className="text-center mb-4">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                    {word.chinese}
                  </h3>
                  <p className="text-gray-600 mb-2 font-medium">
                    {word.pinyin}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakWord(word.chinese)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Volume2 size={16} className="mr-1" />
                    Phát âm
                  </Button>
                </div>

                {/* Meaning */}
                <div className="text-center">
                  <p className="text-gray-700 font-medium mb-2">
                    {word.vietnamese}
                  </p>
                  {word.example && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-sm text-gray-600 italic">
                        Ví dụ: {word.example}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}      {/* Study Actions */}
      {filteredFavorites.length > 0 && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Sparkles size={20} />
              Học tập với từ yêu thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  const url = `/learn${selectedHSK !== 'ALL' ? `?hsk=${selectedHSK}` : ''}${favoriteWords.length > 0 ? '&favorites=true' : ''}`;
                  router.push(url);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <BookOpen size={16} className="mr-2" />
                Học flashcard
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `/quiz${selectedHSK !== 'ALL' ? `?hsk=${selectedHSK}` : ''}${favoriteWords.length > 0 ? '&favorites=true' : ''}`;
                  router.push(url);
                }}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              >
                <Target size={16} className="mr-2" />
                Làm quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}      {/* Statistics */}
      {favoriteWords.length > 0 && (
        <Card className="mt-8 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-indigo-800 text-center flex items-center justify-center gap-2">
              <TrendingUp size={20} />
              Thống kê từ yêu thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5'].map((level, index) => {
                const count = favoriteWords.filter(word => word.hskLevel === level).length;
                const colors = [
                  'text-green-600 bg-green-100',
                  'text-blue-600 bg-blue-100', 
                  'text-purple-600 bg-purple-100',
                  'text-orange-600 bg-orange-100',
                  'text-red-600 bg-red-100'
                ];
                return (
                  <div key={level} className="text-center">
                    <div className={`text-2xl font-semibold ${colors[index]} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
                      {count}
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {level}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
