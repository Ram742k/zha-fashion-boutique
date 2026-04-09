require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

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
    console.log('Admin user created');

    // 2. Create Categories
    const categories = [
      { name: 'Lehengas', slug: 'lehengas' },
      { name: 'Sarees', slug: 'sarees' },
      { name: 'Kurti Sets', slug: 'kurti-sets' },
      { name: 'Anarkalis', slug: 'anarkalis' },
      { name: 'Gowns', slug: 'gowns' },
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created');

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
        description: 'Exquisite bridal lehenga with intricate thread work and premium velvet fabric. A timeless piece for your special day.',
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
        description: 'Purple beauty with modern silhouette and elegant draping. Perfect for evening soirées.',
        price: 45000,
        images: [
          '/assets/shop2.png',
          '/assets/salwar.png'
        ],
      }
    ];
    await Product.insertMany(products);
    console.log('Products created');

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
