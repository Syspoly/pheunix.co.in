import express from 'express';
import {
  getPublicSettings,
  getAllSettingsAdmin,
  updateSetting,
  getDashboardStats
} from '../controllers/settingController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicSettings);

// Admin routes
router.get('/admin', protectAdmin, getAllSettingsAdmin);
router.post('/admin', protectAdmin, updateSetting);
router.get('/admin/stats', protectAdmin, getDashboardStats);

export default router;
