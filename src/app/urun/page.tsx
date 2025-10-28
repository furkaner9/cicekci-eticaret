import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import CategoryFilter from '@/components/category/CategoryFilter'
import SortSelect from '@/components/category/SortSelect'

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort, minPrice, maxPrice } = await searchParams
  
  let products = await getProducts()
  const categories = await getCategories()

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
      <h1 className="text-4xl font-bold mb-8">Tüm Ürünler</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filtreler */}
        <div className="lg:col-span-1">
          <CategoryFilter 
            categories={categories}
            currentCategory="all"
            productCount={products.length}
          />
        </div>

        {/* Ürünler Grid */}
        <div className="lg:col-span-3">
          {/* Sıralama */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold">{products.length}</span> ürün bulundu
            </p>
            <SortSelect />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ürün bulunamadı. Filtreleri temizleyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}