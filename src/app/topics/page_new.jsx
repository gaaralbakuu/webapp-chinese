'use client';

import { useState } from 'react';
import Link from 'next/link';
import { topicsData, getWordsByTopic } from '@/lib/data';
import { ChevronRight, BookOpen, Filter } from 'lucide-react';
import HSKSelector from '@/app/components/HSKSelector';
import { useApp } from '@/lib/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function TopicsPage() {
  const [selectedHSK, setSelectedHSK] = useState('ALL');
  const { studyProgress } = useApp();

  // Calculate topic stats based on selected HSK level
  const getTopicStats = (topic) => {
    const words = getWordsByTopic(topic.id);
    const filteredWords = selectedHSK === 'ALL' 
      ? words 
      : words.filter(word => word.hskLevel === selectedHSK);
      
    const learnedWords = filteredWords.filter(word => 
      studyProgress[word.hskLevel]?.learned.includes(word.id) || false
    );
    
    return {
      totalWords: filteredWords.length,
      learnedWords: learnedWords.length,
      progress: filteredWords.length > 0 ? Math.round((learnedWords.length / filteredWords.length) * 100) : 0
    };
  };

  // Filter topics that have words in selected HSK level
  const filteredTopics = topicsData.filter(topic => {
    if (selectedHSK === 'ALL') return true;
    const words = getWordsByTopic(topic.id);
    return words.some(word => word.hskLevel === selectedHSK);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Chủ đề học tập</h1>
        <p className="text-muted-foreground">
          Học từ vựng theo các chủ đề cụ thể
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Lọc theo cấp độ HSK
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HSKSelector 
            selectedLevel={selectedHSK === 'ALL' ? null : selectedHSK}
            onLevelChange={(level) => setSelectedHSK(level || 'ALL')}
          />
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const stats = getTopicStats(topic);
          
          return (
            <Card key={topic.id} className="hover:shadow-md transition-shadow group">
              <Link href={`/learn?topic=${topic.id}&hsk=${selectedHSK}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{topic.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {topic.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {stats.totalWords} từ
                        </Badge>
                        {stats.progress > 0 && (
                          <Badge variant="outline">
                            {stats.progress}% hoàn thành
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription>{topic.description}</CardDescription>
                  
                  {/* Progress Bar */}
                  {stats.totalWords > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ học</span>
                        <span className="text-muted-foreground">
                          {stats.learnedWords}/{stats.totalWords}
                        </span>
                      </div>
                      <Progress value={stats.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* HSK Levels for this topic */}
                  <div className="flex flex-wrap gap-1">
                    {topic.hskLevels.map((level) => (
                      <Badge key={level} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredTopics.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground text-lg mb-4">
              Không có chủ đề nào cho cấp độ HSK này
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedHSK('ALL')}
            >
              Xem tất cả chủ đề
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <Link href="/learn" className="block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Học tự do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Học từ vựng không theo chủ đề cụ thể
              </CardDescription>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Link href="/quiz" className="block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Kiểm tra tổng hợp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Làm bài kiểm tra với từ vựng từ tất cả chủ đề
              </CardDescription>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
