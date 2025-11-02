'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Copy } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '0',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchCoupons();
    }
  }, [status, session]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Kuponlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      
      const method = editingCoupon ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingCoupon ? 'Kupon güncellendi' : 'Kupon oluşturuldu');
        setModalOpen(false);
        resetForm();
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      description: coupon.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Kupon silindi');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (response.ok) {
        toast.success(coupon.isActive ? 'Kupon pasif edildi' : 'Kupon aktif edildi');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '0',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Kupon kodu kopyalandı');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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
          <h1 className="text-3xl font-bold">Kupon Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Toplam {coupons.length} kupon
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Kupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon Oluştur'}
              </DialogTitle>
              <DialogDescription>
                İndirim kuponu oluşturun veya düzenleyin
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Kupon Kodu */}
              <div className="space-y-2">
                <Label htmlFor="code">Kupon Kodu *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  required
                />
              </div>

              {/* İndirim Türü ve Değeri */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">İndirim Türü *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Yüzde (%)</SelectItem>
                      <SelectItem value="fixed">Sabit Tutar (₺)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    İndirim Değeri * {formData.discountType === 'percentage' ? '(%)' : '(₺)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Minimum Sepet ve Maksimum İndirim */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Minimum Sepet (₺)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">Maksimum İndirim (₺)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      step="0.01"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="Sınırsız"
                    />
                  </div>
                )}
              </div>

              {/* Kullanım Limiti */}
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Kullanım Limiti</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="Sınırsız"
                />
              </div>

              {/* Geçerlilik Tarihleri */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kupon açıklaması..."
                  rows={3}
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCoupon ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tablo */}
      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Henüz kupon oluşturulmamış</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kupon Kodu</TableHead>
                <TableHead>İndirim</TableHead>
                <TableHead>Min. Sepet</TableHead>
                <TableHead>Kullanım</TableHead>
                <TableHead>Geçerlilik</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold">{coupon.code}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCode(coupon.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {coupon.description && (
                      <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage'
                      ? `%${coupon.discountValue}`
                      : `${coupon.discountValue} ₺`}
                  </TableCell>
                  <TableCell>{coupon.minPurchase} ₺</TableCell>
                  <TableCell>
                    {coupon.usageLimit
                      ? `${coupon.usedCount}/${coupon.usageLimit}`
                      : `${coupon.usedCount}/∞`}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{formatDate(coupon.startDate)}</div>
                    <div>{formatDate(coupon.endDate)}</div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(coupon)}
                    >
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(coupon.id)}
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