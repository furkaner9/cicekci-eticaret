import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import { Card, CardContent } from '@/components/ui/card'
import CategoryFilter from '@/components/category/CategoryFilter'
import SortSelect from '@/components/category/SortSelect'
import Link from 'next/link'

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })
  
  return category
}

async function getCategoryProducts(categoryId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return products
}

async function getAllCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı'
    }
  }

  return {
    title: `${category.name} - Çiçek Dükkanım`,
    description: category.description || `${category.name} kategorisindeki tüm ürünler`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { sort, minPrice, maxPrice } = await searchParams
  
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }
  
  let products = await getCategoryProducts(category.id)
  const allCategories = await getAllCategories()
  
  // Fiyat filtreleme
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice))
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice))
  }
  
  // Sıralama
  if (sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price)
  } else if (sort === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-pink-600">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-pink-600">Ürünler</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Kategori Başlığı */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground mb-4">
            {category.description}
          </p>
        )}
        <p className="text-muted-foreground">
          <span className="font-semibold">{products.length}</span> ürün bulundu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filtreler */}
        <div className="lg:col-span-1">
          <CategoryFilter 
            categories={allCategories}
            currentCategory={category.slug}
            productCount={products.length}
          />
        </div>

        {/* Ürünler */}
        <div className="lg:col-span-3">
          {/* Sıralama ve Sonuç Sayısı */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold">{products.length}</span> ürün gösteriliyor
            </p>
            
            <SortSelect />
          </div>

          {/* Ürün Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">
                  Bu kategoride ürün bulunamadı
                </p>
                <p className="text-sm text-muted-foreground">
                  Lütfen farklı bir kategori deneyin veya filtreleri temizleyin.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}