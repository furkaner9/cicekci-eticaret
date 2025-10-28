import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductsTable from '@/components/admin/ProductsTable'

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ürünler</h1>
          <p className="text-muted-foreground">
            Toplam {products.length} ürün bulunuyor
          </p>
        </div>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/admin/urunler/yeni">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün Ekle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Ürünler</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable products={products} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}