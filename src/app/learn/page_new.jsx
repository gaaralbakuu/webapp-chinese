'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Volume2, RotateCcw, Check, BookOpen, Eye, EyeOff } from 'lucide-react';
import { vocabularyData, getVocabularyByHSK } from '@/lib/data';
import { useApp } from '@/lib/AppContext';
import HSKSelector from '@/app/components/HSKSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function LearnPage() {
  const { learnedWords, markAsLearned } = useApp();
  const searchParams = useSearchParams();
  const [selectedHSK, setSelectedHSK] = useState(null);
  const [currentData, setCurrentData] = useState(vocabularyData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionLearned, setSessionLearned] = useState([]);
  const [showHSKSelector, setShowHSKSelector] = useState(true);

  // Handle URL parameters
  useEffect(() => {
    const hskParam = searchParams.get('hsk');
    const startWordParam = searchParams.get('startWord');
    
    if (hskParam) {
      setSelectedHSK(hskParam);
      setShowHSKSelector(false);
    }
    
    if (startWordParam && hskParam) {
      const data = getVocabularyByHSK(hskParam);
      const wordIndex = data.findIndex(word => word.id.toString() === startWordParam);
      if (wordIndex !== -1) {
        setCurrentData(data);
        setCurrentIndex(wordIndex);
        setIsFlipped(false);
      }
    }
  }, [searchParams]);

  // Update data when HSK selection changes
  useEffect(() => {
    if (!searchParams.get('startWord')) {
      const data = selectedHSK ? getVocabularyByHSK(selectedHSK) : vocabularyData;
      setCurrentData(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [selectedHSK]);

  const currentWord = currentData[currentIndex];
  const progress = currentData.length > 0 ? ((currentIndex + 1) / currentData.length) * 100 : 0;
  const isWordLearned = currentWord && (learnedWords.includes(currentWord.id) || sessionLearned.includes(currentWord.id));

  const handleNext = () => {
    if (currentIndex < currentData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkAsLearned = () => {
    if (currentWord) {
      markAsLearned(currentWord.id, currentWord.hskLevel);
      setSessionLearned([...sessionLearned, currentWord.id]);
    }
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (showHSKSelector && !selectedHSK) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Học từ vựng</h1>
          <p className="text-muted-foreground">
            Chọn cấp độ HSK để bắt đầu học
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Chọn cấp độ học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HSKSelector 
              selectedLevel={selectedHSK}
              onLevelChange={(level) => {
                setSelectedHSK(level);
                setShowHSKSelector(false);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground text-lg mb-4">
              Không có từ vựng nào để học
            </div>
            <Button onClick={() => setShowHSKSelector(true)}>
              Chọn cấp độ khác
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Học từ vựng</h1>
          <p className="text-muted-foreground">
            {selectedHSK || 'Tất cả cấp độ'} • Từ {currentIndex + 1} / {currentData.length}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHSKSelector(true)}
        >
          Đổi cấp độ
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Tiến độ</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Card className="mb-6 min-h-[400px] relative">
        <CardContent className="p-8 h-full">
          <div className="text-center space-y-6">
            {/* HSK Level Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm">
                {currentWord.hskLevel}
              </Badge>
            </div>

            {/* Chinese Character */}
            <div className="text-6xl font-bold text-primary">
              {currentWord.chinese}
            </div>

            {/* Pinyin */}
            <div className="text-2xl text-muted-foreground">
              {currentWord.pinyin}
            </div>

            {/* Flip button */}
            <Button
              variant="outline"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2"
            >
              {isFlipped ? <EyeOff size={16} /> : <Eye size={16} />}
              {isFlipped ? 'Ẩn nghĩa' : 'Xem nghĩa'}
            </Button>

            {/* Meaning (shown when flipped) */}
            {isFlipped && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-2xl font-semibold">
                  {currentWord.vietnamese}
                </div>
                <div className="text-lg text-muted-foreground">
                  {currentWord.english}
                </div>
                
                {/* Example */}
                <Card className="bg-muted/50 max-w-md mx-auto">
                  <CardContent className="p-4">
                    <div className="text-sm mb-2">{currentWord.example}</div>
                    <div className="text-xs text-muted-foreground">
                      {currentWord.exampleTranslation}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => speakWord(currentWord.chinese)}
          className="flex items-center gap-2"
        >
          <Volume2 size={16} />
          Phát âm
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Lật thẻ
        </Button>

        <Button
          variant={isWordLearned ? "secondary" : "default"}
          onClick={handleMarkAsLearned}
          disabled={isWordLearned}
          className="flex items-center gap-2"
        >
          <Check size={16} />
          {isWordLearned ? 'Đã học' : 'Đã hiểu'}
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.href = `/quiz?hsk=${currentWord.hskLevel}`}
          className="flex items-center gap-2"
        >
          <BookOpen size={16} />
          Quiz
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Trước
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {currentData.length}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === currentData.length - 1}
          className="flex items-center gap-2"
        >
          Sau
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Session Stats */}
      {sessionLearned.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 mb-1">
                Tuyệt vời! 🎉
              </div>
              <div className="text-sm text-muted-foreground">
                Bạn đã học được {sessionLearned.length} từ mới trong phiên này
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
