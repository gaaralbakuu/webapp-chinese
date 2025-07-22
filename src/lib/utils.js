import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Performance utilities
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs) {
  return Promise.all(srcs.map(preloadImage));
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading utility
export function createIntersectionObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// SEO utilities
export function generateStructuredData(type, data) {
  const baseStructure = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return JSON.stringify(baseStructure);
}

export function generateBreadcrumbStructuredData(breadcrumbs) {
  return generateStructuredData("BreadcrumbList", {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  });
}

// Analytics utilities
export function trackEvent(eventName, properties = {}) {
  // In a real app, you would send this to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
}

export function trackPageView(pageName, properties = {}) {
  trackEvent('page_view', {
    page_title: pageName,
    ...properties
  });
}

export function trackLearningProgress(action, data = {}) {
  trackEvent('learning_progress', {
    action,
    ...data
  });
}

// Accessibility utilities
export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.style.display = 'none';
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  document.addEventListener('keydown', handleKeyDown);
  firstFocusableElement?.focus();

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

// Error handling utilities
export function logError(error, context = {}) {
  console.error('Application Error:', error, context);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry, LogRocket, etc.
    // errorTrackingService.captureException(error, { extra: context });
  }
}

// Cache utilities
export function createCache(maxSize = 100) {
  const cache = new Map();

  return {
    get(key) {
      if (cache.has(key)) {
        const value = cache.get(key);
        cache.delete(key);
        cache.set(key, value); // Move to end (most recent)
        return value;
      }
      return null;
    },

    set(key, value) {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },

    clear() {
      cache.clear();
    },

    size() {
      return cache.size;
    }
  };
}

// Format utilities
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(date, locale = 'vi-VN') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatRelativeTime(date, locale = 'vi-VN') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffInDays = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60));
    return rtf.format(diffInHours, 'hour');
  }
  
  return rtf.format(diffInDays, 'day');
}
