export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId');

    const subcategories = await prisma.subcategory.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        products: { select: { id: true } }
      },
      orderBy: { orderIndex: 'asc' },
    });

    const subcategoriesWithCount = subcategories.map(sub => ({
      ...sub,
      products: sub.products.length,
    }));

    return NextResponse.json(subcategoriesWithCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { categoryId, name, slug, description } = body;

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId,
        name,
        slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'),
        description,
      },
      include: {
        products: { select: { id: true } }
      },
    });

    return NextResponse.json({ ...subcategory, products: 0 }, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json({ error: 'Failed to create subcategory', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { subcategories } = body;

    await Promise.all(
      subcategories.map((sub: any, idx: number) =>
        prisma.subcategory.update({
          where: { id: sub.id },
          data: { orderIndex: idx },
        })
      )
    );

    return NextResponse.json({ message: 'Subcategories reordered' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder subcategories' }, { status: 500 });
  }
}
