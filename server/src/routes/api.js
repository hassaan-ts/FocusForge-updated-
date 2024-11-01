import express from 'express';
import { body } from 'express-validator';
import * as focusController from '../controllers/focusController.js';
import * as habitsController from '../controllers/habitsController.js';
import * as websiteController from '../controllers/websiteController.js';

const router = express.Router();

// Focus settings routes
router.get('/focus/settings', focusController.getFocusSettings);
router.post('/focus/settings', focusController.updateFocusSettings);

// Habits routes
router.get('/habits', habitsController.getHabits);
router.post('/habits', [
  body('name').trim().notEmpty(),
], habitsController.createHabit);
router.put('/habits/:id', habitsController.updateHabit);
router.delete('/habits/:id', habitsController.deleteHabit);

// Website blocking routes
router.get('/websites/blocked', websiteController.getBlockedWebsites);
router.post('/websites/block', [
  body('url').isURL(),
], websiteController.blockWebsite);
router.delete('/websites/block/:id', websiteController.unblockWebsite);

export default router;