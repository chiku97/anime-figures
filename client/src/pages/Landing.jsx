import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Star,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Mail
} from 'lucide-react';

const Instagram = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import Motes from '../components/Motes.jsx';
import apiClient from '../api/client.js';
import CategoriesSection from '../components/CategoriesSection.jsx';
import UspSection from '../components/UspSection.jsx';
import { addToast } from '../store/toastSlice.js';

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Smooth scroll to hash anchor or state.scrollTo target after products load
  useEffect(() => {
    if (!loading) {
      const scrollTarget = location.state?.scrollTo || (location.hash ? location.hash.replace('#', '') : null);
      if (scrollTarget) {
        const el = document.getElementById(scrollTarget);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState({}, '', location.pathname + location.hash);
          }, 150);
        }
      }
    }
  }, [loading, location.hash, location.state]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await apiClient.get('/api/products');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
        // Fallback seed products matching the new category structure
        setProducts([
          {
            id: 'prod-1',
            title: 'Camp Nou Stadium Outline LED Neon Sign',
            slug: 'camp-nou-stadium-outline-led-neon-sign',
            category: 'Football Collection',
            scale: 'Sporty',
            price: 4999,
            images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'],
            badges: ['Best Seller', 'Football']
          },
          {
            id: 'prod-2',
            title: 'Leo Messi Silhouette 3D Acrylic Lamp',
            slug: 'leo-messi-silhouette-3d-acrylic-lamp',
            category: 'Football Collection',
            scale: 'Sporty',
            price: 2499,
            images: ['https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=80'],
            badges: ['Fan Choice', 'Football']
          },
          {
            id: 'prod-3',
            title: 'Spider-Man Silhouette 3D LED Lamp',
            slug: 'spider-man-silhouette-3d-led-lamp',
            category: 'Superhero Collection',
            scale: 'Collectible',
            price: 2799,
            images: ['https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80'],
            badges: ['New Arrival', 'Superhero']
          },
          {
            id: 'prod-4',
            title: 'Air Jordan Basketball Court 3D Lamp',
            slug: 'air-jordan-basketball-court-3d-lamp',
            category: 'Basketball Collection',
            scale: 'Sporty',
            price: 2699,
            images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80'],
            badges: ['Trending', 'Basketball']
          },
          {
            id: 'prod-5',
            title: 'Aesthetic Cloud Sunset Glow Projection Lamp',
            slug: 'aesthetic-cloud-sunset-glow-projection-lamp',
            category: 'Ambient Lamps',
            scale: 'Aesthetic Decor',
            price: 1999,
            images: ['https://images.unsplash.com/photo-1508243754930-f4dcf1ab6274?w=600&auto=format&fit=crop&q=80'],
            badges: ['Aesthetic', 'Ambient']
          },
          {
            id: 'prod-6',
            title: 'Carbon Fiber Geometric Desktop Phone Stand',
            slug: 'carbon-fiber-geometric-desktop-phone-stand',
            category: 'Phone Accessories',
            scale: 'Utility',
            price: 899,
            images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'],
            badges: ['Utility', 'Phone']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      dispatch(addToast({ message: 'Thank you for subscribing! Check your inbox for your 10% coupon. 📩', type: 'success' }));
      setNewsletterEmail('');
    }
  };

  // Filter products for Best Sellers and New Arrivals
  const bestSellers = products.filter(p =>
    p.badges?.includes('Best Seller') || p.badges?.includes('Fan Choice') || p.badges?.includes('Aesthetic')
  ).slice(0, 3);

  const newArrivals = products.filter(p =>
    p.badges?.includes('New Arrival') || p.badges?.includes('Trending') || p.badges?.includes('Utility')
  ).slice(0, 3);

  return (
    <>
      <div className="relative min-h-screen flex flex-col font-outfit bg-warm-white text-body">
        {/* Floating Canvas Motes Background */}
        <Motes />

        {/* 1. Hero Section */}
        <section className="relative z-10 px-6 pt-24 md:pt-16 pb-16 md:pb-24 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
          {/* Hero Left Content */}
          <div className="space-y-8 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-white border border-primary text-primary text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Premium 3D-Printed Design Studio
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-primary uppercase">
                Where Passion <br />
                <span 
                  className="font-outfit"
                  style={{
                    background: 'linear-gradient(to right, #A6B39B, #B97A57, #C9A227)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  Meets Design.
                </span>
              </h1>
              <p className="text-sm md:text-lg text-secondary max-w-xl font-normal leading-relaxed">
                Premium 3D-printed products inspired by sports, creativity, and modern living. From iconic football lamps to aesthetic home décor, every piece is designed to bring personality into your space.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/catalog" className="px-8 py-4 btn-primary text-base font-bold rounded-lg shadow hover:shadow-lg flex items-center justify-center gap-2 group transition-all text-center">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform inline" />
              </Link>
              <Link to="/catalog?sort=new" className="px-8 py-4 border border-primary hover:bg-primary/10 text-secondary text-base font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-center">
                Explore New Arrivals
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-between items-center gap-4 pt-6 border-t border-primary/40 max-w-md text-left">
              <div>
                <p className="text-lg md:text-2xl font-black text-primary leading-tight">Made In</p>
                <p className="text-[10px] md:text-xs text-secondary uppercase tracking-wider font-semibold">India</p>
              </div>
              <div className="h-8 w-[1px] bg-primary/20" />
              <div>
                <p className="text-lg md:text-2xl font-black text-primary leading-tight">Premium</p>
                <p className="text-[10px] md:text-xs text-secondary uppercase tracking-wider font-semibold">Finish</p>
              </div>
              <div className="h-8 w-[1px] bg-primary/20" />
              <div>
                <p className="text-lg md:text-2xl font-black text-primary leading-tight">Free</p>
                <p className="text-[10px] md:text-xs text-secondary uppercase tracking-wider font-semibold">Freebies</p>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div className="relative mx-auto lg:mx-0 lg:ml-auto max-w-md lg:max-w-none w-full flex justify-center z-10">
            <div className="relative group p-1 bg-gradient-to-tr from-sage via-clay to-gold rounded-2xl shadow-lg overflow-hidden">
              <div className="relative card rounded-2xl p-6 flex flex-col items-center bg-white">
                <div className="relative w-full h-[350px] md:h-[420px] rounded-xl overflow-hidden mb-6 bg-darker flex items-center justify-center border border-primary/50">
                  <img
                    src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80"
                    alt="Premium Superhero Lamp Design"
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                  />
                  {/* Floating Banner */}
                  <div className="absolute bottom-4 left-4 right-4 glass-panel border border-white/10 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-primary tracking-wider">Featured Release</p>
                      <p className="text-sm font-extrabold text-white truncate max-w-[200px]">Spider-Man 3D Acrylic Lamp</p>
                    </div>
                    <Link to="/product/spider-man-silhouette-3d-led-lamp" className="p-2 btn-primary rounded-full text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between">
                  <div>
                    <span className="text-xs text-secondary">RATING</span>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-primary animate-pulse" />
                      <Star className="w-4 h-4 fill-primary" />
                      <Star className="w-4 h-4 fill-primary" />
                      <Star className="w-4 h-4 fill-primary" />
                      <Star className="w-4 h-4 fill-primary" />
                      <span className="text-xs font-bold text-[#1F1F1F] ml-1">5.0</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-secondary uppercase">MSRP</span>
                    <p className="text-xl font-extrabold text-[#1F1F1F]">₹2,799</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rolling Promo Ticker */}
        <section className="bg-darker border-y border-primary/50 py-3 overflow-hidden z-10 relative select-none">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-16 text-xs md:text-sm font-extrabold uppercase tracking-widest text-secondary">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary animate-bounce" /> Precision 3D Printed Premium Memorabilia
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Customizable Names & Numbers Available
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Free Shipping Across India
                </span>
                <span className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4 text-primary" /> Premium Eco-Conscious Plant-Based Materials
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Featured Collections */}
        <CategoriesSection />

        {/* 3. Best Sellers */}
        <section id="featured" className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative text-left">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wider font-outfit">
              BEST SELLERS
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
            <p className="text-sm text-secondary">
              Our most popular premium 3D-printed creations, loved by our community.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bestSellers.map((p) => (
                <div
                  key={p.id || p._id}
                  className="card border border-primary/40 rounded-xl overflow-hidden p-4 text-left flex flex-col h-full bg-white shadow hover:shadow-lg transition-all"
                >
                  <div className="relative h-64 md:h-72 rounded-lg overflow-hidden bg-darker mb-4 border border-primary/30 flex items-center justify-center">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {p.badges?.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary text-white tracking-wide shadow"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-secondary">
                        <span>{p.category}</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/50 border border-primary/60 text-white font-mono text-[9px]">
                          {p.scale}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-primary text-base leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-primary/40 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] text-secondary uppercase">Price</p>
                        <p className="text-lg font-black text-primary">₹{p.price.toLocaleString('en-IN')}</p>
                      </div>

                      <Link
                        to={`/product/${p.slug}`}
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Why Formora */}
        <UspSection />

        {/* 5. New Arrivals */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative text-left">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wider font-outfit">
              NEW ARRIVALS
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
            <p className="text-sm text-secondary">
              Freshly designed and printed layouts straight out of our creative design workshop.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newArrivals.map((p) => (
                <div
                  key={p.id || p._id}
                  className="card border border-primary/40 rounded-xl overflow-hidden p-4 text-left flex flex-col h-full bg-white shadow hover:shadow-lg transition-all"
                >
                  <div className="relative h-64 md:h-72 rounded-lg overflow-hidden bg-darker mb-4 border border-primary/30 flex items-center justify-center">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {p.badges?.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary text-white tracking-wide shadow"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-secondary">
                        <span>{p.category}</span>
                        <span className="px-1.5 py-0.5 rounded bg-primary/50 border border-primary/60 text-white font-mono text-[9px]">
                          {p.scale}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-primary text-base leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-primary/40 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] text-secondary uppercase">Price</p>
                        <p className="text-lg font-black text-primary">₹{p.price.toLocaleString('en-IN')}</p>
                      </div>

                      <Link
                        to={`/product/${p.slug}`}
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Our Story & Materials */}
        <section id="story" className="py-24 px-6 md:px-12 bg-white border-t border-gray-200 z-10 relative text-left font-outfit">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Story */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-[#1F1F1F] uppercase tracking-tight">
                OUR STORY
              </h2>
              <div className="w-16 h-1 bg-sage rounded-full" />
              <div className="space-y-4 text-secondary text-sm md:text-base leading-relaxed">
                <p>
                  At Formora, we believe everyday objects should tell a story. What started with sports-inspired lamps is evolving into a collection of modern décor, lighting, and lifestyle accessories designed to inspire every space.
                </p>
                <p>
                  Whether you’re decorating your room, upgrading your desk, or looking for the perfect gift, Formora brings creativity and craftsmanship together through innovative 3D printing.
                </p>
              </div>
            </div>

            {/* Materials */}
            <div className="space-y-6 bg-[#FAF9F6] border border-primary/10 rounded-[2rem] p-8 md:p-12 shadow-sm">
              <h3 className="text-xl md:text-2xl font-extrabold text-[#1F1F1F] uppercase tracking-wider">
                PREMIUM MATERIALS
              </h3>
              <p className="text-xs md:text-sm text-secondary leading-relaxed">
                We use premium-quality PLA and other durable materials that offer:
              </p>

              <ul className="space-y-4 pt-2">
                {[
                  { title: 'Smooth Finish', desc: 'Expertly layered prints optimized for refined aesthetics.' },
                  { title: 'Lightweight Construction', desc: 'Easy to mount, rearrange, or carry for daily use.' },
                  { title: 'Eco-Conscious Material Options', desc: 'Using plant-based PLA that is kind to the environment.' },
                  { title: 'Long-Lasting Durability', desc: 'Tough structure built to withstand regular handling.' },
                  { title: 'High Precision Printing', desc: 'Complex geometries printed down to sub-millimeter detail.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-left">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center text-sage">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-primary">{item.title}</h4>
                      <p className="text-xs text-secondary mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Custom Orders */}
        <section id="custom-orders" className="py-20 px-6 md:px-12 bg-[#FAF9F6] border-t border-gray-200 z-10 relative font-outfit">
          <div className="max-w-7xl mx-auto card rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-tr from-sage/20 via-white to-gold/10 p-8 md:p-16 border border-primary/20 shadow-xl text-left flex flex-col lg:flex-row gap-12 justify-between items-center bg-white">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest">
                <Gift className="w-3 h-3 text-sage" /> Customized Creation Studio
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-primary uppercase leading-tight">
                HAVE AN IDEA <br />IN MIND?
              </h2>
              <p className="text-sm md:text-base text-secondary leading-relaxed">
                We create personalized 3D-printed products for:
              </p>

              {/* Bullets grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold text-primary uppercase tracking-wider">
                {['🎁 Gifts', '🏆 Sports Memorabilia', '🏠 Home Décor', '💼 Business Branding', '🏢 Corporate Gifting', '⭐ Special Occasions'].map((c, i) => (
                  <div key={i} className="px-3.5 py-2 rounded-lg bg-white border border-black/5 shadow-sm">
                    {c}
                  </div>
                ))}
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Let's bring your idea to life. Simply submit your custom design request and our engineering team will handle prototyping.
              </p>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto">
              <a
                href="https://wa.me/919876543210?text=Hi%20Formora,%20I'd%20like%20to%20request%20a%20custom%203D%20printed%20design!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 btn-primary hover:bg-primary font-black rounded-xl shadow-lg inline-flex items-center justify-center gap-3 w-full lg:w-auto text-base uppercase tracking-widest text-white"
              >
                <Mail className="w-5 h-5" /> Request a Custom Design
              </a>
            </div>
          </div>
        </section>

        {/* 8. Freebies Section */}
        <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-200 z-10 relative font-outfit text-left">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] uppercase tracking-wider">
                ORDER EXCLUSIVE FREEBIES
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
              <p className="text-sm text-secondary font-medium">
                Every order you place may include premium gifts to enhance your unboxing experience:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Aesthetic Stickers', desc: 'High-quality vinyl stickers to customize your tech or workspace.', icon: '🎨' },
                { title: 'Care Guide', desc: 'Simple instructions on keeping your 3D printed objects durable and clean.', icon: '📖' },
                { title: 'Thank-You Card', desc: 'A handwritten note directly from our core studio crafting team.', icon: '✉️' },
                { title: 'Surprise Collectible', desc: 'A unique miniature 3D printed print included on selected orders.', icon: '🎁' }
              ].map((freebie, idx) => (
                <div key={idx} className="card border border-primary/20 rounded-2xl p-6 bg-[#FAF9F6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]">
                  <span className="text-4xl select-none" role="img" aria-label={freebie.title}>
                    {freebie.icon}
                  </span>
                  <div className="mt-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">{freebie.title}</h3>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">{freebie.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Customer Reviews */}
        <section className="py-24 px-6 md:px-12 bg-[#FAF9F6] border-t border-gray-200 z-10 relative font-outfit text-left">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] uppercase tracking-wider">
                CUSTOMER REVIEWS
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { quote: '“Loved the quality and finish. Looks amazing on my desk!”', user: 'Amit Sharma', rating: 5, date: 'Verified Purchase' },
                { quote: '“The football lamp exceeded my expectations. Premium packaging and fast delivery.”', user: 'Rohan Deshmukh', rating: 5, date: 'Verified Purchase' }
              ].map((review, idx) => (
                <div key={idx} className="card border border-primary/10 rounded-[2rem] p-8 bg-white shadow-md space-y-4">
                  <div className="flex text-gold gap-0.5">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-base font-medium text-primary italic leading-relaxed">
                    {review.quote}
                  </p>
                  <div className="pt-2 flex justify-between items-center border-t border-primary/10 text-xs">
                    <span className="font-extrabold text-primary uppercase tracking-wider">{review.user}</span>
                    <span className="text-secondary">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Instagram Feed mockup */}
        <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-200 z-10 relative font-outfit text-left">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] uppercase tracking-wider">
                INSTAGRAM FEED
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
              <p className="text-sm text-secondary font-medium">
                Follow us <a href="https://instagram.com/formorastudio" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">@formorastudio</a> for updates, giveaways, and custom orders.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=500&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=80'
              ].map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-primary/20 shadow-sm bg-darker">
                  <img src={src} alt="Instagram Post Mock" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 pointer-events-none">
                    <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Instagram className="w-4 h-4" /> View Post
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Newsletter Signup */}
        <section className="py-20 px-6 md:px-12 bg-[#FAF9F6] border-t border-gray-200 z-10 relative font-outfit">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-black text-primary uppercase tracking-wider">
              NEWSLETTER SIGNUP
            </h2>
            <p className="text-sm text-secondary leading-relaxed max-w-md mx-auto">
              Get notified of new launches, limited design drops, and special pricing offers.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="flex max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-white border border-gray-300 rounded-l px-4 py-3 text-sm w-full focus:outline-none focus:border-primary text-[#1F1F1F]"
              />
              <button
                type="submit"
                className="bg-sage hover:bg-primary px-6 py-3 rounded-r text-white font-extrabold flex items-center justify-center transition-all uppercase tracking-wider text-xs"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </div>
    </>
  );
};

export default Landing;
