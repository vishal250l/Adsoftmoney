const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Redemption = require('../models/Redemption');

const MIN_REDEEM_COINS = 200;

exports.getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20).populate('adRef', 'title brand');
    const pendingRedemptions = await Redemption.find({ user: req.user._id, status: 'pending' });
    res.json({ success: true, wallet: { coinBalance: user.coinBalance, totalCoinsEarned: user.totalCoinsEarned, totalCoinsRedeemed: user.totalCoinsRedeemed, totalAdsWatched: user.totalAdsWatched, pendingCoins: pendingRedemptions.reduce((s, r) => s + r.coinsUsed, 0) }, transactions, pendingRedemptions });
  } catch (err) { next(err); }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const type = req.query.type;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).populate('adRef','title brand');
    res.json({ success: true, transactions, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch (err) { next(err); }
};

exports.redeemCoins = async (req, res, next) => {
  try {
    const { coinsUsed, rewardType, rewardDetails } = req.body;
    if (!coinsUsed || coinsUsed < MIN_REDEEM_COINS) return res.status(400).json({ success: false, message: `Minimum redemption is ${MIN_REDEEM_COINS} coins` });
    const user = await User.findById(req.user._id);
    if (user.coinBalance < coinsUsed) return res.status(400).json({ success: false, message: 'Insufficient coins' });
    const pending = await Redemption.findOne({ user: req.user._id, status: 'pending' });
    if (pending) return res.status(400).json({ success: false, message: 'You already have a pending redemption request' });
    user.coinBalance -= coinsUsed;
    user.totalCoinsRedeemed += coinsUsed;
    await user.save();
    const redemption = await Redemption.create({ user: req.user._id, coinsUsed, rewardType: rewardType || 'gift_voucher', rewardDetails: rewardDetails || '' });
    await Transaction.create({ user: user._id, type: 'redeem', amount: -coinsUsed, description: `Redemption request: ${coinsUsed} coins`, status: 'pending', redemptionRef: redemption._id, balanceAfter: user.coinBalance });
    res.json({ success: true, message: 'Redemption request submitted! Admin will review within 48 hours.', redemption, newBalance: user.coinBalance });
  } catch (err) { next(err); }
};

exports.getRedemptions = async (req, res, next) => {
  try {
    const redemptions = await Redemption.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, redemptions });
  } catch (err) { next(err); }
};
