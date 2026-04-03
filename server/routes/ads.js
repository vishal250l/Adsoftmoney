const express = require('express');
const router = express.Router();
const { getAds, startAd, completeAd } = require('../controllers/adsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAds);
router.post('/:id/start', protect, startAd);
router.post('/:id/complete', protect, completeAd);

module.exports = router;
