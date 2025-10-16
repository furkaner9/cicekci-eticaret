import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">🌸 Çiçek Dükkanım</h3>
            <p className="text-sm mb-4">
              Taze ve kaliteli çiçeklerle sevdiklerinize özel anlar yaşatın. 
              Her gün taptaze çiçekler ve hızlı teslimat.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-pink-400">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-pink-400">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimizda" className="hover:text-pink-400">Hakkımızda</Link></li>
              <li><Link href="/urunler" className="hover:text-pink-400">Ürünlerimiz</Link></li>
              <li><Link href="/kampanyalar" className="hover:text-pink-400">Kampanyalar</Link></li>
              <li><Link href="/blog" className="hover:text-pink-400">Blog</Link></li>
              <li><Link href="/iletisim" className="hover:text-pink-400">İletişim</Link></li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sss" className="hover:text-pink-400">Sık Sorulan Sorular</Link></li>
              <li><Link href="/teslimat" className="hover:text-pink-400">Teslimat Bilgileri</Link></li>
              <li><Link href="/iade" className="hover:text-pink-400">İptal ve İade</Link></li>
              <li><Link href="/gizlilik" className="hover:text-pink-400">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-pink-400">Kullanım Koşulları</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Atatürk Caddesi No:123<br />Nilüfer/Bursa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>0555 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@cicekci.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm mb-2">Çalışma Saatleri:</p>
              <p className="text-xs">Pazartesi - Cumartesi: 09:00 - 22:00</p>
              <p className="text-xs">Pazar: 10:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* Alt Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Çiçek Dükkanım. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}