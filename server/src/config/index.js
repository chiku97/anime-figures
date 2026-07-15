import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in the root project directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret-for-hikari',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  msg91AuthKey: process.env.MSG91_AUTH_KEY,
  msg91SenderId: process.env.MSG91_SENDER_ID || 'HIKARI',
  msg91OtpTemplateId: process.env.MSG91_OTP_TEMPLATE_ID,
  msg91OtpMessage: process.env.MSG91_OTP_MESSAGE,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  twilioUseWhatsapp: process.env.TWILIO_USE_WHATSAPP === 'true',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@formorastudio.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'StudioFormoraAdmin2026!#Secure'
};


if (!config.mongodbUri) {
  throw new Error('FATAL: MONGODB_URI is not set in environment variables.');
}

export default config;
