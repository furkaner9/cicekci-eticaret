// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center max-w-2xl">
        {/* 404 Animasyonu */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-pink-600 mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-4">🌸</div>
        </div>

        {/* Başlık */}
        <h1 className="text-4xl font-bold mb-4">
          Aradığınız Sayfa Bulunamadı
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.
          <br />
          Ana sayfaya dönerek alışverişe devam edebilirsiniz.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
            <Link href="/">
              <Home className="mr-2" size={20} />
              Ana Sayfa
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link href="/urun">
              <ShoppingBag className="mr-2" size={20} />
              Ürünlere Gözat
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/arama">
              <Search className="mr-2" size={20} />
              Arama Yap
            </Link>
          </Button>
        </div>

        {/* Popüler Linkler */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">
            Popüler Kategoriler
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kategori/guller"
              className="px-4 py-2 bg-white border rounded-lg hover:border-pink-600 hover:text-pink-600 transition"
            >
              🌹 Güller
            </Link>
            <Link
              href="/kategori/buketler"
              className="px-4 py-2 bg-white border rounded-lg hover:border-pink-600 hover:text-pink-600 transition"
            >
              💐 Buketler
            </Link>
            <Link
              href="/kategori/orkideler"
              className="px-4 py-2 bg-white border rounded-lg hover:border-pink-600 hover:text-pink-600 transition"
            >
              🌸 Orkideler
            </Link>
            <Link
              href="/iletisim"
              className="px-4 py-2 bg-white border rounded-lg hover:border-pink-600 hover:text-pink-600 transition"
            >
              📧 İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}