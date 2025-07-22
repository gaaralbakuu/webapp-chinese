'use client';

import { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Trophy, Target } from 'lucide-react';
import { getRandomVocabulary, vocabularyData } from '@/lib/data';
import HSKSelector from '@/app/components/HSKSelector';

export default function QuizPage() {
  const [selectedHSK, setSelectedHSK] = useState(null);
  const [showHSKSelector, setShowHSKSelector] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizType, setQuizType] = useState('meaning'); // 'meaning' or 'listening'

  const startNewQuiz = () => {
    const randomWords = getRandomVocabulary(5, selectedHSK);
    if (randomWords.length === 0) {
      return;
    }
    
    const questions = randomWords.map(word => {
      const wrongOptions = getRandomVocabulary(3, selectedHSK).filter(w => w.id !== word.id);
      const options = [word, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        word,
        options,
        correctAnswer: word.id
      };
    });
    
    setQuizData(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
    setShowHSKSelector(false);
  };

  // Show HSK selector first
  if (showHSKSelector) {
    const availableWords = selectedHSK ? 
      vocabularyData.filter(w => w.hskLevel === selectedHSK) : 
      vocabularyData;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Kiểm tra từ vựng</h1>
          <p className="text-gray-600">Chọn cấp độ HSK để làm quiz phù hợp</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <HSKSelector 
            selectedLevel={selectedHSK}
            onLevelChange={setSelectedHSK}
          />
        </div>

        {/* Quiz Type Selection */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn loại quiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setQuizType('meaning')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                quizType === 'meaning'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">Quiz chọn nghĩa</div>
              <div className="text-sm text-gray-600">Xem từ tiếng Trung, chọn nghĩa đúng</div>
            </button>
            
            <button
              onClick={() => setQuizType('listening')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                quizType === 'listening'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">Quiz nghe đoán từ</div>
              <div className="text-sm text-gray-600">Nghe phát âm, chọn từ đúng</div>
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startNewQuiz}
            disabled={availableWords.length < 4}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Target size={20} />
              Bắt đầu Quiz ({Math.min(availableWords.length, 5)} câu)
            </div>
          </button>
          
          {availableWords.length < 4 && (
            <p className="text-red-600 text-sm mt-2">
              Cần ít nhất 4 từ vựng để làm quiz
            </p>
          )}
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerId) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerId);
    setIsAnswered(true);
    
    if (answerId === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'zh-CN';
      speechSynthesis.speak(utterance);
    }
  };

  if (quizData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-pulse text-gray-600">Đang tải quiz...</div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  if (isQuizCompleted) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200">
          <div className="mb-6">
            <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Hoàn thành Quiz {selectedHSK || 'Tất cả cấp độ'}!
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-semibold text-blue-600">{score}</div>
              <div className="text-blue-700">Câu đúng</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-2xl font-semibold text-red-600">{quizData.length - score}</div>
              <div className="text-red-700">Câu sai</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-semibold text-green-600">{percentage}%</div>
              <div className="text-green-700">Độ chính xác</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startNewQuiz}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <RotateCcw size={20} />
              Làm lại
            </button>
            <button
              onClick={() => setShowHSKSelector(true)}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Target size={20} />
              Chọn cấp độ khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with HSK info */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {quizType === 'meaning' ? 'Quiz: Chọn nghĩa đúng' : 'Quiz: Nghe và chọn từ'} - {selectedHSK || 'Tất cả cấp độ'}
          </h1>
          <div className="text-gray-600">
            Câu {currentQuestionIndex + 1} / {quizData.length}
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
          style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
        ></div>
      </div>

      {/* HSK Level Badge */}
      {currentQuestion.word.hskLevel && (
        <div className="text-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {currentQuestion.word.hskLevel}
          </span>
        </div>
      )}

      {/* Question */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 mb-8">
        {quizType === 'meaning' ? (
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-4">
              {currentQuestion.word.chinese}
            </div>
            <div className="text-xl text-gray-600 mb-6">
              {currentQuestion.word.pinyin}
            </div>
            <button
              onClick={() => speakWord(currentQuestion.word.chinese)}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors mx-auto"
            >
              <Volume2 size={20} />
              Phát âm
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <button
                onClick={() => speakWord(currentQuestion.word.chinese)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors mx-auto text-lg"
              >
                <Volume2 size={24} />
                Nghe từ
              </button>
            </div>
            <div className="text-gray-600">
              Chọn từ tiếng Trung tương ứng với âm thanh
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option) => {
          let buttonClass = "p-4 rounded-xl border-2 text-left transition-all cursor-pointer ";
          
          if (!isAnswered) {
            buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
          } else {
            if (option.id === currentQuestion.correctAnswer) {
              buttonClass += "border-green-500 bg-green-50";
            } else if (option.id === selectedAnswer) {
              buttonClass += "border-red-500 bg-red-50";
            } else {
              buttonClass += "border-gray-200 bg-gray-50";
            }
          }

          return (
            <div
              key={option.id}
              className={buttonClass}
              onClick={() => handleAnswerSelect(option.id)}
            >
              {quizType === 'meaning' ? (
                <div>
                  <div className="font-semibold text-gray-800">
                    {option.vietnamese}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.english}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {option.chinese}
                  </div>
                  <div className="text-gray-600">
                    {option.pinyin}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            {currentQuestionIndex < quizData.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
          </button>
        </div>
      )}

      {/* Score */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-600">
          Điểm hiện tại: {score} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
        </div>
      </div>
    </div>
  );
}
