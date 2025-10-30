// components/reviews/ReviewList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

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

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{ rating: number; count: number }>;
}

interface ReviewListProps {
  productId: string;
  productName: string;
}

export default function ReviewList({ productId, productName }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [sortBy, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products/${productId}/reviews?sortBy=${sortBy}&page=${page}&limit=5`
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingPercentage = (rating: number) => {
    const item = stats.distribution.find((d) => d.rating === rating);
    if (!item || stats.totalReviews === 0) return 0;
    return (item.count / stats.totalReviews) * 100;
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse border rounded-lg p-6">
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Özet İstatistikler */}
      <div className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl">
        {/* Sol - Genel Puan */}
        <div className="text-center space-y-4">
          <div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} size="lg" />
            <p className="text-sm text-gray-600 mt-2">
              {stats.totalReviews} değerlendirme
            </p>
          </div>
          <ReviewForm
            productId={productId}
            productName={productName}
            onSuccess={fetchReviews}
          />
        </div>

        {/* Sağ - Puan Dağılımı */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              stats.distribution.find((d) => d.rating === rating)?.count || 0;
            const percentage = getRatingPercentage(rating);

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sıralama */}
      <Tabs value={sortBy} onValueChange={setSortBy} className="w-full">
        <TabsList>
          <TabsTrigger value="recent">En Yeni</TabsTrigger>
          <TabsTrigger value="rating">En Yüksek Puan</TabsTrigger>
          <TabsTrigger value="helpful">En Faydalı</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Yorumlar */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 mb-4">Henüz yorum yapılmamış</p>
          <ReviewForm
            productId={productId}
            productName={productName}
            onSuccess={fetchReviews}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Önceki
              </Button>
              <span className="px-4 py-2 text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}