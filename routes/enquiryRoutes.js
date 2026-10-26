import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for enquiry submissions: max 10 requests per 15 minutes per IP
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many enquiry requests from this IP. Please wait a few minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public submission
router.post('/', enquiryLimiter, submitEnquiry);

// Admin endpoints
router.get('/admin', protectAdmin, getEnquiries);
router.get('/admin/:id', protectAdmin, getEnquiryById);
router.patch('/admin/:id/status', protectAdmin, updateEnquiryStatus);
router.post('/admin/:id/notes', protectAdmin, addEnquiryNote);
router.delete('/admin/:id', protectAdmin, deleteEnquiry);

export default router;
