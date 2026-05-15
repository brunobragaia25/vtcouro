export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: { select: { id: true } }
      },
      orderBy: { orderIndex: 'asc' },
    });

    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      products: cat.products.length,
    }));

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, specificationFields } = body;

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        specificationFields: specificationFields && specificationFields.length > 0 ? specificationFields : null,
      },
      include: {
        products: { select: { id: true } }
      },
    });

    return NextResponse.json({ ...category, products: 0 }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories } = body;

    // Update orderIndex for all categories
    await Promise.all(
      categories.map((cat: any, idx: number) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { orderIndex: idx },
        })
      )
    );

    return NextResponse.json({ message: 'Categories reordered' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
  }
}
