const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomOrder = require('../models/CustomOrder');
const EmbroideryOrder = require('../models/EmbroideryOrder');
const Setting = require('../models/Setting');
const upload = require('../middleware/upload');
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
  const orders = await CustomOrder.find().populate('user').populate('assigned_tailor').sort({ createdAt: -1 });
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

router.patch('/custom-orders/:id/tailor', async (req, res) => {
  const { assigned_tailor, admin_notes } = req.body;
  const order = await CustomOrder.findByIdAndUpdate(req.params.id, { assigned_tailor, admin_notes }, { new: true });
  res.json(order);
});

router.get('/embroidery-submissions', async (req, res) => {
  const orders = await EmbroideryOrder.find().populate('user').populate('assigned_designer').sort({ createdAt: -1 });
  res.json(orders);
});

router.patch('/embroidery-submissions/:id/designer', async (req, res) => {
  const { assigned_designer, notes, price, status } = req.body;
  const updateData = {};
  if (assigned_designer !== undefined) updateData.assigned_designer = assigned_designer;
  if (notes !== undefined) updateData.notes = notes;
  if (price !== undefined) updateData.price = price;
  if (status !== undefined) updateData.status = status;
  
  const order = await EmbroideryOrder.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(order);
});

router.get('/staff', async (req, res) => {
  const staff = await User.find({ role: { $ne: 'customer' } }).select('name email role');
  res.json(staff);
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

function generateInvoiceHtml(order) {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const itemsHtml = order.items.map(item => {
    const name = item.product?.name || 'Custom Garment / Stitching Service';
    const variantStr = item.variant ? Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
    return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #F4EBE1;">
          <div style="font-weight: bold; color: #0C1E36;">${name}</div>
          ${variantStr ? `<div style="font-size: 10px; color: #C9A227; margin-top: 4px;">${variantStr}</div>` : ''}
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #F4EBE1; text-align: right;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 15px; border-bottom: 1px solid #F4EBE1; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px; border-bottom: 1px solid #F4EBE1; text-align: right; font-weight: bold; color: #0C1E36;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  const shipping = order.shipping_address || {};
  const addressStr = [
    shipping.address,
    shipping.city,
    shipping.state,
    shipping.zip
  ].filter(Boolean).join(', ');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${order.order_number}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@100..900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #FDFBF7;
          color: #4A5568;
          margin: 0;
          padding: 40px;
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          background: #FFFFFF;
          padding: 50px;
          border: 4px double #C9A227;
          box-shadow: 0 10px 30px rgba(12, 30, 54, 0.05);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #F4EBE1;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }
        .logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 800;
          color: #0C1E36;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .logo-sub {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #C9A227;
          text-transform: uppercase;
          font-weight: bold;
          margin-top: 5px;
        }
        .invoice-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #0C1E36;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-style: italic;
          margin: 0;
          text-align: right;
        }
        .details-grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .detail-card h4 {
          font-family: 'Playfair Display', serif;
          color: #0C1E36;
          font-size: 16px;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 1px solid #C9A227;
          padding-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .detail-card p {
          font-size: 12px;
          line-height: 1.8;
          margin: 0 0 5px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        th {
          font-family: 'Playfair Display', serif;
          color: #0C1E36;
          background: #FDFBF7;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 15px;
          border-bottom: 2px solid #C9A227;
        }
        .totals-table {
          width: 300px;
          margin-left: auto;
          margin-bottom: 0;
        }
        .totals-table td {
          padding: 10px 15px;
          font-size: 13px;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          color: #C9A227;
          border-top: 2px solid #0C1E36;
          padding-top: 15px !important;
        }
        .footer-note {
          text-align: center;
          font-size: 10px;
          color: #A0AEC0;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 60px;
          border-top: 1px solid #F4EBE1;
          padding-top: 30px;
        }
        .actions {
          max-width: 800px;
          margin: 30px auto;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        .btn {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 12px 30px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-print {
          background: #C9A227;
          color: #FFFFFF;
        }
        .btn-print:hover {
          background: #0C1E36;
        }
        @media print {
          body {
            background: #FFFFFF;
            padding: 0;
          }
          .invoice-box {
            box-shadow: none;
            border: 4px double #C9A227;
          }
          .actions {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="actions">
        <button class="btn btn-print" onclick="window.print()">Print Invoice</button>
      </div>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo-title">ZHA FASHION</div>
            <div class="logo-sub">Studio & Couture</div>
          </div>
          <div>
            <h1 class="invoice-title">Invoice</h1>
            <div style="font-size: 11px; text-align: right; margin-top: 10px; color: #718096; text-transform: uppercase; letter-spacing: 0.1em;">
              Order: <strong>#${order.order_number}</strong><br/>
              Date: ${dateStr}
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <h4>Billed To</h4>
            <p><strong>Name:</strong> ${order.user?.name || 'Valued Customer'}</p>
            <p><strong>Email:</strong> ${order.user?.email || '-'}</p>
            <p><strong>Phone:</strong> ${shipping.phone || '-'}</p>
            <p><strong>Address:</strong> ${addressStr || '-'}</p>
          </div>
          <div class="detail-card">
            <h4>Payment & Shipping</h4>
            <p><strong>Payment Method:</strong> ${order.payment_method ? order.payment_method.toUpperCase() : 'COD'}</p>
            <p><strong>Payment Status:</strong> <span style="color: ${order.payment_status === 'paid' ? '#48BB78' : '#ECC94B'}">${order.payment_status ? order.payment_status.toUpperCase() : 'PENDING'}</span></p>
            <p><strong>Shipping Status:</strong> ${order.status ? order.status.toUpperCase() : 'PENDING'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item & Description</th>
              <th style="text-align: right; width: 120px;">Unit Price</th>
              <th style="text-align: center; width: 80px;">Qty</th>
              <th style="text-align: right; width: 120px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td style="color: #718096;">Subtotal</td>
            <td style="text-align: right; font-weight: bold;">₹${order.total_amount.toLocaleString()}</td>
          </tr>
          ${order.discount_amount > 0 ? `
          <tr>
            <td style="color: #E53E3E;">Discount</td>
            <td style="text-align: right; color: #E53E3E; font-weight: bold;">-₹${order.discount_amount.toLocaleString()}</td>
          </tr>` : ''}
          ${order.payment_method === 'cod' ? `
          <tr>
            <td style="color: #718096;">COD Convenience Fee</td>
            <td style="text-align: right; font-weight: bold;">₹99</td>
          </tr>` : ''}
          <tr>
            <td class="grand-total">Grand Total</td>
            <td class="grand-total" style="text-align: right;">₹${order.grand_total.toLocaleString()}</td>
          </tr>
        </table>

        <div class="footer-note">
          Thank you for choosing Zha Fashion Studio<br/>
          <span style="font-size: 8px; margin-top: 10px; display: block; color: #CBD5E0;">This is a computer-generated invoice and requires no signature.</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

router.get('/orders/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.product');
      
    if (!order) return res.status(404).send('<h1>Order Not Found</h1>');
    
    const html = generateInvoiceHtml(order);
    res.send(html);
  } catch (error) {
    res.status(500).send(`<h1>Server Error: ${error.message}</h1>`);
  }
});

router.get('/settings', async (req, res) => {
  try {
    const dbSettings = await Setting.find();
    const config = {
      store_name: 'Zha Fashion Studio',
      currency: 'INR',
      razorpay_key: '',
      razorpay_secret: '',
      logo_url: ''
    };
    
    dbSettings.forEach(s => {
      config[s.key] = s.value;
    });
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/settings', upload.single('logo_file'), async (req, res) => {
  try {
    const keys = ['store_name', 'currency', 'razorpay_key', 'razorpay_secret'];
    
    for (const key of keys) {
      if (req.body[key] !== undefined) {
        await Setting.findOneAndUpdate(
          { key },
          { value: req.body[key] },
          { upsert: true, new: true }
        );
      }
    }
    
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      const logoUrl = `${protocol}://${host}/uploads/products/${req.file.filename}`;
      
      await Setting.findOneAndUpdate(
        { key: 'logo_url' },
        { value: logoUrl },
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Appointment = require('../models/Appointment');

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user').sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/appointments/:id/status
router.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/admin/appointments/:id/designer
router.patch('/appointments/:id/designer', async (req, res) => {
  try {
    const { preferred_designer, notes, assigned_staff } = req.body;
    const updateData = {};
    if (preferred_designer !== undefined) updateData.preferred_designer = preferred_designer;
    if (assigned_staff !== undefined) updateData.assigned_staff = assigned_staff;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
