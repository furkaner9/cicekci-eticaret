import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tek bir ürünü getir
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
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

// PUT - Ürün güncelle (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { slug: params.slug },
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

// DELETE - Ürün sil (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.product.delete({
      where: { slug: params.slug }
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