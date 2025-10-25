import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm kategorileri getir
export async function GET() {
  try {
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
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Kategoriler getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni kategori ekle (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image
      }
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Kategori eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori eklenemedi' },
      { status: 500 }
    )
  }
}