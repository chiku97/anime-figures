import React from 'react';
import { Flame, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-anime-darker border-t border-anime-border/40 py-12 px-6 md:px-12 font-outfit mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-anime-pink rounded shadow-neon-pink">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-manga text-xl tracking-wider text-white">HIKARI</span>
          </div>
          <p className="text-sm text-anime-textMuted leading-relaxed">
            India's ultimate haven for authentic, high-quality anime figures, statues, and limited-edition collectors' releases.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-anime-pink mb-4">Store links</h4>
          <ul className="space-y-2 text-sm text-anime-textMuted">
            <li><a href="/catalog" className="hover:text-white transition-colors">Catalog Figures</a></li>
            <li><a href="/catalog?scale=1/7" className="hover:text-white transition-colors">1/7 Scale releases</a></li>
            <li><a href="/catalog?category=Nendoroid" className="hover:text-white transition-colors">Nendoroids</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pre-orders calendar</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-anime-cyan mb-4">Customer care</h4>
          <ul className="space-y-2 text-sm text-anime-textMuted">
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Customs Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Damage Protection</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Verify Authenticity</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Seller Registration</a></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-anime-purple mb-4">Join the Club</h4>
          <p className="text-xs text-anime-textMuted leading-relaxed mb-4">
            Subscribe for notifications on drop releases, discounts, and pre-order slots.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-anime-bg border border-anime-border/60 rounded-l px-3 py-2 text-xs w-full focus:outline-none focus:border-anime-pink text-white"
            />
            <button
              type="submit"
              className="bg-anime-pink hover:bg-anime-pinkGlow px-3 py-2 rounded-r text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-anime-border/30 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-anime-textMuted">
        <p>© 2026 HIKARI. All rights reserved. Authentic Licensed Merchandise.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
