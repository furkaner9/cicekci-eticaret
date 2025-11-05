// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata loglaması (production'da Sentry vs kullanılabilir)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-2xl">
        {/* Hata İkonu */}
        <div className="mb-8">
          <div className="text-9xl mb-4">⚠️</div>
          <div className="text-2xl font-bold text-red-600">
            Bir Hata Oluştu
          </div>
        </div>

        {/* Hata Mesajı */}
        <h1 className="text-3xl font-bold mb-4">
          Beklenmeyen Bir Sorun Oluştu
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          Üzgünüz, bir şeyler ters gitti. Lütfen tekrar deneyin.
        </p>

        {/* Development ortamında hata mesajını göster */}
        {process.env.NODE_ENV === 'development' && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={reset}
            size="lg"
            className="bg-pink-600 hover:bg-pink-700"
          >
            <RefreshCcw className="mr-2" size={20} />
            Tekrar Dene
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="mr-2" size={20} />
              Ana Sayfa
            </Link>
          </Button>
        </div>

        {/* Yardım */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-600 mb-4">
            Sorun devam ederse bizimle iletişime geçin:
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/iletisim"
              className="text-pink-600 hover:underline"
            >
              📧 İletişim Formu
            </Link>
            <a
              href="tel:+902121234567"
              className="text-pink-600 hover:underline"
            >
              📞 Bizi Arayın
            </a>
            <a
              href="https://wa.me/905321234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}