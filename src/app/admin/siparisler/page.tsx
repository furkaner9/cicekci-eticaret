import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import OrdersTable from '@/components/admin/OrdersTable'
import { Package, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react'

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return orders
}

async function getOrderStats() {
  const [total, pending, confirmed, delivered, cancelled] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: 'confirmed' } }),
    prisma.order.count({ where: { status: 'delivered' } }),
    prisma.order.count({ where: { status: 'cancelled' } })
  ])

  return { total, pending, confirmed, delivered, cancelled }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  const stats = await getOrderStats()

  const statusCards = [
    {
      title: 'Toplam Sipariş',
      value: stats.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Bekleyen',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Onaylanan',
      value: stats.confirmed,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Teslim Edilen',
      value: stats.delivered,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Siparişler</h1>
        <p className="text-muted-foreground">
          Gelen siparişleri görüntüleyin ve yönetin
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Siparişler Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}