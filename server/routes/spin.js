const express = require('express');
const router = express.Router();
const { spin, getSpinStatus } = require('../controllers/spinController');
const { protect } = require('../middleware/auth');
router.get('/status', protect, getSpinStatus);
router.post('/', protect, spin);
module.exports = router;
