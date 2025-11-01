const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Nanti, Anda akan membuat controller untuk exercise
// const exerciseController = require('../controllers/exerciseController');

// Contoh rute placeholder
router.get('/', auth, (req, res) => {
    res.json({ success: true, message: 'Endpoint untuk exercises.' });
});

module.exports = router;