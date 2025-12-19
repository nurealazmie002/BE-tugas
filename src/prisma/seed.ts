import { PrismaClient } from '../generated/client'; 
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Mulai seeding...');

  // 1. Seed Admin User
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@toko.com' },
    update: {},
    create: {
      email: 'admin@toko.com',
      username: 'superadmin',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // 2. Seed Regular User (Customer)
  const hashedPasswordUser = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'budi@test.com' },
    update: {},
    create: {
      email: 'budi@test.com',
      username: 'buditester',
      password: hashedPasswordUser,
      role: 'customer',
    },
  });

  console.log('✅ Regular user created:', user.username);

  // 3. Seed Profile for Regular User
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'Budi Tester',
      gender: 'male',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      image: null,
      userId: user.id,
    },
  });

  console.log('✅ Profile created:', profile.name);

  // 4. Seed Store
  const store = await prisma.store.upsert({
    where: { email: 'kontak@tokobudi.com' },
    update: {},
    create: {
      name: 'Toko Budi Sejahtera',
      email: 'kontak@tokobudi.com',
      address: 'Jl. Merdeka No. 1, Jakarta',
      phone: '081234567890',
      description: 'Toko serba ada terlengkap dan terpercaya',
      userId: user.id,
    },
  });

  console.log('✅ Store created:', store.name);

  // 5. Seed Categories
  const categoryElektronik = await prisma.category.upsert({
    where: { name: 'Elektronik' },
    update: {},
    create: {
      name: 'Elektronik',
      description: 'Peralatan elektronik dan gadget',
    },
  });

  const categoryFashion = await prisma.category.upsert({
    where: { name: 'Fashion' },
    update: {},
    create: {
      name: 'Fashion',
      description: 'Pakaian, sepatu, dan aksesoris',
    },
  });

  console.log('✅ Categories created: Elektronik, Fashion');

  // 6. Seed Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Mouse Wireless Logitech M185',
      description: 'Mouse wireless dengan koneksi 2.4GHz, baterai tahan 1 tahun',
      price: 150000,
      stock: 50,
      image: null,
      storeId: store.id,
      categoryId: categoryElektronik.id,
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Keyboard Mechanical RGB',
      description: 'Keyboard gaming dengan switch mechanical dan RGB lighting',
      price: 850000,
      stock: 25,
      image: null,
      storeId: store.id,
      categoryId: categoryElektronik.id,
    }
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Sepatu Sneakers Nike Air Max',
      description: 'Sepatu olahraga nyaman untuk lari dan aktivitas sehari-hari',
      price: 1500000,
      stock: 15,
      image: null,
      storeId: store.id,
      categoryId: categoryFashion.id,
    }
  });

  console.log('✅ Products created:', product1.name, product2.name, product3.name);

  console.log('\n🎉 Seeding Selesai!');
  console.log('═══════════════════════════════════════════════');
  console.log('📋 LOGIN CREDENTIALS:');
  console.log('');
  console.log('   🔐 ADMIN:');
  console.log('      Email    : admin@toko.com');
  console.log('      Password : admin123');
  console.log('');
  console.log('   👤 CUSTOMER:');
  console.log('      Email    : budi@test.com');
  console.log('      Password : password123');
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('📦 SEEDED DATA IDs:');
  console.log('   Admin ID    :', admin.id);
  console.log('   User ID     :', user.id);
  console.log('   Profile ID  :', profile.id);
  console.log('   Store ID    :', store.id);
  console.log('   Category 1  :', categoryElektronik.id);
  console.log('   Category 2  :', categoryFashion.id);
  console.log('   Product 1   :', product1.id);
  console.log('   Product 2   :', product2.id);
  console.log('   Product 3   :', product3.id);
  console.log('═══════════════════════════════════════════════');
  console.log('💡 Gunakan email & password di atas untuk login');
  console.log('💡 Gunakan ID di atas untuk testing di Postman');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });