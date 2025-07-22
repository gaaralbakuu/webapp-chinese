'use client';

import { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Trophy, Target, PlayCircle } from 'lucide-react';
import { getRandomVocabulary, vocabularyData } from '@/lib/data';
import HSKSelector from '@/app/components/HSKSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          <h1 className="text-3xl font-bold mb-2">Kiểm tra từ vựng</h1>
          <p className="text-muted-foreground">Chọn cấp độ HSK để làm quiz phù hợp</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chọn cấp độ HSK</CardTitle>
          </CardHeader>
          <CardContent>
            <HSKSelector 
              selectedLevel={selectedHSK}
              onLevelChange={setSelectedHSK}
            />
          </CardContent>
        </Card>

        {/* Quiz Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chọn loại quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={quizType} onValueChange={setQuizType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="meaning">Quiz chọn nghĩa</TabsTrigger>
                <TabsTrigger value="listening">Quiz nghe đoán từ</TabsTrigger>
              </TabsList>
              <TabsContent value="meaning" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <CardDescription>
                      Xem từ tiếng Trung, chọn nghĩa đúng trong tiếng Việt
                    </CardDescription>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="listening" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <CardDescription>
                      Nghe phát âm từ tiếng Trung, chọn từ đúng
                    </CardDescription>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={startNewQuiz}
            disabled={availableWords.length < 4}
            size="lg"
            className="flex items-center gap-2"
          >
            <Target size={20} />
            Bắt đầu Quiz ({Math.min(availableWords.length, 5)} câu)
          </Button>
          
          {availableWords.length < 4 && (
            <p className="text-destructive text-sm mt-2">
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
        <div className="animate-pulse text-muted-foreground">Đang tải quiz...</div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  if (isQuizCompleted) {
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <Trophy className="mx-auto text-yellow-500 mb-4" size={64} />
              <CardTitle className="text-3xl mb-2">
                Hoàn thành Quiz {selectedHSK || 'Tất cả cấp độ'}!
              </CardTitle>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-blue-600">{score}</div>
                  <div className="text-blue-700">Câu đúng</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-red-600">{quizData.length - score}</div>
                  <div className="text-red-700">Câu sai</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-green-600">{percentage}%</div>
                  <div className="text-green-700">Độ chính xác</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={startNewQuiz} className="flex items-center gap-2">
                <RotateCcw size={20} />
                Làm lại
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowHSKSelector(true)}
                className="flex items-center gap-2"
              >
                <Target size={20} />
                Chọn cấp độ khác
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with HSK info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {quizType === 'meaning' ? 'Quiz: Chọn nghĩa đúng' : 'Quiz: Nghe và chọn từ'}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedHSK || 'Tất cả cấp độ'}</Badge>
            <span className="text-muted-foreground">
              Câu {currentQuestionIndex + 1} / {quizData.length}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHSKSelector(true)}
          size="sm"
        >
          Đổi cấp độ
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Tiến độ</span>
          <span className="text-muted-foreground">
            {Math.round(((currentQuestionIndex + 1) / quizData.length) * 100)}%
          </span>
        </div>
        <Progress 
          value={((currentQuestionIndex + 1) / quizData.length) * 100} 
          className="h-2"
        />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {quizType === 'meaning' ? (
            <div className="text-center space-y-4">
              <Badge variant="outline">{currentQuestion.word.hskLevel}</Badge>
              <div className="text-5xl font-bold">{currentQuestion.word.chinese}</div>
              <div className="text-xl text-muted-foreground">{currentQuestion.word.pinyin}</div>
              <Button
                variant="outline"
                onClick={() => speakWord(currentQuestion.word.chinese)}
                className="flex items-center gap-2"
              >
                <Volume2 size={20} />
                Phát âm
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <Badge variant="outline">{currentQuestion.word.hskLevel}</Badge>
              <div>
                <Button
                  onClick={() => speakWord(currentQuestion.word.chinese)}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <PlayCircle size={24} />
                  Nghe từ
                </Button>
              </div>
              <p className="text-muted-foreground">
                Chọn từ tiếng Trung tương ứng với âm thanh
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option) => {
          let variant = "outline";
          let className = "";
          
          if (isAnswered) {
            if (option.id === currentQuestion.correctAnswer) {
              variant = "default";
              className = "border-green-500 bg-green-50 hover:bg-green-50";
            } else if (option.id === selectedAnswer) {
              variant = "destructive";
              className = "border-red-500 bg-red-50 hover:bg-red-50";
            } else {
              className = "opacity-50";
            }
          }

          return (
            <Button
              key={option.id}
              variant={variant}
              onClick={() => handleAnswerSelect(option.id)}
              className={`h-auto p-4 text-left justify-start ${className}`}
              disabled={isAnswered}
            >
              {quizType === 'meaning' ? (
                <div>
                  <div className="font-semibold">{option.vietnamese}</div>
                  <div className="text-sm opacity-75">{option.english}</div>
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="text-2xl font-bold mb-2">{option.chinese}</div>
                  <div className="text-sm opacity-75">{option.pinyin}</div>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="text-center mb-6">
          <Button onClick={handleNextQuestion} size="lg">
            {currentQuestionIndex < quizData.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
          </Button>
        </div>
      )}

      {/* Score */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-sm text-muted-foreground">
            Điểm hiện tại: <span className="font-semibold">{score}</span> / {currentQuestionIndex + (isAnswered ? 1 : 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
