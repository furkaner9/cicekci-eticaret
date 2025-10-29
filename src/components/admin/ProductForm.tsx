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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Category } from '@/types'
import { Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'

const productSchema = z.object({
  name: z.string().min(3, 'Ürün adı en az 3 karakter olmalıdır'),
  slug: z.string().min(3, 'Slug en az 3 karakter olmalıdır').regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içermelidir'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Fiyat 0\'dan büyük bir sayı olmalıdır',
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stok 0 veya daha büyük bir sayı olmalıdır',
  }),
  categoryId: z.string().min(1, 'Kategori seçmelisiniz'),
  image: z.string().optional(),
  featured: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  categories: Category[]
  initialData?: any
  isEdit?: boolean
}

export default function ProductForm({ categories, initialData, isEdit = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialData?.image || '')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description,
      price: initialData.price.toString(),
      stock: initialData.stock.toString(),
      categoryId: initialData.categoryId,
      image: initialData.image || '',
      featured: initialData.featured || false,
    } : {
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      image: '',
      featured: false,
    },
  })

  const featured = watch('featured')

  // Ürün adından otomatik slug oluştur
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!isEdit) {
      const slug = name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }

  const handleImageChange = (url: string) => {
    setImageUrl(url)
    setValue('image', url)
  }

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true)

    try {
      const url = isEdit 
        ? `/api/products/${initialData.slug}` 
        : '/api/products'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          images: [],
        }),
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      toast.success(isEdit ? 'Ürün Güncellendi' : 'Ürün Eklendi', {
        description: isEdit 
          ? `${data.name} başarıyla güncellendi.`
          : `${data.name} başarıyla eklendi.`,
      })

      router.push('/admin/urunler')
      router.refresh()
    } catch (error) {
      toast.error('Hata', {
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Ürün Adı */}
      <div className="space-y-2">
        <Label htmlFor="name">Ürün Adı *</Label>
        <Input
          id="name"
          {...register('name')}
          onChange={(e) => {
            register('name').onChange(e)
            handleNameChange(e)
          }}
          placeholder="Örn: Kırmızı Gül Buketi"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register('slug')}
          placeholder="Örn: kirmizi-gul-buketi"
          disabled={isEdit}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          URL'de kullanılacak benzersiz isim. Düzenleme sırasında değiştirilemez.
        </p>
      </div>

      {/* Açıklama */}
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Ürün hakkında detaylı açıklama yazın..."
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fiyat */}
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price')}
            placeholder="299.99"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Stok */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stok Miktarı *</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock')}
            placeholder="50"
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">Kategori *</Label>
        <Select
          onValueChange={(value) => setValue('categoryId', value)}
          defaultValue={initialData?.categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Görsel Yükleme */}
      <div className="space-y-2">
        <Label>Ürün Görseli</Label>
        <ImageUpload 
          value={imageUrl}
          onChange={handleImageChange}
        />
      </div>

      {/* Öne Çıkan */}
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={featured}
          onCheckedChange={(checked) => setValue('featured', checked)}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Öne çıkan ürün olarak işaretle
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
          {isEdit ? 'Güncelle' : 'Ürün Ekle'}
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