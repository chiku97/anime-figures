import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import User from './models/User.js';
import Product from './models/Product.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Seed data for products if requested or as a fallback
const mockProducts = [
  {
    id: "prod-1",
    title: "Makima 1/7 Scale Figure - Chainsaw Man",
    slug: "makima-1-7-scale-figure-chainsaw-man",
    category: "Scale Figures",
    scale: "1/7",
    material: "PVC/ABS",
    heightMm: 250,
    price: 14999,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
    badges: ["Hot Seller", "Exclusive"],
    status: "active"
  },
  {
    id: "prod-2",
    title: "Gojo Satoru Shibuya Incident Ver. - Jujutsu Kaisen",
    slug: "gojo-satoru-shibuya-incident-ver-jujutsu-kaisen",
    category: "Scale Figures",
    scale: "1/7",
    material: "PVC/ABS",
    heightMm: 280,
    price: 18999,
    stock: 3,
    images: ["https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"],
    badges: ["Pre-order"],
    status: "active"
  },
  {
    id: "prod-3",
    title: "Kamado Tanjirou Hinokami Kagura - Demon Slayer",
    slug: "kamado-tanjirou-hinokami-kagura-demon-slayer",
    category: "Action Figures",
    scale: "1/8",
    material: "PVC",
    heightMm: 210,
    price: 11500,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80"],
    badges: ["Free Shipping"],
    status: "active"
  },
  {
    id: "prod-4",
    title: "Nendoroid Power - Chainsaw Man",
    slug: "nendoroid-power-chainsaw-man",
    category: "Nendoroid",
    scale: "Non-Scale",
    material: "ABS",
    heightMm: 100,
    price: 4999,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"],
    badges: ["Popular"],
    status: "active"
  },
  {
    id: "prod-5",
    title: "Roronoa Zoro Wano Kuni - One Piece",
    slug: "roronoa-zoro-wano-kuni-one-piece",
    category: "Scale Figures",
    scale: "1/8",
    material: "PVC/ABS",
    heightMm: 230,
    price: 13999,
    stock: 0,
    images: ["https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80"],
    badges: ["Out of Stock"],
    status: "active"
  },
  {
    id: "prod-6",
    title: "Cyberpunk Lucy Pop Up Parade - Cyberpunk Edgerunners",
    slug: "cyberpunk-lucy-pop-up-parade-cyberpunk-edgerunners",
    category: "Pop Up Parade",
    scale: "Non-Scale",
    material: "PVC",
    heightMm: 175,
    price: 3899,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"],
    badges: ["New Release"],
    status: "active"
  }
];

// Mock routes
app.get('/api/products', (req, res) => {
  res.status(200).json({ success: true, products: mockProducts });
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const param = req.params.idOrSlug;
  const product = mockProducts.find(p => p.id === param || p.slug === param);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, product });
});

app.post('/api/auth/mock-login', (req, res) => {
  const { phoneOrEmail } = req.body;
  if (!phoneOrEmail) {
    return res.status(400).json({ success: false, message: 'Please provide Email or Phone number' });
  }
  
  // Return a mock user token
  res.status(200).json({
    success: true,
    message: 'Login successful (Mock)',
    token: 'mock-jwt-token-for-testing-hikari-store',
    user: {
      id: 'mock-user-id-12345',
      name: phoneOrEmail.split('@')[0] || 'Gojo Fan',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'guest@hikari.com',
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : '9876543210',
      role: 'buyer'
    }
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
