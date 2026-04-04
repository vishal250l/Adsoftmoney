const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const limiter = rateLimit({ windowMs: 15*60*1000, max: 100, message: { success: false, message: 'Too many requests' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 15, message: { success: false, message: 'Too many auth attempts' } });

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://thunderous-pixie-a9fdbf.netlify.app',
      process.env.CLIENT_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', limiter);

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ads', require('./routes/ads'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/spin', require('./routes/spin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'AdSofmoney API running', timestamp: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ MongoDB Connected'); app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server on port ${process.env.PORT || 5000}`)); })
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });

module.exports = app;
