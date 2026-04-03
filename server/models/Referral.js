const mongoose = require('mongoose');
const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coinsAwarded: { type: Number, default: 5 },
  commissionEarned: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Referral', referralSchema);
