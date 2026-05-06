const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findFirst({
  where: { name: 'Marcel' },
  select: { id: true, name: true, role: true, accountType: true, companyId: true }
}).then(r => {
  console.log(JSON.stringify(r, null, 2));
  p.$disconnect();
});