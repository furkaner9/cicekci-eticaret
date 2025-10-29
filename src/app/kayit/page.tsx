'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasyon
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Hata', {
        description: 'Lütfen tüm zorunlu alanları doldurun.',
      })
      return
    }

    if (formData.password.length < 6) {
      toast.error('Hata', {
        description: 'Şifre en az 6 karakter olmalıdır.',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Hata', {
        description: 'Şifreler eşleşmiyor.',
      })
      return
    }

    if (!acceptTerms) {
      toast.error('Hata', {
        description: 'Kullanım koşullarını kabul etmelisiniz.',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt başarısız')
      }

      toast.success('Kayıt Başarılı!', {
        description: 'Hesabınız oluşturuldu. Giriş yapılıyor...',
      })

      // Otomatik giriş yap
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      router.push('/')
      router.refresh()

    } catch (error: any) {
      toast.error('Hata', {
        description: error.message || 'Kayıt sırasında bir hata oluştu.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>
            Yeni bir hesap oluşturun ve alışverişe başlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ahmet Yılmaz"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0555 123 45 67"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                En az 6 karakter
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Link href="/kullanim-kosullari" className="text-pink-600 hover:underline">
                  Kullanım koşullarını
                </Link>
                {' '}ve{' '}
                <Link href="/gizlilik" className="text-pink-600 hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul ediyorum
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kayıt yapılıyor...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Kayıt Ol
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
            <Link 
              href="/giris" 
              className="text-pink-600 hover:underline font-medium"
            >
              Giriş Yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}