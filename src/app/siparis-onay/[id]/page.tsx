import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CheckCircle2, Package, Clock, MapPin, CreditCard, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id }
  })
  
  return order
}

interface OrderConfirmPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderConfirmPage({ params }: OrderConfirmPageProps) {
  const { id } = await params
  const order = await getOrder(id)
  
  if (!order) {
    notFound()
  }

  const items = order.items as any[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başarı Mesajı */}
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-8 pb-8 text-center">
            <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı! 🎉</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu.
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="text-sm text-muted-foreground">Sipariş Numaranız:</span>
              <span className="text-xl font-bold text-pink-600">{order.orderNumber}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sipariş Detayları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Teslimat Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Teslimat Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Alıcı</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teslimat Adresi</p>
                <p className="font-medium">
                  {order.deliveryAddress}
                  <br />
                  {order.deliveryDistrict} / {order.deliveryCity}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teslimat Tarihi & Saati</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <p className="font-medium">
                    {format(new Date(order.deliveryDate), 'dd MMMM yyyy', { locale: tr })}
                    {' - '}
                    {order.deliveryTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* İletişim & Ödeme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} />
                İletişim & Ödeme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">E-posta</p>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ödeme Yöntemi</p>
                <Badge variant="outline" className="mt-1">
                  {order.paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 'Kredi Kartı'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sipariş Durumu</p>
                <Badge className="mt-1 bg-yellow-500">
                  Beklemede
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sipariş Özeti */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Sipariş Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ürünler */}
              {items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-muted rounded flex-shrink-0 overflow-hidden">
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
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Miktar: {item.quantity}
                    </p>
                    {item.message && (
                      <p className="text-sm text-pink-600 mt-1">
                        💌 "{item.message}"
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₺{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Fiyat Özeti */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span>₺{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span className="text-pink-600">₺{order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sipariş Notu:</p>
                    <p className="text-sm bg-muted p-3 rounded">{order.notes}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bilgilendirme */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">📧 Onay E-postası Gönderildi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sipariş detaylarınız <strong>{order.customerEmail}</strong> adresine gönderildi. 
              Lütfen spam klasörünüzü kontrol etmeyi unutmayın.
            </p>
            <h3 className="font-semibold mb-2">📞 Müşteri Hizmetleri</h3>
            <p className="text-sm text-muted-foreground">
              Sorularınız için bizi 0555 123 45 67 numarasından arayabilir veya 
              info@cicekci.com adresine e-posta gönderebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1 bg-pink-600 hover:bg-pink-700">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/urunler">Alışverişe Devam Et</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}