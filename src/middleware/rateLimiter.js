import rateLimit from 'express-rate-limit';
import { FeatureTier } from '../models/FeatureTier.js';

export const createTierLimiter = (tier) => {
  const limits = {
    free: {
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Free tier rate limit reached. Please upgrade for more requests.'
    },
    pro: {
      windowMs: 15 * 60 * 1000,
      max: 1000,
      message: 'Pro tier rate limit reached.'
    },
    business: {
      windowMs: 15 * 60 * 1000,
      max: 5000,
      message: 'Business tier rate limit reached.'
    }
  };

  return rateLimit({
    ...limits[tier],
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.headers['x-extension-sync'] === 'true' // Skip rate limit for extension syncs
  });
};

export const dynamicRateLimiter = async (req, res, next) => {
  try {
    // Skip rate limiting for extension sync requests
    if (req.headers['x-extension-sync'] === 'true') {
      return next();
    }

    if (!req.user?.subscription) {
      return createTierLimiter('free')(req, res, next);
    }

    const tier = await FeatureTier.findOne({ name: req.user.subscription });
    const limiter = createTierLimiter(tier.name);
    return limiter(req, res, next);
  } catch (error) {
    next(error);
  }
};