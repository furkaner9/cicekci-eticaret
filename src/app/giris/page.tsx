// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Giriş Başarısız', {
          description: 'E-posta veya şifre hatalı',
        })
        return
      }

      toast.success('Hoş geldiniz!', {
        description: 'Başarıyla giriş yaptınız',
      })

      router.push(redirect)
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu', {
        description: 'Lütfen tekrar deneyin',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">🌸</div>
          <CardTitle className="text-2xl">Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapın ve alışverişe devam edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* E-posta */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <Label htmlFor="password">Şifre *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Şifremi Unuttum */}
            <div className="flex justify-end">
              <Link
                href="/sifremi-unuttum"
                className="text-sm text-pink-600 hover:underline"
              >
                Şifremi Unuttum
              </Link>
            </div>

            {/* Giriş Butonu */}
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                'Giriş yapılıyor...'
              ) : (
                <>
                  <LogIn className="mr-2" size={18} />
                  Giriş Yap
                </>
              )}
            </Button>

            {/* Ayırıcı */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">veya</span>
              </div>
            </div>

            {/* Kayıt Ol Linki */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{' '}
                <Link
                  href="/kayit"
                  className="text-pink-600 hover:underline font-medium"
                >
                  Kayıt Olun
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}