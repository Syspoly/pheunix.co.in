import express from 'express';
import {
  getPublicProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProjects);
router.get('/slug/:slug', getProjectBySlug);

// Admin protected routes
router.get('/admin/all', protectAdmin, getAllProjectsAdmin);
router.post('/admin', protectAdmin, createProject);
router.put('/admin/:id', protectAdmin, updateProject);
router.delete('/admin/:id', protectAdmin, deleteProject);

export default router;
