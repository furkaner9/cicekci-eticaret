// components/reviews/ReviewForm.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner'; // <- değişiklik burada

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onSuccess,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      toast.error('Lütfen bir puan seçin'); // <- use-toast yerine
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Yorumunuz en az 10 karakter olmalıdır'); // <- use-toast yerine
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.'); // <- use-toast yerine
        setOpen(false);
        setFormData({ rating: 0, title: '', comment: '' });
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Bir hata oluştu'); // <- use-toast yerine
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.'); // <- use-toast yerine
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          ✍️ Yorum Yap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ürün Yorumu</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-gray-900">{productName}</span> için
            yorumunuzu paylaşın
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
