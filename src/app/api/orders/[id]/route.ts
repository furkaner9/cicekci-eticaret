import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET - Tek sipariş getir
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    
    const order = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Sipariş getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Sipariş getirilemedi' },
      { status: 500 }
    )
  }
}

// PATCH - Sipariş durumunu güncelle
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status, paymentStatus } = body

    // Güncelleme verisi
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Sipariş güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Sipariş güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Sipariş sil (İptal)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    
    // Siparişi iptal olarak işaretle
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: 'cancelled'
      }
    })
    
    // Stokları geri yükle
    const items = order.items as any[]
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }
    
    return NextResponse.json({ message: 'Sipariş iptal edildi', order })
  } catch (error) {
    console.error('Sipariş iptal edilirken hata:', error)
    return NextResponse.json(
      { error: 'Sipariş iptal edilemedi' },
      { status: 500 }
    )
  }
}