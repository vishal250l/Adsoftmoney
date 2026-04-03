const User = require('../models/User');
const Ad = require('../models/Ad');
const Transaction = require('../models/Transaction');
const Redemption = require('../models/Redemption');
const ContactMessage = require('../models/ContactMessage');

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAds, pendingRedemptions] = await Promise.all([
      User.countDocuments(), Ad.countDocuments({ isActive: true }), Redemption.countDocuments({ status: 'pending' })
    ]);
    const rewardAgg = await Transaction.aggregate([{ $match: { type: { $in: ['ad_reward','task_reward','spin_reward','referral_reward'] } } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email coinBalance createdAt');
    res.json({ success: true, stats: { totalUsers, totalAds, totalTransactions: rewardAgg[0]?.count || 0, totalCoinsGiven: rewardAgg[0]?.total || 0, pendingRedemptions }, recentUsers });
  } catch (err) { next(err); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1, limit = 20;
    const search = req.query.search;
    const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).select('-watchedAds -completedTasks');
    res.json({ success: true, users, total, page, pages: Math.ceil(total/limit) });
  } catch (err) { next(err); }
};

exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, isBanned: user.isBanned });
  } catch (err) { next(err); }
};

exports.createAd = async (req, res, next) => {
  try {
    const { title, description, brand, duration, coinReward, category, bgColor } = req.body;
    if (!title || !brand || !duration || !coinReward) return res.status(400).json({ success: false, message: 'Required fields missing' });
    const ad = await Ad.create({ title, description, brand, duration, coinReward, category, bgColor });
    res.status(201).json({ success: true, message: 'Ad created', ad });
  } catch (err) { next(err); }
};

exports.updateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, ad });
  } catch (err) { next(err); }
};

exports.deleteAd = async (req, res, next) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ad deleted' });
  } catch (err) { next(err); }
};

exports.getRedemptions = async (req, res, next) => {
  try {
    const status = req.query.status || 'pending';
    const redemptions = await Redemption.find({ status }).populate('user','name email').sort({ createdAt: -1 });
    res.json({ success: true, redemptions });
  } catch (err) { next(err); }
};

exports.updateRedemption = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const redemption = await Redemption.findByIdAndUpdate(req.params.id, { status, adminNote, processedAt: new Date() }, { new: true }).populate('user','name email');
    if (!redemption) return res.status(404).json({ success: false, message: 'Not found' });
    // Refund on rejection
    if (status === 'rejected') {
      await User.findByIdAndUpdate(redemption.user._id, { $inc: { coinBalance: redemption.coinsUsed, totalCoinsRedeemed: -redemption.coinsUsed } });
      await Transaction.create({ user: redemption.user._id, type: 'bonus', amount: redemption.coinsUsed, description: `Redemption rejected — coins refunded`, status: 'completed', balanceAfter: 0 });
    }
    res.json({ success: true, redemption });
  } catch (err) { next(err); }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};
