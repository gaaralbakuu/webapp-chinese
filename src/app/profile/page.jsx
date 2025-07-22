'use client';

import { useState } from 'react';
import { User, BookOpen, Target, Trophy, Calendar, BarChart3, TrendingUp, Award, Settings } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { vocabularyData } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    userProfile, 
    studyProgress, 
    quizStats, 
    studyStreak, 
    favorites,
    learnedWords 
  } = useApp();
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'progress', label: 'Tiến trình HSK', icon: TrendingUp },
    { id: 'achievements', label: 'Thành tích', icon: Award },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  // Calculate statistics
  const totalLearnedWords = learnedWords.length;
  const totalVocabulary = vocabularyData.length;
  const learningProgress = Math.round((totalLearnedWords / totalVocabulary) * 100);
  
  const hskStats = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5'].map(level => {
    const levelWords = vocabularyData.filter(word => word.hskLevel === level);
    const learnedInLevel = studyProgress[level]?.learned.length || 0;
    const masteredInLevel = studyProgress[level]?.mastered.length || 0;
    
    return {
      level,
      total: levelWords.length,
      learned: learnedInLevel,
      mastered: masteredInLevel,
      progress: levelWords.length > 0 ? Math.round((learnedInLevel / levelWords.length) * 100) : 0
    };
  });

  const achievements = [
    {
      id: 'first_word',
      title: 'Từ đầu tiên',
      description: 'Học từ vựng đầu tiên',
      icon: '🎯',
      unlocked: totalLearnedWords > 0
    },
    {
      id: 'ten_words',
      title: 'Người mới bắt đầu',
      description: 'Học 10 từ vựng',
      icon: '📚',
      unlocked: totalLearnedWords >= 10
    },
    {
      id: 'fifty_words',
      title: 'Học giả nhí',
      description: 'Học 50 từ vựng',
      icon: '🎓',
      unlocked: totalLearnedWords >= 50
    },
    {
      id: 'hundred_words',
      title: 'Chuyên gia từ vựng',
      description: 'Học 100 từ vựng',
      icon: '🏆',
      unlocked: totalLearnedWords >= 100
    },
    {
      id: 'streak_7',
      title: 'Kiên trí',
      description: 'Học liên tục 7 ngày',
      icon: '🔥',
      unlocked: studyStreak >= 7
    },
    {
      id: 'quiz_master',
      title: 'Cao thủ quiz',
      description: 'Đạt 80% độ chính xác',
      icon: '🎯',
      unlocked: quizStats.accuracy >= 80
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Card */}      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            Xin chào, {userProfile.name || 'Học viên'}! 👋
          </h2>
          <p className="text-blue-100">
            Mục tiêu hiện tại: {userProfile.targetLevel} • Học {userProfile.dailyGoal} từ/ngày
          </p>
        </CardContent>
      </Card>      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalLearnedWords}</div>
            <div className="text-sm text-gray-600">Từ đã học</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{favorites.length}</div>
            <div className="text-sm text-gray-600">Từ yêu thích</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{studyStreak}</div>
            <div className="text-sm text-gray-600">Ngày liên tiếp</div>
          </CardContent>
        </Card>        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{quizStats.accuracy}%</div>
            <div className="text-sm text-gray-600">Độ chính xác</div>
          </CardContent>
        </Card>
      </div>      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tiến trình tổng quan</CardTitle>
        </CardHeader>
        <CardContent>          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ học từ vựng</span>
              <span>{learningProgress}%</span>
            </div>
            <Progress value={learningProgress} variant="default" className="h-3" />
          </div>
          <p className="text-sm text-gray-600">
            {totalLearnedWords} / {totalVocabulary} từ vựng đã học
          </p>
        </CardContent>
      </Card>      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thành tích gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.filter(a => a.unlocked).slice(-4).map(achievement => (
              <Card key={achievement.id} className="bg-green-50 border-green-200">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-medium text-green-800">{achievement.title}</div>
                    <div className="text-sm text-green-600">{achievement.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderProgress = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Tiến trình theo cấp độ HSK</h2>
        {hskStats.map((stat, index) => {
        const progressVariants = ['success', 'default', 'warning', 'warning', 'danger'];
        const cardColors = [
          'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
          'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50', 
          'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50',
          'border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50',
          'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
        ];
        
        return (
          <Card key={stat.level} className={cardColors[index]}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-gray-800">{stat.level}</CardTitle>
                <Badge variant="secondary" className="bg-white/80 text-gray-700 border-gray-300">{stat.progress}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={stat.progress} variant={progressVariants[index]} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-semibold text-gray-800">{stat.total}</div>
                <div className="text-sm text-gray-600">Tổng từ</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-green-600">{stat.learned}</div>
                <div className="text-sm text-gray-600">Đã học</div>
              </div>
              <div>                <div className="text-xl font-semibold text-purple-600">{stat.mastered}</div>
                <div className="text-sm text-gray-600">Thành thạo</div>
              </div>
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
  const renderAchievements = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Thành tích đã đạt được</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <Card 
            key={achievement.id} 
            className={`transition-all ${
              achievement.unlocked 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-500">
                    <Trophy size={20} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Cài đặt cá nhân</h2>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Settings size={20} />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader><CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-orange-700 font-medium">Tên hiển thị</Label>
            <Input
              id="name"
              type="text"
              value={userProfile.name}
              placeholder="Nhập tên của bạn"
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target" className="text-orange-700 font-medium">Mục tiêu HSK</Label>
            <Select value={userProfile.targetLevel}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                <SelectValue placeholder="Chọn mục tiêu HSK" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HSK1">HSK1</SelectItem>
                <SelectItem value="HSK2">HSK2</SelectItem>
                <SelectItem value="HSK3">HSK3</SelectItem>
                <SelectItem value="HSK4">HSK4</SelectItem>
                <SelectItem value="HSK5">HSK5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dailyGoal" className="text-orange-700 font-medium">Số từ học mỗi ngày</Label>
            <Input
              id="dailyGoal"
              type="number"
              value={userProfile.dailyGoal}
              min="1"
              max="50"
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          
          <Button className="mt-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Hồ sơ cá nhân
        </h1>
        <p className="text-gray-600">
          Theo dõi tiến trình học tập và quản lý thông tin cá nhân
        </p>
      </div>      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const colors = {
              'overview': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600',
              'progress': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600',
              'achievements': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600',
              'settings': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600'
            };
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className={`flex items-center gap-2 data-[state=active]:text-white transition-all ${colors[tab.id]}`}
              >
                <Icon size={16} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="progress" className="mt-8">
          {renderProgress()}
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-8">
          {renderAchievements()}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-8">
          {renderSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
