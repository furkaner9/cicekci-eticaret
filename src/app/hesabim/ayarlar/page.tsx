import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import ProfileEditForm from '@/components/profile/ProfileEditForm'
import PasswordChangeForm from '@/components/profile/PasswordChangeForm'
import { User, Lock } from 'lucide-react'

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    }
  })
  
  return user
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/giris?callbackUrl=/hesabim/ayarlar')
  }

  const user = await getUser(session.user.id)

  if (!user) {
    redirect('/giris')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
            <p className="text-muted-foreground">
              Hesap bilgilerinizi yönetin
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/hesabim">← Hesabıma Dön</Link>
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil Bilgileri
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" />
              Şifre Değiştir
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgilerini Düzenle</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileEditForm user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}