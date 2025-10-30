// components/reviews/StarRating.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const fillPercentage = interactive
            ? hoverRating >= starValue || rating >= starValue
              ? 100
              : 0
            : Math.min(Math.max((rating - index) * 100, 0), 100);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`
                relative ${sizeClasses[size]}
                ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
                disabled:cursor-default
              `}
            >
              {/* Background star (gray) */}
              <Star
                className={`absolute inset-0 ${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
              />
              
              {/* Foreground star (yellow) with clip-path */}
              <div
                style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
                className="absolute inset-0"
              >
                <Star
                  className={`${sizeClasses[size]} text-yellow-400`}
                  fill="currentColor"
                />
              </div>
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}