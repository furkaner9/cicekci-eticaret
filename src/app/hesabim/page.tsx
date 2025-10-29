import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, Package, MapPin, Settings } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getUserData(userId: string) {
  const [user, ordersCount, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.order.count({
      where: { userId }
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    })
  ])

  return { user, ordersCount, addresses }
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  const { user, ordersCount, addresses } = await getUserData(session.user.id)

  if (!user) {
    redirect('/giris')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hesabım</h1>

        {/* Kullanıcı Bilgileri */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ad Soyad</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">E-posta</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                <p className="font-semibold">{user.phone || 'Belirtilmemiş'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hesap Türü</p>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Admin' : 'Müşteri'}
                </Badge>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/hesabim/ayarlar">
                  <Settings className="mr-2 h-4 w-4" />
                  Bilgilerimi Düzenle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Siparişler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Siparişlerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-4xl font-bold text-pink-600 mb-2">
                  {ordersCount}
                </p>
                <p className="text-muted-foreground mb-4">Toplam Sipariş</p>
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/hesabim/siparislerim">
                    Siparişlerimi Gör
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Adresler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Adreslerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-4xl font-bold text-pink-600 mb-2">
                  {addresses.length}
                </p>
                <p className="text-muted-foreground mb-4">Kayıtlı Adres</p>
                <Button asChild variant="outline">
                  <Link href="/hesabim/adreslerim">
                    Adresleri Yönet
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hızlı Linkler */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild className="h-auto py-4 flex-col">
                <Link href="/hesabim/siparislerim">
                  <Package className="mb-2" size={24} />
                  <span className="text-sm">Siparişlerim</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col">
                <Link href="/hesabim/adreslerim">
                  <MapPin className="mb-2" size={24} />
                  <span className="text-sm">Adreslerim</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col">
                <Link href="/hesabim/ayarlar">
                  <Settings className="mb-2" size={24} />
                  <span className="text-sm">Ayarlar</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col">
                <Link href="/urunler">
                  <Package className="mb-2" size={24} />
                  <span className="text-sm">Alışverişe Devam</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}