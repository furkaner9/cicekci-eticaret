import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// PATCH - Adresi varsayılan yap
export async function PATCH(
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

    // Tüm adresleri varsayılan olmaktan çıkar
    await prisma.address.updateMany({
      where: { 
        userId: session.user.id,
        isDefault: true
      },
      data: { isDefault: false }
    })

    // Seçilen adresi varsayılan yap
    const address = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error('Adres güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Adres güncellenemedi' },
      { status: 500 }
    )
  }
}