import FeatureTier from '../models/FeatureTier.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const initializeFeatureTiers = async () => {
  const tiers = {
    free: {
      name: 'free',
      features: {
        scrollControl: {
          staticResistance: { enabled: true, maxLevel: 3 },
          dynamicResistance: { enabled: false, maxLevel: 0, progressiveResistance: false, customPatterns: false },
          smartPause: { enabled: true, customDuration: false }
        },
        siteBlocking: {
          maxSites: 5,
          patterns: { enabled: true, regex: false, customRules: false },
          schedules: { enabled: true, maxSchedules: 1, recurring: false, exceptions: false },
          categories: { predefined: true, custom: false }
        },
        focus: {
          pomodoro: { enabled: true, customIntervals: false, templates: false },
          modes: { count: 1, custom: false },
          automation: { enabled: false, rules: false, triggers: false }
        },
        analytics: {
          basic: true,
          advanced: { enabled: false, retention: 7, export: false, customReports: false },
          insights: { enabled: false, ai: false, recommendations: false }
        },
        team: {
          enabled: false,
          maxMembers: 0,
          roles: { custom: false, templates: false },
          policies: { enabled: false, custom: false }
        },
        integration: {
          calendar: false,
          tasks: false,
          customApps: false,
          api: { enabled: false, rateLimit: 0 }
        },
        backup: {
          enabled: false,
          frequency: 0,
          retention: 0,
          encryption: false
        }
      }
    },
    pro: {
      name: 'pro',
      features: {
        scrollControl: {
          staticResistance: { enabled: true, maxLevel: 10 },
          dynamicResistance: { enabled: true, maxLevel: 10, progressiveResistance: true, customPatterns: false },
          smartPause: { enabled: true, customDuration: true }
        },
        siteBlocking: {
          maxSites: 50,
          patterns: { enabled: true, regex: true, customRules: true },
          schedules: { enabled: true, maxSchedules: 10, recurring: true, exceptions: true },
          categories: { predefined: true, custom: true }
        },
        focus: {
          pomodoro: { enabled: true, customIntervals: true, templates: true },
          modes: { count: 5, custom: true },
          automation: { enabled: true, rules: true, triggers: false }
        },
        analytics: {
          basic: true,
          advanced: { enabled: true, retention: 30, export: true, customReports: false },
          insights: { enabled: true, ai: false, recommendations: true }
        },
        team: {
          enabled: false,
          maxMembers: 0,
          roles: { custom: false, templates: false },
          policies: { enabled: false, custom: false }
        },
        integration: {
          calendar: true,
          tasks: true,
          customApps: false,
          api: { enabled: true, rateLimit: 1000 }
        },
        backup: {
          enabled: true,
          frequency: 24,
          retention: 30,
          encryption: true
        }
      }
    },
    business: {
      name: 'business',
      features: {
        scrollControl: {
          staticResistance: { enabled: true, maxLevel: 10 },
          dynamicResistance: { enabled: true, maxLevel: 10, progressiveResistance: true, customPatterns: true },
          smartPause: { enabled: true, customDuration: true }
        },
        siteBlocking: {
          maxSites: -1,
          patterns: { enabled: true, regex: true, customRules: true },
          schedules: { enabled: true, maxSchedules: -1, recurring: true, exceptions: true },
          categories: { predefined: true, custom: true }
        },
        focus: {
          pomodoro: { enabled: true, customIntervals: true, templates: true },
          modes: { count: -1, custom: true },
          automation: { enabled: true, rules: true, triggers: true }
        },
        analytics: {
          basic: true,
          advanced: { enabled: true, retention: 365, export: true, customReports: true },
          insights: { enabled: true, ai: true, recommendations: true }
        },
        team: {
          enabled: true,
          maxMembers: -1,
          roles: { custom: true, templates: true },
          policies: { enabled: true, custom: true }
        },
        integration: {
          calendar: true,
          tasks: true,
          customApps: true,
          api: { enabled: true, rateLimit: 10000 }
        },
        backup: {
          enabled: true,
          frequency: 6,
          retention: 365,
          encryption: true
        }
      }
    }
  };

  try {
    for (const [tierName, tierData] of Object.entries(tiers)) {
      await FeatureTier.findOneAndUpdate(
        { name: tierName },
        tierData,
        { upsert: true, new: true }
      );
    }
    logger.info('Feature tiers initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize feature tiers:', error);
    throw error;
  }
};

export const getUserFeatures = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const tier = await FeatureTier.findOne({ name: user.subscription || 'free' });
    
    const response = {
      subscription: tier.name,
      features: tier.features
    };

    res.json(response);
  } catch (error) {
    logger.error('Failed to fetch user features:', error);
    res.status(500).json({ error: 'Failed to fetch user features' });
  }
};

export const checkFeatureAccess = async (userId, feature, subFeature) => {
  try {
    const user = await User.findById(userId);
    const tier = await FeatureTier.findOne({ name: user.subscription || 'free' });
    
    const featurePath = feature.split('.');
    let access = tier.features;
    
    for (const path of featurePath) {
      access = access[path];
      if (!access) return false;
    }
    
    if (subFeature) {
      return access[subFeature]?.enabled || false;
    }
    
    return access.enabled || false;
  } catch (error) {
    logger.error('Failed to check feature access:', error);
    return false;
  }
};