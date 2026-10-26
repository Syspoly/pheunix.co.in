import Project from '../models/Project.js';
import { fallbackStore } from '../utils/dataStore.js';
import { getDbStatus } from '../config/db.js';

export const getPublicProjects = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const { isMongooseConnected } = getDbStatus();
    let filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    let projects = [];

    if (isMongooseConnected) {
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { technologies: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    } else {
      projects = await fallbackStore.projects.find({ isPublished: true });
      if (category && category !== 'All') {
        projects = projects.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        projects = projects.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q)))
        );
      }
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    let projects = [];

    if (isMongooseConnected) {
      projects = await Project.find().sort({ order: 1, createdAt: -1 });
    } else {
      projects = await fallbackStore.projects.find({});
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { isMongooseConnected } = getDbStatus();
    let project = null;

    if (isMongooseConnected) {
      project = await Project.findOne({ slug });
    } else {
      project = await fallbackStore.projects.findOne({ slug });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { isMongooseConnected } = getDbStatus();
    const projectData = req.body;

    if (!projectData.title || !projectData.category || !projectData.shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title, category, and short description.'
      });
    }

    if (!projectData.slug) {
      projectData.slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    let newProject;
    if (isMongooseConnected) {
      newProject = await Project.create(projectData);
    } else {
      newProject = await fallbackStore.projects.create(projectData);
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: newProject
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { isMongooseConnected } = getDbStatus();

    let updatedProject;
    if (isMongooseConnected) {
      updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true });
    } else {
      updatedProject = await fallbackStore.projects.findByIdAndUpdate(id, updates);
    }

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isMongooseConnected } = getDbStatus();

    let deleted;
    if (isMongooseConnected) {
      deleted = await Project.findByIdAndDelete(id);
    } else {
      deleted = await fallbackStore.projects.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
