const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  variant: { type: Object },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  total_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  grand_total: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, processing, shipped, delivered, cancelled
  payment_method: { type: String, default: 'cod' },
  payment_status: { type: String, default: 'pending' },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  shipping_address: { type: Object, required: true },
  notes: { type: String },
  items: [orderItemSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Order', orderSchema);
