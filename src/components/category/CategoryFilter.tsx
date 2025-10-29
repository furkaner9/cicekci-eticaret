'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface CategoryFilterProps {
  categories: Category[]
  currentCategory: string
  productCount: number
}

export default function CategoryFilter({ 
  categories, 
  currentCategory,
  productCount 
}: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState<number[]>([
    parseFloat(searchParams.get('minPrice') || '0'),
    parseFloat(searchParams.get('maxPrice') || '1000')
  ])

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString())
    } else {
      params.delete('minPrice')
    }
    
    if (priceRange[1] < 1000) {
      params.set('maxPrice', priceRange[1].toString())
    } else {
      params.delete('maxPrice')
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(pathname)
    setPriceRange([0, 1000])
  }

  const hasActiveFilters = searchParams.get('minPrice') || searchParams.get('maxPrice')

  return (
    <div className="space-y-6">
      {/* Kategoriler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategoriler</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/urun"
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition ${
                  currentCategory === 'all'
                    ? 'bg-pink-100 text-pink-600 font-medium'
                    : 'hover:bg-muted'
                }`}
              >
                <span>Tüm Ürünler</span>
                <Badge variant={currentCategory === 'all' ? 'default' : 'secondary'}>
                  {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
                </Badge>
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  href={`/kategori/${category.slug}`}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition ${
                    category.slug === currentCategory
                      ? 'bg-pink-100 text-pink-600 font-medium'
                      : 'hover:bg-muted'
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge 
                    variant={category.slug === currentCategory ? 'default' : 'secondary'}
                    className={category.slug === currentCategory ? 'bg-pink-600' : ''}
                  >
                    {category._count.products}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Fiyat Filtresi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fiyat Aralığı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>₺{priceRange[0]}</span>
              <span>₺{priceRange[1]}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs">Min</Label>
              <Input
                id="minPrice"
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs">Max</Label>
              <Input
                id="maxPrice"
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 1000])}
                className="h-8"
              />
            </div>
          </div>

          <Button 
            onClick={handlePriceFilter}
            className="w-full bg-pink-600 hover:bg-pink-700"
            size="sm"
          >
            Filtrele
          </Button>
        </CardContent>
      </Card>

      {/* Aktif Filtreler */}
      {hasActiveFilters && (
        <>
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium mb-3">Aktif Filtreler:</p>
                {searchParams.get('minPrice') && (
                  <Badge variant="secondary" className="mr-2">
                    Min: ₺{searchParams.get('minPrice')}
                  </Badge>
                )}
                {searchParams.get('maxPrice') && (
                  <Badge variant="secondary">
                    Max: ₺{searchParams.get('maxPrice')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
            size="sm"
          >
            <X size={16} className="mr-2" />
            Filtreleri Temizle
          </Button>
        </>
      )}

      {/* Bilgi Kartı */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="pt-6">
          <p className="text-sm text-pink-800">
            💐 <strong>Ücretsiz Kargo</strong> tüm siparişlerde geçerlidir!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}