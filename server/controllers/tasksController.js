const User = require('../models/User');
const Transaction = require('../models/Transaction');

const TASKS = {
  daily_login:      { label: 'Daily Login',        coins: 0.5, description: 'Log in every day' },
  watch_ad:         { label: 'Watch an Ad',         coins: 1,   description: 'Watch at least 1 ad today' },
  invite_friend:    { label: 'Invite a Friend',     coins: 5,   description: 'Refer a friend using your code' },
  complete_profile: { label: 'Complete Profile',    coins: 2,   description: 'Fill in your phone number' },
};

exports.getTasks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.checkDailyTasks();
    await user.save();
    const tasks = Object.entries(TASKS).map(([key, t]) => ({
      key,
      label: t.label,
      coins: t.coins,
      description: t.description,
      completed: user.completedTasks.includes(key),
      repeatable: key === 'watch_ad' ? false : key === 'invite_friend'
    }));
    res.json({ success: true, tasks, completedToday: user.completedTasks.length, totalTasks: Object.keys(TASKS).length });
  } catch (err) { next(err); }
};

exports.completeTask = async (req, res, next) => {
  try {
    const { taskKey } = req.body;
    if (!TASKS[taskKey]) return res.status(400).json({ success: false, message: 'Unknown task' });
    const user = await User.findById(req.user._id);
    user.checkDailyTasks();
    if (user.completedTasks.includes(taskKey)) return res.status(400).json({ success: false, message: 'Task already completed today' });

    // Validate task conditions
    if (taskKey === 'watch_ad' && user.totalAdsWatched === 0) return res.status(400).json({ success: false, message: 'Watch at least 1 ad first' });
    if (taskKey === 'complete_profile' && !user.phone) return res.status(400).json({ success: false, message: 'Add your phone number in Profile first' });
    if (taskKey === 'invite_friend' && user.referralCount === 0) return res.status(400).json({ success: false, message: 'No referrals yet. Share your referral code!' });
    if (taskKey === 'daily_login') return res.status(400).json({ success: false, message: 'Login reward is credited automatically on login' });

    const { coins, label } = TASKS[taskKey];
    user.coinBalance += coins;
    user.totalCoinsEarned += coins;
    user.completedTasks.push(taskKey);
    if (taskKey === 'complete_profile') user.profileCompleted = true;
    await user.save();
    await Transaction.create({ user: user._id, type: 'task_reward', amount: coins, description: `Task completed: ${label}`, status: 'completed', balanceAfter: user.coinBalance });
    res.json({ success: true, message: `+${coins} coins! Task "${label}" completed!`, coins, newBalance: user.coinBalance });
  } catch (err) { next(err); }
};
