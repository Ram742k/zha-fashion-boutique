require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

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

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customOrderRoutes = require('./routes/customOrders');
const embroideryRoutes = require('./routes/embroidery');
const adminRoutes = require('./routes/admin');

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
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
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
