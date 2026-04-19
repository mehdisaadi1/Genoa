const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    // Filter private data if user is not author nor Admin
    const filteredMembers = members.filter(m => {
      if (!m.isPrivate) return true;
      if (req.user.role === 'Admin' || m.authorId === req.user.id) return true;
      return false;
    });
    res.json(filteredMembers);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        parentsRelation: true,
        childrenRelation: true,
        partners1: true,
        partners2: true
      }
    });

    if (!member) return res.status(404).json({ error: 'Not found' });

    if (member.isPrivate && req.user.role !== 'Admin' && member.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Private data' });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const data = req.body;
    // Format dates if they exist
    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    if (data.deathDate) data.deathDate = new Date(data.deathDate);
    
    data.authorId = req.user.id;

    const member = await prisma.member.create({ data });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    // Check existing
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (existing.isPrivate && req.user.role !== 'Admin' && existing.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Cannot edit this private member' });
    }

    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    if (data.deathDate) data.deathDate = new Date(data.deathDate);

    // Prevent modifying authorId
    delete data.authorId;

    const member = await prisma.member.update({ where: { id }, data });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    if (existing.isPrivate && req.user.role !== 'Admin' && existing.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Cannot delete this private member' });
    }

    await prisma.member.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
