'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CartBadge from './CartBadge'

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        {/* Üst Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone size={14} />
              0555 123 45 67
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail size={14} />
              info@cicekci.com
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/hakkimizda" className="text-muted-foreground hover:text-pink-600 transition">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-muted-foreground hover:text-pink-600 transition">
              İletişim
            </Link>
          </div>
        </div>

        {/* Ana Header */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-600 whitespace-nowrap">
            🌸 Çiçek Dükkanım
          </Link>

          {/* Arama */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Çiçek veya buket ara..."
                className="pr-10"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0"
              >
                <Search size={20} />
              </Button>
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link href="/hesabim">
                <User className="mr-2 h-4 w-4" />
                Hesabım
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild className="relative">
              <Link href="/sepet">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Sepetim</span>
                <CartBadge />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Kategoriler */}
        <nav className="hidden md:flex gap-6 py-3 border-t">
          <Link href="/kategori/buketler" className="text-sm font-medium text-muted-foreground hover:text-pink-600 transition">
            Buketler
          </Link>
          <Link href="/kategori/aranjmanlar" className="text-sm font-medium text-muted-foreground hover:text-pink-600 transition">
            Aranjmanlar
          </Link>
          <Link href="/kategori/saksili-cicekler" className="text-sm font-medium text-muted-foreground hover:text-pink-600 transition">
            Saksılı Çiçekler
          </Link>
          <Link href="/kategori/ozel-gunler" className="text-sm font-medium text-muted-foreground hover:text-pink-600 transition">
            Özel Günler
          </Link>
          <Link href="/kategori/kokulu-cicekler" className="text-sm font-medium text-muted-foreground hover:text-pink-600 transition">
            Kokulu Çiçekler
          </Link>
        </nav>

        {/* Mobil Arama */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ara..."
              className="pr-10"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0"
            >
              <Search size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}