const User = require('../models/User');
const Transaction = require('../models/Transaction');

const SPIN_REWARDS = [0, 0, 0.2, 0.2, 0.5, 0.5, 0.5, 1];
const DAILY_SPIN_LIMIT = 3;

exports.spin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.checkSpinReset();
    if (user.spinsToday >= DAILY_SPIN_LIMIT) return res.status(429).json({ success: false, message: `Daily spin limit (${DAILY_SPIN_LIMIT}) reached! Come back tomorrow.`, spinsLeft: 0 });
    const reward = SPIN_REWARDS[Math.floor(Math.random() * SPIN_REWARDS.length)];
    const segmentIndex = SPIN_REWARDS.indexOf(reward) + Math.floor(Math.random() * SPIN_REWARDS.filter(r => r === reward).length);
    user.spinsToday += 1;
    user.lastSpinDate = user.todayStr();
    if (reward > 0) {
      user.coinBalance += reward;
      user.totalCoinsEarned += reward;
      await Transaction.create({ user: user._id, type: 'spin_reward', amount: reward, description: `Spin wheel reward: ${reward} coins`, status: 'completed', balanceAfter: user.coinBalance });
    }
    await user.save();
    res.json({ success: true, reward, message: reward > 0 ? `🎉 You won ${reward} coins!` : 'Better luck next time!', spinsLeft: DAILY_SPIN_LIMIT - user.spinsToday, newBalance: user.coinBalance });
  } catch (err) { next(err); }
};

exports.getSpinStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.checkSpinReset();
    res.json({ success: true, spinsLeft: Math.max(0, DAILY_SPIN_LIMIT - user.spinsToday), dailyLimit: DAILY_SPIN_LIMIT, rewards: SPIN_REWARDS });
  } catch (err) { next(err); }
};
