'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Volume2, RotateCcw, Check, BookOpen } from 'lucide-react';
import { vocabularyData, getVocabularyByHSK } from '@/lib/data';
import { useApp } from '@/lib/AppContext';
import HSKSelector from '@/app/components/HSKSelector';

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
      setShowHSKSelector(false); // Ẩn HSK selector nếu đã có HSK từ URL
    }
    
    if (startWordParam && hskParam) {
      // Tìm từ cụ thể để bắt đầu học
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
    // Chỉ cập nhật nếu không có startWord parameter
    if (!searchParams.get('startWord')) {
      const data = selectedHSK ? getVocabularyByHSK(selectedHSK) : vocabularyData;
      setCurrentData(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [selectedHSK]);

  const currentWord = currentData[currentIndex];

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkAsLearned = () => {
    if (!learnedWords.includes(currentWord.id) && !sessionLearned.includes(currentWord.id)) {
      markAsLearned(currentWord.id, currentWord.hskLevel);
      setSessionLearned(prev => [...prev, currentWord.id]);
    }
    handleNext();
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.chinese);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }
  };

  // Show HSK selector first
  if (showHSKSelector) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Học từ vựng</h1>
          <p className="text-gray-600">Chọn cấp độ HSK để bắt đầu học từ vựng phù hợp</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <HSKSelector 
            selectedLevel={selectedHSK}
            onLevelChange={setSelectedHSK}
          />
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowHSKSelector(false)}
              disabled={currentData.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={20} />
                Bắt đầu học ({currentData.length} từ)
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Chúc mừng! Bạn đã học hết tất cả từ vựng {selectedHSK || ''}
        </h1>        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setSessionLearned([]);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Bắt đầu lại
          </button>
          <button 
            onClick={() => setShowHSKSelector(true)}
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Chọn cấp độ khác
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with HSK info and change button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Học từ vựng {selectedHSK || 'Tất cả cấp độ'}
          </h1>
          <div className="text-gray-600">
            Từ {currentIndex + 1} / {currentData.length}
            {searchParams.get('startWord') && (
              <span className="ml-2 text-green-600 text-sm">
                • Đang ôn lại từ được chọn
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowHSKSelector(true)}
          className="text-blue-600 hover:text-blue-700 text-sm border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Đổi cấp độ
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / currentData.length) * 100}%` }}
        ></div>
      </div>

      {/* HSK Level Badge */}
      {currentWord.hskLevel && (
        <div className="text-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {currentWord.hskLevel}
          </span>
        </div>
      )}

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto mb-8">
        <div 
          className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col justify-center items-center p-8 cursor-pointer transition-all duration-300 hover:shadow-md"
          onClick={handleFlip}
        >
          {!isFlipped ? (
            // Front of card - Chinese word
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 mb-4">
                {currentWord.chinese}
              </div>
              <div className="text-2xl text-gray-600 mb-6">
                {currentWord.pinyin}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord();
                }}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Volume2 size={20} />
                Phát âm
              </button>
              <div className="text-sm text-gray-500 mt-4">
                Nhấn để xem nghĩa
              </div>
            </div>
          ) : (
            // Back of card - Translation and example
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-800 mb-4">
                {currentWord.vietnamese}
              </div>
              <div className="text-lg text-gray-600 mb-6">
                {currentWord.english}
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <div className="text-gray-800 mb-2">
                  {currentWord.example}
                </div>
                <div className="text-gray-600 text-sm">
                  {currentWord.exampleTranslation}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Nhấn để quay lại từ
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
          Trước
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
          Lật thẻ
        </button>

        <button
          onClick={handleMarkAsLearned}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <Check size={20} />
          Đã học
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === currentData.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-600">
          Đã học: {learnedWords.length} / {currentData.length} từ
        </div>
      </div>
    </div>
  );
}
