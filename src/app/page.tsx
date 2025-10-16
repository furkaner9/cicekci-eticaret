import Link from 'next/link'
import { Heart, Clock, Truck, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Sevdiklerinize Çiçekle Mutluluk Gönderin 🌸
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Taptaze çiçekler, özenle hazırlanmış buketler ve hızlı teslimatla 
              özel anlarınızı unutulmaz kılın.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/urunler" 
                className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition"
              >
                Ürünleri İncele
              </Link>
              <Link 
                href="/kampanyalar" 
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold border-2 border-pink-600 hover:bg-pink-50 transition"
              >
                Kampanyalar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-pink-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Taze Çiçekler</h3>
              <p className="text-sm text-gray-600">Her gün taptaze çiçekler</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-pink-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Hızlı Teslimat</h3>
              <p className="text-sm text-gray-600">Aynı gün teslimat imkanı</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-pink-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">7/24 Sipariş</h3>
              <p className="text-sm text-gray-600">İstediğiniz zaman sipariş</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-pink-600" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Güvenli Ödeme</h3>
              <p className="text-sm text-gray-600">%100 güvenli alışveriş</p>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler - Geçici */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <span className="text-gray-400">Ürün Görseli</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Gül Buketi</h3>
                  <p className="text-sm text-gray-600 mb-3">Kırmızı güller ile özel buket</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">₺299</span>
                    <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700">
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['Buketler', 'Aranjmanlar', 'Saksılı', 'Özel Günler', 'Kokulu'].map((category) => (
              <Link 
                key={category}
                href={`/kategori/${category.toLowerCase()}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-4xl mb-3">🌺</div>
                <h3 className="font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}