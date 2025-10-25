import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm ürünleri getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    
    const where: any = {}
    
    // Kategori filtresi
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      })
      if (category) {
        where.categoryId = category.id
      }
    }
    
    // Öne çıkan ürünler filtresi
    if (featured === 'true') {
      where.featured = true
    }
    
    // Arama filtresi
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ürünler getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni ürün ekle (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        images: body.images || [],
        stock: parseInt(body.stock),
        categoryId: body.categoryId,
        featured: body.featured || false
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Ürün eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün eklenemedi' },
      { status: 500 }
    )
  }
}