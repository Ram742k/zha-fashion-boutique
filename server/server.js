require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Global Debug Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customOrderRoutes = require('./routes/customOrders');
const embroideryRoutes = require('./routes/embroidery');
const adminRoutes = require('./routes/admin');

// Priority API Routes (Bypass DB check)
app.get('/api/test', (req, res) => res.json({ working: true, serverTime: new Date() }));

// EMERGENCY SEED ROUTE (Delete after use)
app.get('/api/seed-database', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    // 2. Create Categories
    const categories = [
      { name: 'Lehengas', slug: 'lehengas' },
      { name: 'Sarees', slug: 'sarees' },
      { name: 'Kurti Sets', slug: 'kurti-sets' },
      { name: 'Anarkalis', slug: 'anarkalis' },
      { name: 'Gowns', slug: 'gowns' },
    ];
    const createdCategories = await Category.insertMany(categories);

    // 3. Create Products
    const products = [
      {
        category_id: createdCategories[1]._id,
        name: 'Crimson Silk Saree with Zari Border',
        slug: 'crimson-saree',
        description: 'Luxury silk saree',
        price: 18500,
        sale_price: 15999,
        images: [
          '/assets/shop1.png',
          '/assets/product1.png',
          '/assets/product2.png',
          '/assets/shop3.png'
        ],
        is_featured: true,
      },
      {
        category_id: createdCategories[0]._id,
        name: 'Hand-Embroidered Velvet Lehenga',
        slug: 'velvet-lehenga',
        description: 'Exquisite bridal lehenga with intricate thread work and premium velvet fabric.',
        price: 45000,
        images: [
          '/assets/lehengas.png',
          '/assets/shop2.png',
          '/assets/designer_lehenga.png'
        ],
        is_featured: true,
      },
      {
        category_id: createdCategories[4]._id,
        name: 'Royal Purple Gown',
        slug: 'blue-anarkali',
        description: 'Purple beauty with modern silhouette and elegant draping.',
        price: 45000,
        images: [
          '/assets/shop2.png',
          '/assets/salwar.png'
        ],
      }
    ];
    await Product.insertMany(products);

    res.json({ 
      success: true,
      message: "Database seeded fully!", 
      counts: {
        users: 1,
        categories: categories.length,
        products: products.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DB Connection Health Check Middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && !req.path.startsWith('/uploads')) {
    return res.status(503).json({ 
      error: 'Database connection is still initializing or unavailable.',
      status: mongoose.connection.readyState
    });
  }
  next();
});

// Multer Config
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/products';
    const fs = require('fs');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
app.set('upload', upload);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/embroidery', embroideryRoutes);
app.use('/api/admin', adminRoutes);


// Serve Frontend in Production
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.get(/^(?!\/(api|uploads)).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    
    const MONGO_OPTIONS = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    };

    await mongoose.connect(process.env.MONGO_URI, MONGO_OPTIONS);
    console.log("✅ Successfully Connected to MongoDB");

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Checking network...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Runtime Error:', err.message);
    });

    app.listen(PORT, () => {
      console.log(`🚀 ZHA Fashion Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    console.log("Checking for network restrictions or whitelisting...");
    // Fallback: Start server anyway so user sees 503 error in UI
    app.listen(PORT, () => {
        console.log(`⚠️ Server running in MAINTENANCE MODE on port ${PORT} (DB Offline)`);
    });
  }
}

startServer();
