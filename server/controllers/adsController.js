const Ad = require('../models/Ad');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Referral = require('../models/Referral');

const AD_COOLDOWN_SECONDS = 30;
const DAILY_AD_LIMIT = 20;
const DAILY_COIN_LIMIT = 10;
const COIN_PER_AD = 0.5;

exports.getAds = async (req, res, next) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ coinReward: -1 });
    const user = req.user;
    user.checkDailyReset();
    await user.save();
    const onCooldown = user.isOnCooldown();
    const cooldownEnds = onCooldown ? user.adCooldownEnd : null;
    const watchedTodayIds = user.watchedAds.filter(w => (new Date() - w.watchedAt) < 24*60*60*1000).map(w => w.adId.toString());
    const adsWithStatus = ads.map(ad => ({ ...ad.toObject(), alreadyWatchedToday: watchedTodayIds.includes(ad._id.toString()) }));
    res.json({ success: true, ads: adsWithStatus, meta: { dailyLimit: DAILY_AD_LIMIT, watchedToday: user.dailyAdsWatched, remaining: Math.max(0, DAILY_AD_LIMIT - user.dailyAdsWatched), coinsEarnedToday: user.dailyCoinsFromAds, dailyCoinLimit: DAILY_COIN_LIMIT, onCooldown, cooldownEnds } });
  } catch (err) { next(err); }
};

exports.startAd = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad || !ad.isActive) return res.status(404).json({ success: false, message: 'Ad not found' });
    const user = req.user;
    user.checkDailyReset();
    if (user.dailyAdsWatched >= DAILY_AD_LIMIT) return res.status(429).json({ success: false, message: 'Daily ad limit reached! Come back tomorrow.' });
    if (user.dailyCoinsFromAds >= DAILY_COIN_LIMIT) return res.status(429).json({ success: false, message: 'Daily coin limit reached! Come back tomorrow.' });
    if (user.isOnCooldown()) {
      const secondsLeft = Math.ceil((user.adCooldownEnd - new Date()) / 1000);
      return res.status(429).json({ success: false, message: `Wait ${secondsLeft}s before next ad`, cooldownSeconds: secondsLeft });
    }
    const jwt = require('jsonwebtoken');
    const sessionToken = jwt.sign({ userId: user._id, adId: ad._id, duration: ad.duration, iat: Date.now() }, process.env.JWT_SECRET, { expiresIn: ad.duration + 30 + 's' });
    res.json({ success: true, sessionToken, ad: { id: ad._id, title: ad.title, brand: ad.brand, duration: ad.duration, coinReward: ad.coinReward, bgColor: ad.bgColor, category: ad.category } });
  } catch (err) { next(err); }
};

exports.completeAd = async (req, res, next) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) return res.status(400).json({ success: false, message: 'Session token required' });
    let decoded;
    try { const jwt = require('jsonwebtoken'); decoded = jwt.verify(sessionToken, process.env.JWT_SECRET); }
    catch (e) { return res.status(400).json({ success: false, message: 'Invalid/expired session' }); }
    if (decoded.userId.toString() !== req.user._id.toString() || decoded.adId.toString() !== req.params.id) return res.status(403).json({ success: false, message: 'Session mismatch' });
    const elapsed = (Date.now() - decoded.iat) / 1000;
    if (elapsed < decoded.duration - 2) return res.status(400).json({ success: false, message: 'Ad not fully watched' });

    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    const user = await User.findById(req.user._id);
    user.checkDailyReset();
    if (user.dailyAdsWatched >= DAILY_AD_LIMIT || user.dailyCoinsFromAds >= DAILY_COIN_LIMIT) return res.status(429).json({ success: false, message: 'Daily limit reached' });

    const recentWatch = user.watchedAds.find(w => w.adId.toString() === ad._id.toString() && (new Date() - w.watchedAt) < 24*60*60*1000);
    if (recentWatch) return res.status(400).json({ success: false, message: 'Already watched this ad today' });

    const coins = ad.coinReward;
    user.coinBalance += coins;
    user.totalCoinsEarned += coins;
    user.totalAdsWatched += 1;
    user.dailyAdsWatched += 1;
    user.dailyCoinsFromAds += coins;
    user.lastAdWatched = new Date();
    user.adCooldownEnd = new Date(Date.now() + AD_COOLDOWN_SECONDS * 1000);
    user.watchedAds.push({ adId: ad._id, watchedAt: new Date(), coins });
    await user.save();

    ad.totalViews += 1; ad.totalCoinsGiven += coins; await ad.save();
    await Transaction.create({ user: user._id, type: 'ad_reward', amount: coins, description: `Ad reward: "${ad.title}" by ${ad.brand}`, status: 'completed', adRef: ad._id, balanceAfter: user.coinBalance });

    // Referral commission (10% of ad coins to referrer)
    if (user.referredBy) {
      const commission = parseFloat((coins * 0.10).toFixed(2));
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referrer.coinBalance += commission; referrer.totalCoinsEarned += commission;
        await referrer.save();
        await Transaction.create({ user: referrer._id, type: 'referral_reward', amount: commission, description: `Referral commission from ${user.name}`, status: 'completed', balanceAfter: referrer.coinBalance });
        await Referral.findOneAndUpdate({ referrer: referrer._id, referee: user._id }, { $inc: { commissionEarned: commission } });
      }
    }

    res.json({ success: true, message: `+${coins} coins earned!`, coins, newBalance: user.coinBalance, cooldownSeconds: AD_COOLDOWN_SECONDS });
  } catch (err) { next(err); }
};
