'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Volume2, RotateCcw, Check, BookOpen, Eye, EyeOff, Play } from 'lucide-react';
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
  const [isFlipped, setIsFlipped] = useState(false);  const [sessionLearned, setSessionLearned] = useState([]);
  const [showHSKSelector, setShowHSKSelector] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false);  // Handle URL parameters
  useEffect(() => {
    const hskParam = searchParams.get('hsk');
    const startWordParam = searchParams.get('startWord');
    
    if (hskParam) {
      setSelectedHSK(hskParam);
      setShowHSKSelector(false);
      setHasStarted(true);
      setHasSelectedLevel(true);
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
  };  const handleStartLearning = () => {
    // Cho phép bắt đầu học khi đã chọn cấp độ (bao gồm "Tất cả cấp độ" = null)
    if (hasSelectedLevel) {
      setHasStarted(true);
      setShowHSKSelector(false);
    }
  };

  // HSK Selection Screen
  if (showHSKSelector && !hasStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Card className="text-center mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-2">Học từ vựng tiếng Trung</h1>
            <p className="text-emerald-100">
              Chọn cấp độ HSK phù hợp để bắt đầu hành trình học tập
            </p>
          </CardContent>
        </Card>

        {/* HSK Selection */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <BookOpen size={20} />
              Chọn cấp độ học tập
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Mỗi cấp độ HSK có từ vựng phù hợp với trình độ khác nhau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">            <HSKSelector 
              selectedLevel={selectedHSK}
              onLevelChange={(level) => {
                setSelectedHSK(level);
                setHasSelectedLevel(true);
              }}
            />
            
            {/* Start Button */}
            <div className="text-center pt-4">              <Button
                onClick={handleStartLearning}
                disabled={!hasSelectedLevel}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={20} className="mr-2" />
                {hasSelectedLevel ? 
                  `Bắt đầu học ${selectedHSK || 'Tất cả cấp độ'}` : 
                  'Chọn cấp độ để bắt đầu'
                }
              </Button>
              
              {hasSelectedLevel && (
                <p className="text-sm text-emerald-700 mt-3">
                  Sẵn sàng học {currentData.length} từ vựng {selectedHSK ? `cấp độ ${selectedHSK}` : 'tất cả cấp độ'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12 border-gray-200 bg-gray-50">
          <CardContent>
            <div className="text-gray-600 text-lg mb-4">
              Không có từ vựng nào để học 😔
            </div>            <Button 
              onClick={() => {
                setShowHSKSelector(true);
                setHasStarted(false);
                setHasSelectedLevel(false);
              }}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              Chọn cấp độ khác
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">      {/* Header */}
      <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Học từ vựng {selectedHSK || 'Tất cả cấp độ'}</h1>
              <p className="text-emerald-100">
                Từ {currentIndex + 1} / {currentData.length} • {Math.round(progress)}% hoàn thành
              </p>
            </div>            <Button
              variant="outline"
              onClick={() => {
                setShowHSKSelector(true);
                setHasStarted(false);
                setHasSelectedLevel(false);
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Đổi cấp độ
            </Button>
          </div>
        </CardContent>
      </Card>      {/* Progress */}
      <Card className="mb-6 border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-emerald-700 font-medium">Tiến độ học tập</span>
            <span className="text-emerald-600">{Math.round(progress)}% • {currentIndex + 1}/{currentData.length}</span>
          </div>
          <Progress value={progress} className="h-3 bg-emerald-100" />
        </CardContent>
      </Card>      {/* Flashcard */}
      <Card className="mb-6 min-h-[400px] relative border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
        <CardContent className="p-8 h-full">
          <div className="text-center space-y-6">
            {/* HSK Level Badge */}
            <div className="flex justify-center">
              <Badge className={`badge-${currentWord.hskLevel.toLowerCase()} text-sm px-3 py-1`}>
                {currentWord.hskLevel}
              </Badge>
            </div>

            {/* Chinese Character */}
            <div className="text-6xl font-bold text-emerald-700">
              {currentWord.chinese}
            </div>

            {/* Pinyin */}
            <div className="text-2xl text-emerald-600 font-medium">
              {currentWord.pinyin}
            </div>

            {/* Flip button */}
            <Button
              variant="outline"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              {isFlipped ? <EyeOff size={16} /> : <Eye size={16} />}
              {isFlipped ? 'Ẩn nghĩa' : 'Xem nghĩa'}
            </Button>

            {/* Meaning (shown when flipped) */}
            {isFlipped && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-2xl font-semibold text-gray-800">
                  {currentWord.vietnamese}
                </div>
                <div className="text-lg text-gray-600">
                  {currentWord.english}
                </div>
                
                {/* Example */}
                <Card className="bg-white/70 border-emerald-100 max-w-md mx-auto">
                  <CardContent className="p-4">
                    <div className="text-sm mb-2 text-gray-700">{currentWord.example}</div>
                    <div className="text-xs text-gray-500">
                      {currentWord.exampleTranslation}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => speakWord(currentWord.chinese)}
          className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Volume2 size={16} />
          Phát âm
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
        >
          <RotateCcw size={16} />
          Lật thẻ
        </Button>

        <Button
          variant={isWordLearned ? "secondary" : "default"}
          onClick={handleMarkAsLearned}
          disabled={isWordLearned}
          className={`flex items-center gap-2 ${
            isWordLearned 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Check size={16} />
          {isWordLearned ? 'Đã học' : 'Đã hiểu'}
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.href = `/quiz?hsk=${currentWord.hskLevel}`}
          className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
        >
          <BookOpen size={16} />
          Quiz
        </Button>
      </div>      {/* Navigation */}
      <Card className="mb-6 border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Trước
            </Button>

            <div className="text-sm text-gray-600 font-medium">
              {currentIndex + 1} / {currentData.length}
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === currentData.length - 1}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Sau
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>      {/* Session Stats */}
      {sessionLearned.length > 0 && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-700 mb-1">
                Tuyệt vời! 🎉
              </div>
              <div className="text-sm text-green-600">
                Bạn đã học được <span className="font-semibold">{sessionLearned.length}</span> từ mới trong phiên này
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
