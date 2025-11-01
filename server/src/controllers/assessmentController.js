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
    const userId = req.user.id;
    const { answers = [] } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Jawaban tidak boleh kosong'
      });
    }

    const session = await prisma.assessmentSession.create({
      data: {
        userId: userId
      }
    });

    for (const a of answers) {
      await prisma.assessmentAnswer.create({
        data: {
          sessionId: session.id,
          questionId: a.questionId,
          answer: a.answer
        }
      });
    }

    let mainArea = null;
    const first = answers.find(a => a.questionId === 1);
    if (first) {
      mainArea = Array.isArray(first.answer) ? first.answer[0] : first.answer;
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

