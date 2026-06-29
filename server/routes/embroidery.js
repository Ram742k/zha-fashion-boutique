const express = require('express');
const router = express.Router();
const EmbroideryOrder = require('../models/EmbroideryOrder');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const order = new EmbroideryOrder({
      ...req.body,
      user: req.user._id,
      order_number: 'EMB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my-submissions', authMiddleware, async (req, res) => {
  try {
    const submissions = await EmbroideryOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
