import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductDetail from '@/components/product/ProductDetail'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true
    }
  })
  
  return product
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId }
    },
    include: {
      category: true
    },
    take: 4
  })
  
  return products
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

// Next.js 15: Metadata generation için params Promise
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı'
    }
  }

  return {
    title: `${product.name} - Çiçek Dükkanım`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Next.js 15: params artık Promise
  const { slug } = await params
  
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }
  
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)
  
  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}