import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Ürüne ait yorumları getir
export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const { slug } = await context.params; // Next.js 15: await params
    
    // Önce slug ile ürünü bul
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'recent';
    const skip = (page - 1) * limit;

    // Sıralama
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'helpful') {
      orderBy = { helpfulCount: 'desc' };
    }

    const where = {
      productId: product.id, // Slug ile bulduğumuz ürünün ID'si
      isApproved: true,
    };

    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    // Rating dağılımı
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where,
      _count: { rating: true },
    });

    const distribution = [1, 2, 3, 4, 5].map((rating) => {
      const found = ratingDistribution.find((r) => r.rating === rating);
      return {
        rating,
        count: found?._count.rating || 0,
      };
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating || 0,
        distribution,
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Yorum ekle
export async function POST(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await context.params; // Next.js 15: await params
    
    // Önce slug ile ürünü bul
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const { rating, title, comment } = await req.json();

    // Validasyon
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Daha önce yorum yapmış mı kontrol et
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Kullanıcı bu ürünü satın almış mı kontrol et
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: 'delivered',
      },
    });

    let hasPurchased = false;
    for (const order of orders) {
      const items = typeof order.items === 'string' 
        ? JSON.parse(order.items) 
        : order.items;
      
      if (Array.isArray(items) && items.some((item: any) => item.id === product.id)) {
        hasPurchased = true;
        break;
      }
    }

    // Yorum oluştur
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        rating,
        title: title?.trim(),
        comment: comment.trim(),
        isVerified: hasPurchased,
        isApproved: true, // ✅ Otomatik onaylı
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}