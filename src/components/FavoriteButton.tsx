// components/FavoriteButton.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFavoritesStore } from '@/app/store/useFavoritesStore';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({
  productId,
  className = '',
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const favorite = isFavorite(productId);

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
    if (status !== 'authenticated') {
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    const success = await toggleFavorite(productId);

    if (success) {
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      setIsAnimating(false);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          favorite
            ? 'bg-pink-500 text-white hover:bg-pink-600'
            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-pink-500 border border-gray-200'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
        hover:scale-110
        active:scale-95
      `}
      aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          <span className={isAnimating ? 'animate-ping absolute' : ''}>
            {favorite ? '❤️' : '🤍'}
          </span>
          <span>{favorite ? '❤️' : '🤍'}</span>
        </>
      )}
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {favorite ? 'Favorilerimde' : 'Favorilere Ekle'}
        </span>
      )}
    </button>
  );
}