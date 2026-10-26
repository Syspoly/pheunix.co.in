import WebsiteSetting from '../models/WebsiteSetting.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import { fallbackStore } from '../utils/dataStore.js';
import { getDbStatus } from '../config/db.js';

export const getPublicSettings = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let settings = [];

    if (isMongooseConnected) {
      settings = await WebsiteSetting.find({});
    } else {
      settings = await fallbackStore.settings.find({});
    }

    const map = {};
    settings.forEach(s => {
      map[s.key] = s.value;
    });

    res.json({
      success: true,
      data: map
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSettingsAdmin = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let settings = [];

    if (isMongooseConnected) {
      settings = await WebsiteSetting.find({});
    } else {
      settings = await fallbackStore.settings.find({});
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value, group } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, message: 'Setting key is required.' });
    }

    const { isMongooseConnected } = getDbStatus();
    let updated;

    if (isMongooseConnected) {
      updated = await WebsiteSetting.findOneAndUpdate(
        { key },
        { key, value, group: group || 'general', updatedAt: new Date() },
        { upsert: true, new: true }
      );
    } else {
      const existing = await fallbackStore.settings.findOne({ key });
      if (existing) {
        updated = await fallbackStore.settings.findByIdAndUpdate(existing._id, { value, group: group || existing.group });
      } else {
        updated = await fallbackStore.settings.create({ key, value, group: group || 'general' });
      }
    }

    res.json({
      success: true,
      message: `Setting "${key}" updated successfully.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let totalServices = 0;
    let totalProjects = 0;
    let publishedProjects = 0;
    let newEnquiries = 0;
    let totalEnquiries = 0;
    let recentEnquiries = [];
    let recentProjects = [];

    if (isMongooseConnected) {
      totalServices = await Service.countDocuments({});
      totalProjects = await Project.countDocuments({});
      publishedProjects = await Project.countDocuments({ isPublished: true });
      totalEnquiries = await Enquiry.countDocuments({});
      newEnquiries = await Enquiry.countDocuments({ status: 'New' });
      recentEnquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(5);
      recentProjects = await Project.find({}).sort({ createdAt: -1 }).limit(5);
    } else {
      totalServices = await fallbackStore.services.countDocuments({});
      totalProjects = await fallbackStore.projects.countDocuments({});
      publishedProjects = await fallbackStore.projects.countDocuments({ isPublished: true });
      totalEnquiries = await fallbackStore.enquiries.countDocuments({});
      newEnquiries = await fallbackStore.enquiries.countDocuments({ status: 'New' });
      const allEnq = await fallbackStore.enquiries.find({});
      allEnq.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      recentEnquiries = allEnq.slice(0, 5);
      const allProj = await fallbackStore.projects.find({});
      allProj.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      recentProjects = allProj.slice(0, 5);
    }

    res.json({
      success: true,
      data: {
        totalServices,
        totalProjects,
        publishedProjects,
        newEnquiries,
        totalEnquiries,
        recentEnquiries,
        recentProjects,
        dbStatus: getDbStatus()
      }
    });
  } catch (error) {
    next(error);
  }
};
