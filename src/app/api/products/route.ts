export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, sku, categoryId, description, minQuantity, availableColors, specifications, customization, care, imageUrl, isActive, isFeatured, isNew } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        sku,
        categoryId,
        description,
        minQuantity: minQuantity || 50,
        availableColors: availableColors || ['Caramelo', 'Preto', 'Marrom', 'Natural'],
        specifications: specifications || {},
        customization,
        care,
        imageUrl,
        isActive: isActive !== false,
        isFeatured: isFeatured || false,
        isNew: isNew || false,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
