// app/admin/reviews/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StarRating from '@/components/reviews/StarRating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Check, X, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

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
  }, [status, session, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reviews?filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Yorumlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: approved }),
      });

      if (response.ok) {
        toast.success(approved ? 'Yorum onaylandı ✓' : 'Yorum reddedildi');
        fetchReviews();
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
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

        {/* Filtre */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="pending">Onay Bekleyen</SelectItem>
            <SelectItem value="approved">Onaylanmış</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tablo */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Yorum bulunamadı</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Ürün</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {review.user.email}
                      </p>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          ✓ Doğrulanmış
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
                  <TableCell>
                    {review.isApproved ? (
                      <Badge variant="default">Onaylandı</Badge>
                    ) : (
                      <Badge variant="secondary">Bekliyor</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {!review.isApproved && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(review.id, true)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {review.isApproved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(review.id, false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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