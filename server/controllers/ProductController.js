const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category_id');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.images = [`/uploads/products/${req.file.filename}`];
    }
    
    // Generate slug
    productData.slug = productData.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.images = [`/uploads/products/${req.file.filename}`];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
