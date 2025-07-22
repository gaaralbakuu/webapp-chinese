'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Target, Trophy, Clock, TrendingUp, Calendar, Award, BarChart3, History, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/lib/AppContext';
import { vocabularyData, hskLevels } from '@/lib/data';

export default function Home() {
  const { learnedWords, favorites, quizHistory } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalWords = vocabularyData.length;
  const learnedCount = learnedWords.length;
  const progressPercentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const favoriteCount = favorites.length;
  
  // HSK level progress
  const hskProgress = hskLevels.map(level => {
    const levelWords = vocabularyData.filter(word => word.hskLevel === level.id);
    const learnedInLevel = levelWords.filter(word => learnedWords.includes(word.id)).length;
    return {
      ...level,
      total: levelWords.length,
      learned: learnedInLevel,
      progress: levelWords.length > 0 ? Math.round((learnedInLevel / levelWords.length) * 100) : 0
    };
  });

  // Recent activity (mock data - in real app would come from actual learning history)
  const recentActivity = [
    { date: '2025-06-22', action: 'Học từ vựng', count: 5, hsk: 'HSK1' },
    { date: '2025-06-21', action: 'Quiz hoàn thành', count: 8, hsk: 'HSK2' },
    { date: '2025-06-20', action: 'Học từ vựng', count: 3, hsk: 'HSK1' },
    { date: '2025-06-19', action: 'Thêm yêu thích', count: 2, hsk: 'HSK3' },
  ];

  // Learning streak (mock data)
  const learningStreak = 7;
  const weeklyGoal = 50;
  const weeklyProgress = learnedCount % 50;  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <Card className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
          <p className="text-blue-100 mb-6">
            Tiếp tục hành trình học từ vựng tiếng Trung của bạn
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/learn" className="inline-flex items-center gap-2">
              <BookOpen size={20} />
              Tiếp tục học
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Tổng quan
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'outline'}
          onClick={() => setActiveTab('progress')}
          className="flex items-center gap-2"
        >
          <TrendingUp size={16} />
          Tiến độ HSK
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-2"
        >
          <History size={16} />
          Lịch sử học
        </Button>
      </div>      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Từ đã học</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{learnedCount}</div>
                <p className="text-xs text-blue-600">/ {totalWords} từ vựng</p>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Yêu thích</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{favoriteCount}</div>
                <p className="text-xs text-green-600">từ được đánh dấu</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Chuỗi ngày</CardTitle>
                <Trophy className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{learningStreak}</div>
                <p className="text-xs text-orange-600">ngày liên tiếp</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Mục tiêu tuần</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">{weeklyProgress}</div>
                <p className="text-xs text-purple-600">/ {weeklyGoal} từ</p>
                <Progress value={(weeklyProgress / weeklyGoal) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-blue-200 hover:border-blue-400">
              <Link href="/learn" className="block">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-colors">
                      <BookOpen className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-blue-800">Học từ mới</CardTitle>
                      <CardDescription className="text-blue-600">Flashcard tương tác</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Khám phá từ vựng mới với phương pháp học hiệu quả</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-green-200 hover:border-green-400">
              <Link href="/quiz" className="block">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 group-hover:bg-green-200 rounded-xl transition-colors">
                      <Target className="text-green-600" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-green-800">Kiểm tra</CardTitle>
                      <CardDescription className="text-green-600">Quiz thử thách</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Thử thách bản thân và kiểm tra kiến thức</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-purple-200 hover:border-purple-400">
              <Link href="/topics" className="block">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-xl transition-colors">
                      <Trophy className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-purple-800">Chủ đề</CardTitle>
                      <CardDescription className="text-purple-600">Học theo chủ đề</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Học từ vựng theo các chủ đề cụ thể</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </>
      )}

      {/* HSK Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <TrendingUp size={20} />
                Tiến độ học tập theo cấp độ HSK
              </CardTitle>
              <CardDescription className="text-indigo-600">
                Theo dõi tiến độ học từ vựng qua từng cấp độ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hskProgress.map((level) => (
                <div key={level.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Badge className={`badge-${level.id.toLowerCase()}`}>
                        {level.name}
                      </Badge>
                      <span className="text-sm font-medium text-gray-700">
                        {level.description}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {level.learned}/{level.total} từ ({level.progress}%)
                    </span>
                  </div>
                  <Progress value={level.progress} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* HSK Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hskProgress.map((level) => (
              <Card key={level.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={`badge-${level.id.toLowerCase()}`}>
                      {level.name}
                    </Badge>
                    <span className="text-2xl font-bold text-gray-700">
                      {level.progress}%
                    </span>
                  </div>
                  <CardTitle className="text-lg">{level.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={level.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Đã học: {level.learned}</span>
                      <span>Tổng: {level.total}</span>
                    </div>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Link href={`/learn?hsk=${level.id}`}>
                        Học {level.name}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Learning History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <History size={20} />
                Lịch sử học tập
              </CardTitle>
              <CardDescription className="text-emerald-600">
                Xem lại hoạt động học tập gần đây của bạn
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Learning Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Lịch học tập
              </CardTitle>
              <CardDescription>
                Theo dõi những ngày bạn đã học
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                {/* Mock calendar days */}
                {Array.from({length: 35}, (_, i) => {
                  const hasActivity = Math.random() > 0.7;
                  const isToday = i === 15;
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm transition-colors ${
                        isToday 
                          ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold' 
                          : hasActivity 
                            ? 'border-green-300 bg-green-100 text-green-700' 
                            : 'border-gray-200 text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span>Có học tập</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                  <span>Hôm nay</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{activity.action}</div>
                      <div className="text-sm text-gray-600">
                        {activity.count} từ • {activity.hsk}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
              
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Chưa có hoạt động nào. Hãy bắt đầu học để xem lịch sử!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
