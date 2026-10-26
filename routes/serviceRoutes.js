import express from 'express';
import {
  getPublicServices,
  getAllServicesAdmin,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublicServices);
router.get('/slug/:slug', getServiceBySlug);

// Admin protected routes
router.get('/admin/all', protectAdmin, getAllServicesAdmin);
router.post('/admin', protectAdmin, createService);
router.put('/admin/:id', protectAdmin, updateService);
router.delete('/admin/:id', protectAdmin, deleteService);

export default router;
