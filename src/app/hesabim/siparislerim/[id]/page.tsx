import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Package, 
  MapPin, 
  Calendar,
  Clock,
  CreditCard,
  Phone,
  Mail,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const statusColors = {
  pending: { label: 'Beklemede', color: 'bg-yellow-500' },
  confirmed: { label: 'Onaylandı', color: 'bg-blue-500' },
  preparing: { label: 'Hazırlanıyor', color: 'bg-purple-500' },
  shipping: { label: 'Kargoda', color: 'bg-indigo-500' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-500' },
  cancelled: { label: 'İptal Edildi', color: 'bg-red-500' }
}

async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { 
      id: orderId,
      userId 
    }
  })
  
  return order
}

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/giris')
  }

  const { id } = await params
  const order = await getOrder(id, session.user.id)
  
  if (!order) {
    notFound()
  }

  const items = order.items as any[]
  const status = statusColors[order.status as keyof typeof statusColors] || statusColors.pending

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sipariş Detayı</h1>
            <p className="text-muted-foreground">
              Sipariş No: <span className="font-semibold">{order.orderNumber}</span>
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/hesabim/siparislerim">← Siparişlerime Dön</Link>
          </Button>
        </div>

        {/* Durum Kartı */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sipariş Durumu</p>
                <Badge className={`${status.color} text-base px-3 py-1`}>
                  {status.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sipariş Tarihi</p>
                <p className="font-semibold">
                  {format(new Date(order.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Toplam Tutar</p>
                <p className="text-2xl font-bold text-pink-600">
                  ₺{order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teslimat Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  Teslimat Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teslimat Adresi</p>
                    <p className="font-medium">
                      {order.deliveryAddress}
                      <br />
                      {order.deliveryDistrict} / {order.deliveryCity}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teslimat Tarihi</p>
                    <p className="font-medium">
                      {format(new Date(order.deliveryDate), 'dd MMMM yyyy', { locale: tr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teslimat Saati</p>
                    <p className="font-medium">{order.deliveryTime}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sipariş Notu</p>
                      <p className="font-medium bg-muted p-3 rounded mt-1">{order.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* İletişim Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Ürünler ve Ödeme */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ödeme Bilgisi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Ödeme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-2">
                  {order.paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 'Kredi Kartı'}
                </p>
                <Badge variant="outline">
                  {order.paymentStatus === 'pending' ? 'Ödeme Bekleniyor' : 'Ödendi'}
                </Badge>
              </CardContent>
            </Card>

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
                  {items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded flex-shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🌸
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ₺{item.product.price.toFixed(2)}
                        </p>
                        {item.message && (
                          <p className="text-xs text-pink-600 mt-1">
                            💌 "{item.message}"
                          </p>
                        )}
                      </div>
                      <div className="text-sm font-semibold">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ara Toplam</span>
                      <span>₺{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kargo</span>
                      <span className="text-green-600">₺{order.shipping.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span className="text-pink-600">₺{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Yardım */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">📞 Yardıma mı ihtiyacınız var?</h3>
            <p className="text-sm text-muted-foreground">
              Siparişinizle ilgili sorularınız için bizi 0555 123 45 67 numarasından 
              arayabilir veya info@cicekci.com adresine e-posta gönderebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}