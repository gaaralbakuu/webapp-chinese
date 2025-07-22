'use client';

import { useState, useEffect } from 'react';
import { Settings, Globe, Volume2, Palette, Bell, Save, RotateCcw, User, Moon, Sun } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { userProfile, updateUserProfile } = useApp();
  const [settings, setSettings] = useState({
    language: 'vi', // Vietnamese, English, Chinese
    voiceSpeed: [1],
    voiceGender: 'female', // male, female
    theme: 'light', // light, dark, auto
    notifications: {
      dailyReminder: true,
      studyStreak: true,
      achievements: true,
      weeklyReport: false
    },
    accessibility: {
      fontSize: 'medium', // small, medium, large
      highContrast: false,
      reduceMotion: false
    }
  });

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const chineseVoices = availableVoices.filter(voice => 
        voice.lang.includes('zh') || voice.lang.includes('cmn')
      );
      setVoices(chineseVoices);
      
      // Set default voice
      if (chineseVoices.length > 0 && !selectedVoice) {
        const femaleVoice = chineseVoices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman')
        );
        setSelectedVoice(femaleVoice || chineseVoices[0]);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('chinese-app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Test voice function
  const testVoice = () => {
    if (selectedVoice && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('你好，这是语音测试。');
      utterance.voice = selectedVoice;
      utterance.rate = settings.voiceSpeed[0];
      speechSynthesis.speak(utterance);
    }
  };

  // Save settings
  const saveSettings = () => {
    try {
      localStorage.setItem('chinese-app-settings', JSON.stringify(settings));
      
      // Apply theme immediately
      applyTheme(settings.theme);
      
      // Apply accessibility settings
      applyAccessibilitySettings();
      
      alert('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Có lỗi khi lưu cài đặt. Vui lòng thử lại.');
    }
  };

  // Apply theme
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Apply accessibility settings
  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--font-size-multiplier', 
      settings.accessibility.fontSize === 'small' ? '0.875' :
      settings.accessibility.fontSize === 'large' ? '1.125' : '1'
    );
    
    // High contrast
    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (settings.accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
      const defaultSettings = {
        language: 'vi',
        voiceSpeed: [1],
        voiceGender: 'female',
        theme: 'light',
        notifications: {
          dailyReminder: true,
          studyStreak: true,
          achievements: true,
          weeklyReport: false
        },
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          reduceMotion: false
        }
      };
      setSettings(defaultSettings);
    }
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (path.includes('.')) {
        const keys = path.split('.');
        let current = newSettings;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      } else {
        newSettings[path] = value;
      }
      return newSettings;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Settings size={32} />
          Cài đặt
        </h1>
        <p className="text-gray-600">
          Tùy chỉnh trải nghiệm học tập của bạn
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 p-1">
          <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            <User size={16} />
            Chung
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
            <Volume2 size={16} />
            Âm thanh
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <Palette size={16} />
            Giao diện
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
            <Bell size={16} />
            Thông báo
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-8">
          <div className="space-y-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Globe size={20} />
                  Cài đặt ngôn ngữ
                </CardTitle>
                <CardDescription>
                  Chọn ngôn ngữ hiển thị giao diện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ giao diện</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="zh">🇨🇳 中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <User size={20} />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên hiển thị</Label>
                  <Input
                    id="username"
                    value={userProfile.name || ''}
                    onChange={(e) => updateUserProfile({ name: e.target.value })}
                    placeholder="Nhập tên của bạn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Mục tiêu HSK</Label>
                  <Select value={userProfile.targetLevel} onValueChange={(value) => updateUserProfile({ targetLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mục tiêu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HSK1">HSK1 - Cơ bản</SelectItem>
                      <SelectItem value="HSK2">HSK2 - Sơ cấp</SelectItem>
                      <SelectItem value="HSK3">HSK3 - Trung cấp thấp</SelectItem>
                      <SelectItem value="HSK4">HSK4 - Trung cấp</SelectItem>
                      <SelectItem value="HSK5">HSK5 - Trung cấp cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Settings */}
        <TabsContent value="voice" className="mt-8">
          <div className="space-y-6">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Volume2 size={20} />
                  Cài đặt âm thanh
                </CardTitle>
                <CardDescription>
                  Tùy chỉnh giọng đọc và tốc độ phát âm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tốc độ phát âm: {settings.voiceSpeed[0]}x</Label>
                  <Slider
                    value={settings.voiceSpeed}
                    onValueChange={(value) => updateSetting('voiceSpeed', value)}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Chậm (0.5x)</span>
                    <span>Nhanh (2x)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Giọng đọc</Label>
                  <Select value={selectedVoice?.name || ''} onValueChange={(value) => {
                    const voice = voices.find(v => v.name === value);
                    setSelectedVoice(voice);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giọng đọc" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={testVoice} variant="outline" className="w-full">
                  <Volume2 size={16} className="mr-2" />
                  Thử giọng đọc
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-8">
          <div className="space-y-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Palette size={20} />
                  Giao diện
                </CardTitle>
                <CardDescription>
                  Tùy chỉnh chủ đề và hiển thị
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chủ đề</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Sáng</SelectItem>
                      <SelectItem value="dark">🌙 Tối</SelectItem>
                      <SelectItem value="auto">🔄 Tự động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kích thước chữ</Label>
                  <Select value={settings.accessibility.fontSize} onValueChange={(value) => updateSetting('accessibility.fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Nhỏ</SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="large">Lớn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Độ tương phản cao</Label>
                    <p className="text-sm text-gray-500">Tăng độ tương phản cho dễ nhìn hơn</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => updateSetting('accessibility.highContrast', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Giảm chuyển động</Label>
                    <p className="text-sm text-gray-500">Giảm hiệu ứng chuyển động</p>
                  </div>
                  <Switch
                    checked={settings.accessibility.reduceMotion}
                    onCheckedChange={(checked) => updateSetting('accessibility.reduceMotion', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-8">
          <div className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Bell size={20} />
                  Thông báo
                </CardTitle>
                <CardDescription>
                  Quản lý các loại thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Nhắc nhở hằng ngày</Label>
                    <p className="text-sm text-gray-500">Nhắc bạn học từ vựng mỗi ngày</p>
                  </div>
                  <Switch
                    checked={settings.notifications.dailyReminder}
                    onCheckedChange={(checked) => updateSetting('notifications.dailyReminder', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Chuỗi học tập</Label>
                    <p className="text-sm text-gray-500">Thông báo về chuỗi ngày học liên tiếp</p>
                  </div>
                  <Switch
                    checked={settings.notifications.studyStreak}
                    onCheckedChange={(checked) => updateSetting('notifications.studyStreak', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Thành tích</Label>
                    <p className="text-sm text-gray-500">Thông báo khi đạt được thành tích mới</p>
                  </div>
                  <Switch
                    checked={settings.notifications.achievements}
                    onCheckedChange={(checked) => updateSetting('notifications.achievements', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Báo cáo hàng tuần</Label>
                    <p className="text-sm text-gray-500">Tổng kết tiến độ học tập hàng tuần</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) => updateSetting('notifications.weeklyReport', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button onClick={saveSettings} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Save size={16} className="mr-2" />
          Lưu cài đặt
        </Button>
        <Button onClick={resetToDefaults} variant="outline">
          <RotateCcw size={16} className="mr-2" />
          Khôi phục mặc định
        </Button>
      </div>

      {/* Info */}
      <Card className="mt-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4 text-center">
          <p className="text-blue-800 text-sm">
            💡 Cài đặt sẽ được lưu tự động và áp dụng ngay lập tức cho toàn bộ ứng dụng.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
