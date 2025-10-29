import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

async function getDashboardStats() {
  const [productsCount, ordersCount, usersCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    })
  ])

  return {
    productsCount,
    ordersCount,
    usersCount,
    totalRevenue: totalRevenue._sum.total || 0
  }
}

async function getRecentProducts() {
  return await prisma.product.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      category: true
    }
  })
}

async function getRecentOrders() {
  return await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function getLowStockProducts() {
  return await prisma.product.findMany({
    where: {
      stock: {
        lte: 5
      }
    },
    orderBy: {
      stock: 'asc'
    },
    take: 5
  })
}

const statusColors = {
  pending: { label: 'Beklemede', color: 'bg-yellow-500' },
  confirmed: { label: 'Onaylandı', color: 'bg-blue-500' },
  preparing: { label: 'Hazırlanıyor', color: 'bg-purple-500' },
  shipping: { label: 'Kargoda', color: 'bg-indigo-500' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-500' },
  cancelled: { label: 'İptal Edildi', color: 'bg-red-500' }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentProducts = await getRecentProducts()
  const recentOrders = await getRecentOrders()
  const lowStockProducts = await getLowStockProducts()

  const statsCards = [
    {
      title: 'Toplam Ürün',
      value: stats.productsCount,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Toplam Sipariş',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Toplam Müşteri',
      value: stats.usersCount,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Admin paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Siparişler</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/siparisler">Tümünü Gör</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const status = statusColors[order.status as keyof typeof statusColors] || statusColors.pending
                  return (
                    <Link 
                      key={order.id}
                      href={`/admin/siparisler/${order.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₺{order.total.toFixed(2)}</p>
                        <Badge className={`${status.color} text-xs`}>
                          {status.label}
                        </Badge>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Henüz sipariş bulunmuyor
              </p>
            )}
          </CardContent>
        </Card>

        {/* Son Eklenen Ürünler */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Son Eklenen Ürünler</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/urunler">Tümünü Gör</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🌸
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name} - ₺{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stok: {product.stock}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Düşük Stoklu Ürünler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Düşük Stoklu Ürünler
            <span className="text-sm font-normal text-muted-foreground">
              (≤5 adet)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🌸
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₺{product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className={`text-sm font-semibold ${
                    product.stock === 0 
                      ? 'text-red-600' 
                      : 'text-orange-600'
                  }`}>
                    {product.stock === 0 ? 'Tükendi' : `${product.stock} adet`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Düşük stoklu ürün bulunmuyor
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}