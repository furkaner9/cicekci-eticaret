import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AddressForm from '@/components/profile/AddressForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getAddress(addressId: string, userId: string) {
  const address = await prisma.address.findFirst({
    where: { 
      id: addressId,
      userId 
    }
  })
  
  return address
}

interface EditAddressPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris')
  }

  const { id } = await params
  const address = await getAddress(id, session.user.id)

  if (!address) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Adresi Düzenle</h1>
            <p className="text-muted-foreground">
              {address.title}
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
            <AddressForm address={address} isEdit={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}