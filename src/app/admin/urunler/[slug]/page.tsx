import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true
    }
  })
  
  return product
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

interface EditProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Next.js 15: params artık Promise
  const { slug } = await params
  
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }
  
  const categories = await getCategories()

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ürün Düzenle</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm 
            categories={categories} 
            initialData={product}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}