import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear existing data
    await prisma.quoteItem.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.product.deleteMany();
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();

    // Create categories
    const carteiras = await prisma.category.create({
      data: {
        name: 'Carteiras',
        slug: 'carteiras',
        description: 'Carteiras slim, longas, masculinas e femininas.',
        orderIndex: 0,
      },
    });

    const bolsas = await prisma.category.create({
      data: {
        name: 'Bolsas',
        slug: 'bolsas',
        description: 'Bolsas executivas, tiracolo e modelos casuais.',
        orderIndex: 1,
      },
    });

    const pastas = await prisma.category.create({
      data: {
        name: 'Pastas',
        slug: 'pastas',
        description: 'Pastas para notebook, portfólio e documentos.',
        orderIndex: 2,
      },
    });

    const sacolas = await prisma.category.create({
      data: {
        name: 'Sacolas',
        slug: 'sacolas',
        description: 'Sacolas amplas, modelos para feira e shopping.',
        orderIndex: 3,
      },
    });

    const mochila = await prisma.category.create({
      data: {
        name: 'Mochila',
        slug: 'mochila',
        description: 'Mochilas urbanas, clássicas e exploradoras.',
        orderIndex: 4,
      },
    });

    // Create products
    const p1 = await prisma.product.create({
      data: {
        name: 'Carteira Clássica',
        slug: 'carteira-classica',
        sku: 'CT-001',
        description: 'Carteira slim em couro vegetal, costura à mão, espaço para 12 cartões.',
        categoryId: carteiras.id,
        isFeatured: true,
      },
    });

    const p2 = await prisma.product.create({
      data: {
        name: 'Carteira Premium',
        slug: 'carteira-premium',
        sku: 'CT-002',
        description: 'Couro Florence com acabamento manual, porta-cartão integrado.',
        categoryId: carteiras.id,
        isFeatured: false,
      },
    });

    const p3 = await prisma.product.create({
      data: {
        name: 'Bolsa Executiva',
        slug: 'bolsa-executiva',
        sku: 'BL-001',
        description: 'Bolsa estruturada em couro encerado, alça regulável e forro em algodão.',
        categoryId: bolsas.id,
        isFeatured: true,
      },
    });

    const p4 = await prisma.product.create({
      data: {
        name: 'Bolsa Tiracolo',
        slug: 'bolsa-tiracolo',
        sku: 'BL-002',
        description: 'Modelo casual em couro pull-up, alça ajustável.',
        categoryId: bolsas.id,
        isFeatured: false,
      },
    });

    const p5 = await prisma.product.create({
      data: {
        name: 'Pasta Executiva',
        slug: 'pasta-executiva',
        sku: 'PT-001',
        description: 'Pasta para notebook em couro liso, divisórias internas.',
        categoryId: pastas.id,
        isFeatured: true,
      },
    });

    const p6 = await prisma.product.create({
      data: {
        name: 'Pasta Portfólio',
        slug: 'pasta-portfolio',
        sku: 'PT-002',
        description: 'Porta-documentos A4 com bloco de anotações.',
        categoryId: pastas.id,
        isFeatured: false,
      },
    });

    // Create quotes
    const q1 = await prisma.quote.create({
      data: {
        protocolNumber: 'ORC-001',
        name: 'João Silva',
        email: 'joao@xyzltda.com',
        phone: '(11) 98765-4321',
        company: 'XYZ Ltda',
        status: 'novo',
      },
    });

    await prisma.quoteItem.createMany({
      data: [
        { quoteId: q1.id, productId: p1.id, quantity: 50 },
        { quoteId: q1.id, productId: p3.id, quantity: 40 },
      ],
    });

    const q2 = await prisma.quote.create({
      data: {
        protocolNumber: 'ORC-002',
        name: 'Maria Almeida',
        email: 'maria@boutique.com',
        company: 'Boutique M',
        status: 'em_progresso',
      },
    });

    await prisma.quoteItem.createMany({
      data: [
        { quoteId: q2.id, productId: p2.id, quantity: 75 },
      ],
    });

    const q3 = await prisma.quote.create({
      data: {
        protocolNumber: 'ORC-003',
        name: 'Pedro Ramos',
        email: 'pedro@ramosecia.com',
        company: 'Ramos & Cia',
        status: 'respondido',
      },
    });

    await prisma.quoteItem.createMany({
      data: [
        { quoteId: q3.id, productId: p5.id, quantity: 50 },
      ],
    });

    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
