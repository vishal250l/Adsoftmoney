const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Transaction = require('../models/Transaction');
const Referral = require('../models/Referral');

const generateToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { name, email, password, phone, referralCode } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });

    // Handle referral
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer && referrer._id.toString() !== user._id.toString()) {
        user.referredBy = referrer._id;
        // Award referrer 5 coins
        referrer.coinBalance += 5;
        referrer.totalCoinsEarned += 5;
        referrer.referralCount += 1;
        await referrer.save();
        await Transaction.create({ user: referrer._id, type: 'referral_reward', amount: 5, description: `Referral bonus: ${name} joined`, status: 'completed', balanceAfter: referrer.coinBalance });
        await Referral.create({ referrer: referrer._id, referee: user._id, coinsAwarded: 5 });
        await user.save();
      }
    }

    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Account created! Welcome to AdSofmoney 🎉', token,
      user: { id: user._id, name: user.name, email: user.email, coinBalance: user.coinBalance, totalCoinsEarned: user.totalCoinsEarned, totalAdsWatched: user.totalAdsWatched, referralCode: user.referralCode }
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.isBanned) return res.status(401).json({ success: false, message: user?.isBanned ? 'Account suspended' : 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Daily login reward (check if not already done today)
    user.checkDailyTasks();
    let loginBonus = 0;
    if (!user.completedTasks.includes('daily_login')) {
      user.coinBalance += 0.5;
      user.totalCoinsEarned += 0.5;
      loginBonus = 0.5;
      user.completedTasks.push('daily_login');
      await user.save();
      await Transaction.create({ user: user._id, type: 'task_reward', amount: 0.5, description: 'Daily login bonus', status: 'completed', balanceAfter: user.coinBalance });
    } else {
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ success: true, message: loginBonus > 0 ? `Welcome back! +${loginBonus} coins daily bonus!` : 'Welcome back!', token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, coinBalance: user.coinBalance, totalCoinsEarned: user.totalCoinsEarned, totalAdsWatched: user.totalAdsWatched, referralCode: user.referralCode, profileCompleted: user.profileCompleted }
    });
  } catch (err) { next(err); }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    admin.lastLogin = new Date();
    await admin.save();
    const token = generateToken(admin._id, 'admin');
    res.json({ success: true, message: 'Admin login successful!', token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => res.json({ success: true, user: req.user });
