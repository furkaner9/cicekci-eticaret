// lib/validations/auth.ts
import { z } from 'zod'

// Giriş Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı'),
})

// Kayıt Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad Soyad gerekli')
    .min(2, 'Ad Soyad en az 2 karakter olmalı')
    .max(50, 'Ad Soyad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf kullanın'),
  email: z
    .string()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Z]/, 'En az 1 büyük harf içermeli')
    .regex(/[a-z]/, 'En az 1 küçük harf içermeli')
    .regex(/[0-9]/, 'En az 1 rakam içermeli'),
  confirmPassword: z
    .string()
    .min(1, 'Şifre tekrarı gerekli'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(05)(\d{9})$/.test(val),
      'Geçerli bir telefon numarası girin (örn: 05XX XXX XX XX)'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Şifre Sıfırlama Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta adresi girin'),
})

// Şifre Değiştirme Schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Yeni şifre gerekli')
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Z]/, 'En az 1 büyük harf içermeli')
    .regex(/[a-z]/, 'En az 1 küçük harf içermeli')
    .regex(/[0-9]/, 'En az 1 rakam içermeli'),
  confirmPassword: z
    .string()
    .min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// TypeScript Types
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>