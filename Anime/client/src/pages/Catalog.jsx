import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import { addToCart } from '../store/cartSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';
import apiClient from '../api/client.js';

const Catalog = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const categoryFilter = searchParams.get('category') || 'All';
  const scaleFilter = searchParams.get('scale') || 'All';
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Load Products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/products');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('API failed to load products in catalog, using fallbacks:', err);
        // Fallback seed data
        setProducts([
          { id: "prod-1", title: "Makima 1/7 Scale Figure - Chainsaw Man", slug: "makima-1-7-scale-figure-chainsaw-man", category: "Scale Figures", scale: "1/7", price: 14999, stock: 5, images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"], badges: ["Hot Seller", "Exclusive"] },
          { id: "prod-2", title: "Gojo Satoru Shibuya Incident Ver. - Jujutsu Kaisen", slug: "gojo-satoru-shibuya-incident-ver-jujutsu-kaisen", category: "Scale Figures", scale: "1/7", price: 18999, stock: 3, images: ["https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"], badges: ["Pre-order"] },
          { id: "prod-3", title: "Kamado Tanjirou Hinokami Kagura - Demon Slayer", slug: "kamado-tanjirou-hinokami-kagura-demon-slayer", category: "Action Figures", scale: "1/8", price: 11500, stock: 12, images: ["https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80"], badges: ["Free Shipping"] },
          { id: "prod-4", title: "Nendoroid Power - Chainsaw Man", slug: "nendoroid-power-chainsaw-man", category: "Nendoroid", scale: "Non-Scale", price: 4999, stock: 20, images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"], badges: ["Popular"] },
          { id: "prod-5", title: "Roronoa Zoro Wano Kuni - One Piece", slug: "roronoa-zoro-wano-kuni-one-piece", category: "Scale Figures", scale: "1/8", price: 13999, stock: 0, images: ["https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=80"], badges: ["Out of Stock"] },
          { id: "prod-6", title: "Cyberpunk Lucy Pop Up Parade - Cyberpunk Edgerunners", slug: "cyberpunk-lucy-pop-up-parade-cyberpunk-edgerunners", category: "Pop Up Parade", scale: "Non-Scale", price: 3899, stock: 8, images: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"], badges: ["New Release"] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Filter and Sort execution
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Scale Filter
    if (scaleFilter !== 'All') {
      result = result.filter(p => p.scale === scaleFilter);
    }

    // Stock Filter
    if (showInStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort By
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [products, categoryFilter, scaleFilter, showInStockOnly, sortBy]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Force Login via slider instead of allowing cart add
      dispatch(setLoginDrawerOpen(true));
    } else {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        scale: product.scale,
        qty: 1
      }));
    }
  };

  return (
    <div className="min-h-screen bg-anime-bg py-10 px-6 md:px-12 font-outfit z-10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8 border-b border-anime-border/50 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-anime-pink" />
              Anime Figure Realm
            </h1>
            <p className="text-xs text-anime-textMuted mt-1">
              Browse licensed figures and apply tags to narrow down your selection.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-anime-textMuted uppercase">
            <span>Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-anime-card border border-anime-border/60 rounded px-3 py-2 text-white focus:outline-none focus:border-anime-pink cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Guest Warning Banner if not logged in */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-anime-purple/10 border border-anime-purple/30 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-anime-cyan shrink-0 mt-0.5" />
            <div className="text-left">
              <h5 className="text-sm font-extrabold text-white">Browsing as Guest</h5>
              <p className="text-xs text-anime-textMuted mt-1 leading-relaxed">
                You can browse and review figures freely. To add figures to your cart, customize collections, or checkout, please click <strong>Login</strong> or try adding an item.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="space-y-6 text-left">
            
            <div className="bg-anime-card border border-anime-border/50 rounded-xl p-5 space-y-6">
              
              <div className="flex items-center gap-2 border-b border-anime-border/40 pb-3">
                <Filter className="w-4 h-4 text-anime-pink" />
                <h4 className="text-sm font-extrabold uppercase tracking-widest text-white">Filters</h4>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-anime-textMuted mb-3">
                  Category
                </label>
                <div className="space-y-2 text-sm">
                  {['All', 'Scale Figures', 'Nendoroid', 'Action Figures', 'Pop Up Parade'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleFilterChange('category', cat)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${categoryFilter === cat ? 'bg-anime-pink text-white font-bold' : 'hover:bg-anime-border/30 text-gray-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scales */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-anime-textMuted mb-3">
                  Scale
                </label>
                <div className="space-y-2 text-sm">
                  {['All', '1/7', '1/8', 'Non-Scale'].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => handleFilterChange('scale', sc)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${scaleFilter === sc ? 'bg-anime-cyan text-anime-darker font-extrabold' : 'hover:bg-anime-border/30 text-gray-300'}`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-anime-border/40">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="accent-anime-pink rounded focus:ring-anime-pink"
                  />
                  In Stock Only
                </label>
              </div>

            </div>

          </div>

          {/* Product Listing */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anime-pink" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-anime-card border border-anime-border/40 rounded-xl py-20 text-center text-anime-textMuted space-y-4">
                <AlertTriangle className="w-12 h-12 mx-auto text-anime-pink" />
                <p className="text-base font-bold">No figures match your filters.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-6 py-2 bg-anime-border text-white text-xs rounded hover:bg-anime-border/80 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-anime-card border border-anime-border/40 rounded-xl p-4 group manga-card-hover text-left flex flex-col justify-between"
                  >
                    <div>
                      <Link to={`/product/${p.slug}`} className="block relative h-56 rounded-lg overflow-hidden bg-anime-darker mb-4 border border-anime-border/30 flex items-center justify-center">
                        <img 
                          src={p.images?.[0]} 
                          alt={p.title} 
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {p.badges?.map((badge, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-anime-pink text-white tracking-wide shadow"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                        
                        {p.stock === 0 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-600 rounded text-xs font-black uppercase text-white tracking-widest">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-anime-textMuted uppercase">
                        <span>{p.category}</span>
                        <span className="px-1.5 py-0.5 rounded bg-anime-border/40 text-gray-200">
                          {p.scale}
                        </span>
                      </div>
                      
                      <Link to={`/product/${p.slug}`}>
                        <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2 hover:text-anime-pink transition-colors">
                          {p.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-anime-border/40 flex flex-col gap-3 mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-anime-textMuted uppercase">Price</p>
                          <p className="text-base font-black text-white">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="text-[10px] text-anime-textMuted font-mono">
                          {p.stock > 0 ? `${p.stock} units left` : 'Unavailable'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        disabled={p.stock === 0}
                        className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase transition-all tracking-wider ${p.stock === 0 ? 'bg-anime-border text-gray-500 cursor-not-allowed border-none' : 'bg-anime-pink hover:bg-anime-pinkGlow text-white shadow hover:shadow-neon-pink'}`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Catalog;
