import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductDetail from '@/components/product/ProductDetail'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  })
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId }
    },
    include: { category: true },
    take: 4
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </main>
  )
}
