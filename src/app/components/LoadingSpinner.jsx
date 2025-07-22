'use client';

export default function LoadingSpinner({ size = 'medium', text = 'Đang tải...' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4`}></div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}

// Skeleton loading component
export function SkeletonLoader({ className = '', lines = 3 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`skeleton h-4 mb-3 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="skeleton h-6 w-3/4 mb-4"></div>
          <div className="skeleton h-4 w-full mb-2"></div>
          <div className="skeleton h-4 w-2/3 mb-4"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      ))}
    </div>
  );
}
