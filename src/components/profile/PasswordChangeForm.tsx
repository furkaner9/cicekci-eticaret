'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Mevcut şifrenizi girin'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string().min(6, 'Şifre tekrarını girin'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export default function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Şifre değiştirilemedi')
      }

      toast.success('Şifre Değiştirildi', {
        description: 'Şifreniz başarıyla değiştirildi.',
      })

      reset()
    } catch (error: any) {
      toast.error('Hata', {
        description: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mevcut Şifre *</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          placeholder="••••••••"
        />
        {errors.currentPassword && (
          <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Yeni Şifre *</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          placeholder="••••••••"
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          En az 6 karakter olmalıdır
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Yeni Şifre Tekrar *</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-pink-600 hover:bg-pink-700"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Lock className="mr-2 h-4 w-4" />
        Şifreyi Değiştir
      </Button>
    </form>
  )
}
