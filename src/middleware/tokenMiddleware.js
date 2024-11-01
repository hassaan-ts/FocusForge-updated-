import Token from '../models/Token.js';
import User from '../models/User.js';
import FeatureTier from '../models/FeatureTier.js';

export const tokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x-api-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const tokenDoc = await Token.findOne({
      token,
      type: 'access',
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Update token usage
    tokenDoc.usageCount += 1;
    tokenDoc.lastUsed = new Date();
    await tokenDoc.save();

    // Get user's subscription tier
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Check token limits
    const tier = await FeatureTier.findOne({ name: user.subscription || 'free' });
    if (tokenDoc.usageCount > tier.tokens.monthly) {
      return res.status(429).json({ error: 'Monthly token limit exceeded' });
    }

    req.user = user;
    req.tier = tier;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Token verification failed' });
  }
};