const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomOrder = require('../models/CustomOrder');
const EmbroideryOrder = require('../models/EmbroideryOrder');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard/stats', async (req, res) => {
  const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$grand_total" } } }]);
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const customOrdersCount = await CustomOrder.countDocuments();
  const embroideryCount = await EmbroideryOrder.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'customer' });

  const recentOrders = await Order.find().limit(5).sort({ createdAt: -1 }).populate('user');
  const recentCustomOrders = await CustomOrder.find().limit(5).sort({ createdAt: -1 }).populate('user');

  res.json({
    stats: [
      { label: 'Total Sales', value: `₹${(totalSales[0]?.total || 0).toLocaleString()}`, growth: 12, icon: 'TrendingUp' },
      { label: 'Pending Orders', value: pendingOrders.toString(), growth: 4, icon: 'ShoppingBag' },
      { label: 'Custom Stitching', value: customOrdersCount.toString(), growth: 25, icon: 'Scissors' },
      { label: 'Embroidery Work', value: embroideryCount.toString(), growth: 15, icon: 'Palette' },
      { label: 'Total Customers', value: totalUsers.toString(), growth: 8, icon: 'Users' },
    ],
    recentWork: recentCustomOrders.map(o => ({
        id: o._id,
        customer: o.user?.name || 'Guest',
        service: o.item_type,
        status: o.status,
        image: o.images?.[0] || '/assets/placeholder.png'
    })),
    shipments: recentOrders.map(o => ({
        id: o.order_number,
        product: 'Order #' + o.order_number,
        amount: `₹${o.grand_total.toLocaleString()}`,
        status: o.status
    }))
  });
});

router.get('/orders', async (req, res) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
});

router.patch('/orders/:id/status', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

router.get('/custom-orders', async (req, res) => {
  const orders = await CustomOrder.find().populate('user').sort({ createdAt: -1 });
  res.json(orders.map(o => ({
    ...o.toObject(),
    id: o._id,
    dress_type: o.item_type, // Frontend compatibility
    quotation_amount: o.price_estimate,
    requirements: o.notes // Frontend compatibility
  })));
});

router.patch('/custom-orders/:id/quotation', async (req, res) => {
  const order = await CustomOrder.findByIdAndUpdate(req.params.id, { price_estimate: req.body.amount }, { new: true });
  res.json(order);
});

router.patch('/custom-orders/:id/status', async (req, res) => {
  const order = await CustomOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

router.get('/embroidery-submissions', async (req, res) => {
  const orders = await EmbroideryOrder.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
});

const Portfolio = require('../models/Portfolio');

router.get('/embroidery', async (req, res) => {
  const works = await Portfolio.find().sort({ createdAt: -1 });
  res.json(works);
});

router.post('/embroidery', async (req, res) => {
  const work = new Portfolio(req.body);
  await work.save();
  res.status(201).json(work);
});

router.delete('/embroidery/:id', async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

router.get('/users', async (req, res) => {
  const users = await User.find({ role: 'customer' });
  res.json(users.map(u => ({
    ...u.toObject(),
    id: u._id,
    status: u.status ? 'active' : 'blocked'
  })));
});

router.post('/users/:id/toggle', async (req, res) => {
  const user = await User.findById(req.params.id);
  // Assuming frontend uses 'active' and 'blocked'
  user.status = !user.status; 
  await user.save();
  res.json({
    ...user.toObject(),
    id: user._id,
    status: user.status ? 'active' : 'blocked'
  });
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
