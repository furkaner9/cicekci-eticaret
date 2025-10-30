// app/api/products/[slug]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  // Burada productId yerine slug kullanabilirsin
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // review fetch mantığı buraya gelecek
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rating, title, comment } = await req.json();
  const { slug } = params;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  // Daha önce yorum yapmış mı kontrol
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: product.id,
      },
    },
  });

  if (existingReview) return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });

  // Kullanıcının ürünü satın alıp almadığını kontrol
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id, status: 'delivered' },
    select: { items: true },
  });
  const hasPurchased = orders.some(order => {
    const items = Array.isArray(order.items) ? order.items : [];
    return items.some((item: any) => item?.id === product.id);
  });

  // Yorum oluştur
  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      rating,
      title: title?.trim(),
      comment: comment.trim(),
      isVerified: !!hasPurchased,
      isApproved: false,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ review }, { status: 201 });
}
