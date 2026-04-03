const mongoose = require('mongoose');
const adSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  brand: { type: String, required: true, trim: true },
  thumbnail: { type: String, default: null },
  duration: { type: Number, required: true, min: 5, max: 120 },
  coinReward: { type: Number, required: true, default: 0.5, min: 0.1 },
  category: { type: String, enum: ['technology','fashion','food','finance','entertainment','health','education','other'], default: 'other' },
  isActive: { type: Boolean, default: true },
  totalViews: { type: Number, default: 0 },
  totalCoinsGiven: { type: Number, default: 0 },
  bgColor: { type: String, default: '#00baf2' }
}, { timestamps: true });
module.exports = mongoose.model('Ad', adSchema);
