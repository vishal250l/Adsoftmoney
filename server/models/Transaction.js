const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['ad_reward','task_reward','spin_reward','referral_reward','redeem','bonus'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['completed','pending','processing','failed'], default: 'completed' },
  adRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', default: null },
  redemptionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Redemption', default: null },
  balanceAfter: { type: Number, required: true }
}, { timestamps: true });
transactionSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);
