'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Tag
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { title } from 'process'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Ürünler',
    href: '/admin/urunler',
    icon: Package
  },
  {
    title: 'Siparişler',
    href: '/admin/siparisler',
    icon: ShoppingCart
  },
  {
    title: 'Müşteriler',
    href: '/admin/musteriler',
    icon: Users
  },
   {
  title: 'Yorumlar',
  href: '/admin/reviews',
  icon: MessageSquare
},{
  title: 'Kuponlar',
    href: '/admin/kuponlar',
    icon: Tag

},
  {
    title: 'Ayarlar',
    href: '/admin/ayarlar',
    icon: Settings
  },

 

]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            <Link href="/admin" className="text-xl font-bold text-pink-600">
              🌸 Admin Panel
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                Siteye Dön
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut size={18} className="mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 pt-16 lg:pt-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-pink-100 text-pink-600 hover:bg-pink-100"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} className="mr-2" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}