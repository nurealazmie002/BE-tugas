import prisma from './src/prisma';

async function main() {
  console.log("🚀 Memulai Seeding...");

  const user = await prisma.user.upsert({
    where: { email: "budi@test.com" },
    update: {},
    create: {
      name: "Budi Tester",
      email: "budi@test.com",
    },
  });

  const store = await prisma.store.upsert({
    where: { email: "kontak@tokobudi.com" },
    update: {},
    create: {
      name: "Toko Budi Sejahtera",
      email: "kontak@tokobudi.com",
      address: "Jl. Merdeka No. 1",
    },
  });

  const category = await prisma.category.upsert({
    where: { name: "Elektronik" },
    update: {},
    create: {
      name: "Elektronik",
    },
  });

  const product = await prisma.product.create({
    data: {
      name: "Mouse Wireless",
      description: "Mouse tanpa kabel responsif",
      price: 150000,
      stock: 50,
      storeId: store.id,
      categoryId: category.id,
    }
  });

  console.log("✅ Seeding Selesai!");
  console.log("--------------------------");
  console.log("👉 USER ID     :", user.id);
  console.log("👉 STORE ID    :", store.id);
  console.log("👉 CATEGORY ID :", category.id);
  console.log("👉 PRODUCT ID  :", product.id);
  console.log("--------------------------");
  console.log("Gunakan ID di atas untuk testing Transaction di Postman.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });