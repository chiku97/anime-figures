import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import { addToCart } from '../store/cartSlice.js';
import { addToast } from '../store/toastSlice.js';
import { setLoginDrawerOpen } from '../store/authSlice.js';
import apiClient from '../api/client.js';
import ProductImageSlider from '../components/ProductImageSlider.jsx';

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
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);
  const [showMobileSortDrawer, setShowMobileSortDrawer] = useState(false);

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
        // Fallback seed lights
        setProducts([
          { id: "prod-1", title: "Camp Nou Stadium Outline LED Neon Sign", slug: "camp-nou-stadium-outline-led-neon-sign", category: "Football Collection", scale: "Sporty", price: 4999, stock: 5, images: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80"], badges: ["Best Seller", "Football"] },
          { id: "prod-2", title: "Leo Messi Silhouette 3D Acrylic Lamp", slug: "leo-messi-silhouette-3d-acrylic-lamp", category: "Football Collection", scale: "Sporty", price: 2499, stock: 15, images: ["https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=80"], badges: ["Fan Choice", "Football"] },
          { id: "prod-3", title: "Spider-Man Silhouette 3D LED Lamp", slug: "spider-man-silhouette-3d-led-lamp", category: "Superhero Collection", scale: "Collectible", price: 2799, stock: 10, images: ["https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80"], badges: ["New Arrival", "Superhero"] },
          { id: "prod-4", title: "Air Jordan Basketball Court 3D Lamp", slug: "air-jordan-basketball-court-3d-lamp", category: "Basketball Collection", scale: "Sporty", price: 2699, stock: 8, images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80"], badges: ["Trending", "Basketball"] },
          { id: "prod-5", title: "Aesthetic Cloud Sunset Glow Projection Lamp", slug: "aesthetic-cloud-sunset-glow-projection-lamp", category: "Ambient Lamps", scale: "Aesthetic Decor", price: 1999, stock: 8, images: ["https://images.unsplash.com/photo-1508243754930-f4dcf1ab6274?w=600&auto=format&fit=crop&q=80"], badges: ["Aesthetic", "Ambient"] },
          { id: "prod-6", title: "Carbon Fiber Geometric Desktop Phone Stand", slug: "carbon-fiber-geometric-desktop-phone-stand", category: "Phone Accessories", scale: "Utility", price: 899, stock: 20, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80"], badges: ["Utility", "Phone"] },
          { id: "prod-7", title: "Custom Initials 3D-Printed Keychain", slug: "custom-initials-3d-printed-keychain", category: "Keychains", scale: "Customized", price: 399, stock: 50, images: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"], badges: ["Customized", "Keychain"] },
          { id: "prod-8", title: "Chibi Anime Figure Dashboard Decor", slug: "chibi-anime-figure-dashboard-decor", category: "Car Dashboard Accessories", scale: "Collectible", price: 1299, stock: 14, images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"], badges: ["Car Decor", "Collectibles"] }
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

    // Size Filter
    if (scaleFilter !== 'All') {
      result = result.filter(p => p.scale.includes(scaleFilter));
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
      dispatch(addToast({ message: 'Please log in to add items to your cart.', type: 'info' }));
    } else {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        scale: product.scale,
        qty: 1
      }));
      dispatch(addToast({ message: `${product.title} added to your vault!`, type: 'success' }));
    }
  };

  return (
    <div className="min-h-screen bg-warm-white text-body py-10 px-6 md:px-12 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-primary/50 pb-5 gap-4 text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-primary uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Aesthetic Light Catalog
            </h1>
            <p className="text-[11px] md:text-xs text-secondary mt-1">
              Browse premium 3D-printed designs, dashboard collectibles, and ambient lamps.
            </p>
          </div>
        </div>

        {/* Guest Warning Banner if not logged in */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-left">
              <h5 className="text-sm font-extrabold text-primary">Browsing as Guest</h5>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                You can browse and review lights freely. To add lights to your cart, customize collections, or checkout, please click <strong>Login</strong> or try adding an item.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6 text-left">
            <div className="bg-card border border-primary/50 rounded-xl p-5 space-y-6">
              <div className="flex items-center gap-2 border-b border-primary/40 pb-3">
                <Filter className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary">Filters</h4>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary mb-3">
                  Category
                </label>
                <div className="space-y-2 text-sm">
                  {[
                    { key: 'All', label: 'All' },
                    { key: 'Football Collection', label: 'Football' },
                    { key: 'Basketball Collection', label: 'Basketball' },
                    { key: 'Superhero Collection', label: 'Superheroes' },
                    { key: 'Phone Accessories', label: 'Phone Access.' },
                    { key: 'Keychains', label: 'Keychains' },
                    { key: 'Car Dashboard Accessories', label: 'Car Accessories' },
                    { key: 'Ambient Lamps', label: 'Ambient Lamps' }
                  ].map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => handleFilterChange('category', cat.key)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${categoryFilter === cat.key ? 'bg-primary text-white font-bold' : 'hover:bg-primary/30 text-secondary'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme / Style */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary mb-3">
                  Theme / Style
                </label>
                <div className="space-y-2 text-sm">
                  {['All', 'Sporty', 'Aesthetic Decor', 'Customized', 'Minimalist'].map(sc => (
                    <button
                      key={sc}
                      onClick={() => handleFilterChange('scale', sc)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${scaleFilter === sc ? 'bg-primary text-white font-bold' : 'hover:bg-primary/30 text-secondary'}`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="pt-4 border-t border-primary/40">
                <label className="block text-xs uppercase font-extrabold tracking-wider text-secondary mb-3">
                  Sort By
                </label>
                <div className="space-y-2 text-sm">
                  {[
                    { key: 'popular', label: 'Popularity' },
                    { key: 'price-low', label: 'Price: Low to High' },
                    { key: 'price-high', label: 'Price: High to Low' }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${sortBy === opt.key ? 'bg-primary text-white font-bold' : 'hover:bg-primary/30 text-secondary'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="pt-4 border-t border-primary/40">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={e => setShowInStockOnly(e.target.checked)}
                    className="accent-primary rounded focus:ring-primary"
                  />
                  In Stock Only
                </label>
              </div>
            </div>
          </div>

          {/* Product Listing */}
          <div className="lg:col-span-3">
            
            {/* Animation style definition for drawers */}
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-slideUp {
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out forwards;
              }
            `}</style>

            {/* Mobile-Friendly Sticky Action Bar (sticky under standard nav top-[71px]) */}
            <div className="lg:hidden sticky top-[71px] z-30 bg-warm-white/95 backdrop-blur-md py-3.5 border-b border-primary/10 -mx-6 px-6 mb-6 flex gap-3">
              <button
                onClick={() => setShowMobileFilterDrawer(true)}
                className="flex-1 py-3 px-4 rounded-xl border border-primary/20 bg-white font-extrabold uppercase text-[10px] tracking-wider text-primary flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters {(categoryFilter !== 'All' ? 1 : 0) + (scaleFilter !== 'All' ? 1 : 0) + (showInStockOnly ? 1 : 0) > 0 ? `(${(categoryFilter !== 'All' ? 1 : 0) + (scaleFilter !== 'All' ? 1 : 0) + (showInStockOnly ? 1 : 0)})` : ''}
              </button>
              <button
                onClick={() => setShowMobileSortDrawer(true)}
                className="flex-1 py-3 px-4 rounded-xl border border-primary/20 bg-white font-extrabold uppercase text-[10px] tracking-wider text-primary flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort: {sortBy === 'popular' ? 'Popularity' : sortBy === 'price-low' ? 'Price ↑' : 'Price ↓'}
              </button>
            </div>

            {/* Mobile Filter Drawer Modal */}
            {showMobileFilterDrawer && (
              <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
                <div className="absolute inset-0" onClick={() => setShowMobileFilterDrawer(false)} />
                <div className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl p-6 space-y-5 text-left max-h-[85vh] overflow-y-auto z-10 animate-slideUp">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">Filters</h3>
                    <button 
                      onClick={() => setShowMobileFilterDrawer(false)} 
                      className="text-secondary hover:text-primary font-bold text-[10px] uppercase tracking-wider"
                    >
                      Done
                    </button>
                  </div>

                  {/* Collections */}
                  <div className="space-y-2.5">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-secondary">Collections</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'All', label: 'All Collections' },
                        { key: 'Football Collection', label: 'Football' },
                        { key: 'Basketball Collection', label: 'Basketball' },
                        { key: 'Superhero Collection', label: 'Superheroes' },
                        { key: 'Phone Accessories', label: 'Phone Access.' },
                        { key: 'Keychains', label: 'Keychains' },
                        { key: 'Car Dashboard Accessories', label: 'Car Access.' },
                        { key: 'Ambient Lamps', label: 'Ambient Lamps' }
                      ].map(cat => (
                        <button
                          key={cat.key}
                          onClick={() => handleFilterChange('category', cat.key)}
                          className={`px-3 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all text-center ${categoryFilter === cat.key ? 'bg-primary border-primary text-white' : 'bg-warm-white border-primary/10 text-secondary'}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme / Style */}
                  <div className="space-y-2.5 pt-2 border-t border-primary/5">
                    <label className="block text-[9px] uppercase font-black tracking-widest text-secondary">Theme / Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['All', 'Sporty', 'Collectible', 'Aesthetic Decor', 'Utility', 'Customized'].map(sc => (
                        <button
                          key={sc}
                          onClick={() => handleFilterChange('scale', sc)}
                          className={`px-3 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all text-center ${scaleFilter === sc ? 'bg-primary border-primary text-white' : 'bg-warm-white border-primary/10 text-secondary'}`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* In Stock only toggle */}
                  <div className="flex justify-between items-center py-4 border-t border-b border-primary/10">
                    <span className="text-[10px] uppercase font-black tracking-wider text-secondary">In Stock Only</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={e => setShowInStockOnly(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Drawer Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSearchParams({});
                        setShowInStockOnly(false);
                      }}
                      className="flex-1 py-3 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-secondary hover:text-primary active:scale-95 transition-all text-center"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilterDrawer(false)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Sort Drawer Modal */}
            {showMobileSortDrawer && (
              <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
                <div className="absolute inset-0" onClick={() => setShowMobileSortDrawer(false)} />
                <div className="relative w-full max-w-md bg-white rounded-t-[2rem] shadow-2xl p-6 space-y-4 text-left z-10 animate-slideUp">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">Sort By</h3>
                    <button 
                      onClick={() => setShowMobileSortDrawer(false)} 
                      className="text-secondary hover:text-primary font-bold text-[10px] uppercase tracking-wider"
                    >
                      Close
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {[
                      { key: 'popular', label: 'Popularity' },
                      { key: 'price-low', label: 'Price: Low to High' },
                      { key: 'price-high', label: 'Price: High to Low' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortBy(opt.key);
                          setShowMobileSortDrawer(false);
                        }}
                        className={`w-full py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border text-left flex justify-between items-center transition-all ${sortBy === opt.key ? 'bg-primary/5 border-primary text-primary' : 'border-primary/10 text-secondary bg-white'}`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.key && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card border border-primary/40 rounded-xl py-20 text-center text-secondary space-y-4">
                <AlertTriangle className="w-12 h-12 mx-auto text-primary" />
                <p className="text-base font-bold">No lights match your filters.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-6 py-2 bg-primary text-white text-xs rounded hover:bg-primary/80 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    className="card border border-primary/40 rounded-xl p-4 flex flex-col justify-between text-left"
                  >
                    <div className="relative h-56 rounded-lg overflow-hidden bg-darker mb-4 border border-primary/30">
                      <ProductImageSlider
                        images={p.images}
                        alt={p.title}
                        interval={2000}
                        className="h-full w-full"
                        imgClassName="object-cover w-full h-full"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {p.badges?.map((badge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-primary text-white tracking-wide shadow"
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
                    </div>
                    <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-secondary uppercase">
                      <span>{p.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/40 text-white">
                        {p.scale}
                      </span>
                    </div>
                    <Link to={`/product/${p.slug}`}>
                      <h3 className="font-extrabold text-primary text-base leading-snug line-clamp-2 hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                    </Link>
                    <div className="pt-4 border-t border-primary/40 flex flex-col gap-3 mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[9px] text-secondary uppercase">Price</p>
                          <p className="text-base font-black text-primary">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="text-[10px] text-secondary font-mono">
                          {p.stock > 0 ? `${p.stock} units left` : 'Unavailable'}
                        </span>
                      </div>
                      <button
                        onClick={e => handleAddToCart(e, p)}
                        disabled={p.stock === 0}
                        className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase transition-all tracking-wider ${p.stock === 0 ? 'bg-primary text-gray-500 cursor-not-allowed border-none' : 'bg-primary hover:bg-primary/80 text-white shadow'}`}
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
