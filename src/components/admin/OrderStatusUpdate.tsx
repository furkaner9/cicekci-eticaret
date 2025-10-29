'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Loader2, Save, XCircle } from 'lucide-react'

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'pending', label: 'Beklemede', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Onaylandı', color: 'bg-blue-500' },
  { value: 'preparing', label: 'Hazırlanıyor', color: 'bg-purple-500' },
  { value: 'shipping', label: 'Kargoda', color: 'bg-indigo-500' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'bg-green-500' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-500' }
]

export default function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  const handleUpdateStatus = async () => {
    if (status === currentStatus) {
      toast.info('Değişiklik Yok', {
        description: 'Sipariş durumu zaten bu şekilde.',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Güncelleme başarısız')
      }

      toast.success('Durum Güncellendi', {
        description: `Sipariş durumu "${statusOptions.find(s => s.value === status)?.label}" olarak güncellendi.`,
      })

      router.refresh()
    } catch (error) {
      toast.error('Hata', {
        description: 'Durum güncellenirken bir hata oluştu.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    setIsCancelling(true)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('İptal başarısız')
      }

      toast.success('Sipariş İptal Edildi', {
        description: 'Sipariş başarıyla iptal edildi ve stoklar geri yüklendi.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Hata', {
        description: 'Sipariş iptal edilirken bir hata oluştu.',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sipariş Durumu</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleUpdateStatus}
        disabled={isLoading || status === currentStatus}
        className="w-full bg-pink-600 hover:bg-pink-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Güncelleniyor...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Durumu Güncelle
          </>
        )}
      </Button>

      {currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Veya
              </span>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İptal Ediliyor...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Siparişi İptal Et
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Siparişi iptal etmek istediğinize emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem sipariş durumunu "İptal Edildi" olarak güncelleyecek ve 
                  ürün stoklarını geri yükleyecektir. Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelOrder}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Evet, İptal Et
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Durum Bilgilendirmesi */}
      <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
        <p className="font-semibold">Durum Açıklamaları:</p>
        <ul className="space-y-0.5 text-muted-foreground">
          <li>• <strong>Beklemede:</strong> Sipariş alındı, işleme alınmayı bekliyor</li>
          <li>• <strong>Onaylandı:</strong> Sipariş onaylandı</li>
          <li>• <strong>Hazırlanıyor:</strong> Ürünler hazırlanıyor</li>
          <li>• <strong>Kargoda:</strong> Sipariş kargoya verildi</li>
          <li>• <strong>Teslim Edildi:</strong> Müşteriye teslim edildi</li>
          <li>• <strong>İptal Edildi:</strong> Sipariş iptal edildi</li>
        </ul>
      </div>
    </div>
  )
}