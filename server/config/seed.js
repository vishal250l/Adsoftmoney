require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Ad = require('../models/Ad');

const sampleAds = [
  { title: 'Flipkart Big Billion Days Sale', brand: 'Flipkart', description: 'Shop millions of products at unbeatable prices!', duration: 10, coinReward: 0.5, category: 'technology', bgColor: '#F7931E' },
  { title: 'Zomato Food Delivery', brand: 'Zomato', description: 'Order food from your favorite restaurants.', duration: 20, coinReward: 0.5, category: 'food', bgColor: '#E23744' },
  { title: 'HDFC Credit Card Offers', brand: 'HDFC Bank', description: 'Get exclusive cashback on your next purchase.', duration: 30, coinReward: 0.5, category: 'finance', bgColor: '#004C97' },
  { title: 'Myntra Fashion Sale', brand: 'Myntra', description: 'Latest trends at amazing discounts.', duration: 15, coinReward: 0.5, category: 'fashion', bgColor: '#FF3F6C' },
  { title: "BYJU'S Learning App", brand: "BYJU'S", description: 'Learn from the best educators in India.', duration: 25, coinReward: 0.5, category: 'education', bgColor: '#7B2D8B' },
  { title: 'PhonePe Payments', brand: 'PhonePe', description: 'Fast, secure UPI payments.', duration: 10, coinReward: 0.5, category: 'finance', bgColor: '#5F259F' },
  { title: 'Amazon Prime Video', brand: 'Amazon', description: 'Watch unlimited movies and shows.', duration: 30, coinReward: 0.5, category: 'entertainment', bgColor: '#00A8E1' },
  { title: 'Ola Electric Scooter', brand: 'Ola Electric', description: 'Drive into the future with Ola Electric.', duration: 20, coinReward: 0.5, category: 'technology', bgColor: '#E8212A' },
  { title: 'Swiggy Instamart', brand: 'Swiggy', description: 'Groceries delivered in 10 minutes.', duration: 15, coinReward: 0.5, category: 'food', bgColor: '#FC8019' },
  { title: 'Nykaa Beauty Sale', brand: 'Nykaa', description: 'Top beauty brands at best prices.', duration: 20, coinReward: 0.5, category: 'fashion', bgColor: '#FC2779' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'vbhalse143@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ name: 'Super Admin', email: adminEmail, password: adminPassword });
      console.log('✅ Admin created:', adminEmail);
    } else {
      console.log('ℹ️  Admin already exists:', adminEmail);
    }

    await Ad.deleteMany({});
    await Ad.insertMany(sampleAds);
    console.log(`✅ ${sampleAds.length} ads seeded`);

    console.log('\n🎉 Seed complete!');
    console.log('Admin Email:', adminEmail);
    console.log('Admin Password:', adminPassword);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}
seed();
