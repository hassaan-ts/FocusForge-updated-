import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const updateScrollSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dynamicResistance, staticResistance } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (dynamicResistance) {
      user.scrollSettings.dynamicResistance = {
        ...user.scrollSettings.dynamicResistance,
        ...dynamicResistance
      };
    }

    if (staticResistance) {
      user.scrollSettings.staticResistance = {
        ...user.scrollSettings.staticResistance,
        ...staticResistance
      };
    }

    await user.save();
    res.json({ 
      success: true, 
      scrollSettings: user.scrollSettings 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update scroll settings',
      details: error.message 
    });
  }
};

export const getScrollResistance = async (req, res) => {
  try {
    const { timestamp, domain } = req.query;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let resistance = 0;
    const settings = user.scrollSettings;

    if (settings.dynamicResistance.isEnabled) {
      resistance += settings.dynamicResistance.resistanceLevel;
      
      if (settings.dynamicResistance.progressiveResistance.isEnabled && timestamp) {
        const sessionDuration = (Date.now() - new Date(timestamp)) / 60000;
        const progressiveIncrease = Math.floor(sessionDuration * 
          settings.dynamicResistance.progressiveResistance.increaseRate);
        resistance += progressiveIncrease;
      }
    }

    if (settings.staticResistance.isEnabled) {
      resistance += settings.staticResistance.resistanceLevel;
    }

    resistance = Math.min(resistance, 10);

    res.json({ 
      resistance,
      isEnabled: settings.dynamicResistance.isEnabled || 
                settings.staticResistance.isEnabled
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to calculate scroll resistance',
      details: error.message 
    });
  }
};