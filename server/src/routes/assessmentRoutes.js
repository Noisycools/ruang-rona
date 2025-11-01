const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getQuestions, submitAssessment, getAssessmentResult } = require('../controllers/assessmentController');

// // Rute untuk mendapatkan semua pertanyaan assessment
// router.get('/questions', auth, getQuestions);

// // Rute untuk mengirimkan hasil assessment
// router.post('/', auth, submitAssessment);

// router.get('/:sessionId', auth, getAssessmentResult);


router.get('/questions', getQuestions);
router.post('/', submitAssessment);
router.get('/:sessionId', getAssessmentResult);

module.exports = router;