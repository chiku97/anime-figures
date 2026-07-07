import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Shield, Sparkles, Truck, Box, Star } from 'lucide-react';
import { addToCart } from '../store/cartSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';
import { addToast } from '../store/toastSlice.js';
import apiClient from '../api/client.js';

const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(null);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load product details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/products/${idOrSlug}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error('Failed to get product details, loading fallback:', err);
        // Fallback checks matching the new category structure
        const mockProducts = [
          { id: "prod-1", title: "Camp Nou Stadium Outline LED Neon Sign", slug: "camp-nou-stadium-outline-led-neon-sign", category: "Football Collection", scale: "Sporty", material: "Acrylic & Silicone LED", heightMm: 300, price: 4999, stock: 5, images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"], badges: ["Best Seller", "Football"] },
          { id: "prod-2", title: "Leo Messi Silhouette 3D Acrylic Lamp", slug: "leo-messi-silhouette-3d-acrylic-lamp", category: "Football Collection", scale: "Sporty", material: "Laser-Etched Acrylic", heightMm: 220, price: 2499, stock: 15, images: ["https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=80"], badges: ["Fan Choice", "Football"] },
          { id: "prod-3", title: "Spider-Man Silhouette 3D LED Lamp", slug: "spider-man-silhouette-3d-led-lamp", category: "Superhero Collection", scale: "Collectible", material: "Laser-Etched Acrylic", heightMm: 240, price: 2799, stock: 10, images: ["https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80"], badges: ["New Arrival", "Superhero"] },
          { id: "prod-4", title: "Air Jordan Basketball Court 3D Lamp", slug: "air-jordan-basketball-court-3d-lamp", category: "Basketball Collection", scale: "Sporty", material: "Laser-Etched Acrylic", heightMm: 230, price: 2699, stock: 8, images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80"], badges: ["Trending", "Basketball"] },
          { id: "prod-5", title: "Aesthetic Cloud Sunset Glow Projection Lamp", slug: "aesthetic-cloud-sunset-glow-projection-lamp", category: "Ambient Lamps", scale: "Aesthetic Decor", material: "Aluminum & Smart LED", heightMm: 200, price: 1999, stock: 8, images: ["https://images.unsplash.com/photo-1508243754930-f4dcf1ab6274?w=600&auto=format&fit=crop&q=80"], badges: ["Aesthetic", "Ambient"] },
          { id: "prod-6", title: "Carbon Fiber Geometric Desktop Phone Stand", slug: "carbon-fiber-geometric-desktop-phone-stand", category: "Phone Accessories", scale: "Utility", material: "PLA Carbon Fiber", heightMm: 110, price: 899, stock: 20, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"], badges: ["Utility", "Phone"] },
          { id: "prod-7", title: "Custom Initials 3D-Printed Keychain", slug: "custom-initials-3d-printed-keychain", category: "Keychains", scale: "Customized", material: "Biodegradable PLA", heightMm: 60, price: 399, stock: 50, images: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"], badges: ["Customized", "Keychain"] },
          { id: "prod-8", title: "Chibi Anime Figure Dashboard Decor", slug: "chibi-anime-figure-dashboard-decor", category: "Car Dashboard Accessories", scale: "Collectible", material: "High Precision PLA", heightMm: 80, price: 1299, stock: 14, images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"], badges: ["Car Decor", "Collectibles"] }
        ];
        const found = mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
        if (found) {
          if (!found.reviews) found.reviews = [];
          if (!found.rating) found.rating = 0;
          if (!found.numReviews) found.numReviews = 0;
          setProduct(found);
        } else {
          setError('Figure details not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [idOrSlug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(setLoginDrawerOpen(true));
    } else if (product) {
      dispatch(addToCart({
        id: product.id || product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        scale: product.scale,
        qty: qty
      }));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      dispatch(addToast({ message: 'Please write a review comment.', type: 'info' }));
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await apiClient.post(`/api/products/${idOrSlug}/reviews`, {
        rating: reviewRating,
        body: reviewComment
      });

      if (res.data.success) {
        dispatch(addToast({ message: 'Thank you for your review! ⭐', type: 'success' }));
        setReviewComment('');
        
        if (res.data.review) {
          setProduct(prev => {
            const updatedReviews = [...(prev.reviews || []), res.data.review];
            const avg = Number((updatedReviews.reduce((acc, item) => item.rating + acc, 0) / updatedReviews.length).toFixed(1));
            return {
              ...prev,
              reviews: updatedReviews,
              rating: avg,
              numReviews: updatedReviews.length
            };
          });
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(addToast({ 
        message: err.response?.data?.message || 'Failed to submit review.', 
        type: 'error' 
      }));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-warm-white py-20 text-center font-outfit">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-xl font-bold text-primary">{error || 'Product not found'}</p>
          <Link to="/catalog" className="inline-block text-sm text-primary underline">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white py-10 px-6 md:px-12 font-outfit z-10 relative text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="card border border-primary/40 rounded-2xl overflow-hidden h-[350px] md:h-[500px] flex items-center justify-center p-4 bg-white">
              <img 
                src={product.images?.[0]} 
                alt={product.title} 
                className="object-contain max-h-full max-w-full rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-20 card border-2 border-primary rounded-lg overflow-hidden p-1 flex items-center justify-center cursor-pointer bg-white">
                <img src={product.images?.[0]} className="object-cover w-full h-full rounded" />
              </div>
            </div>
          </div>

          {/* Right: Specifications & CTA */}
          <div className="space-y-6">
            
            {/* Badges & Category */}
            <div className="flex flex-wrap gap-2 items-center">
              {product.badges?.map((badge, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 text-xs font-black uppercase bg-primary text-white tracking-widest rounded"
                >
                  {badge}
                </span>
              ))}
              <span className="text-xs font-semibold text-secondary uppercase border-l border-primary/50 pl-2">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight uppercase">
              {product.title}
            </h1>

            {/* Rating summary in overview */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex text-gold">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.round(product.rating || 0) ? 'fill-gold text-gold' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-extrabold text-primary">{product.rating}</span>
                <span className="text-secondary font-medium">({product.numReviews} Reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="py-4 border-y border-primary/40">
              <span className="text-xs text-secondary uppercase tracking-wider block mb-1">MSRP (Inclusive of all Customs & Taxes)</span>
              <p className="text-3xl font-black text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Specs Table */}
            <div className="space-y-3 card border border-primary/30 rounded-xl p-5 text-sm bg-white">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-sage mb-2">Product Specifications</h4>
              <div className="grid grid-cols-2 gap-y-2.5">
                <div className="text-secondary font-semibold">Size</div>
                <div className="text-primary font-bold">{product.scale}</div>

                <div className="text-secondary font-semibold">Material</div>
                <div className="text-primary font-bold">{product.material || 'Acrylic & LEDs'}</div>

                <div className="text-secondary font-semibold">Approx. Height</div>
                <div className="text-primary font-bold">{product.heightMm} mm ({Math.round(product.heightMm / 10)} cm)</div>

                <div className="text-secondary font-semibold">Quality</div>
                <div className="text-sage font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 100% Quality Components
                </div>
              </div>
            </div>

            {/* Add to Cart Actions */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-secondary uppercase">Quantity</span>
                  <div className="flex items-center border border-primary/60 rounded bg-warm-white/70">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-primary/30"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-primary">{qty}</span>
                    <button 
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-primary/30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-secondary italic">({product.stock} units available)</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto px-10 py-4 btn-primary flex items-center justify-center gap-2 group transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="p-4 bg-clay/10 border border-clay/30 text-clay font-bold text-sm rounded-lg">
                This item is currently sold out. Sign up for waitlist drops!
              </div>
            )}

            {/* Shipping & Delivery Guarantee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-primary/30 text-xs text-secondary">
              <div className="flex gap-2">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-primary">Free Domestic Shipping</p>
                  <p>Ships securely in premium bubblewrap and robust box packaging.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Box className="w-4 h-4 text-sage shrink-0" />
                <div>
                  <p className="font-bold text-primary">Quality Materials Seal</p>
                  <p>Guaranteed genuine premium neon components and acrylic art.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <div className="mt-20 border-t border-primary/20 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Rating Summary column */}
            <div className="space-y-4 text-left">
              <h2 className="text-2xl font-black text-primary uppercase tracking-wider">
                Ratings & Reviews
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black text-primary">
                  {product.rating > 0 ? product.rating : '0.0'}
                </span>
                <div>
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${star <= Math.round(product.rating || 0) ? 'fill-gold text-gold' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-secondary mt-1 uppercase font-bold tracking-wider">
                    Based on {product.numReviews || 0} verified reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Reviews List & Submit Form */}
            <div className="lg:col-span-2 space-y-8 text-left">
              <h3 className="text-lg font-extrabold text-primary uppercase tracking-wide">
                Community Feedback ({product.reviews?.length || 0})
              </h3>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev._id} className="card border border-primary/10 rounded-2xl p-6 bg-white space-y-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-extrabold text-primary uppercase tracking-wider">{rev.userName}</p>
                          <p className="text-[10px] text-secondary mt-0.5">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex text-gold">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-gold text-gold' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-secondary font-normal leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-secondary font-medium italic">
                  No reviews submitted yet. Be the first to share your thoughts!
                </p>
              )}

              {/* Review Submission Form / Login CTA */}
              <div className="border-t border-primary/10 pt-8 mt-8">
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h4 className="text-base font-extrabold text-primary uppercase tracking-wide">
                      Write a Product Review
                    </h4>
                    
                    {/* Star Picker */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-secondary uppercase">Select Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-6 h-6 ${star <= reviewRating ? 'fill-gold text-gold' : 'text-gray-300'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment text area */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary uppercase block">Your Review</label>
                      <textarea
                        rows={4}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about the design, lighting finish, or print accuracy..."
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-secondary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-3 btn-primary text-white font-extrabold rounded-lg text-xs uppercase tracking-wider hover:shadow-lg transition-all"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="card border border-primary/20 rounded-2xl p-6 bg-clay/5 text-center space-y-4">
                    <p className="text-sm font-semibold text-secondary">
                      Only verified, logged-in buyers can leave product reviews to ensure legit feedback.
                    </p>
                    <button
                      type="button"
                      onClick={() => dispatch(setLoginDrawerOpen(true))}
                      className="px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all"
                    >
                      Login to Write Review
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
