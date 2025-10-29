import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        products: [],
        message: 'Lütfen en az 2 karakter girin'
      })
    }

    // Ürünlerde arama yap
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
      take: 10, // Maksimum 10 sonuç
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      products,
      query,
      count: products.length
    })

  } catch (error) {
    console.error('Arama hatası:', error)
    return NextResponse.json(
      { error: 'Arama yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}