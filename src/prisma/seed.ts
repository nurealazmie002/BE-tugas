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
  console.log(' Mulai seeding...');

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

  console.log('Admin user created:', admin.username);

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

  console.log('Regular user created:', user.username);

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

  console.log('Profile created:', profile.name);

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

  console.log('Store created:', store.name);

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

  const categoryOlahraga = await prisma.category.upsert({
    where: { name: 'Olahraga' },
    update: {},
    create: {
      name: 'Olahraga',
      description: 'Peralatan olahraga dan fitness',
    },
  });

  console.log('Categories created: Elektronik, Fashion, Olahraga');

  const products = [
    {
      name: 'Mouse Wireless Logitech M185',
      description: 'Mouse wireless dengan koneksi 2.4GHz, baterai tahan 1 tahun',
      price: 150000,
      stock: 50,
      categoryId: categoryElektronik.id,
    },
    {
      name: 'Keyboard Mechanical RGB Gaming',
      description: 'Keyboard gaming dengan switch mechanical blue dan RGB lighting',
      price: 850000,
      stock: 25,
      categoryId: categoryElektronik.id,
    },
    {
      name: 'Headset Gaming HyperX Cloud II',
      description: 'Headset gaming 7.1 surround sound dengan mic noise cancelling',
      price: 1200000,
      stock: 15,
      categoryId: categoryElektronik.id,
    },
    {
      name: 'Webcam Logitech C920 HD Pro',
      description: 'Webcam Full HD 1080p untuk streaming dan video call',
      price: 1500000,
      stock: 20,
      categoryId: categoryElektronik.id,
    },
    {
      name: 'SSD Samsung 1TB NVMe',
      description: 'SSD Internal M.2 NVMe dengan kecepatan baca 3500MB/s',
      price: 1800000,
      stock: 30,
      categoryId: categoryElektronik.id,
    },
    {
      name: 'Sepatu Sneakers Nike Air Max 270',
      description: 'Sepatu olahraga nyaman dengan teknologi Air Max cushioning',
      price: 1500000,
      stock: 12,
      categoryId: categoryFashion.id,
    },
    {
      name: 'Jaket Hoodie Adidas Original',
      description: 'Jaket hoodie dengan bahan cotton premium, nyaman dipakai',
      price: 650000,
      stock: 35,
      categoryId: categoryFashion.id,
    },
    {
      name: 'Tas Ransel Bodypack 25L',
      description: 'Tas ransel dengan kompartemen laptop 15 inch dan anti air',
      price: 450000,
      stock: 40,
      categoryId: categoryFashion.id,
    },
    {
      name: 'Matras Yoga Premium 6mm',
      description: 'Matras yoga anti slip dengan ketebalan 6mm, include carrying bag',
      price: 250000,
      stock: 50,
      categoryId: categoryOlahraga.id,
    },
    {
      name: 'Dumbbell Set 20kg',
      description: 'Set dumbbell adjustable 2x10kg dengan plate besi berlapis karet',
      price: 750000,
      stock: 18,
      categoryId: categoryOlahraga.id,
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        ...productData,
        storeId: store.id,
        image: null,
      }
    });
  }

  console.log('Products created:', products.length);
  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });