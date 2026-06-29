const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');

// Book a new appointment / consultation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { appointment_date, appointment_time, wedding_date, inspiration_images, measurements, budget, notes, preferred_designer } = req.body;
    
    const appointment = new Appointment({
      user: req.user._id,
      appointment_date,
      appointment_time,
      wedding_date,
      inspiration_images,
      measurements,
      budget,
      notes,
      preferred_designer
    });
    
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View customer's own appointments
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
