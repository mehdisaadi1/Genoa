const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Deep search to prevent cycle
async function hasCycle(startChildId, potentialParentId) {
  if (startChildId === potentialParentId) return true; // Direct cycle

  // Find all ancestors of potentialParentId
  let queue = [potentialParentId];
  let visited = new Set();

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    if (currentId === startChildId) return true;

    // Get parents of currentId
    const parents = await prisma.relation.findMany({
      where: { childId: currentId }
    });

    for (let p of parents) {
      queue.push(p.parentId);
    }
  }

  return false;
}

exports.createParentChild = async (req, res) => {
  try {
    const { parentId, childId, type } = req.body;
    
    if (parentId === childId) return res.status(400).json({ error: 'A person cannot be their own parent' });

    // Validate cycle
    const cycle = await hasCycle(childId, parentId);
    if (cycle) {
      return res.status(400).json({ error: 'This relation would create a cycle in the tree' });
    }

    const relation = await prisma.relation.create({
      data: { parentId, childId, type: type || 'Biological' }
    });
    
    res.status(201).json(relation);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

exports.deleteParentChild = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.relation.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCouple = async (req, res) => {
  try {
    let { partner1Id, partner2Id, startDate, endDate } = req.body;
    
    if (partner1Id === partner2Id) return res.status(400).json({ error: 'A person cannot be coupled with themselves' });

    // Sort to avoid duplicate pairs in different order
    if (partner1Id > partner2Id) {
      const temp = partner1Id; partner1Id = partner2Id; partner2Id = temp;
    }

    const data = { partner1Id, partner2Id };
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);

    const couple = await prisma.couple.create({ data });
    res.status(201).json(couple);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCouple = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.couple.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
