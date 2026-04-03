const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getProfile = async (req, res) => res.json({ success: true, user: req.user });

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone && phone !== user.phone) { user.phone = phone; }
    // Award profile completion coins once
    if (phone && !user.profileCompleted && !user.completedTasks.includes('complete_profile')) {
      user.profileCompleted = true;
    }
    await user.save();
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!await user.comparePassword(currentPassword)) return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.checkDailyReset();
    user.checkDailyTasks();
    user.checkSpinReset();
    await user.save();
    const today = new Date(); today.setHours(0,0,0,0);
    const [recentTx, todayAgg] = await Promise.all([
      Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5).populate('adRef','title brand'),
      Transaction.aggregate([{ $match: { user: user._id, type: { $in: ['ad_reward','task_reward','spin_reward','referral_reward'] }, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);
    res.json({ success: true, stats: { coinBalance: user.coinBalance, totalCoinsEarned: user.totalCoinsEarned, totalAdsWatched: user.totalAdsWatched, todayEarned: todayAgg[0]?.total || 0, dailyAdsWatched: user.dailyAdsWatched, spinsLeft: Math.max(0, 3 - user.spinsToday), completedTasks: user.completedTasks.length, referralCount: user.referralCount, referralCode: user.referralCode }, recentTransactions: recentTx });
  } catch (err) { next(err); }
};

exports.getReferralInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const Referral = require('../models/Referral');
    const referrals = await Referral.find({ referrer: user._id }).populate('referee','name email createdAt');
    res.json({ success: true, referralCode: user.referralCode, referralCount: user.referralCount, referrals });
  } catch (err) { next(err); }
};
