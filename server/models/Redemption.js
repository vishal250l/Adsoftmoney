const mongoose = require('mongoose');
const redemptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  coinsUsed: { type: Number, required: true, min: 200 },
  rewardType: { type: String, default: 'gift_voucher' },
  rewardDetails: { type: String, default: '' },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminNote: { type: String, default: '' },
  processedAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.model('Redemption', redemptionSchema);
