const express = require('express');
const router = express.Router();
const { getWallet, getTransactions, redeemCoins, getRedemptions } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
router.get('/', protect, getWallet);
router.get('/transactions', protect, getTransactions);
router.post('/redeem', protect, redeemCoins);
router.get('/redemptions', protect, getRedemptions);
module.exports = router;
