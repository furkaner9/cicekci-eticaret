import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Benzersiz sipariş numarası oluştur
function generateOrderNumber() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `ORD-${timestamp}-${random}`
}

// POST - Yeni sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryDistrict,
      deliveryDate,
      deliveryTime,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      notes
    } = body

    // Validasyon
    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Müşteri bilgileri eksik' },
        { status: 400 }
      )
    }

    if (!deliveryAddress || !deliveryCity || !deliveryDistrict) {
      return NextResponse.json(
        { error: 'Teslimat bilgileri eksik' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Sepette ürün bulunmuyor' },
        { status: 400 }
      )
    }

    // Sipariş numarası oluştur
    const orderNumber = generateOrderNumber()

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryDistrict,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        items: items, // JSON olarak saklanacak
        subtotal: parseFloat(subtotal),
        shipping: parseFloat(shipping),
        total: parseFloat(total),
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
        status: 'pending',
        notes: notes || null
      }
    })

    // Stokları güncelle
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// GET - Tüm siparişleri getir (Admin için)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    const where = email ? { customerEmail: email } : {}

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Siparişler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Siparişler getirilemedi' },
      { status: 500 }
    )
  }
}