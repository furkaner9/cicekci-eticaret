// components/reviews/ReviewCard.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import StarRating from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner'; // <- değişiklik burada

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { data: session } = useSession();
  const [helpful, setHelpful] = useState(review.helpfulCount);
  const [notHelpful, setNotHelpful] = useState(review.notHelpfulCount);
  const [voted, setVoted] = useState(false);

  const handleVote = async (action: 'helpful' | 'notHelpful') => {
    if (voted) {
      toast('Zaten oy kullandınız'); // <- use-toast yerine
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        if (action === 'helpful') {
          setHelpful((prev) => prev + 1);
        } else {
          setNotHelpful((prev) => prev + 1);
        }
        setVoted(true);
        toast.success('Oyunuz kaydedildi'); // <- use-toast yerine
      } else {
        const error = await response.json();
        toast.error(error.error || 'Bir hata oluştu'); // <- use-toast yerine
      }
    } catch (error) {
      toast.error('Bir hata oluştu'); // <- use-toast yerine
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Üst Kısım - Kullanıcı Bilgisi */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={review.user.image} alt={review.user.name} />
            <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{review.user.name}</h4>
              {review.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Doğrulanmış Alıcı
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Başlık */}
      {review.title && (
        <h3 className="font-semibold text-lg">{review.title}</h3>
      )}

      {/* Yorum */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Alt Kısım - Faydalı mı? */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <span className="text-sm text-gray-600">Bu yorum faydalı mı?</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('helpful')}
            disabled={voted || !session}
            className="gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            {helpful > 0 && <span>{helpful}</span>}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleVote('notHelpful')}
            disabled={voted || !session}
            className="gap-2"
          >
            <ThumbsDown className="w-4 h-4" />
            {notHelpful > 0 && <span>{notHelpful}</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
