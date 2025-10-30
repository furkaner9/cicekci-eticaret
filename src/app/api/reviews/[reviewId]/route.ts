// app/api/reviews/[reviewId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Yorum güncelle (kullanıcı kendi yorumunu)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, title, comment, action } = await req.json();

    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
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
        where: { id: params.reviewId },
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
      where: { id: params.reviewId },
      data: {
        rating: rating || review.rating,
        title: title?.trim(),
        comment: comment?.trim() || review.comment,
        isApproved: false, // Tekrar admin onayına gönder
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
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: params.reviewId },
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
      where: { id: params.reviewId },
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