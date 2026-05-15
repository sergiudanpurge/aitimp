const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.service.deleteMany({ where: { provider: { user: { email: { contains: 'demo' } } } } });
  await prisma.provider.deleteMany({ where: { user: { email: { contains: 'demo' } } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'demo' } } });
  console.log('Gata! Date demo sterse.');
  await prisma.$disconnect();
}

clean().catch(console.error);