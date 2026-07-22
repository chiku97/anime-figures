import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Seller from './models/Seller.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import { requireAuth, requireAdmin } from './middleware/auth.js';
import config from './config/index.js';
import { connectDB } from './config/db.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory database fallback stores for database-offline mode
const offlineStore = {
  products: [
    {
      _id: "64f1d3c01c9d440000000001",
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
      _id: "64f1d3c01c9d440000000002",
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
      _id: "64f1d3c01c9d440000000003",
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
      _id: "64f1d3c01c9d440000000004",
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
      _id: "64f1d3c01c9d440000000005",
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
      _id: "64f1d3c01c9d440000000006",
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
      _id: "64f1d3c01c9d440000000007",
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
      _id: "64f1d3c01c9d440000000008",
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
  ],
  users: [
    {
      _id: "64f1d3c01c9d440000000099",
      name: "Formora Admin",
      email: "admin@formorastudio.com",
      phone: "9999999999",
      role: "admin",
      addresses: [],
      authProviders: []
    }
  ],
  orders: []
};

// Database connection lazy loader middleware for serverless compatibility
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Lazy DB connection failed:', err.message);
  }
  next();
});

// Database connection state warning middleware (does not block requests)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health' && mongoose.connection.readyState !== 1) {
    console.warn(`[OFFLINE MODE] Database is disconnected. Serving endpoint "${req.method} ${req.path}" via local mock memory stores.`);
  }
  next();
});

// API Health Check
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Database routes
app.get('/api/products', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, products: offlineStore.products });
    }
    const dbProducts = await Product.find({ status: 'active' });
    res.status(200).json({ success: true, products: dbProducts || [] });
  } catch (error) {
    console.error('MongoDB query failed:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:idOrSlug', async (req, res, next) => {
  const param = req.params.idOrSlug;
  try {
    if (mongoose.connection.readyState !== 1) {
      const product = offlineStore.products.find(p => p._id === param || p.slug === param);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      // Return with empty/mock reviews
      const productObj = { ...product, reviews: [], rating: 5, numReviews: 0 };
      return res.status(200).json({ success: true, product: productObj });
    }

    let product;
    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param);
    } else {
      product = await Product.findOne({ slug: param });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch reviews for this product
    const dbReviews = await Review.find({ productId: product._id }).populate('userId', 'name email');

    // Transform reviews for UI consumption
    const reviews = dbReviews.map(r => ({
      _id: r._id,
      userId: r.userId?._id || r.userId,
      userName: r.userId?.name || (r.userId?.email ? r.userId.email.split('@')[0] : 'Buyer'),
      rating: r.rating,
      comment: r.body,
      createdAt: r.createdAt
    }));

    const numReviews = reviews.length;
    const rating = numReviews > 0 ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1)) : 0;

    // Merge attributes into product object
    const productObj = product.toObject();
    productObj.reviews = reviews;
    productObj.rating = rating;
    productObj.numReviews = numReviews;

    return res.status(200).json({ success: true, product: productObj });
  } catch (error) {
    console.error('MongoDB query failed:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve product details' });
  }
});

const otpStore = new Map();

// Twilio SMS authentication flow (Live/Resilient)
app.post('/api/auth/send-otp', async (req, res) => {
  const { phoneOrEmail } = req.body;
  if (!phoneOrEmail) {
    return res.status(400).json({ success: false, message: 'Please provide Email or Phone number' });
  }

  try {
    // Generate a random 6-digit verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with 5-minute expiration
    otpStore.set(phoneOrEmail, {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    const isPhone = /^\+?[0-9]{10,14}$/.test(phoneOrEmail.replace(/[\s-]/g, ''));
    const twilioActive = config.twilioAccountSid && config.twilioAuthToken && config.twilioPhoneNumber && config.twilioAccountSid !== '';

    if (isPhone && twilioActive) {
      const mobile = phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91${phoneOrEmail}`;
      const useWhatsapp = config.twilioUseWhatsapp;
      console.log(`[SMS AUTH] Dispatching OTP via Twilio ${useWhatsapp ? 'WhatsApp' : 'SMS'} to ${mobile}...`);

      try {
        const basicAuth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
        const toVal = useWhatsapp ? `whatsapp:${mobile}` : mobile;
        const fromVal = useWhatsapp ? `whatsapp:+14155238886` : config.twilioPhoneNumber;

        const bodyParams = new URLSearchParams({
          To: toVal,
          From: fromVal,
          Body: `Your HIKARI verification code is: ${generatedOtp}`
        });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams.toString()
        });

        const twilioData = await twilioRes.json();
        console.log('[TWILIO API RESPONSE]', twilioData);

        if (!twilioRes.ok) {
          console.error('[SMS AUTH] Twilio dispatch failed downstream:', twilioData.message);
          // Fall back gracefully to sandbox console printing so developer/user is never blocked
          console.log(`\n=============================================`);
          console.log(`[FALLBACK AUTH OTP CODE] Verification code for ${phoneOrEmail}: ${generatedOtp}`);
          console.log(`=============================================\n`);
          return res.status(200).json({
            success: true,
            message: `SMS gateway offline (${twilioData.message || 'Twilio error'}). Sandbox Mode: check server console logs for verification code.`
          });
        }

        console.log(`[SMS AUTH] Twilio SMS OTP sent successfully to ${phoneOrEmail}`);
      } catch (twilioErr) {
        console.error('[SMS AUTH] Twilio Send API failed:', twilioErr.message);
        // Fall back gracefully to sandbox console printing
        console.log(`\n=============================================`);
        console.log(`[FALLBACK AUTH OTP CODE] Verification code for ${phoneOrEmail}: ${generatedOtp}`);
        console.log(`=============================================\n`);
        return res.status(200).json({
          success: true,
          message: `SMS gateway error (${twilioErr.message}). Sandbox Mode: check server console logs for verification code.`
        });
      }
    } else {
      // Print in console for developer/buyer sandbox testing
      console.log(`\n=============================================`);
      console.log(`[AUTH OTP CODE] Verification code for ${phoneOrEmail}: ${generatedOtp}`);
      console.log(`=============================================\n`);
    }

    res.status(200).json({
      success: true,
      message: isPhone && twilioActive ? 'OTP sent successfully to your phone.' : 'Verification code generated. Check server logs if sandbox.'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phoneOrEmail, otp } = req.body;
  if (!phoneOrEmail || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide credentials and OTP code.' });
  }

  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    let verified = false;

    if (isDbOffline) {
      verified = true; // Auto verify OTP in offline mode
    } else {
      const storedData = otpStore.get(phoneOrEmail);
      if (storedData && storedData.otp === otp && storedData.expiresAt > Date.now()) {
        verified = true;
        otpStore.delete(phoneOrEmail); // Consume
      }
    }

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    // Provision User Session
    let user;
    const isEmailAdmin = phoneOrEmail.toLowerCase() === config.adminEmail.toLowerCase();

    if (isDbOffline) {
      user = offlineStore.users.find(u => u.email === phoneOrEmail.toLowerCase() || u.phone === phoneOrEmail);
      if (!user) {
        user = {
          _id: `offline-user-${Date.now()}`,
          name: phoneOrEmail.split('@')[0] || 'Visitor',
          email: phoneOrEmail.includes('@') ? phoneOrEmail.toLowerCase() : `user_${Date.now()}@formorastudio.com`,
          phone: !phoneOrEmail.includes('@') ? phoneOrEmail : '',
          role: isEmailAdmin ? 'admin' : 'buyer',
          addresses: []
        };
        offlineStore.users.push(user);
      }
    } else {
      user = await User.findOne({ $or: [{ email: phoneOrEmail.toLowerCase() }, { phone: phoneOrEmail }] });
      if (!user) {
        user = await User.create({
          name: phoneOrEmail.split('@')[0] || 'Visitor',
          email: phoneOrEmail.includes('@') ? phoneOrEmail.toLowerCase() : `user_${Date.now()}@formorastudio.com`,
          phone: !phoneOrEmail.includes('@') ? phoneOrEmail : '',
          role: isEmailAdmin ? 'admin' : 'buyer',
          passwordless: true
        });
      }
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_me',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

let firebasePublicKeys = null;
let keysExpiry = 0;

const fetchFirebasePublicKeys = async () => {
  if (firebasePublicKeys && Date.now() < keysExpiry) {
    return firebasePublicKeys;
  }
  try {
    const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const data = await res.json();
    const cacheControl = res.headers.get('cache-control');
    if (cacheControl) {
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (maxAgeMatch) {
        keysExpiry = Date.now() + parseInt(maxAgeMatch[1], 10) * 1000;
      }
    }
    firebasePublicKeys = data;
    return firebasePublicKeys;
  } catch (err) {
    console.error('Failed to fetch Firebase public keys:', err);
    throw new Error('Could not download public certificates to verify token signature.');
  }
};

const verifyFirebaseIdToken = async (idToken) => {
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded || !decoded.header) {
    throw new Error('Invalid token format.');
  }

  const isDev = process.env.NODE_ENV !== 'production';

  // If missing kid (e.g. emulator token or alg: none)
  if (!decoded.header.kid) {
    if (isDev) {
      console.warn('[DEV] Accepting Firebase token without key ID (emulator/mock token).');
      return decoded.payload;
    }
    throw new Error('Missing key identifier in token header.');
  }

  try {
    const keys = await fetchFirebasePublicKeys();
    const key = keys[decoded.header.kid];
    if (!key) {
      if (isDev) {
        console.warn(`[DEV] Certificate not found for kid "${decoded.header.kid}". Falling back to decoded payload.`);
        return decoded.payload;
      }
      throw new Error(`Matching public key certificate not found for kid: ${decoded.header.kid}. Available keys: ${Object.keys(keys || {}).join(', ')}`);
    }

    const verifiedPayload = jwt.verify(idToken, key, {
      algorithms: ['RS256']
    });

    if (verifiedPayload.iss !== `https://securetoken.google.com/${verifiedPayload.aud}`) {
      throw new Error('Token issuer validation failed.');
    }

    return verifiedPayload;
  } catch (err) {
    if (isDev) {
      console.warn(`[DEV] Firebase signature verification failed (${err.message}). Falling back to decoded payload.`);
      return decoded.payload;
    }
    throw err;
  }
};

// Firebase login endpoint (verifies token claims and provisions Mongo Atlas session)
app.post('/api/auth/firebase-login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: 'ID Token is required' });
  }

  try {
    // Perform robust cryptographic signature and claims verification
    const payload = await verifyFirebaseIdToken(idToken);

    const email = payload.email || '';
    const phone = payload.phone_number || '';
    const uid = payload.sub; // Firebase UID
    const name = payload.name || phone || (email ? email.split('@')[0] : '') || 'Firebase User';

    if (!uid) {
      return res.status(400).json({ success: false, message: 'Sub claim missing in verified token' });
    }

    const isDbOffline = mongoose.connection.readyState !== 1;
    let user;
    const isEmailAdmin = email && email.toLowerCase() === config.adminEmail.toLowerCase();

    if (isDbOffline) {
      user = offlineStore.users.find(u => u.email === email.toLowerCase() || u.phone === phone);
      if (!user) {
        user = {
          _id: `offline-firebase-${uid || Date.now()}`,
          name,
          email: email ? email.toLowerCase() : `user_${Date.now()}@formorastudio.com`,
          phone: phone || '',
          role: isEmailAdmin ? 'admin' : 'buyer',
          addresses: []
        };
        offlineStore.users.push(user);
      }
    } else {
      // Find user by phone, email, or Firebase ID provider
      user = await User.findOne({
        $or: [
          email ? { email: email.toLowerCase() } : undefined,
          phone ? { phone: phone } : undefined,
          { 'authProviders.providerId': uid }
        ].filter(Boolean)
      });

      if (!user) {
        user = await User.create({
          name,
          email: email ? email.toLowerCase() : `user_${Date.now()}@formorastudio.com`,
          phone: phone || '',
          role: isEmailAdmin ? 'admin' : 'buyer',
          passwordless: true,
          authProviders: [{ provider: 'firebase', providerId: uid }]
        });
      } else {
        // Sync attributes if not set
        let updated = false;
        if (phone && !user.phone) {
          user.phone = phone;
          updated = true;
        }
        if (!user.authProviders.some(p => p.provider === 'firebase')) {
          user.authProviders.push({ provider: 'firebase', providerId: uid });
          updated = true;
        }
        if (updated) {
          await user.save();
        }
      }
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_me',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Firebase login error:', err.message);
    res.status(400).json({ success: false, message: 'Firebase authentication failed: ' + err.message });
  }
});

// Profile update endpoint (allows editing name/email)
app.put('/api/users/profile', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email.toLowerCase() !== (user.email || '').toLowerCase()) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
      user.email = email.toLowerCase();
    }

    user.name = name;
    await user.save();

    // Sign a new token since details have changed
    const appToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_me',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register/Update FCM Token for user
// Send SMS/WhatsApp tracking details notification to customer via Twilio, with fallback logs
async function sendTwilioSMSNotification(order) {
  const name = order.shippingAddress?.name || order.userId?.name || 'Customer';
  const phone = order.shippingAddress?.phone || order.userId?.phone;
  const email = order.userId?.email || 'customer@formorastudio.com';
  const tracking = order.tracking || { carrier: 'Shipping Partner', trackingNumber: 'N/A' };
  const carrier = tracking.carrier || 'Shipping Partner';
  const trackingNum = tracking.trackingNumber || 'N/A';
  const orderId = (order._id || order.id).toString();
  const shortOrderId = orderId.substring(0, 10);

  const messageText = `Hello ${name}, your Formora Studio order #${shortOrderId}... has been SHIPPED via ${carrier}! Track your shipment using tracking number: ${trackingNum}.`;

  console.log(`\n========================================================================`);
  console.log(`[TWILIO SMS NOTIFICATION SIMULATION]`);
  console.log(`To Recipient: ${phone || email}`);
  console.log(`Message Body: "${messageText}"`);
  console.log(`========================================================================\n`);

  const twilioActive = config.twilioAccountSid && config.twilioAuthToken && config.twilioPhoneNumber;
  if (phone && twilioActive) {
    try {
      const mobile = phone.startsWith('+') ? phone : `+91${phone}`;
      const useWhatsapp = config.twilioUseWhatsapp;
      const basicAuth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
      const toVal = useWhatsapp ? `whatsapp:${mobile}` : mobile;
      const fromVal = useWhatsapp ? `whatsapp:+14155238886` : config.twilioPhoneNumber;

      const bodyParams = new URLSearchParams({
        To: toVal,
        From: fromVal,
        Body: messageText
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[TWILIO NOTIFY] Twilio SMS dispatch failed downstream:', data.message);
      } else {
        console.log(`[TWILIO NOTIFY] Twilio SMS notification sent successfully to ${phone}`);
      }
    } catch (err) {
      console.error('[TWILIO NOTIFY] Twilio send API failed:', err.message);
    }
  } else {
    console.log(`[TWILIO NOTIFY] Skipping real API dispatch (Twilio config inactive or missing recipient phone).`);
  }
}


// GET saved addresses list
app.get('/api/users/addresses', requireAuth, async (req, res) => {
  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      const user = offlineStore.users.find(u => u._id.toString() === req.user.id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, addresses: user.addresses || [] });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add a new saved address
app.post('/api/users/addresses', requireAuth, async (req, res) => {
  const { name, phone, address1, address2, pincode, city, state } = req.body;
  if (!name || !phone || !address1 || !pincode || !city || !state) {
    return res.status(400).json({ success: false, message: 'Missing required address fields' });
  }

  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      const user = offlineStore.users.find(u => u._id.toString() === req.user.id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const newAddress = {
        _id: `addr-${Date.now()}`,
        name,
        phone,
        address1,
        address2,
        pincode,
        city,
        state
      };
      user.addresses = user.addresses || [];
      user.addresses.push(newAddress);
      return res.status(200).json({ success: true, message: 'Address added successfully', addresses: user.addresses });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses.push({ name, phone, address1, address2, pincode, city, state });
    await user.save();

    return res.status(200).json({ success: true, message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE a saved address
app.delete('/api/users/addresses/:addressId', requireAuth, async (req, res) => {
  const { addressId } = req.params;
  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      const user = offlineStore.users.find(u => u._id.toString() === req.user.id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.addresses = (user.addresses || []).filter(addr => addr._id.toString() !== addressId.toString());
      return res.status(200).json({ success: true, message: 'Address deleted successfully', addresses: user.addresses });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    return res.status(200).json({ success: true, message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Google login endpoint
app.post('/api/auth/google-login', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ success: false, message: 'ID token required' });
  }

  try {
    let email, name, sub;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('Google client ID is not configured on the server.');
    }

    // Verify token cryptographically using google-auth-library OAuth2Client
    try {
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Failed to parse credential ticket payload.');
      }
      email = payload.email;
      name = payload.name || (email ? email.split('@')[0] : 'Google User');
      sub = payload.sub;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[DEV] Google signature verification failed (${err.message}). Falling back to manual decode.`);
        const decoded = jwt.decode(credential);
        if (decoded) {
          email = decoded.email;
          name = decoded.name || (email ? email.split('@')[0] : 'Google User');
          sub = decoded.sub;
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }

    if (!email) {
      throw new Error('Email address claim missing in credentials.');
    }

    const isDbOffline = mongoose.connection.readyState !== 1;
    let user;
    const isEmailAdmin = email && email.toLowerCase() === config.adminEmail.toLowerCase();

    if (isDbOffline) {
      user = offlineStore.users.find(u => u.email === email.toLowerCase());
      if (!user) {
        user = {
          _id: `offline-google-${sub || Date.now()}`,
          name,
          email: email.toLowerCase(),
          role: isEmailAdmin ? 'admin' : 'buyer',
          addresses: []
        };
        offlineStore.users.push(user);
      }
    } else {
      // Find or create user in MongoDB
      user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          role: isEmailAdmin ? 'admin' : 'buyer',
          passwordless: true,
          authProviders: [{ provider: 'google', providerId: sub }]
        });
      }
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_me',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(400).json({ success: false, message: 'Google authentication failed: ' + err.message });
  }
});

// Add new product (Admin only)
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { title, category, scale, material, heightMm, price, stock, images, badges } = req.body;

    if (!title || !category || !scale || !price) {
      return res.status(400).json({ success: false, message: 'Missing required product fields.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const productData = {
      title,
      slug,
      category,
      scale,
      material,
      heightMm: heightMm ? Number(heightMm) : undefined,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 10,
      images: images || [],
      badges: badges || [],
      status: 'active'
    };

    if (mongoose.connection.readyState !== 1) {
      const offlineProduct = {
        _id: `offline-product-${Date.now()}`,
        ...productData
      };
      offlineStore.products.push(offlineProduct);
      return res.status(201).json({ success: true, product: offlineProduct });
    }

    // Find default seller
    let seller = await Seller.findOne();
    if (!seller) {
      const defaultAdmin = await User.findOne({ role: 'admin' });
      seller = await Seller.create({
        userId: defaultAdmin ? defaultAdmin._id : req.user.id,
        shopName: 'Formora Premium Lights Shop',
        status: 'approved'
      });
    }
    const newProduct = await Product.create({
      ...productData,
      sellerId: seller._id
    });
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product (Admin only)
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, category, scale, material, heightMm, price, stock, images, badges } = req.body;

    const updates = {
      title,
      category,
      scale,
      material,
      heightMm: heightMm ? Number(heightMm) : undefined,
      price: price ? Number(price) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      images,
      badges
    };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (mongoose.connection.readyState !== 1) {
      const index = offlineStore.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const existingProduct = offlineStore.products[index];
      const updatedProduct = {
        ...existingProduct,
        ...updates
      };
      offlineStore.products[index] = updatedProduct;
      return res.status(200).json({ success: true, product: updatedProduct });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete product (Admin only)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const index = offlineStore.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      offlineStore.products.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products/:idOrSlug/reviews', requireAuth, async (req, res) => {
  const { idOrSlug } = req.params;
  const { rating, body } = req.body;

  if (!rating || !body) {
    return res.status(400).json({ success: false, message: 'Rating and review content are required.' });
  }

  const parsedRating = Number(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      const product = offlineStore.products.find(p => p._id === idOrSlug || p.slug === idOrSlug);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      const userName = req.user.email ? req.user.email.split('@')[0] : 'Buyer';
      const offlineReview = {
        _id: `offline-review-${Date.now()}`,
        productId: product._id,
        userId: req.user.id,
        rating: parsedRating,
        body: body,
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({
        success: true,
        message: 'Review created successfully (offline)',
        review: {
          _id: offlineReview._id,
          userId: req.user.id,
          userName: userName,
          rating: parsedRating,
          comment: body,
          createdAt: offlineReview.createdAt
        }
      });
    }

    let product;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await User.findById(req.user.id);
    const userName = user ? user.name : (req.user.email ? req.user.email.split('@')[0] : 'Buyer');

    const alreadyReviewed = await Review.findOne({ productId: product._id, userId: req.user.id });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      productId: product._id,
      userId: req.user.id,
      rating: parsedRating,
      body: body
    });

    const allReviews = await Review.find({ productId: product._id });
    const numReviews = allReviews.length;
    const avgRating = Number((allReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews).toFixed(1));

    product.rating = avgRating;
    product.numReviews = numReviews;
    await product.save();

    const formattedReview = {
      _id: review._id,
      userId: req.user.id,
      userName: userName,
      rating: parsedRating,
      comment: body,
      createdAt: review.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review: formattedReview,
      rating: avgRating,
      numReviews: numReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Razorpay Order (Full or Partial 10%)
app.post('/api/payments/order', requireAuth, async (req, res) => {
  const { amount, paymentMethod = 'online' } = req.body;
  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  // Calculate charge amount: 10% for partial payment, 100% for full online payment
  const payableAmount = paymentMethod === 'partial' ? Math.round(amount * 0.10) : Math.round(amount);

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

  const isMockKeys = !razorpayKeyId || razorpayKeyId === 'rzp_test_your_key_id' || !razorpaySecret;

  if (isMockKeys) {
    // Return mock order details for local developer testing
    const mockOrderId = 'order_mock_' + Math.floor(100000 + Math.random() * 900000);
    return res.status(200).json({
      success: true,
      isMock: true,
      id: mockOrderId,
      amount: payableAmount * 100, // Razorpay works in paise
      fullAmount: amount,
      payableAmount: payableAmount,
      paymentMethod: paymentMethod,
      currency: 'INR'
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret
    });

    const options = {
      amount: Math.round(payableAmount * 100), // in paise
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
      notes: {
        paymentMethod,
        fullAmount: amount.toString(),
        payableAmount: payableAmount.toString()
      }
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      isMock: false,
      id: order.id,
      amount: order.amount,
      fullAmount: amount,
      payableAmount: payableAmount,
      paymentMethod: paymentMethod,
      currency: order.currency
    });
  } catch (err) {
    console.error('Razorpay Order API failed, falling back to mock order:', err.message);
    const mockOrderId = 'order_mock_' + Math.floor(100000 + Math.random() * 900000);
    res.status(200).json({
      success: true,
      isMock: true,
      id: mockOrderId,
      amount: payableAmount * 100,
      fullAmount: amount,
      payableAmount: payableAmount,
      paymentMethod: paymentMethod,
      currency: 'INR'
    });
  }
});

// Verify payment & Save Order (Supports Online 100% and Partial 10% payments)
app.post('/api/payments/verify', requireAuth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address, cartItems, total, paymentMethod = 'online' } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !cartItems || !total) {
    return res.status(400).json({ success: false, message: 'Missing required verification details.' });
  }

  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    const isMock = razorpay_order_id.startsWith('order_mock_') || !razorpay_signature;

    if (!isDbOffline && !isMock) {
      // Real signature verification
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
      }
    }

    // Determine paid and due amounts based on payment method
    let paidAmount = total;
    let dueAmount = 0;
    let paymentStatus = 'paid';

    if (paymentMethod === 'partial') {
      paidAmount = Math.round(total * 0.10);
      dueAmount = total - paidAmount;
      paymentStatus = 'partially_paid';
    } else if (paymentMethod === 'cod') {
      paidAmount = 0;
      dueAmount = total;
      paymentStatus = 'pending';
    }

    const orderData = {
      items: cartItems.map(item => ({
        productId: mongoose.Types.ObjectId.isValid(item.id) ? item.id : new mongoose.Types.ObjectId(),
        qty: item.qty,
        price: item.price,
        title: item.title
      })),
      amount: total,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      razorpayOrderId: razorpay_order_id,
      status: 'processing',
      shippingAddress: {
        name: address.name,
        street: `${address.address1} ${address.address2 || ''}`.trim(),
        city: address.city,
        state: address.state,
        zipCode: address.pincode,
        phone: address.phone,
        lat: address.lat || null,
        lng: address.lng || null
      }
    };

    if (isDbOffline) {
      const newOrder = {
        _id: `offline-order-${Date.now()}`,
        userId: req.user.id,
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      offlineStore.orders.push(newOrder);

      // Save address to offline user
      const user = offlineStore.users.find(u => u._id.toString() === req.user.id.toString());
      if (user && address) {
        const addressExists = user.addresses.some(addr =>
          addr.address1.toLowerCase() === address.address1.toLowerCase() &&
          addr.pincode === address.pincode
        );
        if (!addressExists) {
          user.addresses.push({
            _id: `addr-${Date.now()}`,
            name: address.name,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2 || '',
            pincode: address.pincode,
            city: address.city,
            state: address.state,
            lat: address.lat || null,
            lng: address.lng || null
          });
        }
      }

      // Update offline stock
      for (const item of cartItems) {
        const product = offlineStore.products.find(p => p._id === item.id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
        }
      }

      return res.status(200).json({ success: true, order: newOrder });
    }

    const newOrder = await Order.create({
      ...orderData,
      userId: req.user.id
    });

    // Save address to user profile if it doesn't already exist
    try {
      const user = await User.findById(req.user.id);
      if (user && address) {
        const addressExists = user.addresses.some(addr =>
          addr.address1.toLowerCase() === address.address1.toLowerCase() &&
          (addr.address2 || '').toLowerCase() === (address.address2 || '').toLowerCase() &&
          addr.pincode === address.pincode &&
          addr.city.toLowerCase() === address.city.toLowerCase() &&
          addr.state.toLowerCase() === address.state.toLowerCase()
        );
        if (!addressExists) {
          user.addresses.push({
            name: address.name,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2 || '',
            pincode: address.pincode,
            city: address.city,
            state: address.state,
            lat: address.lat || null,
            lng: address.lng || null
          });
          await user.save();
        }
      }
    } catch (saveAddrErr) {
      console.warn('Failed to save checkout address to user profile book:', saveAddrErr.message);
    }

    // Update stock in database
    for (const item of cartItems) {
      if (mongoose.Types.ObjectId.isValid(item.id)) {
        await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.qty } });
      }
    }

    res.status(200).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Payment verification failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch user orders
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      const orders = offlineStore.orders.filter(o => o.userId.toString() === req.user.id.toString());
      return res.status(200).json({ success: true, orders });
    }

    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get all orders
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      // Map order user info in memory
      const populatedOrders = offlineStore.orders.map(order => {
        const userObj = offlineStore.users.find(u => u._id.toString() === order.userId.toString()) || {
          name: 'Offline Customer',
          email: 'customer@formorastudio.com',
          phone: '9876543210'
        };
        return {
          ...order,
          userId: userObj
        };
      });
      return res.status(200).json({ success: true, orders: populatedOrders.reverse() });
    }

    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update order status / tracking details
app.put('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, tracking } = req.body;

  try {
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid order status value.' });
      }
    }

    const isDbOffline = mongoose.connection.readyState !== 1;
    if (isDbOffline) {
      const order = offlineStore.orders.find(o => o._id.toString() === id.toString());
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      const oldStatus = order.status;
      const proposedStatus = status !== undefined ? status : order.status;
      const proposedTracking = tracking !== undefined ? tracking : order.tracking;

      if (proposedStatus === 'shipped') {
        if (!proposedTracking || !proposedTracking.carrier || !proposedTracking.trackingNumber || !proposedTracking.carrier.trim() || !proposedTracking.trackingNumber.trim()) {
          return res.status(400).json({ success: false, message: 'Tracking details (Carrier and Tracking Number) are required to mark the order as Shipped.' });
        }
      }

      if (status !== undefined) order.status = status;
      if (tracking !== undefined) order.tracking = tracking;
      order.updatedAt = new Date();

      const userObj = offlineStore.users.find(u => u._id.toString() === order.userId.toString()) || {
        name: 'Offline Customer',
        email: 'customer@formorastudio.com',
        phone: '9876543210'
      };

      const populatedOrder = {
        ...order,
        userId: userObj
      };

      if ((oldStatus !== 'shipped' && populatedOrder.status === 'shipped') || (populatedOrder.status === 'shipped' && tracking !== undefined)) {
        sendTwilioSMSNotification(populatedOrder);
      }

      return res.status(200).json({ success: true, order: populatedOrder });
    }

    const order = await Order.findById(id).populate('userId', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const oldStatus = order.status;
    const proposedStatus = status !== undefined ? status : order.status;
    const proposedTracking = tracking !== undefined ? tracking : order.tracking;

    if (proposedStatus === 'shipped') {
      if (!proposedTracking || !proposedTracking.carrier || !proposedTracking.trackingNumber || !proposedTracking.carrier.trim() || !proposedTracking.trackingNumber.trim()) {
        return res.status(400).json({ success: false, message: 'Tracking details (Carrier and Tracking Number) are required to mark the order as Shipped.' });
      }
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (tracking !== undefined) updates.tracking = tracking;

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true })
      .populate('userId', 'name email phone');

    if ((oldStatus !== 'shipped' && updatedOrder.status === 'shipped') || (updatedOrder.status === 'shipped' && tracking !== undefined)) {
      sendTwilioSMSNotification(updatedOrder);
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Admin Credentials & Password Login
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email.toLowerCase() !== config.adminEmail.toLowerCase()) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  if (password !== config.adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  try {
    const isDbOffline = mongoose.connection.readyState !== 1;
    let user;
    if (isDbOffline) {
      user = offlineStore.users.find(u => u.email === config.adminEmail.toLowerCase());
      if (!user) {
        user = {
          _id: 'offline-admin',
          name: 'Formora Admin',
          email: config.adminEmail.toLowerCase(),
          phone: '9999999999',
          role: 'admin',
          addresses: []
        };
        offlineStore.users.push(user);
      }
    } else {
      user = await User.findOne({ email: config.adminEmail.toLowerCase() });
      if (!user) {
        user = await User.create({
          name: 'Formora Admin',
          email: config.adminEmail.toLowerCase(),
          phone: '9999999999',
          role: 'admin',
          passwordless: false
        });
      }
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_sign_key_change_me',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Image Upload to Cloudinary (direct API signature flow)
app.post('/api/admin/upload-image', requireAdmin, async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ success: false, message: 'Image data is required' });
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'anime_figures';
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${config.cloudinaryApiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', image);
    formData.append('api_key', config.cloudinaryApiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[CLOUDINARY ERROR]', data);
      return res.status(400).json({ success: false, message: data.error?.message || 'Cloudinary upload failed' });
    }

    res.status(200).json({
      success: true,
      url: data.secure_url,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock Shipping Partner API status checker
async function fetchShippingPartnerTracking(carrier, trackingNumber, shippedAt) {
  // Simulates calling the shipping partner's API (e.g. BlueDart, FedEx)
  // For testing:
  // 1. Returns "delivered" if the tracking number contains "deliv" (case-insensitive)
  // 2. Returns "delivered" if more than 30 seconds have passed since it was marked as shipped (shippedAt)
  // Otherwise, returns "in_transit"
  const trackingNumberLower = (trackingNumber || '').toLowerCase();
  if (trackingNumberLower.includes('deliv')) {
    return 'delivered';
  }

  if (shippedAt) {
    const elapsedMs = Date.now() - new Date(shippedAt).getTime();
    if (elapsedMs > 30 * 1000) {
      return 'delivered';
    }
  }

  return 'in_transit';
}

// Background shipping partner tracking check:
// Decoupled status checker that queries shipping partner API for "shipped" orders
setInterval(async () => {
  try {
    const isDbOffline = mongoose.connection.readyState !== 1;

    if (isDbOffline) {
      if (offlineStore && offlineStore.orders) {
        const shippedOrders = offlineStore.orders.filter(o => o.status === 'shipped');
        for (const order of shippedOrders) {
          const partnerStatus = await fetchShippingPartnerTracking(
            order.tracking?.carrier,
            order.tracking?.trackingNumber,
            order.updatedAt || order.createdAt
          );

          console.log(`[SHIPPING CHECK] Checked order ${order._id || order.id} via ${order.tracking?.carrier}. Partner returned: ${partnerStatus}`);

          if (partnerStatus === 'delivered') {
            order.status = 'delivered';
            order.updatedAt = new Date();
            console.log(`\n========================================================================`);
            console.log(`[SHIPPING UPDATE] Order ${order._id || order.id} updated to DELIVERED based on shipping partner tracking.`);
            console.log(`========================================================================\n`);
          }
        }
      }
    } else {
      const shippedOrders = await Order.find({ status: 'shipped' });

      for (const order of shippedOrders) {
        const partnerStatus = await fetchShippingPartnerTracking(
          order.tracking?.carrier,
          order.tracking?.trackingNumber,
          order.updatedAt || order.createdAt
        );

        console.log(`[SHIPPING CHECK] Checked order ${order._id} via ${order.tracking?.carrier}. Partner returned: ${partnerStatus}`);

        if (partnerStatus === 'delivered') {
          order.status = 'delivered';
          await order.save();
          console.log(`\n========================================================================`);
          console.log(`[SHIPPING UPDATE] Order ${order._id} updated to DELIVERED based on shipping partner tracking.`);
          console.log(`========================================================================\n`);
        }
      }
    }
  } catch (err) {
    console.error('Error in background shipping partner tracker:', err.message);
  }
}, 10000); // Check every 10 seconds

export default app;

