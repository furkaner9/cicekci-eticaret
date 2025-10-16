import Link from 'next/link'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        {/* Üst Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b">
          <div className="text-gray-600">
            📞 0555 123 45 67 | ✉️ info@cicekci.com
          </div>
          <div className="flex gap-4">
            <Link href="/hakkimizda" className="text-gray-600 hover:text-pink-600">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-pink-600">
              İletişim
            </Link>
          </div>
        </div>

        {/* Ana Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-600">
            🌸 Çiçek Dükkanım
          </Link>

          {/* Arama */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Çiçek veya buket ara..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center gap-6">
            <Link href="/hesabim" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-pink-600">
              <User size={24} />
              <span className="text-sm">Hesabım</span>
            </Link>
            <Link href="/sepet" className="relative flex items-center gap-2 text-gray-700 hover:text-pink-600">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
              <span className="hidden md:block text-sm">Sepetim</span>
            </Link>
          </div>
        </div>

        {/* Kategoriler */}
        <nav className="hidden md:flex gap-6 py-3 border-t">
          <Link href="/kategori/buketler" className="text-gray-700 hover:text-pink-600 font-medium">
            Buketler
          </Link>
          <Link href="/kategori/aranjmanlar" className="text-gray-700 hover:text-pink-600 font-medium">
            Aranjmanlar
          </Link>
          <Link href="/kategori/saksili-cicekler" className="text-gray-700 hover:text-pink-600 font-medium">
            Saksılı Çiçekler
          </Link>
          <Link href="/kategori/ozel-gunler" className="text-gray-700 hover:text-pink-600 font-medium">
            Özel Günler
          </Link>
          <Link href="/kategori/kokulu-cicekler" className="text-gray-700 hover:text-pink-600 font-medium">
            Kokulu Çiçekler
          </Link>
        </nav>

        {/* Mobil Menü Butonu */}
        <div className="md:hidden flex items-center justify-between py-3">
          <button className="text-gray-700">
            <Menu size={24} />
          </button>
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Ara..."
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  )
}