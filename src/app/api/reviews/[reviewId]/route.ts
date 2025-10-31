// app/api/reviews/[reviewId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface RouteParams {
  params: Promise<{ reviewId: string }>;
}

// Yorum güncelle (kullanıcı kendi yorumunu)
export async function PATCH(
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

    const { reviewId } = await context.params;
    const { rating, title, comment, action } = await req.json();

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Faydalı/Faydalı değil oylaması
    if (action === 'helpful' || action === 'notHelpful') {
      const field = action === 'helpful' ? 'helpfulCount' : 'notHelpfulCount';
      
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          [field]: { increment: 1 },
        },
      });

      return NextResponse.json({ review: updatedReview });
    }

    // Sadece yorum sahibi düzenleyebilir
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Yorum güncelle
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || review.rating,
        title: title?.trim(),
        comment: comment?.trim() || review.comment,
        isApproved: false,
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

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Yorum sil
export async function DELETE(
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

    const { reviewId } = await context.params;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Sadece yorum sahibi veya admin silebilir
    if (review.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
