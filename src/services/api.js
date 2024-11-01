import express from 'express';
import { body } from 'express-validator';
import * as websiteController from '../controllers/websiteController.js';
import * as focusController from '../controllers/focusController.js';
import { websiteBlocker } from '../middleware/websiteBlocker.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Website blocking routes
router.post(
  '/websites/block',
  auth,
  [
    body('url').isURL().withMessage('Invalid URL format'),
    body('category').optional().isIn(['social', 'entertainment', 'news', 'other'])
  ],
  websiteController.addBlockedWebsite
);

router.delete('/websites/block/:websiteId', auth, websiteController.removeBlockedWebsite);
router.get('/websites/blocked', auth, websiteController.getBlockedWebsites);

// Focus schedule routes
router.post(
  '/focus/schedule',
  auth,
  [
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('days').isArray().custom(days => {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return days.every(day => validDays.includes(day.toLowerCase()));
    })
  ],
  focusController.addFocusSchedule
);

router.put('/focus/schedule/:scheduleId', auth, focusController.updateFocusSchedule);
router.get('/focus/schedules', auth, focusController.getFocusSchedules);

export default router;