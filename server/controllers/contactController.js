const ContactMessage = require('../models/ContactMessage');

exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'All fields are required' });
    if (message.length > 1000) return res.status(400).json({ success: false, message: 'Message too long' });
    await ContactMessage.create({ name, email, message });
    res.json({ success: true, message: 'Message sent! We will reply within 24 hours.' });
  } catch (err) { next(err); }
};
