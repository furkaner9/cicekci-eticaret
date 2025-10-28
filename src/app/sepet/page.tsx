'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId)
    toast.error('Ürün Silindi', {
      description: `${productName} sepetinizden çıkarıldı.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast.info('Sepet Temizlendi', {
      description: 'Tüm ürünler sepetinizden çıkarıldı.',
    })
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number, stock: number) => {
    if (newQuantity > stock) {
      toast.error('Stok Yetersiz', {
        description: `Maksimum ${stock} adet sipariş verebilirsiniz.`,
      })
      return
    }
    updateQuantity(productId, newQuantity)
  }

  // ... Geri kalan kod aynı kalacak
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">
              Henüz sepetinize ürün eklemediniz.
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/urun">Alışverişe Başla</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sepet Ürünleri */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Ürün Görseli */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🌸
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link 
                          href={`/urun/${item.product.slug}`}
                          className="font-semibold hover:text-pink-600 transition"
                        >
                          {item.product.name}
                        </Link>
                        {item.product.category && (
                          <p className="text-sm text-muted-foreground">
                            {item.product.category.name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </Button>
                    </div>

                    {/* Miktar ve Fiyat */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1, item.product.stock)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1, item.product.stock)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          ₺{item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-pink-600">
                          ₺{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Mesaj Kartı */}
                    {item.message && (
                      <Card className="mt-3 border-pink-200 bg-pink-50">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={16} className="text-pink-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-pink-700 mb-1">
                                Mesaj Kartı:
                              </p>
                              <p className="text-sm italic">{item.message}</p>
                            </div>
                            <Badge variant="secondary" className="bg-pink-600 text-white">
                              Ücretsiz
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="w-full"
          >
            Sepeti Temizle
          </Button>
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span className="font-semibold">₺{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span className="font-semibold text-green-600">Ücretsiz</span>
              </div>
              {items.some(item => item.message) && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Mesaj Kartı</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Toplam</span>
                <span className="font-bold text-pink-600">
                  ₺{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon">İndirim Kodu</Label>
                <div className="flex gap-2">
                  <Input id="coupon" placeholder="Kupon kodunuz" />
                  <Button variant="outline">Uygula</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-pink-600 hover:bg-pink-700" size="lg" asChild>
                <Link href="/odeme">
                  Ödeme Yap
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/urun">
                  Alışverişe Devam Et
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}