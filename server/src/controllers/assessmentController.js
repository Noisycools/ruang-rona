const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getQuestions = async (req, res) => {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return res.json({
      success: true,
      data: questions
    });
  } catch (err) {
    console.error('getQuestions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil pertanyaan'
    });
  }
};

/**
 * POST /api/assesments
 * body:
 * {
 *   "answers": [
 *     { "questionId": 1, "answer": "akademik" },
 *     { "questionId": 2, "answer": "hampir tiap hari" },
 *     { "questionId": 3, "answer": "banget" }
 *   ]
 * }
 */
exports.submitAssessment = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { answers = [] } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Jawaban tidak boleh kosong'
      });
    }

    const session = await prisma.assessmentSession.create({
      data: {
        userId: String(userId) 
      }
    });

    const answerData = answers.map((a) => ({
      sessionId: session.id,
      questionId: a.questionId,
      answer: a.answer
    }));

    await prisma.assessmentAnswer.createMany({
      data: answerData
    });

    const counts = {}; // { akademik: 3, sosial: 1, ... }

    for (const a of answers) {
      let val = a.answer;
      if (Array.isArray(val)) {
        val = val[0];
      }
      if (!val) continue;

      const key = String(val).toLowerCase();

      counts[key] = (counts[key] || 0) + 1;
    }

    let mainArea = null;
    if (Object.keys(counts).length > 0) {
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      mainArea = sorted[0][0];
    }

    if (!mainArea) {
      const first = answers.find((a) => a.questionId === 1);
      if (first) {
        mainArea = Array.isArray(first.answer) ? first.answer[0] : first.answer;
        if (mainArea) {
          mainArea = String(mainArea).toLowerCase();
        }
      }
    }

    if (mainArea) {
      await prisma.assessmentSession.update({
        where: { id: session.id },
        data: { mainArea }
      });
    }

    let recommendation = null;
    if (mainArea) {
      recommendation = await prisma.exerciseRecommendation.findFirst({
        where: { code: mainArea }
      });
    }

    const rec = await prisma.exerciseRecommendation.findFirst({
      where: { code: mainArea }
    });

    await prisma.exerciseProgress.create({
      data: {
        userId,
        exerciseType: 'default',
        exerciseTitle: rec ? rec.title : 'Latihan dari sistem',
        exerciseRecommendationId: rec ? rec.id : null,
      }
    });


    return res.json({
      success: true,
      sessionId: session.id,
      mainArea,
      recommendation
    });
  } catch (err) {
    console.error('submitAssessment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan assessment'
    });
  }
};

exports.getAssessmentResult = async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);

    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session tidak ditemukan'
      });
    }

    let recommendation = null;
    if (session.mainArea) {
      recommendation = await prisma.exerciseRecommendation.findFirst({
        where: { code: session.mainArea }
      });
    }

    return res.json({
      success: true,
      data: {
        id: session.id,
        mainArea: session.mainArea,
        answers: session.answers.map(a => ({
          questionId: a.questionId,
          question: a.question.question,
          answer: a.answer
        })),
        recommendation
      }
    });
  } catch (err) {
    console.error('getAssessmentResult error:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil hasil assessment'
    });
  }
};

exports.getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const sessions = await prisma.assessmentSession.findMany({
      where: {
        userId: String(userId)
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    const data = sessions.map((s) => ({
      id: s.id,
      mainArea: s.mainArea,
      createdAt: s.createdAt,
      previewAnswers: s.answers.slice(0, 2).map((a) => ({
        question: a.question?.question ?? '',
        answer: a.answer
      }))
    }));

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('getAssessmentHistory error:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat assessment'
    });
  }
};
