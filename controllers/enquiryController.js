import Enquiry from '../models/Enquiry.js';
import { fallbackStore } from '../utils/dataStore.js';
import { getDbStatus } from '../config/db.js';

export const submitEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      businessName,
      industry,
      serviceRequired,
      estimatedBudget,
      projectDescription,
      preferredContactMethod,
      consent,
      // Honeypot spam field
      website_url_check
    } = req.body;

    // Honeypot spam trap
    if (website_url_check) {
      return res.status(200).json({
        success: true,
        message: 'Your enquiry has been received.'
      });
    }

    // Server-side validations
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your contact phone number.' });
    }
    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Please share a brief description of your project.' });
    }
    if (!serviceRequired) {
      return res.status(400).json({ success: false, message: 'Please select a service or choose "Not Sure".' });
    }
    if (!consent) {
      return res.status(400).json({ success: false, message: 'Please agree to the communication terms.' });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const enquiryData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      businessName: (businessName || '').trim(),
      industry: industry || 'Other',
      serviceRequired,
      estimatedBudget: estimatedBudget || 'Flexible',
      projectDescription: projectDescription.trim(),
      preferredContactMethod: preferredContactMethod || 'Email',
      consent: Boolean(consent),
      status: 'New',
      internalNotes: [],
      ipAddress: String(ipAddress),
      createdAt: new Date()
    };

    const { isMongooseConnected } = getDbStatus();
    let savedEnquiry;

    if (isMongooseConnected) {
      savedEnquiry = await Enquiry.create(enquiryData);
    } else {
      savedEnquiry = await fallbackStore.enquiries.create(enquiryData);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received successfully. Our team will contact you shortly.',
      enquiryId: savedEnquiry._id || savedEnquiry.id
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, service, search } = req.query;
    const { isMongooseConnected } = getDbStatus();

    let enquiries = [];

    if (isMongooseConnected) {
      const filter = {};
      if (status && status !== 'All') filter.status = status;
      if (service && service !== 'All') filter.serviceRequired = service;
      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { businessName: { $regex: search, $options: 'i' } }
        ];
      }
      enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    } else {
      enquiries = await fallbackStore.enquiries.find({});
      if (status && status !== 'All') {
        enquiries = enquiries.filter(e => e.status === status);
      }
      if (service && service !== 'All') {
        enquiries = enquiries.filter(e => e.serviceRequired === service);
      }
      if (search) {
        const q = search.toLowerCase();
        enquiries = enquiries.filter(e => 
          (e.fullName && e.fullName.toLowerCase().includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.businessName && e.businessName.toLowerCase().includes(q))
        );
      }
      enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isMongooseConnected } = getDbStatus();

    let enquiry;
    if (isMongooseConnected) {
      enquiry = await Enquiry.findById(id);
    } else {
      enquiry = await fallbackStore.enquiries.findById(id);
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value provided.' });
    }

    const { isMongooseConnected } = getDbStatus();
    let updated;

    if (isMongooseConnected) {
      updated = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      updated = await fallbackStore.enquiries.findByIdAndUpdate(id, { status });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: `Enquiry status updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const addEnquiryNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a note content.' });
    }

    const noteObj = {
      note: note.trim(),
      author: req.admin?.username || 'Admin',
      createdAt: new Date()
    };

    const { isMongooseConnected } = getDbStatus();
    let updated;

    if (isMongooseConnected) {
      updated = await Enquiry.findByIdAndUpdate(
        id,
        { $push: { internalNotes: noteObj } },
        { new: true }
      );
    } else {
      updated = await fallbackStore.enquiries.findByIdAndUpdate(id, {
        $push: { internalNotes: noteObj }
      });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: 'Internal note added.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isMongooseConnected } = getDbStatus();

    let deleted;
    if (isMongooseConnected) {
      deleted = await Enquiry.findByIdAndDelete(id);
    } else {
      deleted = await fallbackStore.enquiries.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
