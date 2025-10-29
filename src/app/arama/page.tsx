import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
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

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  
  return {
    title: q ? `"${q}" için arama sonuçları - Çiçek Dükkanım` : 'Arama - Çiçek Dükkanım',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ''
  const products = await searchProducts(query)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-pink-600">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-foreground">Arama</span>
      </nav>

      {/* Başlık */}
      <div className="mb-8">
        {query ? (
          <>
            <h1 className="text-4xl font-bold mb-3">
              Arama Sonuçları
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold">{products.length}</span> ürün bulundu
              </p>
              <Badge variant="secondary" className="text-base px-3 py-1">
                "{query}"
              </Badge>
            </div>
          </>
        ) : (
          <h1 className="text-4xl font-bold mb-3">
            Arama
          </h1>
        )}
      </div>

      {/* Sonuçlar */}
      {!query ? (
        <Card>
          <CardContent className="text-center py-16">
            <Search className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h2 className="text-2xl font-semibold mb-2">
              Arama Yapın
            </h2>
            <p className="text-muted-foreground mb-6">
              Aramak istediğiniz ürünü yukarıdaki arama kutusuna yazın
            </p>
            <Link 
              href="/urun"
              className="text-pink-600 hover:underline font-medium"
            >
              Veya tüm ürünlere göz atın →
            </Link>
          </CardContent>
        </Card>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Search className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h2 className="text-2xl font-semibold mb-2">
              Sonuç Bulunamadı
            </h2>
            <p className="text-muted-foreground mb-2">
              "{query}" için ürün bulunamadı
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Farklı kelimeler veya daha genel terimler deneyin
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/urun"
                className="text-pink-600 hover:underline font-medium"
              >
                Tüm ürünlere göz at →
              </Link>
              <span className="hidden sm:inline text-muted-foreground">veya</span>
              <Link 
                href="/kategori/buketler"
                className="text-pink-600 hover:underline font-medium"
              >
                Buketlere göz at →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Önerilen Kategoriler */}
      {query && products.length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['buketler', 'aranjmanlar', 'saksili-cicekler', 'ozel-gunler'].map((slug) => (
              <Link
                key={slug}
                href={`/kategori/${slug}`}
                className="p-6 border rounded-lg hover:border-pink-600 hover:shadow-md transition text-center"
              >
                <div className="text-4xl mb-2">🌺</div>
                <p className="font-medium capitalize">
                  {slug.replace('-', ' ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}