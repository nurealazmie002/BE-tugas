import prisma from './src/prisma';
import bcrypt from 'bcrypt'; // 👈 Import bcrypt untuk hash password

async function main() {
  console.log("🚀 Memulai Seeding...");

  // 1. Hash password dulu
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Seed User (PERBAIKI: tambah password dan hubungkan ke store)
  const user = await prisma.user.upsert({
    where: { email: "budi@test.com" },
    update: {},
    create: {
      username: "buditester", // 👈 Username harus unique dan lowercase lebih baik
      email: "budi@test.com",
      password: hashedPassword, // 👈 TAMBAHKAN INI (wajib!)
      role: "customer", // 👈 Optional, default sudah "customer"
    },
  });

  console.log("✅ User created:", user.username);

  // 3. Seed Profile (TAMBAHAN - sekarang ada model Profile terpisah)
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: "Budi Tester", // 👈 Nama lengkap sekarang di Profile
      gender: "male",
      address: "Jl. Sudirman No. 123, Jakarta",
      image: null,
      userId: user.id,
    },
  });

  console.log("✅ Profile created:", profile.name);

  // 4. Seed Store (PERBAIKI: hubungkan ke user)
  const store = await prisma.store.upsert({
    where: { email: "kontak@tokobudi.com" },
    update: {},
    create: {
      name: "Toko Budi Sejahtera",
      email: "kontak@tokobudi.com",
      address: "Jl. Merdeka No. 1",
      phone: "081234567890", // 👈 Optional tapi bagus ditambahkan
      description: "Toko serba ada terlengkap",
      userId: user.id, // 👈 PENTING: Relasi ke user!
    },
  });

  console.log("✅ Store created:", store.name);

  // 5. Seed Category
  const category = await prisma.category.upsert({
    where: { name: "Elektronik" },
    update: {},
    create: {
      name: "Elektronik",
      description: "Peralatan elektronik dan gadget", // 👈 Optional
    },
  });

  console.log("✅ Category created:", category.name);

  // 6. Seed Product
  const product = await prisma.product.create({
    data: {
      name: "Mouse Wireless Logitech",
      description: "Mouse tanpa kabel responsif dengan sensor optical",
      price: 150000,
      stock: 50,
      image: null, // 👈 Bisa null atau kasih default image
      storeId: store.id,
      categoryId: category.id,
    }
  });

  console.log("✅ Product created:", product.name);

  console.log("\n🎉 Seeding Selesai!");
  console.log("📋 CREDENTIALS FOR LOGIN:");
  console.log("   Email    : budi@test.com");
  console.log("   Password : password123");
  console.log("📦 SEEDED DATA IDs:");
  console.log("   USER ID     :", user.id);
  console.log("   PROFILE ID  :", profile.id);
  console.log("   STORE ID    :", store.id);
  console.log("   CATEGORY ID :", category.id);
  console.log("   PRODUCT ID  :", product.id);
  console.log("💡 Gunakan ID di atas untuk testing di Postman.");
  console.log("💡 Login dengan email & password di atas untuk dapat JWT token.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });