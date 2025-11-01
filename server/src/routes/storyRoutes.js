const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Nanti, Anda akan membuat controller untuk story
// const storyController = require('../controllers/storyController');

// Contoh rute placeholder
router.get('/', auth, (req, res) => {
    res.json({ success: true, message: 'Endpoint untuk stories.' });
});

module.exports = router;