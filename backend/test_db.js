import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }
  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
  try {
    const user = await prisma.user.findFirst();
    console.log('Connected! User:', user ? user.email : 'No user');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
