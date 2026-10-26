import Service from '../models/Service.js';
import { fallbackStore } from '../utils/dataStore.js';
import { getDbStatus } from '../config/db.js';

export const getPublicServices = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let services = [];

    if (isMongooseConnected) {
      services = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    } else {
      services = await fallbackStore.services.find({ isPublished: true });
      services.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let services = [];

    if (isMongooseConnected) {
      services = await Service.find().sort({ order: 1, createdAt: 1 });
    } else {
      services = await fallbackStore.services.find({});
      services.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { isMongooseConnected } = getDbStatus();
    let service = null;

    if (isMongooseConnected) {
      service = await Service.findOne({ slug });
    } else {
      service = await fallbackStore.services.findOne({ slug });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    const serviceData = req.body;

    if (!serviceData.title || !serviceData.slug || !serviceData.shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, slug, and short description.'
      });
    }

    let newService;
    if (isMongooseConnected) {
      newService = await Service.create(serviceData);
    } else {
      newService = await fallbackStore.services.create(serviceData);
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: newService
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { isMongooseConnected } = getDbStatus();

    let updatedService;
    if (isMongooseConnected) {
      updatedService = await Service.findByIdAndUpdate(id, updates, { new: true });
    } else {
      updatedService = await fallbackStore.services.findByIdAndUpdate(id, updates);
    }

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully.',
      data: updatedService
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isMongooseConnected } = getDbStatus();

    let deleted;
    if (isMongooseConnected) {
      deleted = await Service.findByIdAndDelete(id);
    } else {
      deleted = await fallbackStore.services.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    res.json({
      success: true,
      message: 'Service removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
