'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { MapPin, Edit, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  isDefault: boolean
}

interface AddressCardProps {
  address: Address
}

export default function AddressCard({ address }: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/addresses/${address.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme başarısız')
      }

      toast.success('Adres Silindi', {
        description: 'Adres başarıyla silindi.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Hata', {
        description: 'Adres silinirken bir hata oluştu.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetDefault = async () => {
    if (address.isDefault) return

    setIsSettingDefault(true)

    try {
      const response = await fetch(`/api/addresses/${address.id}/default`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Varsayılan yapma başarısız')
      }

      toast.success('Varsayılan Adres Değişti', {
        description: 'Bu adres varsayılan adres olarak ayarlandı.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Hata', {
        description: 'Adres güncellenirken bir hata oluştu.',
      })
    } finally {
      setIsSettingDefault(false)
    }
  }

  return (
    <Card className={`relative ${address.isDefault ? 'border-pink-600 border-2' : ''}`}>
      {address.isDefault && (
        <Badge className="absolute top-4 right-4 bg-pink-600">
          Varsayılan
        </Badge>
      )}
      
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{address.title}</h3>
              <p className="text-sm font-medium mb-1">{address.fullName}</p>
              <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
              <p className="text-sm">
                {address.address}
                <br />
                {address.district} / {address.city}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                disabled={isSettingDefault}
                className="flex-1"
              >
                <Star size={16} className="mr-1" />
                Varsayılan Yap
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={`/hesabim/adreslerim/${address.id}`}>
                <Edit size={16} className="mr-1" />
                Düzenle
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                >
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Adresi silmek istediğinize emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>{address.title}</strong> adresi kalıcı olarak silinecektir. 
                    Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}