import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{
    slug: string
  }>
}

// GET - Tek bir ürünü getir
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // Next.js 15: params artık Promise
    const { slug } = await context.params
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Ürün güncelle
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        images: body.images,
        stock: parseInt(body.stock),
        categoryId: body.categoryId,
        featured: body.featured
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Ürün sil
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params
    
    await prisma.product.delete({
      where: { slug }
    })
    
    return NextResponse.json({ message: 'Ürün silindi' })
  } catch (error) {
    console.error('Ürün silinirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün silinemedi' },
      { status: 500 }
    )
  }
}