export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

async function generateOrderNumber() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  let count = 0;
  for (let i = 0; i < 3; i++) {
    try {
      count = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });
      break;
    } catch (error) {
      if (i === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }

  const sequence = String(count + 1).padStart(5, '0');
  return `PED${month}${day}-${sequence}`;
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  try {
    const orders = await prisma.order.findMany({
      include: {
        quote: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, totalValue } = body;

    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    // Check if quote exists and is in "respondido" status
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.status !== 'respondido') {
      return NextResponse.json(
        { error: 'Quote must be in "respondido" status to create an order' },
        { status: 400 }
      );
    }

    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        quoteId,
        totalValue: totalValue || null,
        status: 'pendente',
      },
      include: {
        quote: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
