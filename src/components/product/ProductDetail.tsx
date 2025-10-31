'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  Package,
  MessageSquare,
  Calendar
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import ProductCard from './ProductCard'
import MessageCardDialog from './MessageCardDialog'
import ReviewList from '@/components/reviews/ReviewList'
import FavoriteButton from '@/components/FavoriteButton'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = (message?: string) => {
    addItem(product, quantity, message)
    toast.success(`${quantity} adet ${product.name} sepetinize eklendi.`)
  }

  const handleAddToCartWithMessage = () => {
    setIsMessageDialogOpen(true)
  }

  const handleMessageSubmit = (message: string) => {
    handleAddToCart(message)
    setIsMessageDialogOpen(false)
  }

  const images = [product.image, ...product.images].filter(Boolean)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-pink-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urun" className="hover:text-pink-600">Ürünler</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/kategori/${product.category.slug}`} className="hover:text-pink-600">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Ürün Görselleri */}
        <div className="space-y-4">
          {/* Ana Görsel */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted h-96 lg:h-[500px] relative">
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl">🌸</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-pink-600">Öne Çıkan</Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive">Tükendi</Badge>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      Son {product.stock} Ürün
                    </Badge>
                  )}
                </div>

                {/* Favori Butonu */}
                <div className="absolute top-4 right-4">
                  <FavoriteButton productId={product.id} size="md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Görseller */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`border-2 rounded-lg overflow-hidden transition ${
                    selectedImage === img 
                      ? 'border-pink-600' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="bg-muted h-20">
                    {img ? (
                      <img 
                        src={img} 
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🌸
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <Link href={`/kategori/${product.category.slug}`}>
                <Badge variant="outline" className="hover:bg-pink-50">
                  {product.category.name}
                </Badge>
              </Link>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-pink-600">
              ₺{product.price.toFixed(2)}
            </span>
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <Separator />

          {/* Miktar Seçimi */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Miktar</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </Button>
                <span className="w-16 text-center text-xl font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  (Stok: {product.stock} adet)
                </span>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                onClick={() => handleAddToCart()}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Sepete Ekle
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1"
                onClick={handleAddToCartWithMessage}
                disabled={product.stock === 0}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Mesaj Kartı ile Ekle
              </Button>
            </div>
          </div>

          <Separator />

          {/* Özellikler */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Truck className="text-pink-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Hızlı Kargo</p>
                  <p className="text-xs text-muted-foreground">Aynı gün teslimat</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Shield className="text-pink-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Güvenli Ödeme</p>
                  <p className="text-xs text-muted-foreground">%100 güvenli</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Package className="text-pink-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Özel Paket</p>
                  <p className="text-xs text-muted-foreground">Özenle paketlenir</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Detaylı Bilgiler - Tabs (YENİ: Yorumlar eklendi) */}
      <Card className="mb-16">
        <CardContent className="p-6">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Açıklama</TabsTrigger>
              <TabsTrigger value="delivery">Teslimat</TabsTrigger>
              <TabsTrigger value="care">Bakım</TabsTrigger>
              <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg">Ürün Açıklaması</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Taptaze çiçeklerimiz, özenle seçilip profesyonel floristler tarafından hazırlanır. 
                Her buket, sevdiklerinize özel bir hediye olacak şekilde tasarlanır ve özel 
                ambalajıyla teslim edilir.
              </p>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg">Teslimat Bilgileri</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Calendar className="text-pink-600 flex-shrink-0 mt-1" size={18} />
                  <span>Aynı gün teslimat: Saat 14:00'e kadar verilen siparişler aynı gün teslim edilir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="text-pink-600 flex-shrink-0 mt-1" size={18} />
                  <span>Ücretsiz kargo: Tüm siparişlerde kargo ücretsizdir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="text-pink-600 flex-shrink-0 mt-1" size={18} />
                  <span>Özel ambalaj: Ürünleriniz özel ambalajıyla güvenli şekilde paketlenir.</span>
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="care" className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg">Çiçek Bakım Önerileri</h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Çiçekleri serin ve havadar bir ortamda muhafaza edin.</li>
                <li>Vazoya temiz, ılık su koyun ve her gün suyu değiştirin.</li>
                <li>Çiçeklerin saplarını her gün çapraz olarak kesin.</li>
                <li>Doğrudan güneş ışığından ve ısı kaynaklarından uzak tutun.</li>
                <li>Solmuş yaprak ve çiçekleri düzenli olarak temizleyin.</li>
              </ul>
            </TabsContent>

            {/* YENİ: Yorumlar Tab */}
            <TabsContent value="reviews" className="mt-6">
              <ReviewList productId={product.id} productName={product.name} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Benzer Ürünler */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Message Card Dialog */}
      <MessageCardDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        onSubmit={handleMessageSubmit}
        productName={product.name}
      />
    </div>
  )
}