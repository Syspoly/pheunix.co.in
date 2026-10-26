import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
  tagline: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Globe'
  },
  visualType: {
    type: String,
    default: 'laptop-mobile'
  },
  businessProblem: {
    type: String,
    required: true
  },
  howItWorks: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  useCases: [{
    type: String
  }],
  workflowSteps: [{
    stepNumber: Number,
    title: String,
    description: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
