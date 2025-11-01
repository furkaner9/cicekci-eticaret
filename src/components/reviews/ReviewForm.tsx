'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  productSlug: string; // EKLENDI
  productName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  productId,
  productSlug,
  productName,
  onSuccess,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    if (formData.rating === 0) {
      toast.error('Lütfen bir puan seçin');
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Yorumunuz en az 10 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      // SLUG kullanıyoruz
      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Yorumunuz başarıyla eklendi! 🎉');
        setShowForm(false);
        setFormData({ rating: 0, title: '', comment: '' });
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button
        size="lg"
        onClick={() => {
          if (!session) {
            router.push('/login?redirect=' + window.location.pathname);
            return;
          }
          setShowForm(true);
        }}
        className="w-full sm:w-auto"
      >
        ✍️ Yorum Yap
      </Button>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">Ürün Yorumu</h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{productName}</span> için yorumunuzu paylaşın
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(false)}
        >
          ✕
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Puan */}
        <div className="space-y-2">
          <Label>Puanınız *</Label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={formData.rating}
              size="lg"
              interactive
              onRatingChange={(rating) =>
                setFormData({ ...formData, rating })
              }
            />
            {formData.rating > 0 && (
              <span className="text-sm text-gray-600">
                {formData.rating} / 5 Yıldız
              </span>
            )}
          </div>
        </div>

        {/* Başlık */}
        <div className="space-y-2">
          <Label htmlFor="title">Başlık (Opsiyonel)</Label>
          <Input
            id="title"
            placeholder="Örn: Harika bir ürün"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            maxLength={100}
          />
        </div>

        {/* Yorum */}
        <div className="space-y-2">
          <Label htmlFor="comment">Yorumunuz *</Label>
          <Textarea
            id="comment"
            placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            rows={5}
            minLength={10}
            maxLength={1000}
            required
          />
          <p className="text-xs text-gray-500">
            {formData.comment.length} / 1000 karakter
          </p>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Yorumunuz, yönetici onayından sonra yayınlanacaktır.
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
          >
            İptal
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
          </Button>
        </div>
      </form>
    </div>
  );
}