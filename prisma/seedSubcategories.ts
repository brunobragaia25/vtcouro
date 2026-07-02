import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slugify = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');

const DATA: Record<string, string[]> = {
  'linha-propagandista': ['Bolsa de Propagandista', 'Mochila', 'Bolsas de Apoio', 'Porta Tablet'],
  'linha-viagem': ['Bolsa de Viagem', 'Necessaires'],
  'linha-corporativa': ['Bolsa Executiva', 'Mochila', 'Porta Vinho', 'Porta Tablet'],
};

async function main() {
  for (const [categorySlug, names] of Object.entries(DATA)) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      console.warn(`Categoria "${categorySlug}" não encontrada, pulando.`);
      continue;
    }

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const slug = slugify(name);
      await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug } },
        update: { name, orderIndex: i },
        create: { categoryId: category.id, name, slug, orderIndex: i },
      });
      console.log(`OK: ${category.name} > ${name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
