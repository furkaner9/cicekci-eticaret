import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET - Tek bir adresi getir
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const address = await prisma.address.findFirst({
      where: { 
        id,
        userId: session.user.id 
      }
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error('Adres getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Adres getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Adresi güncelle
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { title, fullName, phone, address, city, district, isDefault } = body

    // Eğer bu adres varsayılan yapılacaksa, diğerlerini varsayılan olmaktan çıkar
    if (isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: session.user.id,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        title,
        fullName,
        phone,
        address,
        city,
        district,
        isDefault
      }
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Adres güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Adres güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Adresi sil
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    await prisma.address.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Adres silindi' })
  } catch (error) {
    console.error('Adres silinirken hata:', error)
    return NextResponse.json(
      { error: 'Adres silinemedi' },
      { status: 500 }
    )
  }
}