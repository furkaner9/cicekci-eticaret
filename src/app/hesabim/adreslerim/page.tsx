import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import AddressCard from '@/components/profile/AddressCard'
import { MapPin, Plus } from 'lucide-react'

async function getUserAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  })
  
  return addresses
}

export default async function AddressesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/hesabim/adreslerim')
  }

  const addresses = await getUserAddresses(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Adreslerim</h1>
            <p className="text-muted-foreground">
              Teslimat adreslerinizi yönetin
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/hesabim">← Hesabıma Dön</Link>
            </Button>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/hesabim/adreslerim/yeni">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Adres
              </Link>
            </Button>
          </div>
        </div>

        {/* Adresler */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <MapPin size={64} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Henüz Adres Eklemediniz
              </h2>
              <p className="text-muted-foreground mb-6">
                Hızlı teslimat için adres ekleyin
              </p>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/hesabim/adreslerim/yeni">
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Adresi Ekle
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}