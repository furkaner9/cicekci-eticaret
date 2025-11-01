'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/reviews/StarRating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Search } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchReviews();
    }
  }, [status, session]);

  useEffect(() => {
    // Arama filtresi
    if (searchTerm) {
      const filtered = reviews.filter(
        (review) =>
          review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews);
    }
  }, [searchTerm, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setFilteredReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Yorumlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Yorum silindi');
        fetchReviews();
      } else {
        toast.error('Yorum silinirken hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Yorum Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Toplam {reviews.length} yorum
          </p>
        </div>

        {/* Arama */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Kullanıcı, ürün veya yorum ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tablo */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz yorum yok'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Ürün</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead className="max-w-xs">Yorum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {review.user.email}
                      </p>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          ✓ Doğrulanmış Alıcı
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/urun/${review.product.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {review.product.name}
                    </a>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} size="sm" />
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {review.title && (
                      <p className="font-medium text-sm mb-1">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Sil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}