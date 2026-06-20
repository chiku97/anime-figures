import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, Star, ShieldCheck } from 'lucide-react';
import Motes from '../components/Motes.jsx';
import apiClient from '../api/client.js';

const Landing = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await apiClient.get('/api/products');
        if (res.data.success) {
          setFeaturedProducts(res.data.products.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
        // Fallback seed figures for visual preview in case DB is not running
        setFeaturedProducts([
          {
            id: "prod-1",
            title: "Makima 1/7 Scale Figure - Chainsaw Man",
            slug: "makima-1-7-scale-figure-chainsaw-man",
            category: "Scale Figures",
            scale: "1/7",
            price: 14999,
            images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
            badges: ["Hot Seller", "Exclusive"]
          },
          {
            id: "prod-2",
            title: "Gojo Satoru Shibuya Incident Ver. - Jujutsu Kaisen",
            slug: "gojo-satoru-shibuya-incident-ver-jujutsu-kaisen",
            category: "Scale Figures",
            scale: "1/7",
            price: 18999,
            images: ["https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"],
            badges: ["Pre-order"]
          },
          {
            id: "prod-3",
            title: "Kamado Tanjirou Hinokami Kagura - Demon Slayer",
            slug: "kamado-tanjirou-hinokami-kagura-demon-slayer",
            category: "Action Figures",
            scale: "1/8",
            price: 11500,
            images: ["https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80"],
            badges: ["Free Shipping"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-outfit">
      
      {/* Floating Canvas Motes Background */}
      <Motes />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
        
        {/* Hero Left Content */}
        <div className="space-y-8 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-anime-pink/10 border border-anime-pink/30 text-anime-pink text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            India's First Premium Otaku Vault
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white uppercase">
              FORGE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-cyan glow-pink font-outfit">
                FIGURE VAULT
              </span>
            </h1>
            <p className="text-base md:text-lg text-anime-textMuted max-w-xl font-normal leading-relaxed">
              Curate, verify, and order authentic licensed anime masterpieces directly. From breathtaking 1/7 scale statuettes to highly customizable Nendoroids.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link 
              to="/catalog"
              className="px-8 py-4 bg-anime-pink hover:bg-anime-pinkGlow text-white text-base font-bold rounded-lg shadow-neon-pink flex items-center justify-center gap-2 group transition-all"
            >
              Enter Catalog 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="#featured"
              className="px-8 py-4 border border-anime-border hover:bg-anime-border/40 text-gray-300 hover:text-white text-base font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              See Hot Releases
            </a>
          </div>

          {/* Mini Trust Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-anime-border/40 max-w-md">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-anime-textMuted uppercase tracking-wider">Licensed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-anime-cyan glow-cyan">Free</p>
              <p className="text-xs text-anime-textMuted uppercase tracking-wider">Customs</p>
            </div>
            <div>
              <p className="text-2xl font-black text-anime-purple glow-purple">India</p>
              <p className="text-xs text-anime-textMuted uppercase tracking-wider">Delivery</p>
            </div>
          </div>

        </div>

        {/* Hero Right Graphic */}
        <div className="relative mx-auto lg:mx-0 lg:ml-auto max-w-md lg:max-w-none w-full flex justify-center z-10">
          <div className="relative group p-1 bg-gradient-to-tr from-anime-pink via-anime-purple to-anime-cyan rounded-2xl shadow-neon-purple overflow-hidden">
            <div className="relative bg-anime-card rounded-2xl p-6 flex flex-col items-center">
              <div className="relative w-full h-[350px] md:h-[420px] rounded-xl overflow-hidden mb-6 bg-anime-darker flex items-center justify-center border border-anime-border/50">
                <img 
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80" 
                  alt="Premium Figure Display"
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />
                
                {/* Floating Banner */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel border border-white/10 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-anime-pink tracking-wider">Featured Release</p>
                    <p className="text-sm font-extrabold text-white truncate max-w-[200px]">Makima 1/7 Scale</p>
                  </div>
                  <Link 
                    to="/product/makima-1-7-scale-figure-chainsaw-man" 
                    className="p-2 bg-anime-pink hover:bg-anime-pinkGlow rounded-full text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                <div>
                  <span className="text-xs text-anime-textMuted">RATING</span>
                  <div className="flex items-center gap-1 text-anime-pink">
                    <Star className="w-4 h-4 fill-anime-pink" />
                    <Star className="w-4 h-4 fill-anime-pink" />
                    <Star className="w-4 h-4 fill-anime-pink" />
                    <Star className="w-4 h-4 fill-anime-pink" />
                    <Star className="w-4 h-4 fill-anime-pink" />
                    <span className="text-xs font-bold text-white ml-1">5.0</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-anime-textMuted uppercase">MSRP</span>
                  <p className="text-xl font-extrabold text-white">₹14,999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Cyberpunk Rolling Promo Ticker */}
      <section className="bg-anime-darker border-y border-anime-border/50 py-3 overflow-hidden z-10 relative select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 text-xs md:text-sm font-extrabold uppercase tracking-widest text-anime-textMuted">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-anime-pink animate-bounce" /> 100% Licensed & Authentic
              </span>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-anime-cyan" /> Secure Packaging & Mint Condition Box Guarantee
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-anime-purple" /> Safe Checkout via Razorpay (UPI, Credit Cards, Netbanking)
              </span>
              <span className="flex items-center gap-2 text-anime-pink">
                <Sparkles className="w-4 h-4 text-anime-pink" /> Pre-Orders Open Now
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Figures Display Grid */}
      <section id="featured" className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider font-outfit">
            HOT COLLECTIONS
          </h2>
          <div className="w-16 h-1 bg-anime-pink mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-sm text-anime-textMuted">
            Explore authentic figures available for immediate purchase or pre-orders.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-anime-pink" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-anime-card border border-anime-border/40 rounded-xl overflow-hidden p-4 group manga-card-hover text-left flex flex-col h-full"
              >
                <div className="relative h-64 md:h-72 rounded-lg overflow-hidden bg-anime-darker mb-4 border border-anime-border/30 flex items-center justify-center">
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
                        className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-anime-pink text-white tracking-wide shadow"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-anime-textMuted">
                      <span>{p.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-anime-border/50 border border-anime-border/60 text-white font-mono text-[9px]">
                        {p.scale}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-anime-border/40 flex justify-between items-center mt-4">
                    <div>
                      <p className="text-[10px] text-anime-textMuted uppercase">Price</p>
                      <p className="text-lg font-black text-white">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <Link 
                      to={`/product/${p.slug}`}
                      className="px-4 py-2 border border-anime-cyan text-anime-cyan hover:bg-anime-cyan hover:text-anime-darker rounded-lg text-xs font-bold transition-all"
                    >
                      View Figure
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 border border-anime-pink text-anime-pink hover:bg-anime-pink hover:text-white font-bold rounded-lg transition-all"
          >
            Browse Full Catalog 
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Category grid */}
      <section id="categories" className="py-24 bg-anime-darker border-t border-anime-border/30 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider font-outfit">
              FIGURE CATEGORIES
            </h2>
            <div className="w-16 h-1 bg-anime-cyan mx-auto mt-3 mb-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Scale Figures', desc: 'Breathtaking 1/7, 1/8 and 1/6 statues.', color: 'border-glow-pink', link: '/catalog?category=Scale+Figures' },
              { name: 'Nendoroid', desc: 'Cute, customizable, posable chibi figures.', color: 'border-glow-cyan', link: '/catalog?category=Nendoroid' },
              { name: 'Action Figures', desc: 'Figma, Buzzmod, and articulated collectibles.', color: 'border-glow-purple', link: '/catalog?category=Action+Figures' },
              { name: 'Pop Up Parade', desc: 'High quality affordable scale statues.', color: '', link: '/catalog?category=Pop+Up+Parade' }
            ].map((cat, i) => (
              <div 
                key={i}
                onClick={() => navigate(cat.link)}
                className={`bg-anime-card border border-anime-border/50 rounded-xl p-6 cursor-pointer hover:-translate-y-1 transition-all ${cat.color} group hover:bg-anime-card/80`}
              >
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide group-hover:text-anime-pink transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-anime-textMuted leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
