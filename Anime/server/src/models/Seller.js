import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  kyc: {
    panNumber: String,
    gstNumber: String,
    verified: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  payoutInfo: {
    bankAccountNumber: String,
    ifscCode: String,
    accountHolderName: String
  }
}, {
  timestamps: true
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
