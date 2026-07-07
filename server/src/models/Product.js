import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  scale: {
    type: String, // e.g. "1/7", "1/8", "Nendoroid", "Pop Up Parade"
    required: true
  },
  material: {
    type: String, // e.g. "PVC", "ABS"
    default: 'PVC'
  },
  heightMm: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    type: String // image URL
  }],
  status: {
    type: String,
    enum: ['draft', 'active'],
    default: 'active'
  },
  badges: [{
    type: String // e.g. "Pre-order", "Exclusive", "Hot Seller"
  }],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
