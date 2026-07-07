import mongoose from 'mongoose';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';

const mockProducts = [
  {
    title: "Camp Nou Stadium Outline LED Neon Sign",
    slug: "camp-nou-stadium-outline-led-neon-sign",
    category: "Football Collection",
    scale: "Sporty",
    material: "Acrylic & Silicone LED",
    heightMm: 300,
    price: 4999,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"],
    badges: ["Best Seller", "Football"],
    status: "active"
  },
  {
    title: "Leo Messi Silhouette 3D Acrylic Lamp",
    slug: "leo-messi-silhouette-3d-acrylic-lamp",
    category: "Football Collection",
    scale: "Sporty",
    material: "Laser-Etched Acrylic",
    heightMm: 220,
    price: 2499,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=80"],
    badges: ["Fan Choice", "Football"],
    status: "active"
  },
  {
    title: "Spider-Man Silhouette 3D LED Lamp",
    slug: "spider-man-silhouette-3d-led-lamp",
    category: "Superhero Collection",
    scale: "Collectible",
    material: "Laser-Etched Acrylic",
    heightMm: 240,
    price: 2799,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80"],
    badges: ["New Arrival", "Superhero"],
    status: "active"
  },
  {
    title: "Air Jordan Basketball Court 3D Lamp",
    slug: "air-jordan-basketball-court-3d-lamp",
    category: "Basketball Collection",
    scale: "Sporty",
    material: "Laser-Etched Acrylic",
    heightMm: 230,
    price: 2699,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80"],
    badges: ["Trending", "Basketball"],
    status: "active"
  },
  {
    title: "Aesthetic Cloud Sunset Glow Projection Lamp",
    slug: "aesthetic-cloud-sunset-glow-projection-lamp",
    category: "Ambient Lamps",
    scale: "Aesthetic Decor",
    material: "Aluminum & Smart LED",
    heightMm: 200,
    price: 1999,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1508243754930-f4dcf1ab6274?w=600&auto=format&fit=crop&q=80"],
    badges: ["Aesthetic", "Ambient"],
    status: "active"
  },
  {
    title: "Carbon Fiber Geometric Desktop Phone Stand",
    slug: "carbon-fiber-geometric-desktop-phone-stand",
    category: "Phone Accessories",
    scale: "Utility",
    material: "PLA Carbon Fiber",
    heightMm: 110,
    price: 899,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"],
    badges: ["Utility", "Phone"],
    status: "active"
  },
  {
    title: "Custom Initials 3D-Printed Keychain",
    slug: "custom-initials-3d-printed-keychain",
    category: "Keychains",
    scale: "Customized",
    material: "Biodegradable PLA",
    heightMm: 60,
    price: 399,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"],
    badges: ["Customized", "Keychain"],
    status: "active"
  },
  {
    title: "Chibi Anime Figure Dashboard Decor",
    slug: "chibi-anime-figure-dashboard-decor",
    category: "Car Dashboard Accessories",
    scale: "Collectible",
    material: "High Precision PLA",
    heightMm: 80,
    price: 1299,
    stock: 14,
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
    badges: ["Car Decor", "Collectibles"],
    status: "active"
  }
];

let isSeeded = false;

export const seedDatabase = async () => {
  if (isSeeded) return;
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      isSeeded = true;
      console.log('Database already has products. Skipping seed.');
      return;
    }

    console.log('Seeding database with Formora Studio products...');

    // Find or create admin user
    let user = await User.findOne({ email: 'admin@formorastudio.com' });
    if (!user) {
      user = await User.create({
        name: 'Formora Admin',
        email: 'admin@formorastudio.com',
        phone: '9999999999',
        role: 'admin',
        passwordless: true
      });
    }

    // Find or create seller profile
    let seller = await Seller.findOne({ userId: user._id });
    if (!seller) {
      seller = await Seller.create({
        userId: user._id,
        shopName: 'Formora Premium Lights Shop',
        kyc: { verified: true },
        status: 'approved'
      });
    }

    // Insert mock products with sellerId
    const productsToSeed = mockProducts.map(p => ({
      ...p,
      sellerId: seller._id
    }));

    await Product.insertMany(productsToSeed);
    console.log(`Database seeded successfully with ${productsToSeed.length} products!`);
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
