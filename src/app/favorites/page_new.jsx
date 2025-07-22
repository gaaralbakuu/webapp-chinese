'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Volume2, BookOpen, Target, Trash2, Filter, HeartOff } from 'lucide-react';
import { vocabularyData, topicsData } from '@/lib/data';
import { useApp } from '@/lib/AppContext';
import HSKSelector from '@/app/components/HSKSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    favorites.forEach(wordId => toggleFavorite(wordId));
  };

  const clearCurrentLevelFavorites = () => {
    if (selectedHSK === 'ALL') {
      clearAllFavorites();
      return;
    }
    
    filteredFavorites.forEach(word => toggleFavorite(word.id));
  };

  const startQuizWithFavorites = () => {
    if (filteredFavorites.length === 0) return;
    
    // Create a quiz URL with favorite word IDs
    const wordIds = filteredFavorites.map(word => word.id).join(',');
    router.push(`/quiz?words=${wordIds}&hsk=${selectedHSK}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Từ yêu thích</h1>
        <p className="text-muted-foreground">
          Tập hợp những từ vựng bạn đã đánh dấu yêu thích
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{favoriteWords.length}</div>
            <div className="text-sm text-muted-foreground">Tổng từ yêu thích</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{filteredFavorites.length}</div>
            <div className="text-sm text-muted-foreground">
              {selectedHSK === 'ALL' ? 'Tất cả cấp độ' : selectedHSK}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {new Set(favoriteWords.map(w => w.hskLevel)).size}
            </div>
            <div className="text-sm text-muted-foreground">Cấp độ HSK</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter size={20} />
              Lọc theo cấp độ HSK
            </CardTitle>
            <div className="flex gap-2">
              {filteredFavorites.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={startQuizWithFavorites}
                    className="flex items-center gap-2"
                  >
                    <Target size={16} />
                    Quiz từ yêu thích
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex items-center gap-2">
                        <Trash2 size={16} />
                        Xóa tất cả
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          {selectedHSK === 'ALL' 
                            ? 'Bạn có chắc chắn muốn xóa tất cả từ yêu thích?' 
                            : `Bạn có chắc chắn muốn xóa tất cả từ yêu thích cấp độ ${selectedHSK}?`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={clearCurrentLevelFavorites}>
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HSKSelector 
            selectedLevel={selectedHSK === 'ALL' ? null : selectedHSK}
            onLevelChange={(level) => setSelectedHSK(level || 'ALL')}
          />
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((word) => {
            const topic = topicsData.find(t => t.id === word.topic);
            
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
                      onClick={() => removeFavorite(word.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart size={20} fill="currentColor" />
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
                      onClick={() => router.push(`/learn?hsk=${word.hskLevel}&startWord=${word.id}`)}
                      className="flex-1"
                    >
                      <BookOpen size={16} className="mr-1" />
                      Học lại
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <HeartOff className="mx-auto text-muted-foreground mb-4" size={64} />
            <CardTitle className="mb-2">
              {selectedHSK === 'ALL' 
                ? 'Chưa có từ yêu thích nào' 
                : `Chưa có từ yêu thích nào cho ${selectedHSK}`
              }
            </CardTitle>
            <CardDescription className="mb-6">
              Hãy đánh dấu những từ vựng bạn thích khi học để xem lại sau
            </CardDescription>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="/learn">Bắt đầu học</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/vocab">Xem kho từ vựng</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {favoriteWords.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <CardTitle>Ôn tập từ yêu thích</CardTitle>
              </div>
              <CardDescription className="mb-4">
                Học lại những từ vựng bạn đã đánh dấu yêu thích
              </CardDescription>
              <Button 
                onClick={() => router.push(`/learn?favorites=true&hsk=${selectedHSK}`)}
                className="w-full"
              >
                Bắt đầu ôn tập
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="text-green-600" size={20} />
                </div>
                <CardTitle>Quiz từ yêu thích</CardTitle>
              </div>
              <CardDescription className="mb-4">
                Kiểm tra khả năng nhớ từ vựng yêu thích
              </CardDescription>
              <Button 
                onClick={startQuizWithFavorites}
                disabled={filteredFavorites.length === 0}
                className="w-full"
              >
                Làm quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
