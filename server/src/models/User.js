import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  authProviders: [{
    provider: { type: String, enum: ['google', 'otp', 'password', 'firebase'], default: 'otp' },
    providerId: String
  }],
  passwordless: {
    type: Boolean,
    default: true
  },
  fcmToken: {
    type: String,
    trim: true
  },
  addresses: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: String,
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
