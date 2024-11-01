import express from 'express';
import { body, query } from 'express-validator';
import * as scrollController from '../controllers/scrollController.js';
import * as focusController from '../controllers/focusController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Scroll control routes
router.post('/scroll/settings', [
  body('dynamicResistance.isEnabled').optional().isBoolean(),
  body('dynamicResistance.resistanceLevel').optional().isInt({ min: 1, max: 10 }),
  body('dynamicResistance.progressiveResistance.isEnabled').optional().isBoolean(),
  body('dynamicResistance.progressiveResistance.increaseRate').optional().isFloat({ min: 0 }),
  body('staticResistance.isEnabled').optional().isBoolean(),
  body('staticResistance.resistanceLevel').optional().isInt({ min: 1, max: 10 })
], scrollController.updateScrollSettings);

router.get('/scroll/resistance', [
  query('timestamp').optional().isISO8601(),
  query('domain').optional().isString()
], scrollController.getScrollResistance);

// Focus mode routes
router.post('/focus/settings', [
  body('blockedApps.*.appName').optional().isString(),
  body('blockedApps.*.isBlocked').optional().isBoolean(),
  body('schedule.*.startTime').optional().isISO8601(),
  body('schedule.*.endTime').optional().isISO8601(),
  body('schedule.*.isActive').optional().isBoolean(),
  body('schedule.*.daysOfWeek.*').optional().isInt({ min: 0, max: 6 }),
  body('screenLock.isEnabled').optional().isBoolean(),
  body('screenLock.autoLockDuration').optional().isInt({ min: 0 })
], focusController.updateFocusMode);

router.get('/focus/check-app', [
  query('appName').isString()
], focusController.checkAppBlock);

router.post('/focus/screen-lock', [
  body('domain').isString(),
  body('isEnabled').isBoolean()
], focusController.toggleScreenLock);

export default router;