import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Shield, Sparkles, Truck, Box } from 'lucide-react';
import { addToCart } from '../store/cartSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';
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
        // Fallback checks
        const mockProducts = [
          { id: "prod-1", title: "Makima 1/7 Scale Figure - Chainsaw Man", slug: "makima-1-7-scale-figure-chainsaw-man", category: "Scale Figures", scale: "1/7", material: "PVC/ABS", heightMm: 250, price: 14999, stock: 5, images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"], badges: ["Hot Seller", "Exclusive"] },
          { id: "prod-2", title: "Gojo Satoru Shibuya Incident Ver. - Jujutsu Kaisen", slug: "gojo-satoru-shibuya-incident-ver-jujutsu-kaisen", category: "Scale Figures", scale: "1/7", material: "PVC/ABS", heightMm: 280, price: 18999, stock: 3, images: ["https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"], badges: ["Pre-order"] },
          { id: "prod-3", title: "Kamado Tanjirou Hinokami Kagura - Demon Slayer", slug: "kamado-tanjirou-hinokami-kagura-demon-slayer", category: "Action Figures", scale: "1/8", material: "PVC", heightMm: 210, price: 11500, stock: 12, images: ["https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80"], badges: ["Free Shipping"] },
          { id: "prod-4", title: "Nendoroid Power - Chainsaw Man", slug: "nendoroid-power-chainsaw-man", category: "Nendoroid", scale: "Non-Scale", material: "ABS", heightMm: 100, price: 4999, stock: 20, images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"], badges: ["Popular"] },
          { id: "prod-5", title: "Roronoa Zoro Wano Kuni - One Piece", slug: "roronoa-zoro-wano-kuni-one-piece", category: "Scale Figures", scale: "1/8", material: "PVC/ABS", heightMm: 230, price: 13999, stock: 0, images: ["https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80"], badges: ["Out of Stock"] },
          { id: "prod-6", title: "Cyberpunk Lucy Pop Up Parade - Cyberpunk Edgerunners", slug: "cyberpunk-lucy-pop-up-parade-cyberpunk-edgerunners", category: "Pop Up Parade", scale: "Non-Scale", material: "PVC", heightMm: 175, price: 3899, stock: 8, images: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"], badges: ["New Release"] }
        ];
        const found = mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
        if (found) {
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
      // Trigger sliding login drawer
      dispatch(setLoginDrawerOpen(true));
    } else if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        scale: product.scale,
        qty: qty
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anime-pink" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-anime-bg py-20 text-center font-outfit">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-xl font-bold text-anime-pink">{error || 'Product not found'}</p>
          <Link to="/catalog" className="inline-block text-sm text-anime-cyan underline hover:text-white">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anime-bg py-10 px-6 md:px-12 font-outfit z-10 relative text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm text-anime-textMuted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="bg-anime-card border border-anime-border/40 rounded-2xl overflow-hidden h-[350px] md:h-[500px] flex items-center justify-center p-4">
              <img 
                src={product.images?.[0]} 
                alt={product.title} 
                className="object-contain max-h-full max-w-full rounded-lg"
              />
            </div>
            {/* Small Thumbnails indicator if multiple images exist */}
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-anime-card border-2 border-anime-pink rounded-lg overflow-hidden p-1 flex items-center justify-center cursor-pointer">
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
                  className="px-2.5 py-1 text-xs font-black uppercase bg-anime-pink text-white tracking-widest rounded"
                >
                  {badge}
                </span>
              ))}
              <span className="text-xs font-semibold text-anime-textMuted uppercase border-l border-anime-border/50 pl-2">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight uppercase">
              {product.title}
            </h1>

            {/* Price */}
            <div className="py-4 border-y border-anime-border/40">
              <span className="text-xs text-anime-textMuted uppercase tracking-wider block mb-1">MSRP (Inclusive of all Customs & Taxes)</span>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-anime-pink">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Specs Table */}
            <div className="space-y-3 bg-anime-card border border-anime-border/30 rounded-xl p-5 text-sm">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-anime-cyan glow-cyan mb-2">Collectible Specifications</h4>
              <div className="grid grid-cols-2 gap-y-2.5">
                <div className="text-anime-textMuted font-semibold">Scale</div>
                <div className="text-white font-bold">{product.scale}</div>

                <div className="text-anime-textMuted font-semibold">Material</div>
                <div className="text-white font-bold">{product.material || 'PVC / ABS'}</div>

                <div className="text-anime-textMuted font-semibold">Approx. Height</div>
                <div className="text-white font-bold">{product.heightMm} mm ({Math.round(product.heightMm / 10)} cm)</div>

                <div className="text-anime-textMuted font-semibold">Authenticity</div>
                <div className="text-anime-cyan font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 100% Authentic Licensed
                </div>
              </div>
            </div>

            {/* Add to Cart Actions */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-anime-textMuted uppercase">Quantity</span>
                  <div className="flex items-center border border-anime-border/60 rounded bg-anime-darker">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-anime-border/30"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-white">{qty}</span>
                    <button 
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-anime-border/30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-anime-textMuted italic">({product.stock} units available)</span>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto px-10 py-4 bg-anime-pink hover:bg-anime-pinkGlow text-white text-base font-extrabold uppercase rounded-lg shadow-neon-pink flex items-center justify-center gap-2 group transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Vault Cart
                </button>
              </div>
            ) : (
              <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg text-red-500 font-bold text-sm">
                This collectible is currently sold out. Sign up for waitlist drops!
              </div>
            )}

            {/* Shipping & Delivery Guarantee Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-anime-border/30 text-xs text-anime-textMuted">
              <div className="flex gap-2">
                <Truck className="w-4 h-4 text-anime-pink shrink-0" />
                <div>
                  <p className="font-bold text-white">Free Domestic Shipping</p>
                  <p>Ships in double-walled corrugated box packaging.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Box className="w-4 h-4 text-anime-cyan shrink-0" />
                <div>
                  <p className="font-bold text-white">Authentic Licensed Seal</p>
                  <p>Guaranteed genuine import from licensed suppliers in Japan.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
