const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listExercises(req, res) {
  try {
    const items = await prisma.exerciseRecommendation.findMany({
      orderBy: { createdAt: 'asc' },
      include: { modules: { orderBy: { id: 'asc' } } }
    });

    // map to client-friendly shape
    const mapped = items.map((it) => ({
      id: it.id,
      code: it.code,
      title: it.title,
      slug: it.slug,
      description: it.content || '',
      // use code as category; client can map to labels
      category: it.code,
      // placeholders for fields client may expect
      duration: 'varies',
      level: 'Pemula',
      points: 50,
      modules: (it.modules || []).map(m => ({ id: m.id, title: m.title, slug: m.slug, content: m.content })),
      createdAt: it.createdAt
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
}

async function getExerciseById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const it = await prisma.exerciseRecommendation.findUnique({
      where: { id },
      include: { modules: { orderBy: { id: 'asc' } } }
    });
    if (!it) return res.status(404).json({ error: 'not found' });

    const mapped = {
      id: it.id,
      code: it.code,
      title: it.title,
      slug: it.slug,
      description: it.content || '',
      category: it.code,
      duration: 'varies',
      level: 'Pemula',
      points: 50,
      modules: (it.modules || []).map(m => ({ id: m.id, title: m.title, slug: m.slug, content: m.content })),
      createdAt: it.createdAt
    };
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
}

async function getProgress(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const rows = await prisma.exerciseProgress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

/*
  Body expected:
  {
    userId: string,
    exerciseType: string,   // match recommendation.code
    exerciseTitle?: string,
    completed?: boolean,
    notes?: string,
    streak?: number
  }
*/
async function upsertProgress(req, res) {
  const { userId, exerciseType, exerciseTitle, completed = false, notes, streak = 0 } = req.body;
  if (!userId || !exerciseType) return res.status(400).json({ error: 'userId and exerciseType required' });

  try {
    // find existing by userId + exerciseType
    const existing = await prisma.exerciseProgress.findFirst({
      where: { userId, exerciseType }
    });

    if (existing) {
      const updated = await prisma.exerciseProgress.update({
        where: { id: existing.id },
        data: {
          exerciseTitle: exerciseTitle || existing.exerciseTitle,
          completed,
          completedAt: completed ? new Date() : existing.completedAt,
          notes,
          streak,
          updatedAt: new Date()
        }
      });
      return res.json(updated);
    } else {
      const created = await prisma.exerciseProgress.create({
        data: {
          userId,
          exerciseType,
          exerciseTitle: exerciseTitle || '',
          completed,
          completedAt: completed ? new Date() : null,
          notes,
          streak
        }
      });
      return res.json(created);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upsert progress' });
  }
}

module.exports = {
  listExercises,
  getExerciseById,
  getProgress,
  upsertProgress
};