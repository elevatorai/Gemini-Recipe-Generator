
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };
  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-transparent border-current`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
