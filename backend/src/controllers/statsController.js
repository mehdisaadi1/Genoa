const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
  try {
    const totalMembers = await prisma.member.count();
    const menCount = await prisma.member.count({ where: { gender: 'M' } });
    const womenCount = await prisma.member.count({ where: { gender: 'F' } });

    // Calculate life expectancy
    const deadMembers = await prisma.member.findMany({
      where: {
        birthDate: { not: null },
        deathDate: { not: null }
      },
      select: { birthDate: true, deathDate: true }
    });

    let totalLifeSpan = 0;
    deadMembers.forEach(m => {
      const ms = m.deathDate.getTime() - m.birthDate.getTime();
      totalLifeSpan += ms / (1000 * 60 * 60 * 24 * 365.25);
    });
    
    const lifeExpectancy = deadMembers.length > 0 ? (totalLifeSpan / deadMembers.length).toFixed(1) : 0;

    // We can also calculate other stats like generations etc. (complex to do without querying the full graph)
    res.json({
      totalMembers,
      menCount,
      womenCount,
      lifeExpectancy,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
