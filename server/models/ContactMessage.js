const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });
module.exports = mongoose.model('ContactMessage', contactSchema);
