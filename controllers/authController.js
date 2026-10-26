import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import Admin from '../models/Admin.js';
import { fallbackStore } from '../utils/dataStore.js';
import { getDbStatus } from '../config/db.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    let admin = null;
    const { isMongooseConnected } = getDbStatus();

    if (isMongooseConnected) {
      admin = await Admin.findOne({ email: email.toLowerCase() });
    } else {
      admin = await fallbackStore.admins.findOne({ email: email.toLowerCase() });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const token = generateToken({
      id: admin._id || admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role
    });

    res.json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        id: admin._id || admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let admin = null;

    if (isMongooseConnected) {
      admin = await Admin.findById(req.admin.id).select('-password');
    } else {
      const found = await fallbackStore.admins.findById(req.admin.id);
      if (found) {
        const { password, ...rest } = found;
        admin = rest;
      }
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.'
      });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
};
