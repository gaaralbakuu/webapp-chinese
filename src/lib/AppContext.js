'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    correctAnswers: 0,
    accuracy: 0,
    hskStats: {
      HSK1: { correct: 0, total: 0 },
      HSK2: { correct: 0, total: 0 },
      HSK3: { correct: 0, total: 0 },
      HSK4: { correct: 0, total: 0 },
      HSK5: { correct: 0, total: 0 }
    }
  });
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: '',
    targetLevel: 'HSK1',
    dailyGoal: 10,
    totalStudyTime: 0
  });
  const [studyProgress, setStudyProgress] = useState({
    HSK1: { learned: [], mastered: [] },
    HSK2: { learned: [], mastered: [] },
    HSK3: { learned: [], mastered: [] },
    HSK4: { learned: [], mastered: [] },
    HSK5: { learned: [], mastered: [] }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem('chinese-app-favorites');
        const savedLearnedWords = localStorage.getItem('chinese-app-learned');
        const savedQuizStats = localStorage.getItem('chinese-app-quiz-stats');
        const savedStudyStreak = localStorage.getItem('chinese-app-study-streak');
        const savedLastStudyDate = localStorage.getItem('chinese-app-last-study-date');
        const savedUserProfile = localStorage.getItem('chinese-app-user-profile');
        const savedStudyProgress = localStorage.getItem('chinese-app-study-progress');

        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        if (savedLearnedWords) {
          setLearnedWords(JSON.parse(savedLearnedWords));
        }
        if (savedQuizStats) {
          setQuizStats(JSON.parse(savedQuizStats));
        }
        if (savedStudyStreak) {
          setStudyStreak(parseInt(savedStudyStreak));
        }
        if (savedLastStudyDate) {
          setLastStudyDate(savedLastStudyDate);
        }
        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile));
        }
        if (savedStudyProgress) {
          setStudyProgress(JSON.parse(savedStudyProgress));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-learned', JSON.stringify(learnedWords));
    }
  }, [learnedWords]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-quiz-stats', JSON.stringify(quizStats));
    }
  }, [quizStats]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-study-streak', studyStreak.toString());
    }
  }, [studyStreak]);

  useEffect(() => {
    if (typeof window !== 'undefined' && lastStudyDate) {
      localStorage.setItem('chinese-app-last-study-date', lastStudyDate);
    }
  }, [lastStudyDate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-user-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chinese-app-study-progress', JSON.stringify(studyProgress));
    }
  }, [studyProgress]);

  const toggleFavorite = (wordId) => {
    setFavorites(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const markAsLearned = (wordId, hskLevel) => {
    if (!learnedWords.includes(wordId)) {
      setLearnedWords(prev => [...prev, wordId]);
      
      // Update HSK-specific progress
      if (hskLevel) {
        setStudyProgress(prev => ({
          ...prev,
          [hskLevel]: {
            ...prev[hskLevel],
            learned: [...prev[hskLevel].learned, wordId]
          }
        }));
      }
      
      // Update study date and streak
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastStudyDate === yesterday) {
        setStudyStreak(prev => prev + 1);
      } else if (lastStudyDate !== today) {
        setStudyStreak(1);
      }
      setLastStudyDate(today);
    }
  };

  const markAsMastered = (wordId, hskLevel) => {
    if (hskLevel) {
      setStudyProgress(prev => ({
        ...prev,
        [hskLevel]: {
          ...prev[hskLevel],
          mastered: prev[hskLevel].mastered.includes(wordId) 
            ? prev[hskLevel].mastered 
            : [...prev[hskLevel].mastered, wordId]
        }
      }));
    }
  };

  const updateQuizStats = (correct, total, hskLevel = null) => {
    setQuizStats(prev => {
      const newCorrect = prev.correctAnswers + correct;
      const newTotal = prev.totalQuizzes + total;
      const newStats = {
        totalQuizzes: newTotal,
        correctAnswers: newCorrect,
        accuracy: Math.round((newCorrect / newTotal) * 100) || 0,
        hskStats: { ...prev.hskStats }
      };

      // Update HSK-specific stats
      if (hskLevel) {
        newStats.hskStats[hskLevel] = {
          correct: prev.hskStats[hskLevel].correct + correct,
          total: prev.hskStats[hskLevel].total + total
        };
      }

      return newStats;
    });
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const addStudyTime = (minutes) => {
    setUserProfile(prev => ({
      ...prev,
      totalStudyTime: prev.totalStudyTime + minutes
    }));
  };

  const resetStreak = () => {
    setStudyStreak(0);
  };

  const clearAllData = () => {
    if (typeof window !== 'undefined') {
      const keys = [
        'chinese-app-favorites',
        'chinese-app-learned',
        'chinese-app-quiz-stats',
        'chinese-app-study-streak',
        'chinese-app-last-study-date',
        'chinese-app-user-profile',
        'chinese-app-study-progress'
      ];
      keys.forEach(key => localStorage.removeItem(key));
    }
    
    setFavorites([]);
    setLearnedWords([]);
    setQuizStats({
      totalQuizzes: 0,
      correctAnswers: 0,
      accuracy: 0,
      hskStats: {
        HSK1: { correct: 0, total: 0 },
        HSK2: { correct: 0, total: 0 },
        HSK3: { correct: 0, total: 0 },
        HSK4: { correct: 0, total: 0 },
        HSK5: { correct: 0, total: 0 }
      }
    });
    setStudyStreak(0);
    setLastStudyDate(null);
    setUserProfile({
      name: '',
      targetLevel: 'HSK1',
      dailyGoal: 10,
      totalStudyTime: 0
    });
    setStudyProgress({
      HSK1: { learned: [], mastered: [] },
      HSK2: { learned: [], mastered: [] },
      HSK3: { learned: [], mastered: [] },
      HSK4: { learned: [], mastered: [] },
      HSK5: { learned: [], mastered: [] }
    });
  };

  const value = {
    favorites,
    learnedWords,
    quizStats,
    studyStreak,
    lastStudyDate,
    userProfile,
    studyProgress,
    toggleFavorite,
    markAsLearned,
    markAsMastered,
    updateQuizStats,
    updateUserProfile,
    addStudyTime,
    resetStreak,
    clearAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
