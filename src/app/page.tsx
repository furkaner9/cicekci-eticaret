// src/app/page.tsx
import Link from 'next/link'
import { Heart, Clock, Truck, Shield, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: 'desc' }
  })
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
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
            <Badge className="mb-4 bg-pink-600">Hoş Geldiniz</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Sevdiklerinize Çiçekle Mutluluk Gönderin 🌸
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Taptaze çiçekler, özenle hazırlanmış buketler ve hızlı teslimatla özel anlarınızı unutulmaz kılın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/urun">
                  Ürünleri İncele
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/kampanyalar">
                  Kampanyalar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Öne çıkan ürünler */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-muted-foreground">En popüler çiçek ve buketlerimiz</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/urun">
                Tümünü Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Henüz öne çıkan ürün bulunmamaktadır.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Kategoriler</h2>
            <p className="text-muted-foreground">İhtiyacınıza uygun kategoriyi seçin</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/kategori/${category.slug}`}>
                <Card className="text-center hover:shadow-lg transition-all hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">🌺</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
