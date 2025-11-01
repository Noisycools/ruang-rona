const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORY_MAP = {
    school: 'school-',
    friends: 'friends-',
    self: 'self-',
    online: 'online-',
    mind: 'mind-',
};

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
            return res.status(401).json({ success: false, message: 'User tidak ditemukan' });
        }

        if (!Array.isArray(answers) || !answers.length) {
            return res.status(400).json({ success: false, message: 'Jawaban tidak boleh kosong' });
        }

        // 1) kita ambil dulu pertanyaan2 nya biar tau mana yg order = 1
        const questions = await prisma.assessmentQuestion.findMany({
            select: { id: true, order: true },
        });

        const order1 = questions.find((q) => q.order === 1);
        // fallback kalo gak ketemu
        const order1QuestionId = order1 ? order1.id : null;

        // 2) buat session
        const session = await prisma.assessmentSession.create({
            data: {
                userId: String(userId),
            },
        });

        // 3) simpan semua jawaban
        for (const a of answers) {
            await prisma.assessmentAnswer.create({
                data: {
                    sessionId: session.id,
                    questionId: a.questionId,
                    answer: a.answer,
                },
            });
        }

        // 4) tentukan mainArea dari JAWABAN yang pertanyaannya order = 1
        let mainArea = null;
        let recommendation = null;

        if (order1QuestionId) {
            const firstAnswer = answers.find(
                (a) => Number(a.questionId) === Number(order1QuestionId)
            );

            if (firstAnswer) {
                const picked = String(
                    Array.isArray(firstAnswer.answer) ? firstAnswer.answer[0] : firstAnswer.answer
                ).toLowerCase();

                const prefix = CATEGORY_MAP[picked];

                if (prefix) {
                    // ambil exercise pertama di kategori itu
                    recommendation = await prisma.exerciseRecommendation.findFirst({
                        where: {
                            code: {
                                startsWith: prefix,
                            },
                        },
                    });
                    mainArea = picked;
                } else {
                    // kalo user jawabnya bukan salah satu kategori kita
                    mainArea = picked;
                }
            }
        }

        // 5) update session
        if (mainArea) {
            await prisma.assessmentSession.update({
                where: { id: session.id },
                data: { mainArea },
            });
        }

        return res.json({
            success: true,
            sessionId: session.id,
            mainArea,
            recommendation,
        });
    } catch (err) {
        console.error('submitAssessment error:', err);
        return res.status(500).json({ success: false, message: 'Gagal menyimpan assessment' });
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
                        question: true,
                    },
                },
            },
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session tidak ditemukan',
            });
        }

        let recommendation = null;

        if (session.mainArea) {
            // session.mainArea sekarang "school" / "friends" / "self" / "online" / "mind"
            recommendation = await prisma.exerciseRecommendation.findFirst({
                where: {
                    code: {
                        startsWith: session.mainArea.toLowerCase() + '-', // "school-", "self-", dst
                    },
                },
            });
        }

        return res.json({
            success: true,
            data: {
                id: session.id,
                mainArea: session.mainArea,
                answers: session.answers.map((a) => ({
                    questionId: a.questionId,
                    question: a.question?.question ?? '',
                    answer: a.answer,
                })),
                recommendation,
            },
        });
    } catch (err) {
        console.error('getAssessmentResult error:', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil hasil assessment',
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