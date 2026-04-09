const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id,
      order_number: 'ZF-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
