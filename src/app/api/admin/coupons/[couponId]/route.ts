// app/api/admin/coupons/[couponId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface RouteParams {
  params: Promise<{ couponId: string }>;
}

// Kupon güncelle
export async function PATCH(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { couponId } = await context.params;
    const data = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        ...data,
        code: data.code?.toUpperCase(),
        discountValue: data.discountValue ? parseFloat(data.discountValue) : undefined,
        minPurchase: data.minPurchase !== undefined ? parseFloat(data.minPurchase) : undefined,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : undefined,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Kupon sil
export async function DELETE(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { couponId } = await context.params;

    await prisma.coupon.delete({
      where: { id: couponId },
    });

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}