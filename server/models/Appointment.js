const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment_date: {
    type: String,
    required: true
  },
  appointment_time: {
    type: String,
    required: true
  },
  wedding_date: {
    type: String
  },
  inspiration_images: [{
    type: String
  }],
  measurements: {
    type: Map,
    of: String
  },
  budget: {
    type: Number
  },
  notes: {
    type: String
  },
  preferred_designer: {
    type: String
  },
  assigned_staff: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
