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
  console.log('Mulai seeding...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@toko.com' },
  });

  if (existingAdmin) {
    console.log('Admin sudah ada, skip seeding.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@toko.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Sukses buat admin:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });