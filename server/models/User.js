const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, trim: true },
  avatar: { type: String, default: null },

  // Coin Wallet
  coinBalance: { type: Number, default: 0, min: 0 },
  totalCoinsEarned: { type: Number, default: 0 },
  totalCoinsRedeemed: { type: Number, default: 0 },

  // Profile
  profileCompleted: { type: Boolean, default: false },

  // Ad watching
  totalAdsWatched: { type: Number, default: 0 },
  dailyAdsWatched: { type: Number, default: 0 },
  dailyCoinsFromAds: { type: Number, default: 0 },
  dailyReset: { type: Date, default: null },
  lastAdWatched: { type: Date, default: null },
  adCooldownEnd: { type: Date, default: null },
  watchedAds: [{ adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }, watchedAt: { type: Date, default: Date.now }, coins: Number }],

  // Spin wheel
  lastSpinDate: { type: String, default: null },
  spinsToday: { type: Number, default: 0 },

  // Daily tasks
  dailyTasksDate: { type: String, default: null },
  completedTasks: [{ type: String }],

  // Referral
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCount: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'ASM' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

userSchema.methods.comparePassword = async function(p) { return await bcrypt.compare(p, this.password); };
userSchema.methods.isOnCooldown = function() { return this.adCooldownEnd && new Date() < this.adCooldownEnd; };
userSchema.methods.todayStr = function() { return new Date().toISOString().split('T')[0]; };
userSchema.methods.checkDailyReset = function() {
  const today = this.todayStr();
  if (!this.dailyReset || new Date(this.dailyReset).toISOString().split('T')[0] !== today) {
    this.dailyAdsWatched = 0; this.dailyCoinsFromAds = 0; this.dailyReset = new Date();
  }
};
userSchema.methods.checkDailyTasks = function() {
  const today = this.todayStr();
  if (this.dailyTasksDate !== today) { this.dailyTasksDate = today; this.completedTasks = []; }
};
userSchema.methods.checkSpinReset = function() {
  if (this.lastSpinDate !== this.todayStr()) { this.spinsToday = 0; }
};

module.exports = mongoose.model('User', userSchema);
