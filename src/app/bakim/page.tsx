// app/bakim/page.tsx
import { Clock } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-yellow-50 to-white">
      <div className="text-center max-w-2xl">
        {/* İkon */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🔧</div>
          <Clock className="mx-auto text-yellow-600 animate-spin" size={64} />
        </div>

        {/* Başlık */}
        <h1 className="text-4xl font-bold mb-4">
          Site Bakımda
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Sizlere daha iyi hizmet verebilmek için sistemimizde 
          güncelleme yapıyoruz. Kısa süre içinde tekrar hizmetinizdeyiz!
        </p>

        {/* Bilgi Kutusu */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="font-semibold mb-2">Tahmini Süre</p>
          <p className="text-2xl font-bold text-yellow-600">2 Saat</p>
          <p className="text-sm text-gray-600 mt-2">
            Beklediğiniz için teşekkür ederiz 🌸
          </p>
        </div>

        {/* İletişim */}
        <div className="pt-8 border-t">
          <p className="text-gray-600 mb-4">
            Acil durumlar için:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="tel:+902121234567"
              className="px-6 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition"
            >
              📞 +90 (212) 123 45 67
            </a>
            <a
              href="mailto:info@cicekdukkanim.com"
              className="px-6 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition"
            >
              📧 info@cicekdukkanim.com
            </a>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4">
            Bizi takip edin:
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition text-xl"
            >
              📷
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition text-xl"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:opacity-90 transition text-xl"
            >
              🐦
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}