import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Yeni Ürün Ekle</h1>
        <p className="text-muted-foreground">Mağazanıza yeni ürün ekleyin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}