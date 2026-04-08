require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  // Electronics
  {
    name: 'Apple iPhone 15',
    description: 'Latest Apple iPhone with A16 Bionic chip, 48MP camera, and Dynamic Island.',
    price: 79999,
    category: 'Electronics',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Flagship Android phone with Snapdragon 8 Gen 2, 200MP camera.',
    price: 64999,
    category: 'Electronics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling wireless headphones with 30hr battery.',
    price: 24999,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500'
  },
  {
    name: 'Dell Inspiron 15 Laptop',
    description: 'Intel Core i5, 16GB RAM, 512GB SSD, Windows 11 Home.',
    price: 55999,
    category: 'Electronics',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'
  },
  {
    name: 'boAt Airdopes 141',
    description: 'True wireless earbuds with 42hr total playback and ENx noise cancellation.',
    price: 1299,
    category: 'Electronics',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'
  },

  // Fashion
  {
    name: 'Men\'s Slim Fit Jeans',
    description: 'Comfortable stretch denim slim fit jeans in classic blue.',
    price: 1499,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'
  },
  {
    name: 'Women\'s Floral Kurti',
    description: 'Elegant cotton floral print kurti, perfect for casual and festive wear.',
    price: 899,
    category: 'Fashion',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500'
  },
  {
    name: 'Nike Air Max Sneakers',
    description: 'Lightweight running shoes with Air Max cushioning for all-day comfort.',
    price: 8999,
    category: 'Fashion',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
  },
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with RFID blocking and multiple card slots.',
    price: 699,
    category: 'Fashion',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
  },

  // Home & Kitchen
  {
    name: 'Philips Air Fryer',
    description: '4.1L digital air fryer with rapid air technology. Up to 90% less fat.',
    price: 8499,
    category: 'Home & Kitchen',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1648170645866-0f5b40e5e5e5?w=500'
  },
  {
    name: 'Prestige Induction Cooktop',
    description: '2000W induction cooktop with 7 preset menus and auto-off feature.',
    price: 2299,
    category: 'Home & Kitchen',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'
  },
  {
    name: 'Milton Thermosteel Flask',
    description: '1 litre stainless steel flask, keeps beverages hot/cold for 24 hours.',
    price: 649,
    category: 'Home & Kitchen',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
  },
  {
    name: 'Wooden Serving Tray',
    description: 'Handcrafted mango wood serving tray with handles, 40x30cm.',
    price: 799,
    category: 'Home & Kitchen',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500'
  },

  // Books
  {
    name: 'Atomic Habits – James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 399,
    category: 'Books',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'
  },
  {
    name: 'The Alchemist – Paulo Coelho',
    description: 'A magical story about following your dreams. Bestselling novel worldwide.',
    price: 299,
    category: 'Books',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'
  },
  {
    name: 'Rich Dad Poor Dad',
    description: 'Robert Kiyosaki\'s personal finance classic on building wealth.',
    price: 349,
    category: 'Books',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500'
  },
  {
    name: 'Zero to One – Peter Thiel',
    description: 'Notes on startups, or how to build the future. A must-read for entrepreneurs.',
    price: 449,
    category: 'Books',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500'
  },
  {
    name: 'Deep Work – Cal Newport',
    description: 'Rules for focused success in a distracted world.',
    price: 379,
    category: 'Books',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin user
  await User.deleteOne({ email: 'admin@shopeasy.com' });
  const hashed = await bcrypt.hash('Admin@1234', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@shopeasy.com',
    password: hashed,
    isAdmin: true
  });
  console.log('Admin created → admin@shopeasy.com / Admin@1234');

  // Seed products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`${products.length} products seeded across 4 categories:`);
  console.log('  Electronics (5), Fashion (4), Home & Kitchen (4), Books (5)');

  mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
