const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount_percent: { type: Number, required: true },
  max_discount: { type: Number },
  expiry_date: { type: Date, required: true },
  status: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Coupon', couponSchema);
