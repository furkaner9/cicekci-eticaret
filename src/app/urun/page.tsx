"use client"
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  return categories
}

export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Tüm Ürünler</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filtreler */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/urunler"
                  className="text-gray-700 hover:text-pink-600 flex items-center justify-between"
                >
                  <span>Tümü</span>
                  <span className="text-sm text-gray-500">{products.length}</span>
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/kategori/${category.slug}`}
                    className="text-gray-700 hover:text-pink-600 flex items-center justify-between"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {category._count.products}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="my-6" />

            <h2 className="text-xl font-bold mb-4">Fiyat Aralığı</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">0₺ - 200₺</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">200₺ - 400₺</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">400₺ ve üzeri</span>
              </label>
            </div>
          </div>
        </div>

        {/* Ürünler Grid */}
        <div className="lg:col-span-3">
          {/* Sıralama */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              <span className="font-semibold">{products.length}</span> ürün bulundu
            </p>
            <select className="border rounded-lg px-4 py-2 text-sm">
              <option>En Yeni</option>
              <option>Fiyat: Düşükten Yükseğe</option>
              <option>Fiyat: Yüksekten Düşüğe</option>
              <option>Popülerlik</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz ürün bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}