import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcının adreslerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' }
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Adresler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Adresler getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni adres ekle
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, fullName, phone, address, city, district, isDefault } = body

    // Validasyon
    if (!title || !fullName || !phone || !address || !city || !district) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurun' },
        { status: 400 }
      )
    }

    // Eğer bu adres varsayılan yapılacaksa, diğerlerini varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true
        },
        data: { isDefault: false }
      })
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        title,
        fullName,
        phone,
        address,
        city,
        district,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(newAddress, { status: 201 })

  } catch (error) {
    console.error('Adres eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Adres eklenemedi' },
      { status: 500 }
    )
  }
}