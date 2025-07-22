'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('chinese-app-settings');
    if (savedTheme) {
      try {
        const settings = JSON.parse(savedTheme);
        if (settings.theme) {
          setTheme(settings.theme);
          applyTheme(settings.theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage
    const existingSettings = localStorage.getItem('chinese-app-settings');
    let settings = {};
    
    if (existingSettings) {
      try {
        settings = JSON.parse(existingSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    
    settings.theme = newTheme;
    localStorage.setItem('chinese-app-settings', JSON.stringify(settings));
  };

  return { theme, updateTheme, applyTheme };
}

export function useAccessibility() {
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false
  });

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem('chinese-app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.accessibility) {
          setSettings(parsed.accessibility);
          applyAccessibilitySettings(parsed.accessibility);
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }

    // Listen for system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      if (e.matches) {
        updateSettings({ ...settings, reduceMotion: true });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyAccessibilitySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--font-size-multiplier', 
      newSettings.fontSize === 'small' ? '0.875' :
      newSettings.fontSize === 'large' ? '1.125' : '1'
    );
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (newSettings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    // Save to localStorage
    const existingSettings = localStorage.getItem('chinese-app-settings');
    let allSettings = {};
    
    if (existingSettings) {
      try {
        allSettings = JSON.parse(existingSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    
    allSettings.accessibility = newSettings;
    localStorage.setItem('chinese-app-settings', JSON.stringify(allSettings));
  };

  return { settings, updateSettings, applyAccessibilitySettings };
}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue, loading];
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Performance monitoring hook
export function usePerformance() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });

  useEffect(() => {
    // Measure page load time
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart
      }));
    }

    // Measure largest contentful paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.startTime
          }));
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
}

// Navigation hook for fixed positioning
export function useFixedNavigation() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 100); // Fix navigation after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isFixed;
}

// Mobile responsive hook
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
