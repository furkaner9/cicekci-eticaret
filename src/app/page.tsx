"use client"
import Link from 'next/link'
import { Heart, Clock, Truck, Shield } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true
    },
    include: {
      category: true
    },
    take: 8,
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return categories
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

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
            <div className="flex flex-wrap gap-4">
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

      {/* Öne Çıkan Ürünler */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Öne Çıkan Ürünler</h2>
            <Link 
              href="/urunler" 
              className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
            >
              Tümünü Gör
              <span>→</span>
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz öne çıkan ürün bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition hover:scale-105"
              >
                <div className="text-4xl mb-3">🌺</div>
                <h3 className="font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="text-xs text-gray-500 mt-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Özel Gün İçin Çiçek Mi Arıyorsunuz?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Doğum günü, yıldönümü, sevgililer günü veya herhangi bir özel gün için 
            size özel tasarımlar yapıyoruz.
          </p>
          <Link 
            href="/iletisim" 
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Bizimle İletişime Geçin
          </Link>
        </div>
      </section>
    </div>
  )
}