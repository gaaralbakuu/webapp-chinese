'use client';

import { hskLevels } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HSKSelector({ selectedLevel, onLevelChange, className = "" }) {
  const getColorClasses = (color, isSelected) => {
    const colors = {
      green: isSelected ? 'bg-green-100 border-green-500 text-green-800' : 'border-green-200 hover:bg-green-50',
      blue: isSelected ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-blue-200 hover:bg-blue-50',
      orange: isSelected ? 'bg-orange-100 border-orange-500 text-orange-800' : 'border-orange-200 hover:bg-orange-50',
      purple: isSelected ? 'bg-purple-100 border-purple-500 text-purple-800' : 'border-purple-200 hover:bg-purple-50',
      red: isSelected ? 'bg-red-100 border-red-500 text-red-800' : 'border-red-200 hover:bg-red-50',
    };
    return colors[color] || colors.blue;
  };
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">Chọn cấp độ HSK</h3>
        {/* All levels option */}      <Button
        variant={selectedLevel === null ? "default" : "outline"}
        onClick={() => onLevelChange(null)}
        className={`w-full justify-start h-auto p-3 border-2 transition-all ${
          selectedLevel === null 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
        }`}
      >
        <div className="text-left">
          <div className="font-medium">Tất cả cấp độ</div>
          <div className="text-sm opacity-75">Học từ vựng tất cả các cấp</div>
        </div>
      </Button>      {/* HSK levels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {hskLevels.map((level) => {
          const isSelected = selectedLevel === level.id;
          const levelColors = {
            'HSK1': { 
              bg: 'bg-green-500', 
              border: 'border-green-500', 
              text: 'text-green-700', 
              bgLight: 'bg-green-50', 
              borderLight: 'border-green-300',
              hoverBg: 'hover:bg-green-600',
              hoverBorder: 'hover:border-green-600'
            },
            'HSK2': { 
              bg: 'bg-blue-500', 
              border: 'border-blue-500', 
              text: 'text-blue-700', 
              bgLight: 'bg-blue-50', 
              borderLight: 'border-blue-300',
              hoverBg: 'hover:bg-blue-600',
              hoverBorder: 'hover:border-blue-600'
            },
            'HSK3': { 
              bg: 'bg-orange-500', 
              border: 'border-orange-500', 
              text: 'text-orange-700', 
              bgLight: 'bg-orange-50', 
              borderLight: 'border-orange-300',
              hoverBg: 'hover:bg-orange-600',
              hoverBorder: 'hover:border-orange-600'
            },
            'HSK4': { 
              bg: 'bg-purple-500', 
              border: 'border-purple-500', 
              text: 'text-purple-700', 
              bgLight: 'bg-purple-50', 
              borderLight: 'border-purple-300',
              hoverBg: 'hover:bg-purple-600',
              hoverBorder: 'hover:border-purple-600'
            },
            'HSK5': { 
              bg: 'bg-red-500', 
              border: 'border-red-500', 
              text: 'text-red-700', 
              bgLight: 'bg-red-50', 
              borderLight: 'border-red-300',
              hoverBg: 'hover:bg-red-600',
              hoverBorder: 'hover:border-red-600'
            }
          };
          const colors = levelColors[level.id] || levelColors['HSK1'];
          
          return (            <Button
              key={level.id}
              variant="outline"
              onClick={() => onLevelChange(level.id)}
              className={`h-auto p-3 justify-start flex-col items-start border-2 transition-all hsk-button ${
                isSelected 
                  ? `selected ${colors.bg} ${colors.border} text-white hover:opacity-90` 
                  : `${colors.bgLight} ${colors.borderLight} ${colors.text} hsk-${level.id.slice(-1)}-hover`
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm">{level.name}</span>                <Badge 
                  variant="secondary" 
                  className={`text-xs hsk-badge ${
                    isSelected 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {level.wordCount}
                </Badge>
              </div>
              <div className="text-xs opacity-75">{level.description}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
