const mongoose = require('mongoose');

const embroideryOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_number: { type: String, required: true, unique: true },
  design_image: { type: String },
  fabric_type: { type: String },
  type: { type: String },
  quantity: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, default: 'pending' },
  notes: { type: String },
  price: { type: Number },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('EmbroideryOrder', embroideryOrderSchema);
