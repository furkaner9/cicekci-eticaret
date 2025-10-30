import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Package, Eye, Calendar, CreditCard } from 'lucide-react'
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

async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  
  return orders
}

export default async function MyOrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/hesabim/siparislerim')
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Siparişlerim</h1>
            <p className="text-muted-foreground">
              Tüm siparişlerinizi buradan takip edebilirsiniz
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/hesabim">← Hesabıma Dön</Link>
          </Button>
        </div>

        {/* Siparişler */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusColors[order.status as keyof typeof statusColors] || statusColors.pending
              const items = order.items as any[]
              
              return (
                <Card key={order.id}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          Sipariş No: {order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                        </div>
                      </div>
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Ürünler */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="flex gap-3 p-2 border rounded-lg">
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
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} adet
                              </p>
                            </div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <div className="flex items-center justify-center p-2 border rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">
                              +{items.length - 3} ürün daha
                            </p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Alt Bilgiler */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Package size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Teslimat:</span>
                            <span className="font-medium">
                              {format(new Date(order.deliveryDate), 'dd MMM yyyy', { locale: tr })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Ödeme:</span>
                            <span className="font-medium">
                              {order.paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 'Kredi Kartı'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Toplam</p>
                            <p className="text-2xl font-bold text-pink-600">
                              ₺{order.total.toFixed(2)}
                            </p>
                          </div>
                          <Button variant="outline" asChild>
                            <Link href={`/hesabim/siparislerim/${order.id}`}>
                              <Eye size={16} className="mr-2" />
                              Detay
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <Package size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Henüz Siparişiniz Yok
              </h2>
              <p className="text-muted-foreground mb-6">
                İlk siparişinizi vererek alışverişe başlayın
              </p>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/urun">
                  Alışverişe Başla
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}