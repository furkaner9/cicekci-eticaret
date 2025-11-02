// app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !subtotal) {
      return NextResponse.json(
        { error: 'Kod ve sepet tutarı gerekli' },
        { status: 400 }
      );
    }

    // Kuponu bul
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Geçersiz kupon kodu' },
        { status: 404 }
      );
    }

    // Aktif mi?
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Bu kupon artık geçerli değil' },
        { status: 400 }
      );
    }

    // Başlangıç tarihi kontrolü
    if (coupon.startDate && new Date() < coupon.startDate) {
      return NextResponse.json(
        { error: 'Bu kupon henüz aktif değil' },
        { status: 400 }
      );
    }

    // Bitiş tarihi kontrolü
    if (coupon.endDate && new Date() > coupon.endDate) {
      return NextResponse.json(
        { error: 'Bu kuponun süresi dolmuş' },
        { status: 400 }
      );
    }

    // Kullanım limiti kontrolü
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Bu kupon kullanım limitine ulaşmış' },
        { status: 400 }
      );
    }

    // Minimum sepet tutarı kontrolü
    if (subtotal < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Bu kupon için minimum ${coupon.minPurchase.toFixed(2)} ₺ alışveriş yapmalısınız` },
        { status: 400 }
      );
    }

    // İndirim hesapla
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      
      // Maksimum indirim kontrolü
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      // Sabit tutar
      discountAmount = coupon.discountValue;
    }

    // İndirim sepet tutarından fazla olamaz
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    return NextResponse.json(
      { error: 'Kupon doğrulanırken hata oluştu' },
      { status: 500 }
    );
  }
}