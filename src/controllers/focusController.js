import { validationResult } from 'express-validator';
import { parseISO, isWithinInterval } from 'date-fns';
import User from '../models/User.js';

export const updateFocusMode = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { blockedApps, schedule, screenLock } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (blockedApps) {
      user.focusMode.blockedApps = blockedApps;
    }

    if (schedule) {
      user.focusMode.schedule = schedule.map(slot => ({
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        daysOfWeek: slot.daysOfWeek,
        isActive: slot.isActive
      }));
    }

    if (screenLock) {
      user.focusMode.screenLock = {
        ...user.focusMode.screenLock,
        ...screenLock
      };
    }

    await user.save();
    res.json({ 
      success: true, 
      focusMode: user.focusMode 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update focus mode settings',
      details: error.message 
    });
  }
};

export const checkAppBlock = async (req, res) => {
  try {
    const { appName } = req.query;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const currentDay = now.getDay();

    const blockedApp = user.focusMode.blockedApps.find(
      app => app.appName === appName && app.isBlocked
    );

    if (!blockedApp) {
      return res.json({ blocked: false });
    }

    const isInFocusTime = user.focusMode.schedule.some(schedule => {
      if (!schedule.isActive) return false;
      
      const start = new Date(schedule.startTime);
      const end = new Date(schedule.endTime);
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const scheduleStart = start.getHours() * 60 + start.getMinutes();
      const scheduleEnd = end.getHours() * 60 + end.getMinutes();

      return (
        schedule.daysOfWeek.includes(currentDay) &&
        currentTime >= scheduleStart &&
        currentTime <= scheduleEnd
      );
    });

    res.json({ 
      blocked: isInFocusTime,
      message: isInFocusTime ? 
        'This app is blocked during focus hours' : 
        'App is in block list but outside focus hours'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check app block status',
      details: error.message 
    });
  }
};

export const toggleScreenLock = async (req, res) => {
  try {
    const { domain, isEnabled } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (isEnabled) {
      if (!user.focusMode.screenLock.allowedVideoDomains.includes(domain)) {
        user.focusMode.screenLock.allowedVideoDomains.push(domain);
      }
    } else {
      user.focusMode.screenLock.allowedVideoDomains = 
        user.focusMode.screenLock.allowedVideoDomains.filter(d => d !== domain);
    }

    user.focusMode.screenLock.isEnabled = isEnabled;
    await user.save();

    res.json({ 
      success: true, 
      screenLock: user.focusMode.screenLock 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to toggle screen lock',
      details: error.message 
    });
  }
};