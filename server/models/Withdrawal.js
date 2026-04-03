const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [500, 'Minimum withdrawal amount is ₹500']
  },
  upiId: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'rejected', 'cancelled'],
    default: 'processing'
  },
  remarks: {
    type: String,
    default: 'Your withdrawal request is being processed.'
  },
  processedAt: {
    type: Date,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
