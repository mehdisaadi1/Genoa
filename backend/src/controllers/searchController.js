const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.searchMembers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const members = await prisma.member.findMany({
      where: {
        OR: [
          { firstName: { contains: q } }, // Prisma SQLite might not support case insensitive gracefully without some flags, but it works fine for basics
          { lastName: { contains: q } }
        ]
      }
    });

    // Filter private
    const filtered = members.filter(m => {
      if (!m.isPrivate) return true;
      if (req.user.role === 'Admin' || m.authorId === req.user.id) return true;
      return false;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
