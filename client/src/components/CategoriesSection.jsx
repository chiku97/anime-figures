import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Target, Star, ShieldCheck } from 'lucide-react';
import Motes from '../components/Motes.jsx';
import apiClient from '../api/client.js';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'Football Collection', emoji: '⚽', desc: 'Celebrate your love for football with premium 3D-printed lamps and collectibles inspired by the world’s biggest game.', link: '/catalog?category=Football+Collection' },
    { name: 'Basketball Collection', emoji: '🏀', desc: 'Minimal yet bold designs crafted for basketball enthusiasts and sports lovers.', link: '/catalog?category=Basketball+Collection' },
    { name: 'Superhero Collection', emoji: '🦸', desc: 'Bring your favorite heroes to life with unique 3D-printed lamps and collectibles, including Spider-Man.', link: '/catalog?category=Superhero+Collection' },
    { name: 'Phone Accessories', emoji: '📱', desc: 'Unique 3D-printed accessories that combine style, functionality, and durability.', link: '/catalog?category=Phone+Accessories' },
    { name: 'Keychains', emoji: '🔑', desc: 'Personalized and creative keychains designed for everyday carry.', link: '/catalog?category=Keychains' },
    { name: 'Car Dashboard Accessories', emoji: '🚗', desc: 'Add character to your car with stylish dashboard décor and custom collectibles.', link: '/catalog?category=Car+Dashboard+Accessories' },
    { name: 'Ambient Lamps', emoji: '💡', desc: 'Modern lighting pieces that elevate your bedroom, gaming setup, workspace, or living room.', link: '/catalog?category=Ambient+Lamps' },
  ];

  return (
    <section id="categories" className="py-24 bg-warm-white border-t border-gray-200 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wider font-outfit">
            FEATURED COLLECTIONS
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-sm text-secondary font-medium">
            Explore our curated 3D-printed designs crafted for your personality.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(cat.link)}
              className="card border border-primary/20 rounded-2xl p-6 cursor-pointer group bg-white shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl select-none" role="img" aria-label={cat.name}>
                  {cat.emoji}
                </span>
                <h3 className="text-base font-black text-primary uppercase tracking-wide group-hover:text-sage transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed font-normal">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
