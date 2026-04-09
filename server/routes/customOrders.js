const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/CustomOrder');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const orderData = { ...req.body };
    if (req.body.image) {
        orderData.images = [req.body.image];
    }
    
    const order = new CustomOrder({
      ...orderData,
      user: req.user._id,
      order_number: 'ST-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
