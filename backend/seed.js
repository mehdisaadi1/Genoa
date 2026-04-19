const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Create an admin user first
  let user = await prisma.user.findUnique({ where: { email: 'admin@genoa.com' } });
  if (!user) {
    const hash = await bcrypt.hash('admin123', 10);
    user = await prisma.user.create({
      data: {
        email: 'admin@genoa.com',
        password_hash: hash,
        role: 'Admin',
        is_validated: true
      }
    });
    console.log('Created Admin user: admin@genoa.com (admin123)');
  }

  // Create members
  const g1m1 = await prisma.member.create({
    data: { firstName: 'Jean', lastName: 'Dupont', gender: 'M', birthDate: new Date('1950-01-01'), authorId: user.id }
  });
  const g1f1 = await prisma.member.create({
    data: { firstName: 'Marie', lastName: 'Dupont', gender: 'F', birthDate: new Date('1952-05-12'), authorId: user.id }
  });

  const g2m1 = await prisma.member.create({
    data: { firstName: 'Pierre', lastName: 'Dupont', gender: 'M', birthDate: new Date('1975-08-20'), authorId: user.id }
  });
  const g2f1 = await prisma.member.create({
    data: { firstName: 'Sophie', lastName: 'Martin', gender: 'F', birthDate: new Date('1978-11-30'), authorId: user.id }
  });

  const g3m1 = await prisma.member.create({
    data: { firstName: 'Lucas', lastName: 'Dupont', gender: 'M', birthDate: new Date('2005-02-15'), authorId: user.id }
  });

  // Create relations (Couples)
  await prisma.couple.create({
    data: { partner1Id: g1m1.id, partner2Id: g1f1.id, startDate: new Date('1970-06-01') }
  });
  await prisma.couple.create({
    data: { partner1Id: g2m1.id, partner2Id: g2f1.id, startDate: new Date('2000-09-10') }
  });

  // Create relations (Parent-Child)
  // Jean is parent of Pierre
  await prisma.relation.create({ data: { parentId: g1m1.id, childId: g2m1.id, type: 'Biological' } });
  // Marie is parent of Pierre
  await prisma.relation.create({ data: { parentId: g1f1.id, childId: g2m1.id, type: 'Biological' } });

  // Pierre is parent of Lucas
  await prisma.relation.create({ data: { parentId: g2m1.id, childId: g3m1.id, type: 'Biological' } });
  // Sophie is parent of Lucas
  await prisma.relation.create({ data: { parentId: g2f1.id, childId: g3m1.id, type: 'Biological' } });

  console.log('Database seeded with a small family tree.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
