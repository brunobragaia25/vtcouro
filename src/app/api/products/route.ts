export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, subcategory: true, additionalCategories: true },
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
    const { name, slug, sku, categoryId, subcategoryId, additionalCategoryIds, description, minQuantity, availableColors, specifications, customization, care, images, imageUrl, isActive, isFeatured, isNew } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        sku,
        categoryId,
        subcategoryId: subcategoryId || null,
        description,
        minQuantity: minQuantity || 50,
        availableColors: availableColors || ['Preto', 'Marrom'],
        specifications: specifications || {},
        customization,
        care,
        images: images || [],
        imageUrl,
        isActive: isActive !== false,
        isFeatured: isFeatured || false,
        isNew: isNew || false,
        additionalCategories: {
          connect: (additionalCategoryIds || []).map((id: string) => ({ id })),
        },
      },
      include: { category: true, subcategory: true, additionalCategories: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
