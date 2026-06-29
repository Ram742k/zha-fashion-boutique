const Product = require('../models/Product');
const Category = require('../models/Category');

const resolveImageUrls = (product, req) => {
  if (!product) return product;
  const p = product.toObject({ virtuals: true });
  if (p.images && p.images.length > 0) {
    p.images = p.images.map(img => {
      if (img && img.startsWith('/uploads')) {
        // Build absolute URL from request headers
        return `${req.protocol}://${req.get('host')}${img}`;
      }
      return img;
    });
  }
  return p;
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    const resolved = products.map(product => resolveImageUrls(product, req));
    res.json(resolved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category_id');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(resolveImageUrls(product, req));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
    } else if (req.file) {
      productData.images = [`/uploads/products/${req.file.filename}`];
    }
    
    // Generate slug
    productData.slug = productData.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(resolveImageUrls(product, req));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
    } else if (req.file) {
      productData.images = [`/uploads/products/${req.file.filename}`];
    } else {
      delete productData.images; // Keep existing images if none uploaded
    }
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    res.json(resolveImageUrls(product, req));
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

exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    
    let csv = 'Product Name,Category,Price,Sale Price,Stock,Description,Status,Featured\n';
    for (const p of products) {
      const name = `"${(p.name || '').replace(/"/g, '""')}"`;
      const cat = `"${(p.category_id?.name || 'Uncategorized').replace(/"/g, '""')}"`;
      const desc = `"${(p.description || '').replace(/"/g, '""')}"`;
      csv += `${name},${cat},${p.price},${p.sale_price || 0},${p.stock},${desc},${p.status ? 'Live' : 'Hidden'},${p.is_featured ? 'Yes' : 'No'}\n`;
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products_export.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
