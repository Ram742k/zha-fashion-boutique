const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  type: { type: String, required: true }, // size, color, fabric
  value: { type: String, required: true },
  price_modifier: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  sale_price: { type: Number },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  is_featured: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  variants: [variantSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Product', productSchema);
