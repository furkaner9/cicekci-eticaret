// components/checkout/CouponInput.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tag, X } from 'lucide-react';

interface CouponInputProps {
  subtotal: number;
  onCouponApply: (coupon: AppliedCoupon | null) => void;
  appliedCoupon: AppliedCoupon | null;
}

export interface AppliedCoupon {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  description?: string;
}

export default function CouponInput({
  subtotal,
  onCouponApply,
  appliedCoupon,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!couponCode.trim()) {
      toast.error('Lütfen kupon kodu girin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCouponApply(data.coupon);
        toast.success(`Kupon uygulandı! ${data.coupon.discountAmount.toFixed(2)} ₺ indirim`);
        setCouponCode('');
      } else {
        toast.error(data.error || 'Kupon geçersiz');
      }
    } catch (error) {
      toast.error('Kupon kontrol edilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onCouponApply(null);
    setCouponCode('');
    toast.success('Kupon kaldırıldı');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Tag className="text-green-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">Kupon Uygulandı:</span>
                <Badge className="bg-green-600">
                  {appliedCoupon.code}
                </Badge>
              </div>
              {appliedCoupon.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {appliedCoupon.description}
                </p>
              )}
              <p className="text-sm font-medium text-green-700">
                İndirim: -{appliedCoupon.discountAmount.toFixed(2)} ₺
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={18} className="text-gray-600" />
        <span className="font-medium">İndirim Kuponu</span>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Kupon kodunu girin"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          disabled={loading}
        />
        <Button
          onClick={handleApply}
          disabled={loading || !couponCode.trim()}
        >
          {loading ? 'Kontrol...' : 'Uygula'}
        </Button>
      </div>
    </div>
  );
}