const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  item_type: { type: String, required: true },
  fabric: { type: String },
  measurements: { type: Object, required: true },
  images: [{ type: String }],
  status: { type: String, default: 'pending' },
  price_estimate: { type: Number },
  final_price: { type: Number },
  admin_notes: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('CustomOrder', customOrderSchema);
