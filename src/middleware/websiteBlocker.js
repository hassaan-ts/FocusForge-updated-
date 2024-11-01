import { parse, isWithinInterval } from 'date-fns';
import User from '../models/User.js';

export const websiteBlocker = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const currentUrl = req.body.url;
    const now = new Date();
    const currentDay = now.toLocaleLowerCase();

    // Check if URL is in blocked list and if current time is within any active focus schedule
    const isBlocked = user.blockedWebsites.some(site => {
      const isUrlBlocked = new RegExp(site.url).test(currentUrl);
      
      if (!isUrlBlocked) return false;

      return user.focusSchedules.some(schedule => {
        if (!schedule.active || !schedule.days.includes(currentDay)) return false;

        const startTime = parse(schedule.startTime, 'HH:mm', now);
        const endTime = parse(schedule.endTime, 'HH:mm', now);

        return isWithinInterval(now, { start: startTime, end: endTime });
      });
    });

    if (isBlocked) {
      return res.status(403).json({
        message: 'This website is blocked during focus hours',
        type: 'WEBSITE_BLOCKED'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};