require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  // Electronics
  { name: 'Apple iPhone 15', description: 'Latest Apple iPhone with A16 Bionic chip, 48MP camera, and Dynamic Island.', price: 79999, category: 'Electronics', stock: 20, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' },
  { name: 'Samsung Galaxy S23', description: 'Flagship Android phone with Snapdragon 8 Gen 2, 200MP camera.', price: 64999, category: 'Electronics', stock: 15, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500' },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancelling wireless headphones with 30hr battery.', price: 24999, category: 'Electronics', stock: 30, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500' },
  { name: 'Dell Inspiron 15 Laptop', description: 'Intel Core i5, 16GB RAM, 512GB SSD, Windows 11 Home.', price: 55999, category: 'Electronics', stock: 10, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500' },
  { name: 'boAt Airdopes 141', description: 'True wireless earbuds with 42hr total playback and ENx noise cancellation.', price: 1299, category: 'Electronics', stock: 50, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500' },

  // Men's Fashion
  { name: "Men's Slim Fit Jeans", description: 'Comfortable stretch denim slim fit jeans in classic blue. Available in 28-38 waist.', price: 1499, category: "Men's Fashion", stock: 40, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
  { name: "Men's Formal Shirt", description: 'Premium cotton formal shirt with slim fit. Perfect for office and events.', price: 999, category: "Men's Fashion", stock: 55, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500' },
  { name: "Men's Casual T-Shirt", description: 'Round neck 100% cotton casual t-shirt. Available in multiple colors.', price: 499, category: "Men's Fashion", stock: 100, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
  { name: 'Nike Air Max Sneakers', description: 'Lightweight running shoes with Air Max cushioning for all-day comfort.', price: 8999, category: "Men's Fashion", stock: 25, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { name: "Men's Leather Belt", description: 'Genuine leather reversible belt with silver buckle. Fits waist 28-44 inches.', price: 599, category: "Men's Fashion", stock: 70, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500' },
  { name: 'Leather Wallet', description: 'Genuine leather bifold wallet with RFID blocking and multiple card slots.', price: 699, category: "Men's Fashion", stock: 80, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500' },

  // Kurtis
  { name: "Women's Floral Cotton Kurti", description: 'Elegant cotton floral print kurti, perfect for casual and festive wear. Available in S-XL.', price: 899, category: 'Kurtis', stock: 60, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500' },
  { name: 'Anarkali Embroidered Kurti', description: 'Beautiful Anarkali style kurti with intricate embroidery, ideal for festive occasions.', price: 1499, category: 'Kurtis', stock: 45, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' },
  { name: 'Straight Cut Printed Kurti', description: 'Trendy straight cut kurti with geometric print. Pairs well with leggings or palazzos.', price: 749, category: 'Kurtis', stock: 70, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500' },
  { name: 'Silk Blend Festive Kurti', description: 'Premium silk blend kurti with golden border, perfect for weddings and celebrations.', price: 2199, category: 'Kurtis', stock: 30, image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500' },
  { name: 'Rayon A-Line Kurti', description: 'Soft rayon A-line kurti with block print design. Comfortable for daily wear.', price: 649, category: 'Kurtis', stock: 90, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500' },
  { name: 'Palazzo Kurti Set', description: 'Matching kurti and palazzo set in cotton fabric with mirror work detailing.', price: 1799, category: 'Kurtis', stock: 35, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=500' },
  { name: 'Chikankari Lucknowi Kurti', description: 'Authentic Lucknowi chikankari hand-embroidered kurti in soft cotton fabric.', price: 1299, category: 'Kurtis', stock: 40, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500' },
  { name: 'Tie-Dye Casual Kurti', description: 'Trendy tie-dye kurti in vibrant colors, perfect for casual outings.', price: 599, category: 'Kurtis', stock: 55, image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=500' },

  // Sarees
  { name: 'Banarasi Silk Saree', description: 'Pure Banarasi silk saree with zari work and rich golden border. Comes with blouse piece.', price: 4999, category: 'Sarees', stock: 20, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' },
  { name: 'Cotton Printed Saree', description: 'Lightweight cotton saree with floral print. Ideal for daily wear and office.', price: 799, category: 'Sarees', stock: 60, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500' },
  { name: 'Kanjivaram Silk Saree', description: 'Traditional Kanjivaram silk saree with temple border and rich pallu. Wedding special.', price: 8999, category: 'Sarees', stock: 15, image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500' },
  { name: 'Georgette Party Saree', description: 'Elegant georgette saree with sequin embellishments. Perfect for parties and functions.', price: 1899, category: 'Sarees', stock: 35, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500' },
  { name: 'Chiffon Floral Saree', description: 'Soft chiffon saree with delicate floral print and lace border. Casual and festive.', price: 1299, category: 'Sarees', stock: 45, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=500' },
  { name: 'Linen Handloom Saree', description: 'Eco-friendly handloom linen saree with natural dye. Comfortable for summer.', price: 2499, category: 'Sarees', stock: 25, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500' },
  { name: 'Designer Embroidered Saree', description: 'Heavy embroidered designer saree with stone work. Perfect for weddings and receptions.', price: 6499, category: 'Sarees', stock: 12, image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=500' },
  { name: 'Patola Silk Saree', description: 'Authentic double ikat Patola silk saree from Gujarat with geometric patterns.', price: 5999, category: 'Sarees', stock: 10, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500' },

  // Beauty
  { name: 'Lakme 9to5 Lipstick', description: 'Long-lasting matte lipstick with rich pigment. Stays up to 16 hours. Shade: Rose Touch.', price: 349, category: 'Beauty', stock: 120, image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f9b?w=500' },
  { name: 'Maybelline Fit Me Foundation', description: 'Lightweight foundation with natural coverage. Suitable for normal to oily skin. SPF 18.', price: 499, category: 'Beauty', stock: 80, image: 'https://images.unsplash.com/photo-1631214524020-3c69b3b0e5e5?w=500' },
  { name: "L'Oreal Paris Hyaluronic Serum", description: 'Revitalift 1.5% pure hyaluronic acid serum for intense hydration and plumping effect.', price: 799, category: 'Beauty', stock: 60, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500' },
  { name: 'Biotique Sunscreen SPF 50', description: 'Herbal sunscreen with SPF 50 PA+++. Non-greasy, water resistant formula.', price: 299, category: 'Beauty', stock: 100, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500' },
  { name: 'Nykaa Eyeshadow Palette', description: '12-shade eyeshadow palette with matte and shimmer finishes. Long-lasting formula.', price: 599, category: 'Beauty', stock: 75, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500' },
  { name: 'Himalaya Purifying Face Wash', description: 'Neem face wash that removes impurities and controls excess oil. 150ml.', price: 179, category: 'Beauty', stock: 200, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500' },
  { name: 'Dove Deep Moisture Body Lotion', description: 'Deep moisture body lotion with natural moisturising cream. 400ml. For dry skin.', price: 249, category: 'Beauty', stock: 150, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500' },
  { name: 'Mamaearth Vitamin C Face Cream', description: 'Brightening face cream with Vitamin C and turmeric for glowing skin. 50g.', price: 399, category: 'Beauty', stock: 90, image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500' },

  // Accessories
  { name: 'Gold Plated Chain Necklace', description: '18K gold plated chain necklace with lobster clasp. Length 18 inches. Tarnish resistant.', price: 799, category: 'Accessories', stock: 60, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500' },
  { name: 'Diamond CZ Finger Ring', description: 'Elegant CZ diamond studded finger ring in silver finish. Adjustable size fits all.', price: 499, category: 'Accessories', stock: 90, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500' },
  { name: 'Oxidised Silver Jhumka Earrings', description: 'Traditional oxidised silver jhumka earrings with intricate design. Lightweight and stylish.', price: 349, category: 'Accessories', stock: 80, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500' },
  { name: 'Gold Hoop Earrings', description: 'Classic gold plated hoop earrings. Lightweight, hypoallergenic. Diameter 3cm.', price: 299, category: 'Accessories', stock: 100, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500' },
  { name: 'Pearl Stretch Bracelet', description: 'Elegant faux pearl stretch bracelet. One size fits all. Perfect for ethnic wear.', price: 249, category: 'Accessories', stock: 110, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500' },
  { name: 'Beaded Bracelet Set (6 pcs)', description: 'Set of 6 colorful beaded bracelets. Adjustable size, suitable for all wrists.', price: 199, category: 'Accessories', stock: 120, image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500' },
  { name: "Women's Handbag", description: 'Spacious PU leather handbag with multiple compartments. Ideal for daily use.', price: 1299, category: 'Accessories', stock: 35, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500' },
  { name: "Men's Analog Watch", description: 'Classic stainless steel analog watch with leather strap. Water resistant up to 30m.', price: 2499, category: 'Accessories', stock: 25, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { name: 'Kundan Maang Tikka', description: 'Bridal kundan maang tikka with pearl drops. Perfect for weddings and festive occasions.', price: 699, category: 'Accessories', stock: 40, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500' },
  { name: 'Silk Printed Dupatta', description: 'Lightweight silk dupatta with floral print and tassel ends. Pairs with any kurti or saree.', price: 449, category: 'Accessories', stock: 65, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500' },
  { name: "Women's Block Heel Sandals", description: 'Comfortable block heel sandals with ankle strap. Available in sizes 5-9.', price: 1499, category: 'Accessories', stock: 45, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500' },
  { name: "Women's Kolhapuri Chappal", description: 'Handcrafted genuine leather Kolhapuri chappal with traditional design.', price: 899, category: 'Accessories', stock: 55, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500' },
  { name: "Men's Formal Oxford Shoes", description: 'Premium leather formal Oxford shoes with cushioned insole. Sizes 6-11.', price: 2999, category: 'Accessories', stock: 30, image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500' },

  // Home & Kitchen
  { name: 'Philips Air Fryer', description: '4.1L digital air fryer with rapid air technology. Up to 90% less fat.', price: 8499, category: 'Home & Kitchen', stock: 18, image: 'https://images.unsplash.com/photo-1648170645866-0f5b40e5e5e5?w=500' },
  { name: 'Prestige Induction Cooktop', description: '2000W induction cooktop with 7 preset menus and auto-off feature.', price: 2299, category: 'Home & Kitchen', stock: 22, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500' },
  { name: 'Milton Thermosteel Flask', description: '1 litre stainless steel flask, keeps beverages hot/cold for 24 hours.', price: 649, category: 'Home & Kitchen', stock: 100, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500' },
  { name: 'Wooden Serving Tray', description: 'Handcrafted mango wood serving tray with handles, 40x30cm.', price: 799, category: 'Home & Kitchen', stock: 35, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500' },

  // Books
  { name: 'Atomic Habits – James Clear', description: 'An easy and proven way to build good habits and break bad ones.', price: 399, category: 'Books', stock: 200, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500' },
  { name: 'The Alchemist – Paulo Coelho', description: 'A magical story about following your dreams. Bestselling novel worldwide.', price: 299, category: 'Books', stock: 150, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500' },
  { name: 'Rich Dad Poor Dad', description: "Robert Kiyosaki's personal finance classic on building wealth.", price: 349, category: 'Books', stock: 180, image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500' },
  { name: 'Zero to One – Peter Thiel', description: 'Notes on startups, or how to build the future. A must-read for entrepreneurs.', price: 449, category: 'Books', stock: 90, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500' },
  { name: 'Deep Work – Cal Newport', description: 'Rules for focused success in a distracted world.', price: 379, category: 'Books', stock: 120, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteOne({ email: 'admin@shopeasy.com' });
  const hashed = await bcrypt.hash('Admin@1234', 10);
  await User.create({ name: 'Admin', email: 'admin@shopeasy.com', password: hashed, isAdmin: true });
  console.log('Admin created → admin@shopeasy.com / Admin@1234');

  // Create delivery partner
  await User.deleteOne({ email: 'delivery@shopeasy.com' });
  const dHash = await bcrypt.hash('Delivery@1234', 10);
  await User.create({ name: 'Delivery Partner', email: 'delivery@shopeasy.com', password: dHash, isDeliveryPartner: true });
  console.log('Delivery partner created → delivery@shopeasy.com / Delivery@1234');

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`${products.length} products seeded:`);
  console.log("  Electronics(5), Men's Fashion(6), Kurtis(8), Sarees(8), Beauty(8), Accessories(13), Home & Kitchen(4), Books(5)");

  mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
