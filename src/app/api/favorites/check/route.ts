// app/api/favorites/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // NextAuth v5

// Ürünlerin favori durumunu kontrol et (toplu)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ favorites: [] });
    }

    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        productId: { in: productIds },
      },
      select: {
        productId: true,
      },
    });

    const favoriteProductIds = favorites.map((f) => f.productId);

    return NextResponse.json({ favorites: favoriteProductIds });
  } catch (error) {
    console.error('Check favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}