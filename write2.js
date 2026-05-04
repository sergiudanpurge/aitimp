const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany({ take: 5 });
  users.forEach(u => console.log('User:', u.id, u.name));
  await prisma.$disconnect();
}

test().catch(e => { console.log('Error:', e.message); prisma.$disconnect(); });