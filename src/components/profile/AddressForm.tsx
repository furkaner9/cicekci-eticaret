'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

// ✅ Zod şeması
const addressSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır'),
  fullName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir giriniz'),
  district: z.string().min(2, 'İlçe giriniz'),
  isDefault: z.boolean().default(false).optional(), // ✅ Tip uyuşmazlığı çözümü
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
  address?: any
  isEdit?: boolean
}

export default function AddressForm({ address, isEdit = false }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          title: address.title,
          fullName: address.fullName,
          phone: address.phone,
          address: address.address,
          city: address.city,
          district: address.district,
          isDefault: address.isDefault ?? false, // ✅ güvenli atama
        }
      : {
          title: '',
          fullName: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          isDefault: false,
        },
  })

  const isDefault = watch('isDefault')

  // ✅ Tipli onSubmit fonksiyonu
  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    setIsLoading(true)

    try {
      const url = isEdit
        ? `/api/addresses/${address.id}`
        : '/api/addresses'

      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'İşlem başarısız')
      }

      toast.success(isEdit ? 'Adres Güncellendi' : 'Adres Eklendi', {
        description: isEdit
          ? `${data.title} adresi başarıyla güncellendi.`
          : `${data.title} adresi başarıyla eklendi.`,
      })

      router.push('/hesabim/adreslerim')
      router.refresh()
    } catch (error: any) {
      toast.error('Hata', {
        description: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Adres Başlığı */}
      <div className="space-y-2">
        <Label htmlFor="title">Adres Başlığı *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Örn: Ev, İş, Annem"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Ad Soyad ve Telefon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Ad Soyad *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Ahmet Yılmaz"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="0555 123 45 67"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Şehir ve İlçe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">İl *</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Bursa"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">İlçe *</Label>
          <Input
            id="district"
            {...register('district')}
            placeholder="Nilüfer"
          />
          {errors.district && (
            <p className="text-sm text-destructive">{errors.district.message}</p>
          )}
        </div>
      </div>

      {/* Açık Adres */}
      <div className="space-y-2">
        <Label htmlFor="address">Açık Adres *</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Mahalle, sokak, bina no, daire no..."
          rows={4}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Varsayılan Adres */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) =>
            setValue('isDefault', checked as boolean)
          }
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Bu adresi varsayılan adres olarak kullan
        </Label>
      </div>

      {/* Butonlar */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-pink-600 hover:bg-pink-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? 'Güncelle' : 'Kaydet'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
