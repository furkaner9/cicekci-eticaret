import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AddressForm from '@/components/profile/AddressForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewAddressPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/hesabim/adreslerim/yeni')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Yeni Adres Ekle</h1>
            <p className="text-muted-foreground">
              Teslimat için yeni adres ekleyin
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/hesabim/adreslerim">← Geri Dön</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adres Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}