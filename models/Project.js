import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Websites', 'Mobile Apps', 'Marketing', 'Automation']
  },
  projectType: {
    type: String,
    default: 'Concept Demonstration', // Clear ethical label per prompt requirement
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  gallery: [{
    type: String
  }],
  demoUrl: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String
  }],
  features: [{
    type: String
  }],
  clientChallenge: {
    type: String,
    default: ''
  },
  deliveredSolution: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
