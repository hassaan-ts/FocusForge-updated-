import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const addBlockedWebsite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url, category } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if website is already blocked
    if (user.blockedWebsites.some(site => site.url === url)) {
      return res.status(400).json({ message: 'Website is already blocked' });
    }

    user.blockedWebsites.push({ url, category });
    await user.save();

    res.status(201).json({
      message: 'Website blocked successfully',
      website: user.blockedWebsites[user.blockedWebsites.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeBlockedWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const websiteIndex = user.blockedWebsites.findIndex(
      site => site._id.toString() === websiteId
    );

    if (websiteIndex === -1) {
      return res.status(404).json({ message: 'Website not found in blocked list' });
    }

    user.blockedWebsites.splice(websiteIndex, 1);
    await user.save();

    res.json({ message: 'Website removed from block list' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBlockedWebsites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ websites: user.blockedWebsites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};