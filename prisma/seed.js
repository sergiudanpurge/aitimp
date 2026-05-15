
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Stergem datele vechi...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany({ where: { email: { contains: 'demo' } } });

  const pass = await bcrypt.hash('parola123', 10);

  console.log('👑 Cream Administrator...');
  const admin = await prisma.user.create({
    data: {
      name: 'Color Craft Studio',
      email: 'admin.demo@aitimp.ro',
      password: pass,
      role: 'admin',
      accountType: 'company',
      phone: '0756123456',
      judet: 'Bihor',
      oras: 'Oradea',
      adresa: 'Str. Republicii 12',
      description: 'Salonul nostru ofera servicii premium de coafura si beauty. Cu o echipa de profesionisti cu experienta de peste 10 ani, garantam rezultate exceptionale.',
      facebook: 'https://facebook.com/colorcraftstudio',
      instagram: 'https://instagram.com/colorcraftstudio',
      website: 'https://colorcraft.ro',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CC&backgroundColor=c9a96e',
      isActive: true,
      emailVerified: true,
    }
  });

  const adminProvider = await prisma.provider.create({
    data: {
      userId: admin.id,
      companyName: 'Color Craft Studio',
      description: 'Salon premium de coafura in Oradea',
      category: 'Coafura',
      rating: 4.9,
      reviewCount: 142,
      isCompany: true,
      gallery: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
      ],
      workStart: '09:00',
      workEnd: '19:00',
    }
  });

  console.log('👨‍💼 Cream Angajati...');
  const emp1 = await prisma.user.create({
    data: {
      name: 'Mirel Popescu',
      email: 'mirel.demo@aitimp.ro',
      password: pass,
      role: 'employee',
      accountType: 'private',
      phone: '0745789012',
      judet: 'Bihor',
      oras: 'Oradea',
      description: 'Coafor senior cu 8 ani experienta. Specialist in tuns barbatesc clasic si modern.',
      instagram: 'https://instagram.com/mirel.coafor',
      facebook: 'https://facebook.com/mirel.coafor',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MP&backgroundColor=5a8de0',
      companyId: admin.id,
      isActive: true,
      emailVerified: true,
    }
  });

  const emp2 = await prisma.user.create({
    data: {
      name: 'Ioana Danila',
      email: 'ioana.demo@aitimp.ro',
      password: pass,
      role: 'employee',
      accountType: 'private',
      phone: '0732456789',
      judet: 'Bihor',
      oras: 'Oradea',
      description: 'Stilist si colorist profesionist. Expertiza in vopsit, balayage si tratamente de ingrijire.',
      instagram: 'https://instagram.com/ioana.stilist',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ID&backgroundColor=e05a5a',
      companyId: admin.id,
      isActive: true,
      emailVerified: true,
    }
  });

  const prov1 = await prisma.provider.create({
    data: {
      userId: emp1.id,
      description: 'Coafor senior specializat in tuns barbatesc',
      category: 'Coafura',
      rating: 4.97,
      reviewCount: 87,
      isCompany: false,
      gallery: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
        'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400',
      ],
      workStart: '09:00',
      workEnd: '18:00',
    }
  });

  const prov2 = await prisma.provider.create({
    data: {
      userId: emp2.id,
      description: 'Stilist si colorist cu peste 6 ani experienta',
      category: 'Coafura',
      rating: 4.7,
      reviewCount: 55,
      isCompany: false,
      gallery: [
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
      ],
      workStart: '10:00',
      workEnd: '19:00',
    }
  });

  console.log('✂️ Cream Servicii...');
  const s1 = await prisma.service.create({ data: { providerId: prov1.id, name: 'Tuns + Styling', duration: 1, price: 45, icon: '✂️', isActive: true } });
  const s2 = await prisma.service.create({ data: { providerId: prov1.id, name: 'Vopsit complet', duration: 3, price: 180, icon: '🎨', isActive: true } });
  const s3 = await prisma.service.create({ data: { providerId: prov1.id, name: 'Tuns + Spalat + Uscat', duration: 2, price: 70, icon: '💈', isActive: true } });
  const s4 = await prisma.service.create({ data: { providerId: prov2.id, name: 'Balayage', duration: 4, price: 250, icon: '✨', isActive: true } });
  const s5 = await prisma.service.create({ data: { providerId: prov2.id, name: 'Tratament keratina', duration: 3, price: 200, icon: '💆', isActive: true } });
  const s6 = await prisma.service.create({ data: { providerId: prov2.id, name: 'Coafat ocazie', duration: 2, price: 120, icon: '👑', isActive: true } });

  console.log('👥 Cream Clienti...');
  const clients = await Promise.all([
    prisma.user.create({ data: { name: 'Dorin Mihai', email: 'dorin.demo@aitimp.ro', password: pass, role: 'client', accountType: 'private', phone: '0722111222', judet: 'Bihor', oras: 'Oradea', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DM&backgroundColor=4caf82', isActive: true, emailVerified: true } }),
    prisma.user.create({ data: { name: 'Ana Constantin', email: 'ana.demo@aitimp.ro', password: pass, role: 'client', accountType: 'private', phone: '0733222333', judet: 'Bihor', oras: 'Oradea', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AC&backgroundColor=e8b84b', isActive: true, emailVerified: true } }),
    prisma.user.create({ data: { name: 'Radu Georgescu', email: 'radu.demo@aitimp.ro', password: pass, role: 'client', accountType: 'private', phone: '0744333444', judet: 'Cluj', oras: 'Cluj-Napoca', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RG&backgroundColor=a78de0', isActive: true, emailVerified: true } }),
    prisma.user.create({ data: { name: 'Maria Ionescu', email: 'maria.demo@aitimp.ro', password: pass, role: 'client', accountType: 'private', phone: '0755444555', judet: 'Bihor', oras: 'Oradea', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MI&backgroundColor=e05a5a', isActive: true, emailVerified: true } }),
    prisma.user.create({ data: { name: 'Paul Stanescu', email: 'paul.demo@aitimp.ro', password: pass, role: 'client', accountType: 'private', phone: '0766555666', judet: 'Timis', oras: 'Timisoara', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PS2&backgroundColor=5a8de0', isActive: true, emailVerified: true } }),
  ]);

  console.log('📅 Cream Rezervari...');
  const today = new Date();
  const bookingsData = [
    { clientId: clients[0].id, providerId: prov1.id, serviceId: s1.id, date: formatDate(today, -2), time: '09:00', status: 'completed', totalPrice: 45 },
    { clientId: clients[1].id, providerId: prov2.id, serviceId: s4.id, date: formatDate(today, -5), time: '11:00', status: 'completed', totalPrice: 250 },
    { clientId: clients[2].id, providerId: prov1.id, serviceId: s3.id, date: formatDate(today, -7), time: '14:00', status: 'completed', totalPrice: 70 },
    { clientId: clients[3].id, providerId: prov2.id, serviceId: s5.id, date: formatDate(today, -10), time: '10:00', status: 'completed', totalPrice: 200 },
    { clientId: clients[0].id, providerId: prov1.id, serviceId: s2.id, date: formatDate(today, 2), time: '10:00', status: 'accepted', totalPrice: 180 },
    { clientId: clients[1].id, providerId: prov2.id, serviceId: s6.id, date: formatDate(today, 3), time: '14:00', status: 'accepted', totalPrice: 120 },
    { clientId: clients[2].id, providerId: prov1.id, serviceId: s1.id, date: formatDate(today, 1), time: '09:30', status: 'pending', totalPrice: 45 },
    { clientId: clients[3].id, providerId: prov2.id, serviceId: s4.id, date: formatDate(today, 5), time: '12:00', status: 'pending', totalPrice: 250 },
    { clientId: clients[4].id, providerId: prov1.id, serviceId: s3.id, date: formatDate(today, -1), time: '15:00', status: 'cancelled', totalPrice: 70 },
    { clientId: clients[0].id, providerId: prov2.id, serviceId: s5.id, date: formatDate(today, 7), time: '11:00', status: 'pending', totalPrice: 200 },
  ];

  const bookings = await Promise.all(bookingsData.map(b => prisma.booking.create({ data: b })));

  console.log('⭐ Cream Recenzii...');
  await Promise.all([
    prisma.review.create({ data: { clientId: clients[0].id, providerId: prov1.id, rating: 5, comment: 'Mirel e extraordinar! Stie exact ce vrei chiar daca nu stii sa explici. Cel mai bun coafor din oras, revin cu placere de fiecare data. Atmosfera din salon e super relaxanta.' } }),
    prisma.review.create({ data: { clientId: clients[1].id, providerId: prov2.id, rating: 5, comment: 'Servicii impecabile, atmosfera placuta si preturi corecte. Ioana a fost super profesionista si m-a consiliat perfect pentru culoarea potrivita. Recomand cu toata increderea!' } }),
    prisma.review.create({ data: { clientId: clients[2].id, providerId: prov1.id, rating: 4, comment: 'Foarte multumit de rezultat. Putin timp de asteptare fata de programare, dar merita din plin. Mirel e mereu atent la detalii.' } }),
    prisma.review.create({ data: { clientId: clients[3].id, providerId: prov2.id, rating: 5, comment: 'Am venit pentru un balayage si am ramas uimita de rezultat. Ioana are o rabdare extraordinara si explica fiecare pas. O sa revin cu siguranta!' } }),
    prisma.review.create({ data: { clientId: clients[4].id, providerId: prov1.id, rating: 5, comment: 'Salon curat, personal amabil, programare rapida. Mirel e un profesionist desavarsit. Il recomand tuturor.' } }),
  ]);

  console.log('🗓 Cream sloturi disponibilitate...');
  const days = [1, 2, 3, 4, 5];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  
  for (const day of days) {
    for (const time of times) {
      await prisma.availabilitySlot.create({
        data: {
          providerId: prov1.id,
          date: formatDate(today, day),
          time,
          isBooked: Math.random() < 0.3,
        }
      });
    }
  }

  console.log('\n✅ SEED COMPLET!');
  console.log('📧 Conturi demo:');
  console.log('   Admin:   admin.demo@aitimp.ro / parola123');
  console.log('   Angajat: mirel.demo@aitimp.ro / parola123');
  console.log('   Angajat: ioana.demo@aitimp.ro / parola123');
  console.log('   Client:  dorin.demo@aitimp.ro / parola123');
}

function formatDate(date, offsetDays) {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

main().catch(console.error).finally(() => prisma.$disconnect());
