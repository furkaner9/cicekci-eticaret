'use client'

import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner' // ✅ Sonner toast import
import { useCartStore } from '@/store/cart'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    addItem(product, 1)
    toast.success('Sepete Eklendi! 🎉', {
      description: `${product.name} sepetinize eklendi.`,
      duration: 3000,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    if (isFavorite) {
      toast('Favorilerden Çıkarıldı', {
        description: `${product.name} favorilerinizden çıkarıldı.`,
        duration: 2000,
      })
    } else {
      toast.success('Favorilere Eklendi ❤️', {
        description: `${product.name} favorilerinize eklendi.`,
        duration: 2000,
      })
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/urun/${product.slug}`}>
        <div className="relative bg-muted h-64 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🌸</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-pink-600 hover:bg-pink-700">Öne Çıkan</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive">Tükendi</Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge
                variant="secondary"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                Son {product.stock} Ürün
              </Badge>
            )}
          </div>

          {/* Favori Butonu */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleFavorite}
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-pink-600 text-pink-600' : ''}
            />
          </Button>

          {/* Stok Tükendi Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Stokta Yok
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-pink-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        {product.category && (
          <Link href={`/kategori/${product.category.slug}`}>
            <Badge variant="outline" className="hover:bg-pink-50">
              {product.category.name}
            </Badge>
          </Link>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-pink-600">
          ₺{product.price.toFixed(2)}
        </span>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Sepete Ekle
        </Button>
      </CardFooter>
    </Card>
  )
}
