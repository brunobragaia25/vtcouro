import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, sku, categoryId, description, minQuantity, customization, care, imageUrl, isActive, isFeatured, isNew, orderIndex, featuredOrder, newOrder } = body;

    const updateData: any = {
      name,
      slug: slug || name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      sku,
      categoryId,
      description,
      customization,
      care,
      imageUrl,
      isActive: isActive !== false,
      isFeatured: isFeatured || false,
      isNew: isNew || false,
      orderIndex: orderIndex ?? 0,
      featuredOrder: featuredOrder ?? 0,
      newOrder: newOrder ?? 0,
      updatedAt: new Date(),
    };

    if (minQuantity) {
      updateData.minQuantity = minQuantity;
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
