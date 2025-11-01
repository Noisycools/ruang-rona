const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/exerciseController');

// Progress routes first to avoid conflict with :id
router.get('/progress', ctrl.getProgress);
router.post('/progress', ctrl.upsertProgress);

// List and single item
router.get('/', ctrl.listExercises);
router.get('/:id', ctrl.getExerciseById);

module.exports = router;