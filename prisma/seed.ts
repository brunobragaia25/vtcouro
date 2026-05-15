import { prisma } from '../src/lib/prisma';

async function main() {
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

  // Create products
  await prisma.product.create({
    data: {
      name: 'Carteira Clássica',
      slug: 'carteira-classica',
      sku: 'CT-001',
      description: 'Carteira slim em couro vegetal, costura à mão, espaço para 12 cartões.',
      categoryId: carteiras.id,
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Carteira Premium',
      slug: 'carteira-premium',
      sku: 'CT-002',
      description: 'Couro Florence com acabamento manual, porta-cartão integrado.',
      categoryId: carteiras.id,
      isFeatured: false,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bolsa Executiva',
      slug: 'bolsa-executiva',
      sku: 'BL-001',
      description: 'Bolsa estruturada em couro encerado, alça regulável e forro em algodão.',
      categoryId: bolsas.id,
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bolsa Tiracolo',
      slug: 'bolsa-tiracolo',
      sku: 'BL-002',
      description: 'Modelo casual em couro pull-up, alça ajustável.',
      categoryId: bolsas.id,
      isFeatured: false,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Pasta Executiva',
      slug: 'pasta-executiva',
      sku: 'PT-001',
      description: 'Pasta para notebook em couro liso, divisórias internas.',
      categoryId: pastas.id,
      isFeatured: true,
    },
  });

  // Create quotes
  const quote1 = await prisma.quote.create({
    data: {
      protocolNumber: '0501-00001',
      name: 'João Silva',
      email: 'joao@xyzltda.com',
      phone: '(11) 98765-4321',
      company: 'XYZ Ltda',
      status: 'novo',
    },
  });

  await prisma.quoteItem.createMany({
    data: [
      { quoteId: quote1.id, productId: (await prisma.product.findFirst({ where: { sku: 'CT-001' } }))!.id, quantity: 50 },
      { quoteId: quote1.id, productId: (await prisma.product.findFirst({ where: { sku: 'BL-001' } }))!.id, quantity: 40 },
    ],
  });

  const quote2 = await prisma.quote.create({
    data: {
      protocolNumber: '0501-00002',
      name: 'Maria Almeida',
      email: 'maria@boutique.com',
      company: 'Boutique M',
      status: 'em_progresso',
    },
  });

  await prisma.quoteItem.createMany({
    data: [
      { quoteId: quote2.id, productId: (await prisma.product.findFirst({ where: { sku: 'CT-002' } }))!.id, quantity: 75 },
    ],
  });

  const quote3 = await prisma.quote.create({
    data: {
      protocolNumber: '0501-00003',
      name: 'Pedro Ramos',
      email: 'pedro@ramosecia.com',
      company: 'Ramos & Cia',
      status: 'respondido',
    },
  });

  await prisma.quoteItem.createMany({
    data: [
      { quoteId: quote3.id, productId: (await prisma.product.findFirst({ where: { sku: 'PT-001' } }))!.id, quantity: 50 },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
