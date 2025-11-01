const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getQuestions, submitAssessment, getAssessmentResult, getAssessmentHistory } = require('../controllers/assessmentController');

router.get('/questions', auth, getQuestions);
router.post('/', auth, submitAssessment);
router.get('/history', auth, getAssessmentHistory);
router.get('/:sessionId', auth, getAssessmentResult);


// router.get('/questions', getQuestions);
// router.post('/', submitAssessment);
// router.get('/:sessionId', getAssessmentResult);
// router.get('/history', auth, getAssessmentHistory);

module.exports = router;