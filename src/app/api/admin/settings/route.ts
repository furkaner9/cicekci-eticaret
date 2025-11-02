// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Ayarları getir
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // İlk ayar kaydını getir veya oluştur
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Ayarları güncelle
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // İlk ayar kaydını bul veya oluştur
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    // Güncelle
    const updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        ...data,
        freeShippingLimit: data.freeShippingLimit ? parseFloat(data.freeShippingLimit) : undefined,
        shippingCost: data.shippingCost ? parseFloat(data.shippingCost) : undefined,
        smtpPort: data.smtpPort ? parseInt(data.smtpPort) : undefined,
      },
    });

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}