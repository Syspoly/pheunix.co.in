import mongoose from 'mongoose';

const websiteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  group: {
    type: String,
    default: 'general'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WebsiteSetting = mongoose.models.WebsiteSetting || mongoose.model('WebsiteSetting', websiteSettingSchema);
export default WebsiteSetting;
