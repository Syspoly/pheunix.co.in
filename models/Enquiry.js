import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  businessName: {
    type: String,
    trim: true,
    default: ''
  },
  industry: {
    type: String,
    trim: true,
    default: 'Other'
  },
  serviceRequired: {
    type: String,
    required: [true, 'Service selection is required'],
    enum: [
      'Website Development',
      'App Development',
      'Digital Marketing',
      'Business Marketing',
      'Business Automation',
      'Not Sure — Help Me Choose'
    ]
  },
  estimatedBudget: {
    type: String,
    default: 'Flexible'
  },
  projectDescription: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  preferredContactMethod: {
    type: String,
    enum: ['Email', 'Phone', 'WhatsApp'],
    default: 'Email'
  },
  consent: {
    type: Boolean,
    required: [true, 'Consent is required to submit enquiry']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'],
    default: 'New'
  },
  internalNotes: [{
    note: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ipAddress: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
